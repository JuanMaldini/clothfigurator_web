import { useEffect, useMemo, useRef, useState } from "react";
import "./controlpanel.css";
import { loadItems, saveItems, clearItems } from "./storage";

const MODELS_KEY = "controlpanel_models";
const TEXTURES_KEY = "controlpanel_textures";

const modelsAccept = [".glb", ".fbx"]; // 3D models
const texturesAccept = [".png", ".jpg", ".jpeg"]; // images

function bytesToKB(bytes) {
  return Math.max(1, Math.round(bytes / 1024));
}

function getExt(name) {
  const dot = name.lastIndexOf(".");
  return dot >= 0 ? name.slice(dot).toLowerCase() : "";
}

function dedupeBySignature(list) {
  const seen = new Set();
  return list.filter((it) => {
    const sig = `${it.name}|${it.size}|${it.type}`;
    if (seen.has(sig)) return false;
    seen.add(sig);
    return true;
  });
}

function usePanelState(storageKey) {
  const [items, setItems] = useState([]); // {id, name, size, type, ext, url?, file?}
  const [message, setMessage] = useState("");

  // Load previously accepted metadata (not blobs)
  useEffect(() => {
    const saved = loadItems(storageKey);
    if (saved?.length) setItems((curr) => dedupeBySignature([...curr, ...saved]));
  }, [storageKey]);

  // Utility to add files (from drop or picker)
  const addFiles = (fileList, allowedExts) => {
    const incoming = Array.from(fileList || []);
    if (!incoming.length) return;

    const accepted = [];
    const rejected = [];

    for (const f of incoming) {
      const ext = getExt(f.name);
      if (!allowedExts.includes(ext)) {
        rejected.push(f.name);
        continue;
      }
      const item = {
        id: crypto.randomUUID(),
        name: f.name,
        size: f.size,
        type: f.type,
        ext,
        file: f,
      };
      if (f.type.startsWith("image/")) {
        item.url = URL.createObjectURL(f);
        item.imgLoading = true;
      } else if (ext === ".fbx") {
        // Precompute object URL for FBX preview; we'll revoke on removal/clear
        item.url = URL.createObjectURL(f);
      }
      accepted.push(item);
    }

    setItems((curr) => dedupeBySignature([...curr, ...accepted]));
    if (rejected.length) setMessage(`${rejected.length} file(s) ignored by type`);
    else setMessage("");
  };

  // Accept = persist metadata only (files remain in-memory for this session)
  const accept = () => {
    const meta = items.map(({ id, name, size, type, ext }) => ({ id, name, size, type, ext }));
    saveItems(storageKey, meta);
    // Persist array of integer indices for models only (.fbx/.glb)
    const indices = items
      .filter((it) => (it.ext === ".fbx" || it.ext === ".glb") && Number.isFinite(it.index))
      .map((it) => Number(it.index));
    saveItems(`${storageKey}_indices`, indices);
    setMessage("Saved locally (metadata)");
  };

  const clear = () => {
    // Revoke any object URLs
    items.forEach((it) => it.url && URL.revokeObjectURL(it.url));
    setItems([]);
    clearItems(storageKey);
    clearItems(`${storageKey}_indices`);
    setMessage("Cleared");
  };

  const removeById = (id) => {
    setItems((curr) => {
      const it = curr.find((x) => x.id === id);
      if (it?.url) try { URL.revokeObjectURL(it.url); } catch {}
      return curr.filter((x) => x.id !== id);
    });
  };

  const markLoaded = (id) => {
    setItems((curr) => curr.map((it) => (it.id === id ? { ...it, imgLoading: false } : it)));
  };

  const setItemIndex = (id, value) => {
    const intVal = Number.parseInt(value, 10);
    setItems((curr) => curr.map((it) => (it.id === id ? { ...it, index: Number.isFinite(intVal) ? intVal : undefined } : it)));
  };

  return { items, setItems, message, setMessage, addFiles, accept, clear, removeById, markLoaded, setItemIndex };
}

function DropZone({ title, description, acceptExts, state }) {
  const inputRef = useRef(null);

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    state.addFiles(e.dataTransfer.files, acceptExts);
    e.dataTransfer.clearData();
  };
  const onDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };
  const onPick = (e) => state.addFiles(e.target.files, acceptExts);

  const acceptAttr = useMemo(() => acceptExts.join(","), [acceptExts]);

  return (
    <div className={"panel"}>
      <header className="panel-header">
        <div className="panel-titles">
          <h2 className="panel-title">{title}</h2>
          <p className="panel-desc">{description}</p>
        </div>
        <div className="panel-actions">
          <button className="btn" type="button" onClick={state.accept}>Accept</button>
          <button className="btn outline" type="button" onClick={state.clear}>Clear</button>
        </div>
      </header>

      {state.message ? <div className="panel-message">{state.message}</div> : null}

      <div
        className="dropzone"
        onDrop={onDrop}
        onDragOver={onDragOver}
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        aria-label={`Drop files or click to select (${acceptExts.join(", ")})`}
      >
        <div className="dropzone-inner">
          <span className="dz-icon" aria-hidden>＋</span>
          <span className="dz-text">Drop files here or click</span>
          <span className="dz-accept">Types: {acceptExts.join(", ")}</span>
        </div>
        <input
          ref={inputRef}
          className="hidden-input"
          type="file"
          accept={acceptAttr}
          multiple
          onChange={onPick}
        />
      </div>

      <ul className="items">
        {state.items.map((it) => (
          <li key={it.id} className="item">
            <div className="thumb">
              {it.ext === ".fbx" && it.url ? (
                <div className="thumb-loading">
                  <div className="bar" />
                </div>
              ) : it.url ? (
                <>
                  {it.imgLoading && (
                    <div className="thumb-loading">
                      <div className="bar" />
                    </div>
                  )}
                  <img
                    src={it.url}
                    alt={it.name}
                    onLoad={() => state.markLoaded(it.id)}
                    className={it.imgLoading ? "is-loading" : ""}
                  />
                </>
              ) : (
                <span className="thumb-icon" aria-hidden>■</span>
              )}
            </div>
            <div className="meta">
              <div className="name" title={it.name}>{it.name}</div>
              <div className="sub">{bytesToKB(it.size)} KB · {it.ext}</div>
            </div>
            <div className="index">
              {(it.ext === ".fbx" || it.ext === ".glb") ? (
                <input
                  className="index-input"
                  type="number"
                  step={1}
                  min={0}
                  placeholder="#"
                  value={typeof it.index === "number" ? it.index : ""}
                  onChange={(e) => state.setItemIndex(it.id, e.target.value)}
                />
              ) : null}
            </div>
            <button className="delete" type="button" aria-label="Delete" onClick={() => state.removeById(it.id)}>
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ControlPanel() {
  const models = usePanelState(MODELS_KEY);
  const textures = usePanelState(TEXTURES_KEY);

  return (
    <section className="control-panel">
      <div className="panel-grid">
        <DropZone
          title="3D Models"
          description="Drag & drop .glb or .fbx, or click to select."
          acceptExts={modelsAccept}
          state={models}
        />
        <DropZone
          title="Textures"
          description="Drag & drop .png or .jpg/.jpeg images, or click to select."
          acceptExts={texturesAccept}
          state={textures}
        />
      </div>
    </section>
  );
}
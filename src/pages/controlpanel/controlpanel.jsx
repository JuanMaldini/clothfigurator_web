import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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
    if (saved?.length)
      setItems((curr) => dedupeBySignature([...curr, ...saved]));

    // Load saved indices map and merge into items by id (fallback to name if needed)
    const savedIndices = loadItems(`${storageKey}_indices`);
    if (Array.isArray(savedIndices) && savedIndices.length) {
      setItems((curr) =>
        curr.map((it) => {
          // Support two shapes:
          // 1) legacy array of numbers (flat) — ignore for per-item mapping
          // 2) array of { id, name, indices: number[] }
          const entry = savedIndices.find(
            (e) =>
              e &&
              typeof e === "object" &&
              (e.id === it.id || e.name === it.name)
          );
          if (entry && Array.isArray(entry.indices)) {
            return { ...it, indices: entry.indices.slice(0, 50) }; // cap for safety
          }
          return it;
        })
      );
    }
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
        indices: [],
        indexDraft: "",
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
    if (rejected.length)
      setMessage(`${rejected.length} file(s) ignored by type`);
    else setMessage("");
  };

  // Accept = persist metadata only (files remain in-memory for this session)
  const accept = () => {
    const meta = items.map(({ id, name, size, type, ext }) => ({
      id,
      name,
      size,
      type,
      ext,
    }));
    saveItems(storageKey, meta);
    // Persist per-item indices for models only (.fbx/.glb)
    const indicesMap = items
      .filter(
        (it) =>
          (it.ext === ".fbx" || it.ext === ".glb") &&
          Array.isArray(it.indices) &&
          it.indices.length
      )
      .map((it) => ({
        id: it.id,
        name: it.name,
        indices: it.indices.map((n) => Number(n)),
      }));
    saveItems(`${storageKey}_indices`, indicesMap);
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
      if (it?.url)
        try {
          URL.revokeObjectURL(it.url);
        } catch {}
      return curr.filter((x) => x.id !== id);
    });
  };

  const markLoaded = (id) => {
    setItems((curr) =>
      curr.map((it) => (it.id === id ? { ...it, imgLoading: false } : it))
    );
  };

  const setIndexDraft = (id, value) => {
    // keep only digits and optional spaces/commas, but store raw; actual parse on add
    setItems((curr) =>
      curr.map((it) => (it.id === id ? { ...it, indexDraft: value } : it))
    );
  };

  const addIndexToItem = (id) => {
    setItems((curr) =>
      curr.map((it) => {
        if (it.id !== id) return it;
        const parsed = Number.parseInt(String(it.indexDraft ?? "").trim(), 10);
        if (!Number.isFinite(parsed))
          return { ...it, indexDraft: it.indexDraft };
        const next = Array.isArray(it.indices) ? it.indices.slice() : [];
        if (!next.includes(parsed)) next.push(parsed);
        next.sort((a, b) => a - b);
        return { ...it, indices: next, indexDraft: "" };
      })
    );
  };

  const removeIndexFromItem = (id, value) => {
    setItems((curr) =>
      curr.map((it) =>
        it.id === id
          ? { ...it, indices: (it.indices || []).filter((n) => n !== value) }
          : it
      )
    );
  };

  return {
    items,
    setItems,
    message,
    setMessage,
    addFiles,
    accept,
    clear,
    removeById,
    markLoaded,
    setIndexDraft,
    addIndexToItem,
    removeIndexFromItem,
  };
}

function DropZone({ title, description, acceptExts, state }) {
  const inputRef = useRef(null);
  const [openForId, setOpenForId] = useState(null);

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
          <button className="btn" type="button" onClick={state.accept}>
            Accept
          </button>
          <button className="btn outline" type="button" onClick={state.clear}>
            Clear
          </button>
        </div>
      </header>

      {state.message ? (
        <div className="panel-message">{state.message}</div>
      ) : null}

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
          <span className="dz-icon" aria-hidden>
            ＋
          </span>
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
          <li key={it.id} className="item" style={{ position: "relative" }}>
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
                <span className="thumb-icon" aria-hidden>
                  ■
                </span>
              )}
            </div>
            <div className="meta">
              <div className="name" title={it.name}>
                {it.name}
              </div>
              <div className="sub">
                {bytesToKB(it.size)} KB · {it.ext}
              </div>
            </div>
            {openForId === it.id && (
              <div
                className="index-pop"
                role="dialog"
                aria-label="Indices editor"
              >
                <div className="index-stack">
                  <div className="index-row">
                    <input
                      className="index-input"
                      type="number"
                      step={1}
                      min={0}
                      placeholder="#"
                      value={it.indexDraft ?? ""}
                      onChange={(e) =>
                        state.setIndexDraft(it.id, e.target.value)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          state.addIndexToItem(it.id);
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="btn small ghost"
                      onClick={() => state.addIndexToItem(it.id)}
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className="btn small"
                      onClick={() => setOpenForId(null)}
                    >
                      Done
                    </button>
                  </div>
                  {!!(it.indices && it.indices.length) && (
                    <div className="index-chips">
                      {it.indices.map((num) => (
                        <span key={num} className="chip" title={`Index ${num}`}>
                          {num}
                          <button
                            type="button"
                            className="chip-x"
                            aria-label={`Remove ${num}`}
                            onClick={() =>
                              state.removeIndexFromItem(it.id, num)
                            }
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
            <div className="index">
              {it.ext === ".fbx" || it.ext === ".glb" ? (
                <button
                  className="icon-btn"
                  type="button"
                  aria-label="Set indices"
                  aria-expanded={openForId === it.id}
                  onClick={() =>
                    setOpenForId(openForId === it.id ? null : it.id)
                  }
                >
                  #
                </button>
              ) : null}
            </div>
            <button
              className="delete"
              type="button"
              aria-label="Delete"
              onClick={() => state.removeById(it.id)}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ControlPanel() {
  const navigate = useNavigate();
  const models = usePanelState(MODELS_KEY);
  const textures = usePanelState(TEXTURES_KEY);

  const selector = [
    {
      id: 1,
      label: "Clothfigurator",
      src: "/projects/clothfiguraor/clothfigurator.png",
      path: "/vclothfigurator",
    },
    {
      id: 2,
      label: "Office",
      src: "/projects/v_office_01/office_01.png",
      path: "/voffice01",
    },
    {
      id: 3,
      label: "Podfigurador",
      src: "/projects/v_configurator_01/v_configurator_01.png",
      path: "/vconfigurator",
    },
  ];

  const [selected, setSelected] = useState(1);

  const isEnabled = selected === 1;
  const selectedOption = selector.find((opt) => opt.id === selected);
  const canLaunch = Boolean(selectedOption?.path);

  const handleSelect = (id) => {
    if (id === selected) return;
    // Clear both panels when switching selection
    try {
      models.clear();
    } catch {}
    try {
      textures.clear();
    } catch {}
    setSelected(id);
  };

  return (
    <section className="control-panel">
      <div className="selector-grid" role="group" aria-label="Selector de modo">
        {selector.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={`selector-tile${selected === opt.id ? " is-selected" : ""}`}
            onClick={() => handleSelect(opt.id)}
            aria-pressed={selected === opt.id}
            title={opt.label}
          >
            <img src={opt.src} alt={opt.label} />
            <span className="selector-label">{opt.label}</span>
          </button>
        ))}
      </div>

      <div
        className={`panel-grid${!isEnabled ? " is-disabled" : ""}`}
        aria-disabled={!isEnabled}
      >
        <div className="panel-wrap">
          {!isEnabled && <div className="panel-overlay" aria-hidden />}
          <DropZone
            title="3D Models"
            description="Drag & drop models down here."
            acceptExts={modelsAccept}
            state={models}
          />
        </div>
        <div className="panel-wrap">
          {!isEnabled && <div className="panel-overlay" aria-hidden />}
          <DropZone
            title="Textures"
            description="Drag & drop images down here."
            acceptExts={texturesAccept}
            state={textures}
          />
        </div>
      </div>

      {/* bottom mini section: texto | texto | Launch */}
      <div className="launch-section">
        <div className="launch-grid">
          <div className="launch-col">Texto 1</div>
          <div className="launch-col">Texto 2</div>
          <div className="launch-col end">
            <button
              className="btn launch-btn"
              type="button"
              onClick={() => {
                if (canLaunch) navigate(selectedOption.path);
              }}
              disabled={!canLaunch}
              aria-disabled={!canLaunch}
            >
              Launch
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

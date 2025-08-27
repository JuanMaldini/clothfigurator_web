import React, { useState, useEffect, useCallback } from "react";
import { generateConfiguratorPDF } from "../pdfConfigurator/pdfGenerator";
import ColorTint, {
  getCurrentTint,
  subscribeTint,
} from "../colorTint/colorTint";
import "./Sidepanel.css";
interface VariationMessage {
  type: "variation-select";
  collection: string;
  subcollection: string;
  variation: string;
  tint?: string;
}

// Construye el objeto de mensaje
function buildVariationMessage(
  collection: string,
  subcollection: string,
  variation: string,
  tint?: string
): VariationMessage {
  return {
    type: "variation-select",
    collection,
    subcollection,
    variation,
    tint,
  };
}

// Serializa (si quisieras mutar formato/orden centralizas aquí)
function serializeVariationMessage(msg: VariationMessage): string {
  return JSON.stringify(msg);
}

//TINT
// Panel deslizante ligero sin dependencias externas para evitar duplicados de React.
const Sidepanel = () => {
  const [open, setOpen] = useState(false);
  // Color tint sincronizado globalmente
  const [tint, setTint] = useState(getCurrentTint());
  const [tintOpen, setTintOpen] = useState(false);
  useEffect(() => {
    const unsubscribe = subscribeTint(setTint);
    return () => {
      unsubscribe();
    };
  }, []);
  // referencia ligera para evitar warning si todavía no se usa
  // eslint-disable-next-line no-unused-expressions
  tint;

  // Evita scroll de fondo cuando está abiertoEmitUIInteraction
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="sp-root">
      {!open && (
        <button
          className="sp-export-btn sp-panel-open-btn"
          onClick={() => setOpen(true)}
        >
          Open
        </button>
      )}
      {open && <div className="sp-backdrop" onClick={() => setOpen(false)} />}
      <div className={`sp-panel ${open ? "open" : ""}`}>
        <div className="sp-header">
          <strong>Configurat System</strong>
          <div onClick={() => setOpen(false)} className="sp-export-btn">
            Close
          </div>
        </div>
        <div className="sp-body" id="sp-body">
          <section className="sp-export-section">
            <div className="sp-export-row"></div>
          </section>

          <section className="sp-section">
            <div className="sp-row">
              <button
                type="button"
                className={`sp-collapsible-header${tintOpen ? " is-open" : ""}`}
                onClick={() => setTintOpen((o) => !o)}
              >
                <span className="sp-collapsible-title">Tint</span>
                <span
                  className="sp-tint-reset"
                  onClick={(e) => {
                    e.stopPropagation();
                    setTint("#ffffffff");
                  }}
                >
                  ⟳
                </span>
              </button>
              <div className="sp-export-actions">
                <button
                  className="sp-export-btn"
                  title="Download a pdf with all information"
                  onClick={() => generateConfiguratorPDF("sp-body")}
                >
                  Export
                </button>
                <button
                  className="sp-export-btn"
                  title="Take a screenshot of the current view DISABLED"
                >
                  Screenshoot
                </button>
              </div>
            </div>
            <div className={`sp-collapsible-body${tintOpen ? " open" : ""}`}>
              <ColorTint />
            </div>
          </section>

          <section>
            <ConfiguratorPanel />
          </section>
        </div>
        <div className="sp-footer">Soy el pie del panel</div>
      </div>
    </div>
  );
};

interface RawVariation {
  value?: string;
  /** normalized keys */
  "variation-name"?: string;
  "variation-pattern"?: string;
  "variation-image"?: string;
  /** legacy keys */
  label?: string;
  code?: string;
  image?: string;
}

interface RawVariationSubcollection {
  name?: string;
  "subcollection-name"?: string;
  variation?: Array<string | RawVariation>;
  variations?: Array<string | RawVariation>;
}

interface RawCollection {
  collection?: string;
  "collection-name"?: string;
  name?: string;
  subcollection?: RawVariationSubcollection[];
  subcollections?: RawVariationSubcollection[];
}

interface NormalizedSubcollection {
  name: string;
  description?: string;
  variations: NormalizedVariation[];
}
interface NormalizedCollection {
  name: string;
  subcollections: NormalizedSubcollection[];
}

interface NormalizedVariation {
  label: string;
  imageThumbnail?: string;
  color?: string;
  pattern?: string;
  name?: string;
}

const composeVariationString = (v: any): string => {
  if (typeof v === "string") return v.trim();
  if (!v || typeof v !== "object") return "";
  if (v.value) return String(v.value).trim();
  const name = (v["variation-name"] || v.label || "").trim();
  const code = (v["variation-pattern"] || v.code || "").trim();
  if (name && code) return code.includes(name) ? name : `${name} ${code}`;
  return (name || code || "").trim();
};

const normalizeData = (raw: RawCollection[]): NormalizedCollection[] =>
  (raw || [])
    .map((r) => {
      const name = (
        r["collection-name"] || r.collection || r.name || "Unnamed"
      ).trim();
      const subcollections = (
        (r.subcollections || r.subcollection || []) as RawVariationSubcollection[]
      ).map((s) => {
        const subName = (s["subcollection-name"] || s.name || "Unnamed").trim();
        const description = (s as any)["subcollection-description"]
          ? String((s as any)["subcollection-description"]).trim()
          : undefined;
        const rawVars = (s.variations || s.variation || []) as Array<
          string | RawVariation
        >;
        const variations = rawVars
          .map((v) => {
            if (typeof v === "string") {
              const label = v.trim();
              return label
                ? ({ label, name: label } as NormalizedVariation)
                : null;
            }
            if (!v || typeof v !== "object") return null;
            const obj = v as RawVariation & { [k: string]: any };
            const vname = (obj["variation-name"] || obj.label || "").trim();
            const label = composeVariationString(obj);
            if (!label) return null;
            const imageThumbnail =
              (obj as any)["variation-image-thumbnail"] || obj.image || undefined;
            const color = (obj as any)["variation-color"] || undefined;
            const pattern = obj["variation-pattern"] || obj.code || undefined;
            return {
              label,
              imageThumbnail,
              color,
              pattern,
              name: vname,
            } as NormalizedVariation;
          })
          .filter(Boolean) as NormalizedVariation[];
        return { name: subName, description, variations } as NormalizedSubcollection;
      });
      return { name, subcollections } as NormalizedCollection;
    })
    .filter((c) => c.subcollections.length);

const ConfiguratorPanel: React.FC = () => {
  const [data, setData] = useState<NormalizedCollection[]>([]);
  const [colIndex, setColIndex] = useState(0);
  const [subName, setSubName] = useState<string | null>(null);

  // Render helper: first word in bold
  const renderDesc = useCallback((desc?: string) => {
    if (!desc) return null;
    const m = desc.match(/^\s*(\S+)([\s\S]*)$/);
    if (!m) return desc;
    return (
      <>
        <strong>{m[1]}</strong>
        {m[2]}
      </>
    );
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        // Único JSON con ruta estática para que Vite lo incluya en el build
        const url = new URL("./collections.json", import.meta.url).href;
        const res = await fetch(url, { cache: "no-cache" });
        if (!res.ok) throw new Error("No collections JSON found");
        const json = (await res.json()) as RawCollection[];

        if (!alive) return;
        const norm = normalizeData(json);
        setData(norm);
        setColIndex(0);
        setSubName(norm[0]?.subcollections[0]?.name || null);
      } catch (e) {
        if (process.env.NODE_ENV !== "production") {
          // eslint-disable-next-line no-console
          console.warn("[Configurator] load error", e);
        }
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const current = data[colIndex];
  const subcollections = current?.subcollections || [];
  const currentSub =
    subcollections.find((s) => s.name === subName) || subcollections[0] || null;
  // Variations normalizadas preservando label, thumbnail y color
  const variations = currentSub?.variations || [];

  const selectCollection = useCallback(
    (idx: number) => {
      setColIndex(idx);
      setSubName(data[idx]?.subcollections[0]?.name || null);
    },
    [data]
  );

  const sendVariation = (variation: string) => {
    if (!current || !subName) return;
    // Construye y envía el JSON al Pixel Streaming usando el puente global expuesto por ArcwarePlayer
    try {
      const payload = serializeVariationMessage(
        buildVariationMessage(current.name, subName, variation)
      );
      // Prefiere la función global expuesta por ArcwarePlayer
      if (typeof sendUIInteraction === "function") {
        sendUIInteraction(payload);
      } else if ((window as any).emitUIInteraction) {
        (window as any).emitUIInteraction(payload);
      }
      //PRINT payload TO CONSOLE
      console.log(payload);
    } catch {
      // ignore
    }
  };

  return (
    <div aria-label="Configurador" className="cc-root">
      <div className="cc-collections-row">
        <h2 className="cc-section-title">Collections</h2>
        <label className="cc-collection-label" htmlFor="collection-select">
          <select
            id="collection-select"
            className="cc-collection-dropdown"
            value={data.length ? colIndex : ""}
            onChange={(e) => selectCollection(Number(e.target.value))}
            disabled={!data.length}
            aria-label="Collections"
          >
            {!data.length && (
              <option value="" disabled>
                Loading…
              </option>
            )}
            {data.map((c, i) => (
              <option key={c.name} value={i}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <div className="cc-subcollections">
          {subcollections.map((sc) => (
            <button
              key={sc.name}
              type="button"
              className={`cc-sub-btn${
                sc.name === subName ? " is-selected" : ""
              }`}
              onClick={() => setSubName(sc.name)}
              aria-current={sc.name === subName || undefined}
            >
              {sc.name}
            </button>
          ))}
        </div>
        <div>{/*subcollection-description*/}</div>
      </div>
      {currentSub?.description ? (
        <div className="cc-sub-desc" aria-live="polite">
          {renderDesc(currentSub.description)}
        </div>
      ) : null}
      <div>
        <div className="cc-var-grid" aria-label="Variaciones">
          {variations.map((v, idx) => {
            const label = v.label;
            const img = v.imageThumbnail || "";
            const color = v.color || "#eee";
            const tooltip =
              v.name && v.pattern ? `${v.name} ${v.pattern}` : label;
            return (
              <button
                key={label + idx}
                type="button"
                className="cc-var-box"
                data-label={tooltip}
                onClick={() => sendVariation(label)}
                style={!img ? { background: color } : {}}
              >
                {img ? (
                  <span className="cc-var-img">
                    <img src={img} alt={label} />
                  </span>
                ) : label ? (
                  <span style={{ fontSize: "10px" }}>{label}</span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Sidepanel;

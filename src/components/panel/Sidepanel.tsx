import React, { useState, useEffect, useCallback, useMemo } from "react";
import { generateConfiguratorPDF } from "../pdfConfigurator/pdfGenerator";
import ColorTint from "../colorTint/colorTint";
import "./Sidepanel.css";

declare global {
  interface Window {
    emitUIInteraction?: (payload: string) => void;
  }
}

function stripAccents(text: string): string {
  return text
    .normalize("NFKD")
    .split("")
    .filter((ch) => !(ch as any).match(/\p{M}/u))
    .join("");
}

function sanitizeToken(input?: string): string {
  if (!input) return "";
  let t = stripAccents(String(input).trim());
  t = t.replace(/\s+/g, "-");
  t = t.replace(/[^A-Za-z0-9-]/g, "");
  t = t.replace(/-{2,}/g, "-");
  t = t.replace(/^-+|-+$/g, "");
  return t.toUpperCase();
}

function buildMaterialInstanceName(
  collectionName?: string,
  subcollectionName?: string,
  variationName?: string,
  variationPattern?: string
): string {
  const collTok = sanitizeToken(collectionName);
  const subTok = sanitizeToken(subcollectionName);
  let varRaw = "";
  if (variationName && variationPattern)
    varRaw = `${variationName}-${variationPattern}`;
  else varRaw = variationName || variationPattern || "";
  const varTok = sanitizeToken(varRaw);
  if (!(collTok && subTok && varTok)) return "";
  return `MI_${collTok}_${subTok}_${varTok}`;
}

const sendToUE = (data: any) => {
  window.emitUIInteraction?.(data);
  console.log(data);
};

const Sidepanel = () => {
  const [open, setOpen] = useState(false);
  const [tintOpen, setTintOpen] = useState(false);

  const handleExport = useCallback(() => {
    try {
      generateConfiguratorPDF("sp-body");
    } catch (e) {
      try {
        window.print();
      } catch {}
    }
  }, []);

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
              </button>
              <div className="sp-export-actions">
                <button
                  className="sp-export-btn"
                  title="Download a pdf with all information"
                  onClick={handleExport}
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
      </div>
    </div>
  );
};

interface RawVariation {
  value?: string;
  "variation-name"?: string;
  "variation-pattern"?: string;
  "variation-image"?: string;
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
        r["collection-name"] ||
        r.collection ||
        r.name ||
        "Unnamed"
      ).trim();
      const subcollections = (
        (r.subcollections ||
          r.subcollection ||
          []) as RawVariationSubcollection[]
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
              (obj as any)["variation-image-thumbnail"] ||
              obj.image ||
              undefined;
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
        return {
          name: subName,
          description,
          variations,
        } as NormalizedSubcollection;
      });
      return { name, subcollections } as NormalizedCollection;
    })
    .filter((c) => c.subcollections.length);

interface ConfiguratorPanelProps {
}
const ConfiguratorPanel: React.FC<ConfiguratorPanelProps> = () => {
  const [data, setData] = useState<NormalizedCollection[]>([]);
  // Unificado: índice de colección y subcolección seleccionada
  const [selection, setSelection] = useState<{ colIndex: number; subName: string | null }>({ colIndex: 0, subName: null });
  const [selectedVarBySub, setSelectedVarBySub] = useState<
    Record<string, string | null>
  >({});

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
        const url = new URL("./collections.json", import.meta.url).href;
        const res = await fetch(url, { cache: "no-cache" });
        if (!res.ok) throw new Error("No collections JSON found");
        const json = (await res.json()) as RawCollection[];

        if (!alive) return;
        const norm = normalizeData(json);
  setData(norm);
  setSelection({ colIndex: 0, subName: norm[0]?.subcollections[0]?.name || null });
      } catch (e) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("[Configurator] load error", e);
        }
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const current = useMemo(() => data[selection.colIndex], [data, selection.colIndex]);
  const subcollections = useMemo(
    () => current?.subcollections || [],
    [current]
  );
  const currentSub = useMemo(() => {
    if (!subcollections.length) return null;
    if (selection.subName && subcollections.some(s => s.name === selection.subName)) {
      return subcollections.find(s => s.name === selection.subName) || null;
    }
    return subcollections[0] || null;
  }, [subcollections, selection.subName]);
  const variations = useMemo(() => currentSub?.variations || [], [currentSub]);

  const selectCollection = useCallback((idx: number) => {
    const first = data[idx]?.subcollections[0]?.name || null;
    setSelection({ colIndex: idx, subName: first });
    if (first) {
      setSelectedVarBySub(m => ({ ...m, [first]: null }));
    }
  }, [data]);

  const sendVariation = (variation: NormalizedVariation) => {
    if (!current || !selection.subName) return;
    try {
      const miName = buildMaterialInstanceName(
        current.name,
        selection.subName,
        variation.name,
        variation.pattern
      );
      if (!miName) return;
      sendToUE({ "material-change": miName });
      setSelectedVarBySub((m) => ({ ...m, [selection.subName as string]: variation.label }));
    } catch {}
  };

  return (
    <div aria-label="Configurador" className="cc-root">
      <div className="cc-collections-row">
        <h2 className="cc-section-title">Collections</h2>
        <label className="cc-collection-label" htmlFor="collection-select">
          <select
            id="collection-select"
            className="cc-collection-dropdown"
            value={data.length ? selection.colIndex : ""}
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
                sc.name === selection.subName ? " is-selected" : ""
              }`}
              onClick={() => setSelection(s => ({ ...s, subName: sc.name }))}
              aria-current={sc.name === selection.subName || undefined}
            >
              {sc.name}
            </button>
          ))}
        </div>
        <div></div>
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
            const tooltip =
              v.name && v.pattern ? `${v.name} ${v.pattern}` : label;
      const isSelected = selectedVarBySub[selection.subName || ""] === label;
            return (
              <button
                key={label + idx}
                type="button"
        className={`cc-var-box${isSelected ? " is-selected" : ""}`}
                data-label={tooltip}
                onClick={() => sendVariation(v)}
              >
                {img ? (
                  <span className="cc-var-img">
                    <img src={img} alt={tooltip} loading="lazy" />
                  </span>
                ) : label ? (
                  <span className="cc-var-img cc-var-fallback" aria-hidden>
                    {label}
                  </span>
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

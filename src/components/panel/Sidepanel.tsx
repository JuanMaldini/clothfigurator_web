import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
// RxDotsHorizontal
// import { ExportPDFButton } from "../pdfConfigurator/pdfGenerator";
import ColorTint from "../colorTint/colorTint";
import { RxReset } from "react-icons/rx";
import { sendUE } from "../arcware/ps-functions";
import { triggerScreenshot } from "../screenshot/screenshot";
import "./Sidepanel.css";
import { setCurrentVariation } from "../../state/currentVariation";
import { buildMaterialInstanceName } from "../../utils/text";
import { LiaTintSolid } from "react-icons/lia";
// import { importModel, importTexture } from "./importActions";

declare global {
  interface Window {
    emitUIInteraction?: (payload: unknown) => void;
  }
}
interface SidepanelProps {
  onRequestClose?: () => void;
  showClose?: boolean;
  heading?: string;
  data: RawCollection[];
}
const Sidepanel: React.FC<SidepanelProps> = ({
  onRequestClose,
  showClose = true,
  heading = "Configurator System",
  data,
}) => {
  const [tintOpen, setTintOpen] = useState(false);
  const [tintResetCounter, setTintResetCounter] = useState(0);
  return (
    <div className="sp-panel sp-panel-embedded open">
      <div className="sp-header">
        <strong>{heading}</strong>
        {showClose && (
          <div
            onClick={onRequestClose}
            className="nobuttonstyle"
            role="button"
            tabIndex={0}
          >
            X
          </div>
        )}
      </div>
      <div className="sp-body" id="sp-body">
        <section className="sp-section">
          <div className="altura  sp-row">
            <div className="tint-header-wrap">
              <button
                type="button"
                className={`cc-sub-btn nowrap ${tintOpen ? " is-open" : ""}`}
                onClick={() => setTintOpen((o) => !o)}
              >
                <span className="sp-title cursorpointer">Tint</span>
                <LiaTintSolid />
              </button>
              <button
                type="button"
                className="nobuttonstyle nowrap "
                aria-label="Reset tint to white"
                title="Reset tint to white"
                onClick={() => setTintResetCounter((c) => c + 1)}
              >
                <RxReset />
              </button>
            </div>
            <div className="sp-export-actions">
              {/*}
              <ExportPDFButton className="nobuttonstyle" mode="screenshot" />
              */}
              <button
                className="cc-sub-btn"
                title="Take a screenshot of the current view"
                onClick={triggerScreenshot}
              >
                Render
              </button>
            </div>
          </div>
          <div className={`sp-collapsible-body${tintOpen ? " open" : ""}`}>
            <ColorTint resetCounter={tintResetCounter} />
          </div>
        </section>
        <div className="separatorSection"></div>
        <section>
          <ConfiguratorPanel raw={data} />
        </section>
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
  image?: string;
  variations: NormalizedVariation[];
}
interface NormalizedCollection {
  name: string;
  subcollections: NormalizedSubcollection[];
}
interface NormalizedVariation {
  label: string;
  imageThumbnail?: string;
  imageLarge?: string;
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
        const image =
          (s as any)["subcollection-image"] ||
          (s as any)["subcollection-image-thumbnail"] ||
          (s as any).image ||
          undefined;
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
            const imageLarge =
              (obj as any)["variation-image"] ||
              (obj as any)["image-large"] ||
              obj.image ||
              imageThumbnail ||
              undefined;
            const color = (obj as any)["variation-color"] || undefined;
            const pattern = obj["variation-pattern"] || obj.code || undefined;
            return {
              label,
              imageThumbnail,
              imageLarge,
              color,
              pattern,
              name: vname,
            } as NormalizedVariation;
          })
          .filter(Boolean) as NormalizedVariation[];
        return {
          name: subName,
          description,
          image,
          variations,
        } as NormalizedSubcollection;
      });
      return { name, subcollections } as NormalizedCollection;
    })
    .filter((c) => c.subcollections.length);

interface ConfiguratorPanelProps {
  raw: RawCollection[];
}

const ConfiguratorPanel: React.FC<ConfiguratorPanelProps> = ({ raw }) => {
  const data = useMemo(() => normalizeData(raw), [raw]);
  // Unificado: índice de colección y subcolección seleccionada
  const [selection, setSelection] = useState<{
    colIndex: number;
    subName: string | null;
  }>({ colIndex: 0, subName: null });
  const [selectedVarBySub, setSelectedVarBySub] = useState<
    Record<string, string | null>
  >({});
  const renderDesc = useCallback((desc?: string, subName?: string) => {
    if (!desc) return null;
    if (!subName) return desc;
    // Bold all whole-word occurrences of the subcollection name (case-insensitive)
    const escapeRegExp = (s: string) =>
      s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`\\b(${escapeRegExp(subName)})\\b`, "gi");
    const parts: React.ReactNode[] = [];
    let last = 0;
    let idx = 0;
    desc.replace(re, (match, _g1, offset: number) => {
      if (last < offset) parts.push(desc.slice(last, offset));
      parts.push(
        <strong key={`h-${idx++}`}>
          {desc.slice(offset, offset + match.length)}
        </strong>
      );
      last = offset + match.length;
      return match;
    });
    if (!parts.length) return desc; // No matches
    if (last < desc.length) parts.push(desc.slice(last));
    return <>{parts}</>;
  }, []);
  // set default selection when data changes
  useEffect(() => {
    if (!data.length) return;
    setSelection({
      colIndex: 0,
      subName: data[0]?.subcollections[0]?.name || null,
    });
  }, [data]);
  const current = useMemo(
    () => data[selection.colIndex],
    [data, selection.colIndex]
  );
  const subcollections = useMemo(
    () => current?.subcollections || [],
    [current]
  );
  const currentSub = useMemo(() => {
    if (!subcollections.length) return null;
    if (
      selection.subName &&
      subcollections.some((s) => s.name === selection.subName)
    ) {
      return subcollections.find((s) => s.name === selection.subName) || null;
    }
    return subcollections[0] || null;
  }, [subcollections, selection.subName]);
  const variations = useMemo(() => currentSub?.variations || [], [currentSub]);
  const selectedLabel = selectedVarBySub[selection.subName || ""] || null;
  const selectedVar = useMemo(() => {
    if (!selectedLabel) return null;
    return variations.find((v) => v.label === selectedLabel) || null;
  }, [variations, selectedLabel]);
  // Popover menu for more actions (no functionality yet)
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLSpanElement | null>(null);
  const selectCollection = useCallback(
    (idx: number) => {
      const first = data[idx]?.subcollections[0]?.name || null;
      setSelection({ colIndex: idx, subName: first });
      // La selección de la primera variación se maneja en un useEffect al cambiar la subcolección
    },
    [data]
  );
  const sendVariation = (variation: NormalizedVariation) => {
    if (!current || !selection.subName) return;
    try {
      // Persist current variation context for naming screenshots, etc.
      setCurrentVariation({
        collection: current.name,
        subcollection: selection.subName,
        variation: variation.name || variation.label,
        pattern: variation.pattern,
      });

      const miName = buildMaterialInstanceName(
        current.name,
        selection.subName,
        variation.name,
        variation.pattern
      );
      if (!miName) return;
      sendUE({ "material-change": miName });
      setSelectedVarBySub((m) => ({
        ...m,
        [selection.subName as string]: variation.label,
      }));
    } catch {}
  };
  // Al cambiar de subcolección, autoseleccionar la primera variación disponible
  // y disparar la misma lógica de selección (incluye envío a Unreal)
  useEffect(() => {
    if (!selection.subName) return;
    const first = variations[0];
    if (!first) return;
    // Ensure state is captured for initial default selection as well
    setCurrentVariation({
      collection: current?.name,
      subcollection: selection.subName,
      variation: first.name || first.label,
      pattern: first.pattern,
    });
    sendVariation(first);
  }, [selection.subName, variations]);

  // Close menu when selection changes
  useEffect(() => {
    setMoreOpen(false);
  }, [selectedVar?.label, selection.subName]);

  // Close on outside click and on Escape
  useEffect(() => {
    if (!moreOpen) return;
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node | null;
      if (moreRef.current && target && !moreRef.current.contains(target)) {
        setMoreOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMoreOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [moreOpen]);

  return (
    <div aria-label="Configurador" className="cc-root">
      <div className="cc-collections-row">
        <h2 className="sp-title">Collections</h2>
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
              onClick={() => setSelection((s) => ({ ...s, subName: sc.name }))}
              aria-current={sc.name === selection.subName || undefined}
            >
              {sc.name}
            </button>
          ))}
        </div>
        <div></div>
      </div>

{/*
}
      {selectedVar ? (
        <div className="cc-var-selected" aria-live="polite">
          <span className="cc-var-selected-name">
            {selectedVar.name || selectedVar.label}
          </span>
          {selectedVar.pattern ? (
            <span className="cc-var-selected-pattern">
              {" "}
              {selectedVar.pattern}
            </span>
          ) : null}

          <span className="cc-more" ref={moreRef}>
            <button
              type="button"
              className="cc-icon-btn"
              title="Más opciones"
              aria-label="Más opciones"
              aria-haspopup="menu"
              aria-expanded={moreOpen}
              aria-controls="cc-more-menu"
              onClick={() => setMoreOpen((o) => !o)}
            >
              <RxDotsHorizontal />
            </button>
            {moreOpen ? (
              <div className="cc-more-menu" role="menu" id="cc-more-menu">
                <button
                  type="button"
                  className="cc-more-item"
                  role="menuitem"
                  onClick={async () => {
                    await importModel();
                    setMoreOpen(false);
                  }}
                >
                  Import Model
                </button>
                <button
                  type="button"
                  className="cc-more-item"
                  role="menuitem"
                  onClick={async () => {
                    await importTexture();
                    setMoreOpen(false);
                  }}
                >
                  Import Texture
                </button>
              </div>
            ) : null}
          </span>

        </div>
      ) : null}
*/}

      <div>
        <div className="cc-var-grid" aria-label="Variaciones">
          {variations.map((v, idx) => {
            const label = v.label;
            const img = v.imageThumbnail || "";
            const tooltip =
              v.name && v.pattern ? `${v.name} ${v.pattern}` : label;
            const isSelected =
              selectedVarBySub[selection.subName || ""] === label;
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

      {currentSub?.description ? (
        <div className="cc-sub-desc" aria-live="polite">
          {renderDesc(currentSub.description, currentSub.name)}
        </div>
      ) : null}

      {selectedVar?.imageLarge ? (
        <div className="cc-var-preview">
          <div className="cc-var-preview-img-wrap">
            <img src={selectedVar.imageLarge} alt={selectedVar.label} />
          </div>
        </div>
      ) : null}
    </div>
  );
};
export default Sidepanel;

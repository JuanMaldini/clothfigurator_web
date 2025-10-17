import React, { useState, useEffect, useMemo, useCallback } from "react";
import { ExportPDFButton } from "./pdfConfigurator/pdfGenerator";
import ColorTint from "./colorTint/colorTint";
import { RxReset } from "react-icons/rx";
import { sendUE } from "./arcware/ps-functions";
import { triggerScreenshot } from "./screenshot/screenshot";
import "./Sidepanel.css";
import { setCurrentVariation } from "./utils/currentVariation";
import { buildMaterialInstanceName } from "./utils/text";
import { LiaTintSolid } from "react-icons/lia";
import EntitiesPanel from "./entities/EntitiesPanel";

declare global {
  interface Window {
    emitUIInteraction?: (payload: unknown) => void;
  }
}
interface SidepanelProps {
  heading?: string;
  textures: RawCollection[];
  models: RawModelCollection[];
}
const Sidepanel: React.FC<SidepanelProps> = ({
  heading = "Configurator System",
  textures,
  models,
}) => {
  const [tintOpen, setTintOpen] = useState(false);
  const [tintResetCounter, setTintResetCounter] = useState(0);
  return (
    <div className="sp-panel">
      <div className="sp-header">
        <strong>{heading}</strong>
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
              <ExportPDFButton className="nobuttonstyle" mode="screenshot" />
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
          <ConfiguratorPanel raw={textures} />
        </section>
        <div className="separatorSection"></div>
        <section>
          <ConfiguratorPanelModels raw={models} />
        </section>
        <section>
          <EntitiesPanel />
        </section>
      </div>
    </div>
  );
};

interface RawCollectionImage {
  "collection-image-name"?: string;
  "collection-image-url"?: string;
}
interface RawCollection {
  collection?: string;
  "collection-name"?: string;
  name?: string;
  "collection-images"?: RawCollectionImage[];
}
interface RawModelItem {
  "collection-model-name"?: string;
  "collection-model-url"?: string;
}
interface RawModelCollection {
  collection?: string;
  "collection-name"?: string;
  name?: string;
  "collection-models"?: RawModelItem[];
}
interface NormalizedVariation {
  label: string;
  imageThumbnail?: string;
  name?: string;
}
interface NormalizedCollection {
  name: string;
  variations: NormalizedVariation[];
}

const normalizeData = (raw: RawCollection[]): NormalizedCollection[] =>
  (raw || [])
    .map((r) => {
      const name = (
        r["collection-name"] ||
        r.collection ||
        r.name ||
        "Unnamed"
      ).trim();
      const variations = (r["collection-images"] || [])
        .map((img) => {
          const label = (img["collection-image-name"] || "").trim();
          const url = (img["collection-image-url"] || "").trim();
          if (!label && !url) return null;
          return {
            label: label || url,
            name: label || url,
            imageThumbnail: url || undefined,
          } as NormalizedVariation;
        })
        .filter(Boolean) as NormalizedVariation[];
      return { name, variations } as NormalizedCollection;
    })
    .filter((c) => c.variations.length);

const normalizeModelsData = (raw: RawModelCollection[]): NormalizedCollection[] =>
  (raw || [])
    .map((r) => {
      const name = (
        r["collection-name"] ||
        r.collection ||
        r.name ||
        "Unnamed"
      ).trim();
      const variations = (r["collection-models"] || [])
        .map((mdl) => {
          const label = (mdl["collection-model-name"] || "").trim();
          const url = (mdl["collection-model-url"] || "").trim();
          if (!label && !url) return null;
          return {
            label: label || url,
            name: label || url,
            imageThumbnail: url || undefined,
          } as NormalizedVariation;
        })
        .filter(Boolean) as NormalizedVariation[];
      return { name, variations } as NormalizedCollection;
    })
    .filter((c) => c.variations.length);

interface ConfiguratorPanelProps {
  raw: RawCollection[];
}

const ConfiguratorPanel: React.FC<ConfiguratorPanelProps> = ({ raw }) => {
  const data = useMemo(() => normalizeData(raw), [raw]);
  const [selection, setSelection] = useState<{ colIndex: number }>({ colIndex: 0 });
  const [selectedVarByCollection, setSelectedVarByCollection] = useState<
    Record<string, string | null>
  >({});
  
  useEffect(() => {
    if (!data.length) return;
    setSelection({ colIndex: 0 });
  }, [data]);
  const current = useMemo(() => data[selection.colIndex], [data, selection.colIndex]);
  const variations = useMemo(() => current?.variations || [], [current]);
  // Track selection via map only; derived vars not used
  const selectCollection = useCallback((idx: number) => {
    setSelection({ colIndex: idx });
  }, [data]);
  const sendVariation = (variation: NormalizedVariation) => {
    if (!current) return;
    try {
      setCurrentVariation({
        collection: current.name,
        variation: variation.name || variation.label,
      });

      const miName = buildMaterialInstanceName(
        current.name,
        current.name,
        variation.name
      );
      if (!miName) return;
      sendUE({ "material-change": miName });
      setSelectedVarByCollection((m) => ({
        ...m,
        [current.name]: variation.label,
      }));
    } catch {}
  };
  useEffect(() => {
    const first = variations[0];
    if (!first) return;
    setCurrentVariation({
      collection: current?.name,
      variation: first.name || first.label,
    });
    sendVariation(first);
  }, [selection.colIndex, current?.name, variations]);


  return (
    <div aria-label="Configurador" className="cc-root">
      <div className="cc-collections-row">
        <h2 className="sp-title">Textures</h2>
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
        <div className="cc-var-grid" aria-label="Variaciones">
          {variations.map((v, idx) => {
            const label = v.label;
            const img = v.imageThumbnail || "";
            const tooltip = v.name ? v.name : label;
            const isSelected = selectedVarByCollection[current?.name || ""] === label;
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

interface ConfiguratorPanelModelsProps {
  raw: RawModelCollection[];
}

const ConfiguratorPanelModels: React.FC<ConfiguratorPanelModelsProps> = ({ raw }) => {
  const data = useMemo(() => normalizeModelsData(raw), [raw]);
  const [selection, setSelection] = useState<{ colIndex: number }>({ colIndex: 0 });
  const [selectedVarByCollection, setSelectedVarByCollection] = useState<
    Record<string, string | null>
  >({});

  useEffect(() => {
    if (!data.length) return;
    setSelection({ colIndex: 0 });
  }, [data]);
  const current = useMemo(() => data[selection.colIndex], [data, selection.colIndex]);
  const variations = useMemo(() => current?.variations || [], [current]);
  // Track selection via map only; derived vars not used
  const selectCollection = useCallback((idx: number) => {
    setSelection({ colIndex: idx });
  }, [data]);
  const sendVariation = (variation: NormalizedVariation) => {
    if (!current) return;
    try {
      setCurrentVariation({
        collection: current.name,
        variation: variation.name || variation.label,
      });

      const miName = buildMaterialInstanceName(
        current.name,
        current.name,
        variation.name
      );
      if (!miName) return;
      sendUE({ "material-change": miName });
      setSelectedVarByCollection((m) => ({
        ...m,
        [current.name]: variation.label,
      }));
    } catch {}
  };
  useEffect(() => {
    const first = variations[0];
    if (!first) return;
    setCurrentVariation({
      collection: current?.name,
      variation: first.name || first.label,
    });
    sendVariation(first);
  }, [selection.colIndex, current?.name, variations]);

  return (
    <div aria-label="Configurador" className="cc-root">
      <div className="cc-collections-row">
        <h2 className="sp-title">Models</h2>
        <label className="cc-collection-label" htmlFor="model-collection-select">
          <select
            id="model-collection-select"
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
        <div className="cc-var-grid" aria-label="Variaciones">
          {variations.map((v, idx) => {
            const label = v.label;
            const img = v.imageThumbnail || "";
            const tooltip = v.name ? v.name : label;
            const isSelected = selectedVarByCollection[current?.name || ""] === label;
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
                  <span className="cc-var-label" title={tooltip}>
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

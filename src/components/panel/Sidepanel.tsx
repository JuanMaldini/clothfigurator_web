import React, { useState, useEffect, useCallback } from 'react';
import { generateConfiguratorPDF } from '../pdfConfigurator/pdfGenerator';
import ColorTint, { getCurrentTint, subscribeTint } from '../colorTint/colorTint';
import './Sidepanel.css';


// ================== PIXEL STREAMING MESSAGING LAYER ==================
// Centraliza la construcción, serialización, logging y envío del mensaje
// que viaja hacia Unreal por Pixel Streaming (o fallback).
// Garantiza que el mismo string que se envía es el que se imprime en consola.

interface VariationMessage {
  type: 'variation-select';
  collection: string;
  subcollection: string;
  variation: string;      // nombre legible
  variationId: string;    // id interno (aquí igual que variation por ahora)
  tint?: string;          // ejemplo de campo adicional opcional (color actual)
  timestamp: number;      // epoch ms para trazabilidad
}

// Construye el objeto de mensaje
function buildVariationMessage(collection: string, subcollection: string, variation: string, tint?: string): VariationMessage {
  return {
    type: 'variation-select',
    collection,
    subcollection,
    variation,
    variationId: variation,
    tint,
    timestamp: Date.now()
  };
}

// Serializa (si quisieras mutar formato/orden centralizas aquí)
function serializeVariationMessage(msg: VariationMessage): string {
  return JSON.stringify(msg);
}

// Intenta múltiples APIs conocidas del ecosistema Pixel Streaming / fallbacks.
function emitToPixelStreaming(serialized: string): boolean {
  const w = window as any;
  try {
    // Arcware Application wrapper (preferido si está disponible)
    try {
      sendUIInteraction(serialized);
      return true;
    } catch {}
    if (typeof w.emitUIInteraction === 'function') { // algunas integraciones exponen esto global
      w.emitUIInteraction(serialized);
      return true;
    }
    // Epic sample (webRtcPlayerObj) suele tener emitUIInteraction
    if (w.webRtcPlayerObj?.emitUIInteraction) {
      w.webRtcPlayerObj.emitUIInteraction(serialized);
      return true;
    }
    // Algunas versiones antiguas solo tienen sendMessage
    if (w.webRtcPlayerObj?.sendMessage) {
      w.webRtcPlayerObj.sendMessage(serialized);
      return true;
    }
    // PureWeb InputEmitter estilo props.InputEmitter.EmitUIInteraction
    if (w.InputEmitter?.EmitUIInteraction) {
      w.InputEmitter.EmitUIInteraction(serialized);
      return true;
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('[PS][emit-error]', err);
  }
  return false;
}

// Punto único para log + envío. Retorna true si se envió por canal PS.
export function logAndSendVariation(collection: string, subcollection: string, variation: string, tint?: string): boolean {
  const msgObj = buildVariationMessage(collection, subcollection, variation, tint);
  const serialized = serializeVariationMessage(msgObj);
  // Log EXACTO: lo que sale por el canal.
  // eslint-disable-next-line no-console
  console.log('[Configurator][SEND]', serialized);
  const psOk = emitToPixelStreaming(serialized);
  if (!psOk) {
    // Fallback broadcast (debug / integraciones locales)
    window.postMessage(msgObj, '*');
  }
  return psOk;
}
// ================== /PIXEL STREAMING MESSAGING LAYER ==================


//TINT
// Panel deslizante ligero sin dependencias externas para evitar duplicados de React.
const Sidepanel = () => {
  const [open, setOpen] = useState(false);
  // Color tint sincronizado globalmente
  const [tint, setTint] = useState(getCurrentTint());
  const [tintOpen, setTintOpen] = useState(false);
  useEffect(() => {
    const unsubscribe = subscribeTint(setTint);
    return () => { unsubscribe(); };
  }, []);
  // referencia ligera para evitar warning si todavía no se usa
  // eslint-disable-next-line no-unused-expressions
  tint;


  // Evita scroll de fondo cuando está abiertoEmitUIInteraction
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <div className="sp-root">
      {!open && (
        <button className="sp-btn sp-panel-open-btn" onClick={() => setOpen(true)}>
          Open
        </button>
      )}
      {open && <div className="sp-backdrop" onClick={() => setOpen(false)} />}
      <div className={`sp-panel ${open ? 'open' : ''}`}>
        <div className="sp-header">
          <strong>Configurat System</strong>
          <div onClick={() => setOpen(false)} className="sp-export-btn">Close</div>

        </div>
          <div className="sp-body" id="sp-body">

          <section className="sp-export-section">
            <div className="sp-export-row">
              <div>
                <strong>Save</strong>
              </div>
              <div className="sp-export-actions">
                <button
                  className="sp-export-btn"
                  title="Download a pdf with all information"
                  onClick={() => generateConfiguratorPDF('sp-body')}
                >Export</button>
                <button className="sp-export-btn" title="Take a screenshot of the current view">Screenshoot</button>
              </div>
            </div>
          </section>

          <section className="sp-section">
            <button
              type="button"
              className={`sp-collapsible-header${tintOpen ? ' is-open' : ''}`}
              onClick={() => setTintOpen(o => !o)}
            >
              <span className="sp-collapsible-title">Tint</span>
              <span className="sp-caret" aria-hidden="true">{tintOpen ? '▾' : '▸'}</span>
            </button>
            <div className={`sp-collapsible-body${tintOpen ? ' open' : ''}`}> 
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


interface RawVariationSubcollection { name?: string; variation?: string[]; variations?: string[] }
interface RawCollection { collection?: string; name?: string; subcollection?: RawVariationSubcollection[]; subcollections?: RawVariationSubcollection[] }
interface NormalizedSubcollection { name: string; variations: string[] }
interface NormalizedCollection { name: string; subcollections: NormalizedSubcollection[] }

const normalizeData = (raw: RawCollection[]): NormalizedCollection[] =>
  (raw || []).map(r => ({
    name: r.collection || r.name || 'Unnamed',
    subcollections: (r.subcollections || r.subcollection || []).map(s => ({
      name: s.name || 'Unnamed',
      variations: s.variations || s.variation || []
    }))
  })).filter(c => c.subcollections.length);

const ConfiguratorPanel: React.FC = () => {
  const [data, setData] = useState<NormalizedCollection[]>([]);
  const [colIndex, setColIndex] = useState(0);
  const [subName, setSubName] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const url = new URL('./collections.json', import.meta.url).href;
        const res = await fetch(url, { cache: 'no-cache' });
        const json = await res.json();
        if (!alive) return;
        const norm = normalizeData(json);
        setData(norm);
        setColIndex(0);
        setSubName(norm[0]?.subcollections[0]?.name || null);
      } catch (e) {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
            console.warn('[Configurator] load error', e);
        }
      }
    })();
    return () => { alive = false; };
  }, []);

  const current = data[colIndex];
  const subcollections = current?.subcollections || [];
  const variations = (subcollections.find(s => s.name === subName) || subcollections[0])?.variations || [];

  const selectCollection = useCallback((idx: number) => {
    setColIndex(idx);
    setSubName(data[idx]?.subcollections[0]?.name || null);
  }, [data]);

  const sendVariation = (variation: string) => {
    if (!current || !subName) return;
    // Podemos agregar tint actual (si se quisiera) leyendo getCurrentTint()
    try { logAndSendVariation(current.name, subName, variation /*, getCurrentTint() */); } catch { /* ignore */ }
  };

  if (!data.length) return <div className="cc-loading">Cargando configurador…</div>;

  return (
    <div aria-label="Configurador" className="cc-root">
      <div>
        <h2 className="cc-section-title">Collections</h2>
        <div className="cc-header-row">
          <div className="cc-select-col">
            <label className="cc-collection-label" htmlFor="collection-select">
              <select
                id="collection-select"
                className="cc-collection-dropdown"
                value={colIndex}
                onChange={e => selectCollection(Number(e.target.value))}
                aria-label="Collections"
              >
                {data.map((c, i) => <option key={c.name} value={i}>{c.name}</option>)}
              </select>
            </label>
          </div>
        </div>
      </div>
      <div >
        <h2 className="cc-section-title">Subcollections</h2>
        <div className="cc-subcollections">
          {subcollections.map(sc => (
            <button
              key={sc.name}
              type="button"
              className={`cc-sub-btn${sc.name === subName ? ' is-selected' : ''}`}
              onClick={() => setSubName(sc.name)}
              aria-current={sc.name === subName || undefined}
            >{sc.name}</button>
          ))}
        </div>
      </div>
      <div >
        <h2 className="cc-section-title">Variations</h2>
        <div className="cc-var-grid" aria-label="Variaciones">
          {variations.map(v => (
            <button
              key={v}
              type="button"
              className="cc-var-box"
              onClick={() => sendVariation(v)}
              title={v}
            >
              <span className="cc-var-box-label">{v}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidepanel;

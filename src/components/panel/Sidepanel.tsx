import React, { useState, useEffect, useCallback } from 'react';
import './Sidepanel.css';

// Panel deslizante ligero sin dependencias externas para evitar duplicados de React.
const Sidepanel = () => {
  const [open, setOpen] = useState(false);

  // Evita scroll de fondo cuando está abierto
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
          <button onClick={() => setOpen(false)}>✕</button>
        </div>
        <div className="sp-body">
          <section className="sp-export-section">
            <div className="sp-export-row">
              <span className="sp-export-label">Export configuration</span>
              <button className="sp-export-btn">PDF</button>
            </div>
            <div className="sp-export-row">
              <span className="sp-export-label">Save Image</span>
              <button className="sp-export-btn">Render</button>
            </div>
          </section>
          <section>
            <ConfiguratorPanel />
          </section>
        </div>
        <div className="sp-footer">Sidepanel básico (sin librería externa)</div>
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
    const payload = { type: 'variation-select', collection: current.name, subcollection: subName, variation, variationId: variation };
    const anyWin = window as any;
    if (anyWin.webRtcPlayerObj?.sendMessage) {
      try { anyWin.webRtcPlayerObj.sendMessage(JSON.stringify(payload)); } catch { /* ignore */ }
    } else {
      window.postMessage(payload, '*');
    }
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.log('[Configurator] Variation', payload);
    }
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

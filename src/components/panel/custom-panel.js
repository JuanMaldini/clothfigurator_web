// Custom Panel (collections + subcollections + variations)
// Refactored into a modular, standardized API while preserving legacy auto-init behaviour.
// A global object `window.CCPanel` is exposed for integration / overrides.
(() => {
  'use strict';
  const SELECTORS = {
    rootId: 'ccPanelRoot',
    toggleId: 'ccPanelToggleBtn',
    collectionsHostId: 'ccCollections',
    variationsSectionId: 'ccVariationsSection',
    varGridId: 'ccVarGrid',
    varCountId: 'ccVarCount'
  };

  const DEFAULT_CONFIG = Object.freeze({
    dataUrl: 'custom-panel/collections.json',
    defaultOpen: false,
    ui: { toggleLabel: 'Panel', panelTitle: 'Configurator', variationsTitle: 'Variations' },
    messaging: { type: 'variation-select', prefix: '', suffix: '' },
    debug: true
  });

  /** ==========================
   *  STATE (internal)
   *  ========================== */
  const BODY = document.body;
  let config = { ...DEFAULT_CONFIG };
  let collectionsData = [];
  let collectionIndex = 0; // active collection index
  let subcollectionName = null; // active subcollection name
  const colorCache = new Map(); // random color cache per render cycle
  const listeners = new Map(); // event emitter storage

  /** ==========================
   *  EVENT EMITTER (minimal)
   *  ========================== */
  function on(event, handler){
    if(!listeners.has(event)) listeners.set(event, new Set());
    listeners.get(event).add(handler);
  }
  function off(event, handler){ listeners.get(event)?.delete(handler); }
  function emit(event, detail){
    listeners.get(event)?.forEach(fn=>{ try { fn(detail); } catch(e){ console.warn('[CCPanel] listener error', e); } });
    // Also dispatch DOM event for optional external usage
    const root = document.getElementById(SELECTORS.rootId);
    if(root) root.dispatchEvent(new CustomEvent(event, { detail }));
  }

  /** ==========================
   *  INIT / PUBLIC API
   *  ========================== */
  function setConfig(overrides = {}){
    config = deepMerge({ ...DEFAULT_CONFIG }, overrides || {});
    if(config.debug) debugLog('Config updated', config);
  }

  function init(userConfig){
    if(document.getElementById(SELECTORS.rootId)) return; // already present
    if(userConfig) setConfig(userConfig);
    createToggleButton();
    createPanelSkeleton();
    if(config.defaultOpen) open();
    fetchData();
  }

  function open(){ BODY.classList.add('cc-panel-open'); updateToggleAria(true); }
  function close(){ BODY.classList.remove('cc-panel-open'); updateToggleAria(false); }
  function toggle(){ BODY.classList.toggle('cc-panel-open'); updateToggleAria(BODY.classList.contains('cc-panel-open')); }
  function isOpen(){ return BODY.classList.contains('cc-panel-open'); }
  function getState(){
    return Object.freeze({
      config: { ...config },
      collectionIndex,
      subcollectionName,
      currentCollection: collectionsData[collectionIndex] || null
    });
  }
  function reloadData(){ fetchData(true); }

  // Expose API early
  window.CCPanel = { init, open, close, toggle, isOpen, setConfig, getState, reloadData, on, off };

  /** ==========================
   *  DOM CREATION
   *  ========================== */
  function createToggleButton(){
    const id = SELECTORS.toggleId;
    if(document.getElementById(id)) return; // idempotent
    const btn = document.createElement('button');
    btn.id = id;
    btn.type = 'button';
    btn.className = 'cc-btn-toggle';
    btn.innerHTML = `<span class="cc-btn-toggle-label">${escapeHtml(config.ui.toggleLabel)}</span>`;
    btn.setAttribute('aria-label', 'Abrir panel');
    btn.setAttribute('aria-expanded','false');
    btn.addEventListener('click', toggle);
    BODY.appendChild(btn);
  }

  function updateToggleAria(openState){
    const btn = document.getElementById(SELECTORS.toggleId);
    if(btn) btn.setAttribute('aria-expanded', String(!!openState));
  }

  function createPanelSkeleton(){
    const id = SELECTORS.rootId;
    if(document.getElementById(id)) return;
    const panel = document.createElement('section');
    panel.id = id;
    panel.innerHTML = `
      <header id="ccPanelHeader" class="cc-panel-header">
        <span class="cc-panel-title">${escapeHtml(config.ui.panelTitle)}</span>
        <button id="ccPanelCloseBtn" class="cc-btn-close" aria-label="Cerrar" title="Cerrar">×</button>
      </header>
      <div id="ccPanelContent" class="cc-panel-content">
        <div id="${SELECTORS.collectionsHostId}" class="cc-collections">Loading…</div>
      </div>`;
    BODY.appendChild(panel);
    panel.querySelector('#ccPanelCloseBtn')?.addEventListener('click', close);
  }

  /** ==========================
   *  DATA LAYER
   *  ========================== */
  async function fetchData(reload = false){
    const host = document.getElementById(SELECTORS.collectionsHostId);
    if(!host) return;
    if(reload) host.textContent = 'Loading…';
    try {
      const res = await fetch(config.dataUrl, { cache: 'no-cache' });
      if(!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const json = await res.json();
      if(!Array.isArray(json) || !json.length) throw new Error('No data');
      collectionsData = json;
      collectionIndex = 0;
      subcollectionName = firstSubcollectionName(collectionsData[0]);
      render();
      emit('data-loaded', { collections: collectionsData });
    } catch (e){
      host.textContent = 'Data not available';
      console.warn('[CCPanel] collections.json error', e);
      emit('data-error', { error: e });
    }
  }

  function firstSubcollectionName(collectionObj){
    return collectionObj?.subcollections?.[0]?.name || collectionObj?.subcollections?.[0] || null;
  }

  /** ==========================
   *  RENDER (MAIN)
   *  ========================== */
  function render(){
    const host = document.getElementById(SELECTORS.collectionsHostId);
    if(!host || !collectionsData.length) return;
    const current = collectionsData[collectionIndex];
    host.innerHTML='';

    // Collection selector (header + dropdown)
    const headerBtn = createCollectionHeader(current);
    host.appendChild(headerBtn.wrapper); // wrapper contains dropdown appended later for structure clarity

    // Subcollections list
    const subsWrap = buildSubcollections(current);
    host.appendChild(subsWrap);

    // Variations section
    const variationsSection = document.createElement('section');
    variationsSection.id = SELECTORS.variationsSectionId;
    variationsSection.className = 'cc-variations-section';
    variationsSection.innerHTML = `
      <div class="cc-var-header-row">
        <h3 class="cc-var-title">${escapeHtml(config.ui.variationsTitle)}</h3>
        <span class="cc-var-count" id="${SELECTORS.varCountId}"></span>
      </div>
      <div class="cc-var-grid" id="${SELECTORS.varGridId}"></div>`;
    host.appendChild(variationsSection);

    renderVariationsSection(current, subcollectionName);
  }

  function createCollectionHeader(current){
    const wrapper = document.createElement('div');
    wrapper.className = 'cc-collection-header-wrapper';

    const headerBtn = document.createElement('button');
    headerBtn.type='button';
    headerBtn.className='cc-collection-header';
    headerBtn.setAttribute('aria-haspopup','listbox');
    headerBtn.setAttribute('aria-expanded','false');
    headerBtn.innerHTML = `<span class="cc-collection-name">${escapeHtml(current.collection || current.name)}</span><span class="cc-collection-arrow" aria-hidden="true">▾</span>`;
    wrapper.appendChild(headerBtn);

    const dropdown = document.createElement('div');
    dropdown.className='cc-collection-dropdown';
    const list = document.createElement('ul');
    list.className='cc-collection-list';
    collectionsData.forEach((c, idx)=>{
      const li = document.createElement('li');
      const label = c.collection || c.name || 'Unnamed';
      li.className = 'cc-collection-item' + (idx === collectionIndex ? ' is-active' : '');
      li.textContent = label;
      li.addEventListener('click', ()=>{
        if(collectionIndex !== idx){
          collectionIndex = idx;
          subcollectionName = firstSubcollectionName(collectionsData[idx]);
          render();
          emit('collection-change', { index: idx, collection: collectionsData[idx] });
        }
        dropdown.classList.remove('is-open');
        headerBtn.setAttribute('aria-expanded','false');
      });
      list.appendChild(li);
    });
    dropdown.appendChild(list);
    wrapper.appendChild(dropdown);

    headerBtn.addEventListener('click',()=>{
      const open = dropdown.classList.toggle('is-open');
      headerBtn.setAttribute('aria-expanded', String(open));
      if(open){
        setTimeout(()=>{
          const closeHandler = (e)=>{
            if(!dropdown.contains(e.target) && e.target !== headerBtn){
              dropdown.classList.remove('is-open');
              headerBtn.setAttribute('aria-expanded','false');
              document.removeEventListener('click', closeHandler);
            }
          };
          document.addEventListener('click', closeHandler);
        },0);
      }
    });
    return { wrapper, headerBtn };
  }

  function buildSubcollections(current){
    const subsWrap = document.createElement('div');
    subsWrap.className = 'cc-subcollections';
    const subs = current.subcollections || [];
    if(subs.length){
      subs.forEach(sc => {
        const name = sc.name || sc;
        const btn = document.createElement('button');
        btn.type='button';
        btn.className='cc-sub-btn' + (name === subcollectionName ? ' is-selected' : '');
        btn.textContent = name;
        btn.addEventListener('click', ()=>{
          if(subcollectionName !== name){
            subcollectionName = name;
            subsWrap.querySelectorAll('.cc-sub-btn.is-selected').forEach(el=>el.classList.remove('is-selected'));
            btn.classList.add('is-selected');
            renderVariationsSection(current, name);
            emit('subcollection-change', { collectionIndex, subcollection: name });
          }
        });
        subsWrap.appendChild(btn);
      });
    } else {
      const empty = document.createElement('div');
      empty.className='cc-sub-empty';
      empty.textContent='No subcollections';
      subsWrap.appendChild(empty);
    }
    return subsWrap;
  }

  function renderVariationsSection(collectionObj, subName){
    const grid = document.getElementById(SELECTORS.varGridId);
    const countEl = document.getElementById(SELECTORS.varCountId);
    if(!grid || !collectionObj) return;
    grid.innerHTML='';
    clearColorCache();
    const sub = (collectionObj.subcollections||[]).find(s => (s.name||s) === subName);
    const variations = sub?.variations || [];
    if(countEl) countEl.textContent = String(variations.length || 0);
    variations.forEach(v => {
      const box = document.createElement('button');
      box.type='button';
      box.className='cc-var-box';
      box.title = v;
      box.setAttribute('data-var', v);
      box.style.setProperty('--cc-var-color', randomColor(v));
      box.innerHTML = `<span class="cc-var-box-label">${escapeHtml(v)}</span>`;
      box.addEventListener('click', ()=>{
        emitVariationSelection(collectionObj.collection || collectionObj.name, subName, v);
      });
      grid.appendChild(box);
    });
  }

  /** ==========================
   *  COLOR UTIL
   *  ========================== */
  function randomColor(key){
    if(colorCache.has(key)) return colorCache.get(key);
    const h = Math.floor(Math.random()*360);
    const s = 55 + Math.floor(Math.random()*25);
    const l = 45 + Math.floor(Math.random()*15);
    const c = `hsl(${h} ${s}% ${l}%)`;
    colorCache.set(key, c);
    return c;
  }
  function clearColorCache(){ colorCache.clear(); }

  /** ==========================
   *  MESSAGING / EMIT VARIATION
   *  ========================== */
  function emitVariationSelection(collection, subcollection, variation){
    const { prefix, suffix, type } = config.messaging || {};
    const variationId = `${prefix || ''}${variation}${suffix || ''}`;
    const payload = { type: type || 'variation-select', collection, subcollection, variation, variationId };

    // Pixel Streaming specific channel (best guess)
    if(window.webRtcPlayerObj && typeof window.webRtcPlayerObj.sendMessage === 'function'){
      try { window.webRtcPlayerObj.sendMessage(JSON.stringify(payload)); } catch(e){ /* ignore */ }
    } else {
      // Generic fallback
      window.postMessage(payload, '*');
    }
    debugLog('Variation selected', payload);
    emit('variation-select', payload);
  }

  /** ==========================
   *  HELPERS
   *  ========================== */
  function escapeHtml(str){
    return String(str).replace(/[&<>"']/g, s => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;' }[s]));
  }
  function debugLog(...args){ if(config.debug) console.log('[CCPanel]', ...args); }
  function isPlainObject(o){ return Object.prototype.toString.call(o) === '[object Object]'; }
  function deepMerge(target, source){
    for(const key in source){
      if(isPlainObject(source[key])){
        if(!isPlainObject(target[key])) target[key] = {};
        deepMerge(target[key], source[key]);
      } else target[key] = source[key];
    }
    return target;
  }

  /** ==========================
   *  AUTO INIT
   *  ========================== */
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

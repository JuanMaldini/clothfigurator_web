function log(metric, value) {
  console.log(`[web-vitals] ${metric}:`, value);
}

(function trackCLS() {
  if (!('PerformanceObserver' in window)) return;
  let cls = 0;
  const entryHandler = (list) => {
    for (const entry of list.getEntries()) {
      if (!entry.hadRecentInput) cls += entry.value;
    }
    log('CLS', Number(cls.toFixed(4)));
  };
  try {
    const po = new PerformanceObserver(entryHandler);
    po.observe({ type: 'layout-shift', buffered: true });
  } catch {}
})();

(function trackLCP() {
  if (!('PerformanceObserver' in window)) return;
  let lcp = 0;
  const entryHandler = (list) => {
    const entries = list.getEntries();
    const last = entries[entries.length - 1];
    if (last) {
      lcp = last.renderTime || last.loadTime || last.startTime;
      log('LCP', Math.round(lcp));
    }
  };
  try {
    const po = new PerformanceObserver(entryHandler);
    po.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch {}
})();

(function trackFID() {
  if (!('PerformanceObserver' in window)) return;
  const entryHandler = (list) => {
    for (const entry of list.getEntries()) {
      if (entry.name === 'first-input' && entry.processingStart) {
        const fid = entry.processingStart - entry.startTime;
        log('FID', Math.round(fid));
        return;
      }
    }
  };
  try {
    const po = new PerformanceObserver(entryHandler);
    po.observe({ type: 'first-input', buffered: true });
  } catch {}
})();

export {};

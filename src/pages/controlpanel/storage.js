// Simple localStorage helpers for the control panel

const safeJSON = {
  parse(text, fallback) {
    try { return JSON.parse(text); } catch { return fallback; }
  },
  stringify(obj) {
    try { return JSON.stringify(obj); } catch { return "[]"; }
  }
};

export function loadItems(key) {
  if (typeof localStorage === "undefined") return [];
  const raw = localStorage.getItem(key);
  return safeJSON.parse(raw, []);
}

export function saveItems(key, items) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(key, safeJSON.stringify(items));
}

export function clearItems(key) {
  if (typeof localStorage === "undefined") return;
  localStorage.removeItem(key);
}

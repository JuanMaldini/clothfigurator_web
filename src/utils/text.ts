// Text utilities for consistent sanitization and naming across the app

export function stripAccents(input?: string): string {
  if (!input) return "";
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export type SanitizeOptions = {
  allowDots?: boolean; // keep '.'
  toUpper?: boolean;   // final uppercase
  toLower?: boolean;   // final lowercase (default)
};

export function sanitizeToken(input?: string, opts: SanitizeOptions = {}): string {
  if (!input) return "";
  let t = stripAccents(String(input).trim());
  t = t.replace(/\s+/g, "-");
  const allow = opts.allowDots ? "A-Za-z0-9._-" : "A-Za-z0-9_-";
  const re = new RegExp(`[^${allow}]`, "g");
  t = t.replace(re, "");
  t = t.replace(/-{2,}/g, "-");
  t = t.replace(/^-+|-+$/g, "");
  if (opts.toUpper) return t.toUpperCase();
  if (opts.toLower !== false) return t.toLowerCase();
  return t;
}

export function buildMaterialInstanceName(
  collectionName?: string,
  subcollectionName?: string,
  variationName?: string,
  variationPattern?: string
): string {
  const collTok = sanitizeToken(collectionName, { toUpper: true });
  const subTok = sanitizeToken(subcollectionName, { toUpper: true });
  let varRaw = "";
  if (variationName && variationPattern) varRaw = `${variationName}-${variationPattern}`;
  else varRaw = variationName || variationPattern || "";
  const varTok = sanitizeToken(varRaw, { toUpper: true });
  if (!(collTok && subTok && varTok)) return "";
  return `MI_${collTok}_${subTok}_${varTok}`;
}

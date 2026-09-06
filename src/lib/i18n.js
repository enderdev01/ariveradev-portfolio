// Locale boundary resolver (design D1).
// `{es, en}` leaves live only inside the three data files. `resolve` deep-walks
// any object/array and collapses an `{es, en}` leaf to `node[locale] ??
// node[DEFAULT_LOCALE]`. `en: null` therefore always falls back to `es`, so no
// partial English can ever render — the proposal's hard non-goal.
export const LOCALES = ["es"]; // becomes ["es", "en"] when /en ships
export const DEFAULT_LOCALE = "es";

const isLocaleLeaf = (node) =>
  node !== null &&
  typeof node === "object" &&
  !Array.isArray(node) &&
  Object.prototype.hasOwnProperty.call(node, "es") &&
  Object.prototype.hasOwnProperty.call(node, "en");

export function resolve(node, locale = DEFAULT_LOCALE) {
  if (isLocaleLeaf(node)) {
    return node[locale] ?? node[DEFAULT_LOCALE];
  }
  if (Array.isArray(node)) {
    return node.map((item) => resolve(item, locale));
  }
  if (node !== null && typeof node === "object") {
    const out = {};
    for (const [key, value] of Object.entries(node)) {
      out[key] = resolve(value, locale);
    }
    return out;
  }
  return node;
}

export const localePath = (locale, path) =>
  locale === DEFAULT_LOCALE ? path : `/${locale}${path}`;

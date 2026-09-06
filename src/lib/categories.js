// Pure projection from the catalog's single stored category value
// (`proyectosSeo[id].categoria`) to the filter key used by AllProjects.js.
//
// This is intentionally NOT a second stored field: `categoria` remains the
// only source of truth. Adding a stored `categoriaKey` would let a future
// editor set it inconsistently with `categoria` — the exact defect this
// projection exists to remove. See design D5.
//
// Ordered: the first matching rule wins. "ecommerce" precedes "landing" so
// that id 16 "Landing y ecommerce" lands in ecommerce, preserving today's
// bucket. "marketplace" has its own explicit rule mapping to "ecommerce".
// "app" stays word-bounded (`\bapp\b`) so it cannot match inside other words.
const CATEGORY_RULES = [
  [/juego/i, "game"],
  [/\bapp\b/i, "app"],
  [/ecommerce/i, "ecommerce"],
  [/marketplace/i, "ecommerce"],
  [/plataforma/i, "platform"],
  [/landing|sitio/i, "landing"],
];

export const toCategoryKey = (categoria) => {
  if (!categoria) return null;
  return CATEGORY_RULES.find(([re]) => re.test(categoria))?.[1] ?? null;
};

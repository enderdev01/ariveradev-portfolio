// Pure portfolio classification & narrative derivation.
//
// Every export is a deterministic, side-effect-free function over its inputs,
// so the discovery pipeline can be tested offline and repeated runs over
// identical inputs are byte-identical.
//
// Spanish note: category names and narrative templates are user-facing site
// content, and this project's committed portfolio data (card descriptions,
// SEO categories, proyectos-seo narratives) is written in Spanish. Code,
// comments and identifiers stay in English per project convention.
//
// Claim discipline: derived narratives describe the problem and the technical
// approach only. They never contain digits or percentage signs and never
// assert client metrics or outcomes, because those are never provided by the
// discovery inputs.

// --- Slug & id normalization -------------------------------------------------

// Converts a repository name into a stable kebab-case slug: ASCII-folded
// (NFD + combining-mark strip), lowercased, non-alphanumerics collapsed into
// single dashes. Returns null when nothing usable remains.
export function normalizeSlug(raw) {
  if (typeof raw !== "string") return null;
  const ascii = raw.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const kebab = ascii
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return kebab || null;
}

// --- Category ----------------------------------------------------------------

const TOPIC_CATEGORY_RULES = [
  { pattern: /(^|-)ecommerce(-|$)/, categoria: "Ecommerce" },
  { pattern: /(^|-)tienda(-|$)/, categoria: "Ecommerce" },
  { pattern: /(^|-)marketplace(-|$)/, categoria: "Marketplace" },
  { pattern: /(^|-)landing(-|$)/, categoria: "Landing de producto" },
  { pattern: /(^|-)inmobiliaria(-|$)/, categoria: "Landing inmobiliaria" },
  { pattern: /(^|-)corporativo(-|$)/, categoria: "Sitio corporativo" },
  { pattern: /(^|-)app-movil(-|$)/, categoria: "App móvil" },
  { pattern: /(^|-)movil(-|$)/, categoria: "App móvil" },
  { pattern: /(^|-)plataforma(-|$)/, categoria: "Plataforma web" },
  { pattern: /(^|-)web-app(-|$)/, categoria: "Plataforma web" },
  { pattern: /(^|-)saas(-|$)/, categoria: "Plataforma web" },
  { pattern: /(^|-)dashboard(-|$)/, categoria: "Plataforma web" },
];

const LANGUAGE_CATEGORY_RULES = [
  { languages: ["Swift", "Kotlin", "Dart"], categoria: "App móvil" },
];

export const FALLBACK_CATEGORY = "Proyecto web";

// Deterministic category from topics (first matching rule over the sorted
// topic list wins) then primary language, with the safe fallback
// "Proyecto web" when nothing matches.
export function deriveCategory({ topics = [], language = null } = {}) {
  if (Array.isArray(topics)) {
    for (const rule of TOPIC_CATEGORY_RULES) {
      if (topics.some((topic) => rule.pattern.test(topic))) return rule.categoria;
    }
  }
  if (language) {
    for (const rule of LANGUAGE_CATEGORY_RULES) {
      if (rule.languages.includes(language)) return rule.categoria;
    }
  }
  return FALLBACK_CATEGORY;
}

// --- Stack -------------------------------------------------------------------

const TOPIC_STACK_MAP = {
  react: "React",
  nextjs: "Next.js",
  "next-js": "Next.js",
  astro: "Astro",
  vue: "Vue",
  nuxt: "Nuxt",
  svelte: "Svelte",
  angular: "Angular",
  tailwind: "Tailwind CSS",
  tailwindcss: "Tailwind CSS",
  wordpress: "WordPress",
  sass: "Sass",
  typescript: "TypeScript",
  node: "Node.js",
  nodejs: "Node.js",
  "node-js": "Node.js",
  express: "Express",
  firebase: "Firebase",
  supabase: "Supabase",
  mongodb: "MongoDB",
  postgresql: "PostgreSQL",
};

// Ordered public-HTML fingerprints. Ordered entries keep derivation
// deterministic; each fingerprint is checked against the raw production HTML.
const HTML_FINGERPRINTS = [
  { tech: "Next.js", patterns: [/__NEXT_DATA__/i, /\/_next\//] },
  { tech: "Nuxt", patterns: [/__NUXT__/i, /\/_nuxt\//] },
  { tech: "Astro", patterns: [/<astro-island/i, /\/_astro\//] },
  { tech: "Gatsby", patterns: [/___gatsby/i] },
  { tech: "Svelte", patterns: [/svelte-[a-z0-9]{6}\b/i, /\/_svelte\//i] },
  { tech: "Vue", patterns: [/data-v-[a-f0-9]{8}/i] },
  { tech: "WordPress", patterns: [/wp-content/i, /wp-includes/i] },
  { tech: "React", patterns: [/data-reactroot/i, /[("'\/]react(?:[."'/-]|$)/i] },
  { tech: "Tailwind CSS", patterns: [/tailwind/i] },
  { tech: "Vite", patterns: [/\/assets\/index-[A-Za-z0-9_-]+\.js/] },
];

// Stack derivation: primary language first, then topic-derived technologies in
// sorted-topic order, then public-HTML fingerprints in definition order. All
// deduped, case-normalized to the canonical tech name.
export function deriveStack({ language = null, topics = [], html = null } = {}) {
  const stack = [];
  const push = (tech) => {
    if (tech && !stack.includes(tech)) stack.push(tech);
  };
  if (typeof language === "string" && language) push(language);
  if (Array.isArray(topics)) {
    for (const topic of topics) {
      const tech = TOPIC_STACK_MAP[topic.toLowerCase()];
      if (tech) push(tech);
    }
  }
  if (typeof html === "string" && html) {
    for (const fingerprint of HTML_FINGERPRINTS) {
      if (fingerprint.patterns.some((pattern) => pattern.test(html))) push(fingerprint.tech);
    }
  }
  // Always non-empty: with no language/topic/fingerprint evidence, return the
  // non-claiming generic fallback "Web" so every derived source satisfies the
  // pipeline's non-empty stack validation.
  if (stack.length === 0) return ["Web"];
  return stack;
}

// --- Safe HTML extraction ----------------------------------------------------
// Single shared implementation of the defensive extraction rules: plain regex
// over raw text, tags stripped from the result, whitespace collapsed, no
// DOM/eval involved. scripts/lib/portfolio-record.mjs imports these helpers
// for the manual-source pipeline, keeping one set of rules for both paths.

function decodeBasicEntities(text) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'");
}

export function collapseWhitespace(text) {
  return typeof text === "string" ? text.replace(/\s+/g, " ").trim() : null;
}

export function extractTitle(html) {
  if (typeof html !== "string" || !html) return null;
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!match) return null;
  return collapseWhitespace(decodeBasicEntities(match[1]).replace(/<[^>]*>/g, "")) || null;
}

export function extractMetaDescription(html) {
  if (typeof html !== "string" || !html) return null;
  const patterns = [
    /<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i,
    /<meta[^>]+content=["']([^"']*)["'][^>]*name=["']description["'][^>]*>/i,
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) {
      const text = collapseWhitespace(decodeBasicEntities(match[1]));
      if (text) return text;
    }
  }
  return null;
}

// --- Deterministic gradient --------------------------------------------------

// Curated dark gradients (2-3 stops each). Selection is a pure function of the
// slug hash, so every project always renders with the same palette.
const GRADIENT_PALETTE = [
  ["#0B1224", "#132A5E", "#0E7490"],
  ["#0F172A", "#1E3A8A", "#0EA5E9"],
  ["#111827", "#312E81", "#0891B2"],
  ["#0B1224", "#155E75", "#22D3EE"],
  ["#0F172A", "#334155", "#38BDF8"],
  ["#1E1B4B", "#3B0764", "#0891B2"],
];

// FNV-1a over the UTF-8 bytes of the seed; deterministic across runs.
export function hashSeed(text) {
  if (typeof text !== "string") return 0;
  let hash = 0x811c9dc5;
  for (const byte of Buffer.from(text, "utf8")) {
    hash ^= byte;
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

// Default deterministic gradient: stable per slug, valid for the thumbnail
// compositor (array of 2-6 uppercase hex stops).
export function deriveGradient(seed) {
  const gradient = GRADIENT_PALETTE[hashSeed(seed) % GRADIENT_PALETTE.length];
  return [...gradient];
}

// --- Narrative templates -----------------------------------------------------

const CATEGORY_DESAFIO = {
  Ecommerce:
    "Una tienda online vive de la primera impresión: {nombre} tiene que mostrar catálogo, confianza y un camino de compra claro de forma inmediata, porque cada paso extra aleja una decisión que se toma rápido.",
  Marketplace:
    "{nombre} maneja un catálogo que entra y sale todo el tiempo; el desafío es que la navegación siga siendo simple aunque el inventario nunca sea estable.",
  "Landing de producto":
    "{nombre} es una {categoria}: una sola página con un solo objetivo. El desafío es ordenar el mensaje para que el visitante entienda la propuesta y sepa qué hacer después, sin secciones que distraigan.",
  "Landing inmobiliaria":
    "{nombre} apunta a una decisión grande y poco frecuente; la {categoria} tiene un solo trabajo: ordenar los datos del proyecto y llevar al visitante interesado a un contacto concreto.",
  "Sitio corporativo":
    "Para {nombre}, el sitio es la primera reunión: el visitante evalúa si vale la pena una conversación comercial, y la {categoria} tiene que generar esa confianza sin acumular secciones.",
  "Plataforma web":
    "{nombre} estructura información que cambia con el tiempo, así que la {categoria} tiene que mantener la navegación simple y el contenido ordenado aunque la propuesta crezca.",
  "App móvil":
    "La experiencia de {nombre} tiene que convencer desde el primer uso: la {categoria} necesita comunicar su valor y guiar el flujo principal sin fricción ni explicaciones previas.",
};

const GENERIC_DESAFIO =
  "El punto de partida de {nombre} es el de todo {categoria}: explicar en segundos de qué va el proyecto y ofrecer al visitante un paso siguiente claro, sin que la primera pantalla prometa más de lo que el sitio muestra.";

const GENERIC_ENFOQUE =
  "El sitio de {nombre} se construyó con {stack}. El trabajo se centró en una jerarquía de información clara, tiempos de carga razonables y un recorrido de uso sin pasos de más.";

// Non-claiming desafio/enfoque templates. Deterministic per (nombre, categoria,
// stack); never include metrics or outcomes.
export function deriveNarrative({ nombre, categoria, stack = [] } = {}) {
  const desafioTemplate = CATEGORY_DESAFIO[categoria] ?? GENERIC_DESAFIO;
  const desafio = desafioTemplate
    .replaceAll("{nombre}", nombre ?? "")
    .replaceAll("{categoria}", categoria ?? "")
    .replace(/\s+/g, " ")
    .trim();
  const stackText = Array.isArray(stack) && stack.length ? stack.join(", ") : "tecnologías web estándar";
  const enfoque = GENERIC_ENFOQUE.replaceAll("{nombre}", nombre ?? "")
    .replaceAll("{stack}", stackText)
    .replace(/\s+/g, " ")
    .trim();
  return { desafio, enfoque };
}

// --- SEO texts ---------------------------------------------------------------

// Deterministic SEO texts: tituloSeo from the deployed <title>, descripcionSeo
// from the deployed meta description then the repository description, with a
// derived safe fallback when neither exists.
export function deriveSeoTexts({ nombre, categoria, deployedTitle, deployedDescription, repoDescription } = {}) {
  const tituloSeo =
    (collapseWhitespace(deployedTitle) && collapseWhitespace(deployedTitle)) ||
    `${nombre ?? "Proyecto"} — ${categoria ?? FALLBACK_CATEGORY}`;
  const descripcionSeo =
    (collapseWhitespace(deployedDescription) && collapseWhitespace(deployedDescription)) ||
    (collapseWhitespace(repoDescription) && collapseWhitespace(repoDescription)) ||
    `${nombre ?? "Proyecto"}: ${(categoria ?? FALLBACK_CATEGORY).toLowerCase()} publicado como demo del portfolio.`;
  return { tituloSeo, descripcionSeo };
}

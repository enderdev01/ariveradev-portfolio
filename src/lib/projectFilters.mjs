// Category filters for the project grid, kept out of the component so the mapping
// stays plain data a Node test can load without React or the JSON-importing data
// modules (src/data/onilabs.js imports JSON without an import attribute, so Node
// cannot load it).
//
// The mapping has to be total: a rendered category with no entry used to fall into
// an "otros" bucket that is not a filter value at all, which made every project
// carrying it invisible under every category except "Todos". "Proyecto web" is the
// classifier's unknown fallback (scripts/lib/portfolio-classify.mjs), and it is
// still a web application, so it lands with the web applications instead of nowhere.

export const CATEGORIAS = [
  { label: "Todos", value: "all" },
  { label: "Ecommerce", value: "ecommerce" },
  { label: "Landing", value: "landing" },
  { label: "App Móvil", value: "app" },
  { label: "Plataformas", value: "platform" },
  { label: "Juegos", value: "game" },
  { label: "Próximamente", value: "proximamente", featured: true },
];

export const FILTRO_POR_CATEGORIA = {
  Ecommerce: "ecommerce",
  Marketplace: "ecommerce",
  "Landing y ecommerce": "ecommerce",
  "Sitio corporativo": "landing",
  "Landing inmobiliaria": "landing",
  "Landing de producto": "landing",
  "Landing corporativa": "landing",
  "Plataforma web": "landing",
  "App móvil": "app",
  Plataforma: "platform",
  "Plataforma cívica": "platform",
  "Herramienta de datos": "platform",
  "Proyecto web": "platform",
  "Juego online": "game",
};

// Category of a project, or null when it has no SEO entry at all (those projects
// are shown under "Todos" only, which is the documented behaviour).
export const filtroDeProyecto = (seo) => {
  if (!seo) return null;
  return FILTRO_POR_CATEGORIA[seo.categoria] ?? null;
};

// Single matching rule for the grid, so the component and the tests cannot
// disagree about which chip a project belongs to. Two mechanisms feed it: the
// categoría coming from the SEO registry, and the "proximamente" estado, which
// wins over the category and keeps unreleased work out of the published chips.
export const coincideConFiltro = ({ proyecto = {}, seo = null, activa = "all" } = {}) => {
  if (activa === "all") return true;
  if (activa === "proximamente") return proyecto.estado === "proximamente";
  if (proyecto.estado === "proximamente") return false;
  return filtroDeProyecto(seo) === activa;
};

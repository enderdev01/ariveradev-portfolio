// Offline GitHub API double for the discovery test files.
//
// `repo()` builds entries with the exact raw shape of a GET /user/repos item,
// so the fixture states only each repository's own behavior and the shared
// fields stay declared in one place: one row per repository. Values mirror the
// former fixtures/discovery.json data.
//
// Exports are merged into the router's `fixture` object by
// discovery-router.mjs.

function repo(
  id,
  name,
  owner,
  {
    description = null,
    homepage = null,
    language = null,
    topics = [],
    archived = false,
    disabled = false,
  } = {}
) {
  return {
    id,
    name,
    full_name: `${owner}/${name}`,
    owner: { login: owner },
    description,
    homepage,
    language,
    topics,
    html_url: `https://github.com/${owner}/${name}`,
    archived,
    disabled,
  };
}

export const githubToken = "fixture-github-token";

export const githubReposByPage = {
  1: [
    repo(101, "clinica-nova", "onilabs", {
      description: "Demo de una clínica digital con agendamiento de turnos.",
      homepage: "https://clinica-nova.example.com", language: "JavaScript",
      topics: ["onilabs-portfolio", "react", "tailwind"],
    }),
    repo(102, "reportes-ventas", "onilabs", {
      homepage: "https://reportes-ventas.vercel.app", language: "TypeScript",
      topics: ["onilabs-portfolio", "nextjs"],
    }),
    repo(103, "juego-memoria", "onilabs", {
      description: "Juego archived para probar la exclusión.", language: "JavaScript",
      topics: ["onilabs-portfolio"], archived: true,
    }),
    repo(104, "labs-cms", "onilabs", {
      description: "CMS disabled para probar la exclusión.", language: "TypeScript",
      topics: ["onilabs-portfolio"], disabled: true,
    }),
    repo(105, "sin-topico", "onilabs", {
      description: "Repositorio sin el topico del portfolio.", language: "Go",
      topics: ["web", "demo"],
    }),
    repo(107, "portal-intra", "onilabs", {
      description: "Portal interno sin deployments de produccion.", language: "TypeScript",
      topics: ["onilabs-portfolio"],
    }),
  ],
  2: [
    repo(201, "clinica-nova", "labouno", {
      description: "Segunda demo con el mismo nombre para probar colisiones de slug.",
      homepage: "https://clinica-nova.alt.example.com", language: "Astro",
      topics: ["onilabs-portfolio", "astro"],
    }),
    repo(202, "catalogo-web", "onilabs", {
      description: "Catálogo con filtros por categoría.",
      homepage: "https://catalogo.onilabs.example.com", language: "PHP",
      topics: ["onilabs-portfolio", "ecommerce", "wordpress"],
    }),
    repo(204, "informe-anual", "labouno", {
      description: "Landing cuyo deploy de produccion sigue en build.", language: "JavaScript",
      topics: ["onilabs-portfolio", "landing"],
    }),
  ],
};

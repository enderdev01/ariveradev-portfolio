// Offline Vercel API double for the discovery test files.
//
// `project()` and `deployment()` build entries with the exact raw shapes of
// GET /v9/projects and GET /v6/deployments items: one row per deployment and
// one compact block per project. Values mirror the former
// fixtures/discovery.json data. Note the intentional shape variants kept as
// raw keys: prj_alpha uses the `alias` spelling, prj_beta uses `aliases`, and
// dpl_beta_1 uses `state` instead of `readyState`.
//
// Exports are merged into the router's `fixture` object by
// discovery-router.mjs.

function project(id, name, link = null, production = null) {
  return {
    id,
    name,
    ...(link ? { link } : {}),
    ...(production ? { targets: { production } } : {}),
  };
}

function deployment(id, url, createdAt, { readyState = "READY", state = null } = {}) {
  return { id, url, createdAt, ...(state ? { state } : { readyState }) };
}

export const vercelToken = "fixture-vercel-token";
export const vercelTeamId = "team_fixture";

export const vercelProjectPages = {
  1: {
    projects: [
      project(
        "prj_alpha", "clinica-nova",
        { type: "github", repoId: 101, org: "onilabs", repo: "clinica-nova" },
        {
          alias: ["clinica-nova.vercel.app", "clinica-nova.example.com"],
          url: "clinica-nova-git-main-onilabs.vercel.app",
        }
      ),
      project(
        "prj_beta", "reportes-ventas",
        { type: "github", org: "github.com/onilabs", repo: "reportes-ventas.git" },
        { aliases: ["reportes-ventas.vercel.app"], url: "reportes-ventas-f00x.vercel.app" }
      ),
      project(
        "prj_gama", "portal-intra",
        { type: "github", repoId: 107, org: "onilabs", repo: "portal-intra" },
        { aliases: ["portal-intra.vercel.app"] }
      ),
      project(
        "prj_delta", "clinica-nova-lab",
        { type: "github", repoId: 201, org: "labouno", repo: "clinica-nova" },
        { aliases: ["clinica-nova.alt.example.com", "clinica-nova-lab.vercel.app"] }
      ),
      project(
        "prj_zeta", "catalogo-web",
        { type: "github", repoId: 202, org: "onilabs", repo: "catalogo-web" },
        { aliases: ["catalogo-web.vercel.app", "catalogo.onilabs.example.com"] }
      ),
      project(
        "prj_theta", "informe-anual",
        { type: "github", repoId: 204, org: "labouno", repo: "informe-anual" },
        { aliases: ["informe-anual.vercel.app"] }
      ),
      project("prj_omega", "proyecto-sin-repo"),
    ],
    pagination: { count: 7, next: 2 },
  },
  2: { projects: [], pagination: { count: 0, next: null } },
};

export const vercelDeploymentsByProjectId = {
  prj_alpha: {
    deployments: [
      deployment("dpl_alpha_1", "clinica-nova-old.vercel.app", 1700000000000),
      deployment("dpl_alpha_2", "clinica-nova-f00x.vercel.app", 1710000000000),
    ],
  },
  prj_beta: {
    deployments: [deployment("dpl_beta_1", "reportes-ventas-f00x.vercel.app", 1700000000000, { state: "READY" })],
  },
  prj_gama: { deployments: [] },
  prj_delta: {
    deployments: [deployment("dpl_delta_9", "clinica-nova-lab-f00x.vercel.app", 1690000000000)],
  },
  prj_zeta: {
    deployments: [deployment("dpl_zeta_1", "catalogo-web-f00x.vercel.app", 1680000000000)],
  },
  prj_theta: {
    deployments: [deployment("dpl_theta_9", "informe-anual-f00x.vercel.app", 1670000000000, { readyState: "BUILDING" })],
  },
};

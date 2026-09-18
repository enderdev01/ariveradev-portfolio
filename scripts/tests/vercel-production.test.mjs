// Offline node:test suite for scripts/lib/vercel-production.mjs: production
// deployment READY resolution, deterministic newest-first selection and
// production URL / allowed-origin picking. Every network boundary is faked
// from the offline API doubles in fixtures/discovery-*.mjs.

import test from "node:test";
import assert from "node:assert/strict";
import { DiscoveryError } from "../lib/github-discovery.mjs";
import {
  deriveAllowedOrigins,
  pickProductionUrl,
  resolveProductionDeployment,
} from "../lib/vercel-production.mjs";
import { fixture, makeRouter } from "./fixtures/discovery-router.mjs";

// --- Deployment resolution -------------------------------------------------------

test("deployment selection sorts deterministically: newest createdAt, id tie-break", async () => {
  const router = makeRouter();
  // Fixture prj_alpha lists the OLDER deployment first; the newest must win.
  const alpha = await resolveProductionDeployment({
    fetchImpl: router.fetchImpl,
    token: fixture.vercelToken,
    project: { id: "prj_alpha", production: { aliases: [] } },
  });
  assert.equal(alpha.url, "clinica-nova-f00x.vercel.app");
  assert.equal(alpha.createdAt, 1710000000000);

  const tieRouter = makeRouter({
    deploymentsBodyByProjectId: {
      prj_tie: {
        deployments: [
          { id: "dpl_a", readyState: "READY", createdAt: 100 },
          { id: "dpl_b", readyState: "READY", createdAt: 100 },
        ],
      },
    },
  });
  const tie = await resolveProductionDeployment({
    fetchImpl: tieRouter.fetchImpl,
    token: fixture.vercelToken,
    project: { id: "prj_tie", production: { aliases: [] } },
  });
  assert.equal(tie.ok, true);
  assert.equal(tie.url, null, "tie-break picks dpl_b; neither entry carries a url field");
});

test("production deployment resolution: READY via readyState and state", async () => {
  const router = makeRouter();
  const alpha = await resolveProductionDeployment({
    fetchImpl: router.fetchImpl,
    token: fixture.vercelToken,
    project: { id: "prj_alpha", production: { aliases: [], url: "clinica-nova-git-main-onilabs.vercel.app" } },
  });
  assert.deepEqual(alpha, {
    ok: true,
    projectId: "prj_alpha",
    url: "clinica-nova-f00x.vercel.app",
    readyState: "READY",
    createdAt: 1710000000000,
  });
  const beta = await resolveProductionDeployment({
    fetchImpl: router.fetchImpl,
    token: fixture.vercelToken,
    project: { id: "prj_beta", production: { aliases: [], url: "reportes-ventas-f00x.vercel.app" } },
  });
  assert.equal(beta.ok, true);
  assert.equal(beta.readyState, "READY");
});

test("production deployment resolution: structured skips", async () => {
  const router = makeRouter();
  const empty = await resolveProductionDeployment({
    fetchImpl: router.fetchImpl,
    token: fixture.vercelToken,
    project: { id: "prj_gama" },
  });
  assert.deepEqual(empty, { ok: false, reason: "vercel-no-production-deployment" });
  const building = await resolveProductionDeployment({
    fetchImpl: router.fetchImpl,
    token: fixture.vercelToken,
    project: { id: "prj_theta" },
  });
  assert.equal(building.ok, false);
  assert.equal(building.reason, "vercel-production-not-ready");
  assert.equal(building.state, "BUILDING");
});

test("invalid deployment shape aborts resolution", async () => {
  const routerOptions = {
    deploymentsBodyByProjectId: { prj_alpha: { deployments: [{ id: "dpl_x" }] } },
  };
  await assert.rejects(
    resolveProductionDeployment({
      fetchImpl: makeRouter(routerOptions).fetchImpl,
      token: fixture.vercelToken,
      project: { id: "prj_alpha" },
    }),
    /unexpected shape.*readyState\/state/
  );
});

test("production deployment HTTP failure aborts", async () => {
  const router = makeRouter({ vercelStatus: 500 });
  await assert.rejects(
    resolveProductionDeployment({
      fetchImpl: router.fetchImpl,
      token: fixture.vercelToken,
      project: { id: "prj_alpha" },
    }),
    DiscoveryError
  );
});

// --- URL & origin selection ---------------------------------------------------------

test("pickProductionUrl prefers custom domains deterministically", () => {
  assert.equal(pickProductionUrl({ aliases: ["app.vercel.app", "zeta.example.com", "alpha.example.com"] }), "https://alpha.example.com");
  assert.equal(pickProductionUrl({ aliases: ["app.vercel.app"] }), "https://app.vercel.app");
  assert.equal(pickProductionUrl({ aliases: [], url: "deploy-f00x.vercel.app" }), "https://deploy-f00x.vercel.app");
  assert.equal(pickProductionUrl({ aliases: ["not a host", "ok.example.com"] }), "https://ok.example.com");
  assert.equal(pickProductionUrl({ aliases: [], url: null }), null);
});

test("deriveAllowedOrigins dedupes and sorts", () => {
  assert.deepEqual(
    deriveAllowedOrigins({
      productionUrl: "https://b.example.com",
      aliases: ["b.example.com", "a.vercel.app"],
      url: "deploy-f00x.vercel.app",
    }),
    ["https://a.vercel.app", "https://b.example.com", "https://deploy-f00x.vercel.app"]
  );
});

// Offline node:test suite for the portfolio discovery orchestrator
// (scripts/lib/portfolio-discovery.mjs) happy paths: full fixture-driven
// discovery, source record shape, determinism, privacy and card/SEO fallbacks.
// Deployed-HTML validation, the published-skip guard and card-title derivation
// live in portfolio-deployed-meta.test.mjs; run-level abort semantics in
// portfolio-discovery-aborts.test.mjs.

import test from "node:test";
import assert from "node:assert/strict";
import { discoverPortfolio, deriveRepoCardName, resolveNonVercelOrigin } from "../lib/portfolio-discovery.mjs";
import { stripPrivateIdentity } from "../lib/portfolio-deployed-meta.mjs";
import { deriveGradient } from "../lib/portfolio-classify.mjs";
import { fixture, makeRouter } from "./fixtures/discovery-router.mjs";

function runDiscovery(routerOptions = {}) {
  const router = makeRouter(routerOptions);
  const result = discoverPortfolio({
    githubToken: fixture.githubToken,
    vercelToken: fixture.vercelToken,
    vercelTeamId: fixture.vercelTeamId,
    fetchImpl: router.fetchImpl,
  });
  return { router, result };
}

// --- Non-Vercel origins --------------------------------------------------------

const repoWith = (overrides) => ({
  id: 1,
  name: "butacas-libres",
  fullName: "enderdev01/butacas-libres",
  owner: "enderdev01",
  description: "d",
  homepage: null,
  hasPages: false,
  htmlUrl: "https://github.com/enderdev01/butacas-libres",
  ...overrides,
});

test("resolveNonVercelOrigin prefers the declared homepage", () => {
  const origin = resolveNonVercelOrigin(
    repoWith({ homepage: "https://www.ecoshipperu.com/productos", hasPages: true })
  );
  assert.equal(origin.kind, "homepage");
  assert.equal(origin.productionUrl, "https://www.ecoshipperu.com/productos");
  assert.deepEqual(origin.allowedOrigins, ["https://www.ecoshipperu.com"]);
  assert.equal(origin.fetchDeployedPage, true);
});

test("resolveNonVercelOrigin falls back to GitHub Pages", () => {
  const origin = resolveNonVercelOrigin(repoWith({ hasPages: true }));
  assert.equal(origin.kind, "github-pages");
  assert.equal(origin.productionUrl, "https://enderdev01.github.io/butacas-libres/");
  assert.equal(origin.fetchDeployedPage, true);
});

test("resolveNonVercelOrigin falls back to the repository itself when nothing is deployed", () => {
  // Choosing not to deploy is a legitimate decision: the card links to the project.
  const origin = resolveNonVercelOrigin(repoWith({}));
  assert.equal(origin.kind, "repository");
  assert.equal(origin.productionUrl, "https://github.com/enderdev01/butacas-libres");
  // There is no deployed page to read, so the card is derived from the repository.
  assert.equal(origin.fetchDeployedPage, false);
});

test("resolveNonVercelOrigin never trusts a malformed homepage", () => {
  for (const homepage of ["not a url", "javascript:alert(1)", "ftp://x.example.com", "https://"]) {
    assert.equal(resolveNonVercelOrigin(repoWith({ homepage })).kind, "repository", homepage);
  }
  assert.equal(resolveNonVercelOrigin(repoWith({ htmlUrl: null })), null);
});

test("deriveRepoCardName makes the repository name readable", () => {
  assert.equal(deriveRepoCardName({ name: "butacas-libres" }), "Butacas Libres");
  assert.equal(deriveRepoCardName({ name: "ecoshipperu_landing" }), "Ecoshipperu Landing");
  assert.equal(deriveRepoCardName({ name: "selnote.web" }), "Selnote Web");
  assert.equal(deriveRepoCardName({}), "Proyecto");
});

// --- Full fixture discovery ---------------------------------------------------

test("a production page redirecting between the project's own origins still resolves", async () => {
  // labouno/clinica-nova resolves to its custom domain, whose Vercel project also
  // declares the .vercel.app alias. An apex -> www style redirect between the
  // project's own origins is normal and must not skip the project.
  const { result } = runDiscovery({
    htmlOverrides: {
      "https://clinica-nova.alt.example.com": {
        body: "<title>Clínica Nova — salud digital con agendamiento</title>",
        finalUrl: "https://clinica-nova-lab.vercel.app/",
      },
    },
  });
  const { sources, skipped } = await result;

  assert.equal(
    skipped.some((entry) => entry.projectId === 201),
    false,
    "a redirect inside the project's own origins must not skip it"
  );
  const redirected = sources.find((source) => source.projectId === 201);
  assert.ok(redirected, "the redirected project resolves into a source");
  assert.equal(redirected.productionUrl, "https://clinica-nova.alt.example.com");
  assert.ok(
    redirected.allowedOrigins.includes("https://clinica-nova-lab.vercel.app"),
    "the redirect target is one of the project's own origins"
  );
});

test("discovery follows GitHub pagination and derives every ready deployment", async () => {
  const { router, result } = runDiscovery();
  const { sources, skipped } = await result;
  // Both fixture pages were requested and merged.
  const repoCalls = router.calls.filter((call) => call.url.host === "api.github.com");
  assert.deepEqual(repoCalls.map((call) => call.url.searchParams.get("page")), ["1", "2"]);
  // Only metadata endpoints are ever requested.
  assert.ok(repoCalls.every((call) => call.url.pathname === "/user/repos"));
  assert.ok(router.calls.every((call) => call.url.host !== "api.vercel.com" || ["/v9/projects", "/v6/deployments"].includes(call.url.pathname)));

  // Sorted by GitHub repo id; archive/disabled/topic-excluded repos are gone.
  assert.deepEqual(sources.map((source) => source.projectId), [101, 102, 201, 202]);
  assert.deepEqual(sources.map((source) => source.id), [
    "clinica-nova",
    "reportes-ventas",
    "clinica-nova-labouno",
    "catalogo-web",
  ]);
  // Structured skip records are reason/count-safe only (projectId + reason);
  // no repository identity.
  assert.deepEqual(skipped, [
    { projectId: 107, reason: "vercel-no-production-deployment" },
    { projectId: 204, reason: "vercel-production-not-ready" },
  ]);
  assert.ok(skipped.every((skip) => Object.keys(skip).length === 2));
});

test("discovery produces a pipeline-compatible, privacy-shaped source record", async () => {
  const { result } = runDiscovery();
  const { sources } = await result;
  const clinica = sources.find((source) => source.id === "clinica-nova");
  assert.equal(clinica.clientApproved, true, "topic selection is the approval signal");
  assert.equal(clinica.productionUrl, "https://clinica-nova.example.com", "custom domain preferred");
  assert.equal(clinica.expectedOrigin, "https://clinica-nova.example.com");
  assert.deepEqual(clinica.allowedOrigins, [
    "https://clinica-nova-f00x.vercel.app",
    "https://clinica-nova.example.com",
    "https://clinica-nova.vercel.app",
  ]);
  assert.deepEqual(clinica.github, { owner: "onilabs", repo: "clinica-nova" });
  assert.deepEqual(clinica.stack, ["JavaScript", "React", "Tailwind CSS", "Next.js"]);
  assert.deepEqual(clinica.thumbnail.gradient, deriveGradient("clinica-nova"));
  assert.deepEqual(clinica.card, {
    nombre: "Clínica Nova",
    descripcion: "Demo de una clínica digital con agendamiento de turnos.",
  });
  assert.equal(clinica.seo.slug, "clinica-nova");
  assert.equal(clinica.seo.categoria, "Proyecto web", "safe category fallback");
  assert.equal(clinica.seo.tituloSeo, "Clínica Nova — salud digital con agendamiento");
  assert.equal(clinica.seo.descripcionSeo, "Agendamiento de turnos online para clínicas.");
  assert.match(clinica.seo.desafio, /Clínica Nova/);
  assert.match(clinica.seo.enfoque, /JavaScript, React, Tailwind CSS, Next\.js/);
});

test("integration seam: discovered sources satisfy portfolio-source validation", async () => {
  const { result } = runDiscovery();
  const { sources } = await result;
  const previous = process.env.PORTFOLIO_SOURCES_EXTRA;
  process.env.PORTFOLIO_SOURCES_EXTRA = JSON.stringify(sources);
  try {
    const { loadSources } = await import("../lib/portfolio-source.mjs");
    const approved = loadSources();
    for (const source of sources) {
      const loaded = approved.find((candidate) => candidate.id === source.id);
      assert.ok(loaded, `${source.id} passes the portfolio-source approval gate`);
      assert.equal(loaded.clientApproved, true);
      assert.ok(Array.isArray(loaded.stack) && loaded.stack.length > 0, "non-empty stack");
      assert.equal(loaded.productionUrl, source.productionUrl);
      assert.equal(loaded.seo.slug, source.seo.slug);
    }
  } finally {
    if (previous === undefined) delete process.env.PORTFOLIO_SOURCES_EXTRA;
    else process.env.PORTFOLIO_SOURCES_EXTRA = previous;
  }
});

test("repeated discovery is byte-identical", async () => {
  const first = await runDiscovery().result;
  const second = await runDiscovery().result;
  assert.equal(JSON.stringify(first), JSON.stringify(second));
});

test("stripPrivateIdentity omits GitHub identity and keeps the rest", async () => {
  const { result } = runDiscovery();
  const { sources } = await result;
  const publicRecord = stripPrivateIdentity(sources[0]);
  assert.equal("github" in publicRecord, false);
  assert.deepEqual(Object.keys(publicRecord), [
    "id",
    "projectId",
    "clientApproved",
    "productionUrl",
    "expectedOrigin",
    "allowedOrigins",
    "stack",
    "thumbnail",
    "card",
    "seo",
  ]);
});

// --- Derived fields -------------------------------------------------------------

test("slug collisions get a deterministic owner suffix", async () => {
  const { result } = runDiscovery();
  const { sources } = await result;
  // Two repos named clinica-nova; the second (labouno, id 201) gets the suffix.
  assert.equal(sources.filter((source) => source.seo.slug === "clinica-nova").length, 1);
  assert.equal(sources.find((source) => source.projectId === 201).seo.slug, "clinica-nova-labouno");
});

test("card fields fall back: description from repo, then deployed meta, then derived", async () => {
  const { result } = runDiscovery();
  const { sources } = await result;
  // reportes-ventas has no repo description and no meta description.
  const reportes = sources.find((source) => source.id === "reportes-ventas");
  assert.equal(reportes.card.nombre, "Reportes de Ventas");
  assert.equal(
    reportes.card.descripcion,
    "Reportes de Ventas: proyecto web publicado como demo del portfolio."
  );
  assert.equal(reportes.seo.descripcionSeo, reportes.card.descripcion);
  // catalogo-web has a repo description but no meta description.
  const catalogo = sources.find((source) => source.id === "catalogo-web");
  assert.equal(catalogo.card.descripcion, "Catálogo con filtros por categoría.");
  assert.equal(catalogo.seo.descripcionSeo, "Catálogo con filtros por categoría.");
});

test("category and stack derive from topics, language and HTML fingerprints", async () => {
  const { result } = runDiscovery();
  const { sources } = await result;
  const catalogo = sources.find((source) => source.id === "catalogo-web");
  assert.equal(catalogo.seo.categoria, "Ecommerce");
  assert.deepEqual(catalogo.stack, ["PHP", "WordPress"]);
  const reportes = sources.find((source) => source.id === "reportes-ventas");
  assert.deepEqual(reportes.stack, ["TypeScript", "Next.js", "Vue"]);
  assert.equal(reportes.productionUrl, "https://reportes-ventas.vercel.app", "vercel.app fallback");
});

test("discovery narratives never claim metrics or outcomes", async () => {
  const { result } = runDiscovery();
  const { sources } = await result;
  for (const source of sources) {
    const narrative = `${source.seo.desafio} ${source.seo.enfoque}`;
    assert.doesNotMatch(narrative, /[0-9%]/);
    assert.doesNotMatch(narrative, /aument|increment|triplic|duplic|creci|conversi/i);
    assert.ok(source.seo.desafio.length > 40);
    assert.ok(source.seo.enfoque.length > 40);
  }
});

// --- Token confinement ------------------------------------------------------------

test("tokens are sent only as headers to their own service", async () => {
  const { router, result } = runDiscovery();
  const { skipped } = await result;
  assert.ok(skipped.length > 0, "fixture run completes with structured skips");
  for (const call of router.calls) {
    if (call.url.host === "api.github.com") {
      assert.equal(call.headers.Authorization, `Bearer ${fixture.githubToken}`);
    } else if (call.url.host === "api.vercel.com") {
      assert.equal(call.headers.Authorization, `Bearer ${fixture.vercelToken}`);
    } else {
      assert.equal(call.headers.Authorization, undefined, "production HTML fetch carries no token");
    }
  }
  // No token ever leaks into a URL.
  assert.ok(router.calls.every((call) => !call.url.toString().includes("token")));
});

// --- Injectable inputs -------------------------------------------------------------

test("teamId is optional: discovery runs without VERCEL_TEAM_ID", async () => {
  const router = makeRouter();
  const { sources } = await discoverPortfolio({
    githubToken: fixture.githubToken,
    vercelToken: fixture.vercelToken,
    fetchImpl: router.fetchImpl,
  });
  const vercelCalls = router.calls.filter((call) => call.url.host === "api.vercel.com");
  assert.ok(vercelCalls.length > 0);
  assert.ok(vercelCalls.every((call) => call.url.searchParams.get("teamId") === null));
  assert.equal(sources.length, 4);
});

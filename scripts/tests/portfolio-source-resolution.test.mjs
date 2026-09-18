// Offline node:test suite for scripts/lib/portfolio-source-resolution.mjs:
// the fail-closed discovery gate, the migration-mode resolution and the
// deterministic discovery/manual merge. No network, no writes. Source loading
// itself is covered in portfolio-registry.test.mjs.

import test from "node:test";
import assert from "node:assert/strict";
import {
  discoveredProvidedIds,
  mergeSources,
  resolveDiscoveryGate,
  resolveSyncSources,
} from "../lib/portfolio-source-resolution.mjs";
import { loadSources } from "../lib/portfolio-registry.mjs";
import { buildRecord } from "../lib/portfolio-record.mjs";

// Shaped exactly like the committed manual registry entry.
const manualSource = {
  id: "hakui-medical",
  projectId: 19,
  clientApproved: true,
  productionUrl: "https://hakui-medical.vercel.app",
  expectedOrigin: "https://hakui-medical.vercel.app",
  github: { owner: "enderdev01", repo: "hakui-medical" },
  stack: ["Astro", "React", "Sass", "Vitest"],
  thumbnail: { gradient: ["#0B1224", "#132A5E", "#0E7490"] },
  card: {
    nombre: "Hakui Medical",
    descripcion: "Demo comercial de una clínica ambulatoria ficticia.",
  },
  seo: { slug: "hakui-medical", categoria: "Landing de producto" },
};

// Shaped exactly like a source emitted by discoverPortfolio: derived narrative,
// deployed SEO texts and Vercel alias allowedOrigins included.
const discoveredSource = {
  id: "clinica-nova",
  projectId: 9012345,
  clientApproved: true,
  productionUrl: "https://clinica-nova.example.com",
  expectedOrigin: "https://clinica-nova.example.com",
  allowedOrigins: [
    "https://clinica-nova-f00x.vercel.app",
    "https://clinica-nova.example.com",
    "https://clinica-nova.vercel.app",
  ],
  github: { owner: "onilabs", repo: "clinica-nova" },
  stack: ["JavaScript", "React", "Tailwind CSS", "Next.js"],
  thumbnail: { gradient: ["#0F172A", "#1E3A8A", "#0EA5E9"] },
  card: {
    nombre: "Clínica Nova",
    descripcion: "Demo de una clínica digital con agendamiento de turnos.",
  },
  seo: {
    slug: "clinica-nova",
    categoria: "Proyecto web",
    tituloSeo: "Clínica Nova — salud digital con agendamiento",
    descripcionSeo: "Clínica Nova — salud digital con agendamiento",
    desafio:
      "Una clínica digital como Clínica Nova tiene que explicar en segundos qué servicios ofrece y cómo agendar, sin que la primera pantalla prometa más de lo que el sitio muestra.",
    enfoque:
      "El sitio de Clínica Nova se construyó con JavaScript, React, Tailwind CSS y Next.js, centrado en una jerarquía de información clara y un recorrido de uso sin pasos de más.",
  },
};

function discoveredVariant(overrides) {
  return {
    ...discoveredSource,
    ...overrides,
    seo: { ...discoveredSource.seo, ...(overrides.seo ?? {}) },
  };
}

// A discovered source that collides with the manual registry entry for the same
// project: same published slug, different GitHub id.
const discoveredHakui = discoveredVariant({
  id: "hakui-medical",
  projectId: 1366664326,
  github: { owner: "enderdev01", repo: "hakui-medical" },
  seo: { slug: "hakui-medical" },
});

test("discoveredProvidedIds keeps only the discovered sources that reached the published list", () => {
  const merged = mergeSources({ manual: [manualSource], discovered: [discoveredHakui, discoveredSource] });
  const ids = discoveredProvidedIds({ discoveredSources: [discoveredHakui, discoveredSource], sources: merged });

  assert.deepEqual([...ids], ["clinica-nova"], "the surviving discovered source keeps its derived metadata");
  assert.equal(ids.has("hakui-medical"), false, "the one dropped by the manual override does not");
  assert.equal(merged.includes(manualSource), true, "the manual entry is what gets published");
});

test("discoveredProvidedIds is empty without discovery", () => {
  assert.equal(discoveredProvidedIds({ discoveredSources: null, sources: [manualSource] }).size, 0);
  assert.equal(discoveredProvidedIds().size, 0);
});

test("regression: a discovered source dropped by the manual override does not blank the published copy", () => {
  const merged = mergeSources({ manual: [manualSource], discovered: [discoveredHakui] });
  const published = merged.find((source) => source.seo.slug === "hakui-medical");
  assert.equal(published, manualSource, "the manual entry is published, and it declares no SEO texts");

  // This is the decision the sync makes before fetching the deployed page.
  const ids = discoveredProvidedIds({ discoveredSources: [discoveredHakui], sources: merged });
  assert.equal(
    ids.has("hakui-medical"),
    false,
    "the dropped discovered source must not suppress the fetch"
  );

  // Deriving it from the pre-merge discovery list instead is exactly the bug:
  // the fetch is skipped, and the record falls through to the empty fallback.
  const preMergeIds = new Set([discoveredHakui].map((source) => source.id));
  assert.equal(preMergeIds.has("hakui-medical"), true);
  assert.equal(buildRecord(manualSource, null).seo.tituloSeo, "");
  assert.equal(buildRecord(manualSource, null).seo.descripcionSeo, "");

  // With the fetch performed, the deployed copy is what gets published.
  const deployedMeta = { title: "Hakui Medical — copy from the deployed page", description: "Descripción deployada" };
  assert.equal(buildRecord(manualSource, deployedMeta).seo.tituloSeo, deployedMeta.title);
  assert.equal(buildRecord(manualSource, deployedMeta).seo.descripcionSeo, deployedMeta.description);
});

// --- Fail-closed discovery gate -------------------------------------------------------

test("absent VERCEL_TOKEN keeps migration mode: manual-only fallback is allowed", () => {
  assert.deepEqual(resolveDiscoveryGate({ vercelToken: "", githubToken: "" }), {
    discoveryEnabled: false,
  });
  assert.deepEqual(resolveDiscoveryGate({ vercelToken: null, githubToken: "x" }), {
    discoveryEnabled: false,
  });

  // Migration mode resolves manual sources with a warning; this is the only
  // path where a manual-only sync is legal.
  const resolved = resolveSyncSources({
    manualSources: [manualSource],
    discoveredSources: null,
    discoveryAttempted: false,
    vercelEnabled: false,
  });
  assert.deepEqual(resolved, [manualSource]);
});

test("VERCEL_TOKEN without an explicit PORTFOLIO_GITHUB_TOKEN aborts safely", () => {
  assert.throws(
    () => resolveDiscoveryGate({ vercelToken: "vercel-token", githubToken: "" }),
    /PORTFOLIO_GITHUB_TOKEN is missing: auto-discovery requires an explicitly configured GitHub token/
  );
  assert.throws(
    () => resolveDiscoveryGate({ vercelToken: "vercel-token" }),
    /explicitly configured GitHub token/
  );
});

test("VERCEL_TOKEN + PORTFOLIO_GITHUB_TOKEN enables discovery", () => {
  assert.deepEqual(resolveDiscoveryGate({ vercelToken: "v", githubToken: "g" }), {
    discoveryEnabled: true,
  });
});

test("no discovery: manual registry sources are used only in migration mode", () => {
  const manual = loadSources({ allowEmpty: true });
  const resolved = resolveSyncSources({
    manualSources: manual,
    discoveredSources: null,
    discoveryAttempted: false,
    vercelEnabled: false,
  });
  assert.equal(resolved, manual, "manual sources pass through untouched");

  // A completely empty manual registry without discovery is a hard failure.
  assert.throws(
    () =>
      resolveSyncSources({
        manualSources: [],
        discoveredSources: null,
        discoveryAttempted: false,
        vercelEnabled: false,
      }),
    /nothing to sync/
  );
});

test("fail-closed: with VERCEL_TOKEN configured, an unattempted/failed discovery never regenerates manual-only data", () => {
  // This is the exact main() shape when discovery throws: attempted=false,
  // vercelEnabled=true. It must abort instead of falling back to the manual
  // registry (which would temporarily delete previously discovered projects
  // from the generated JSON). No source list is ever returned.
  assert.throws(
    () =>
      resolveSyncSources({
        manualSources: [manualSource],
        discoveredSources: null,
        discoveryAttempted: false,
        vercelEnabled: true,
      }),
    /aborting before any write to avoid regenerating a manual-only JSON/
  );

  // Same guard even when a partial discovered list is present but the run did
  // not complete: there is no silent manual-only path.
  assert.throws(
    () =>
      resolveSyncSources({
        manualSources: [manualSource],
        discoveredSources: [discoveredSource],
        discoveryAttempted: false,
        vercelEnabled: true,
      }),
    /aborting before any write/
  );
});

test("discovery-error fail-closed: a DiscoveryError from discovery aborts the sync flow", () => {
  // Structural proof of the fail-closed contract, offline: with VERCEL_TOKEN
  // configured, discoverPortfolio's DiscoveryError propagates out of main()
  // (no catch-and-fallback exists in sync-portfolio.mjs) and the resolved
  // source list is never produced, so stageAndInstall/artifact writes are
  // never reached and committed artifacts stay untouched.
  const gate = resolveDiscoveryGate({ vercelToken: "v", githubToken: "g" });
  assert.equal(gate.discoveryEnabled, true);

  // Simulates the aborted discovery: the sync-level resolver receives the same
  // state a DiscoveryError path would produce and must fail closed.
  assert.throws(
    () =>
      resolveSyncSources({
        manualSources: [manualSource],
        discoveredSources: null,
        discoveryAttempted: false,
        vercelEnabled: true,
      }),
    (error) => /aborting before any write/.test(error.message)
  );
});

test("empty manual registry is valid when discovery yields sources", () => {
  const merged = mergeSources({ manual: [], discovered: [discoveredSource] });
  assert.deepEqual(merged.map((source) => source.id), ["clinica-nova"]);
  assert.equal(merged[0].clientApproved, true);
});

test("sync fails only when the merged source list is empty", () => {
  assert.throws(
    () =>
      resolveSyncSources({
        manualSources: [],
        discoveredSources: [],
        discoveryAttempted: true,
      }),
    /nothing to sync/
  );
});

// --- Deterministic merge & override ---------------------------------------------------

test("manual entries win over discovered entries on every identity key", () => {
  const manual = [{ ...manualSource }];
  const collisions = [
    // Same GitHub owner/repo.
    discoveredVariant({
      id: "por-repo",
      projectId: 9000001,
      github: { owner: "enderdev01", repo: "hakui-medical" },
      seo: { ...discoveredSource.seo, slug: "por-repo" },
    }),
    // Same source id.
    discoveredVariant({ id: "hakui-medical", projectId: 9000002, github: { owner: "otro", repo: "clinica-nova" } }),
    // Same SEO slug.
    discoveredVariant({ id: "por-slug", projectId: 9000003, github: { owner: "otro", repo: "clinica-nova" }, seo: { ...discoveredSource.seo, slug: "hakui-medical" } }),
    // Same numeric projectId.
    discoveredVariant({ id: "por-proyecto", projectId: 19, github: { owner: "otro", repo: "clinica-nova" } }),
  ];
  const survivor = discoveredVariant({ id: "catalogo-web", projectId: 9000004 });

  const merged = mergeSources({ manual, discovered: [...collisions, survivor] });
  assert.deepEqual(merged.map((source) => source.id), ["hakui-medical", "catalogo-web"]);
  assert.ok(merged.every((source) => source.clientApproved === true));
});

test("merged list is sorted by numeric projectId and byte-deterministic", () => {
  const manual = [discoveredVariant({ id: "b", projectId: 20, github: { owner: "o", repo: "b" }, seo: { slug: "b" } })];
  const discovered = [
    discoveredVariant({ id: "c", projectId: 30, github: { owner: "o", repo: "c" }, seo: { slug: "c" } }),
    discoveredVariant({ id: "a", projectId: 10, github: { owner: "o", repo: "a" }, seo: { slug: "a" } }),
  ];
  const first = mergeSources({ manual, discovered });
  const second = mergeSources({ manual, discovered });
  assert.deepEqual(first.map((source) => source.projectId), [10, 20, 30]);
  assert.equal(JSON.stringify(first), JSON.stringify(second));
});

test("a collision between two discovered sources fails instead of duplicating an id", () => {
  assert.throws(
    () =>
      mergeSources({
        manual: [],
        discovered: [
          discoveredVariant({ id: "duplicado" }),
          discoveredVariant({ id: "duplicado", projectId: 9012346 }),
        ],
      }),
    /Duplicate source id "duplicado"/
  );
});

// Offline node:test suite for the real sync-module seam
// (scripts/sync-portfolio.mjs), the published-skip guard wiring and the
// fail-closed committed-JSON reading. Importing the sync module must never
// execute main() as a side effect; no test touches the network, a browser or
// an artifact. The workflow secret confinement is covered in
// sync-workflow.test.mjs.

import test from "node:test";
import assert from "node:assert/strict";
import {
  mkdtempSync as fsMkdtempSync,
  readFileSync,
  rmSync as fsRmSync,
  writeFileSync as fsWriteFileSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DEFAULT_TOPIC } from "../lib/portfolio-discovery.mjs";
import { assertNoPublishedProjectSkipped } from "../lib/portfolio-deployed-meta.mjs";
import {
  runDiscovery,
  runDiscoveryWithPublishedGuard,
  resolveAuthoredSources,
  readCommittedProjectIds,
} from "../sync-portfolio.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));

// Shaped exactly like a source emitted by discoverPortfolio.
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
    descripcionSeo: "Agendamiento de turnos online para clínicas.",
  },
};

// --- Import safety -----------------------------------------------------------------

test("sync module import does not execute main() as a side effect", () => {
  // Importing already happened at the top of this file; if main() had run as a
  // side effect it would have attempted Playwright capture/network work. The
  // exported helpers exist and the module finished loading.
  assert.equal(typeof runDiscovery, "function");
  assert.equal(typeof runDiscoveryWithPublishedGuard, "function");
  assert.equal(typeof readCommittedProjectIds, "function");
});

// --- Sync seam: discovery result -> published-skip guard ----------------------------

test("sync seam: discovery result shape reaches the published-skip guard", async () => {
  // Real committed generated JSON is read by the sync module itself. Assert the
  // invariants, not a literal list: the automated sync is designed to append
  // projects to this file, so hardcoding its contents makes every successful sync
  // leave the suite red.
  const committedIds = readCommittedProjectIds();
  assert.ok(Array.isArray(committedIds), "reads the committed project ids");
  assert.ok(
    committedIds.every((id) => Number.isInteger(id) && id > 0),
    "every committed project id is a positive integer"
  );
  assert.ok(
    committedIds.includes(19),
    "the published hakui-medical entry is among the committed ids"
  );
  assert.equal(
    new Set(committedIds).size,
    committedIds.length,
    "committed project ids are unique"
  );

  // Seam shape: runDiscovery returns { sources, skipped } exactly as the guard
  // and the main() caller expect.
  const fakeDiscovery = {
    sources: [discoveredSource],
    skipped: [{ projectId: 9019999, reason: "vercel-production-not-ready" }],
  };
  const discovery = await runDiscoveryWithPublishedGuard({
    githubToken: "g",
    vercelToken: "v",
    committedProjectIds: readCommittedProjectIds(),
    discoverImpl: async () => fakeDiscovery,
  });
  assert.deepEqual(discovery, fakeDiscovery, "result shape flows through the seam");

  // The same seam aborts when the skipped projectId is already published.
  const publishedSkip = {
    sources: [discoveredSource],
    skipped: [{ projectId: 19, reason: "vercel-production-not-ready" }],
  };
  await assert.rejects(
    runDiscoveryWithPublishedGuard({
      githubToken: "g",
      vercelToken: "v",
      committedProjectIds: readCommittedProjectIds(),
      discoverImpl: async () => publishedSkip,
    }),
    (error) => /projectId 19 \(vercel-production-not-ready\).*aborting before any write/.test(error.message)
  );
});

test("sync seam: runDiscovery returns { sources, skipped } matching its caller", async () => {
  let logged = [];
  const originalLog = console.log;
  console.log = (...args) => logged.push(args.join(" "));
  try {
    const discovery = await runDiscovery({
      githubToken: "g",
      vercelToken: "v",
      discoverImpl: async () => ({
        sources: [discoveredSource],
        skipped: [
          { projectId: 9019999, reason: "vercel-production-not-ready" },
          { projectId: 9020000, reason: "vercel-no-production-deployment" },
        ],
      }),
    });
    // Shape matches the caller destructuring in main().
    assert.ok(Array.isArray(discovery.sources));
    assert.ok(Array.isArray(discovery.skipped));
    assert.deepEqual(Object.keys(discovery).sort(), ["skipped", "sources"]);
    // Skip logging stays identity-safe.
    for (const entry of logged.filter((line) => line.includes("Discovery skip:"))) {
      assert.doesNotMatch(entry, /onilabs|labouno|owner|repo\//i);
      assert.match(entry, /^Discovery skip: projectId \d+ \([a-z-]+\)$/);
    }
    assert.equal(logged.filter((line) => line.includes("Discovery skip:")).length, 2);
  } finally {
    console.log = originalLog;
  }
});

// --- Fail-closed committed-JSON reading -----------------------------------------------

test("readCommittedProjectIds is fail-closed and never exposes file contents", () => {
  const missingPath = path.join(os.tmpdir(), "portfolio-sync-does-not-exist.json");
  assert.deepEqual(readCommittedProjectIds(missingPath), [], "missing file -> empty set");

  const invalidFixtures = [
    // Invalid JSON.
    "{ projects: [ not json ]",
    // Invalid schema: projects is not an array.
    JSON.stringify({ schemaVersion: 1, projects: { id: 19 } }),
    // Non-numeric project id.
    JSON.stringify({ schemaVersion: 1, projects: [{ id: "hakui-medical" }] }),
    // Non-positive numeric id.
    JSON.stringify({ schemaVersion: 1, projects: [{ id: 0 }] }),
  ];
  // Scratch fixtures live in the OS temp dir and are removed afterwards.
  const scratchDir = fsMkdtempSync(path.join(os.tmpdir(), "portfolio-sync-invalid-"));
  try {
    for (const [index, content] of invalidFixtures.entries()) {
      const badPath = path.join(scratchDir, `generated-${index}.json`);
      fsWriteFileSync(badPath, content, "utf8");
      assert.throws(
        () => readCommittedProjectIds(badPath),
        (error) => {
          // Fail-closed AND content-safe: no file contents leak into errors.
          return /aborting fail-closed/.test(error.message) && !error.message.includes(content);
        }
      );
    }
  } finally {
    fsRmSync(scratchDir, { recursive: true, force: true });
  }
});

// --- Guard ordering inside main() --------------------------------------------------------

test("sync source order: published-skip guard runs before Playwright import and artifact staging", () => {
  const source = readFileSync(path.join(here, "..", "sync-portfolio.mjs"), "utf8");
  const guardIndex = source.indexOf("assertNoPublishedProjectSkipped({");
  const playwrightIndex = source.indexOf('import("playwright")');
  const stagingIndex = source.indexOf("stageAndInstall(");
  assert.ok(guardIndex > 0, "published-skip guard call is present");
  assert.ok(playwrightIndex > guardIndex, "Playwright import happens after the guard");
  assert.ok(stagingIndex > guardIndex, "artifact staging happens after the guard");
  // The guard is only wired through the seam inside main().
  assert.ok(source.includes("runDiscoveryWithPublishedGuard({"));
  // Direct CLI execution is preserved without import side effects.
  assert.ok(source.includes("isDirectExecution"));
  assert.ok(source.includes("main().catch("));
});

// --- Topic default ------------------------------------------------------------------------

test("PORTFOLIO_TOPIC default matches the configured portfolio topic", () => {
  assert.equal(DEFAULT_TOPIC, "onilabs-portfolio");
});

// --- Published-skip guard export reachability ---------------------------------------------

test("published-skip guard remains exported from the discovery pipeline for the sync seam", () => {
  assert.equal(typeof assertNoPublishedProjectSkipped, "function");
});

// --- Authored assets at the sync seam -----------------------------------------------------

// A source that carries the authored copy and the authored thumbnail slot, as
// applyAuthoredAssets produces it from the committed registry.
const authoredAsset = {
  id: "clinica-nova",
  github: { owner: "onilabs", repo: "clinica-nova" },
  seo: { categoria: "Plataforma de salud", desafio: "Desafío de autoría.", enfoque: "Enfoque de autoría." },
  thumbnail: { authored: true },
};

test("sync seam: an authored discovered source stays a published discovered source", () => {
  // Regression guard for the ordering contract: decorating first would return a
  // new object and discoveredProvidedIds() would stop recognising this source,
  // silently re-fetching a production page the sync already has.
  const discovered = { ...discoveredSource, id: "clinica-nova" };
  const merged = [discovered];
  const { sources, discoveredIds } = resolveAuthoredSources({
    merged,
    discoveredSources: [discovered],
    manualSources: [],
    assets: [authoredAsset],
  });

  assert.equal(sources[0] === merged[0], false, "the authored source is decorated");
  assert.equal(sources[0].seo.desafio, "Desafío de autoría.");
  assert.equal(sources[0].thumbnail.authored, true);
  assert.deepEqual([...discoveredIds], ["clinica-nova"], "still recognised as published");
});

test("sync seam: an undecorated source keeps its identity and its discovered metadata", () => {
  const discovered = { ...discoveredSource };
  const { sources, discoveredIds } = resolveAuthoredSources({
    merged: [discovered],
    discoveredSources: [discovered],
    manualSources: [],
    assets: [],
  });

  assert.equal(sources[0], discovered, "no asset means no copy");
  assert.deepEqual([...discoveredIds], ["clinica-nova"]);
});

test("sync seam: a source that lost the collision to the manual registry is still fetched", () => {
  // mergeSources() drops the discovered source and returns the manual entry, so
  // the manual entry has to be fetched even though discovery ran. This is the
  // behaviour the authored-asset decoration must not change.
  const manual = { ...discoveredSource, id: "clinica-nova" };
  const { sources, discoveredIds } = resolveAuthoredSources({
    merged: [manual],
    discoveredSources: [discoveredSource],
    manualSources: [manual],
    assets: [],
  });

  assert.equal(discoveredIds.size, 0, "the dropped discovered source is not published");
  assert.equal(sources[0], manual);
});

test("sync seam: main() resolves authored sources before any browser work", () => {
  const source = readFileSync(path.join(here, "..", "sync-portfolio.mjs"), "utf8");
  const authoredIndex = source.indexOf("resolveAuthoredSources({");
  const playwrightIndex = source.indexOf('await import("playwright")');
  assert.ok(authoredIndex > 0, "main() resolves authored sources");
  assert.ok(authoredIndex < playwrightIndex, "authored assets resolve before Playwright");
  assert.ok(source.includes("loadAuthoredAssets()"), "the committed registry is loaded");
});

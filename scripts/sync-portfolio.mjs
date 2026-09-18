#!/usr/bin/env node
// Portfolio sync orchestrator: regenerates the committed portfolio data from
// approved public/private sources, deterministically and without leaking
// repository identity into the generated artifact.
//
// Responsibilities live in cohesive modules under scripts/lib/:
//   - scripts/lib/portfolio-source.mjs    compatibility facade over the
//                                         registry and record modules below
//   - scripts/lib/portfolio-registry.mjs  source loading (manual registries +
//                                         auto-discovery merge), validation,
//                                         approval and the fail-closed gates
//   - scripts/lib/portfolio-record.mjs    GitHub metadata / production HTML
//                                         fetch and public-record building
//   - scripts/lib/portfolio-discovery.mjs topic-based auto-discovery and the
//                                         published-skip fail-closed guard
//   - scripts/lib/portfolio-thumbnail.mjs Playwright capture/composition of the
//                                         1920x1080 Glass Dark thumbnail
//   - scripts/lib/portfolio-artifacts.mjs staging and atomic installation of
//                                         the generated JSON and PNG files
//
// Sources come from two places, merged deterministically (manual wins):
//   - Auto-discovery (scripts/lib/portfolio-discovery.mjs): when VERCEL_TOKEN
//     and an explicit PORTFOLIO_GITHUB_TOKEN are present, topic-selected
//     GitHub repositories (PORTFOLIO_TOPIC, default onilabs-portfolio) matched
//     to READY Vercel production deployments are added as approved sources.
//     Fail-closed contract: with VERCEL_TOKEN configured, any discovery,
//     API/auth/shape or production-HTML failure aborts the sync before any
//     write, so previously discovered projects are never temporarily deleted
//     by a manual-only regeneration. A skipped projectId that is already
//     published in the committed generated JSON aborts too (published-project
//     protection); newly tagged repositories may still skip until READY.
//   - The manual registries (committed / local / env extra), which keep working
//     as a migration/override fallback. This fallback is allowed only when
//     VERCEL_TOKEN is absent: the run then warns and syncs manual sources
//     only, so main stays green until the one-time Vercel secret is configured.
//
// Per approved source it fetches GitHub repository metadata (validation-only,
// never written into the generated JSON), the public production HTML (title +
// meta description; skipped for discovered sources, which already fetched and
// validated their deployed HTML inside discovery), captures and composes the
// thumbnail, and emits deterministic JSON (stable key order, sorted by
// projectId, no timestamps).
//
// Importability: this module is safe to import in tests — main() runs only on
// direct CLI execution. The exported helpers (runDiscovery,
// runDiscoveryWithPublishedGuard, readCommittedProjectIds) let offline tests
// exercise the real sync-module seam without touching the network, a browser
// or any artifact.
//
// Publication is atomic and ordered: thumbnails are installed first and the
// JSON last, so the JSON never points at a thumbnail that has not been
// installed yet. Any file is written only when its content actually changed,
// so unchanged public content produces no diff.
//
// No source code is ever inspected: only repository metadata and the public
// production HTML are fetched.
//
// Visual stability: before staging, each newly composed PNG is compared against
// the committed thumbnail at the decoded-pixel level. If the only differences
// fit the documented rasterization-noise budget, the committed bytes are reused
// so consecutive syncs never open noisy PRs. Dimension changes or any visual
// difference beyond the budget publish the new image normally.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  loadSources,
  fetchRepoMetadata,
  fetchProductionHtml,
  buildRecord,
  resolveSyncSources,
  resolveDiscoveryGate,
} from "./lib/portfolio-source.mjs";
import {
  DEFAULT_TOPIC,
  discoverPortfolio,
} from "./lib/portfolio-discovery.mjs";
import { assertNoPublishedProjectSkipped } from "./lib/portfolio-deployed-meta.mjs";
import {
  captureAndCompose,
  diffDecodedPixels,
  isWithinNoiseBudget,
} from "./lib/portfolio-thumbnail.mjs";
import { stageAndInstall } from "./lib/portfolio-artifacts.mjs";

// Mirrors the published paths used by scripts/lib/portfolio-artifacts.mjs.
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const committedThumbnailPath = (id) => path.join(repoRoot, "public", "portfolio", `${id}.png`);
const committedGeneratedJsonPath = path.join(repoRoot, "src", "data", "portfolio.generated.json");

// Returns the committed bytes when they exist and the new capture differs from
// them only within the documented visual-equivalence noise budget; otherwise
// returns the new bytes for normal publication.
async function preserveCommittedBytesWhenEquivalent(browser, id, png) {
  const committedPath = committedThumbnailPath(id);
  if (!fs.existsSync(committedPath)) {
    return png;
  }
  const committed = fs.readFileSync(committedPath);
  if (committed.equals(png)) {
    return committed;
  }
  const stats = await diffDecodedPixels(browser, committed, png);
  if (!isWithinNoiseBudget(stats)) {
    console.log(
      `${id}.png: visual difference beyond noise budget ` +
      `(dimensionsMatch=${stats.dimensionsMatch}, differingPixels=${stats.differingPixels}, maxChannelDelta=${stats.maxChannelDelta}); publishing new image`
    );
    return png;
  }
  console.log(
    `${id}.png: rasterization noise only ` +
    `(${stats.differingPixels} differing px, max channel delta ${stats.maxChannelDelta}); preserving committed bytes`
  );
  return committed;
}

function fail(message) {
  throw new Error(message);
}

// Numeric ids of the projects currently published in the committed generated
// JSON. Fail-closed reading: a missing file yields an empty set (first run),
// while invalid JSON, an invalid schema or non-numeric ids abort the sync
// without ever exposing file contents in error messages (the committed JSON is
// a published artifact; a blind regeneration could remove published projects).
export function readCommittedProjectIds(
  generatedJsonPath = committedGeneratedJsonPath
) {
  if (!fs.existsSync(generatedJsonPath)) return [];
  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(generatedJsonPath, "utf8"));
  } catch {
    fail("Committed portfolio generated JSON is not valid JSON; aborting fail-closed");
  }
  if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.projects)) {
    fail("Committed portfolio generated JSON has an invalid schema; aborting fail-closed");
  }
  for (const project of parsed.projects) {
    if (!project || typeof project !== "object" || !Number.isInteger(project.id) || project.id <= 0) {
      fail("Committed portfolio generated JSON contains an invalid project id; aborting fail-closed");
    }
  }
  return parsed.projects.map((project) => project.id);
}

// Runs topic-based auto-discovery and returns { sources, skipped }. Skip
// records are reason/count-safe by contract (numeric projectId + reason), so
// logging them never exposes repository identity. `discoverImpl` is injectable
// for offline seam tests; production always uses discoverPortfolio.
export async function runDiscovery({
  githubToken,
  vercelToken,
  vercelTeamId,
  topic,
  discoverImpl = discoverPortfolio,
} = {}) {
  const { sources, skipped } = await discoverImpl({
    githubToken,
    vercelToken,
    vercelTeamId,
    topic,
  });
  for (const skip of skipped) {
    console.log(`Discovery skip: projectId ${skip.projectId} (${skip.reason})`);
  }
  return { sources, skipped };
}

// The actual sync-module seam: the discovery result shape ({ sources, skipped })
// flows directly into the published-skip guard, which runs here — before any
// browser capture or artifact staging happens in main(). With VERCEL_TOKEN
// configured, a transient skip of an already published project aborts the sync
// with zero writes instead of removing it from the regenerated JSON.
export async function runDiscoveryWithPublishedGuard({
  githubToken,
  vercelToken,
  vercelTeamId,
  topic,
  committedProjectIds = [],
  discoverImpl = discoverPortfolio,
} = {}) {
  const discovery = await runDiscovery({ githubToken, vercelToken, vercelTeamId, topic, discoverImpl });
  assertNoPublishedProjectSkipped({
    skipped: discovery.skipped,
    committedProjectIds,
  });
  return discovery;
}

export async function main() {
  const manualSources = loadSources({ allowEmpty: true });

  const vercelToken = process.env.VERCEL_TOKEN || "";
  const githubToken = process.env.PORTFOLIO_GITHUB_TOKEN || "";
  const vercelTeamId = process.env.VERCEL_TEAM_ID || null;
  const topic = process.env.PORTFOLIO_TOPIC || DEFAULT_TOPIC;

  // Fail-closed discovery gate: manual-only fallback exists only when
  // VERCEL_TOKEN is absent (migration mode). Once VERCEL_TOKEN is configured,
  // an explicit PORTFOLIO_GITHUB_TOKEN is mandatory and discovery must run and
  // succeed; any DiscoveryError/API/auth/shape/production-HTML failure
  // propagates and aborts the sync before a single file is written, so the
  // committed artifacts (and previously discovered projects) stay untouched.
  const gate = resolveDiscoveryGate({ vercelToken, githubToken });

  let discoveredSources = null;
  let discoveryAttempted = false;
  if (gate.discoveryEnabled) {
    // No catch-and-fallback here: a failed discovery must abort the run. The
    // published-skip guard runs inside the seam, before Playwright import and
    // artifact staging below.
    const discovery = await runDiscoveryWithPublishedGuard({
      githubToken,
      vercelToken,
      vercelTeamId,
      topic,
      committedProjectIds: readCommittedProjectIds(),
    });
    discoveredSources = discovery.sources;
    discoveryAttempted = true;
    console.log(`Discovery found ${discoveredSources.length} source(s)`);
  }

  const sources = resolveSyncSources({
    manualSources,
    discoveredSources,
    discoveryAttempted,
    vercelEnabled: gate.discoveryEnabled,
  });
  console.log(`Syncing ${sources.length} approved source(s): ${sources.map((s) => s.id).join(", ")}`);

  // Discovered sources already fetched and validated their deployed production
  // HTML inside discoverPortfolio; reuse those derived SEO texts instead of
  // fetching the same production page a second time.
  const discoveredIds = new Set((discoveredSources ?? []).map((source) => source.id));

  let playwright;
  try {
    playwright = await import("playwright");
  } catch (error) {
    fail(`Playwright is required but not installed (${error.message}). Run: npm install && npx playwright install chromium`);
  }
  const browser = await playwright.chromium.launch();

  try {
    // Phase 1: gather everything in memory. Any failure here aborts with no writes.
    const generated = [];
    const thumbnails = [];
    for (const source of sources) {
      await fetchRepoMetadata(source);
      let fetchedMeta = null;
      if (!discoveredIds.has(source.id)) {
        fetchedMeta = await fetchProductionHtml(source);
        if (!fetchedMeta.title) {
          fail(`${source.id}: production HTML has no <title> to validate`);
        }
      }
      const record = buildRecord(source, fetchedMeta);
      generated.push(record);
      const png = await preserveCommittedBytesWhenEquivalent(
        browser,
        source.id,
        await captureAndCompose(browser, source)
      );
      thumbnails.push({ id: source.id, png });
      console.log(`Captured ${source.id}: "${fetchedMeta?.title ?? source.seo.tituloSeo}"`);
    }

    // Phase 2: stage and install. Thumbnails are installed first and the JSON
    // last, so it never points at a thumbnail that has not been installed yet.
    const generatedJson = JSON.stringify(
      { schemaVersion: 1, projects: generated },
      null,
      2
    ) + "\n";
    const { imageResults, jsonChanged } = stageAndInstall(generatedJson, thumbnails);

    for (const { id, changed } of imageResults) {
      console.log(`${id}.png: ${changed ? "updated" : "unchanged"}`);
    }
    console.log(`portfolio.generated.json: ${jsonChanged ? "updated" : "unchanged"}`);
  } finally {
    await browser.close();
  }
}

// Direct CLI execution only: importing this module in tests must not run the
// sync as a side effect.
const isDirectExecution =
  process.argv[1] !== undefined &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (isDirectExecution) {
  main().catch((error) => {
    console.error(`portfolio sync aborted: ${error.message}`);
    process.exitCode = 1;
  });
}

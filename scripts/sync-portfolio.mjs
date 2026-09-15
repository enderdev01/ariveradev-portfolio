#!/usr/bin/env node
// Portfolio sync orchestrator: regenerates the committed portfolio data from
// approved public/private sources, deterministically and without leaking
// repository identity into the generated artifact.
//
// Responsibilities live in cohesive modules under scripts/lib/:
//   - scripts/lib/portfolio-source.mjs    source loading, validation, GitHub
//                                         metadata, public HTML extraction and
//                                         public-record building
//   - scripts/lib/portfolio-thumbnail.mjs Playwright capture/composition of the
//                                         1920x1080 Glass Dark thumbnail
//   - scripts/lib/portfolio-artifacts.mjs staging and atomic installation of
//                                         the generated JSON and PNG files
//
// Per approved source it fetches GitHub repository metadata (validation-only,
// never written into the generated JSON), the public production HTML (title +
// meta description), captures and composes the thumbnail, and emits
// deterministic JSON (stable key order, sorted by id, no timestamps).
//
// Publication is atomic and ordered: thumbnails are installed first and the
// JSON last, so the JSON never points at a thumbnail that has not been
// installed yet. Any file is written only when its content actually changed,
// so unchanged public content produces no diff.
//
// No source code is ever inspected: only repository metadata and the public
// production HTML are fetched.

import { loadSources, fetchRepoMetadata, fetchProductionHtml, buildRecord } from "./lib/portfolio-source.mjs";
import { captureAndCompose } from "./lib/portfolio-thumbnail.mjs";
import { stageAndInstall } from "./lib/portfolio-artifacts.mjs";

function fail(message) {
  throw new Error(message);
}

async function main() {
  const sources = loadSources();
  console.log(`Syncing ${sources.length} approved source(s): ${sources.map((s) => s.id).join(", ")}`);

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
      const fetchedMeta = await fetchProductionHtml(source);
      if (!fetchedMeta.title) {
        fail(`${source.id}: production HTML has no <title> to validate`);
      }
      const record = buildRecord(source, fetchedMeta);
      generated.push(record);
      const png = await captureAndCompose(browser, source);
      thumbnails.push({ id: source.id, png });
      console.log(`Captured ${source.id}: "${fetchedMeta.title}"`);
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

main().catch((error) => {
  console.error(`portfolio sync aborted: ${error.message}`);
  process.exitCode = 1;
});

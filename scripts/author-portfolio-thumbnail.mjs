#!/usr/bin/env node
// Manual authoring tool for hand-designed portfolio thumbnails.
//
// The sync never calls this and CI never runs it. A project whose only sensible
// thumbnail is a designed cover — rather than a screenshot of its own repository
// page — declares `thumbnail: { authored: true }` in
// scripts/portfolio-authored-assets.json, which keeps the sync from capturing and
// installing over the committed image. This tool is how that image gets made.
//
//   node scripts/author-portfolio-thumbnail.mjs butacas-libres
//
// It renders the cover below at the compositor canvas (1920x1080) and writes
// public/portfolio/<id>.png. The output is committed and reviewed as a diff; it is
// deliberately not reproducible byte-for-byte, because the pixels that matter are
// the ones a human approved.
//
// The figures in a cover must come from the project itself (its README or its
// running output). A cover is copy: inventing numbers here would be the same defect
// as inventing them in the narrative.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { AUTHORED_THUMBNAIL_SIZE, readPngSize } from "./lib/portfolio-thumbnail.mjs";
import { committedThumbnailPath } from "./lib/portfolio-artifacts.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function fail(message) {
  throw new Error(message);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Occupancy bar as the project prints it: filled blocks for occupied seats.
// Returned as raw markup (it carries its own colours), which is why the row
// renderer escapes plain strings and passes `{ raw }` cells through untouched.
const bar = (occupied, width = 8) => {
  const filled = Math.round((occupied / 100) * width);
  return { raw: `<span class="fill">${"▓".repeat(filled)}</span><span class="empty">${"░".repeat(width - filled)}</span>` };
};

const COVERS = {
  "butacas-libres": {
    // The project's deterministic palette (scripts/lib/portfolio-classify.mjs),
    // so a designed cover still belongs to the same visual family as the captures.
    gradient: ["#0B1224", "#132A5E", "#0E7490"],
    eyebrow: "Herramienta de datos",
    nombre: "butacas libres",
    tagline: "Cuántos asientos quedan en cada función, por sede y por película",
    terminalTitle: "butacas-libres — node server.js",
    // Shape of the output documented in the project's README. The column padding of
    // the raw console dump is collapsed for the cover; the figures are unchanged.
    header: "CP Alcazar · Lima · 20 funciones · 1993/4456 libres (55% ocupado)",
    columns: ["HORA", "SALA", "FORMATO", "IDIOMA", "LIBRES", "TOTAL", "OCUP."],
    rows: [
      ["12:00", "SALA 6 3D", "3D · REGULAR", "Subtitulada", "164", "265", "38%", bar(38)],
      ["12:30", "SALA 1", "2D · REGULAR", "Subtitulada", "43", "208", "79%", bar(79)],
      ["18:30", "SALA 1", "2D · REGULAR", "Subtitulada", "40", "208", "81%", bar(81)],
    ],
    footnote:
      "Lectura en vivo de Cineplanet, Cinemark y Cinépolis · plano de butacas y precios en Cineplanet · sin dependencias, sin base de datos",
  },
};

function coverHtml(cover) {
  const cell = (value) => (value && typeof value === "object" ? value.raw : escapeHtml(value));
  const row = (values, className = "row") =>
    `<div class="${className}">${values.map((value) => `<span>${cell(value)}</span>`).join("")}</div>`;
  return `<!doctype html>
<html lang="es"><head><meta charset="utf-8" /><style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: ${AUTHORED_THUMBNAIL_SIZE.width}px; height: ${AUTHORED_THUMBNAIL_SIZE.height}px;
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 40px;
    background: linear-gradient(135deg, ${cover.gradient.join(", ")});
    font-family: "SF Mono", ui-monospace, Menlo, monospace;
    padding: 76px 120px;
  }
  .head { width: 100%; max-width: 1560px; }
  .eyebrow { font: 500 20px/1 -apple-system, "Segoe UI", sans-serif; letter-spacing: .34em;
             text-transform: uppercase; color: #7DD3FC; margin-bottom: 22px; }
  h1 { font: 700 78px/1.02 -apple-system, "Segoe UI", sans-serif; letter-spacing: -.02em; color: #F8FAFC; }
  .tagline { font: 400 27px/1.4 -apple-system, "Segoe UI", sans-serif; color: #94A3B8; margin-top: 18px; }
  .panel { width: 100%; max-width: 1560px; border-radius: 20px; overflow: hidden;
           background: rgba(4, 8, 18, .86); border: 1px solid rgba(148, 163, 184, .26);
           box-shadow: 0 40px 90px -30px rgba(0, 0, 0, .85); }
  .bar { display: flex; align-items: center; gap: 10px; padding: 18px 26px;
         border-bottom: 1px solid rgba(148, 163, 184, .18); }
  .dot { width: 13px; height: 13px; border-radius: 50%; }
  .title { margin-left: 14px; font-size: 17px; color: #94A3B8; }
  .body { padding: 30px 34px 34px; }
  .out { font-size: 21px; color: #E2E8F0; padding-bottom: 20px; }
  .row { display: grid; grid-template-columns: 120px 180px 220px 210px 100px 96px 118px 180px;
         align-items: baseline; white-space: nowrap;
         font-size: 20px; color: #CBD5E1; padding: 9px 0; }
  .row.headings { color: #64748B; border-bottom: 1px solid rgba(148, 163, 184, .2); padding-bottom: 15px; }
  .row.headings span:nth-child(n + 5), .row:not(.headings) span:nth-child(5),
  .row:not(.headings) span:nth-child(6), .row:not(.headings) span:nth-child(7) { text-align: right; }
  .row span:last-child { padding-left: 22px; letter-spacing: .06em; }
  .fill { color: #22D3EE; } .empty { color: #2B3A52; }
  .foot { max-width: 1560px; font: 400 19px/1.5 -apple-system, "Segoe UI", sans-serif; color: #7E8BA3; }
</style></head><body>
  <div class="head">
    <p class="eyebrow">${escapeHtml(cover.eyebrow)}</p>
    <h1>${escapeHtml(cover.nombre)}</h1>
    <p class="tagline">${escapeHtml(cover.tagline)}</p>
  </div>
  <div class="panel">
    <div class="bar">
      <span class="dot" style="background:#F87171"></span>
      <span class="dot" style="background:#FBBF24"></span>
      <span class="dot" style="background:#34D399"></span>
      <span class="title">${escapeHtml(cover.terminalTitle)}</span>
    </div>
    <div class="body">
      <p class="out">${escapeHtml(cover.header)}</p>
      ${row(cover.columns, "row headings")}
      ${cover.rows.map((cells) => row(cells)).join("\n      ")}
    </div>
  </div>
  <p class="foot">${escapeHtml(cover.footnote)}</p>
</body></html>`;
}

async function main() {
  const id = process.argv[2];
  if (!id) fail("usage: node scripts/author-portfolio-thumbnail.mjs <project-id>");
  const cover = COVERS[id];
  if (!cover) fail(`no cover is authored for "${id}"`);

  const { chromium } = await import("playwright");
  const browser = await chromium.launch();
  let png;
  try {
    const page = await browser.newPage({
      viewport: { ...AUTHORED_THUMBNAIL_SIZE },
      deviceScaleFactor: 1,
      reducedMotion: "reduce",
    });
    await page.setContent(coverHtml(cover), { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    png = await page.screenshot({ type: "png" });
  } finally {
    await browser.close();
  }

  // The same contract the sync enforces before publishing the JSON that points at
  // this file, checked here so a wrong cover never reaches a commit.
  const size = readPngSize(png, `authored thumbnail ${id}`);
  if (size.width !== AUTHORED_THUMBNAIL_SIZE.width || size.height !== AUTHORED_THUMBNAIL_SIZE.height) {
    fail(`rendered ${size.width}x${size.height}, expected ${AUTHORED_THUMBNAIL_SIZE.width}x${AUTHORED_THUMBNAIL_SIZE.height}`);
  }

  const target = committedThumbnailPath(id);
  fs.writeFileSync(target, png);
  console.log(`${path.relative(repoRoot, target)}: ${size.width}x${size.height}, ${png.length} bytes`);
}

main().catch((error) => {
  console.error(`thumbnail authoring aborted: ${error.message}`);
  process.exitCode = 1;
});

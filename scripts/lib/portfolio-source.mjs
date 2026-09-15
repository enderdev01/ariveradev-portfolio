// Portfolio source & public-record logic: loads approved sources from the
// three registries (committed / local gitignored / PORTFOLIO_SOURCES_EXTRA),
// validates them, fetches GitHub metadata and the public production HTML, and
// builds the deterministic public record for the generated JSON.
//
// Guarantees owned here:
//   - Approved-source gate: every source requires an explicit
//     `clientApproved: true`; unapproved sources are skipped with a warning.
//   - Malformed sources abort the run before any write happens (abort rather
//     than emit partial data).
//   - Metadata is validation-only: the GitHub homepage origin must match the
//     expected production origin, and metadata is never written into the
//     generated JSON.
//   - GitHub token confinement: PORTFOLIO_GITHUB_TOKEN is sent only to
//     api.github.com as a Bearer header, nowhere else.
//   - Expected-origin validation: production fetches must land on the
//     expected origin even after redirects.
//   - Safe HTML extraction: plain regex over raw text, tags stripped from the
//     result, whitespace collapsed. No DOM/eval involved.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));

const COMMITTED_REGISTRY_PATH = path.join(scriptDir, "..", "portfolio-sources.json");
const LOCAL_REGISTRY_PATH = path.join(scriptDir, "..", "portfolio-sources.local.json");

const USER_AGENT = "OniLabs-Portfolio-Sync/1.0";
const GITHUB_TOKEN = process.env.PORTFOLIO_GITHUB_TOKEN || "";

function fail(message) {
  throw new Error(message);
}

function decodeBasicEntities(text) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'");
}

// Defensive extraction from raw HTML: plain regex over the text, tags stripped
// from the result, whitespace collapsed. No DOM/eval involved.
function extractTitle(html) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!match) return null;
  const text = decodeBasicEntities(match[1])
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return text || null;
}

function extractMetaDescription(html) {
  const patterns = [
    /<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i,
    /<meta[^>]+content=["']([^"']*)["'][^>]*name=["']description["'][^>]*>/i,
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) {
      const text = decodeBasicEntities(match[1]).replace(/\s+/g, " ").trim();
      if (text) return text;
    }
  }
  return null;
}

function readRegistryFile(filePath, label) {
  if (!fs.existsSync(filePath)) return [];
  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    fail(`${label} is not valid JSON: ${error.message}`);
  }
  const sources = Array.isArray(parsed) ? parsed : parsed?.sources;
  if (!Array.isArray(sources)) {
    fail(`${label} must be an array of sources or an object with a "sources" array`);
  }
  return sources;
}

function parseExtraEnv(extraEnv) {
  try {
    const parsed = JSON.parse(extraEnv);
    const sources = Array.isArray(parsed) ? parsed : parsed?.sources;
    if (!Array.isArray(sources)) return null;
    return sources;
  } catch {
    return null;
  }
}

function validateSource(source, label) {
  if (typeof source.id !== "string" || !/^[a-z0-9-]+$/.test(source.id)) {
    fail(`${label}: "id" must be a kebab-case string`);
  }
  if (!Number.isInteger(source.projectId) || source.projectId <= 0) {
    fail(`${label} (${source.id}): "projectId" must be a positive integer`);
  }
  for (const field of ["productionUrl", "expectedOrigin"]) {
    const value = source[field];
    if (typeof value !== "string" || !value.startsWith("https://")) {
      fail(`${label} (${source.id}): "${field}" must be an https URL`);
    }
  }
  if (source.github !== undefined) {
    if (
      typeof source.github?.owner !== "string" ||
      typeof source.github?.repo !== "string"
    ) {
      fail(`${label} (${source.id}): "github" must be { owner, repo }`);
    }
  }
  if (typeof source.card?.nombre !== "string" || !source.card.nombre.trim()) {
    fail(`${label} (${source.id}): "card.nombre" is required`);
  }
  if (typeof source.card?.descripcion !== "string" || !source.card.descripcion.trim()) {
    fail(`${label} (${source.id}): "card.descripcion" is required`);
  }
  if (
    !Array.isArray(source.stack) ||
    source.stack.length === 0 ||
    !source.stack.every((tech) => typeof tech === "string" && tech.trim())
  ) {
    fail(`${label} (${source.id}): "stack" must be a non-empty array of strings`);
  }
  if (typeof source.seo?.slug !== "string" || !/^[a-z0-9-]+$/.test(source.seo.slug)) {
    fail(`${label} (${source.id}): "seo.slug" must be a kebab-case string`);
  }
  if (typeof source.seo?.categoria !== "string" || !source.seo.categoria.trim()) {
    fail(`${label} (${source.id}): "seo.categoria" is required`);
  }
}

// Merges the three registry places in order: committed, local, env extra.
// Deduplicates by id, applies the approved-source gate, and returns approved
// sources sorted by projectId.
export function loadSources() {
  const committed = readRegistryFile(COMMITTED_REGISTRY_PATH, "portfolio-sources.json");
  const local = readRegistryFile(LOCAL_REGISTRY_PATH, "portfolio-sources.local.json");
  let extra = [];
  if (process.env.PORTFOLIO_SOURCES_EXTRA) {
    const parsed = parseExtraEnv(process.env.PORTFOLIO_SOURCES_EXTRA);
    if (!parsed) {
      fail("PORTFOLIO_SOURCES_EXTRA must be a JSON array of sources or { \"sources\": [...] }");
    }
    extra = parsed;
  }

  const all = [...committed, ...local, ...extra];
  const seenIds = new Set();
  for (const source of all) {
    if (seenIds.has(source.id)) {
      fail(`Duplicate source id "${source.id}" across registries`);
    }
    seenIds.add(source.id);
  }

  const approved = [];
  const skipped = [];
  for (const source of all) {
    if (source.clientApproved !== true) {
      skipped.push(source.id ?? "(missing id)");
      continue;
    }
    validateSource(source, "portfolio source");
    approved.push(source);
  }

  if (skipped.length > 0) {
    console.warn(`Skipping unapproved sources (clientApproved !== true): ${skipped.join(", ")}`);
  }
  if (approved.length === 0) {
    fail("No approved portfolio sources found; nothing to sync");
  }
  approved.sort((a, b) => a.projectId - b.projectId);
  return approved;
}

// Fetches GitHub repository metadata to cross-check that the repository
// homepage matches the expected production origin. Validation-only: the
// metadata is never written into the generated JSON.
export async function fetchRepoMetadata(source) {
  if (!source.github) return null;
  const url = `https://api.github.com/repos/${source.github.owner}/${source.github.repo}`;
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": USER_AGENT,
  };
  if (GITHUB_TOKEN) headers.Authorization = `Bearer ${GITHUB_TOKEN}`;

  const response = await fetch(url, { headers });
  if (!response.ok) {
    fail(`GitHub metadata fetch failed for ${source.id}: HTTP ${response.status}`);
  }
  const metadata = await response.json();

  // Cross-check: the repository homepage must match the production origin.
  if (metadata.homepage) {
    try {
      const homepage = new URL(metadata.homepage);
      const expected = new URL(source.expectedOrigin);
      if (homepage.origin !== expected.origin) {
        fail(
          `${source.id}: GitHub homepage origin (${homepage.origin}) does not match expected production origin (${expected.origin})`
        );
      }
    } catch {
      fail(`${source.id}: GitHub homepage is not a valid URL`);
    }
  }
  return metadata;
}

export async function fetchProductionHtml(source) {
  let response;
  try {
    response = await fetch(source.productionUrl, {
      redirect: "follow",
      headers: { "User-Agent": USER_AGENT, Accept: "text/html" },
    });
  } catch (error) {
    fail(`${source.id}: production fetch failed (${error.message})`);
  }
  if (!response.ok) {
    fail(`${source.id}: production fetch returned HTTP ${response.status}`);
  }
  const finalUrl = new URL(response.url);
  const expected = new URL(source.expectedOrigin);
  if (finalUrl.origin !== expected.origin) {
    fail(
      `${source.id}: production redirect landed on ${finalUrl.origin}, expected ${expected.origin}`
    );
  }
  const html = await response.text();
  return { title: extractTitle(html), description: extractMetaDescription(html) };
}

export function buildRecord(source, fetchedMeta) {
  // Explicit field order keeps the JSON byte-stable across runs.
  return {
    id: source.projectId,
    card: {
      nombre: source.card.nombre,
      url: source.productionUrl,
      imagen: `/portfolio/${source.id}.png`,
      stack: source.stack.map((tech) => tech.trim()),
      descripcion: source.card.descripcion,
    },
    seo: {
      slug: source.seo.slug,
      categoria: source.seo.categoria,
      tituloSeo: fetchedMeta.title ?? "",
      descripcionSeo: fetchedMeta.description ?? "",
    },
  };
}

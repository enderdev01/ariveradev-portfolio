// Portfolio registry: source loading, validation and the approved-source
// gate.
//
// Responsibilities:
//   - Load approved sources from the three registries (committed /
//     local gitignored / PORTFOLIO_SOURCES_EXTRA) and validate them.
//
// Guarantees owned here:
//   - Approved-source gate: every source requires an explicit
//     `clientApproved: true`; unapproved sources are skipped with a warning.
//   - Malformed sources abort the run before any write happens (abort rather
//     than emit partial data).
//   - Shared abort helper: `fail` is the pipeline's single abort primitive;
//     portfolio-source-resolution.mjs imports it for the discovery/manual
//     merge gates.
//
// The deterministic discovery/manual merge and the fail-closed sync gates
// live in portfolio-source-resolution.mjs.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));

const COMMITTED_REGISTRY_PATH = path.join(scriptDir, "..", "portfolio-sources.json");
const LOCAL_REGISTRY_PATH = path.join(scriptDir, "..", "portfolio-sources.local.json");

// Shared abort helper for the portfolio sync pipeline. Thrown errors abort the
// run before any write happens.
export function fail(message) {
  throw new Error(message);
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
  if (source.allowedOrigins !== undefined) {
    if (
      !Array.isArray(source.allowedOrigins) ||
      !source.allowedOrigins.every((origin) => typeof origin === "string" && origin.startsWith("https://"))
    ) {
      fail(`${label} (${source.id}): "allowedOrigins" must be an array of https origin URLs`);
    }
  }
}

// Merges the three registry places in order: committed, local, env extra.
// Deduplicates by id, applies the approved-source gate, and returns approved
// sources sorted by projectId.
// With `allowEmpty`, an empty approved list is a valid result: auto-discovery
// may be the only source provider, so an empty manual registry must not
// abort the run when discovery yields sources.
export function loadSources({ allowEmpty = false } = {}) {
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
  if (approved.length === 0 && !allowEmpty) {
    fail("No approved portfolio sources found; nothing to sync");
  }
  approved.sort((a, b) => a.projectId - b.projectId);
  return approved;
}

// Origins a source may legitimately land on: the expected origin plus, when
// discovery derived them, every allowedOrigins entry (custom domain, Vercel
// project aliases and the deployment url). Manual sources without the field
// keep the single strict expectedOrigin validation.
export function allowedOriginsFor(source) {
  const origins = new Set([new URL(source.expectedOrigin).origin]);
  if (Array.isArray(source.allowedOrigins)) {
    for (const candidate of source.allowedOrigins) {
      try {
        origins.add(new URL(candidate).origin);
      } catch {
        fail(`${source.id}: "allowedOrigins" contains an invalid URL`);
      }
    }
  }
  return origins;
}


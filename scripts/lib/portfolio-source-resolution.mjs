// Portfolio source resolution: the deterministic discovery/manual merge and
// the fail-closed sync gates.
//
// Responsibilities:
//   - Merge manual registry entries with auto-discovered sources
//     deterministically (manual entries win on identity collisions).
//   - Decide the discovery mode of a sync run from the configured
//     credentials and resolve the final source list for the run.
//
// Guarantees owned here:
//   - Merge determinism: manual sources override discovered sources with the
//     same GitHub owner/repo, id, slug or numeric projectId; the merged list
//     is deduplicated by id and sorted by numeric projectId. Nothing about
//     repository identity is logged here.
//   - Fail-closed discovery gate: manual-only fallback is allowed only when
//     VERCEL_TOKEN is absent (migration mode). Once VERCEL_TOKEN is
//     configured, discovery is required to have run and succeeded; any
//     discovery/API/auth/shape failure aborts the sync before writes, so a
//     previously published discovered project is never temporarily deleted
//     by a manual-only regeneration.
//
// Source loading, validation and the approved-source gate live in
// portfolio-registry.mjs; `fail` is imported from there so every pipeline
// abort goes through the same helper.

import { fail } from "./portfolio-registry.mjs";

// --- Discovery / manual registry merge -----------------------------------------

// Stable identity keys used to detect that a discovered source and a manual
// registry entry describe the same project: GitHub owner/repo, id, SEO slug
// and numeric projectId. Comparisons are case-insensitive where identity is
// case-insensitive upstream (owner/repo, id, slug).
function identityKeys(source) {
  const keys = [];
  if (typeof source.id === "string" && source.id) {
    keys.push(`id:${source.id.toLowerCase()}`);
  }
  if (typeof source.seo?.slug === "string" && source.seo.slug) {
    keys.push(`slug:${source.seo.slug.toLowerCase()}`);
  }
  if (Number.isInteger(source.projectId) && source.projectId > 0) {
    keys.push(`projectId:${source.projectId}`);
  }
  if (typeof source.github?.owner === "string" && typeof source.github?.repo === "string") {
    keys.push(`repo:${source.github.owner.toLowerCase()}/${source.github.repo.toLowerCase()}`);
  }
  return keys;
}

// Deterministically merges manual registry entries with auto-discovered
// sources. Manual entries win: a discovered source whose identity collides
// with any manual entry (owner/repo, id, slug or projectId) is dropped. The
// merged list is deduplicated by id and sorted by numeric projectId. Nothing
// about repository identity is logged here.
export function mergeSources({ manual = [], discovered = [] } = {}) {
  const manualKeys = new Set();
  for (const source of manual) {
    for (const key of identityKeys(source)) manualKeys.add(key);
  }
  const keptDiscovered = [];
  for (const source of discovered) {
    if (identityKeys(source).some((key) => manualKeys.has(key))) continue;
    keptDiscovered.push(source);
  }

  const merged = [...manual, ...keptDiscovered];
  const seenIds = new Set();
  for (const source of merged) {
    if (seenIds.has(source.id)) {
      fail(`Duplicate source id "${source.id}" after discovery/manual merge`);
    }
    seenIds.add(source.id);
  }
  merged.sort((a, b) => a.projectId - b.projectId);
  return merged;
}

// Ids of the discovered sources that actually produced a published record.
//
// A discovered source dropped by the manual override is NOT included, even though
// discovery did fetch and validate its deployed page. Its metadata was derived for
// a record that was never published, so it must not suppress the deployed-metadata
// fetch for the manual entry that replaced it: that entry may declare no SEO texts
// at all, and suppressing the fetch would blank its previously published copy
// instead of falling back to the deployed page.
//
// Identity is by object reference: mergeSources returns the surviving discovered
// objects themselves, so membership in `sources` is exactly "this source was
// published".
export function discoveredProvidedIds({ discoveredSources = null, sources = [] } = {}) {
  const published = new Set(Array.isArray(sources) ? sources : []);
  return new Set(
    (discoveredSources ?? [])
      .filter((source) => published.has(source))
      .map((source) => source.id)
  );
}

// Decides the discovery mode of a sync run from the configured credentials:
//   - VERCEL_TOKEN absent -> { discoveryEnabled: false }: migration mode, the
//     manual registry is the only source provider (allowed fallback).
//   - VERCEL_TOKEN present without an explicit PORTFOLIO_GITHUB_TOKEN ->
//     aborts: auto-discovery requires an explicitly configured GitHub token;
//     there is no implicit workflow-token fallback.
//   - VERCEL_TOKEN + PORTFOLIO_GITHUB_TOKEN -> { discoveryEnabled: true };
//     discovery must then run and succeed, or the sync aborts before writes.
export function resolveDiscoveryGate({ vercelToken, githubToken } = {}) {
  if (!vercelToken) {
    return { discoveryEnabled: false };
  }
  if (!githubToken) {
    fail(
      "VERCEL_TOKEN is configured but PORTFOLIO_GITHUB_TOKEN is missing: auto-discovery requires an explicitly configured GitHub token; aborting before any write"
    );
  }
  return { discoveryEnabled: true };
}

// Resolves the final source list for a sync run:
//   - Migration mode (VERCEL_TOKEN absent, discovery not attempted): warn and
//     use the manual registry sources only. This is the only fallback mode.
//   - Discovery enabled but not attempted (or failed): abort. Never fall back
//     to a manual-only regeneration, which would temporarily delete every
//     previously discovered project from the generated JSON.
//   - Discovery attempted: merge manual + discovered deterministically.
// In every mode the run fails when the resolved list is empty.
export function resolveSyncSources({
  manualSources,
  discoveredSources = null,
  discoveryAttempted = false,
  vercelEnabled = false,
} = {}) {
  if (!discoveryAttempted) {
    if (vercelEnabled) {
      fail(
        "Portfolio discovery is required (VERCEL_TOKEN is configured) but did not complete; aborting before any write to avoid regenerating a manual-only JSON"
      );
    }
    console.warn(
      "Portfolio auto-discovery is not active (VERCEL_TOKEN is not configured); " +
      "syncing from the manual registry sources only (migration mode). " +
      "Configure VERCEL_TOKEN and PORTFOLIO_GITHUB_TOKEN to enable topic-based discovery."
    );
    if (manualSources.length === 0) {
      fail("No approved portfolio sources found; nothing to sync");
    }
    return manualSources;
  }
  const merged = mergeSources({ manual: manualSources, discovered: discoveredSources ?? [] });
  if (merged.length === 0) {
    fail("Portfolio discovery and the manual registry produced no sources; nothing to sync");
  }
  console.log(
    `Merged source list: ${merged.length} source(s) ` +
    `(${manualSources.length} manual, ${merged.length - manualSources.length} discovered)`
  );
  return merged;
}

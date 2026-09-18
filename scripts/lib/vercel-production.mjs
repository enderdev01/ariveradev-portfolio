// Vercel production deployment resolution & URL selection.
//
// Responsibilities:
//   - Resolve the production deployment: confirm that the newest
//     GET /v6/deployments?projectId=<id>&target=production&limit=1 entry is
//     READY (via `readyState` or `state`), and pick the production URL with
//     custom-domain preference over *.vercel.app aliases.
//   - Derive the allowed origins of a discovered project from the chosen
//     production URL, every alias and the deployment url.
//
// Guarantees owned here:
//   - Token confinement: shared with vercel-projects.mjs — the Vercel token is
//     sent exclusively as a Bearer header to api.vercel.com, never in URLs,
//     logs or errors.
//   - Abort vs skip: API/auth/invalid-shape failures throw a DiscoveryError;
//     per-repository data gaps (no production deployment, non-READY
//     deployment) are returned as structured skip reasons for the caller to
//     aggregate.
//   - Injectability & determinism: `fetchImpl` is injectable (required, so
//     tests stay offline); alias selection and origin derivation sort their
//     candidates, so identical inputs produce byte-identical outputs.

import { DiscoveryError } from "./github-discovery.mjs";
import { isValidHostname } from "./vercel-project-match.mjs";
import { buildUrl, fetchJson } from "./vercel-projects.mjs";

const VERCEL_APP_SUFFIX = ".vercel.app";

function isVercelAppDomain(host) {
  const lower = host.toLowerCase();
  return lower.endsWith(VERCEL_APP_SUFFIX) || lower === "vercel.app";
}

// Confirms the newest production deployment of a project is READY.
// Returns { ok: true, projectId, url, readyState, createdAt } or
// { ok: false, reason } with a structured skip reason.
export async function resolveProductionDeployment({ fetchImpl, token, teamId = null, project }) {
  if (typeof fetchImpl !== "function") {
    throw new DiscoveryError("resolveProductionDeployment requires an injectable fetchImpl");
  }
  if (typeof token !== "string" || !token) {
    throw new DiscoveryError("resolveProductionDeployment requires a Vercel token");
  }
  if (!project || typeof project.id !== "string" || !project.id) {
    throw new DiscoveryError("resolveProductionDeployment requires a normalized Vercel project");
  }
  const url = buildUrl("/v6/deployments", {
    projectId: project.id,
    target: "production",
    limit: 1,
    teamId,
  });
  const body = await fetchJson(fetchImpl, token, url, "{ deployments: [...] }");
  if (!Array.isArray(body.deployments)) {
    throw new DiscoveryError(
      "Vercel deployment listing returned an unexpected shape (expected { deployments: [...] })"
    );
  }
  // Deterministic newest-first selection regardless of API order: createdAt
  // descending, then id descending as the tie-break.
  const newest = body.deployments
    .slice()
    .sort(
      (a, b) =>
        (Number(b?.createdAt) || 0) - (Number(a?.createdAt) || 0) ||
        String(b?.id ?? "").localeCompare(String(a?.id ?? ""))
    )[0];
  if (!newest) {
    return { ok: false, reason: "vercel-no-production-deployment" };
  }
  const state =
    typeof newest.readyState === "string" && newest.readyState
      ? newest.readyState
      : typeof newest.state === "string" && newest.state
        ? newest.state
        : null;
  if (state === null) {
    throw new DiscoveryError("Vercel deployment entry returned an unexpected shape (missing readyState/state)");
  }
  if (state !== "READY") {
    return { ok: false, reason: "vercel-production-not-ready", state };
  }
  const deploymentUrl =
    typeof newest.url === "string" && isValidHostname(newest.url) ? newest.url.toLowerCase() : null;
  return {
    ok: true,
    projectId: project.id,
    url: deploymentUrl ?? project.production?.url ?? null,
    readyState: state,
    createdAt: typeof newest.createdAt === "number" ? newest.createdAt : null,
  };
}

// Picks the production URL with custom-domain preference: sorted custom
// domains first, then sorted *.vercel.app aliases, then the deployment url.
// Returns "https://<host>" or null when nothing usable is present.
export function pickProductionUrl({ aliases = [], url = null } = {}) {
  const sortedAliases = aliases
    .filter((alias) => isValidHostname(alias))
    .map((alias) => alias.toLowerCase())
    .sort();
  const custom = sortedAliases.find((alias) => !isVercelAppDomain(alias));
  const vercelApp = sortedAliases.find((alias) => isVercelAppDomain(alias));
  const host = custom ?? vercelApp ?? (isValidHostname(url) ? url.toLowerCase() : null);
  if (!host) return null;
  return `https://${host}`;
}

// Derives the allowed origins for a discovered project: the chosen production
// origin plus every alias origin plus the deployment origin. Sorted, deduped,
// deterministic.
export function deriveAllowedOrigins({ productionUrl, aliases = [], url = null } = {}) {
  const origins = new Set();
  const addHost = (host) => {
    if (isValidHostname(host)) origins.add(`https://${host.toLowerCase()}`);
  };
  if (typeof productionUrl === "string" && productionUrl.startsWith("https://")) {
    try {
      origins.add(new URL(productionUrl).origin);
    } catch {
      // Invalid production URLs are rejected by pickProductionUrl callers.
    }
  }
  for (const alias of aliases) addHost(alias);
  addHost(url);
  return [...origins].sort();
}

// Vercel project listing & shared Vercel HTTP helpers.
//
// Responsibilities:
//   - List the projects visible to the token through the paginated
//     GET /v9/projects endpoint (limit=100, optional teamId, cursor-based
//     pagination driven by `pagination.next` passed back as `until`).
//   - Host the low-level shared Vercel HTTP helpers (URL building, JSON
//     fetching) used by this module and by vercel-production.mjs, so both
//     modules speak the exact same request contract.
//
// Guarantees owned here:
//   - Token confinement: the Vercel token is sent exclusively as a Bearer
//     header to api.vercel.com and never appears in URLs, logs or errors.
//   - Abort vs skip: API/auth/invalid-shape failures throw a DiscoveryError.
//   - Bounded pagination: at most `maxPages` requests; exceeding the bound
//     aborts instead of silently truncating.
//   - Injectability & determinism: `fetchImpl` is injectable (required, so
//     tests stay offline); the project list is sorted locally, so identical
//     inputs produce byte-identical outputs.
//
// Project normalization and GitHub-repository matching live in
// vercel-project-match.mjs.

import { DiscoveryError } from "./github-discovery.mjs";
import { normalizeProject } from "./vercel-project-match.mjs";

const VERCEL_API_BASE = "https://api.vercel.com";
const USER_AGENT = "OniLabs-Portfolio-Sync/1.0";
const PAGE_SIZE = 100;
const DEFAULT_MAX_PAGES = 20;

export function buildUrl(pathname, params) {
  const url = new URL(`${VERCEL_API_BASE}${pathname}`);
  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined) url.searchParams.set(key, String(value));
  }
  return url.toString();
}

export async function fetchJson(fetchImpl, token, url, expectedShapeHint) {
  let response;
  try {
    // The token lives only in this header, only for api.vercel.com.
    response = await fetchImpl(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": USER_AGENT,
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    throw new DiscoveryError(`Vercel request failed (${error.message})`);
  }
  if (!response.ok) {
    throw new DiscoveryError(`Vercel request failed: HTTP ${response.status}`);
  }
  let body;
  try {
    body = await response.json();
  } catch (error) {
    throw new DiscoveryError(`Vercel response returned invalid JSON (${error.message})`);
  }
  if (!body || typeof body !== "object") {
    throw new DiscoveryError(`Vercel response returned an unexpected shape (expected ${expectedShapeHint})`);
  }
  return body;
}

// Lists the Vercel projects. Pagination: the first request omits the cursor;
// while `pagination.next` is present it is passed back as the `until` param,
// bounded by `maxPages`.
export async function listVercelProjects({ fetchImpl, token, teamId = null, maxPages = DEFAULT_MAX_PAGES } = {}) {
  if (typeof fetchImpl !== "function") {
    throw new DiscoveryError("listVercelProjects requires an injectable fetchImpl");
  }
  if (typeof token !== "string" || !token) {
    throw new DiscoveryError("listVercelProjects requires a Vercel token");
  }
  const projects = [];
  const seenIds = new Set();
  let until = null;
  for (let page = 1; ; page += 1) {
    if (page > maxPages) {
      throw new DiscoveryError(`Vercel project listing exceeded the pagination bound (${maxPages} pages)`);
    }
    const url = buildUrl("/v9/projects", { limit: PAGE_SIZE, teamId, until });
    const body = await fetchJson(fetchImpl, token, url, "{ projects: [...] }");
    if (!Array.isArray(body.projects)) {
      throw new DiscoveryError("Vercel project listing returned an unexpected shape (expected { projects: [...] })");
    }
    for (const raw of body.projects) {
      const project = normalizeProject(raw);
      if (seenIds.has(project.id)) continue; // defensive: server-side dedup
      seenIds.add(project.id);
      projects.push(project);
    }
    const next = body.pagination && typeof body.pagination === "object" ? body.pagination.next : null;
    if (next === null || next === undefined || next === false) break;
    until = next;
  }
  // Local deterministic ordering: downstream matching must not depend on the
  // API's cross-page ordering.
  projects.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  return projects;
}

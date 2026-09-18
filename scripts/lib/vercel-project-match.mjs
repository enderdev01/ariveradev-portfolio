// Vercel project matching & normalization (pure, no HTTP).
//
// Responsibilities:
//   - Normalize a raw Vercel project into the minimal shape used downstream.
//   - Match a GitHub repository to a Vercel project: numeric `link.repoId`
//     first, then the normalized `link.org`/`link.repo` pair.
//   - Host the shared hostname validation used by this module and by
//     vercel-production.mjs.
//
// Guarantees owned here:
//   - Abort on unexpected shapes: invalid values are never silently coerced;
//     malformed projects/aliases throw a DiscoveryError.
//   - Determinism: matching is a pure function of the normalized inputs; an
//     ordered list yields an ordered match decision.
//
// The paginated GET /v9/projects listing and the shared Vercel HTTP helpers
// (URL building, JSON fetching) live in vercel-projects.mjs.

import { DiscoveryError } from "./github-discovery.mjs";

// Normalizes a repository reference (owner or repo name): lowercases, strips
// an optional "github.com/" host prefix, ".git" suffix and surrounding slashes.
export function normalizeVercelRepoRef(value) {
  if (typeof value !== "string") return null;
  const stripped = value
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/^github\.com\//i, "")
    .replace(/\.git$/i, "")
    .replace(/^\/+|\/+$/g, "");
  return stripped ? stripped.toLowerCase() : null;
}

export function isValidHostname(value) {
  return (
    typeof value === "string" &&
    value.includes(".") &&
    HOSTNAME_PATTERN.test(value) &&
    !value.includes("://") &&
    !value.includes("/")
  );
}

const HOSTNAME_PATTERN = /^[a-z0-9][a-z0-9.-]*$/i;

// Normalizes one raw Vercel project into the minimal shape used downstream.
// Throws on unexpected shapes (abort); invalid values are never silently
// coerced.
export function normalizeProject(raw) {
  if (typeof raw?.id !== "string" || !raw.id || typeof raw?.name !== "string" || !raw.name) {
    throw new DiscoveryError("Vercel project listing returned an unexpected project shape");
  }
  let link = null;
  if (raw.link !== undefined && raw.link !== null) {
    if (typeof raw.link !== "object") {
      throw new DiscoveryError("Vercel project listing returned an unexpected project link shape");
    }
    const repoId =
      typeof raw.link.repoId === "number" && Number.isInteger(raw.link.repoId) && raw.link.repoId > 0
        ? raw.link.repoId
        : null;
    link = {
      repoId,
      org: normalizeVercelRepoRef(raw.link.org),
      repo: normalizeVercelRepoRef(raw.link.repo),
      type: typeof raw.link.type === "string" ? raw.link.type : null,
    };
  }
  let production = null;
  const targets = raw.targets;
  if (targets && typeof targets === "object" && targets.production !== undefined && targets.production !== null) {
    const prod = targets.production;
    if (typeof prod !== "object") {
      throw new DiscoveryError("Vercel project listing returned an unexpected production target shape");
    }
    // Accepted shape variants (centralized here, documented):
    //   - targets.production.aliases: array of domain strings
    //   - targets.production.alias:   array of domain strings (variant
    //     spelling used by some API responses; `aliases` wins when both are
    //     present)
    //   - targets.production.url:     optional deployment hostname string
    const rawAliases = prod.aliases !== undefined && prod.aliases !== null ? prod.aliases : prod.alias;
    let aliases = [];
    if (rawAliases !== undefined && rawAliases !== null) {
      if (!Array.isArray(rawAliases) || !rawAliases.every((alias) => typeof alias === "string")) {
        throw new DiscoveryError("Vercel production target returned an unexpected aliases shape");
      }
      aliases = rawAliases.filter((alias) => isValidHostname(alias)).map((alias) => alias.toLowerCase());
    }
    production = {
      aliases,
      url: typeof prod.url === "string" && isValidHostname(prod.url) ? prod.url.toLowerCase() : null,
    };
  }
  return { id: raw.id, name: raw.name, link, production };
}

// Matches a normalized GitHub repo against the normalized Vercel projects:
// numeric link.repoId pass first, then normalized link.org/link.repo pass.
// Duplicate matches fail with an explicit, non-secret ambiguity error (only
// numeric/GUI ids are named) instead of silently trusting API order. Returns
// the matched project or null.
export function matchVercelProject(projects, repo) {
  if (!Array.isArray(projects) || !repo) return null;
  const repoIdMatches = projects.filter(
    (project) => project.link?.repoId !== null && project.link?.repoId === repo.id
  );
  if (repoIdMatches.length > 0) {
    if (repoIdMatches.length > 1) {
      throw new DiscoveryError(
        `Ambiguous Vercel project matches (link.repoId) for GitHub repository id ${repo.id}: ${repoIdMatches
          .map((project) => project.id)
          .sort()
          .join(", ")}`
      );
    }
    return repoIdMatches[0];
  }
  const owner = normalizeVercelRepoRef(repo.owner);
  const name = normalizeVercelRepoRef(repo.name);
  if (!owner || !name) return null;
  const refMatches = projects.filter(
    (project) => project.link && project.link.org === owner && project.link.repo === name
  );
  if (refMatches.length > 0) {
    if (refMatches.length > 1) {
      throw new DiscoveryError(
        `Ambiguous Vercel project matches (link.org/link.repo) for GitHub repository id ${repo.id}: ${refMatches
          .map((project) => project.id)
          .sort()
          .join(", ")}`
      );
    }
    return refMatches[0];
  }
  return null;
}

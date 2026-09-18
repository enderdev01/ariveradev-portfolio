// Deployed-source validation & public identity for the portfolio discovery
// pipeline.
//
// Responsibilities:
//   - Fetch and validate the deployed public HTML metadata (title + meta
//     description) of a matched READY production deployment.
//   - Fail-closed published-project protection: abort when discovery skips a
//     projectId that is already published in the committed generated JSON.
//   - Derive the card title from the deployed <title>.
//   - Strip the private GitHub identity block from a derived source.
//
// Guarantees owned here:
//   - Abort on failure: a network error, non-OK response, redirect to another
//     origin, or missing <title> for a matched READY deployment throws a
//     DiscoveryError instead of silently dropping a previously published
//     project.
//   - Published-project protection: any skip of a published projectId fails
//     closed so a transient skip (non-READY deployment, missing Vercel link,
//     unavailable production URL) can never remove an already published
//     project from regenerated data. Newly tagged repositories that have
//     never been published may still skip until READY.
//   - Identity-safe errors and skip data: abort messages and skip records
//     never expose repository names or tokens.
//   - Injectability: `fetchImpl` (APIs) and `htmlFetchImpl` (deployed page)
//     are both injectable, keeping every test offline.
//
// The discovery orchestration itself (repository -> Vercel project -> source
// derivation) lives in portfolio-discovery.mjs.

import { DiscoveryError } from "./github-discovery.mjs";
import { extractMetaDescription, extractTitle } from "./portfolio-classify.mjs";

const USER_AGENT = "OniLabs-Portfolio-Sync/1.0";

// Card title from the deployed <title>: first segment before common title
// separators (" — ", " – ", " | ", " - ", " :: "), whitespace collapsed.
export function deriveCardTitle(deployedTitle) {
  if (typeof deployedTitle !== "string") return null;
  const cleaned = deployedTitle.replace(/\s+/g, " ").trim();
  if (!cleaned) return null;
  const firstSegment = cleaned.split(/\s+[—–|]\s+|\s+-\s+|\s+::\s+/)[0];
  return (firstSegment || cleaned).trim() || null;
}

// Fetches the deployed public HTML metadata (title + meta description).
// Aborts on failure: a network error, non-OK response, redirect outside the
// project's own production origins, or missing <title> for a matched READY
// deployment throws a DiscoveryError instead of silently dropping a previously
// published project.
//
// `allowedOrigins` are the project's own production origins: its aliases plus the
// deployment URL, exactly the set the published record carries. A redirect between
// them is normal — an apex host routinely 307s to its www form — and must be
// followed rather than read as a cross-origin escape. This is the same check
// `fetchProductionHtml` applies when the sync fetches a published source, so
// discovery is no longer stricter than the sync it feeds.
//
// Injectable via htmlFetchImpl (offline tests) or fetchImpl (default fetch).
export async function fetchDeployedMeta({
  fetchImpl,
  htmlFetchImpl,
  productionUrl,
  expectedOrigin,
  allowedOrigins = [],
}) {
  if (htmlFetchImpl) {
    try {
      return await htmlFetchImpl(productionUrl, expectedOrigin);
    } catch (error) {
      throw new DiscoveryError(`Production HTML fetch failed for ${productionUrl} (${error.message})`);
    }
  }
  if (typeof fetchImpl !== "function") {
    throw new DiscoveryError("fetchDeployedMeta requires an injectable fetchImpl or htmlFetchImpl");
  }
  let response;
  try {
    response = await fetchImpl(productionUrl, {
      redirect: "follow",
      headers: { "User-Agent": USER_AGENT, Accept: "text/html" },
    });
  } catch (error) {
    throw new DiscoveryError(`Production HTML fetch failed for ${productionUrl} (${error.message})`);
  }
  if (!response.ok) {
    throw new DiscoveryError(`Production HTML fetch failed for ${productionUrl}: HTTP ${response.status}`);
  }
  let html;
  try {
    const finalOrigin = new URL(response.url).origin;
    const allowed = new Set([
      new URL(expectedOrigin).origin,
      ...(Array.isArray(allowedOrigins) ? allowedOrigins : []),
    ]);
    if (!allowed.has(finalOrigin)) {
      throw new DiscoveryError(
        `Production HTML redirect landed on ${finalOrigin}, expected one of ${[...allowed].sort().join(", ")}`
      );
    }
    html = await response.text();
  } catch (error) {
    if (error instanceof DiscoveryError) throw error;
    throw new DiscoveryError(`Production HTML fetch failed for ${productionUrl} (${error.message})`);
  }
  const title = extractTitle(html);
  if (!title) {
    throw new DiscoveryError(`Production HTML for ${productionUrl} has no <title> to validate`);
  }
  return { title, description: extractMetaDescription(html), html };
}

// Fail-closed published-project protection: when discovery skips a projectId
// that is already published in the committed generated JSON, regenerating the
// data would silently remove that project. This guard must run before browser
// capture/staging so the sync aborts with zero writes instead. Any skip reason
// counts (non-READY deployment, missing Vercel link, unavailable production
// URL, no matching project); newly tagged repositories that were never
// published are not in the committed list and may still skip until READY.
// Error/skip data stays identity-safe: numeric projectId + reason only.
export function assertNoPublishedProjectSkipped({ skipped = [], committedProjectIds = [] } = {}) {
  const committed = new Set(
    Array.isArray(committedProjectIds) ? committedProjectIds.filter((id) => Number.isInteger(id)) : []
  );
  if (committed.size === 0) return;
  for (const skip of Array.isArray(skipped) ? skipped : []) {
    if (Number.isInteger(skip?.projectId) && committed.has(skip.projectId)) {
      throw new DiscoveryError(
        `Discovery skipped projectId ${skip.projectId} (${skip.reason}), which is already published in the committed generated JSON; aborting before any write to avoid removing a published project`
      );
    }
  }
}

// Returns a shallow copy of a derived source without the `github` identity
// block, so the integration layer can omit GitHub identity from public
// artifacts without touching the rest of the record.
export function stripPrivateIdentity(source) {
  const { github, ...publicSource } = source;
  return publicSource;
}

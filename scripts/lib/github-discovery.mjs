// GitHub portfolio discovery: lists every repository visible to the provided
// token through the authenticated /user/repos endpoint, follows bounded Link
// pagination, and selects the non-archived, non-disabled repositories whose
// topics include the configured portfolio topic.
//
// Guarantees owned here:
//   - Metadata-only access: the only endpoint this module requests is
//     GET /user/repos. Repository contents, readme and commits are never
//     requested.
//   - Token confinement: the GitHub token is sent exclusively as a Bearer
//     header to api.github.com. It is never embedded in URLs, logs or error
//     messages.
//   - Bounded pagination: the Link rel="next" header is followed at most
//     `maxPages` times; exceeding the bound aborts instead of silently
//     truncating the result set.
//   - Deterministic ordering without undocumented params: the request uses
//     only documented query values (per_page, visibility, affiliation, page);
//     ordering is guaranteed by the local id-ascending sort, not by the API.
//   - Abort on failure: HTTP errors, invalid JSON or unexpected response
//     shapes throw a DiscoveryError; no partial result is ever returned.
//   - Injectability & determinism: the network function is injectable via
//     `fetchImpl` (required, so tests can stay offline). The normalized
//     result is sorted by repository id ascending, so repeated runs over
//     identical inputs are byte-identical.

// Shared error type for every discovery module. Request URLs, statuses and
// shapes are safe to include here; tokens never are.
export class DiscoveryError extends Error {
  constructor(message) {
    super(message);
    this.name = "DiscoveryError";
  }
}

export const DEFAULT_PORTFOLIO_TOPIC = "onilabs-portfolio";
export const GITHUB_REPOS_ENDPOINT = "https://api.github.com/user/repos";

const USER_AGENT = "OniLabs-Portfolio-Sync/1.0";
const PER_PAGE = 100;
const DEFAULT_MAX_PAGES = 20;

function buildReposUrl(page) {
  const url = new URL(GITHUB_REPOS_ENDPOINT);
  url.searchParams.set("per_page", String(PER_PAGE));
  url.searchParams.set("visibility", "all");
  url.searchParams.set("affiliation", "owner,collaborator,organization_member");
  // No `sort`: `id` is not a documented /user/repos sort value. Deterministic
  // ordering comes from the local id sort below.
  url.searchParams.set("page", String(page));
  return url.toString();
}

// Extracts the rel="next" target from a GitHub Link header, or null when there
// is no next page. Header format: '<url>; rel="next", <url>; rel="last"'.
export function nextLinkFromHeader(headerValue) {
  if (typeof headerValue !== "string" || !headerValue) return null;
  for (const entry of headerValue.split(",")) {
    const match = entry.match(/<([^>]+)>\s*;\s*rel="next"/);
    if (match) return match[1];
  }
  return null;
}

async function fetchReposPage(fetchImpl, page, headers) {
  const url = buildReposUrl(page);
  let response;
  try {
    response = await fetchImpl(url, { headers });
  } catch (error) {
    throw new DiscoveryError(`GitHub repository listing request failed (${error.message})`);
  }
  if (!response.ok) {
    throw new DiscoveryError(`GitHub repository listing failed: HTTP ${response.status}`);
  }
  let body;
  try {
    body = await response.json();
  } catch (error) {
    throw new DiscoveryError(`GitHub repository listing returned invalid JSON (${error.message})`);
  }
  if (!Array.isArray(body)) {
    throw new DiscoveryError("GitHub repository listing returned an unexpected shape (expected an array)");
  }
  let nextUrl = null;
  try {
    nextUrl = nextLinkFromHeader(response.headers?.get("link"));
  } catch {
    nextUrl = null;
  }
  return { body, nextUrl };
}

// Normalizes one raw GitHub repository object into the minimal metadata shape
// used by the rest of the pipeline. Throws on unexpected shapes (abort).
export function normalizeRepository(raw) {
  const owner = raw?.owner?.login;
  const invalid =
    typeof raw?.id !== "number" ||
    !Number.isInteger(raw.id) ||
    raw.id <= 0 ||
    typeof raw?.name !== "string" ||
    !raw.name ||
    typeof owner !== "string" ||
    !owner;
  if (invalid) {
    throw new DiscoveryError("GitHub repository listing returned an unexpected repository shape");
  }
  return {
    id: raw.id,
    name: raw.name,
    owner,
    fullName: typeof raw.full_name === "string" && raw.full_name ? raw.full_name : `${owner}/${raw.name}`,
    description: typeof raw.description === "string" && raw.description ? raw.description : null,
    homepage: typeof raw.homepage === "string" && raw.homepage ? raw.homepage : null,
    language: typeof raw.language === "string" && raw.language ? raw.language : null,
    // Sorted copy: downstream derivation must not depend on GitHub's ordering.
    topics: Array.isArray(raw.topics)
      ? raw.topics.filter((topic) => typeof topic === "string" && topic).slice().sort()
      : [],
    htmlUrl: typeof raw.html_url === "string" && raw.html_url ? raw.html_url : null,
  };
}

// Lists the portfolio repositories. Returns the normalized, topic-filtered,
// non-archived, non-disabled repositories sorted by id ascending, regardless
// of the order the API returns them in.
export async function listPortfolioRepositories({
  fetchImpl,
  token,
  topic = DEFAULT_PORTFOLIO_TOPIC,
  maxPages = DEFAULT_MAX_PAGES,
} = {}) {
  if (typeof fetchImpl !== "function") {
    throw new DiscoveryError("listPortfolioRepositories requires an injectable fetchImpl");
  }
  if (typeof token !== "string" || !token) {
    throw new DiscoveryError("listPortfolioRepositories requires a GitHub token");
  }
  if (typeof topic !== "string" || !topic) {
    throw new DiscoveryError("listPortfolioRepositories requires a non-empty topic");
  }
  if (!Number.isInteger(maxPages) || maxPages < 1) {
    throw new DiscoveryError("listPortfolioRepositories requires a positive integer maxPages");
  }

  // The token lives only in this header, only for api.github.com.
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": USER_AGENT,
    Authorization: `Bearer ${token}`,
  };

  const repos = [];
  const seenIds = new Set();
  let page = 0;
  let hasMore = true;
  while (hasMore) {
    page += 1;
    if (page > maxPages) {
      throw new DiscoveryError(`GitHub repository listing exceeded the pagination bound (${maxPages} pages)`);
    }
    // The Link header target is only used to detect that another page exists;
    // every request is rebuilt from the canonical endpoint so the query
    // contract stays pinned.
    const { body, nextUrl } = await fetchReposPage(fetchImpl, page, headers);
    for (const raw of body) {
      if (raw?.archived === true || raw?.disabled === true) continue;
      if (!Array.isArray(raw?.topics) || !raw.topics.includes(topic)) continue;
      const repo = normalizeRepository(raw);
      if (seenIds.has(repo.id)) continue; // defensive: server-side dedup
      seenIds.add(repo.id);
      repos.push(repo);
    }
    hasMore = Boolean(nextUrl);
  }
  repos.sort((a, b) => a.id - b.id);
  return repos;
}

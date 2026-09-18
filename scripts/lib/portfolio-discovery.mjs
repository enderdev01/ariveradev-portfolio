// Portfolio discovery orchestrator: derives pipeline-compatible portfolio
// sources from GitHub repositories (topic-selected) matched to their Vercel
// production deployments. Wired into scripts/sync-portfolio.mjs, which passes
// PORTFOLIO_GITHUB_TOKEN, VERCEL_TOKEN, optional VERCEL_TEAM_ID and the
// portfolio topic.
//
// Guarantees owned here:
//   - Approval: selecting the onilabs-portfolio topic is the explicit approval
//     signal; discovered sources emit clientApproved: true and satisfy the
//     portfolio-source validation shape.
//   - Abort vs skip: API/auth/invalid-shape failures throw a DiscoveryError
//     before anything is returned. Deployment-level problems skip with a stable
//     reason code instead: missing/non-READY deployments, and also a matched
//     READY deployment whose production page cannot be read (network, non-OK,
//     cross-origin redirect, or no <title>). Skips are safe because the
//     published-skip guard aborts the run whenever a skipped projectId is
//     already published, so an already published project is still protected
//     while an unpublished one no longer takes the whole sync down.
//   - Published-project protection: the skip guard lives in
//     portfolio-deployed-meta.mjs and must run before browser capture/staging
//     so the sync aborts with zero writes.
//   - Skip privacy: skip records carry only { projectId, reason } — repository
//     identity never leaves this module through skips.
//   - Determinism: repositories are processed sorted by GitHub repo id,
//     projects are matched deterministically (duplicates abort), and every
//     derived source is built with a fixed key order — so repeated discovery
//     over identical inputs is byte-identical.
//   - Id stability: projectId comes from the GitHub repo id (unique upstream;
//     a collision aborts), slug/id come from the repository name with an
//     owner-suffix collision guard.
//   - Production URL: custom domains are preferred over *.vercel.app aliases;
//     the deployment is confirmed READY before the source is derived.
//   - Privacy: derived sources carry `github: { owner, repo }` for the
//     pipeline's validation-only metadata fetch, but `stripPrivateIdentity`
//     (portfolio-deployed-meta.mjs) returns a copy without it, so the
//     integration layer can trivially omit GitHub identity from any public
//     artifact.
//   - No metrics: derived narratives and descriptions never claim outcomes.
//   - Tokens are only ever forwarded to their own service's modules, which
//     confine them to request headers; they never appear in logs or errors.
//   - Network is injectable: `fetchImpl` (APIs) and `htmlFetchImpl` (deployed
//     page) are both injectable, keeping every test offline.
//
// Deployed-HTML validation, the published-skip guard, card-title derivation
// and identity stripping live in portfolio-deployed-meta.mjs.

import {
  DEFAULT_PORTFOLIO_TOPIC,
  DiscoveryError,
  listPortfolioRepositories,
} from "./github-discovery.mjs";
import { listVercelProjects } from "./vercel-projects.mjs";
import { matchVercelProject } from "./vercel-project-match.mjs";
import {
  deriveAllowedOrigins,
  pickProductionUrl,
  resolveProductionDeployment,
} from "./vercel-production.mjs";
import { isValidHostname } from "./vercel-project-match.mjs";
import {
  deriveCategory,
  deriveGradient,
  deriveNarrative,
  deriveSeoTexts,
  deriveStack,
  normalizeSlug,
} from "./portfolio-classify.mjs";
import { deriveCardTitle, fetchDeployedMeta } from "./portfolio-deployed-meta.mjs";

export { DEFAULT_PORTFOLIO_TOPIC as DEFAULT_TOPIC, DiscoveryError };

// Slug assignment with collision guard: base slug from the repo name; on
// collision the kebab owner is appended; an unresolvable collision aborts.
export function assignSlug(repo, usedSlugs) {
  const base = normalizeSlug(repo.name) ?? normalizeSlug(repo.fullName) ?? "proyecto";
  if (!usedSlugs.has(base)) {
    usedSlugs.add(base);
    return base;
  }
  const ownerSuffix = normalizeSlug(repo.owner);
  const withOwner = ownerSuffix ? `${base}-${ownerSuffix}` : null;
  if (withOwner && !usedSlugs.has(withOwner)) {
    usedSlugs.add(withOwner);
    return withOwner;
  }
  throw new DiscoveryError(
    `Portfolio slug collision could not be resolved for GitHub repository id ${repo.id} (slug "${withOwner}")`
  );
}

// Skip records are reason/count-safe only: numeric projectId plus a stable
// reason code. No repository name/full name/owner leaves this module.
function skipEntry(repo, reason) {
  return { projectId: repo.id, reason };
}

// Accepts only an absolute http(s) URL with a valid host. Anything else is treated
// as absent rather than trusted, so a malformed homepage never becomes an origin.
function publicUrl(value) {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    if (!isValidHostname(url.hostname)) return null;
    return url.toString();
  } catch {
    return null;
  }
}

// Origin for a repository that has no Vercel project. The portfolio is not
// Vercel-only: choosing not to deploy on Vercel is a legitimate decision, so a
// project may live on GitHub Pages or on any host the repository declares — and a
// project may have no deployment at all.
//
// Order: the declared homepage, then GitHub Pages, then the repository itself. A
// repository with no deployment still becomes a portfolio source whose public URL
// is the repository, so the card links to the project instead of the project
// silently disappearing from the portfolio.
//
// `fetchDeployedPage` is false for the repository-only case: there is no deployed
// page to read, so the card is derived from the repository metadata alone.
export function resolveNonVercelOrigin(repo) {
  const homepage = publicUrl(repo.homepage);
  if (homepage) {
    return {
      productionUrl: homepage,
      allowedOrigins: [new URL(homepage).origin],
      fetchDeployedPage: true,
      kind: "homepage",
    };
  }
  if (repo.hasPages && repo.owner && repo.name) {
    const pages = `https://${String(repo.owner).toLowerCase()}.github.io/${repo.name}/`;
    return {
      productionUrl: pages,
      allowedOrigins: [new URL(pages).origin],
      fetchDeployedPage: true,
      kind: "github-pages",
    };
  }
  const repository = publicUrl(repo.htmlUrl);
  if (repository) {
    return {
      productionUrl: repository,
      allowedOrigins: [new URL(repository).origin],
      fetchDeployedPage: false,
      kind: "repository",
    };
  }
  return null;
}

// Card name for a source with no deployed page to read a title from: the
// repository name, made readable ("butacas-libres" -> "Butacas Libres").
export function deriveRepoCardName(repo) {
  const base = String(repo?.name || repo?.fullName || "proyecto");
  const words = base
    .split(/[-_.\s]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1));
  return words.length > 0 ? words.join(" ") : "Proyecto";
}

// Runs the full offline-testable discovery flow:
//   1. GitHub: topic-selected, non-archived, non-disabled repositories.
//   2. Vercel: project list for matching.
//   3. Per repository (sorted by repo id): match project, confirm the newest
//      production deployment is READY, pick the production URL, fetch the
//      deployed HTML metadata (failure here aborts the run), derive the
//      pipeline-compatible source.
// Returns { sources, skipped }; any API/auth/shape/production-HTML failure
// aborts, while missing/non-READY deployments skip with a reason.
export async function discoverPortfolio({
  githubToken,
  vercelToken,
  vercelTeamId = null,
  topic = DEFAULT_PORTFOLIO_TOPIC,
  fetchImpl = globalThis.fetch,
  htmlFetchImpl = null,
  maxPages,
} = {}) {
  if (typeof fetchImpl !== "function") {
    throw new DiscoveryError("discoverPortfolio requires an injectable fetchImpl");
  }
  const repos = await listPortfolioRepositories({
    fetchImpl,
    token: requireToken(githubToken, "githubToken"),
    topic,
    ...(maxPages !== undefined ? { maxPages } : {}),
  });
  const projects = await listVercelProjects({
    fetchImpl,
    token: requireToken(vercelToken, "vercelToken"),
    teamId: vercelTeamId,
    ...(maxPages !== undefined ? { maxPages } : {}),
  });

  const sources = [];
  const skipped = [];
  const usedSlugs = new Set();
  const usedProjectIds = new Set();

  for (const repo of repos) {
    const project = matchVercelProject(projects, repo);
    let productionUrl = null;
    let allowedOrigins = null;
    let fetchDeployedPage = true;

    if (project) {
      const resolved = await resolveProductionDeployment({ fetchImpl, token: vercelToken, teamId: vercelTeamId, project });
      if (!resolved.ok) {
        skipped.push(skipEntry(repo, resolved.reason));
        continue;
      }
      productionUrl = pickProductionUrl({
        aliases: project.production?.aliases ?? [],
        url: resolved.url ?? project.production?.url ?? null,
      });
      if (!productionUrl) {
        skipped.push(skipEntry(repo, "vercel-production-url-unavailable"));
        continue;
      }
      // The project's own production origins, derived before the fetch so the same
      // set both validates the redirect and lands in the published record. A
      // redirect between them (apex -> www) is normal and must be followed.
      allowedOrigins = deriveAllowedOrigins({
        productionUrl,
        aliases: project.production?.aliases ?? [],
        url: resolved.url ?? project.production?.url ?? null,
      });
    } else {
      // Not every portfolio project is on Vercel. Fall back to the repository's own
      // public origin, and to the repository itself when it declares none.
      const origin = resolveNonVercelOrigin(repo);
      if (!origin) {
        skipped.push(skipEntry(repo, "no-public-deployment"));
        continue;
      }
      productionUrl = origin.productionUrl;
      allowedOrigins = origin.allowedOrigins;
      fetchDeployedPage = origin.fetchDeployedPage;
    }

    const expectedOrigin = new URL(productionUrl).origin;
    // A matched READY deployment whose production page cannot be read is a skip,
    // not an abort. fetchDeployedMeta aborts on network/5xx/cross-origin-redirect
    // failures and on a missing <title>; swallowing that here keeps the rest of
    // the run alive. The published-skip guard still aborts when this projectId is
    // already published, so the previous protection is unchanged.
    let meta = null;
    if (fetchDeployedPage) {
      try {
        meta = await fetchDeployedMeta({
          fetchImpl,
          htmlFetchImpl,
          productionUrl,
          expectedOrigin,
          allowedOrigins,
        });
      } catch {
        skipped.push(skipEntry(repo, "deployed-html-unavailable"));
        continue;
      }
      // A null/empty result from an injected htmlFetchImpl is the same outcome and
      // must not be mistaken for a usable page.
      if (!meta || !meta.title) {
        skipped.push(skipEntry(repo, "deployed-html-unavailable"));
        continue;
      }
    }
    if (usedProjectIds.has(repo.id)) {
      throw new DiscoveryError(`projectId collision for GitHub repository id ${repo.id}`);
    }
    usedProjectIds.add(repo.id);
    const slug = assignSlug(repo, usedSlugs);

    const categoria = deriveCategory({ topics: repo.topics, language: repo.language });
    const stack = deriveStack({ language: repo.language, topics: repo.topics, html: meta?.html ?? null });
    // With no deployed page there is no <title> to read, so the card name comes
    // from the repository itself.
    const nombre = meta ? deriveCardTitle(meta.title) : deriveRepoCardName(repo);
    const cardDescripcion =
      repo.description ?? (meta?.description && meta.description.trim() ? meta.description : null);
    const narrative = deriveNarrative({ nombre, categoria, stack });
    const seo = deriveSeoTexts({
      nombre,
      categoria,
      deployedTitle: meta?.title ?? null,
      deployedDescription: meta?.description ?? null,
      repoDescription: repo.description,
    });

    sources.push({
      id: slug,
      projectId: repo.id,
      // Topic selection (onilabs-portfolio) is the explicit approval signal:
      // discovered sources enter the pipeline as approved.
      clientApproved: true,
      productionUrl,
      expectedOrigin,
      allowedOrigins,
      github: { owner: repo.owner, repo: repo.name },
      stack,
      thumbnail: { gradient: deriveGradient(slug) },
      card: {
        nombre,
        descripcion: cardDescripcion ?? `${nombre}: ${categoria.toLowerCase()} publicado como demo del portfolio.`,
      },
      seo: {
        slug,
        categoria,
        tituloSeo: seo.tituloSeo,
        descripcionSeo: seo.descripcionSeo,
        desafio: narrative.desafio,
        enfoque: narrative.enfoque,
      },
    });
  }

  sources.sort((a, b) => a.projectId - b.projectId);
  return { sources, skipped };
}

function requireToken(token, label) {
  if (typeof token !== "string" || !token) {
    throw new DiscoveryError(`discoverPortfolio requires a ${label}`);
  }
  return token;
}

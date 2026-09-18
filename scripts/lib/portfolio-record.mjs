// Portfolio metadata fetching & public-record building.
//
// Responsibilities:
//   - Fetch GitHub repository metadata to cross-check that the repository
//     homepage matches an allowed production origin (validation-only; never
//     written into the generated JSON).
//   - Fetch the public production HTML and extract its title / meta
//     description with the shared safe regex helpers.
//   - Build the deterministic public record for the generated JSON.
//
// Guarantees owned here:
//   - Metadata is validation-only: the GitHub homepage origin must match the
//     expected production origin or any source allowedOrigins entry, and
//     metadata is never written into the generated JSON.
//   - GitHub token confinement: PORTFOLIO_GITHUB_TOKEN is sent only to
//     api.github.com as a Bearer header, nowhere else.
//   - Origin validation: production fetches must land on the expected origin
//     or any source allowedOrigins entry (Vercel deployment aliases derived
//     by discovery) even after redirects.
//   - Safe HTML extraction: delegated to portfolio-classify.mjs (plain regex
//     over raw text, tags stripped from the result, whitespace collapsed; no
//     DOM/eval involved).
//   - Deterministic record: explicit field order keeps the JSON byte-stable
//     across runs; GitHub identity never reaches the record.

import { fail, allowedOriginsFor } from "./portfolio-registry.mjs";
import { extractTitle, extractMetaDescription } from "./portfolio-classify.mjs";

const USER_AGENT = "OniLabs-Portfolio-Sync/1.0";
const GITHUB_TOKEN = process.env.PORTFOLIO_GITHUB_TOKEN || "";

// Fetches GitHub repository metadata to cross-check that the repository
// homepage matches the expected production origin or any source
// allowedOrigins entry. Validation-only: the metadata is never written into
// the generated JSON.
export async function fetchRepoMetadata(source, fetchImpl = globalThis.fetch) {
  if (!source.github) return null;
  const url = `https://api.github.com/repos/${source.github.owner}/${source.github.repo}`;
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": USER_AGENT,
  };
  if (GITHUB_TOKEN) headers.Authorization = `Bearer ${GITHUB_TOKEN}`;

  const response = await fetchImpl(url, { headers });
  if (!response.ok) {
    fail(`GitHub metadata fetch failed for ${source.id}: HTTP ${response.status}`);
  }
  const metadata = await response.json();

  // Cross-check: the repository homepage must match the production origin or
  // any allowedOrigins entry (Vercel deployment aliases derived by discovery).
  if (metadata.homepage) {
    let homepage;
    try {
      homepage = new URL(metadata.homepage);
    } catch {
      fail(`${source.id}: GitHub homepage is not a valid URL`);
    }
    if (!allowedOriginsFor(source).has(homepage.origin)) {
      fail(
        `${source.id}: GitHub homepage origin (${homepage.origin}) does not match the allowed production origins`
      );
    }
  }
  return metadata;
}

export async function fetchProductionHtml(source, fetchImpl = globalThis.fetch) {
  let response;
  try {
    response = await fetchImpl(source.productionUrl, {
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
  if (!allowedOriginsFor(source).has(finalUrl.origin)) {
    fail(
      `${source.id}: production redirect landed on ${finalUrl.origin}, which is not one of the allowed production origins`
    );
  }
  const html = await response.text();
  return { title: extractTitle(html), description: extractMetaDescription(html) };
}

export function buildRecord(source, fetchedMeta) {
  // Explicit field order keeps the JSON byte-stable across runs.
  //
  // SEO texts: the freshly fetched deployed metadata wins when present;
  // discovered sources keep their derived seo texts (tituloSeo,
  // descripcionSeo, desafio, enfoque) as the safe fallback instead of
  // degrading to empty strings. Hand-authored narrative (desafio/enfoque) is
  // emitted only when the source provides it, so the proyectos-seo.js merge
  // keeps manual editorial narrative winning for those entries.
  const seo = {
    slug: source.seo.slug,
    categoria: source.seo.categoria,
    tituloSeo: fetchedMeta?.title ?? source.seo.tituloSeo ?? "",
    descripcionSeo: fetchedMeta?.description ?? source.seo.descripcionSeo ?? "",
  };
  if (typeof source.seo.desafio === "string" && source.seo.desafio.trim()) {
    seo.desafio = source.seo.desafio;
  }
  if (typeof source.seo.enfoque === "string" && source.seo.enfoque.trim()) {
    seo.enfoque = source.seo.enfoque;
  }
  return {
    id: source.projectId,
    card: {
      nombre: source.card.nombre,
      url: source.productionUrl,
      imagen: `/portfolio/${source.id}.png`,
      stack: source.stack.map((tech) => tech.trim()),
      descripcion: source.card.descripcion,
    },
    seo,
  };
}

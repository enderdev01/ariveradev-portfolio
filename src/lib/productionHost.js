// Production-host identity, shared by the two catalog data modules.
//
// The hand-curated catalog and the generated one identify the same project
// differently: a curated entry carries a hand-assigned numeric id, while a
// discovered entry carries the GitHub repository id. Ids can therefore never be
// the join key, and the same project would be listed twice — two cards in the
// grid and two sitemap URLs for one site.
//
// Deployed sites are identified by host; GitHub links need owner and repository
// as well, since many unrelated projects share github.com.
export function productionHostKey(url) {
  if (typeof url !== "string" || !url.trim()) return null;
  try {
    const parsed = new URL(url.trim());
    const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
    if (host === "github.com") {
      const parts = parsed.pathname.split("/").filter(Boolean);
      return parts.length >= 2 ? `${host}/${parts[0].toLowerCase()}/${parts[1].replace(/\.git$/i, "").toLowerCase()}` : null;
    }
    return host;
  } catch {
    return null;
  }
}

export function productionHostKeys(urls) {
  const keys = new Set();
  for (const url of urls ?? []) {
    const key = productionHostKey(url);
    if (key) keys.add(key);
  }
  return keys;
}

// Production-host identity, shared by the two catalog data modules.
//
// The hand-curated catalog and the generated one identify the same project
// differently: a curated entry carries a hand-assigned numeric id, while a
// discovered entry carries the GitHub repository id. Ids can therefore never be
// the join key, and the same project would be listed twice — two cards in the
// grid and two sitemap URLs for one site.
//
// The production host is the identity both sides actually share, so it is the
// join key used here. The `www.` prefix is stripped so an apex host and its www
// form match, which also covers the redirect between them.
export function productionHostKey(url) {
  if (typeof url !== "string" || !url.trim()) return null;
  try {
    const host = new URL(url.trim()).hostname.toLowerCase();
    return host.startsWith("www.") ? host.slice(4) : host;
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

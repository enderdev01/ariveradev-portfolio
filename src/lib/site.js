// Single source of truth for the public origin.
// Canonical host is the www subdomain: the apex 307-redirects to it.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.onilabs.site";

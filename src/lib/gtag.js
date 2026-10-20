// Google Analytics 4. The measurement id is public by design (it ships in the
// page source of every GA site), so a default is safe; the env var only exists
// to point staging builds at a different property.
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-213HR1VNND";

// No-op when gtag has not loaded (ad blockers, SSR, slow network), so callers
// never need to guard it.
export function trackEvent(name, params = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}

// next/link and next/router force an instant jump for hash targets (they set
// `scroll-behavior: auto` around their own scrollIntoView). In-page links route
// through here instead so the platform smooth scroll applies: `html` declares
// `scroll-behavior: smooth` (instant under prefers-reduced-motion) and
// `scroll-padding-top`, which scrollIntoView honors.
export function scrollToSection(target, hash) {
  if (!target) return;

  target.scrollIntoView({ block: "start" });
  if (hash && window.location.hash !== hash) {
    window.history.pushState(null, "", hash);
  }
}

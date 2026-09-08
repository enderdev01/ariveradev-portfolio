export function getMotionSafeScrollBehavior() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";
}

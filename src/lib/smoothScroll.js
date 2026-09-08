let activeFrame = null;
let restoreScrollBehavior = null;

const easeInOutCubic = (progress) =>
  progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 3) / 2;

const getScrollPaddingTop = () => {
  const value = window.getComputedStyle(document.documentElement).scrollPaddingTop;
  const padding = Number.parseFloat(value);
  return Number.isFinite(padding) ? padding : 0;
};

export function smoothScrollToElement(target) {
  if (!target || typeof window === "undefined") return;

  if (activeFrame) {
    window.cancelAnimationFrame(activeFrame);
    activeFrame = null;
  }
  restoreScrollBehavior?.();

  const root = document.documentElement;
  const previousScrollBehavior = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  restoreScrollBehavior = () => {
    root.style.scrollBehavior = previousScrollBehavior;
    restoreScrollBehavior = null;
  };

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    target.scrollIntoView({ block: "start" });
    restoreScrollBehavior();
    return;
  }

  const startPosition = window.scrollY;
  const targetPosition = Math.max(
    0,
    target.getBoundingClientRect().top + startPosition - getScrollPaddingTop()
  );
  const distance = targetPosition - startPosition;
  const duration = Math.min(1800, Math.max(950, 700 + Math.abs(distance) * 0.3));
  let startTime = null;

  const animate = (timestamp) => {
    if (startTime === null) startTime = timestamp;

    const progress = Math.min((timestamp - startTime) / duration, 1);
    window.scrollTo(0, startPosition + distance * easeInOutCubic(progress));

    if (progress < 1) {
      activeFrame = window.requestAnimationFrame(animate);
    } else {
      activeFrame = null;
      restoreScrollBehavior?.();
    }
  };

  activeFrame = window.requestAnimationFrame(animate);
}

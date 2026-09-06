import { useEffect } from "react";

import { ONI } from "./config";

// Drives the atmosphere's intensity from scroll position.
//
// Rather than switching on whichever section is "current", every section in
// view contributes in proportion to how much of the viewport it occupies. Two
// sections sharing the screen produce a weighted blend automatically, so the
// field changes character continuously while scrolling instead of stepping
// between fixed levels at section boundaries.
export default function useSectionIntensity(onChange) {
  useEffect(() => {
    let rafId = null;
    let queued = false;

    const measure = () => {
      queued = false;
      const sections = document.querySelectorAll("[data-oni-section]");
      const vh = window.innerHeight || 1;

      let weighted = 0;
      let total = 0;
      let heroCoverage = 0;

      sections.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const overlap =
          Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
        if (overlap <= 0) return;

        const key = el.dataset.oniSection;
        const value = ONI.sections[key];
        if (value === undefined) return;

        weighted += value * overlap;
        total += overlap;
        if (key === "hero") heroCoverage += overlap / vh;
      });

      if (total <= 0) return;
      onChange({
        intensity: weighted / total,
        heroCoverage: Math.min(heroCoverage, 1),
      });
    };

    const schedule = () => {
      if (queued) return;
      queued = true;
      rafId = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [onChange]);
}

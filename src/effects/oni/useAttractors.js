import { useEffect } from "react";

import { ONI } from "./config";

// Binds hover on `[data-oni-attract]` elements to the atmosphere's attractor.
//
// Delegated from the document rather than attached per element: cards are
// rendered from data and the set changes, so per-element listeners would need
// re-binding on every render for no benefit.
export default function useAttractors(getEngine) {
  useEffect(() => {
    // A pull that follows a finger around is not a hover, it is a smear.
    if (window.matchMedia("(pointer: coarse)").matches) return undefined;

    const onOver = (event) => {
      const engine = getEngine();
      if (!engine) return;
      const target = event.target.closest?.("[data-oni-attract]");
      if (!target) return;
      const rect = target.getBoundingClientRect();
      engine.setAttractor(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
        ONI.attract.radiusPx
      );
    };

    const onOut = (event) => {
      const engine = getEngine();
      if (!engine) return;
      const from = event.target.closest?.("[data-oni-attract]");
      if (!from) return;
      // relatedTarget is null when the pointer leaves the window entirely.
      if (from.contains(event.relatedTarget)) return;
      engine.clearAttractor();
    };

    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerout", onOut, { passive: true });

    return () => {
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
    };
  }, [getEngine]);
}

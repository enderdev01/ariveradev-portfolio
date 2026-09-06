import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import ShowcaseFallback from "./ShowcaseFallback";

// Client gate for the scoped WebGL moment. Declares the module boundary but
// renders it conditionally, so the dynamic chunk is fetched only when
// `enabled` flips. Owns all three fallback conditions (reduced-motion,
// no-WebGL2, not-yet-in-view) with ONE shared fallback branch.

const Canvas = dynamic(() => import("./ProjectShowcaseCanvas"), {
  ssr: false,
  loading: () => null,
});

export default function ProjectShowcase({ proyecto }) {
  const ref = useRef(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // 1. Reduced motion — reuse Reveal.js's check verbatim, return BEFORE any
    //    observer or probe so the WebGL chunk is never requested.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    // 2. WebGL2 probe. Return on null: no context means no WebGL2 support.
    const probe = document.createElement("canvas");
    const gl = probe.getContext("webgl2");
    if (!gl) return;

    // 3. Only then observe. On intersect, enable and stop observing.
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          setEnabled(true);
          observer.unobserve(el);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  if (!proyecto?.imagen) return null;

  return (
    <div ref={ref} className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-border bg-surface">
      {enabled ? <Canvas /> : <ShowcaseFallback proyecto={proyecto} />}
    </div>
  );
}

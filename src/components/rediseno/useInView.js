import { useEffect, useRef, useState } from "react";

// Returns [ref, play] for a section's `data-play` attribute. `play` stays
// undefined on the server, so without JavaScript nothing is hidden; after mount
// it is "false" until the element is well into the viewport, then "true".
export default function useInView(threshold = 0.35) {
  const ref = useRef(null);
  const [play, setPlay] = useState(undefined);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    setPlay("false");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setPlay("true");
        observer.disconnect();
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, play];
}

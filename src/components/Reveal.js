import { useEffect, useRef } from "react";

const SCROLL_DRIVEN = "(animation-timeline: view()) and (animation-range: entry)";

// Scroll-reveal primitive.
//
// Where scroll-driven animations are supported, globals.css runs the reveal on
// a `view()` timeline and this component does nothing. Elsewhere it falls back
// to an IntersectionObserver per element. The hidden state is only ever added
// by script, so content stays visible if JavaScript never runs.
//
// - `delay` (ms): staggers siblings in the fallback (scroll timelines ignore it).
// - `blur`: adds a soft blur-in for headings / hero-level text.
// - Renders any tag via `as`, default `div`.
export default function Reveal({
  as: Tag = "div",
  delay = 0,
  blur = false,
  className = "",
  style,
  children,
  ...rest
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (CSS.supports(SCROLL_DRIVEN)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Already on screen at mount: hiding it now would flash and re-animate it.
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    el.classList.add("reveal-pending");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          el.classList.add("visible");
          observer.unobserve(el);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    // Dropping both classes releases the animation fill so the element's own
    // hover transitions keep working afterwards.
    const onEnd = (event) => {
      if (event.target !== el) return;
      el.classList.remove("reveal-pending", "visible");
    };

    el.addEventListener("animationend", onEnd);
    observer.observe(el);

    return () => {
      observer.disconnect();
      el.removeEventListener("animationend", onEnd);
    };
  }, []);

  const base = blur ? "reveal reveal-blur" : "reveal";

  return (
    <Tag
      ref={ref}
      className={`${base} ${className}`.trim()}
      style={{ ...(delay ? { animationDelay: `${delay}ms` } : {}), ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

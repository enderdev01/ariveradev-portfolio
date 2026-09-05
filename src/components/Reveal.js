import { useEffect, useRef } from "react";

// Scroll-reveal primitive. Observes EACH element on its own (not a whole
// section) so the animation triggers when the element itself enters the
// viewport — not when the container peeks in. That is what makes the motion
// actually visible while scrolling.
//
// - `delay` (ms): stagger siblings without blocking layout.
// - `blur`: adds a soft blur-in for headings / hero-level text.
// - Renders any tag via `as`, default `div`.
//
// The reveal runs as a one-shot CSS animation. On `animationend` we swap
// `.visible` for `.revealed`, which releases the animation fill-mode lock so
// the element's own hover transitions keep working afterwards.
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

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("revealed");
      return;
    }

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

    const onEnd = (event) => {
      if (event.target !== el) return;
      el.classList.add("revealed");
      el.classList.remove("visible");
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

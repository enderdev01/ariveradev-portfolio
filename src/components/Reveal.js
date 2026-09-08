import { useEffect, useRef } from "react";

// Scroll-reveal primitive. Observes EACH element on its own (not a whole
// section) so the animation triggers when the element itself enters the
// viewport — not when the container peeks in. That is what makes the motion
// actually visible while scrolling.
//
// - `delay` (ms): stagger siblings without blocking layout.
// - `variant`: matches duration and distance to the element hierarchy.
// - `threshold`: lower only for unusually large elements.
// - Renders any tag via `as`, default `div`.
//
// The reveal runs as a one-shot CSS animation. On `animationend` we swap
// `.visible` for `.revealed`, which releases the animation fill-mode lock so
// the element's own hover transitions keep working afterwards.
export default function Reveal({
  as: Tag = "div",
  delay = 0,
  variant = "body",
  threshold,
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

    if (!("IntersectionObserver" in window)) {
      el.classList.add("revealed");
      return;
    }

    el.classList.add("reveal-pending");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          el.classList.add("visible");
          observer.unobserve(el);
        });
      },
      {
        threshold: threshold ?? (variant === "card" ? 0.15 : 0.2),
        rootMargin: "0px 0px -8% 0px",
      }
    );

    const onEnd = (event) => {
      if (event.target !== el) return;
      el.classList.add("revealed");
      el.classList.remove("visible", "reveal-pending");
    };

    el.addEventListener("animationend", onEnd);
    observer.observe(el);

    return () => {
      observer.disconnect();
      el.removeEventListener("animationend", onEnd);
    };
  }, [threshold, variant]);

  const base = `reveal reveal-${variant}`;

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

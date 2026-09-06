import { useEffect, useRef, useState } from "react";

// Reveals a heading with a brush stroke sweeping across it.
//
// The mask is a hand-drawn ragged edge (see `--ink-brush` in globals.css) three
// times wider than the element. Animating its position slides that edge across
// the text, so the reveal reads as pigment being laid down rather than as an
// opacity fade.
//
// Robustness first: the element renders UNMASKED. Masking is applied only once
// the client has armed it, because a masked heading whose JavaScript never runs
// is invisible text — the failure mode has to be "no animation", never "no
// content".
export default function InkReveal({
  as: Tag = "h2",
  className = "",
  children,
  ...rest
}) {
  const ref = useRef(null);
  const [phase, setPhase] = useState("plain"); // plain -> armed -> revealed

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    // A stroke wiping across the viewport is exactly the kind of motion the
    // reduced-motion preference is asking us not to make.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    setPhase("armed");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          setPhase("revealed");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.35, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // `inline-block` is part of the contract, not styling: a block-level heading
  // stretches to its container, so the mask would sweep the full column width
  // while the centred text occupies a fraction of it — most of the animation
  // would be spent revealing empty space. Hugging the text also drops the
  // horizontal stretch applied to the mask, which keeps the torn edge steep.
  const state =
    phase === "armed"
      ? "ink-reveal is-armed inline-block"
      : phase === "revealed"
      ? "ink-reveal is-revealed inline-block"
      : "inline-block";

  return (
    <Tag ref={ref} className={`${state} ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}

// A finger on a phone screen, not an arrow (Stageshow touch style): a soft dot
// that lands, presses and lifts in place. Coordinates are iOS points inside
// the Phone screen; without x/y it centers on its positioned parent.
// `touch`: null (never shown) or { x?, y?, pressed?, gone?, swipe? }.
export default function Touch({ touch }) {
  const shown = touch && !touch.gone;
  const centered = touch?.x === undefined;
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute z-40 -ml-[22px] -mt-[22px] h-[44px] w-[44px] rounded-full bg-[rgba(118,118,128,0.38)] shadow-[0_2px_8px_rgba(0,0,0,0.18)] ring-2 ring-white/70"
      style={{
        left: centered ? "50%" : touch.x,
        top: centered ? "50%" : touch.y,
        opacity: shown ? 1 : 0,
        transform: `scale(${shown ? (touch.pressed ? 0.82 : 1) : 0.7})`,
        transition: touch?.swipe
          ? "top 240ms cubic-bezier(0.4, 0, 1, 1), transform 100ms ease-out"
          : "opacity 160ms ease, transform 140ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    />
  );
}

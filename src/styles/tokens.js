// Dark theme color tokens — single source of truth.
//
// Indigo family, hue 228-248deg. The four anchors (#080616, #1A1953, #162E93,
// #2F2FE4) are the committed palette; every other value is derived at hue 240
// so the family stays closed. Contrast was verified against each real usage
// before these landed — see the ratios in the comments below.
//
// The tonal ladder matches the one the layout already relies on:
//   background -> surface      1.25
//   surface    -> surface-alt  1.41
//   background -> border       1.76
// Surface steps are meant to be subtle; they are not text contrast.
//
// Each value is a space-separated RGB channel triple so Tailwind can emit
// `rgb(var(--<name>) / <alpha-value>)` and `bg-primary/10` keeps working.
module.exports = {
  background: "8 6 22", // #080616 — near-black indigo. Channel spread is 16, so it reads calm, not tinted.
  "bg-washi": "8 6 22", // #080616 — alias for "washi" references
  surface: "26 25 83", // #1A1953 — cards, panels
  "surface-alt": "22 46 147", // #162E93 — the highest tonal step

  "text-primary": "240 240 244", // #F0F0F4 — 17.63:1 on background, 14.13:1 on surface
  "text-secondary": "206 206 218", // #CECEDA — 12.85:1 on background, 10.30:1 on surface
  "text-muted": "146 146 170", // #9292AA — 6.60:1 on background, 5.29:1 on surface

  // The interactive voice, split by job. `primary` is the text-level voice:
  // links, hovered borders, eyebrows, focus outlines. `primary-fill` is the
  // filled-surface voice and NOTHING else — at 2.53:1 on the background it
  // cannot carry text or a border.
  primary: "142 142 246", // #8E8EF6 — 7.01:1 on background, 5.62:1 on surface
  "primary-fill": "47 47 228", // #2F2FE4 — white on it is 7.93:1
  "primary-dark": "22 46 147", // #162E93 — hover for a filled surface; white on it is 11.37:1
  "primary-soft": "194 194 255", // #C2C2FF — focus halo; also legible on primary-fill at 4.70:1

  accent: "194 194 255", // #C2C2FF — the rare luminous fleck, 11.88:1 on background
  "accent-soft": "30 27 94", // #1E1B5E — dark wash behind accent text (9.07:1)

  seal: "236 90 90", // #F25A5A — 6.09:1 on background, 4.88:1 on surface
  error: "236 90 90", // #F25A5A — resolves to seal

  success: "97 209 144", // #61D190 — 10.53:1 on background
  "success-strong": "97 209 144", // #61D190 — text-safe on dark
  warning: "240 176 66", // #F0B042 — 8.41:1 on surface
  "warning-strong": "246 187 85", // #F6BB55 — 11.60:1 on background

  border: "22 46 147", // #162E93 — hairline. Same value as surface-alt: a border here is a tonal edge.
};

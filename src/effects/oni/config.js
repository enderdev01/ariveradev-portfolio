// Oni atmosphere — centralized visual config. Single source for every magic
// number; components and the WebGL layer read from here only.
//
// No color is invented: every tint below already exists in the project palette
// (tokens.js / tailwind.config.js). Depth and variation come from alpha,
// luminance and blending, never from new hues.

export const ONI = {
  // Particle mix ratios (sum ~1): ink 50-60%, brush 20-25%, ash 10-15%,
  // glow <= 5%. Brush fragments are weighted up because elongated strokes are
  // what stop the field reading as "lots of little dots".
  ratios: {
    ink: 0.57,
    brush: 0.23,
    ash: 0.15,
    glow: 0.05,
  },

  // Fraction of the ink family drawn as a petal rather than a droplet. Petal
  // geometry (narrow base, belly, defined tip, curving midrib) is borrowed
  // from Japanese floral tattoo work; the motif and its palette are not. Push
  // this too high and the field starts reading as flowers instead of pigment.
  petalShare: 0.4,

  // ---- Palette (existing tokens only) ----
  // The ground is #080616 and particles blend normally (source-over), so a
  // particle paints its own colour rather than adding light to whatever sits
  // behind it. Overlapping sprites therefore stay bounded and keep their
  // silhouette instead of accumulating into a blown-out smear.
  //
  // These tokens still sit above the ground in luminance, a holdover from the
  // additive era: under source-over a colour DARKER than the ground would read
  // as real pigment. Changing them is a palette decision, tracked separately.
  colors: {
    ink: "#162E93", // surface-alt — pigment bodies
    inkDense: "#9292AA", // text-muted — the denser motes
    ash: "#9292AA", // text-muted — suspended ash
    accent: "#C2C2FF", // accent — the rare luminous flecks
    primary: "#8E8EF6",
    seal: "#F25A5A", // present in tokens; used only as a faint presence hint
  },

  // ---- Camera / world ----
  // Particles live in world units. The visible world height at z=0 is
  // 2 * distance * tan(fov/2); everything else is derived from it so the field
  // covers the viewport at any aspect ratio.
  camera: {
    fov: 60,
    distance: 30,
    near: 0.1,
    far: 200,
    depth: 16, // z spread of the field, centered on 0
    margin: 1.25, // world coverage beyond the visible frame (wrap headroom)
  },

  // ---- Global particle field ----
  particle: {
    // Density pays for size. Fewer, larger particles read as material; more,
    // smaller ones read as noise, and under source-over blending the extra
    // sprites also cost real fill rate instead of quietly summing away.
    densityPerMpx: 5, // particles per 10k css px^2 (~810 on a 1718x944 frame)
    maxCount: 1500,
    minCount: 300,
    size: 4.5, // base world size; screen px = size * (300 / -viewZ)
    // Sizes follow a power law rather than a uniform spread: most particles
    // stay small and fill the field, while a minority grow large enough for
    // their silhouette to actually read. A sprite of ~10px cannot show a shape,
    // which is why a uniform small size makes any design collapse into a dot.
    //
    // At camera distance 30 the screen size is size * (300 / |z|), so this
    // spread lands roughly between 14 and 45 css px — the smallest particle is
    // now the size the largest one used to be, which is the point.
    sizeMinScale: 0.32,
    sizeBias: 1.4, // higher = more small particles, fewer large ones
    brushScale: 1.8, // brush fragments are longer
    ashScale: 0.6,
    glowScale: 0.34,
    maxScreenSize: 96, // px clamp, guards against overdraw on close z
    // Global alpha scale. Additive blending capped itself against the dark
    // ground; source-over does not, and the per-silhouette alphas were written
    // for a blend mode that swallowed most of them. Without this the same
    // numbers paint near-opaque slate blobs.
    opacity: 0.85,
    // Atmospheric perspective. Size alone only spans a 1.7x range across the
    // field's depth, which is not enough to separate front from back; without
    // an alpha gradient every particle reads as pinned to the same plane.
    // This is the fraction of alpha the farthest particle loses.
    depthFade: 0.45,
  },

  // ---- Motion (procedural, organic) ----
  motion: {
    baseSpeed: 1.15, // world units/s — slow, hypnotic
    speedVariation: 1.5,
    curlScale: 0.055, // noise field frequency (world units -> noise space)
    curlEpsilon: 0.4, // finite-difference step for the curl derivative
    curlStrength: 1.0,
    fieldDrift: 0.035, // how fast the noise field itself travels
    damping: 0.94, // per 1/60s; normalized by dt at runtime
    brushSpeedFactor: 0.55, // brush fragments drift slower
    ashSpeedFactor: 0.8,
    // Floor on how much section intensity is allowed to slow the drift. At 0
    // a quiet section would freeze solid, which reads as broken rather than
    // calm; the field must keep breathing everywhere.
    intensityFloor: 0.45,
  },

  // ---- Cursor (subtle, velocity-aware) ----
  cursor: {
    radiusPx: 180, // influence radius in css px, converted to world units
    // These are accelerations in world units/s^2, and damping eats most of the
    // impulse: terminal velocity lands near accel * dt / (1 - damping), so the
    // numbers have to be an order of magnitude above the visible displacement.
    // Both terms are gated on cursor activity. A constant baseline push looks
    // harmless but is not: a resting cursor evacuates its neighbourhood within
    // seconds and drags a permanent hole around the field.
    repel: 14, // deflection at full activity
    velocityStrength: 115, // extra push, scaled by how fast the cursor moves
    activityFloorPx: 240, // cursor px/s at which the baseline reaches full force
    maxVelocityPx: 2200, // clamp on cursor px/s
    easing: 0.14, // smoothing of the pointer itself
    idleTimeout: 260, // ms without movement before velocity decays out
  },

  // ---- Hover attractor (cards, CTAs) ----
  // Same units as the cursor forces: an acceleration, so it has to sit well
  // above the displacement you want to see once damping has taken its cut.
  attract: {
    strength: 7,
    radiusPx: 280,
    swirl: 0.45, // tangential fraction — turns the pull into a slow orbit
    easing: 0.06, // how fast the pull fades in and out
  },

  // ---- Ink field (breathing sumi-e haze) ----
  inkField: {
    opacity: 0.2,
    scale: 1.6,
    lacunarity: 2.1,
  },

  // ---- Abstract oni presence ----
  // Suggestion only: horns, a brow and two hollows implied inside the ink,
  // never drawn as a figure. Raise `strength` and it stops being pareidolia
  // and becomes a mask, which is the one thing the brief rules out.
  presence: {
    strength: 0.95,
    period: 58, // seconds between appearances
    warp: 0.09, // how much the fbm distorts the form's sample point
    reducedMotionScale: 0.35,
  },

  // ---- Legibility (spec: content keeps priority) ----
  // Reduced-density well around the hero copy, in NDC. Particles fade inside
  // it instead of disappearing, so the field still reads as continuous.
  safeZone: {
    x: 0.0,
    y: 0.04,
    halfW: 0.54,
    halfH: 0.44,
    strength: 0.75, // 0 = no effect, 1 = fully cleared
  },

  // ---- Section intensity ----
  sections: {
    hero: 1.0,
    services: 0.35,
    projects: 0.5,
    process: 0.25,
    team: 0.25,
    contact: 0.75,
    footer: 0.15,
  },

  // ---- Quality tiers ----
  // Chosen from viewport size, pointer type and devicePixelRatio at init and
  // re-evaluated on resize.
  quality: {
    high: { pixelRatioCap: 2, particleScale: 1.0, curl: true },
    medium: { pixelRatioCap: 1.75, particleScale: 0.7, curl: true },
    low: { pixelRatioCap: 1.5, particleScale: 0.42, curl: false },
  },

  // ---- prefers-reduced-motion ----
  reducedMotion: {
    timeScale: 0.1,
    cursor: false,
    inkOpacityScale: 0.6,
    particleScale: 0.5,
  },
};

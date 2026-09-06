# Oni atmosphere

A single WebGL layer behind the whole page: a procedural ink field plus a
particle field of pigment, brush fragments and ash. Every tunable value lives in
`config.js` — there are no magic numbers in the components or shaders.

## Layout

| File | Responsibility |
| --- | --- |
| `config.js` | Every tunable value. Start here. |
| `Atmosphere.js` | The engine: scene, simulation, input, disposal. No React. |
| `shaders/particles.js` | Per-particle silhouettes (ink mote, petal, brush, ash, glow). |
| `shaders/ink.js` | The sumi-e haze and the abstract presence inside it. |
| `useSectionIntensity.js` | Drives intensity from scroll position. |
| `useAttractors.js` | Binds hover on `[data-oni-attract]` to the engine. |
| `../../components/OniAtmosphere.js` | Mounts the engine, owns teardown. |

## The knobs you will actually reach for

| Value | Does what | Watch out for |
| --- | --- | --- |
| `particle.densityPerMpx` | Particles per 10k css px², before quality scaling. | Clamped by `minCount` / `maxCount`. |
| `particle.size` | Base sprite size in world units. | Screen px ≈ `aSize × 10` at dpr 2. Below ~2px a silhouette feature stops existing. |
| `particle.sizeBias` | Power-law exponent on size. Higher = more small particles. | Lower it and overdraw climbs fast. |
| `ratios` | Mix of ink / brush / ash / glow. Must sum to ~1. | More glow reads as a star field. |
| `petalShare` | Fraction of the ink family drawn as a petal. | Too high and the field reads as flowers. |
| `motion.baseSpeed` | Drift speed. | The field should feel suspended, not blown. |
| `motion.damping` | Velocity decay per 1/60s. | Every impulse below is divided by `1 - damping`, so forces look large on purpose. |
| `cursor.repel` / `velocityStrength` | Pointer deflection. | Both are gated on cursor activity: a still pointer must exert nothing, or it carves a hole that follows it. |
| `attract.strength` | Pull toward a hovered element. | At 26 the pull was 120px and particles collapsed onto the card. 7 is the calm value. |
| `safeZone` | Reduced-density well over the hero copy. | Faded out with the hero by `OniAtmosphere`; a fixed well punches a hole through every section. |
| `sections` | Intensity per section, 0–1. | Keys must match `data-oni-section` attributes in the markup. |
| `presence.strength` | How strongly the oni form surfaces. | Raise it and pareidolia becomes a mask, which the design explicitly rules out. |
| `quality` | Per-tier particle scale, DPR cap, curl on/off. | Tier is picked from viewport width and pointer type. |

## Things that will bite you

- **Sections must be transparent.** The canvas is `position: fixed` behind the
  page. An opaque section background hides it completely, and `bg-background` on
  a section is opaque even though it matches the page colour.
- **A fixed canvas paints above static content.** It needs `z-0` *and* the
  content needs `relative z-10`, or the atmosphere covers the page.
- **Never put a backtick in a GLSL comment.** The shaders are template literals;
  a backtick ends the string and the error points somewhere unhelpful.
- **`smoothstep(a, b, x)` with `a >= b` is undefined** in GLSL ES. Use the
  `band()` helper in `particles.js` for reversed ramps.
- **Adding to a multi-shader file:** anchor edits on something unique to the
  target shader. `void main() {` matches the vertex shader first.
- **Stretched SVG masks distort.** `InkReveal`'s mask is scaled to the element,
  so horizontal detail is magnified by `width / height`. Pre-distort the drawing
  by that factor or a diagonal edge flattens into a band.

## Verifying changes

`window.__oni` exposes the engine in development. Useful moves:

```js
__oni.count                       // particles currently alive
__oni.intensity                   // eased section intensity
__oni.setIntensity(0.5)           // override to inspect a level
__oni.inkMaterial.uniforms.uTime.value = 8.7   // jump to the presence peak

// Freeze a frame before zooming in on a particle; every capture renders a new
// one otherwise, and the thing you aimed at has already moved.
requestAnimationFrame = () => 0;

// Step frames by hand when the tab is backgrounded and rAF never fires.
__oni.lastTime = performance.now() - 16.7; __oni._frame();
```

Measure local effects against a control group outside the radius — the field's
own drift otherwise swamps whatever you are trying to observe.

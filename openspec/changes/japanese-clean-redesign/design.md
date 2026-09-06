# Design: Japanese-Clean Redesign ("Ai-Zome")

## Technical Approach

Four sequential phases (proposal Approach A). Every decision below prefers a shape the
existing gates can actually falsify: `npm run lint`, `npm run build`, or a stated
measurement command. No test runner exists (`strict_tdd: false`).

The unifying move is **push variability to the boundary**. Tokens resolve at the Tailwind
boundary, locales resolve at the data-module boundary, WebGL resolves at a dynamic-import
boundary. Call sites stay dumb and unchanged in all three cases.

## Architecture Decisions

### D1 — i18n access pattern: resolve at the data-module export boundary

**Choice**: `{es, en}` lives *only inside* the three data files. A new `src/lib/i18n.js`
exports `DEFAULT_LOCALE`, `LOCALES`, and `resolve(node, locale)` — a deep walker that
collapses any `{es, en}` leaf to `node[locale] ?? node[DEFAULT_LOCALE]`. Each data module
stops exporting raw constants and exports accessors that return already-flattened objects:
`getServicios(locale)`, `getEquipo(locale)`, `getProceso(locale)`, `getProyectosReales(locale)`,
`getServiciosSeo(locale)`, `getServicioSeo(slug, locale)`, `getProyectosSeo(locale)`,
`getProyectoSeo(id, locale)`, `getProyectoPorSlug(slug, locale)`.

**Measured consumer counts** (live code, after `Portfolio.js` / `Projects.js` deletion):

| | count | files |
|---|---|---|
| Field reads (`servicio.h1`, `proyecto.desafio`, `miembro.bio`, …) | **~50** | 9 |
| Import statements from `src/data/*` | **12** | 9 |

Heaviest field-read sites: `pages/servicios/[slug].js` 24, `pages/proyectos/[slug].js` 13.

| Option | Cost now | Cost when `/en` ships |
|---|---|---|
| Direct `field.es` at call sites | ~50 edited reads + 12 imports | ~50 edited *again*, every one a place to forget a locale |
| `t(field)` / `pick(field, locale)` at call sites | ~50 edited reads + locale threaded into 9 components | locale prop-drilled through Services/Process/Team/Featured/AllProjects |
| Build-time transform | new build step; Next 13.1.6 has no hook for it without a plugin | opaque, unlintable, invisible in diffs |
| Parallel flat `en` files | 0 now | permanent structural drift between two file sets |
| **Boundary resolver (chosen)** | **12 import statements + 3 data files + 1 new lib** | **one `getStaticProps` line per page passes `locale`; ~50 reads never change** |

**Rationale**: the boundary resolver is the only option where the ~50 field reads are edited
**zero** times, now and later. Pages already fetch through `getStaticProps` / `getServerSideProps`,
which is exactly where `locale` will arrive from Next's i18n router — so the later `/en` wiring
is a per-page argument, not a component-tree refactor. It also keeps phase 3 near the ~700-line
estimate instead of inflating it. Components that import constants directly today
(`Services.js`, `Team.js`, `Process.js`, `FeaturedProjects.js`, `AllProjects.js`) call the
accessor with `DEFAULT_LOCALE` until they receive props; that is a one-line change each.

**Migration path per data file** (the `auto-chain` slice order): wrap localizable string leaves
as `{ es: "<current>", en: null }` → add the accessor → switch that file's importers → build.
`en: null` is deliberate: `resolve` falls back to `es`, so no partial English can ever render,
which is the proposal's hard non-goal.

### D2 — Token atomicity: one JS source, Tailwind generates both sides

**Choice**: `src/styles/tokens.js` exports the 18 Ai-Zome tokens as space-separated RGB
channel triples (`primary: "34 52 94"`). `tailwind.config.js` imports it and maps each to
`rgb(var(--<name>) / <alpha-value>)`. A `tailwindcss/plugin` `addBase` call emits the entire
`:root` custom-property block from the same object. The hand-written color block at
`globals.css:5-35` is **deleted**; only motion tokens remain there.

| Option | Trade-off |
|---|---|
| Explicit checked invariant | needs a runner we do not have; a grep-based check is a new unverified gate |
| CSS-var indirection only (config points at hand-written `:root`) | a typo'd var name compiles silently to `rgb(var(--nope) / 1)` — desync survives the build |
| **Single source + `addBase` generation (chosen)** | one numeric source; both consumers are derived, so desync is unrepresentable. Cost: colors leave `globals.css`, so a reader must follow one import |

The channel-triple form is load-bearing: `bg-primary/10`, `bg-success/10`, `border-error/20`
already appear in `Contact.js` and would break under a plain `var()` value. `globals.css`
consumers such as `outline: 2px solid var(--primary)` (`:92`) are preserved by also emitting
`--<name>: rgb(var(--<name>-rgb))` aliases from the same object. `npm run build` fails on a
malformed `tokens.js`; `tailwindcss/plugin` ships with 3.2.7, so no dependency is added.

### D3 — `accent-strong` is removed; `success-strong` and `warning-strong` each earn their place

**Choice**: delete `accent-strong` from `tokens.js`. The new `accent #3E6E96` is 4.97:1 on
`bg-washi`, so the patch it existed to work around is gone. Its single consumer,
`Team.js:78` `text-accent-strong`, becomes `text-accent`. A retained emphasis token with no
contrast justification is a token that gets used arbitrarily.

The same test is applied to the other two `-strong` tokens rather than assumed:

| Token | Justification | Verdict |
|---|---|---|
| `accent-strong` | `accent` is 4.97:1 on `bg-washi` — clears AA unaided | **retire** |
| `warning-strong` | `warning #B8863B` is 2.96:1 — cannot carry text at all | **keep** |
| `success-strong` | see computation below — `success` drops to **4.26:1** on its own tint | **keep** |

**The `success-strong` computation.** `success #3F6B4E` is 5.62:1 on `bg-washi`, so on that
surface it needs no patch. But its only consumer does not sit on `bg-washi`:
`Contact.js:97` renders `bg-success/10 text-success-strong` inside a section whose background is
`bg-gradient-to-b from-surface to-surface-alt`. At the dark end of that gradient the text sits on
`success` at 10% over `surface-alt #E9E4D8`, which composites to `#D8D8CA`:

| Foreground on `#D8D8CA` | Ratio | AA (4.5:1) |
|---|---|---|
| `success #3F6B4E` | **4.26:1** | **fails** |
| `success-strong #284A34` | 6.89:1 | passes |

(At the light end of the gradient, over `surface #FDFCFA`, the tint composites to `#EAEEE9` and
plain `success` reaches 5.23:1 — it passes there and fails at the other end, which is precisely
why the token cannot be retired.) `success-strong` is therefore kept for the same
reason `warning-strong` is: a measured floor failure, not an emphasis preference. `Contact.js:97`
is already correct and needs no retargeting.

### D4 — Inline-style hover removal, and the pill map deleted rather than re-skinned

**Choice**: the per-category color map at `AllProjects.js:71-94` is deleted outright, not
translated to tokens. Filter pills carry three literal class strings — idle, active, and a
`seal`-toned featured variant for `proximamente`:

```js
const PILL_IDLE     = "border border-border text-text-muted hover:border-accent hover:text-accent";
const PILL_ACTIVE   = "border border-primary text-primary bg-primary-soft";
const PILL_FEATURED = "border border-seal text-seal hover:bg-seal/5";
```

Literal strings keep Tailwind's content scanner working with no safelist. The three
`.style.background` mutations (`AllProjects.js:154-155`, `FeaturedProjects.js:70-71`) become
`hover:` variants; the inline `boxShadow` objects (`AllProjects.js:108`,
`FeaturedProjects.js:43,92`) become `border border-border` hairlines, which is the same edit the
formal-devices work needs anyway. `AllProjects.js:140` `background: "#F1F5F9"` becomes
`bg-surface-alt`.

**Rationale**: seven category colors were never a design system — they were a rainbow. One
accent axis plus one seal accent is the committed palette; expressing the old map in tokens
would preserve the defect in better paint.

### D5 — Single source for project category: derive the filter key, store nothing new

**Choice**: `categoriasPorProyecto` (`AllProjects.js:19-37`) is deleted and **no field is added
to `proyectos-seo.js`**. `categoria` stays the sole stored value. A pure projection in
`src/lib/categories.js` derives the filter key from it:

```js
// Ordered: the first matching rule wins. "ecommerce" precedes "landing" so that
// id 16 "Landing y ecommerce" lands in ecommerce, preserving today's bucket.
const CATEGORY_RULES = [
  [/juego/i, "game"],
  [/\bapp\b/i, "app"],
  [/ecommerce/i, "ecommerce"],
  [/marketplace/i, "ecommerce"],
  [/plataforma/i, "platform"],
  [/landing|sitio/i, "landing"],
];

export const toCategoryKey = (categoria) => {
  if (!categoria) return null;
  return CATEGORY_RULES.find(([re]) => re.test(categoria))?.[1] ?? null;
};
```

`AllProjects.js` filters on `toCategoryKey(proyectosSeo[proyecto.id]?.categoria) === activa`.
`CATEGORIAS` keeps its curated seven chips; its `value` entries are the derived keys and its
`label` entries are UI copy, which is not catalog data.

**Rationale**: an added `categoriaKey` would be a second stored field that a future editor can
set inconsistently with `categoria` — the exact defect D5 exists to kill, renamed. A pure
function is a *projection* of the single stored source, not a second copy of it; it cannot
drift, because there is nothing to drift from. This satisfies
`specs/portfolio-catalog/spec.md:36-37` literally: the component derives category from
`proyectosSeo[id].categoria` and no id→category map remains.

**Every value verified against the rules** (the 15 `proyectos-seo.js` entries after HooBank
removal — no fallthroughs, no ambiguity left unresolved):

| id | `categoria` | → key | vs. today's map |
|---|---|---|---|
| 1, 3, 9, 18 | `Ecommerce` | `ecommerce` | same (18 was **absent**) |
| 2 | `Sitio corporativo` | `landing` | same |
| 4 | `Landing inmobiliaria` | `landing` | same |
| 5 | `Plataforma web` | `platform` | **was `landing` — corrected** |
| 6 | `Marketplace` | `ecommerce` | same |
| 8 | `App móvil` | `app` | same |
| 10 | `Landing corporativa` | `landing` | same |
| 11, 12, 14 | `Plataforma`, `Plataforma cívica` | `platform` | same |
| 15 | `Juego online` | `game` | same |
| 16 | `Landing y ecommerce` | `ecommerce` | same (ordering-dependent) |

**What the two "disagreeing ids" actually are** — the exploration named ids 13 and 18, and the
precise diagnosis matters because it changes what the fix must do:

- **id 13 does not exist.** It is absent from `proyectosReales` *and* from `proyectosSeo`. It is
  a phantom entry that exists only inside the map being deleted. Deleting the map is the entire
  fix; there is nothing to reconcile.
- **id 18 (Onistore)** exists in both data files but is **missing from the map**, whose keys stop
  at 17 — so Onistore is currently invisible under every category filter. Deriving from
  `categoria` restores it.
- **id 5 (Santed)** is a third disagreement the exploration did not name: the map says `landing`,
  `proyectosSeo` says `Plataforma web`. Deriving corrects it.

**Coverage is complete — the earlier open question resolves to yes.** `proyectosReales` holds 17
ids (1–12, 14–18; there is no 13), 16 after HooBank. `proyectosSeo` covers all of them except
**id 17 (MVP Travel Marketplace)**, which carries `estado: "proximamente"` and is routed by the
`proximamente` branch before any category test ever runs (`AllProjects.js:45-46`). So every
project the category filter can reach has a `categoria`. No `proyectosSeo` entries need adding.

**Spec disagreement, named rather than silently satisfied.** The scenario at
`specs/portfolio-catalog/spec.md:44` reads "the values are identical for all ids, **including ids
13 and 18**". That clause is **unsatisfiable for id 13**, because id 13 is not a project — no
rendered category can be compared to a `proyectosSeo` entry that does not exist. The requirement
at `:36-37` is met in full; only this scenario's illustrative id list is wrong.
**`sdd-tasks` must carry a task to amend that clause** to read "including id 5 (bucket
disagreement) and id 18 (absent from the map)", and to note that id 13 was a phantom key. The
requirement text itself needs no change.

### D6 — Sitemap locale awareness without a published locale

**Choice**: `buildSitemap()` takes no new caller argument. It reads `LOCALES` and
`DEFAULT_LOCALE` from `src/lib/i18n.js` and gains one helper:

```js
const localePath = (locale, path) =>
  locale === DEFAULT_LOCALE ? path : `/${locale}${path}`;
```

Each URL is emitted once per locale, and every `<url>` carries `xhtml:link rel="alternate"`
entries for all locales plus `x-default` → default locale. The `xmlns:xhtml` namespace is added
to `<urlset>`.

With `LOCALES = ["es"]` this emits exactly today's URL set plus a self-referential
`hreflang="es"` and `x-default` — valid, and the correct output for a single-locale site.
Shipping `/en` becomes a one-element array edit, not a rewrite. Slugs are **not** localized, so
this needs no data change and can land in the sitemap slice independently. Re-verify the URL
count at 16 projects after HooBank removal.

### D7 — Three.js module boundary

Three files under `src/components/showcase/`:

| File | Imports `three` / r3f | Role |
|---|---|---|
| `ProjectShowcase.js` | **no** | client gate; owns all three fallback conditions |
| `ProjectShowcaseCanvas.js` | **yes, only here** | named `three` imports + `@react-three/fiber` `<Canvas>` |
| `ShowcaseFallback.js` | no | the single static branch |

`ProjectShowcase.js` declares the boundary at module scope but renders it conditionally, so the
chunk is requested only when `enabled` flips:

```js
const Canvas = dynamic(() => import("./ProjectShowcaseCanvas"), {
  ssr: false,
  loading: () => <ShowcaseFallback />,
});
```

Effect body, in this exact order:

1. `if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;` — the check from
   `Reveal.js:30-33`, verbatim, returning **before** any observer or probe. Under reduced motion
   the chunk is never requested.
2. WebGL2 probe: `document.createElement("canvas").getContext("webgl2")` — return on null.
3. Only then `new IntersectionObserver(..., { threshold: 0.15, rootMargin: "0px 0px -10% 0px" })`,
   matching `Reveal.js:43`; on intersect `setEnabled(true)` and `unobserve`.

Render is `{enabled ? <Canvas /> : <ShowcaseFallback />}` — one fallback component serving
reduced-motion, no-WebGL2, and not-yet-in-view identically, which is also what makes phase 4
rollback a user-visible no-op.

Mount point: `src/pages/proyectos/[slug].js`, inserted **after** the Stack section (~`:166`).
The LCP `<Image>` at `:124` is not touched. Pins are exact, no caret:
`"three": "0.160.0"`, `"@react-three/fiber": "8.15.19"`. Next 13.1.6 / React 18.2 cannot take r3f v9.

Measurement gate: `npm run build`, read the `/proyectos/[slug]` First Load JS delta against the
94.1 kB baseline; ≤60 kB gzip passes.

### D8 — Hero image

**Choice**: replace `public/fondoHero1.png` (5.8 MB) with `fondoHero1.webp` at 1920×1080,
quality 72, target **≤180 kB**. Delete the PNG. `Hero.js:10-17` keeps `fill`, keeps
`sizes="100vw"` (correct for a full-bleed `fill` background), and **keeps `priority`**.

**Rationale**: `priority` is not the defect — the 5.8 MB payload is. This element *is* the LCP;
removing `priority` would delay discovery and make LCP worse. The image is decorative
(`alt=""`, `aria-hidden` wrapper) and sits under a `from-black/60` overlay at
`brightness-[0.85]`, so quality 72 is invisible here. Verify with
`ls -lh public/fondoHero1.webp`. This is a hard prerequisite for phase 4.

### D9 — Japanese formal devices: zero new image requests

| Device | Implementation | Cost | Scope guard |
|---|---|---|---|
| Hanko seal | `src/components/marks/Hanko.js` — inline SVG, one `<path>` in a rounded square, `fill="currentColor"`, colored by `text-seal` | ~0.4 kB in JS bundle, **0 requests** | rendered in exactly two places: project card and Contact CTA |
| Asanoha lattice | `.asanoha::before` in `globals.css` — three `repeating-linear-gradient`s at 60°/120°/0°, `opacity: .05`, `pointer-events: none` | ~0.3 kB CSS, **0 requests** | class applied to the Process section only |
| Paper grain | `body::before` fixed layer, `background-image: url("data:image/svg+xml,…<feTurbulence type='fractalNoise'>…")`, `opacity: .025`, `pointer-events: none` | ~0.3 kB inline CSS, **0 requests** | one fixed layer, never per-card |
| Hairlines | `border border-border` replacing the inline `boxShadow` objects | net negative bytes | Services, Team, both project grids |

Both the lattice and the grain are CSS-only by construction: a `repeating-linear-gradient` and a
data-URI are parsed with the stylesheet, so neither becomes an HTTP request that could undo D8.
The grain is a single composited fixed layer rather than a per-element filter, keeping
rasterization cost off the card grid.

## Data Flow

    src/styles/tokens.js  ──→ tailwind.config.js  ──→ utility classes
              └──────────────→ addBase :root      ──→ var(--token) in globals.css

    data/*.js  {es,en}  ──→ resolve(node, locale)  ──→ flat object  ──→ ~50 unchanged reads
                                    ▲
                          locale from getStaticProps (today: DEFAULT_LOCALE)

    [slug].js ──→ ProjectShowcase (no three)
                        ├── reduced-motion? ─┐
                        ├── no WebGL2?      ─┼──→ ShowcaseFallback
                        ├── not in view?    ─┘
                        └── enabled ──→ dynamic() ──→ ProjectShowcaseCanvas (three, r3f)

## File Changes

| File | Action | Description |
|---|---|---|
| `src/styles/tokens.js` | Create | 18 Ai-Zome tokens as RGB channel triples — sole color source (D2) |
| `src/lib/i18n.js` | Create | `LOCALES`, `DEFAULT_LOCALE`, `resolve(node, locale)`, `localePath` (D1, D6) |
| `src/lib/categories.js` | Create | `toCategoryKey(categoria)` — pure projection, no stored key (D5) |
| `src/components/marks/Hanko.js` | Create | Inline-SVG seal (D9) |
| `src/components/showcase/{ProjectShowcase,ProjectShowcaseCanvas,ShowcaseFallback}.js` | Create | Gated WebGL boundary (D7) |
| `tailwind.config.js` | Modify | Import tokens; `rgb(var() / <alpha-value>)`; `addBase :root`; drop `burtons`/`quantico`; add Fraunces/IBM Plex Sans |
| `src/styles/globals.css` | Modify | Delete `:5-35` color block and the `burtons` `@font-face` `:85-88`; add asanoha, grain, hairline (D2, D9) |
| `src/data/{onilabs,proyectos-seo,servicios-seo}.js` | Modify | `{es,en}` leaves + accessors; HooBank removal. **No new category field** (D1, D5) |
| `src/components/AllProjects.js` | Modify | Delete category map, filter via `toCategoryKey`, remove all inline styles (D4, D5) |
| `openspec/.../specs/portfolio-catalog/spec.md` | Modify | Amend the `:44` scenario id list — id 13 is a phantom key (D5) |
| `src/components/FeaturedProjects.js` | Modify | Hover variants, hairlines, hanko (D4, D9) |
| `src/components/Contact.js` | Modify | `aria-live`, error-path `setTimeout` (`:63`) removal, hanko beside CTA |
| `src/components/Team.js` | Modify | `:78` `text-accent-strong` → `text-accent` (D3) |
| `src/components/{Hero,Services,Process,Navbar,Footer,ProjectVisual}.js` | Modify | Token repaint, labels, `bg-slate-950`/`text-blue-200` removal in `ProjectVisual` |
| `src/pages/sitemap.xml.js` | Modify | Locale loop + hreflang (D6) |
| `src/pages/proyectos/[slug].js` | Modify | Mount `ProjectShowcase` after Stack (D7) |
| `src/pages/{servicios/[slug],servicios/index}.js` | Modify | Switch to data accessors (D1) |
| `src/components/{Portfolio,Projects}.js`, `src/pages/index.js:7` | Delete | Dead code |
| `public/fondoHero1.png` → `.webp` | Replace | 5.8 MB → ≤180 kB (D8) |

## Interfaces / Contracts

```js
// src/lib/i18n.js
export const LOCALES = ["es"];            // ["es", "en"] when /en ships
export const DEFAULT_LOCALE = "es";
export function resolve(node, locale = DEFAULT_LOCALE);  // deep {es,en} → flat
export const localePath = (locale, path) =>
  locale === DEFAULT_LOCALE ? path : `/${locale}${path}`;

// src/styles/tokens.js
module.exports = { primary: "34 52 94", accent: "62 110 150", seal: "166 58 46", /* …18 */ };
```

## Testing Strategy

No test runner exists. Verification is gate-based plus stated measurement commands.

| Layer | What | Command / method |
|---|---|---|
| Static | Lint, unused imports, dead references | `npm run lint` |
| Build | Token map compiles; no unresolved import; SSG of 16 project pages | `npm run build` |
| Bundle | `/proyectos/[slug]` First Load JS delta ≤60 kB gzip vs 94.1 kB baseline | `npm run build` route table |
| Asset | Hero ≤180 kB | `ls -lh public/fondoHero1.webp` |
| Contrast | Every floor in the proposal's success criteria | computed against `bg-washi #F7F5EF` before merge |
| Manual | Reduced motion requests no showcase chunk; sitemap URL count at 16 projects | DevTools Network with `prefers-reduced-motion: reduce`; `curl localhost:3000/sitemap.xml` |
| Manual | Every category chip returns its D5 table rows; Onistore (18) appears under Ecommerce and Santed (5) under Plataformas | click through all 7 chips on `/proyectos` |

## Threat Matrix

N/A — no routing dispatch, shell command, subprocess, VCS/PR automation, executable-file
classification, or process-integration boundary. Sitemap generation emits static XML from
in-repo data with no user input; `/api/contacto` is unchanged by this design.

## Migration / Rollout

Four independent phases per the proposal. Phase 3 slices `onilabs.js` → `proyectos-seo.js` →
`servicios-seo.js` under `auto-chain`, sitemap last. Each slice is complete when `resolve` is
wired for that file and `npm run build` passes; `en: null` guarantees no partial English is ever
user-visible, so a half-migrated data set is a safe intermediate state. `three` and
`@react-three/fiber` are installed only in phase 4; uninstalling them restores the 94.1 kB baseline.

## Open Questions

- [x] ~~Does every non-`proximamente` `proyectosReales` id have a `proyectosSeo` entry?~~
      **Resolved in D5: yes.** The only uncovered id is 17, which is `proximamente` and never
      reaches a category test. No entries need adding.
- [ ] Fraunces / IBM Plex Sans delivery: `@next/font` (already a dependency at 13.1.6) versus
      self-hosted `@font-face`. Defer to phase 2; `@next/font` is the default unless it
      inflates the critical path.

## Next Recommended

`sdd-tasks` — once `sdd-spec` is also complete.

Tasks must additionally carry the spec amendment named in D5: correct the illustrative id list in
`specs/portfolio-catalog/spec.md:44`. The requirement at `:36-37` is satisfied as written and
must not be reworded.

# Tasks: Japanese-Clean Redesign ("Ai-Zome")

Execution mode: auto. Delivery strategy: `auto-chain`. Review budget: 800 lines/PR.
Gates: `npm run lint`, `npm run build` only — no test runner (`strict_tdd: false`).
Every verification step below is an inspection, a build/lint result, or a stated
measurement command. No task says "add a test."

Work units follow `work-unit-commits`: one deliverable behavior per commit, verification
in the same unit, independent rollback. Chained-PR slicing follows the proposal's
`auto-chain` boundaries; see the Review Workload Forecast at the end for slice risk.

---

## Phase 1 — Remediation

### T1.1 — Amend the portfolio-catalog spec's phantom-id scenario [x]

- **Spec link**: `specs/portfolio-catalog/spec.md:44` (illustrative id list only — the
  requirement text at `:36-37` is NOT touched)
- **Depends on**: none
- **Parallel with**: T1.2
- **Change**: Edit the scenario "Category matches proyectosSeo for every id" so its last
  line reads "the values are identical for all ids, including id 5 (bucket disagreement,
  corrected to Plataformas) and id 18 (previously absent from the map, now visible under
  Ecommerce)". Add a short note that id 13 was a phantom key in the deleted map and never
  corresponded to a real project — it is not part of the corrected id list.
- **Est. lines**: ~4 (doc only)
- **Verification**: Manual read-through confirming `:36-37` text is byte-identical to
  before the edit, and the amended scenario no longer claims id 13 is a real project.

### T1.2 — Create `src/lib/categories.js` (pure category projection) [x]

- **Spec link**: `specs/portfolio-catalog/spec.md` — "Single source of truth for project
  category"; prerequisite named in D5
- **Depends on**: none
- **Parallel with**: T1.1
- **Change**: Create `src/lib/categories.js` exporting `toCategoryKey(categoria)` with the
  six ordered regex rules exactly as specified in design D5:
  `juego → game`, `\bapp\b → app`, `ecommerce → ecommerce`, `marketplace → ecommerce`,
  `plataforma → platform`, `landing|sitio → landing` (ecommerce tested before landing;
  marketplace has its own explicit rule; `app` stays word-bounded). Return `null` on no
  match or falsy input. No other file imports this yet — this task lands the pure function
  in isolation so it can be verified against the D5 table before anything depends on it.
- **Est. lines**: ~20
- **Verification**: Manually evaluate `toCategoryKey()` against every `categoria` string in
  the D5 table (ids 1,2,3,4,5,6,8,9,10,11,12,14,15,16,18) and confirm each maps to the
  table's "→ key" column, including the ordering-dependent id 16 ("Landing y ecommerce" →
  `ecommerce`, not `landing`). `npm run lint` passes.

### T1.3 — Replace the id→category map in `AllProjects.js` with `toCategoryKey` [x]

- **Spec link**: `specs/portfolio-catalog/spec.md` — "Single source of truth for project
  category" (both scenarios, including negative case)
- **Depends on**: T1.2
- **Parallel with**: none (sequential after T1.2)
- **Change**: Delete `categoriasPorProyecto` (`AllProjects.js:19-37`). Filter using
  `toCategoryKey(proyectosSeo[proyecto.id]?.categoria) === activa`. `CATEGORIAS` chip list
  keeps its curated seven `value`/`label` pairs; `value` entries must match the derived
  keys emitted by `toCategoryKey`.
- **User-visible behavior change to call out in the commit message** (per design D5 /
  proposal): Santed (id 5) moves from the Landing filter to Plataformas; Onistore (id 18)
  becomes visible under Ecommerce for the first time (previously invisible under every
  filter because the old map's keys stopped at 17). State both explicitly — do not bury
  them as incidental refactor noise.
- **Est. lines**: ~30 (net deletion)
- **Verification**: `npm run build` passes. Manual click-through on `/proyectos`: each of
  the 7 category chips shows the exact project set from the D5 table; confirm Santed
  appears under Plataformas and Onistore appears under Ecommerce.

### T1.4 — Delete dead code: `Portfolio.js`, `Projects.js`, `index.js:7` import [x]

- **Spec link**: proposal Success Criteria — "`Portfolio.js`, `Projects.js`, and the
  `index.js:7` import are gone"
- **Depends on**: none
- **Parallel with**: T1.1, T1.2, T1.5, T1.6, T1.7
- **Change**: Delete `src/components/Portfolio.js` and `src/components/Projects.js`.
  Remove the unused import at `src/pages/index.js:7`.
- **Est. lines**: ~150 (deletion-heavy — two full unused component files)
- **Verification**: `npm run build` passes with no unresolved-import errors. Grep confirms
  no remaining reference to `Portfolio` or `Projects` component names in `src/`.

### T1.5 — Contact form: remove `setTimeout` auto-dismiss, add `aria-live` roles

- **Spec link**: `specs/contact-form/spec.md` — "Success feedback is announced and
  persists", "Error feedback is announced and retry persists"
- **Depends on**: none
- **Parallel with**: T1.1, T1.2, T1.4, T1.6, T1.7
- **Change**: In `src/components/Contact.js`, give the success banner `role="status"` and
  the error banner `role="alert"`. Remove the `setTimeout` (`:63` per design, error path)
  and any equivalent timer that resets success/error state; both persist until the user
  takes another action (dismiss or resubmit).
- **Est. lines**: ~15
- **Verification**: Manual DOM inspection after a simulated success and a simulated failure
  confirms `role="status"` / `role="alert"` are present and the banner/retry control remain
  after waiting past the old timeout duration with no further action. `npm run build` and
  `npm run lint` pass.

### T1.6 — Nav label renames

- **Spec link**: proposal Success Criteria — "Nav reads 'Proyectos' and 'Equipo'"
- **Depends on**: none
- **Parallel with**: T1.1, T1.2, T1.4, T1.5, T1.7
- **Change**: Rename nav labels "Repositorio" → "Proyectos" and "Colaboradores" → "Equipo"
  in `Navbar.js` (and `Footer.js` if it duplicates the same labels).
- **Est. lines**: ~4
- **Verification**: Manual visual check of rendered nav; `npm run build` passes.

### T1.7 — HooBank removal from data files, re-verify sitemap at 16

- **Spec link**: `specs/portfolio-catalog/spec.md` — "HooBank absent from all catalog
  sources" (all three scenarios)
- **Depends on**: none (independent of category work, but must land before any sitemap
  count assertion is treated as final)
- **Parallel with**: T1.1, T1.2, T1.4, T1.5, T1.6
- **Change**: Remove the HooBank entry from `src/data/onilabs.js` (`:230`) and
  `src/data/proyectos-seo.js`. Confirm no HooBank slug/reference remains anywhere in `src/`.
- **Est. lines**: ~30 (deletion)
- **Verification**: `rg -i hoobank src/` returns zero matches. `npm run build` succeeds and
  generates 16 project pages. `curl localhost:3000/sitemap.xml` (or read the built output)
  shows 16 project URLs with no HooBank slug.

### T1.8 — Inline-hex and inline-style-mutation removal in `AllProjects.js` / `FeaturedProjects.js` [x]

- **Spec link**: `specs/portfolio-catalog/spec.md` — "No inline hex or style mutation in
  catalog components" (both scenarios)
- **Depends on**: T1.3 (touches the same file's pill/category rendering block; sequencing
  avoids two passes over `AllProjects.js`)
- **Parallel with**: none
- **Change**: Per design D4 — replace the three literal pill class strings
  (`PILL_IDLE`, `PILL_ACTIVE`, `PILL_FEATURED`) using Tailwind color utilities (temporary
  Tailwind blue/slate classes are acceptable here; final Ai-Zome token classes land in
  Phase 2 per D4/D2 sequencing — note in the commit that colors are provisional pending
  Phase 2 repaint). Convert the three `.style.background` mutations
  (`AllProjects.js:154-155`, `FeaturedProjects.js:70-71`) to `hover:` variants. Convert the
  inline `boxShadow` objects (`AllProjects.js:108`, `FeaturedProjects.js:43,92`) to
  `border border-border` hairlines. Convert `AllProjects.js:140`'s
  `background: "#F1F5F9"` to a Tailwind background utility class.
- **Est. lines**: ~40
- **Verification**: `rg '#[0-9a-fA-F]{3,6}' src/components/AllProjects.js src/components/FeaturedProjects.js`
  (excluding comments) returns zero matches. `rg '\.style\.' src/components/AllProjects.js src/components/FeaturedProjects.js`
  returns zero matches. `npm run build` and `npm run lint` pass.

### T1.9 — Heading order fix in `AllProjects.js` [x]

- **Spec link**: `specs/portfolio-catalog/spec.md` — "Heading order does not skip levels"
- **Depends on**: none
- **Parallel with**: T1.1, T1.2, T1.4, T1.5, T1.6, T1.7
- **Change**: Inspect the rendered heading hierarchy in `AllProjects.js` and insert/adjust
  heading levels so no `h1`→`h3` skip occurs.
- **Est. lines**: ~5
- **Verification**: Manual DOM inspection of rendered heading order confirms sequential
  levels (h1 → h2 → h3, no skip).

### T1.10 — Hero image weight fix (hard prerequisite for Phase 4)

- **Spec link**: `specs/project-showcase-3d/spec.md` — "Hero image fix is a hard
  prerequisite" (both scenarios)
- **Depends on**: none
- **Parallel with**: T1.1–T1.9 (independent asset change)
- **Ordering constraint**: MUST be committed before any commit that adds `three` or
  `@react-three/fiber` to `package.json` (T4.x). This holds even if Phase 1 is sliced
  across multiple PRs — the image-fix commit's order/timestamp must precede the WebGL
  dependency commit, not merely land "somewhere in phase 1."
- **Change**: Convert `public/fondoHero1.png` (5.8 MB) to `public/fondoHero1.webp` at
  1920×1080, quality 72. Delete the PNG. Update `Hero.js:10-17` to reference the `.webp`
  file, keeping `fill`, `sizes="100vw"`, and `priority`.
- **Est. lines**: ~5 (code) + 1 binary asset
- **Verification**: `ls -lh public/fondoHero1.webp` shows ≤180 kB. `npm run build` passes.
  Manual visual check that the hero still renders correctly at full bleed.

---

## Phase 2 — Ai-Zome token repaint

### T2.1 — Create `src/styles/tokens.js` (single color source)

- **Spec link**: `specs/visual-identity/spec.md` — "Token atomicity across definition
  files", "`accent` and `error` resolve to single sources"
- **Depends on**: none (Phase 1 complete recommended but not a hard code dependency)
- **Parallel with**: none (foundational for the rest of Phase 2)
- **Change**: Create `src/styles/tokens.js` exporting the 18 Ai-Zome tokens as
  space-separated RGB channel triples per design D2 (e.g. `primary: "34 52 94"`). Per D3,
  `accent-strong` is NOT included; `success-strong` and `warning-strong` ARE included with
  their justified hex values. `error` resolves to the same value as `seal` (`#A63A2E`).
- **Est. lines**: ~25
- **Verification**: Manual diff of all 18 token names/hex values against the contrast-floor
  table in `specs/visual-identity/spec.md`. `npm run lint` passes on the new file.

### T2.2 — Wire `tailwind.config.js` to `tokens.js` with `addBase` generation

- **Spec link**: `specs/visual-identity/spec.md` — "Token atomicity across definition
  files" (both scenarios)
- **Depends on**: T2.1
- **Parallel with**: none
- **Change**: Import `tokens.js` in `tailwind.config.js`; map each token to
  `rgb(var(--<name>) / <alpha-value>)` in `theme.extend.colors`. Add a `tailwindcss/plugin`
  `addBase` call that emits the `:root` custom-property block (`--<name>-rgb` channel
  triples plus `--<name>: rgb(var(--<name>-rgb))` aliases) from the same `tokens.js` object.
  Remove `burtons`/`quantico` from the font config; add Fraunces/IBM Plex Sans font family
  entries (delivery mechanism per Open Question — default to `@next/font` unless it
  measurably inflates the critical path; if so, fall back to self-hosted `@font-face` and
  note the reason in the commit).
  Delete the hand-written color block at `globals.css:5-35` and the `burtons` `@font-face`
  at `globals.css:85-88`; motion tokens in `globals.css` are untouched.
- **Est. lines**: ~60
- **Verification**: `npm run build` fails-fast if `tokens.js` is malformed (confirms the
  build-time guard works — verify once against a deliberately broken value locally, then
  revert). On the real build: `npm run build` passes. Manual inspection confirms every
  token name in `tailwind.config.js theme.extend.colors` has an identical hex value in the
  generated `:root` block (cross-check via browser devtools computed styles or the
  `addBase` source). `rg 'burtons|quantico' tailwind.config.js src/styles/globals.css`
  returns zero matches.

### T2.3 — Contrast floor verification (measurement-only, no code change)

- **Spec link**: `specs/visual-identity/spec.md` — "Contrast floors on `bg-washi`"
- **Depends on**: T2.1, T2.2
- **Parallel with**: none
- **Change**: No code change. Compute contrast ratios for text-primary, text-secondary,
  text-muted, primary, accent, seal, success, warning-strong against `bg-washi` (`#F7F5EF`)
  using a WCAG contrast calculator, plus the `success` composite check from D3 (10% tint
  over `surface-alt` at the gradient's dark end, composited value `#D8D8CA`).
- **Est. lines**: 0
- **Verification**: Record each computed ratio against the floor table in
  `specs/visual-identity/spec.md`; all must meet or exceed their listed floor. Confirm
  `success-strong` (not plain `success`) is the token actually applied at
  `Contact.js:97`'s `text-success-strong` usage, matching the D3 rationale.

### T2.4 — Retarget `Team.js` `text-accent-strong` → `text-accent`

- **Spec link**: `specs/visual-identity/spec.md` — "`accent` and `error` resolve to single
  sources" (no accent-strong token scenario)
- **Depends on**: T2.1, T2.2
- **Parallel with**: T2.5, T2.6, T2.7
- **Change**: `Team.js:78` `text-accent-strong` → `text-accent`.
- **Est. lines**: ~2
- **Verification**: `rg 'accent-strong' src/` returns zero matches. `npm run build` passes.

### T2.5 — Repaint `Hero.js`, `Services.js`, `Process.js`, `Navbar.js`, `Footer.js` to Ai-Zome tokens

- **Spec link**: `specs/visual-identity/spec.md` — "No Tailwind blue/sky utilities remain",
  "`warning` cannot carry text"
- **Depends on**: T2.1, T2.2
- **Parallel with**: T2.4, T2.6, T2.7
- **Change**: Replace Tailwind blue/sky utility classes with the corresponding Ai-Zome
  token classes across these five components. Confirm no component applies `text-warning`
  to a text node (use `warning-strong` for text, `warning` only for icons/borders/fills).
- **Est. lines**: ~120
- **Verification**: `rg 'blue-|sky-' src/` excluding legitimate brand marks (WhatsApp,
  LinkedIn icons) returns zero matches. `rg 'text-warning\b' src/` returns zero matches.
  `npm run build` and `npm run lint` pass. Manual visual pass on each repainted section.

### T2.6 — Retarget `ProjectVisual.js` raw classes and finalize `AllProjects.js`/`FeaturedProjects.js` pill colors

- **Spec link**: `specs/visual-identity/spec.md` — "No Tailwind blue/sky utilities remain";
  closes the provisional-color note left in T1.8
- **Depends on**: T2.1, T2.2, T1.8
- **Parallel with**: T2.4, T2.5, T2.7
- **Change**: `ProjectVisual.js` is the only consumer of raw Tailwind color classes
  (`bg-slate-950`, `text-blue-200`) — retarget to Ai-Zome tokens. Update the three pill
  class strings in `AllProjects.js` (idle/active/featured, from T1.8) to their final
  Ai-Zome token values: `PILL_IDLE` uses `border-border`/`text-text-muted`/hover
  `border-accent`/`text-accent`; `PILL_ACTIVE` uses `border-primary`/`text-primary`/
  `bg-primary-soft`; `PILL_FEATURED` uses `border-seal`/`text-seal`/hover `bg-seal/5`.
- **Est. lines**: ~30
- **Verification**: `rg 'slate-950|blue-200' src/components/ProjectVisual.js` returns zero
  matches. Manual visual check of pill states (idle/hover/active/featured) against the D4
  class strings. `npm run build` passes.

### T2.7 — Japanese formal devices: Hanko, asanoha lattice, paper grain, hairlines

- **Spec link**: `specs/visual-identity/spec.md` — "Formal devices scoped and bounded"
  (both scenarios); `specs/contact-form/spec.md` — "Exactly one seal beside the Contact CTA"
- **Depends on**: T2.1, T2.2
- **Parallel with**: T2.4, T2.5, T2.6
- **Change**: Create `src/components/marks/Hanko.js` (inline SVG, single `<path>` in a
  rounded square, `fill="currentColor"`, colored via `text-seal`). Render it exactly once
  per project card and exactly once beside the Contact CTA — nowhere else. Add
  `.asanoha::before` to `globals.css` (three `repeating-linear-gradient`s at 60°/120°/0°,
  `opacity: .05`, `pointer-events: none`), applied to the Process section only. Add
  `body::before` paper grain (fixed layer, inline SVG `feTurbulence` data-URI,
  `opacity: .025`, `pointer-events: none`), one shared layer, never per-card. Convert
  remaining shadow-cards in Services/Team to `border border-border` hairlines.
- **Est. lines**: ~50
- **Verification**: Manual DOM count confirms exactly one hanko per project card and
  exactly one beside the Contact CTA, none elsewhere. Manual CSS inspection confirms
  asanoha opacity is between 4–6% inclusive and applied only to Process. `npm run build`
  and `npm run lint` pass.

---

## Phase 3 — i18n structure (auto-chain: three slices in cost order)

**Slicing note**: proposal estimates ~700 lines against the 800 budget with no margin.
Per `auto-chain`, this phase is pre-sliced per data file:
`onilabs.js` → `proyectos-seo.js` → `servicios-seo.js`, sitemap last. Each slice is a
complete, buildable, independently revertable PR.

### T3.1 — Create `src/lib/i18n.js` (boundary resolver)

- **Spec link**: `specs/localization-structure/spec.md` — "`{es, en}` shape on all three
  data files" (prerequisite infra); design D1
- **Depends on**: none
- **Parallel with**: none (blocks T3.2–T3.4)
- **Change**: Create `src/lib/i18n.js` exporting `LOCALES = ["es"]`, `DEFAULT_LOCALE = "es"`,
  `resolve(node, locale = DEFAULT_LOCALE)` (deep walker collapsing any `{es, en}` leaf to
  `node[locale] ?? node[DEFAULT_LOCALE]`), and `localePath(locale, path)` for D6.
- **Est. lines**: ~40
- **Verification**: Manual trace of `resolve()` against a nested test object containing
  `{es, en: null}` leaves confirms fallback to `es` when `en` is null and when `locale`
  requested is not present. `npm run lint` passes.

### T3.2 — Slice 1: `onilabs.js` — `{es,en}` shape + accessors + importer switch

- **Spec link**: `specs/localization-structure/spec.md` — "`{es, en}` shape on all three
  data files" (both scenarios), "No JSX string extraction in this change"
- **Depends on**: T3.1
- **Parallel with**: none (sequential per `auto-chain` slice order)
- **Change**: Wrap every user-visible text leaf in `src/data/onilabs.js` as
  `{ es: "<current Spanish text>", en: null }`. Add accessors (`getServicios`, `getEquipo`,
  `getProceso`, `getProyectosReales`) that call `resolve()` and return flattened objects.
  Switch this file's importers (`Services.js`, `Team.js`, `Process.js`,
  `FeaturedProjects.js`, `AllProjects.js`) to call the accessor with `DEFAULT_LOCALE` (a
  one-line change per component). Do NOT touch hardcoded JSX strings in these components —
  only the data-file-sourced fields.
- **Est. lines**: ~230 (heaviest single data file per design's ~700 total estimate,
  proportioned across 3 files)
- **Verification**: `npm run build` passes. Manual read-through confirms every wrapped
  field's `es` value is byte-identical to its pre-change Spanish content (no content loss).
  `rg '\{\s*es:' src/data/onilabs.js` shows every user-visible field is wrapped.

### T3.3 — Slice 2: `proyectos-seo.js` — `{es,en}` shape + accessors + importer switch

- **Spec link**: same as T3.2
- **Depends on**: T3.1, T3.2 (sequential auto-chain slice; T3.2 establishes the pattern and
  keeps `src/lib/i18n.js` proven before the next file)
- **Parallel with**: none
- **Change**: Same wrapping/accessor/importer-switch pattern applied to
  `src/data/proyectos-seo.js`. Accessors: `getProyectosSeo(locale)`,
  `getProyectoSeo(id, locale)`, `getProyectoPorSlug(slug, locale)`. Switch importers
  (`pages/proyectos/[slug].js` — 13 field reads per design's consumer count — and any other
  importer). No new `categoriaKey` field is added (D5 stands: `categoria` remains the sole
  stored value; `toCategoryKey` from Phase 1 is unaffected by this restructuring since it
  reads `categoria` after `resolve()` has already flattened it).
- **Est. lines**: ~230
- **Verification**: `npm run build` passes with 16 SSG project pages generated. Manual
  read-through confirms no content loss. `npm run lint` passes.

### T3.4 — Slice 3: `servicios-seo.js` — `{es,en}` shape + accessors + importer switch

- **Spec link**: same as T3.2; proposal risk "servicios-seo.js mixes positioning copy with
  i18n restructuring — treat as one combined work unit, not two passes"
- **Depends on**: T3.1, T3.3
- **Parallel with**: none
- **Change**: Same pattern applied to `src/data/servicios-seo.js` — the heaviest single
  file per design's consumer count (`pages/servicios/[slug].js` has 24 field reads).
  Accessors: `getServiciosSeo(locale)`, `getServicioSeo(slug, locale)`. Switch
  `pages/servicios/[slug].js` and `pages/servicios/index.js` to the accessors. Treat this
  as one combined pass, not split into a copy-positioning pass and a separate i18n pass.
- **Est. lines**: ~240
- **Verification**: `npm run build` passes. Manual read-through confirms no content loss,
  including any positioning-copy edits bundled in the same pass. `npm run lint` passes.

### T3.5 — Sitemap and hreflang locale awareness

- **Spec link**: `specs/localization-structure/spec.md` — "Sitemap and hreflang are
  locale-aware"; design D6
- **Depends on**: T3.1, T3.2, T3.3, T3.4 (must land last per proposal's explicit ordering)
- **Parallel with**: none
- **Change**: `buildSitemap()` in `src/pages/sitemap.xml.js` reads `LOCALES` and
  `DEFAULT_LOCALE` from `src/lib/i18n.js`, uses `localePath()`, emits each URL once per
  locale with `xhtml:link rel="alternate"` entries for all locales plus `x-default`, and
  adds the `xmlns:xhtml` namespace to `<urlset>`. No new caller argument.
- **Est. lines**: ~20
- **Verification**: `curl localhost:3000/sitemap.xml` (or read the built output) shows
  exactly today's 16-project URL set plus a self-referential `hreflang="es"` and
  `x-default` per URL, with `xmlns:xhtml` present on `<urlset>`. No broken/orphaned slug.

### T3.6 — Confirm no `/en` route is published

- **Spec link**: `specs/localization-structure/spec.md` — "No `/en` route is published"
  (both scenarios)
- **Depends on**: T3.2, T3.3, T3.4, T3.5
- **Parallel with**: none (final Phase 3 gate)
- **Change**: No code change expected — this is a verification-only gate confirming the
  phase introduced no `i18n` block in `next.config.js` and no `/en`-prefixed route.
- **Est. lines**: 0
- **Verification**: `rg 'i18n' next.config.js` returns zero matches (or confirms no `i18n`
  block was added). Manually request each page route and confirm only `es` content
  renders; no `/en` route resolves.

---

## Phase 4 — Scoped Three.js on `/proyectos/[slug]`

**Hard prerequisite**: T1.10 (hero image fix) MUST be committed before T4.1. Verify with
`git log --oneline -- public/fondoHero1.webp package.json` that the image-fix commit
precedes the commit adding `three`/`@react-three/fiber` to `package.json`.

### T4.1 — Add pinned dependencies

- **Spec link**: `specs/project-showcase-3d/spec.md` — "react-three-fiber pinned to v8"
- **Depends on**: T1.10 (hard prerequisite, verified by commit order)
- **Parallel with**: none
- **Change**: Add `"three": "0.160.0"` and `"@react-three/fiber": "8.15.19"` to
  `package.json` with exact versions (no `^`/`~`). Confirm `@react-three/drei` is absent.
- **Est. lines**: ~2
- **Verification**: `npm run build` completes successfully with r3f v8 resolved. Manual
  inspection of `package.json` confirms exact pins and drei's absence.

### T4.2 — Create `ShowcaseFallback.js` and `ProjectShowcaseCanvas.js`

- **Spec link**: `specs/project-showcase-3d/spec.md` — "Unified fallback for
  reduced-motion, no-WebGL2, and not-yet-in-view" (all four scenarios)
- **Depends on**: T4.1
- **Parallel with**: none
- **Change**: Create `src/components/showcase/ShowcaseFallback.js` (the single static
  branch, no `three`/r3f import). Create `src/components/showcase/ProjectShowcaseCanvas.js`
  (named `three` imports plus `@react-three/fiber`'s `<Canvas>` — the only file in the
  boundary that imports `three`/r3f).
- **Est. lines**: ~90
- **Verification**: `rg "from ['\"]three|@react-three/fiber" src/components/showcase/ShowcaseFallback.js`
  returns zero matches (confirms the fallback never pulls in the WebGL dependency).
  `npm run build` passes.

### T4.3 — Create `ProjectShowcase.js` gate and mount on `/proyectos/[slug]`

- **Spec link**: `specs/project-showcase-3d/spec.md` — "Unified fallback…", "Bundle budget
  on the carrying route", "Frame budget on target device profile"
- **Depends on**: T4.2
- **Parallel with**: none
- **Change**: Create `src/components/showcase/ProjectShowcase.js` (no `three`/r3f import;
  owns all three fallback conditions). Effect body in exact order: (1) reduced-motion check
  reusing `Reveal.js:29-33` verbatim, returning before any observer/probe is created; (2)
  WebGL2 probe via `document.createElement("canvas").getContext("webgl2")`, return on null;
  (3) `IntersectionObserver` with `{ threshold: 0.15, rootMargin: "0px 0px -10% 0px" }`,
  matching `Reveal.js:43`, `setEnabled(true)` + `unobserve` on intersect. Render
  `{enabled ? <Canvas /> : <ShowcaseFallback />}` where `Canvas` is
  `dynamic(() => import("./ProjectShowcaseCanvas"), { ssr: false, loading: () => <ShowcaseFallback /> })`.
  Mount in `src/pages/proyectos/[slug].js` after the Stack section (~`:166`); the LCP
  `<Image>` at `:124` is untouched.
- **Est. lines**: ~100
- **Verification**: Manual DevTools Network trace with `prefers-reduced-motion: reduce`
  active shows no request for the dynamic import chunk. Manual trace without WebGL2
  support (or a stubbed `getContext` returning null) shows the same fallback branch.
  Manual scroll test confirms the dynamic import is requested only after intersection
  (and only when motion is not reduced and WebGL2 is supported). `npm run build` passes.

### T4.4 — Measure and confirm bundle and frame budgets

- **Spec link**: `specs/project-showcase-3d/spec.md` — "Bundle budget on the carrying
  route" (both scenarios), "Frame budget on target device profile" (both scenarios)
- **Depends on**: T4.3
- **Parallel with**: none
- **Change**: No code change unless a measured budget is exceeded, in which case reduce the
  Three.js scene (drop unused geometry/material imports, simplify the animation) until
  budgets are met.
- **Est. lines**: 0 (or a small follow-up trim if over budget)
- **Verification**: Run `npm run build` and read the `/proyectos/[slug]` First Load JS
  delta against the 94.1 kB baseline — confirm ≤60 kB gzip (r3f path). Run
  `ANALYZE=true next build` for a precise gzip measurement if needed. Run a Lighthouse
  mobile audit (4x CPU throttle) on `/proyectos/[slug]` and confirm sustained frame time
  ≤16.6 ms with no recorded frame exceeding 33 ms.

---

## Review Workload Forecast

| Phase | Est. lines | Budget (800) | Risk | Chained PRs recommended? |
|---|---|---|---|---|
| 1 — Remediation | ~600 (deletion-heavy: T1.4 alone ~150, T1.7 ~30, rest incremental) | Fits | Low–Medium | No — single PR is expected to fit, but T1.4+T1.7+T1.8 together approach the upper half of budget. If actual measured diff exceeds 800, split along the natural boundary: {T1.1, T1.2, T1.3, T1.8, T1.9} (category/catalog work) as one PR, {T1.4, T1.5, T1.6, T1.7, T1.10} (dead code, contact, nav, HooBank, image) as a second. |
| 2 — Token repaint | ~350 | Fits | Low | No |
| 3 — i18n structure | ~700 (T3.2 ~230, T3.3 ~230, T3.4 ~240, T3.5 ~20) | High — no margin against 800 | **High** | **Yes — mandatory.** Already pre-sliced per the proposal's `auto-chain` boundary: T3.1+T3.2 (onilabs), T3.3 (proyectos-seo), T3.4 (servicios-seo), T3.5+T3.6 (sitemap). This is the phase most likely to need decision before apply. |
| 4 — WebGL | ~200 | Fits | Low | No |

**Decision needed before apply**: Phase 3's `chain_strategy` (stacked PRs to main vs.
feature-branch chain with tracker) is NOT YET COLLECTED per the orchestrator's session
context. `sdd-tasks` recommends **stacked PRs to main** — each Phase 3 slice
(`onilabs.js` → `proyectos-seo.js` → `servicios-seo.js` → sitemap) is independently
buildable and revertable per the design's Migration/Rollout section ("`en: null`
guarantees no partial English is ever user-visible, so a half-migrated data set is a safe
intermediate state"), so no tracker/integration branch is structurally required. The
orchestrator must confirm this strategy (or an alternative) before Phase 3 apply begins.

**Hard ordering constraint carried into apply**: T1.10 (hero image fix) must be committed
before T4.1 (WebGL dependency addition) regardless of how Phase 1 or Phase 4 are sliced
into PRs. This is enforced by git commit order, not merely "same phase."

**Phase 1 internal ordering constraint**: T1.2 before T1.3 before T1.8 (categories.js →
map replacement → inline-hex/style cleanup on the same file, to avoid two edit passes over
`AllProjects.js`).

**User-visible changes requiring explicit commit-message callouts** (not to be buried in
routine refactor commits): T1.3 — Santed (id 5) moves from Landing to Plataformas; Onistore
(id 18) becomes visible under Ecommerce for the first time.

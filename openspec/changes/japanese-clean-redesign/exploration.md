# Exploration — japanese-clean-redesign

Phase: `sdd-explore`
Change: `japanese-clean-redesign`
Artifact store: hybrid (this file + Engram topic `sdd/japanese-clean-redesign/explore`)

## Current state

Next.js 13.1.6 (pages router), React 18.2, Tailwind 3.2.7. No i18n config. No three.js /
react-three-fiber dependency. UX audit baseline 21/40; several P0/P1 items already shipped.

## Findings

### 1. Token surface

182 occurrences of `primary|accent|surface|border-|text-primary|text-secondary|text-muted`
across 17 `.js` files. Heaviest consumers: `Contact.js` (30), `proyectos/[slug].js` (23),
`servicios/[slug].js` (18), `Navbar.js` (14), `Process.js` (13), `Team.js` (12).

Tokens are defined **twice** — `tailwind.config.js` (`theme.extend.colors`) and
`src/styles/globals.css` (`:root`). Any palette change must update both in lockstep.

Inline hex, exhaustive:

| Location | Nature |
|---|---|
| `AllProjects.js:74,75,77,78,81,82,84,85,88,89,91,140,153-155` | Category pill colors + direct `.style.background` mutation on hover, bypassing React and Tailwind |
| `FeaturedProjects.js:69-71` | Same inline-style hover anti-pattern |
| `Contact.js:262-263,275-276` | WhatsApp/LinkedIn brand colors — legitimate, not a token violation |
| `PromoModal.js:10-19` | Orphaned Oni palette; component no longer rendered |
| `api/contacto.js:30-121` | Email template CSS — out of UI scope |
| `_document.js:13,18` | `theme-color` meta |

### 2. i18n extraction cost

No `i18n` block in `next.config.js`, no locale routing, no catalogue.

Hardcoded user-visible strings in live components (floor count; the pattern undercounts
multi-line JSX): `Contact.js` 18, `AllProjects.js` 7, `Navbar.js` 6, `Footer.js` 5,
`Hero.js` 2, `ProjectBadges.js` 2, `FeaturedProjects.js` 1 — roughly 49 total.

`Services.js`, `Process.js` and `Team.js` render from `src/data/onilabs.js`, so most of
their copy already lives in data and is mechanically shapeable to `{es,en}`.

Cost order, cheapest first:

1. `onilabs.js` — flat arrays
2. `proyectos-seo.js` — two fields per project, keyed by id, 12+ entries
3. `servicios-seo.js` — nested `secciones[].parrafos[]`; heaviest, and also where most of
   the Peru anchors live, so positioning copy and i18n restructuring collide in this one file

### 3. Component inventory

Dead: `Portfolio.js` (254 lines; imported at `index.js:7`, never rendered) and `Projects.js`
(zero imports).

Token-only repaint, no structural rework: `Hero.js`, `Services.js`, `Process.js`, `Team.js`.

Structural rework required regardless of theme:

- `AllProjects.js` — inline hex plus a hand-maintained id→category map that already disagrees
  with `proyectosSeo[id].categoria` for ids 13 and 18
- `FeaturedProjects.js` — inline-hex hover
- `Contact.js` — missing `aria-live`, error-path `setTimeout` reset
- `Navbar.js` / `Footer.js` — label copy and i18n

### 4. Routing

`/`, `/servicios`, `/servicios/[slug]`, `/proyectos`, `/proyectos/[slug]` (SSG),
`/sitemap.xml` (SSR via `getServerSideProps`), `/api/contacto`, `/api/hello` (likely dead stub).

`buildSitemap()` in `src/pages/sitemap.xml.js` has zero locale awareness. A locale split would
silently ship an incomplete sitemap without rework.

### 5. Motion system

`globals.css:37-55` (token block) and `:121-243` (keyframes plus `.reveal` / `.reveal-blur`
one-shot classes with the `.visible` → `.revealed` fill-mode release). `Reveal.js` runs a
per-element IntersectionObserver at threshold 0.15 and honors `prefers-reduced-motion` in three
independent places.

This is the strongest subsystem in the repo. A Three.js layer must compose on it — same
reduced-motion gate, same intersection-gated lazy mount — never replace it.

### 6. Sequencing risk

Theme and i18n phases touch the same files (`Hero`, `Navbar`, `Footer`, `Services`, `Team`,
`Process`, `Contact`). Combining them multiplies review surface and blocks isolated rollback.

Three.js has zero current dependency footprint and would land on top of a hero LCP already
degraded by a 5.8 MB `fondoHero1.png`. Shipping WebGL before the image-weight fix compounds
the audit's worst technical finding. This is a hard dependency, not a preference.

## Approaches considered

**A. Sequential four-phase rollout** — remaining fixes → theme repaint → international/i18n →
scoped Three.js. Isolated diffs, independent rollback, respects the LCP-before-WebGL
dependency. Slower to a visible result. Medium effort × 4 phases.

**B. Combined theme + i18n in one pass** — touches each shared file once, but near-certain
review-budget blowout, ambiguous rollback, and real risk of token-rename and string-extraction
diffs colliding on the same lines. High effort, one large phase.

## Recommendation

Approach A, sequential four-phase rollout:

1. Remaining P1s (Contact `aria-live`, nav labels, dead-code removal, HooBank decision) plus the
   `AllProjects` / `FeaturedProjects` inline-hex refactor as a structural prerequisite
2. Japanese-clean palette as a token-only repaint in `tailwind.config.js` + `globals.css`,
   keeping the blue axis
3. International positioning plus i18n data restructuring in cost order
   `onilabs.js` → `proyectos-seo.js` → `servicios-seo.js`, plus sitemap and hreflang rework
4. One scoped Three.js moment on `/proyectos/[slug]`, gated by intersection, reduced motion and
   a hard LCP budget — after the image weight is fixed, never as a hero replacement

## Risks

- Dual token source must move together for every palette change
- `AllProjects.js` id→category map disagrees with `proyectosSeo` for ids 13 and 18 — fix the
  duplication, do not just re-skin it
- `servicios-seo.js` is both the highest-cost i18n file and the densest Peru-anchor file; plan
  positioning and i18n there as one combined work unit
- react-three-fiber major version must be pinned explicitly: Next 13.1.6 / React 18.2 caps
  compatibility at r3f v8, not v9
- `sitemap.xml.js` has no locale awareness; a naive locale rollout breaks it silently

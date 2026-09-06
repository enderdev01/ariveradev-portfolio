# Proposal: Japanese-Clean Redesign ("Ai-Zome")

## Intent

The UX audit scored `/` at 21/40. The site carries a generic Tailwind blue palette, a 5.8 MB hero image, dead components, duplicated color truth, a catalog entry that is a recognizable tutorial clone (HooBank), and no localization structure. Replace the visual identity with a committed, contrast-verified Japanese-clean system and remove the credibility and performance defects underneath it.

## Scope

### In Scope

- Ai-Zome palette (18 tokens) applied in lockstep across `tailwind.config.js` and `src/styles/globals.css`.
- Typography: Fraunces (display) + IBM Plex Sans (body); delete dead `burtons` / `quantico`.
- Formal devices: *ma* in Hero; one `seal` hanko per project card and one beside the Contact CTA; 1px hairlines replacing shadow-cards in Services/Team; 4–6% asanoha lattice behind Process only; vertical Process numerals on desktop; 2–3% paper grain on `bg-washi`.
- Remove HooBank (`src/data/onilabs.js:230` + `proyectos-seo.js`); 17 → 16 projects; re-verify generated sitemap.
- Remaining fixes: Contact `aria-live` + error-path `setTimeout` removal; nav labels Repositorio→Proyectos, Colaboradores→Equipo; delete `Portfolio.js` and `Projects.js`; inline-hex refactor in `AllProjects.js` / `FeaturedProjects.js`; fix the id→category duplication (ids 13, 18 disagree with `proyectosSeo`); fix hero image weight.
- i18n **structure only**: `{es, en}` shape for the three data files; locale-aware sitemap + hreflang.
- One scoped WebGL moment on `/proyectos/[slug]`.

### Out of Scope (non-goals)

- Publishing an `/en` locale or extracting the ~49 hardcoded JSX strings. No half-translated English.
- Sakura, torii, brush-script Latin fonts, rising-sun rays, decorative kanji/katakana.
- Importing the `PromoModal.js` Oni palette (`#12101e` / `#7b5ea7` / `#c4a84a`) — it belongs to Onistore, a sister brand.
- `@react-three/drei` (358.6 kB gzip). WebGL in the hero. react-three-fiber v9.
- Research lane (owner declined).

## Capabilities

### New Capabilities

- `visual-identity`: Ai-Zome tokens, contrast floors, typography, and the permitted Japanese formal devices.
- `portfolio-catalog`: project catalog integrity — membership, single category source, sitemap consistency.
- `contact-form`: submission feedback, live-region announcement, error-state persistence.
- `localization-structure`: `{es, en}` data shape and locale-aware sitemap/hreflang, without a published locale.
- `project-showcase-3d`: intersection- and motion-gated WebGL moment under an explicit weight and frame budget.

### Modified Capabilities

None — `openspec/specs/` is empty; this is the first spec set.

## Approach

Sequential four-phase rollout (exploration Approach A, adopted without amendment). Theme and i18n touch the same shared files (`Hero`, `Navbar`, `Footer`, `Services`, `Team`, `Process`, `Contact`); combining them multiplies review surface and destroys isolated rollback. Tokens are defined twice, so every palette move is one atomic edit pair. WebGL lands last because the hero LCP dependency is hard, not preferential.

| Phase | Content | Est. lines | Budget (800) |
|---|---|---|---|
| 1 | Remediation: dead code, HooBank, inline-hex, id→category, `aria-live`, nav labels, image weight | ~600 (deletion-heavy) | Fits; slice if measured >800 |
| 2 | Ai-Zome token repaint + typography + formal devices | ~350 | Fits |
| 3 | `{es,en}` data shape + sitemap/hreflang | ~700 | High risk — slice per data file |
| 4 | Scoped WebGL on `/proyectos/[slug]` | ~200 | Fits |

Delivery strategy is `auto-chain`: phase 3 slices in cost order `onilabs.js` → `proyectos-seo.js` → `servicios-seo.js` as chained PRs.

WebGL pattern: `next/dynamic` with `ssr: false` behind an IntersectionObserver gate, reusing the existing reduced-motion check in `src/components/Reveal.js:29-33` verbatim, early-returning before observer creation so the dynamic import is never requested. One fallback branch serves reduced-motion, no-WebGL2, and not-yet-in-view.

## Affected Areas

| Area | Impact | Description |
|---|---|---|
| `tailwind.config.js` | Modified | Ai-Zome colors; remove `burtons`/`quantico` |
| `src/styles/globals.css` | Modified | Mirror `:root` tokens; paper grain; remove dead font faces |
| `src/data/onilabs.js` | Modified | HooBank removal; `{es,en}` shape |
| `src/data/proyectos-seo.js` | Modified | HooBank removal; `{es,en}` shape |
| `src/data/servicios-seo.js` | Modified | `{es,en}` shape (heaviest; Peru anchors collide here) |
| `src/components/AllProjects.js` | Modified | Inline-hex removal; category derived from `proyectosSeo` |
| `src/components/FeaturedProjects.js` | Modified | Inline-hex hover removal |
| `src/components/Contact.js` | Modified | `aria-live`, error-path `setTimeout` removal, seal CTA |
| `src/components/{Hero,Services,Process,Team,Navbar,Footer}.js` | Modified | Token repaint, devices, labels |
| `src/components/ProjectVisual.js` | Modified | Only consumer of raw Tailwind color classes |
| `src/components/{Portfolio,Projects}.js` | Removed | Dead code (`Portfolio.js` imported at `index.js:7`, never rendered) |
| `src/pages/sitemap.xml.js` | Modified | Locale awareness; re-verify after HooBank removal |
| `src/pages/proyectos/[slug].js` | Modified | Gated WebGL mount |
| `public/fondoHero1.png` | Removed/Replaced | 5.8 MB — hard prerequisite for phase 4 |

## Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| Dual token source drifts | High | Treat `tailwind.config.js` + `globals.css` as one atomic edit; verify with `npm run build` |
| Phase 3 exceeds 800-line budget | High | Pre-sliced per data file under `auto-chain` |
| Three.js bundle blowout (naive import ≈571 kB vs 94.1 kB baseline) | Med | Drei excluded; named `three` imports; measured gzip gate before merge |
| WebGL regresses LCP | Med | Image weight fixed first; `/proyectos/[slug]` placement, never hero |
| r3f v9 pulled by a loose range | Med | Pin r3f v8 exactly; Next 13.1.6 / React 18.2 cannot take v9 |
| `servicios-seo.js` mixes positioning copy with i18n restructuring | Med | Treat as one combined work unit, not two passes |
| HooBank removal leaves stale sitemap/slug links | Med | Re-verify generated sitemap and cross-references at 16 projects |

## Rollback Plan

Each phase is an independent revert. Phase 1: `git revert` the remediation slice; deletions restore intact. Phase 2: the palette is confined to two token files plus `ProjectVisual.js` — reverting them restores the Tailwind blue system with no component-level fallout. Phase 3: `{es,en}` is additive in shape; revert per data-file slice, sitemap slice last-in/first-out. Phase 4: delete the dynamic import and its gate; the fallback branch is already the no-WebGL render path, so removal is a no-op for users on reduced motion or without WebGL2. Uninstall `three` and `@react-three/fiber` to restore the 94.1 kB baseline.

## Dependencies

- Fraunces and IBM Plex Sans (both SIL OFL) self-hosted or via `@next/font`.
- `three` + `@react-three/fiber` pinned to v8 — phase 4 only.
- `public/fondoHero1.png` weight fix MUST land before phase 4.
- Quality gates are `npm run lint` and `npm run build` only. No test runner exists (`strict_tdd: false`).

## Success Criteria

- [ ] All 18 Ai-Zome tokens defined identically in `tailwind.config.js` and `globals.css`; zero Tailwind blue/sky utilities remain outside legitimate brand marks (WhatsApp, LinkedIn).
- [ ] Measured contrast on `bg-washi` (#F7F5EF) holds: text-primary ≥15.94:1, text-secondary ≥7.60:1, text-muted ≥4.59:1 (floor — never lighten), primary ≥11.20:1, accent ≥4.97:1, seal ≥5.90:1, success ≥5.62:1, warning-strong ≥5.05:1.
- [ ] `warning` (#B8863B, 2.96:1) never used for small text — icon and border only.
- [ ] `accent` used directly as text; the `accent-strong` patch is deleted as unnecessary.
- [ ] `error` resolves to `seal` (#A63A2E). Exactly one red in the system.
- [ ] `burtons` and `quantico` absent from `tailwind.config.js` and `globals.css`.
- [ ] The hanko seal appears exactly once per project card and once beside the Contact CTA, nowhere else.
- [ ] Asanoha lattice appears behind Process only, at 4–6% opacity.
- [ ] 16 projects; no HooBank reference in any data file, and the generated sitemap re-verified against the new count.
- [ ] `AllProjects.js` derives category from `proyectosSeo`; ids 13 and 18 no longer disagree.
- [ ] Zero inline hex or `.style.background` mutation in `AllProjects.js` and `FeaturedProjects.js`.
- [ ] `Portfolio.js`, `Projects.js`, and the `index.js:7` import are gone.
- [ ] Contact announces success and error via `aria-live`; the error path no longer resets on a timer.
- [ ] Nav reads "Proyectos" and "Equipo".
- [ ] All three data files carry `{es, en}`; sitemap and hreflang are locale-aware; no `/en` route is published and no partial English is user-visible.
- [ ] WebGL route adds ≤60 kB gzip with r3f (≤45 kB with named `three` imports only); frame time ≤16.6 ms sustained on Lighthouse mobile default (4x CPU throttle); >33 ms is a hard fail.
- [ ] r3f pinned to v8. `@react-three/drei` absent from `package.json`.
- [ ] Under `prefers-reduced-motion`, no WebGL2, or not-yet-in-view, the dynamic import is never requested and one shared fallback renders.
- [ ] `npm run lint` and `npm run build` pass at the end of every phase.

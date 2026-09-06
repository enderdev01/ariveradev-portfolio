---
target: home + servicios/proyectos (onilabs.site)
total_score: 21
max_score: 40
na_heuristics: 
p0_count: 2
p1_count: 2
timestamp: 2026-09-06T01-42-35Z
slug: src-pages-index-js
---
Method: dual-agent (A: design review · B: detector + technical evidence)

Surface mode: Persuade. Target: home (src/pages/index.js) + servicios/proyectos subpages.

## Design Health Score — 21/40 (all 10 heuristics applicable)

| # | Heuristic | Score | Key issue |
|---|---|---|---|
| 1 | Visibility of system status | 3/4 | Form states complete but success/error banner lacks role="status"/aria-live (Contact.js:96-106) |
| 2 | Match system / real world | 2/4 | "Repositorio" for the portfolio (Navbar.js:36, Hero.js:66); "Colaboradores" for the team |
| 3 | User control and freedom | 1/4 | PromoModal.js:26-28 opens on every load: no Escape, no backdrop close, no focus trap |
| 4 | Consistency and standards | 2/4 | Token system exists and is bypassed with inline hex (FeaturedProjects.js:69-71, AllProjects.js:71-94) |
| 5 | Error prevention | 2/4 | Submit-only validation; email checked for presence only (Contact.js:28) |
| 6 | Recognition rather than recall | 3/4 | Breadcrumbs solid; Process timeline right-aligns alternating copy (Process.js:79) |
| 7 | Flexibility and efficiency | 2/4 | "Agenda una llamada" (Hero.js:55) leads to a 6-field form; no calendar, no phone |
| 8 | Aesthetic and minimalist design | 2/4 | Team.js:34 — p-8 lg:p-20 + min-h-[440px] for a name and two lines |
| 9 | Error recovery | 1/4 | "Error al enviar" with no cause or alternative; Contact.js:63 clears it after 4s |
| 10 | Help and documentation | 3/4 | 13 good FAQs in servicios-seo.js, all buried on subpages |

## Design Specificity Verdict — FAILS. Swap-the-logo grade.

- tailwind.config.js:26 — primary #2563EB is Tailwind blue-600; accent #0EA5E9 is sky-500; all neutrals are untouched slate. Zero color decisions.
- globals.css:66 — system-ui. No typeface choice. Two fonts loaded and unused: burtons, quantico.
- onilabs.js:8-48 — services represented by emoji. Emoji is the visual system.
- Six sections, one rhythm: eyebrow → centered h2 → subhead → card grid.
- The only real visual identity in the repo is PromoModal.js:9-20 (Oni palette #12101e/#7b5ea7/#c4a84a, Bebas Neue + DM Sans) and it belongs to a different brand (Onistore).

Deterministic scan: detect.mjs exit 2, 4 findings. 3x gradient-text (Hero.js:36, Navbar.js:84, Footer.js:52) — genuine. 1x overused-font Arial (api/contacto.js:29) — FALSE POSITIVE, it is a nodemailer email template, not UI.

No browser overlay: browser inspection deliberately skipped, static evidence only.

## What's Working

1. Motion system is properly engineered — globals.css:111-239 + Reveal.js. Full token set, transform/opacity only, per-element IntersectionObserver with unobserve, .visible → .revealed swap on animationend releasing the fill-mode lock. prefers-reduced-motion honored in three independent places.
2. proyectos-seo.js:5-6 is a written integrity rule forbidding invented client metrics, obeyed across all 12 case studies.
3. Subpage copy has a real point of view (servicios-seo.js:136, :226, :234) — and none of it is on the home page.

## Priority Issues

[P0] PromoModal auto-opens unconditionally — PromoModal.js:26-28. Anime-merch ad on a B2B software landing; category confusion as the first data point. No Escape, no backdrop close, no focus trap, locks touch scroll, imports two Google font families per page. Fix: remove from index.js:120; Onistore is already a repositorio card (onilabs.js:282). Command: /impeccable distill

[P0] Measured WCAG AA contrast failures. --success #16A34A on white = 3.30:1 used as 14-16px text at Contact.js:97. --text-accent #0EA5E9 on white = 2.77:1 used at Team.js:78 (also Projects.js:28,40 but that file is dead — imported by nothing). --text-muted #64748B on --surface-alt #F1F5F9 = 4.34:1. Command: /impeccable audit

[P1] Zero third-party proof site-wide. No testimonials, client logos, outcome metrics, or named humans. Team.js:74 renders ENDER/AKHSEL/L1NTCH/GHOST — handles, no surnames, no LinkedIn. Contact is contacto.onilabs@gmail.com. Fix order: real domain email; real names + LinkedIn; 3 client quotes above the form; one outcome number per case study.

[P1] Contact form failure path abandons the user — Contact.js:61-64. Error message and retry button revert to idle after 4s. No aria-live on either banner. Fix: remove both setTimeout resets, add role="status"/role="alert", render direct email inline on error. Command: /impeccable harden

[P2] "Repositorio" costs clicks on the two most valuable links — Navbar.js:36, Hero.js:66. Non-technical buyers read "GitHub". Footer.js:14-15 already disagrees with the navbar. Fix: Servicios / Proyectos / Proceso / Equipo. Command: /impeccable clarify

## Persona Red Flags — European/US product lead, EUR 25-80k, 20 min

- 0:03 anime popup on a B2B site — bounce
- 0:10 Spanish only; lang="es", og:locale es_PE — bounce
- 0:20 "para negocios reales en Perú" (Hero.js:37) — bounce
- 2:00 team is anonymous handles, no verifiable human — high
- 3:00 four projects labelled "Sin soporte activo" (onilabs.js:204,213,230,247) — reads as churn
- 3:30 HooBank (onilabs.js:230, banco-webmodern.vercel.app) presented as client work; recognisable tutorial clone — CRITICAL, casts doubt on the other sixteen
- 4:00 twelve case studies, zero outcome numbers — high
- 5:30 no timezone, no working hours, no country of operation outside SEO copy — high

## Peru → international

47 hardcoded anchors across 11 files: copy (Hero.js:37, index.js:18,20, 27 hits in servicios-seo.js), metadata (og:locale es_PE in 4 files), JSON-LD (availableLanguage "Spanish", sameAs wa.me/51...), and Contact.js:306 promising "24-48 horas" with no timezone.

Recommendation: do NOT delete "Perú" — reframe it. 8 of 17 projects live on .pe domains; two are named "Impuestos Perú" and "Versus Electoral Perú". Stripping the word while local evidence remains produces a placeless site that also looks evasive. Today "Perú" is the only concrete fact on the page. The move is nearshore positioning: Peru is UTC-5, zero-hour offset with New York, 2h with San Francisco. Move geography out of the headline and into a proof line with timezone, hours, languages, invoicing currency.

Spanish-only is a hard ceiling today: no i18n block in next.config, no locale routing, no catalogue, ~70% of user-visible strings hardcoded in JSX. The data layer (servicios-seo.js, proyectos-seo.js, onilabs.js) is already keyed by slug and converts to {es,en} mechanically.

## Three.js / experience-led redesign — not yet

Home is ~400 words total. Six services x 1 sentence, three projects x 1 sentence, five process steps x 1 sentence, four bios x 2 lines. Experience-led needs one overwhelming idea or deep content to reveal; neither exists.

jeffmilanes.com verified: it DOES use three.js via react-three-fiber (InstancedMesh + ShaderMaterial, no postprocessing) in a 1.08MB chunk. Current home First Load JS is 95.3 kB — a 12x delta. But the model does not transfer: it is a personal portfolio with one subject and nothing to prove commercially.

Cost side: Hero.js:10-17 already ships a 5.8MB priority PNG as the LCP element. globals.css:277-282 documents a prior content-visibility optimization that broke mobile rendering.

Defensible sequence: (1) fix P0-P1 and the proof gap; (2) make one visual identity decision (typeface + palette that is not Tailwind default); (3) then one restrained WebGL moment on /proyectos/[slug], not the hero; (4) guard with prefers-reduced-motion, static poster fallback, dynamic import behind intersection, hard LCP budget.

## Minor Observations

- Dead code: index.js:7 imports Portfolio (254 lines), never renders it. Projects.js imported by nothing.
- Four competing smooth-scroll implementations: index.js:71-78, Navbar.js:24-32, SmoothHashScroll.js, globals.css:55.
- Dark mode declared (darkMode:"class", dark theme-color in _document.js) with zero dark: classes in the codebase.
- Heading skip: AllProjects.js h1 line 60 → h3 line 120, no h2.
- Tap targets under 44px: Footer.js:94 and Portfolio.js:230 at 40x40; PromoModal.js:72 at 32x32 on desktop.
- 18 images over 300KB in public/. fondoHero1.png 5.8MB with priority; onistore2.png 2.0MB also priority, loading concurrently on mount.
- Voseo/tuteo mix: servicios/[slug].js:151 "Tenés/Contanos" vs Contact.js:93 "Cuéntanos".
- ProjectVisual.js:37-56 fallback (dark slate, bold type, dot grid) is the most distinctive treatment in the repo and only appears when something is missing.
- Stale comment globals.css:189 says "80ms" against --motion-stagger: 110ms.
- AllProjects.js:19-37 hand-maintained id→category map duplicating proyectosSeo[id].categoria; ids 13 and 18 already disagree.
- Title inconsistency: proyectos.js:8 uses "Proyectos - Onilabs" (hyphen) vs " | Onilabs" everywhere else.

## Questions to Consider

1. Delete "Perú" from every file. What is left that a buyer in Berlin could not get from five hundred other agencies?
2. Onistore got a considered palette and two chosen typefaces; OniLabs got blue-600 and system-ui. What does that tell a client about their brand under deadline?
3. Which three former clients can be phoned this week for one real outcome number each?

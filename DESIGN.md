---
name: OniLabs
description: A suspended workshop — flat surfaces, self-hosted type, and a WebGL ink field carrying all the depth.
colors:
  void: "#080616"
  surface: "#1A1953"
  surface-raised: "#162E93"
  hairline: "#162E93"
  ink-white: "#F0F0F4"
  ink-soft: "#CECEDA"
  ink-quiet: "#9292AA"
  workshop-indigo: "#8E8EF6"
  workshop-indigo-fill: "#2F2FE4"
  workshop-indigo-deep: "#162E93"
  workshop-indigo-wash: "#C2C2FF"
  fleck-periwinkle: "#C2C2FF"
  fleck-periwinkle-ground: "#1E1B5E"
  seal-red: "#F25A5A"
  confirm-green: "#61D190"
  caution-amber: "#F0B042"
  caution-amber-text: "#F6BB55"
typography:
  display:
    fontFamily: "Archivo Black, Noto Sans JP, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif"
    fontSize: "clamp(2.25rem, 6vw, 5.2rem)"
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Archivo Black, Noto Sans JP, sans-serif"
    fontSize: "clamp(1.5rem, 4vw, 3rem)"
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Noto Sans, Noto Sans JP, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "normal"
  body:
    fontFamily: "Noto Sans, Noto Sans JP, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  label:
    fontFamily: "Noto Sans, Noto Sans JP, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "0.1em"
  micro:
    fontFamily: "Noto Sans, Noto Sans JP, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.025em"
  root-mobile:
    fontFamily: "Noto Sans, Noto Sans JP, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  small-mobile:
    fontFamily: "Noto Sans, Noto Sans JP, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.375
    letterSpacing: "normal"
  caption-mobile:
    fontFamily: "Noto Sans, Noto Sans JP, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: "normal"
rounded:
  hairline: "1px"
  none: "0px"
  scrollbar: "5px"
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  pill: "9999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "24px"
  lg: "40px"
  xl: "64px"
  section: "80px"
components:
  button-primary:
    backgroundColor: "{colors.workshop-indigo-fill}"
    textColor: "#FFFFFF"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "16px 48px"
  button-primary-hover:
    backgroundColor: "{colors.workshop-indigo-deep}"
    textColor: "#FFFFFF"
    rounded: "{rounded.pill}"
    padding: "16px 48px"
  button-ghost:
    backgroundColor: "rgb(255 255 255 / 0.05)"
    textColor: "#FFFFFF"
    typography: "{typography.title}"
    rounded: "{rounded.pill}"
    padding: "16px 32px"
  button-ghost-hover:
    backgroundColor: "rgb(255 255 255 / 0.10)"
    textColor: "#FFFFFF"
    rounded: "{rounded.pill}"
    padding: "16px 32px"
  link-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.md}"
    padding: "8px 20px"
  link-outline-hover:
    backgroundColor: "transparent"
    textColor: "{colors.workshop-indigo}"
    rounded: "{rounded.md}"
    padding: "8px 20px"
  card-project:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-white}"
    rounded: "{rounded.xl}"
    padding: "24px"
  input-underline:
    backgroundColor: "transparent"
    textColor: "{colors.ink-white}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "12px 0"
  badge-international:
    backgroundColor: "rgb(26 25 83 / 0.90)"
    textColor: "{colors.seal-red}"
    rounded: "{rounded.md}"
    padding: "4px 10px"
  badge-caution:
    backgroundColor: "rgb(26 25 83 / 0.90)"
    textColor: "{colors.caution-amber-text}"
    rounded: "{rounded.md}"
    padding: "4px 10px"
  badge-upcoming:
    backgroundColor: "rgb(26 25 83 / 0.90)"
    textColor: "{colors.fleck-periwinkle}"
    rounded: "{rounded.md}"
    padding: "4px 10px"
---

# Design System: OniLabs

## Overview

**Creative North Star: "The Suspended Workshop"**

Nothing here moves fast. The page is a workshop where the work has been set
down deliberately and left to settle: pigment hangs in the air, surfaces sit
flat and unhurried, and headings are laid onto the page by a brush stroke
rather than sliding in. The register is craft and time taken, not technical
power. A visitor should feel that someone worked slowly and on purpose, because
that is the actual claim being made — a small team, working directly, without
haste imposed by a layer of management.

The system's defining move is that **depth lives behind the content, not in
it**. A single fixed WebGL layer runs the full height of the page — a
procedural sumi-e haze plus a particle field of pigment bodies, brush
fragments, ash, and rare luminous flecks — and every section above it is
transparent so it shows through. Because the atmosphere carries the depth,
the UI itself can stay almost perfectly flat: hairline borders, tonal steps,
no drop shadows at rest. Take the canvas away and the interface would read as
severe. That is the correct trade.

Japanese formal devices appear as structure, never as decoration or theme
dressing: a fixed paper-grain layer at 2.5% opacity over the entire page, an
asanoha lattice at 5% behind the Process section, a hanko seal marking each
delivered project, and the ink-reveal brush wipe on section headings. All four
are generated inline as data-URI SVG or CSS gradients — the system ships zero
HTTP requests for ornament. Kanji is available (Noto Sans JP) but reserved for
seal marks, not body copy.

**Key Characteristics:**
- Flat surfaces at rest; atmosphere and tonal layering supply depth
- One fixed WebGL ink field behind the entire page, intensity driven by scroll
- Heavy display face (Archivo Black) against a quiet variable body face
- Hairline borders instead of shadows; underline-only form fields
- Motion is felt, never watched — transform and opacity only, no layout shift
- Ornament is generated, never fetched
- The hanko seal is the authorship mark on delivered work

**The palette is committed.** Four anchor values — `#080616`, `#1A1953`,
`#162E93`, `#2F2FE4` — define a closed indigo family spanning hue 228°–248°.
Everything else is derived at hue 240° so nothing enters from outside it. Every
pair below was measured against its real usage before it landed; the ratios are
recorded inline, and `src/styles/tokens.js` is the only place they live.

## Colors

One closed indigo family. The ground is nearly black with a channel spread of
16, so it reads calm rather than tinted, and the saturation climbs as the
element becomes more interactive — the loudest value in the system is the
primary button and nothing else. Warmth enters only through the seal red,
rationed to near-nothing.

### Primary
The interactive voice is **split by job**, and this is the system's sharpest
constraint. `#2F2FE4` measures 2.53:1 against the ground: it cannot carry text
or a border, only fill.

- **Workshop Indigo** (`#8E8EF6`): The text-level interactive voice — link text,
  hovered borders, section eyebrows, the focus outline, active navigation, the
  `.link-underline` bar, and the asanoha lattice strokes. 7.01:1 on the void,
  5.62:1 on a card. If something can be clicked and is expressed as text or a
  line, this is the color that says so.
- **Workshop Indigo Fill** (`#2F2FE4`): Filled surfaces only. Primary buttons,
  the active filter pill, the no-image project placeholder. White on it reaches
  7.93:1. Using it as text or a border is the one palette mistake that reliably
  fails contrast.
- **Workshop Indigo Deep** (`#162E93`): Hover and pressed state for a filled
  surface (white reaches 11.37:1). Doubles as the hairline; see Neutral.
- **Workshop Indigo Wash** (`#C2C2FF`): The focus-ring halo at low alpha, and
  the one value legible as text on top of the fill (4.70:1).

### Secondary
- **Fleck Periwinkle** (`#C2C2FF`): The rare luminous accent, 11.88:1 on the
  void. Reserved for the hero eyebrow chip, the "upcoming" badge, and — inside
  the particle field — the ≤5% of motes that carry light. It separates from the
  primary by luminance, not hue, which is what keeps the family closed. It must
  never become a second general-purpose interactive color.
- **Fleck Periwinkle Ground** (`#1E1B5E`): The dark wash behind periwinkle text
  (9.07:1). Note the inversion from a light theme: the accent's container is
  darker than the page, not lighter.

### Tertiary
- **Seal Red** (`#F25A5A`): The hanko seal and inline form errors — authorship
  and failure, nothing else. 6.09:1 on the void and 4.88:1 on a card; the
  deeper `#EC5151` was rejected because it measured 4.48:1 on cards and missed
  AA by 0.02. It also exists as the faintest hint inside the ink field's
  abstract presence, below conscious recognition.

### Neutral
- **Void** (`#080616`): The page base and the ground the particle field paints
  against. Luminance 0.0024 — white reaches 20.04:1 on it. Every section must
  let it (and the canvas above it) show through; an opaque section background
  hides the atmosphere completely.
- **Surface** (`#1A1953`): Project cards and section washes. One tonal step up.
- **Surface Raised** (`#162E93`): The highest tonal step.
- **Hairline** (`#162E93`): Every border in the system. Same value as Surface
  Raised — a border here is a tonal edge, not a drawn line.
- **Ink White** (`#F0F0F4`): Headings and primary body text. 17.63:1 on the
  void, 14.13:1 on a card.
- **Ink Soft** (`#CECEDA`): Secondary body copy and inactive navigation.
  12.85:1 / 10.30:1.
- **Ink Quiet** (`#9292AA`): Field labels, metadata, disabled state, and the
  suspended-ash particles. 6.60:1 / 5.29:1 — it passes AA on both grounds, so
  it is a real text color and not a decorative gray.

### Status
- **Confirm Green** (`#61D190`): Form success only. 10.53:1 on the void.
- **Caution Amber** (`#F0B042`) / **Caution Amber Text** (`#F6BB55`): The
  "no active support" project badge. The deeper value is for backgrounds,
  borders, and icons; the lighter one is the text-safe value — the inverse of
  the light-theme convention, because the ground is dark.

### The tonal ladder
Surface steps are deliberately subtle and are not text contrast:

| step | ratio |
| --- | --- |
| void → surface | 1.25 |
| surface → surface-raised | 1.41 |
| void → hairline | 1.76 |
| surface → hairline | 1.41 |

### Named Rules
**The One Voice Rule.** Indigo is the only hue that means "interactive". Fleck
Periwinkle is emphasis and Seal Red is authorship or failure — neither may be
promoted to a second clickable color. When a screen has two competing accents,
one of them is wrong.

**The Fill-Is-Not-Text Rule.** `primary-fill` (`#2F2FE4`) is a background and
nothing else. `bg-primary-fill` with white text, never `text-primary-fill` and
never `border-primary-fill` as the only edge. Conversely `primary` (`#8E8EF6`)
is a text and line color: filling a surface with it and putting white on top
measures 2.31:1. Each token has exactly one side of that boundary.

**The Transparent Section Rule.** No section may carry an opaque background.
`bg-background` matches the page color and still hides the atmosphere entirely.
Sections use transparency, or a gradient wash with alpha (`from-surface/80`),
and the content sits at `z-10` above a `z-0` canvas.

**The Closed Family Rule.** Every color is indigo at hue 228°–248°, except the
three status values and the seal. A new hue is a palette decision made at
`src/styles/tokens.js`, never a one-off in a component: consume the semantic
token names so the family can be retuned in one edit.

## Typography

**Display Font:** Archivo Black (self-hosted woff2, weight 400 only), falling
back to Noto Sans JP then system sans.
**Body Font:** Noto Sans (self-hosted woff2, variable 400–700), falling back to
Noto Sans JP then system-ui.
**Kanji:** Noto Sans JP, loaded on demand via `<link>` for seal and mark
glyphs only.

**Character:** A single-weight blackletter-adjacent grotesque against a neutral
humanist body face. Archivo Black has one weight and no italic, so hierarchy
inside display type comes from size alone — which forces genuine size jumps
instead of a weight ladder. The pairing reads industrial and plain-spoken; the
body face stays out of the way and does the reading.

### Hierarchy
- **Display** (400, `clamp(2.25rem, 6vw, 5.2rem)`, 1.08, `-0.02em`): The hero
  headline. One per page, never repeated.
- **Headline** (400, `clamp(1.5rem, 4vw, 3rem)`, 1.15): Section titles. These
  are the elements that receive the ink-reveal brush wipe.
- **Title** (700 Noto Sans, `1.25rem`, 1.3): Card titles and form-panel
  headings. Note the face switch — titles are body-face bold, not display face.
- **Body** (400, `1rem`/`1.125rem`, 1.625): Paragraphs, constrained to
  `max-w-2xl` for section intros and `max-w-prose` in cards.
- **Label** (600, `0.875rem`, `0.1em`, uppercase): Section eyebrows, button
  text, and field labels. The wide tracking is what makes these read as
  labels rather than small body text.
- **Micro** (600, `11px`, `0.025em`, uppercase): Status badges only. The one
  step below Label, and the floor — nothing in the system goes smaller.

### Named Rules
**The Size-Not-Weight Rule.** Archivo Black ships one weight. Display hierarchy
is created by size and space, never by a bolder cut — there isn't one. Never
apply `font-bold` to a display element; it triggers synthetic bolding and
smears the letterforms.

**The Two-Roles-One-Face Rule.** Display face for `h1`–`h4` and nothing else.
Card titles, buttons, badges, and every piece of UI text use the body face,
even at bold weight. Display type on a button reads as a mistake in this system.

**The Self-Hosted Rule.** Fonts are woff2 files in `public/fonts`, declared
with `@font-face` and `font-display: swap`. Never reintroduce
`@next/font/google` or a Google Fonts stylesheet link for the display or body
face: it fetches at build time, breaks offline builds, and adds a render-
blocking dependency.

## Layout

A centered single-column document with a `max-w-7xl` (80rem) outer container
for wide grids and `max-w-6xl` / `max-w-5xl` for content-dense sections,
horizontally padded at 24px (`px-6`) and 16px on the smallest screens.

**Vertical rhythm.** Sections are `py-16` on mobile and `py-20` from `sm` up
(64px / 80px). Inside a section: eyebrow → heading → intro paragraph → content,
with `mb-3` after the eyebrow, `mb-4` after the heading, and `mb-10`/`mb-12`
before the content block. That four-part header is the section signature and
should be reused rather than reinvented.

**Grids.** Project and service collections run `grid-cols-1` →
`md:grid-cols-2` → `lg:grid-cols-3` with a 32px gutter (`gap-8`). Two-column
content splits (contact form and detail panel) go `grid-cols-1` →
`lg:grid-cols-2` with a 40–56px gutter. Cards are `flex flex-col` with a
`flex-grow` body so every card in a row ends at the same height regardless of
copy length.

**Breakpoints.** Tailwind defaults: `sm` 640, `md` 768, `lg` 1024, `xl` 1280.
The desktop navigation appears at `md`.

**Mobile density.** These are declared roles, not drift. Below 768px the root
font size rises to 17px, all buttons
and `role="button"` elements get a 44px minimum hit target, and `text-xs` /
`text-sm` are bumped up (13px / 15px) so small metadata stays legible on a
phone.

**Fixed chrome.** The navigation bar is fixed at a 64px inner height (80px with
padding), and `html { scroll-padding-top: 5rem }` matches it exactly so a hash
target lands flush beneath the bar instead of tucking under it.

### Named Rules
**The Layered-Stack Rule.** The atmosphere canvas is `position: fixed` at
`z-0`. A fixed element paints above static content, so every section's content
wrapper needs `relative z-10` or the canvas covers the page. The paper-grain
overlay sits alone at `z-9999` with `pointer-events: none`.

## Elevation & Depth

Flat at rest, elevated by state. Surfaces have no drop shadow while idle;
separation comes from the three-step tonal ladder (Ground → Surface → Surface
Raised) plus hairline borders, and the real sense of space comes from the
particle field's near and far motes drifting behind everything.

Shadow appears only in response to something: a focus ring's halo, the primary
CTA's ambient glow marking it as the one action that matters, and hover lift on
interactive cards. A shadow on an idle surface is a bug in this system.

### Shadow Vocabulary
- **Focus halo** (`box-shadow: 0 0 0 6px var(--primary-soft)`, paired with
  `outline: 2px solid var(--primary); outline-offset: 3px`): The global
  `:focus-visible` treatment. Suppressed entirely under
  `prefers-reduced-motion`.
- **Action glow** (`box-shadow: 0 0 20px rgb(47 47 228 / 0.45)`, rising to
  `0 0 30px rgb(47 47 228 / 0.55)` on hover): The hero's primary CTA only. This
  is the single deliberate exception to flatness, and duplicating it elsewhere
  destroys its meaning.
- **Card ambient** (`shadow-lg` tinted at 25% `primary-fill`): Section-closing CTA
  buttons. Restrained; reads as a soft ground contact, not a lift.
- **Hover lift** (`transform: translateY(-2px)` over 250ms): The `.hover-lift`
  utility and project cards. Movement substitutes for shadow — the card rises,
  it does not cast.

### Named Rules
**The Flat-At-Rest Rule.** Idle surfaces are flat. Every shadow in the system
answers a state (focus, hover, primary action). If a new component needs a
resting shadow to be legible, its tonal step or its border is wrong.

**The Atmosphere-Carries-Depth Rule.** Do not add depth to the UI to compensate
for a section that reads flat. Check that the section is transparent and the
canvas is reaching it first — a hidden atmosphere is the usual cause, and
stacking shadows on top of it is the wrong fix.

## Shapes

A dual radius language, split by function. **Interactive elements are fully
round** (`rounded-full`, 9999px): primary buttons, ghost buttons, the eyebrow
chip, the navigation CTA. **Containers are softly rectangular** (12–16px):
project cards and the contact panel at 16px (`rounded-2xl`), alerts at 12px
(`rounded-xl`), badges and stack pills at 8px (`rounded-md`), navigation items
at 8px (`rounded-lg`). The hanko's own frame carries a 6px radius on a 32px
viewbox.

**Borders are hairlines.** Every border in the system is 1px in Hairline
(`#334155`) or an alpha wash of white (`border-white/20`) over imagery. There
are no 2px+ decorative borders. On hover, a border shifts to Workshop Indigo
rather than thickening.

**Form fields have no box.** Inputs are a bottom border only, transparent
background, no radius — the field is a ruled line on paper, and focus moves that
line to Workshop Indigo.

**Recurring silhouettes.** The hanko is a rounded square frame enclosing an
abstract two-glyph composition (three filled rectangles), rendered in Seal Red
at `currentColor`, at 24px in cards. Project imagery is locked to a 4:3 aspect
ratio (`aspect-[4/3]`) with `overflow-hidden` so every card presents the same
window.

### Named Rules
**The Round-Means-Clickable Rule.** A pill radius signals an action. Containers
never take `rounded-full`, and actions never take a container radius. When you
can't tell whether a thing is a button, its radius has failed.

**The No-Box Field Rule.** Text inputs are underlines, not boxes. Do not add a
background, border ring, or radius to a form field; focus is expressed by the
underline changing color, and errors by red helper text below it.

## Components

### Buttons
- **Shape:** Fully round (`9999px`) without exception.
- **Primary:** Workshop Indigo Fill, white text, `16px 48px` padding, uppercase
  label typography with `0.05em`–`0.1em` tracking. Carries the action glow in
  the hero and `shadow-lg` at 25% primary elsewhere.
- **Hover / Focus:** Fill deepens to Workshop Indigo Deep (or `bg-primary-fill/90`),
  scale rises to 1.02, glow widens from 20px to 30px, over 250ms
  `cubic-bezier(0.16, 1, 0.3, 1)`. Active state presses to 0.97. Focus uses
  the global halo with `focus-visible:outline-white` over dark imagery.
- **Ghost:** `rgb(255 255 255 / 0.05)` fill, `border-white/20`,
  `backdrop-blur-md`, white text. Hover raises the fill to 10% and the border
  to 40%. Used for the secondary hero action and any action over imagery.
- **Icon behavior:** An inline 20px SVG arrow nudges `translate-x-0.5` on
  group hover. The icon moves, the label does not.

### Chips
- **Eyebrow chip** (hero only): Fleck Periwinkle text on `accent/10`, `accent/30`
  hairline, `backdrop-blur-sm`, pill radius, uppercase label typography with
  `0.1em` tracking. One per page.
- **Status badges:** 8px radius, 1px border, `11px` uppercase semibold,
  `4px 10px` padding. Badges render only when true — an empty badge row returns
  null rather than reserving space.
  Every variant shares one shell: `bg-surface/90` with `backdrop-blur-sm`, the
  accent carried by the text and the hairline. The shell is opaque because
  these sit on top of an arbitrary project photograph, where a 10% tint leaves
  the label at whatever contrast the image happens to give it. Three variants,
  each measured against `surface`: **international** in Seal Red (4.88:1),
  **caution** in Caution Amber Text (9.30:1), **upcoming** in Fleck Periwinkle
  (9.52:1). International leads the row.
- **Stack pills:** Hairline border, Ink Soft text, 8px radius, `8px 20px`
  padding. On hover the border and text both shift to Workshop Indigo. A
  non-linked stack item drops the border and takes a Surface fill instead.

### Cards / Containers
- **Corner Style:** 16px (`rounded-2xl`).
- **Background:** Surface (`#1E293B`), or `background/80` with `backdrop-blur`
  for the contact panel so the atmosphere reads through it.
- **Shadow Strategy:** None at rest. Hover lifts `-4px`
  (`hover:-translate-y-1`) over 250ms; see Elevation & Depth.
- **Border:** 1px Hairline, including a divider below the image well.
- **Internal Padding:** 24px (`p-6`) for project cards; 32–40px
  (`p-8 sm:p-10`) for the contact panel.
- **Structure:** `flex flex-col` with a `flex-grow` copy block, so the footer
  row (hanko + actions) aligns across a grid row.

### Inputs / Fields
- **Style:** Transparent background, 1px bottom border in Hairline, no radius,
  `12px 0` padding, full width. Label sits above in Ink Quiet at 14px medium.
- **Focus:** The bottom border becomes Workshop Indigo over 150ms;
  `focus:outline-none` is set because the underline shift *is* the focus
  affordance on this control.
- **Error:** 12px Seal Red helper text 8px below the field. The field itself
  does not change color.
- **Feedback panels:** Success and error banners are 12px radius, tinted at 10%
  with a 20% border, centered medium text, announced with an ARIA role and
  persisted rather than auto-dismissed.

### Navigation
- **Style:** Fixed bar, 64px inner height, two states. Over the hero it is
  transparent with white links at 85% opacity and a `drop-shadow` on the
  wordmark for legibility against imagery. Once scrolled it takes the solid
  treatment with Ink Soft links that hover to Workshop Indigo.
- **Typography:** 14px semibold body face, 8px radius hit area, `16px 8px`
  padding.
- **Hover:** The `.link-underline` micro-interaction — a 2px `currentColor`
  bar scales in from the left over 150ms. Under reduced motion it is present
  and fades instead of scaling.
- **Mobile:** Collapses below `md` behind a toggle; every control keeps the
  44px minimum target.

### Cross-Border Marker (signature component)
Two of the fifteen delivered projects (TDS, Integra BPO) were delivered across
a border, and for the primary audience that is the single most load-bearing
fact in the catalog. It is signalled in three places, because a badge on 2 of
15 cards does not survive a scan:

- **A badge in Seal Red** — the palette's one warm value in a cold family, so
  it catches the eye that is scanning rather than reading. It leads the badge
  row ahead of any support-status caveat.
- **A filter chip** on the catalog (`Internacional`), which lets a reader
  isolate the answer in one click and see that there are exactly two.
- **Priority in the home grid.** The featured selection sorts cross-border
  projects first. Without that sort the three slots fill by array order and the
  proof is invisible on the page the audience lands on.

The claim never exceeds the evidence: both projects are live public URLs, and
nothing about timezone, language, or contract terms is asserted alongside them.

### Ink Reveal (signature component)
A brush stroke that sweeps across a heading and lays the text down. A data-URI
SVG mask three times the element's width holds an empty zone, a ragged leading
edge with detached flecks, and a solid zone; animating `mask-position` from 0%
to 100% slides the torn edge across the text. No JavaScript runs per frame and
the whole effect composites on the GPU.

- Applied to section headings (`Headline` role), never to body copy or display.
- The mask arrives with `.is-armed`, added by the client only. A masked heading
  whose JS never ran would be invisible text, so the failure mode must be "no
  animation", never "no content".
- Duration 620ms on `cubic-bezier(0.16, 1, 0.3, 1)`. Fully disabled under
  `prefers-reduced-motion` (`mask-image: none`).
- The mask is stretched with `preserveAspectRatio='none'`, so horizontal detail
  is magnified roughly `W/H` — about 26× on a typical heading. Edge detail is
  therefore drawn across ~10 SVG x-units, and flecks are near-vertical slivers
  that land as round specks on screen. Redrawing the mask without honoring that
  ratio produces horizontal banding, not a brush.

### Oni Atmosphere (signature component)
One fixed WebGL layer behind the entire page: a procedural sumi-e ink haze plus
a particle field mixing pigment bodies (57%), brush fragments (23%), suspended
ash (15%), and luminous flecks (5%). 40% of the ink family is drawn as a petal
silhouette rather than a droplet.

- **Every tunable value lives in `src/effects/oni/config.js`.** There are no
  magic numbers in the components or shaders. Tune there, never inline.
- **No new hues.** The field draws only from existing palette tokens; depth and
  variation come from alpha, luminance, and blending. Particles blend
  source-over, so a sprite paints its own color and overlaps stay bounded
  instead of blowing out.
- Intensity is driven by scroll position per section, keyed to
  `data-oni-section` attributes in the markup. Hover on `[data-oni-attract]`
  pulls particles gently toward that element.
- A still pointer must exert nothing. A cursor force that is not gated on
  activity carves a hole that follows the mouse.
- Quality tiers scale particle count, DPR cap, and curl noise from viewport
  width and pointer type.
- The abstract presence inside the haze stays at the threshold of pareidolia.
  Raising `presence.strength` turns it into a mask, which the system rules out.

### Hanko (signature component)
A 32px rounded-square seal in Seal Red enclosing an abstract two-glyph
composition. It marks authorship on each delivered project, rendered at 24px
in the card footer row with an accessible label naming the project it seals.
It is a mark of provenance — never a decorative divider, bullet, or icon.

## Do's and Don'ts

### Do:
- **Do** consume semantic tokens (`bg-surface`, `text-text-secondary`,
  `border-border`) so the palette can be retuned in one edit at
  `src/styles/tokens.js`.
- **Do** verify contrast against the *real* pairing before adding a color use:
  every ratio in Colors was measured against the surface the element actually
  sits on, void and card both.
- **Do** keep every section transparent and its content at `relative z-10`
  above the `z-0` canvas.
- **Do** animate only `transform`, `opacity`, and `filter`. The motion system's
  stated principle is that motion is felt, never seen — and a layout-shifting
  animation is always seen.
- **Do** use the motion tokens (`--motion-fast` 150ms, `--motion-base` 250ms,
  `--motion-slow` 500ms, `--motion-reveal` 800ms) with `--ease-out`
  `cubic-bezier(0.16, 1, 0.3, 1)` for state changes and `--ease-reveal`
  `cubic-bezier(0.22, 1, 0.36, 1)` for scroll reveals.
- **Do** give every new animation a `prefers-reduced-motion` branch that lands
  on the finished state, not a hidden one.
- **Do** generate ornament inline as data-URI SVG or CSS gradient. The paper
  grain, asanoha lattice, and ink-reveal mask all ship as zero HTTP requests.
- **Do** reuse the section header pattern: eyebrow label → ink-reveal heading →
  intro paragraph capped at `max-w-2xl` → content.
- **Do** stagger entrance animations with `--motion-stagger` (110ms) and stop
  at five steps.
- **Do** give a badge that sits over imagery an opaque backing. A tint alone
  inherits whatever contrast the photograph happens to supply.
- **Do** signal a load-bearing fact in more than one place. A badge is not
  findable on 2 of 15 cards; a badge plus a filter plus grid priority is.

### Don't:
- **Don't** put a raw hex, an `rgb()` literal, or a Tailwind palette utility
  (`bg-slate-800`, `text-blue-600`) in a component. It breaks the single point
  of palette retuning at `src/styles/tokens.js`.
- **Don't** use `primary-fill` as a text or border color, or `primary` as a
  surface fill under white text. See **The Fill-Is-Not-Text Rule**.
- **Don't** apply a background gradient to text. `bg-clip-text` with
  `text-transparent` was removed from the hero, navigation wordmark, and footer
  during the palette migration; emphasis comes from weight or size.
- **Don't** use bounce or elastic easing. `--ease-loop`
  `cubic-bezier(0.45, 0, 0.55, 1)` exists for continuous loops; real objects
  decelerate, they do not spring. The `scroll-bounce` keyframe is a legacy
  exception, not a pattern.
- **Don't** add a resting drop shadow to a surface. See **The Flat-At-Rest
  Rule**.
- **Don't** give a section an opaque background, `bg-background` included — it
  matches the page color and still hides the atmosphere completely.
- **Don't** set `font-bold` on display type. Archivo Black has one weight;
  bolding it synthesizes and smears.
- **Don't** promote Fleck Periwinkle or Seal Red to a second interactive color.
- **Don't** box a form field. Underline only.
- **Don't** raise `petalShare` far above 0.4 or the particle field stops
  reading as pigment and starts reading as flowers.
- **Don't** put a backtick inside a GLSL comment. The shaders are template
  literals and the resulting error points somewhere unhelpful.
- **Don't** reintroduce `@next/font/google` or a remote font stylesheet for the
  display or body face.

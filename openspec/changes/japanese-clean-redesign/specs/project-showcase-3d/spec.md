# Project Showcase 3D Specification

## Purpose

Define the scoped WebGL moment on `/proyectos/[slug]`: bundle budget, frame
budget, dependency pinning, ordering prerequisite, and unified fallback.

## Requirements

### Requirement: Hero image fix is a hard prerequisite

The 5.8 MB `public/fondoHero1.png` MUST be replaced or optimized before any
WebGL code lands. No commit introducing `three` / `@react-three/fiber` MUST
be merged while `fondoHero1.png` (or its unoptimized equivalent) still
exceeds a reasonable LCP-safe size.

#### Scenario: Image fix lands before WebGL dependency

- GIVEN the git history of this change
- WHEN the commit that fixes `fondoHero1.png` weight is compared to the commit that adds `three`/`@react-three/fiber` to `package.json`
- THEN the image-fix commit's timestamp/order precedes the WebGL-dependency commit

#### Scenario: WebGL blocked without the fix (negative case)

- GIVEN `fondoHero1.png` is still at its original 5.8 MB weight
- WHEN a PR attempts to add the WebGL dynamic import
- THEN the PR MUST be rejected or the WebGL work MUST NOT proceed until the image fix is measured and confirmed

### Requirement: Bundle budget on the carrying route

The WebGL feature MUST add no more than 60 kB gzip to `/proyectos/[slug]`
with `react-three-fiber`, or no more than 45 kB gzip using named `three`
imports with no `react-three-fiber` (r3f). `@react-three/drei` MUST be
absent from `package.json`.

#### Scenario: Measured gzip under budget

- GIVEN `ANALYZE=true next build` run with `@next/bundle-analyzer`
- WHEN the gzip size added to `/proyectos/[slug]` by the WebGL feature is measured
- THEN it is ≤60 kB gzip (r3f path) or ≤45 kB gzip (named-imports-only path)

#### Scenario: drei absent

- GIVEN `package.json`
- WHEN inspected for `@react-three/drei`
- THEN it is not listed as a dependency

### Requirement: Frame budget on target device profile

Sustained frame time MUST be ≤16.6 ms on the Lighthouse mobile default
profile (4x CPU throttle). A frame time exceeding 33 ms is a hard fail.

#### Scenario: Sustained frame time within budget

- GIVEN a Lighthouse mobile run with 4x CPU throttle on `/proyectos/[slug]`
- WHEN frame timing is recorded during the WebGL animation
- THEN sustained frame time is ≤16.6 ms

#### Scenario: Frame time spike is a hard fail (negative case)

- GIVEN the same measurement conditions
- WHEN any recorded frame exceeds 33 ms
- THEN the feature fails this requirement and MUST NOT ship as-is

### Requirement: react-three-fiber pinned to v8

`package.json` MUST pin `@react-three/fiber` to an exact v8.x version (no
`^` or `~` range that could resolve to v9). Next 13.1.6 / React 18.2 cannot
take r3f v9.

#### Scenario: Exact v8 pin

- GIVEN `package.json` dependency entry for `@react-three/fiber`
- WHEN the version specifier is inspected
- THEN it is an exact v8.x version with no caret or tilde range

#### Scenario: Build succeeds with the pinned version

- GIVEN the pinned dependency
- WHEN `npm run build` runs
- THEN it completes successfully with r3f v8 resolved

### Requirement: Unified fallback for reduced-motion, no-WebGL2, and not-yet-in-view

Reduced motion, absence of WebGL2, and not-yet-in-viewport MUST all resolve
to exactly one shared fallback render branch. The reduced-motion check MUST
reuse the existing check in `src/components/Reveal.js:29-33` verbatim.
Under reduced motion, the dynamic import for the WebGL module MUST never be
requested (not merely unrendered).

#### Scenario: Reduced motion never requests the dynamic import

- GIVEN `prefers-reduced-motion: reduce` is active
- WHEN `/proyectos/[slug]` loads
- THEN the network/module-load trace shows no request for the WebGL dynamic import chunk
- AND the fallback branch renders

#### Scenario: No WebGL2 support falls back

- GIVEN a browser/context without WebGL2 support
- WHEN `/proyectos/[slug]` loads
- THEN the same fallback branch renders as the reduced-motion case

#### Scenario: Not-yet-in-view falls back until intersecting

- GIVEN the WebGL section has not yet entered the viewport
- WHEN the page is scrolled and the IntersectionObserver has not fired
- THEN the fallback branch renders
- AND the dynamic import is requested only after the section intersects (and only when motion is not reduced and WebGL2 is supported)

#### Scenario: All three conditions share one branch (negative case for divergence)

- GIVEN the component source for the fallback
- WHEN inspected for the render logic
- THEN a single fallback branch/component serves all three conditions; no separate fallback implementation exists per condition

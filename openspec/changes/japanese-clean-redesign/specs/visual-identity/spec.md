# Visual Identity Specification

## Purpose

Define the Ai-Zome color system, typography, and permitted Japanese formal
devices, with contrast floors verifiable by computed-value inspection.

## Requirements

### Requirement: Contrast floors on `bg-washi`

Each token MUST meet or exceed its measured contrast ratio against
`bg-washi` (`#F7F5EF`) when used as text or a text-bearing surface. Ratios
below are the accepted floor, not a target to trend toward.

| Token | Hex | Min ratio |
|---|---|---|
| text-primary | `#171A23` | 15.94:1 |
| text-secondary | `#4A4E5C` | 7.60:1 |
| text-muted | `#6B6F7D` | 4.59:1 |
| primary | `#22345E` | 11.20:1 |
| accent | `#3E6E96` | 4.97:1 |
| seal | `#A63A2E` | 5.90:1 |
| success | `#3F6B4E` | 5.62:1 |
| warning-strong | `#8A611F` | 5.05:1 |

#### Scenario: Each token holds its floor

- GIVEN the token's hex value and `bg-washi` (`#F7F5EF`)
- WHEN contrast is computed with a WCAG contrast calculator
- THEN the ratio is greater than or equal to the token's listed floor
- AND `text-muted` (`#6B6F7D`) is never replaced with a lighter value than 4.59:1

#### Scenario: No Tailwind blue/sky utilities remain

- GIVEN a full-text search of `src/` for `blue-` and `sky-` Tailwind utility classes
- WHEN the search excludes legitimate brand marks (WhatsApp, LinkedIn)
- THEN zero matches remain

### Requirement: `warning` cannot carry text

`warning` (`#B8863B`, 2.96:1 on `bg-washi`) MUST NOT be used to color body
text, labels, or any text node. It MAY be used for icons, borders, or
non-text fills only.

#### Scenario: Warning used as icon or border

- GIVEN a component uses the `warning` token
- WHEN the usage is inspected in the rendered DOM/class list
- THEN `warning` is applied only to `border-*`, `stroke`, `fill`, or icon-only elements
- AND `warning` never appears as `text-warning` on a text node

#### Scenario: Warning misused as text color (negative case)

- GIVEN a component applies `text-warning` (or an inline style setting `color` to `#B8863B`) to a text node
- WHEN this usage is inspected
- THEN the build/review MUST reject it as a specification violation
- AND the fix is to use `warning-strong` (`#8A611F`, 5.05:1) for that text instead

### Requirement: Token atomicity across definition files

The 18 Ai-Zome tokens MUST be defined identically in `tailwind.config.js`
(`theme.extend.colors`) and `src/styles/globals.css` (`:root` custom
properties). No token may exist in one file without the same hex value in
the other.

#### Scenario: Tokens match across both files

- GIVEN the token list in `tailwind.config.js theme.extend.colors`
- AND the token list in `src/styles/globals.css :root`
- WHEN each token name is compared by hex value across both files
- THEN every token has an identical hex value in both files
- AND no token exists in only one file

#### Scenario: Drift is caught (negative case)

- GIVEN a hex value is changed in only one of the two files
- WHEN the token lists are diffed
- THEN the mismatch is detected before merge (manual inspection or a diff script)

### Requirement: `accent` and `error` resolve to single sources

`accent` MUST be usable directly as text color; no `accent-strong` patch
token exists. `error` MUST resolve to `seal` (`#A63A2E`) — exactly one red
token in the system.

#### Scenario: No accent-strong token

- GIVEN `tailwind.config.js` and `globals.css`
- WHEN searched for `accent-strong`
- THEN no matches exist

#### Scenario: Single red in the system

- GIVEN all color tokens defined for error/danger states
- WHEN their hex values are compared
- THEN only `#A63A2E` (seal) is used for error semantics

### Requirement: Typography and dead font removal

The system MUST use Fraunces (display) and IBM Plex Sans (body). The
`burtons` and `quantico` font families MUST be absent from
`tailwind.config.js` and `globals.css`.

#### Scenario: Dead fonts removed

- GIVEN `tailwind.config.js` and `globals.css`
- WHEN searched for `burtons` and `quantico`
- THEN no matches exist in either file

### Requirement: Formal devices scoped and bounded

The hanko seal MUST appear exactly once per project card and once beside
the Contact CTA, nowhere else. The asanoha lattice MUST appear behind
Process only, at 4–6% opacity.

#### Scenario: Seal placement count

- GIVEN the rendered project catalog and Contact section
- WHEN seal occurrences are counted
- THEN each project card renders exactly one seal, the Contact CTA renders exactly one seal, and no other section renders a seal

#### Scenario: Asanoha opacity bound

- GIVEN the Process section background
- WHEN the lattice opacity value is inspected in CSS
- THEN it is between 4% and 6% inclusive
- AND no other section renders the asanoha lattice

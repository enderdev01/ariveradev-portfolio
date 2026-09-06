# Portfolio Catalog Specification

## Purpose

Define catalog membership, single-source category truth, and sitemap
consistency for the project listing.

## Requirements

### Requirement: HooBank absent from all catalog sources

HooBank MUST NOT appear in `src/data/onilabs.js`, `src/data/proyectos-seo.js`,
or the generated sitemap. The catalog MUST contain exactly 16 projects.

#### Scenario: No HooBank references remain

- GIVEN `src/data/onilabs.js` and `src/data/proyectos-seo.js`
- WHEN searched for "HooBank" (case-insensitive)
- THEN no matches exist in either file

#### Scenario: Project count is 16

- GIVEN the project catalog data
- WHEN the entries are counted
- THEN exactly 16 projects exist

#### Scenario: Sitemap reflects the removal

- GIVEN the generated `sitemap.xml` output
- WHEN its project URLs are inspected
- THEN no HooBank slug/URL is present
- AND the total project URL count matches 16

### Requirement: Single source of truth for project category

`AllProjects.js` MUST derive each project's category from
`proyectosSeo[id].categoria`. A separately maintained id→category map MUST
NOT exist alongside it.

#### Scenario: Category matches proyectosSeo for every id

- GIVEN every project id in the catalog
- WHEN its rendered category is compared to `proyectosSeo[id].categoria`
- THEN the values are identical for all ids, including id 5 (bucket
  disagreement, corrected to Plataformas) and id 18 (previously absent from
  the map, now visible under Ecommerce)
- NOTE: id 13 was a phantom key in the deleted map and never corresponded to
  a real project — it is not part of the corrected id list

#### Scenario: No duplicate category map exists (negative case)

- GIVEN `AllProjects.js` source
- WHEN inspected for a hand-maintained id→category lookup object
- THEN no such duplicate structure exists; the component reads only from `proyectosSeo`

### Requirement: No inline hex or style mutation in catalog components

`AllProjects.js` and `FeaturedProjects.js` MUST NOT contain inline hex color
values or direct `.style.background` (or equivalent inline style) mutation.
Color MUST come from Ai-Zome tokens via Tailwind classes or CSS custom
properties.

#### Scenario: Zero inline hex remains

- GIVEN `AllProjects.js` and `FeaturedProjects.js` source
- WHEN searched for hex color literals (`#[0-9a-fA-F]{3,6}`) outside comments
- THEN no matches exist

#### Scenario: No direct style mutation on hover

- GIVEN the hover interaction previously implemented via `element.style.background = ...`
- WHEN the component source is inspected
- THEN no `.style.` mutation exists; hover state is expressed via Tailwind classes or CSS

### Requirement: Heading order does not skip levels

`AllProjects.js` MUST NOT skip from an `h1` directly to an `h3` without an
intervening `h2`.

#### Scenario: Heading levels are sequential

- GIVEN the rendered `AllProjects.js` page/section
- WHEN the heading elements are listed in document order
- THEN no heading level is skipped (e.g., `h1` is followed by `h2` before any `h3` appears)

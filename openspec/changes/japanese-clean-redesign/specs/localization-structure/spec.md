# Localization Structure Specification

## Purpose

Define the `{es, en}` data shape and locale-aware sitemap/hreflang, without
publishing a second locale or extracting JSX strings.

## Requirements

### Requirement: `{es, en}` shape on all three data files

`src/data/onilabs.js`, `src/data/proyectos-seo.js`, and
`src/data/servicios-seo.js` MUST carry an `{es, en}` shape for every
user-visible text field. Existing Spanish content MUST move under `es`
without content loss.

#### Scenario: Every text field has both locale keys

- GIVEN a user-visible text field in any of the three data files
- WHEN its structure is inspected
- THEN it is an object with both `es` and `en` keys (or the field's container is)
- AND the `es` value matches the pre-change Spanish content

#### Scenario: No content loss during restructuring

- GIVEN the pre-change Spanish copy for a given field
- WHEN the same field is read after restructuring via its `es` key
- THEN the text is unchanged

### Requirement: No `/en` route is published

This change MUST NOT add a Next.js locale route, `i18n` config in
`next.config.js`, or any way for a visitor to reach English-rendered pages.

#### Scenario: No i18n routing config exists

- GIVEN `next.config.js`
- WHEN inspected for an `i18n` block
- THEN no `i18n` block exists

#### Scenario: No route serves `en` content

- GIVEN the site's page routes
- WHEN each route is requested
- THEN every rendered page displays only `es` content; no `/en` prefixed route resolves

### Requirement: No JSX string extraction in this change

Hardcoded strings directly inside component JSX (as inventoried by
exploration: `Contact.js`, `AllProjects.js`, `Navbar.js`, `Footer.js`,
`Hero.js`, `ProjectBadges.js`, `FeaturedProjects.js`) MUST NOT be moved to
a translation catalog or replaced with a lookup call in this change. Only
data-file fields already sourced from `src/data/*.js` are restructured.

#### Scenario: JSX literals are untouched

- GIVEN a component with a hardcoded JSX string (e.g., `Navbar.js` labels outside data files)
- WHEN the component source is inspected after this change
- THEN the string remains a literal in JSX, not a data-file or catalog lookup

### Requirement: Sitemap and hreflang are locale-aware

`src/pages/sitemap.xml.js` MUST emit hreflang annotations reflecting the
`{es, en}` data shape while still only publishing `es` as the live,
crawlable locale.

#### Scenario: Sitemap re-verified after HooBank removal and shape change

- GIVEN the generated sitemap output
- WHEN inspected after HooBank removal and the `{es,en}` restructuring
- THEN the URL count matches 16 projects
- AND no broken or orphaned slug is present

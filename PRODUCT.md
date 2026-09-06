# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: technical decision-makers at international companies (CTOs, heads of
product, engineering managers) evaluating a nearshore development partner. They
arrive comparing vendors, and what they need to establish is whether this team
can be trusted with a real system and whether working across a border will slow
them down.

Secondary: LATAM business owners and managers (predominantly Peru, per the
delivered catalog) buying custom software, ecommerce, or integrations. This is
the audience the site currently speaks to in its native language, and it remains
a live source of work.

## Product Purpose

OniLabs is a small software studio that builds custom systems end to end — web
applications, mobile apps, ecommerce, microservices, and integrations — and
operates them through delivery. Success is a qualified inbound conversation:
a prospect who has verified the work is real and books a call.

## Positioning

The differentiator is structural, not a claim about quality: the team is small
enough that the client talks directly to the developers writing the code. There
is no account-management layer translating requirements, and no handoff between
the people who scope the work and the people who ship it. The five-step process
(Discovery → Proposal → Design/Architecture → Development → Deploy/Support)
runs with incremental deliveries and continuous client contact rather than a
single milestone reveal.

This is a claim a larger agency cannot truthfully copy, and it is the through-line
future surfaces should carry.

## Operating Context

- Prospects evaluate by opening the delivered sites themselves. The catalog is
  public, live production work with real URLs — the proof is the link.
- Engagements run as ongoing relationships with post-launch support and
  monitoring, not one-off project handoffs.
- The nearshore evaluation happens against a checklist the prospect brings:
  time-zone overlap, English communication, and prior cross-border delivery.

## Capabilities and Constraints

**Confirmed capabilities**
- Web: landing pages, corporate sites, dashboards, SaaS applications.
- Mobile: native and cross-platform (React Native, Ionic), with at least one
  published Play Store app.
- Backend: RESTful APIs, CRM integrations, payment systems, message queues,
  webhooks, microservices.
- Ecommerce: WooCommerce/WordPress stores, custom plugins, payments, inventory.

**Technical constraints**
- Next.js 13 pages router, React 18, Tailwind 3. No test runner is configured.
- Locale boundary exists and is enforced: `src/lib/i18n.js` collapses `{es, en}`
  leaves and falls back to `es`, so partial English can never render. `LOCALES`
  is currently `["es"]`.
- Contact submissions go through `nodemailer` via `/api/contacto`.

**Open decisions**
- **Spanish stays primary; English ships later.** `/en` is confirmed as future
  work, not a pending default swap. Until it ships, the primary audience reads a
  Spanish site — an acknowledged tension, resolved in favor of not shipping a
  half-translated surface.
- The two internationally delivered clients (TDS, Integra BPO) sit undifferentiated
  among the 15 catalog entries. Whether to surface cross-border delivery as a
  distinct signal for the primary audience is undecided.

## Brand Commitments

- Name: OniLabs. Canonical origin `https://www.onilabs.site` (apex 307-redirects
  to `www`).
- Team members are presented under working aliases with real photographs:
  ENDER (CEO), AKHSEL, L1NTCH, GHOST.
- No pinned aesthetic, palette, typography, or era. The current dark "oni"
  visual system (ink/petal shaders, hanko mark, InkReveal) is incumbent
  implementation and design evidence — it was not declared binding.

## Evidence on Hand

**Real and citable**
- 15 delivered projects with live public URLs in `src/data/onilabs.js`
  (`proyectosReales`), including Taffe Regalos, Integra BPO, Creative Home,
  Edificio Loma Amarilla, Santed, D'Segunda, Impuestos Perú (Play Store),
  BKS Moda, Ecoship Perú, OniGrowth, Versus Electoral, OniStore, Yomiru Manga,
  Guess the Year, and TechD Solution.
- Stack per project is recorded and accurate.
- Time-zone overlap with US working hours: true, assertable.
- Working English for client meetings and written communication: true,
  assertable.
- Internationally delivered clients, both already in the public catalog with
  live URLs:
  - **TDS / TechD Solution** — `https://www.techdsolution.com/` — landing and
    ecommerce for industrial transport, mining, and marine vehicle products.
  - **Integra BPO** — `https://integrasgp.com/` — corporate site for BPO
    services, positioned to capture opportunity from LATAM outward
    (Next.js, Tailwind, Node.js).

  These two are the concrete answer to the nearshore prospect's "have you
  worked across a border before" question, and unlike the rest of the catalog
  they carry that weight. Cross-border delivery is assertable; nothing beyond
  the delivered scope above is.

**Absences — never fabricate**
- No testimonials, case studies, quantified outcomes, press coverage, client
  logos, certifications, pricing, or headcount figures exist. None may be
  invented or implied.
- No published SLA, contract terms, or security/compliance posture.

## Product Principles

1. **The link is the proof.** Every credibility claim should resolve to
   something the prospect can open and verify. Prefer live work over prose.
2. **Directness is the product.** Anything that implies a layer between client
   and developer contradicts the positioning.
3. **No claim outruns the evidence.** Absences in this file are hard limits;
   the site earns trust by being checkable, and one fabricated number destroys
   that faster than any design gains it.
4. **One language at a time, fully.** No partial English reaches the UI. `/en`
   ships complete or not at all.
5. **Delivery is the relationship, not the milestone.** Support, monitoring,
   and iteration are part of what is being sold.

## Accessibility & Inclusion

No product-specific standard has been established. Baseline WCAG AA contrast
and keyboard operability apply as ordinary craft, not as a captured requirement.

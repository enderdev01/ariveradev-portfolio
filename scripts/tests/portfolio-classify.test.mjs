// Offline node:test suite for scripts/lib/portfolio-classify.mjs: pure,
// deterministic classification, stack derivation, gradient selection,
// narrative templates and safe HTML extraction. No network, no I/O.

import test from "node:test";
import assert from "node:assert/strict";
import {
  deriveCategory,
  deriveGradient,
  deriveNarrative,
  deriveSeoTexts,
  deriveStack,
  extractMetaDescription,
  extractTitle,
  hashSeed,
  normalizeSlug,
} from "../lib/portfolio-classify.mjs";

test("normalizeSlug ASCII-folds, lowercases and kebab-cases", () => {
  assert.equal(normalizeSlug("Mi Sitio Ñoño_2023!"), "mi-sitio-nono-2023");
  assert.equal(normalizeSlug("--Ya-Existente--"), "ya-existente");
  assert.equal(normalizeSlug("   "), null);
  assert.equal(normalizeSlug(123), null);
});

test("deriveCategory rules and fallback", () => {
  assert.equal(deriveCategory({ topics: ["onilabs-portfolio", "ecommerce"] }), "Ecommerce");
  assert.equal(deriveCategory({ topics: ["onilabs-portfolio", "landing"] }), "Landing de producto");
  assert.equal(deriveCategory({ topics: ["onilabs-portfolio"], language: "Kotlin" }), "App móvil");
  assert.equal(deriveCategory({ topics: ["onilabs-portfolio"], language: "Go" }), "Proyecto web");
  assert.equal(deriveCategory({}), "Proyecto web");
});

test("deriveStack: language, topics and fingerprints, deduped and ordered", () => {
  assert.deepEqual(
    deriveStack({
      language: "JavaScript",
      topics: ["react", "tailwind"],
      html: "<script id='__NEXT_DATA__'>{}</script>",
    }),
    ["JavaScript", "React", "Tailwind CSS", "Next.js"]
  );
  assert.deepEqual(
    deriveStack({ language: "PHP", topics: ["wordpress"], html: "<div id=wp-content></div>" }),
    ["PHP", "WordPress"]
  );
});

test("deriveStack falls back to the generic non-claiming 'Web' entry", () => {
  assert.deepEqual(deriveStack({ topics: [], html: null }), ["Web"]);
  assert.deepEqual(deriveStack({}), ["Web"]);
  assert.deepEqual(deriveStack({ topics: ["desconocido"], html: "" }), ["Web"]);
});

test("deriveGradient and hashSeed are deterministic and thumbnail-valid", () => {
  const first = deriveGradient("clinica-nova");
  assert.deepEqual(first, deriveGradient("clinica-nova"));
  assert.ok(first.length >= 2 && first.length <= 6);
  assert.ok(first.every((stop) => /^#[0-9A-F]{6}$/.test(stop)));
  assert.equal(hashSeed("clinica-nova"), hashSeed("clinica-nova"));
  assert.notEqual(hashSeed("a"), hashSeed("b"));
});

test("deriveNarrative is deterministic and non-claiming", () => {
  const a = deriveNarrative({ nombre: "Taller Uno", categoria: "Landing de producto", stack: ["Astro", "Sass"] });
  const b = deriveNarrative({ nombre: "Taller Uno", categoria: "Landing de producto", stack: ["Astro", "Sass"] });
  assert.deepEqual(a, b);
  const generic = deriveNarrative({ nombre: "Demo X", categoria: "Proyecto web", stack: [] });
  assert.match(generic.desafio, /Demo X/);
  assert.match(generic.enfoque, /tecnologías web estándar/);
  for (const narrative of [a, generic]) {
    const text = `${narrative.desafio} ${narrative.enfoque}`;
    assert.doesNotMatch(text, /[0-9%]/);
    assert.doesNotMatch(text, /aument|increment|triplic|duplic|creci/i);
  }
});

test("deriveSeoTexts: deployed first, then repo, then derived fallback", () => {
  assert.deepEqual(
    deriveSeoTexts({ nombre: "X", categoria: "Ecommerce", deployedTitle: "T", deployedDescription: "D", repoDescription: "R" }),
    { tituloSeo: "T", descripcionSeo: "D" }
  );
  assert.deepEqual(
    deriveSeoTexts({ nombre: "X", categoria: "Ecommerce", deployedTitle: "  T  ", repoDescription: "R" }),
    { tituloSeo: "T", descripcionSeo: "R" }
  );
  assert.deepEqual(
    deriveSeoTexts({ nombre: "X", categoria: "Ecommerce" }),
    { tituloSeo: "X — Ecommerce", descripcionSeo: "X: ecommerce publicado como demo del portfolio." }
  );
});

test("safe HTML extraction strips tags and collapses whitespace", () => {
  assert.equal(extractTitle("<title>  A &amp; B <span>x</span> </title>"), "A & B x");
  assert.equal(extractMetaDescription('<meta content="c1" name="description">'), "c1");
  assert.equal(extractMetaDescription("<p>nope</p>"), null);
  assert.equal(extractTitle("no html"), null);
});

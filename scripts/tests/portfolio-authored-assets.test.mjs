// Offline node:test suite for scripts/lib/portfolio-authored-assets.mjs: registry
// loading, fail-closed validation, identity matching and decoration precedence.
// No network, no browser. Temporary files are written under os.tmpdir().

import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  AUTHORED_ASSETS_PATH,
  applyAuthoredAssets,
  findAuthoredAsset,
  loadAuthoredAssets,
} from "../lib/portfolio-authored-assets.mjs";

// Writes a registry to a scratch file and returns its path, so validation tests
// exercise the real file-reading path instead of a stubbed one.
function scratchRegistry(contents) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-authored-"));
  const filePath = path.join(dir, "portfolio-authored-assets.json");
  fs.writeFileSync(filePath, typeof contents === "string" ? contents : JSON.stringify(contents));
  return filePath;
}

const butacasAsset = {
  id: "butacas-libres",
  github: { owner: "enderdev01", repo: "butacas-libres" },
  seo: { categoria: "Herramienta de datos", desafio: "Desafío de autoría.", enfoque: "Enfoque de autoría." },
  thumbnail: { authored: true },
};

// Shaped like a source emitted by discoverPortfolio: derived narrative, derived
// category and the deterministic gradient.
const discoveredSource = {
  id: "butacas-libres",
  projectId: 1315746384,
  clientApproved: true,
  productionUrl: "https://github.com/enderdev01/butacas-libres",
  expectedOrigin: "https://github.com",
  github: { owner: "enderdev01", repo: "butacas-libres" },
  stack: ["JavaScript", "Node.js"],
  thumbnail: { gradient: ["#0B1224", "#132A5E", "#0E7490"] },
  card: { nombre: "Butacas Libres", descripcion: "Del repositorio." },
  seo: {
    slug: "butacas-libres",
    categoria: "Proyecto web",
    tituloSeo: "Butacas Libres — Proyecto web",
    descripcionSeo: "Del repositorio.",
    desafio: "El punto de partida de Butacas Libres es el de todo Proyecto web.",
    enfoque: "El sitio de Butacas Libres se construyó con JavaScript, Node.js.",
  },
};

// --- Loading and committed registry --------------------------------------------------

test("the committed authored-asset registry loads and is valid", () => {
  assert.ok(fs.existsSync(AUTHORED_ASSETS_PATH), "registry is committed");
  assert.ok(Array.isArray(loadAuthoredAssets()));
});

test("a missing registry file is an empty registry", () => {
  const missing = path.join(os.tmpdir(), "portfolio-authored-does-not-exist.json");
  assert.deepEqual(loadAuthoredAssets({ filePath: missing }), []);
});

test("a valid registry loads its assets in file order", () => {
  const filePath = scratchRegistry({
    schemaVersion: 1,
    assets: [butacasAsset, { id: "otro-proyecto", card: { nombre: "Otro" } }],
  });
  const assets = loadAuthoredAssets({ filePath });
  assert.deepEqual(
    assets.map((asset) => asset.id),
    ["butacas-libres", "otro-proyecto"]
  );
});

// --- Fail-closed validation ----------------------------------------------------------

const invalidRegistries = {
  "invalid JSON": "{ not json",
  "not an object": "[]",
  "assets is not an array": { assets: {} },
  "asset is not an object": { assets: ["x"] },
  "id missing": { assets: [{ card: { nombre: "X" } }] },
  "id not kebab-case": { assets: [{ id: "Butacas_Libres" }] },
  "unknown asset key": { assets: [{ id: "x", desafio: "Puesto en el nivel equivocado." }] },
  "github missing repo": { assets: [{ id: "x", github: { owner: "a" } }] },
  "empty card field": { assets: [{ id: "x", card: { nombre: "   " } }] },
  "unknown card key": { assets: [{ id: "x", card: { titulo: "X" } }] },
  "slug is not authorable": { assets: [{ id: "x", seo: { slug: "otro-slug" } }] },
  "unknown seo key": { assets: [{ id: "x", seo: { resumen: "X" } }] },
  "empty seo field": { assets: [{ id: "x", seo: { desafio: "" } }] },
  "thumbnail without authored true": { assets: [{ id: "x", thumbnail: { gradient: ["#000"] } }] },
  "thumbnail authored false": { assets: [{ id: "x", thumbnail: { authored: false } }] },
  "duplicate id": { assets: [{ id: "x" }, { id: "x" }] },
  "duplicate repository": {
    assets: [
      { id: "x", github: { owner: "a", repo: "b" } },
      { id: "y", github: { owner: "A", repo: "B" } },
    ],
  },
};

for (const [label, contents] of Object.entries(invalidRegistries)) {
  test(`loadAuthoredAssets aborts on ${label}`, () => {
    assert.throws(() => loadAuthoredAssets({ filePath: scratchRegistry(contents) }));
  });
}

// --- Identity matching ---------------------------------------------------------------

test("findAuthoredAsset matches by source id", () => {
  const asset = findAuthoredAsset({ assets: [butacasAsset], source: { id: "butacas-libres" } });
  assert.equal(asset?.id, "butacas-libres");
});

test("findAuthoredAsset matches by GitHub identity, case-insensitively", () => {
  const asset = findAuthoredAsset({
    assets: [butacasAsset],
    source: { id: "renamed-slug", github: { owner: "EnderDev01", repo: "Butacas-Libres" } },
  });
  assert.equal(asset?.id, "butacas-libres");
});

test("findAuthoredAsset prefers the id match over a repository match", () => {
  const other = { id: "butacas-libres", seo: { categoria: "Por id" } };
  const asset = findAuthoredAsset({
    assets: [{ ...butacasAsset, id: "por-repo" }, other],
    source: { id: "butacas-libres", github: { owner: "enderdev01", repo: "butacas-libres" } },
  });
  assert.equal(asset?.seo.categoria, "Por id");
});

test("findAuthoredAsset returns null when nothing matches", () => {
  assert.equal(findAuthoredAsset({ assets: [butacasAsset], source: { id: "haku" } }), null);
  assert.equal(findAuthoredAsset({ assets: [], source: { id: "butacas-libres" } }), null);
});

// --- Decoration and precedence -------------------------------------------------------

test("applyAuthoredAssets overrides the derived copy and keeps the untouched fields", () => {
  const [source] = applyAuthoredAssets({ sources: [discoveredSource], assets: [butacasAsset] });
  assert.equal(source.seo.desafio, "Desafío de autoría.");
  assert.equal(source.seo.enfoque, "Enfoque de autoría.");
  assert.equal(source.seo.categoria, "Herramienta de datos");
  assert.equal(source.seo.slug, "butacas-libres", "the slug stays owned by the source");
  assert.equal(source.seo.tituloSeo, "Butacas Libres — Proyecto web");
  assert.deepEqual(source.card, discoveredSource.card);
  assert.deepEqual(source.stack, discoveredSource.stack);
  assert.equal(source.thumbnail.authored, true);
  assert.deepEqual(source.thumbnail.gradient, ["#0B1224", "#132A5E", "#0E7490"]);
});

test("applyAuthoredAssets never mutates the input source", () => {
  applyAuthoredAssets({ sources: [discoveredSource], assets: [butacasAsset] });
  assert.equal(discoveredSource.seo.desafio, "El punto de partida de Butacas Libres es el de todo Proyecto web.");
  assert.equal(discoveredSource.thumbnail.authored, undefined);
});

test("applyAuthoredAssets keeps the source reference when no asset matches", () => {
  const [source] = applyAuthoredAssets({ sources: [discoveredSource], assets: [] });
  assert.equal(source, discoveredSource, "object identity is how published discovered sources are tracked");
});

test("applyAuthoredAssets decorates only the matching source", () => {
  const other = { ...discoveredSource, id: "otro", github: { owner: "enderdev01", repo: "otro" } };
  const sources = applyAuthoredAssets({
    sources: [discoveredSource, other],
    assets: [butacasAsset],
  });
  assert.equal(sources.length, 2);
  assert.equal(sources[0].seo.categoria, "Herramienta de datos");
  assert.equal(sources[1], other);
});

test("applyAuthoredAssets aborts when an asset matches no source", () => {
  assert.throws(
    () => applyAuthoredAssets({ sources: [discoveredSource], assets: [butacasAsset, { id: "fantasma" }] }),
    /matches no portfolio source/
  );
});

test("applyAuthoredAssets aborts when an asset targets a manual registry entry", () => {
  const manualSource = { ...discoveredSource, id: "butacas-libres" };
  assert.throws(
    () =>
      applyAuthoredAssets({
        sources: [manualSource],
        manualSources: [manualSource],
        assets: [butacasAsset],
      }),
    /targets a manual registry entry/
  );
});

test("applyAuthoredAssets accepts a card-only asset", () => {
  const [source] = applyAuthoredAssets({
    sources: [discoveredSource],
    assets: [{ id: "butacas-libres", card: { nombre: "Butacas Libres", descripcion: "De autoría." } }],
  });
  assert.equal(source.card.descripcion, "De autoría.");
  assert.equal(source.seo.categoria, "Proyecto web", "the derived copy is untouched");
  assert.equal(source.thumbnail.authored, undefined);
});

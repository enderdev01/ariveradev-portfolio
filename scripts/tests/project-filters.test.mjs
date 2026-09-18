// Offline node:test suite for the project-grid category mapping
// (src/lib/projectFilters.mjs).
//
// The defect this guards against is silent: a rendered categoria with no mapping
// entry used to fall into an "otros" bucket that is not a filter value, so those
// projects disappeared from every category and only survived under "Todos".
//
// The mapping module is plain ESM with no imports, so Node can load it directly.
// The catalog data modules cannot be loaded here: src/data/onilabs.js imports JSON
// without an import attribute. The curated categories are therefore read as text,
// the same way the sync-seam tests assert wiring.

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  CATEGORIAS,
  FILTRO_POR_CATEGORIA,
  coincideConFiltro,
  filtroDeProyecto,
} from "../../src/lib/projectFilters.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "..", "..");

// Every categoria the catalog can render: the generated entries plus the
// hand-curated narratives in src/data/proyectos-seo.js.
function renderedCategorias() {
  const categorias = new Set();

  const generated = JSON.parse(
    readFileSync(path.join(repoRoot, "src", "data", "portfolio.generated.json"), "utf8")
  );
  for (const project of generated.projects) {
    if (project.seo?.categoria) categorias.add(project.seo.categoria);
  }

  const curated = readFileSync(path.join(repoRoot, "src", "data", "proyectos-seo.js"), "utf8");
  for (const [, value] of curated.matchAll(/^\s*categoria:\s*"([^"]+)"/gm)) {
    categorias.add(value);
  }
  return categorias;
}

const VALORES_DE_CHIP = CATEGORIAS.map(({ value }) => value);

// A catalog category that reaches the given chip, used to prove reachability.
const categoriaQueLlegaA = (filtro) =>
  Object.keys(FILTRO_POR_CATEGORIA).find((categoria) => FILTRO_POR_CATEGORIA[categoria] === filtro);

test("every rendered category maps to a real filter value", () => {
  const categorias = renderedCategorias();
  assert.ok(categorias.size > 5, `read the catalog categories (found ${categorias.size})`);
  for (const categoria of categorias) {
    const filtro = FILTRO_POR_CATEGORIA[categoria];
    assert.ok(filtro, `"${categoria}" has no filter mapping`);
    assert.ok(VALORES_DE_CHIP.includes(filtro), `"${categoria}" maps to unknown filter "${filtro}"`);
  }
});

test("every filter mapping target is a real chip", () => {
  for (const filtro of Object.values(FILTRO_POR_CATEGORIA)) {
    assert.ok(VALORES_DE_CHIP.includes(filtro), `"${filtro}" is not a chip`);
  }
});

test("every chip can actually match a project", () => {
  for (const valor of VALORES_DE_CHIP) {
    if (valor === "all") {
      assert.equal(coincideConFiltro({ activa: valor }), true, "Todos matches everything");
      continue;
    }
    if (valor === "proximamente") {
      assert.equal(
        coincideConFiltro({ proyecto: { estado: "proximamente" }, activa: valor }),
        true,
        "Proximamente is reached by the estado, not by a category"
      );
      continue;
    }
    const categoria = categoriaQueLlegaA(valor);
    assert.ok(categoria, `chip "${valor}" is unreachable: no category maps to it`);
    assert.equal(
      coincideConFiltro({ proyecto: {}, seo: { categoria }, activa: valor }),
      true,
      `chip "${valor}" is reached by categoria "${categoria}"`
    );
  }
});

test('the classifier fallback is reachable instead of invisible', () => {
  // regression: "Proyecto web" is the fallback every unclassifiable discovered
  // project receives, so it must never resolve to a bucket that is not a chip.
  assert.equal(filtroDeProyecto({ categoria: "Proyecto web" }), "platform");
});

test("an unreleased project never appears under a category chip", () => {
  const proyecto = { estado: "proximamente" };
  for (const valor of VALORES_DE_CHIP) {
    const esperado = valor === "all" || valor === "proximamente";
    assert.equal(
      coincideConFiltro({ proyecto, seo: { categoria: "Ecommerce" }, activa: valor }),
      esperado,
      `"${valor}" ${esperado ? "shows" : "hides"} unreleased work`
    );
  }
});

test("a project without an SEO entry appears only under Todos", () => {
  assert.equal(filtroDeProyecto(null), null);
  assert.equal(filtroDeProyecto({}), null, "an entry without categoria has no filter");
  for (const valor of VALORES_DE_CHIP) {
    const esperado = valor === "all";
    assert.equal(coincideConFiltro({ proyecto: {}, seo: null, activa: valor }), esperado);
  }
});

test("the Todos chip is the only chip without a filter assignment", () => {
  assert.deepEqual(
    CATEGORIAS.filter(({ value }) => value === "all").map(({ label }) => label),
    ["Todos"]
  );
});

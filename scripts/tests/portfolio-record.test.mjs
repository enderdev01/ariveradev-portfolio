// Offline node:test suite for scripts/lib/portfolio-record.mjs: allowed-origin
// validation for GitHub metadata and production HTML fetches, deterministic
// public-record building and record privacy (no GitHub identity). No network,
// no writes.

import test from "node:test";
import assert from "node:assert/strict";
import {
  buildRecord,
  fetchProductionHtml,
  fetchRepoMetadata,
} from "../lib/portfolio-record.mjs";

// Shaped exactly like the committed manual registry entry.
const manualSource = {
  id: "hakui-medical",
  projectId: 19,
  clientApproved: true,
  productionUrl: "https://hakui-medical.vercel.app",
  expectedOrigin: "https://hakui-medical.vercel.app",
  github: { owner: "enderdev01", repo: "hakui-medical" },
  stack: ["Astro", "React", "Sass", "Vitest"],
  thumbnail: { gradient: ["#0B1224", "#132A5E", "#0E7490"] },
  card: {
    nombre: "Hakui Medical",
    descripcion: "Demo comercial de una clínica ambulatoria ficticia.",
  },
  seo: { slug: "hakui-medical", categoria: "Landing de producto" },
};

// Shaped exactly like a source emitted by discoverPortfolio: derived narrative,
// deployed SEO texts and Vercel alias allowedOrigins included.
const discoveredSource = {
  id: "clinica-nova",
  projectId: 9012345,
  clientApproved: true,
  productionUrl: "https://clinica-nova.example.com",
  expectedOrigin: "https://clinica-nova.example.com",
  allowedOrigins: [
    "https://clinica-nova-f00x.vercel.app",
    "https://clinica-nova.example.com",
    "https://clinica-nova.vercel.app",
  ],
  github: { owner: "onilabs", repo: "clinica-nova" },
  stack: ["JavaScript", "React", "Tailwind CSS", "Next.js"],
  thumbnail: { gradient: ["#0F172A", "#1E3A8A", "#0EA5E9"] },
  card: {
    nombre: "Clínica Nova",
    descripcion: "Demo de una clínica digital con agendamiento de turnos.",
  },
  seo: {
    slug: "clinica-nova",
    categoria: "Proyecto web",
    tituloSeo: "Clínica Nova — salud digital con agendamiento",
    descripcionSeo: "Agendamiento de turnos online para clínicas.",
    desafio:
      "Una clínica digital como Clínica Nova tiene que explicar en segundos qué servicios ofrece y cómo agendar, sin que la primera pantalla prometa más de lo que el sitio muestra.",
    enfoque:
      "El sitio de Clínica Nova se construyó con JavaScript, React, Tailwind CSS y Next.js, centrado en una jerarquía de información clara y un recorrido de uso sin pasos de más.",
  },
};

function fakeFetch(finalUrl, jsonBody = {}) {
  return async () => ({
    ok: true,
    status: 200,
    url: finalUrl,
    headers: { get: () => null },
    json: async () => jsonBody,
    text: async () => "<title>T</title><meta name=\"description\" content=\"d\">",
  });
}

// --- Production origin validation ---------------------------------------------------

test("production redirect validation accepts any allowedOrigins entry", async () => {
  // Alias origins derived from the Vercel deployment are accepted.
  const viaAlias = await fetchProductionHtml(
    discoveredSource,
    fakeFetch("https://clinica-nova-f00x.vercel.app")
  );
  assert.equal(viaAlias.title, "T");

  // The expected origin keeps working.
  await fetchProductionHtml(discoveredSource, fakeFetch("https://clinica-nova.example.com"));

  // A foreign origin still fails.
  await assert.rejects(
    fetchProductionHtml(discoveredSource, fakeFetch("https://otro.example.com")),
    /not one of the allowed production origins/
  );
});

test("manual sources without allowedOrigins keep the single strict origin validation", async () => {
  const ok = await fetchProductionHtml(manualSource, fakeFetch("https://hakui-medical.vercel.app"));
  assert.equal(ok.title, "T");
  await assert.rejects(
    fetchProductionHtml(manualSource, fakeFetch("https://hakui-medical-f00x.vercel.app")),
    /not one of the allowed production origins/
  );
});

// --- GitHub metadata validation -------------------------------------------------------

test("homepage validation accepts any allowedOrigins entry", async () => {
  const ok = await fetchRepoMetadata(
    discoveredSource,
    fakeFetch("https://clinica-nova.vercel.app", { homepage: "https://clinica-nova.vercel.app" })
  );
  assert.deepEqual(ok, { homepage: "https://clinica-nova.vercel.app" });

  await assert.rejects(
    fetchRepoMetadata(
      discoveredSource,
      fakeFetch("https://otro.example.com", { homepage: "https://otro.example.com" })
    ),
    /does not match the allowed production origins/
  );

  // Manual source: the strict expectedOrigin check still applies.
  const okManual = await fetchRepoMetadata(
    manualSource,
    fakeFetch("https://hakui-medical.vercel.app", { homepage: "https://hakui-medical.vercel.app" })
  );
  assert.ok(okManual.homepage);
  await assert.rejects(
    fetchRepoMetadata(
      manualSource,
      fakeFetch("https://clinica-nova-f00x.vercel.app", { homepage: "https://clinica-nova-f00x.vercel.app" })
    ),
    /does not match the allowed production origins/
  );
});

// --- Public record building -----------------------------------------------------------

test("buildRecord preserves discovered tituloSeo, descripcionSeo, desafio and enfoque", () => {
  const record = buildRecord(discoveredSource, null);
  assert.equal(record.id, discoveredSource.projectId);
  assert.equal(record.seo.tituloSeo, "Clínica Nova — salud digital con agendamiento");
  assert.equal(record.seo.descripcionSeo, "Agendamiento de turnos online para clínicas.");
  assert.equal(record.seo.desafio, discoveredSource.seo.desafio);
  assert.equal(record.seo.enfoque, discoveredSource.seo.enfoque);
  assert.doesNotMatch(`${record.seo.desafio} ${record.seo.enfoque}`, /[0-9%]/);
});

test("buildRecord keeps freshly fetched deployed metadata as the safe fallback", () => {
  const record = buildRecord(discoveredSource, { title: "Título deployado", description: "Descripción deployada" });
  assert.equal(record.seo.tituloSeo, "Título deployado");
  assert.equal(record.seo.descripcionSeo, "Descripción deployada");
  // Discovered narrative still survives a successful fresh fetch.
  assert.equal(record.seo.desafio, discoveredSource.seo.desafio);
  assert.equal(record.seo.enfoque, discoveredSource.seo.enfoque);
});

test("manual records omit desafio/enfoque so the hand-authored Hakui narrative keeps winning", () => {
  const record = buildRecord(manualSource, { title: "Hakui Medical", description: "desc" });
  assert.equal("desafio" in record.seo, false);
  assert.equal("enfoque" in record.seo, false);

  // Simulates the existing proyectos-seo.js merge: generated seo spreads over
  // the hand-authored base entry, which keeps desafio/enfoque because the
  // generated record never provides them for manual sources.
  const baseEntry = {
    slug: "hakui-medical",
    categoria: "Landing de producto",
    desafio: "Narrativa editorial manual.",
    enfoque: "Enfoque editorial manual.",
  };
  const mergedSeo = { ...baseEntry, ...record.seo };
  assert.equal(mergedSeo.desafio, "Narrativa editorial manual.");
  assert.equal(mergedSeo.enfoque, "Enfoque editorial manual.");
  assert.equal(mergedSeo.tituloSeo, "Hakui Medical");
});

// --- Privacy: no GitHub identity in generated records -----------------------------------

test("generated records never carry GitHub identity", () => {
  for (const source of [manualSource, discoveredSource]) {
    const record = buildRecord(source, { title: "T", description: "d" });
    assert.equal("github" in record, false);
    const serialized = JSON.stringify(record);
    assert.doesNotMatch(serialized, /github|owner|repo/i);
    assert.ok(!serialized.includes("onilabs"));
    assert.ok(!serialized.includes("enderdev01"));
  }
});

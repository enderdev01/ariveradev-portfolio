// Offline node:test suite for scripts/lib/portfolio-deployed-meta.mjs:
// deployed public-HTML metadata fetching/validation and the fail-closed
// published-skip guard. Run-level production-HTML aborts and the remaining
// discovery abort semantics are covered in portfolio-discovery-aborts.test.mjs.
// Every failure path must abort without exposing tokens or repository identity.

import test from "node:test";
import assert from "node:assert/strict";
import {
  assertNoPublishedProjectSkipped,
  deriveCardTitle,
  fetchDeployedMeta,
} from "../lib/portfolio-deployed-meta.mjs";
import { DiscoveryError } from "../lib/github-discovery.mjs";
import { makeRouter } from "./fixtures/discovery-router.mjs";

// --- Deployed HTML metadata ------------------------------------------------------

test("fetchDeployedMeta aborts on non-OK and origin mismatch", async () => {
  const router = makeRouter({
    htmlOverrides: {
      "https://mismatch.example.com": { body: "<title>T</title>", finalUrl: "https://otro.example.com/" },
    },
  });
  const okMeta = await fetchDeployedMeta({
    fetchImpl: router.fetchImpl,
    productionUrl: "https://clinica-nova.example.com",
    expectedOrigin: "https://clinica-nova.example.com",
  });
  assert.equal(okMeta.title, "Clínica Nova — salud digital con agendamiento");
  assert.equal(okMeta.description, "Agendamiento de turnos online para clínicas.");
  assert.ok(typeof okMeta.html === "string");

  // Non-OK response aborts (matched READY deployment must not be dropped).
  await assert.rejects(
    fetchDeployedMeta({
      fetchImpl: router.fetchImpl,
      productionUrl: "https://missing.example.com",
      expectedOrigin: "https://missing.example.com",
    }),
    (error) => error instanceof DiscoveryError && /HTTP 404/.test(error.message)
  );

  // Redirect to a different origin aborts.
  await assert.rejects(
    fetchDeployedMeta({
      fetchImpl: router.fetchImpl,
      productionUrl: "https://mismatch.example.com",
      expectedOrigin: "https://mismatch.example.com",
    }),
    (error) => error instanceof DiscoveryError && /redirect landed on/.test(error.message)
  );
});

test("fetchDeployedMeta follows a redirect that stays inside the project's own origins", async () => {
  const router = makeRouter({
    htmlOverrides: {
      "https://versus.example.com": {
        body: "<title>Versus — compará candidatos</title>",
        finalUrl: "https://www.versus.example.com/",
      },
    },
  });

  // An apex host that 307s to its www form is normal. Both origins belong to the
  // project, so the deployed metadata must be accepted instead of skipped.
  const meta = await fetchDeployedMeta({
    fetchImpl: router.fetchImpl,
    productionUrl: "https://versus.example.com",
    expectedOrigin: "https://versus.example.com",
    allowedOrigins: ["https://versus.example.com", "https://www.versus.example.com"],
  });
  assert.match(meta.title, /Versus/);

  // The same redirect with only an unrelated origin allowed still aborts: the
  // relaxation is limited to the project's own production origins.
  await assert.rejects(
    fetchDeployedMeta({
      fetchImpl: router.fetchImpl,
      productionUrl: "https://versus.example.com",
      expectedOrigin: "https://versus.example.com",
      allowedOrigins: ["https://otro.example.com"],
    }),
    (error) => error instanceof DiscoveryError && /redirect landed on/.test(error.message)
  );
});

test("fetchDeployedMeta honors htmlFetchImpl injection", async () => {  const meta = await fetchDeployedMeta({
    htmlFetchImpl: async (url) => ({ title: "Injected", description: "d", html: "" }),
    productionUrl: "https://cualquiera.example.com",
    expectedOrigin: "https://cualquiera.example.com",
  });
  assert.equal(meta.title, "Injected");
});

// --- Published-project protection (fail-closed on skipped published projects) -------

// Skip records shaped exactly as discoverPortfolio emits them: projectId + reason.
const skip = (projectId, reason) => ({ projectId, reason });

test("a skipped projectId already published in the committed JSON aborts fail-closed", () => {
  assert.throws(
    () =>
      assertNoPublishedProjectSkipped({
        skipped: [skip(19, "vercel-production-not-ready")],
        committedProjectIds: [19, 9012345],
      }),
    (error) =>
      /Discovery skipped projectId 19 \(vercel-production-not-ready\).*aborting before any write/.test(
        error.message
      )
  );
});

test("every transient skip reason aborts when the projectId is published", () => {
  const committedProjectIds = [19];
  for (const reason of [
    "vercel-project-not-found",
    "vercel-no-production-deployment",
    "vercel-production-not-ready",
    "vercel-production-url-unavailable",
  ]) {
    assert.throws(
      () => assertNoPublishedProjectSkipped({ skipped: [skip(19, reason)], committedProjectIds }),
      new RegExp(`\\(${reason}\\)`)
    );
  }
});

test("a newly tagged, never-published projectId may still skip until READY", () => {
  // Not in the committed generated JSON: no abort, discovery proceeds.
  assert.doesNotThrow(() =>
    assertNoPublishedProjectSkipped({
      skipped: [skip(9019999, "vercel-production-not-ready")],
      committedProjectIds: [19, 9012345],
    })
  );
  // Empty committed list (first run): every skip is allowed.
  assert.doesNotThrow(() =>
    assertNoPublishedProjectSkipped({ skipped: [skip(19, "vercel-no-production-deployment")], committedProjectIds: [] })
  );
});

test("multiple skip reasons abort on the first published match and stay identity-safe", () => {
  const skipped = [
    skip(9019999, "vercel-production-not-ready"),
    skip(19, "vercel-project-not-found"),
    skip(9020000, "vercel-no-production-deployment"),
  ];
  // Skip records carry no repository identity.
  assert.ok(skipped.every((entry) => Object.keys(entry).length === 2 && "projectId" in entry && "reason" in entry));
  assert.ok(skipped.every((entry) => Number.isInteger(entry.projectId) && /^[a-z-]+$/.test(entry.reason)));

  try {
    assertNoPublishedProjectSkipped({ skipped, committedProjectIds: [19] });
    assert.fail("expected published-project abort");
  } catch (error) {
    assert.match(error.message, /projectId 19 \(vercel-project-not-found\)/);
    // Identity-safe abort message: no owner/repo/full-name data.
    assert.doesNotMatch(error.message, /onilabs|labouno|owner|repo\//i);
  }
});

// --- Card title derivation -----------------------------------------------------------

test("deriveCardTitle splits on common separators", () => {
  assert.equal(deriveCardTitle("Clínica Nova — salud digital"), "Clínica Nova");
  assert.equal(deriveCardTitle("Reportes | Panel"), "Reportes");
  assert.equal(deriveCardTitle("A – B"), "A");
  assert.equal(deriveCardTitle("A - B"), "A");
  assert.equal(deriveCardTitle("A :: B"), "A");
  assert.equal(deriveCardTitle("Solo"), "Solo");
  assert.equal(deriveCardTitle(""), null);
});

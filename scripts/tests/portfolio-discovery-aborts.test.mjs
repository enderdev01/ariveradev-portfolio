// Offline node:test suite for discovery abort semantics at the run level:
// production-HTML failures flowing through discoverPortfolio, API/shape
// failures and slug collision aborts. Every failure path must abort without
// exposing tokens or repository identity. The deployed-HTML unit contract and
// the published-skip guard are covered in portfolio-deployed-meta.test.mjs.

import test from "node:test";
import assert from "node:assert/strict";
import { assignSlug, discoverPortfolio } from "../lib/portfolio-discovery.mjs";
import { DiscoveryError } from "../lib/github-discovery.mjs";
import { fixture, makeRouter } from "./fixtures/discovery-router.mjs";

function runDiscovery(routerOptions = {}) {
  const router = makeRouter(routerOptions);
  const result = discoverPortfolio({
    githubToken: fixture.githubToken,
    vercelToken: fixture.vercelToken,
    vercelTeamId: fixture.vercelTeamId,
    fetchImpl: router.fetchImpl,
  });
  return { router, result };
}

// --- Production HTML failures (run level) -----------------------------------------

test("production HTML 5xx, network error and missing title abort the run", async () => {
  await assert.rejects(
    runDiscovery({
      htmlOverrides: { "https://clinica-nova.example.com": { body: "", status: 500, ok: false } },
    }).result,
    (error) => error instanceof DiscoveryError && /HTTP 500/.test(error.message)
  );
  await assert.rejects(
    runDiscovery({
      htmlThrowOnUrls: ["https://clinica-nova.example.com"],
    }).result,
    (error) => error instanceof DiscoveryError && /Production HTML fetch failed/.test(error.message)
  );
  await assert.rejects(
    runDiscovery({
      htmlOverrides: { "https://clinica-nova.example.com": { body: "<html><body></body></html>" } },
    }).result,
    (error) => error instanceof DiscoveryError && /no <title>/.test(error.message)
  );
});

// --- API & shape failures -----------------------------------------------------------

test("GitHub HTTP failure aborts discovery without exposing the token", async () => {
  await assert.rejects(
    runDiscovery({ githubStatus: 401 }).result,
    (error) => error instanceof DiscoveryError && !error.message.includes(fixture.githubToken)
  );
});

test("Vercel HTTP failure aborts discovery without exposing the token", async () => {
  await assert.rejects(
    runDiscovery({ vercelStatus: 403 }).result,
    (error) => error instanceof DiscoveryError && !error.message.includes(fixture.vercelToken)
  );
});

test("invalid GitHub response shape aborts discovery", async () => {
  await assert.rejects(runDiscovery({ githubBody: { not: "an array" } }).result, DiscoveryError);
});

test("invalid Vercel response shape aborts discovery", async () => {
  await assert.rejects(runDiscovery({ vercelBody: { projects: "nope" } }).result, DiscoveryError);
});

test("unresolvable slug collision aborts discovery", () => {
  // Two different owners with identical name and identical owner kebab is
  // impossible, so force the abort path with a colliding derived slug.
  const used = new Set(["clinica-nova", "clinica-nova-labouno"]);
  try {
    assignSlug({ name: "clinica-nova", fullName: "labouno/clinica-nova", owner: "labouno" }, used);
    assert.fail("expected collision abort");
  } catch (error) {
    assert.ok(error instanceof DiscoveryError);
    // Regression: abort messages stay identity-safe (no repo full name).
    assert.doesNotMatch(error.message, /labouno\/clinica-nova/);
    assert.match(error.message, /repository id/);
  }
});

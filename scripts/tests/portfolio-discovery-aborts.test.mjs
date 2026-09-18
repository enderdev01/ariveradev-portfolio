// Offline node:test suite for discovery abort semantics at the run level:
// deployment-level failures flowing through discoverPortfolio (which must skip,
// not abort), API/shape failures and slug collision aborts (which must abort
// without exposing tokens or repository identity), and the published-skip guard
// that still protects an already published project. The deployed-HTML unit
// contract and the guard itself are covered in portfolio-deployed-meta.test.mjs.

import test from "node:test";
import assert from "node:assert/strict";
import { assignSlug, discoverPortfolio } from "../lib/portfolio-discovery.mjs";
import { DiscoveryError } from "../lib/github-discovery.mjs";
import { assertNoPublishedProjectSkipped } from "../lib/portfolio-deployed-meta.mjs";
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

// --- Production HTML failures (run level): skip, never drop the whole run -------

const UNAVAILABLE_URL = "https://clinica-nova.example.com";
// onilabs/clinica-nova (repo id 101) resolves to this custom-domain production URL.
const UNAVAILABLE_PROJECT_ID = 101;

function skippedUnavailable(discovery) {
  return discovery.skipped.some(
    (entry) => entry.projectId === UNAVAILABLE_PROJECT_ID && entry.reason === "deployed-html-unavailable"
  );
}

test("production HTML 5xx, network error and missing title skip instead of aborting the run", async () => {
  const cases = [
    { htmlOverrides: { [UNAVAILABLE_URL]: { body: "", status: 500, ok: false } } },
    { htmlThrowOnUrls: [UNAVAILABLE_URL] },
    { htmlOverrides: { [UNAVAILABLE_URL]: { body: "<html><body></body></html>" } } },
  ];
  for (const options of cases) {
    const { result } = runDiscovery(options);
    const discovery = await result;
    assert.equal(skippedUnavailable(discovery), true, `expected a skip for ${JSON.stringify(options)}`);
    assert.equal(
      discovery.sources.some((source) => source.projectId === UNAVAILABLE_PROJECT_ID),
      false,
      "an unreadable production page must not produce a source"
    );
    assert.equal(discovery.sources.length > 0, true, "the remaining repositories must still resolve");
  }
});

test("an unreadable production page for a published projectId still aborts fail-closed", async () => {
  const { result } = runDiscovery({
    htmlOverrides: { [UNAVAILABLE_URL]: { body: "", status: 500, ok: false } },
  });
  const discovery = await result;
  assert.equal(skippedUnavailable(discovery), true);
  assert.throws(
    () =>
      assertNoPublishedProjectSkipped({
        skipped: discovery.skipped,
        committedProjectIds: [UNAVAILABLE_PROJECT_ID],
      }),
    /already published in the committed generated JSON/
  );
});

test("an unreadable production page for an unpublished projectId does not abort", async () => {
  const { result } = runDiscovery({
    htmlOverrides: { [UNAVAILABLE_URL]: { body: "", status: 500, ok: false } },
  });
  const discovery = await result;
  assert.doesNotThrow(() =>
    assertNoPublishedProjectSkipped({ skipped: discovery.skipped, committedProjectIds: [19] })
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

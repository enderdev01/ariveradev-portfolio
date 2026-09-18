// Offline node:test suite for scripts/lib/vercel-projects.mjs: paginated
// project listing, deterministic ordering and the shared Vercel HTTP request
// contract. Every network boundary is faked from the offline API doubles in
// fixtures/discovery-*.mjs. Project normalization and repository matching are
// covered in vercel-project-match.test.mjs.

import test from "node:test";
import assert from "node:assert/strict";
import { DiscoveryError } from "../lib/github-discovery.mjs";
import { listVercelProjects } from "../lib/vercel-projects.mjs";
import { fixture, makeRouter } from "./fixtures/discovery-router.mjs";

// --- Listing -------------------------------------------------------------------

test("Vercel project listing paginates through until cursors", async () => {
  const router = makeRouter();
  const projects = await listVercelProjects({ fetchImpl: router.fetchImpl, token: fixture.vercelToken });
  const pageCalls = router.calls.filter((call) => call.url.pathname === "/v9/projects");
  assert.deepEqual(pageCalls.map((call) => call.url.searchParams.get("until")), [null, "2"]);
  assert.equal(projects.length, 7);
});

test("Vercel teamId is passed when provided", async () => {
  const router = makeRouter();
  await listVercelProjects({ fetchImpl: router.fetchImpl, token: fixture.vercelToken, teamId: "team_x" });
  const call = router.calls.find((c) => c.url.pathname === "/v9/projects");
  assert.equal(call.url.searchParams.get("teamId"), "team_x");
});

test("Vercel project listing sorts projects deterministically by id", async () => {
  const router = makeRouter();
  const projects = await listVercelProjects({ fetchImpl: router.fetchImpl, token: fixture.vercelToken });
  const sortedIds = projects.map((project) => project.id);
  assert.deepEqual(sortedIds, [...sortedIds].sort());
});

test("Vercel HTTP failure aborts listing without exposing the token", async () => {
  await assert.rejects(
    listVercelProjects({
      fetchImpl: makeRouter({ vercelStatus: 403 }).fetchImpl,
      token: fixture.vercelToken,
    }),
    (error) => error instanceof DiscoveryError && !error.message.includes(fixture.vercelToken)
  );
});

test("invalid Vercel response shape aborts listing", async () => {
  await assert.rejects(
    listVercelProjects({
      fetchImpl: makeRouter({ vercelBody: { projects: "nope" } }).fetchImpl,
      token: fixture.vercelToken,
    }),
    DiscoveryError
  );
});

test("Vercel pagination bounds abort instead of truncating", async () => {
  await assert.rejects(
    listVercelProjects({
      fetchImpl: makeRouter({ unboundedVercel: true }).fetchImpl,
      token: fixture.vercelToken,
      maxPages: 3,
    }),
    /exceeded the pagination bound/
  );
});

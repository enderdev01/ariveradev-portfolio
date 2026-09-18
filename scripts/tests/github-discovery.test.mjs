// Offline node:test suite for scripts/lib/github-discovery.mjs: pagination,
// topic filtering, normalization, abort semantics and input validation. Every
// network boundary is faked from the offline API doubles in
// fixtures/discovery-*.mjs.

import test from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_PORTFOLIO_TOPIC,
  listPortfolioRepositories,
} from "../lib/github-discovery.mjs";
import { fixture, makeRouter } from "./fixtures/discovery-router.mjs";

// --- Listing, filtering and normalization -------------------------------------

test("GitHub listing merges pages, filters topics, archived and disabled repos", async () => {
  const repos = await listPortfolioRepositories({
    fetchImpl: makeRouter().fetchImpl,
    token: fixture.githubToken,
  });
  // 103 (archived), 104 (disabled) and 105 (no portfolio topic) are excluded;
  // the rest of both pages is merged and sorted by id.
  assert.deepEqual(repos.map((repo) => repo.id), [101, 102, 107, 201, 202, 204]);
  const clinica = repos.find((repo) => repo.id === 101);
  assert.equal(clinica.owner, "onilabs");
  assert.deepEqual(clinica.topics, ["onilabs-portfolio", "react", "tailwind"], "topics normalized sorted");
});

test("GitHub listing honors a custom topic", async () => {
  const repos = await listPortfolioRepositories({
    fetchImpl: makeRouter().fetchImpl,
    token: fixture.githubToken,
    topic: "web",
  });
  assert.deepEqual(repos.map((repo) => repo.id), [105]);
});

test("archived and disabled repositories are excluded", async () => {
  const repos = await listPortfolioRepositories({
    fetchImpl: makeRouter().fetchImpl,
    token: fixture.githubToken,
  });
  const ids = repos.map((repo) => repo.id);
  assert.equal(ids.includes(103), false, "archived excluded");
  assert.equal(ids.includes(104), false, "disabled excluded");
});

// --- Abort semantics -----------------------------------------------------------

test("GitHub HTTP failure aborts listing without exposing the token", async () => {
  await assert.rejects(
    listPortfolioRepositories({
      fetchImpl: makeRouter({ githubStatus: 401 }).fetchImpl,
      token: fixture.githubToken,
    }),
    (error) => error.name === "DiscoveryError" && !error.message.includes(fixture.githubToken)
  );
});

test("GitHub malformed repository entries abort", async () => {
  const badRepo = { id: 999, name: "ok", owner: {}, topics: ["onilabs-portfolio"] };
  await assert.rejects(
    listPortfolioRepositories({
      fetchImpl: makeRouter({ githubBody: [badRepo] }).fetchImpl,
      token: fixture.githubToken,
    }),
    /unexpected repository shape/
  );
});

test("GitHub pagination bounds abort instead of truncating", async () => {
  await assert.rejects(
    listPortfolioRepositories({
      fetchImpl: makeRouter().fetchImpl,
      token: fixture.githubToken,
      maxPages: 1,
    }),
    /exceeded the pagination bound/
  );
});

// --- Injectable inputs ----------------------------------------------------------

test("missing token or fetchImpl aborts GitHub listing", async () => {
  await assert.rejects(
    listPortfolioRepositories({ fetchImpl: makeRouter().fetchImpl, token: "" }),
    /requires a GitHub token/
  );
  await assert.rejects(
    listPortfolioRepositories({ token: fixture.githubToken }),
    /requires an injectable fetchImpl/
  );
});

test("DEFAULT_PORTFOLIO_TOPIC matches the configured portfolio topic", () => {
  assert.equal(DEFAULT_PORTFOLIO_TOPIC, "onilabs-portfolio");
});

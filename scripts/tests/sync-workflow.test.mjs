// Offline node:test suite for the discovery tokens' confinement in the sync
// workflow (.github/workflows/sync-portfolio.yml): discovery credentials reach
// only the sync step, the PR step keeps the least-privileged workflow token,
// and there is no implicit github.token fallback for the discovery token.

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));

test("workflow passes discovery tokens only to the sync step", () => {
  const workflow = readFileSync(
    path.join(here, "..", "..", ".github", "workflows", "sync-portfolio.yml"),
    "utf8"
  );
  const prStepIndex = workflow.indexOf("Open or update portfolio sync PR");
  assert.ok(prStepIndex > 0, "PR step is present");
  const syncStep = workflow.slice(0, prStepIndex);
  const prStep = workflow.slice(prStepIndex);

  // Discovery credentials reach only the sync step.
  for (const name of ["VERCEL_TOKEN", "VERCEL_TEAM_ID", "PORTFOLIO_TOPIC", "PORTFOLIO_GITHUB_TOKEN"]) {
    assert.ok(syncStep.includes(name), `${name} is provided to the sync step`);
    assert.equal(prStep.includes(name), false, `${name} never reaches the PR step`);
  }
  assert.equal(
    syncStep.split("secrets.VERCEL_TOKEN").length - 1,
    1,
    "VERCEL_TOKEN is referenced exactly once, as a sync-step secret"
  );
  assert.equal(prStep.includes("VERCEL"), false, "no VERCEL credential reaches the PR step");

  // Regression: no implicit github.token fallback for the discovery token.
  // Auto-discovery requires the explicit PORTFOLIO_GITHUB_TOKEN secret.
  assert.equal(
    workflow.includes("secrets.PORTFOLIO_GITHUB_TOKEN || github.token"),
    false,
    "the discovery token never falls back to github.token"
  );
  assert.equal(
    (workflow.match(/PORTFOLIO_GITHUB_TOKEN: .*github\.token/g) ?? []).length,
    0,
    "PORTFOLIO_GITHUB_TOKEN is sourced from its secret only"
  );
  assert.match(syncStep, /PORTFOLIO_GITHUB_TOKEN: \$\{\{ secrets\.PORTFOLIO_GITHUB_TOKEN \}\}/);
  // github.token is reserved for PR publication only (exactly one use).
  const githubTokenUses = [...workflow.matchAll(/\$\{\{ github\.token \}\}/g)].length;
  assert.equal(githubTokenUses, 1);

  // The PR action keeps using the least-privileged workflow token.
  assert.match(prStep, /token: \$\{\{ github\.token \}\}/);

  // Behavior guards that must not regress with the integration.
  assert.match(workflow, /node-version: 24/);
  assert.match(workflow, /type:chore/);
  assert.match(workflow, /pull-requests: write/);
  assert.match(workflow, /add-paths: \|/);
});

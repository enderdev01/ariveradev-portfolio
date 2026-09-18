// Offline node:test suite for scripts/lib/vercel-project-match.mjs: raw
// Vercel project normalization, repository-reference normalization and the
// deterministic repository matching with its non-secret ambiguity abort.
// Pure functions: no network, no fixture double needed.

import test from "node:test";
import assert from "node:assert/strict";
import { DiscoveryError } from "../lib/github-discovery.mjs";
import {
  matchVercelProject,
  normalizeProject,
  normalizeVercelRepoRef,
} from "../lib/vercel-project-match.mjs";

// --- Normalization ---------------------------------------------------------------

test("normalizeProject accepts both targets.production.alias and aliases", () => {
  const viaAlias = normalizeProject({
    id: "prj_a",
    name: "app",
    targets: { production: { alias: ["app.example.com"] } },
  });
  assert.deepEqual(viaAlias.production.aliases, ["app.example.com"]);
  const viaAliases = normalizeProject({
    id: "prj_b",
    name: "app",
    targets: { production: { aliases: ["app.example.com"] } },
  });
  assert.deepEqual(viaAliases.production.aliases, ["app.example.com"]);
  // `aliases` wins when both are present.
  const both = normalizeProject({
    id: "prj_c",
    name: "app",
    targets: { production: { alias: ["a.example.com"], aliases: ["b.example.com"] } },
  });
  assert.deepEqual(both.production.aliases, ["b.example.com"]);
  assert.throws(
    () => normalizeProject({ id: "prj_d", name: "app", targets: { production: { aliases: "nope" } } }),
    /unexpected aliases shape/
  );
});

test("normalizeVercelRepoRef strips host prefixes, .git and whitespace", () => {
  assert.equal(normalizeVercelRepoRef("github.com/onilabs"), "onilabs");
  assert.equal(normalizeVercelRepoRef("Reportes-Ventas.git"), "reportes-ventas");
  assert.equal(normalizeVercelRepoRef("  onilabs  "), "onilabs");
  assert.equal(normalizeVercelRepoRef(""), null);
  assert.equal(normalizeVercelRepoRef(null), null);
});

// --- Matching ----------------------------------------------------------------------

test("repoId match wins over org/repo match", () => {
  const projects = [
    normalizeProject({ id: "prj_orgmatch", name: "clinica-nova", link: { org: "onilabs", repo: "clinica-nova" } }),
    normalizeProject({ id: "prj_repoid", name: "otro", link: { repoId: 101 } }),
  ];
  const matched = matchVercelProject(projects, { id: 101, owner: "onilabs", name: "clinica-nova" });
  assert.equal(matched.id, "prj_repoid");
});

test("duplicate Vercel matches fail with a non-secret ambiguity error", () => {
  const projects = [
    normalizeProject({ id: "prj_dup_a", name: "clinica-nova", link: { repoId: 101 } }),
    normalizeProject({ id: "prj_dup_b", name: "clinica-nova-lab", link: { repoId: 101 } }),
  ];
  try {
    matchVercelProject(projects, { id: 101, owner: "onilabs", name: "clinica-nova" });
    assert.fail("expected ambiguity error");
  } catch (error) {
    assert.ok(error instanceof DiscoveryError);
    assert.match(error.message, /Ambiguous Vercel project matches \(link\.repoId\).*101/);
    assert.match(error.message, /prj_dup_a, prj_dup_b/);
    // Non-secret: no tokens, no repository identity.
    assert.doesNotMatch(error.message, /token|clinica-nova/);
  }
  assert.throws(
    () =>
      matchVercelProject(
        [
          normalizeProject({ id: "prj_org_1", name: "a", link: { org: "onilabs", repo: "clinica-nova" } }),
          normalizeProject({ id: "prj_org_2", name: "b", link: { org: "onilabs", repo: "clinica-nova" } }),
        ],
        { id: 101, owner: "onilabs", name: "clinica-nova" }
      ),
    /Ambiguous Vercel project matches \(link\.org\/link\.repo\)/
  );
});

test("org/repo matching normalizes github.com prefix and .git suffix", () => {
  const projects = [
    normalizeProject({
      id: "prj_beta",
      name: "reportes-ventas",
      link: { org: "github.com/onilabs", repo: "reportes-ventas.git" },
    }),
  ];
  const matched = matchVercelProject(projects, { id: 102, owner: "onilabs", name: "reportes-ventas" });
  assert.equal(matched.id, "prj_beta");
  assert.equal(matchVercelProject(projects, { id: 404, owner: "nadie", name: "nadie" }), null);
});

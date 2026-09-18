// Shared offline HTTP fixture router for the discovery test files.
//
// Routes api.github.com / api.vercel.com / production HTML requests from the
// per-API doubles next to this file (discovery-github.mjs,
// discovery-vercel.mjs, discovery-html.mjs), so no test file ever touches the
// real GitHub or Vercel APIs. The query contract of both APIs is asserted
// inline here, so any parameter drift in the modules fails the suite.

import assert from "node:assert/strict";
import { githubReposByPage, githubToken } from "./discovery-github.mjs";
import {
  vercelDeploymentsByProjectId,
  vercelProjectPages,
  vercelTeamId,
  vercelToken,
} from "./discovery-vercel.mjs";
import { htmlByUrl } from "./discovery-html.mjs";

// The merged fixture view the test files consume.
export const fixture = { githubToken, vercelToken, vercelTeamId, githubReposByPage, vercelProjectPages, vercelDeploymentsByProjectId, htmlByUrl };

export function jsonResponse(body, headers = {}) {
  return {
    ok: true,
    status: 200,
    url: "https://fixture/",
    headers: { get: (name) => headers[name.toLowerCase()] ?? null },
    json: async () => body,
    text: async () => JSON.stringify(body),
  };
}

export function textResponse(body, { status = 200, ok = true, url } = {}) {
  return {
    ok,
    status,
    url: url ?? "https://fixture/",
    headers: { get: () => null },
    json: async () => {
      throw new Error("not json");
    },
    text: async () => body,
  };
}

// Options:
//   githubStatus / vercelStatus      force an API HTTP failure
//   githubBody / vercelBody          override the response body shape
//   unboundedVercel                  never-ending pagination cursor
//   deploymentsBodyByProjectId       per-project deployment body override
//   htmlOverrides / htmlThrowOnUrls  production HTML overrides / failures
export function makeRouter(options = {}) {
  const calls = [];
  const fetchImpl = async (url, init = {}) => {
    const parsed = new URL(url);
    const headers = init.headers ?? {};
    calls.push({ url: parsed, headers });
    if (parsed.host === "api.github.com") {
      assertGitHubQueryContract(parsed);
      if (options.githubStatus) {
        return { ok: false, status: options.githubStatus, url, headers: { get: () => null }, json: async () => ({}) };
      }
      if (options.githubBody) return jsonResponse(options.githubBody);
      const page = Number(parsed.searchParams.get("page"));
      const body = fixture.githubReposByPage[String(page)] ?? [];
      const nextPage = fixture.githubReposByPage[String(page + 1)];
      const link = nextPage ? `<https://api.github.com/user/repos?per_page=100&page=${page + 1}>; rel="next"` : null;
      return jsonResponse(body, link ? { link } : {});
    }
    if (parsed.host === "api.vercel.com") {
      if (parsed.pathname === "/v9/projects") {
        assert.equal(parsed.searchParams.get("limit"), "100");
        if (options.vercelStatus) {
          return { ok: false, status: options.vercelStatus, url, headers: { get: () => null }, json: async () => ({}) };
        }
        if (options.vercelBody) return jsonResponse(options.vercelBody);
        if (options.unboundedVercel) {
          const page = Number(parsed.searchParams.get("until") ?? 1);
          return jsonResponse({ projects: [], pagination: { next: page + 1 } });
        }
        const page = parsed.searchParams.get("until") ?? "1";
        return jsonResponse(fixture.vercelProjectPages[page] ?? { projects: [], pagination: { next: null } });
      }
      if (parsed.pathname === "/v6/deployments") {
        if (options.vercelStatus) {
          return { ok: false, status: options.vercelStatus, url, headers: { get: () => null }, json: async () => ({}) };
        }
        assert.equal(parsed.searchParams.get("target"), "production");
        assert.equal(parsed.searchParams.get("limit"), "1");
        const projectId = parsed.searchParams.get("projectId");
        if (options.deploymentsBodyByProjectId?.[projectId]) {
          return jsonResponse(options.deploymentsBodyByProjectId[projectId]);
        }
        const entry = fixture.vercelDeploymentsByProjectId[projectId];
        return jsonResponse(entry ?? { deployments: [] });
      }
      return { ok: false, status: 404, url, headers: { get: () => null }, json: async () => ({}) };
    }
    // Production HTML fetches.
    if (options.htmlThrowOnUrls?.includes(url)) {
      throw new Error("fixture network failure");
    }
    const override = options.htmlOverrides?.[url];
    if (override) {
      return textResponse(override.body ?? "", {
        status: override.status ?? 200,
        ok: override.ok ?? true,
        url: override.finalUrl ?? url,
      });
    }
    const html = fixture.htmlByUrl[url];
    if (html === undefined) {
      return { ok: false, status: 404, url, headers: { get: () => null }, json: async () => ({}), text: async () => "" };
    }
    return { ok: true, status: 200, url, headers: { get: () => null }, json: async () => ({}), text: async () => html };
  };
  return { fetchImpl, calls };
}

// The GitHub query contract, pinned for every api.github.com request.
function assertGitHubQueryContract(parsed) {
  assert.equal(parsed.pathname, "/user/repos");
  assert.equal(parsed.searchParams.get("per_page"), "100");
  assert.equal(parsed.searchParams.get("visibility"), "all");
  assert.equal(parsed.searchParams.get("affiliation"), "owner,collaborator,organization_member");
  // Regression: no undocumented `sort=id` / `direction` params. Determinism
  // comes from the module's local id sort, not from the API.
  assert.equal(parsed.searchParams.get("sort"), null);
  assert.equal(parsed.searchParams.get("direction"), null);
}

// Offline node:test suite for the skipped-project alert.
//
// Every path here must be safe for the sync: no function may throw on a
// transport, HTTP or shape failure, because a mail outage must never fail a sync
// that otherwise succeeded. Identity resolution is exercised separately from the
// transport so the "email may name a repository, skip records may not" split
// stays explicit.

import test from "node:test";
import assert from "node:assert/strict";
import {
  ALERT_STATE_FILE,
  RESEND_ENDPOINT,
  buildAlertHtml,
  buildAlertSubject,
  describeReason,
  resolveRepositoryNames,
  sendAlertEmail,
  shouldNotify,
  skipSignature,
} from "../lib/portfolio-alert.mjs";

const skipped = [
  { projectId: 1315746384, reason: "vercel-project-not-found" },
  { projectId: 1180191843, reason: "deployed-html-unavailable" },
];

// --- signature & anti-noise --------------------------------------------------------

test("skipSignature is stable regardless of skip order and carries no identity", () => {
  const a = skipSignature(skipped);
  const b = skipSignature([...skipped].reverse());
  assert.equal(a, b);
  assert.equal(a, "1180191843:deployed-html-unavailable,1315746384:vercel-project-not-found");
  // Only numeric ids and reason codes leave this function.
  assert.doesNotMatch(a, /[A-Za-z]+\/[A-Za-z]+/);
  assert.equal(skipSignature([]), "");
});

test("shouldNotify fires on a new set, stays quiet on an identical repeat, and re-arms after recovery", () => {
  const signature = skipSignature(skipped);
  assert.equal(shouldNotify({ signature, previousSignature: null }), true, "first sighting notifies");
  assert.equal(shouldNotify({ signature, previousSignature: signature }), false, "identical repeat is silent");
  assert.equal(
    shouldNotify({ signature, previousSignature: skipSignature([skipped[0]]) }),
    true,
    "a changed set notifies"
  );
  assert.equal(shouldNotify({ signature: "", previousSignature: signature }), false, "a clean run notifies nothing");
  // An empty recorded signature must not suppress a later repeat.
  assert.equal(shouldNotify({ signature, previousSignature: "" }), true);
});

test("skipSignature ignores entries without a numeric projectId", () => {
  assert.equal(skipSignature([{ reason: "x" }, ...skipped]), skipSignature(skipped));
});

// --- copy ---------------------------------------------------------------------------

test("describeReason explains known codes and never hides an unknown one", () => {
  assert.match(describeReason("vercel-project-not-found"), /no Vercel project/);
  assert.match(describeReason("vercel-production-not-ready"), /not READY/);
  assert.match(describeReason("vercel-production-not-ready-42"), /not READY/);
  assert.equal(describeReason("brand-new-reason"), "brand-new-reason");
});

test("buildAlertSubject pluralizes by count", () => {
  assert.equal(buildAlertSubject(skipped), "Portfolio sync: 2 tagged projects were skipped");
  assert.equal(buildAlertSubject([skipped[0]]), "Portfolio sync: 1 tagged project was skipped");
});

test("buildAlertHtml names a resolved repository and still reports an unresolved one by id", () => {
  const names = new Map([[1180191843, "enderdev01/versus-electoral-pe"]]);
  const html = buildAlertHtml({ skipped, names });
  assert.match(html, /enderdev01\/versus-electoral-pe/);
  assert.match(html, /https:\/\/github\.com\/enderdev01\/versus-electoral-pe/);
  // The unresolved one is reported by numeric id, so a skip is never hidden.
  assert.match(html, /projectId 1315746384/);
  assert.match(html, /vercel-project-not-found/);
});

test("buildAlertHtml escapes repository names so a crafted name cannot inject markup", () => {
  const names = new Map([[1180191843, "<script>alert(1)</script>"]]);
  const html = buildAlertHtml({ skipped: [skipped[1]], names });
  assert.doesNotMatch(html, /<script>/);
  assert.match(html, /&lt;script&gt;/);
});

// --- identity resolution -------------------------------------------------------------

test("resolveRepositoryNames resolves ids and tolerates failures", async () => {
  const calls = [];
  const fetchImpl = async (url, options) => {
    calls.push({ url, options });
    const id = Number(url.split("/").pop());
    if (id === 1315746384) throw new Error("network down");
    return { ok: true, async json() { return { full_name: `enderdev01/repo-${id}` }; } };
  };
  const names = await resolveRepositoryNames({ fetchImpl, token: "t0ken", ids: [1180191843, 1315746384] });
  assert.equal(names.get(1180191843), "enderdev01/repo-1180191843");
  assert.equal(names.has(1315746384), false, "a failed lookup is skipped, not thrown");
  // The token travels only in the Authorization header of api.github.com.
  assert.equal(calls[0].url, "https://api.github.com/repositories/1180191843");
  assert.equal(calls[0].options.headers.Authorization, "Bearer t0ken");
  assert.ok(calls[0].options.headers["User-Agent"]);
});

test("resolveRepositoryNames is inert without a token or an injectable fetch", async () => {
  assert.equal((await resolveRepositoryNames({ fetchImpl: async () => ({ ok: true }), token: "", ids: [1] })).size, 0);
  assert.equal((await resolveRepositoryNames({ fetchImpl: null, token: "t", ids: [1] })).size, 0);
});

// --- transport ----------------------------------------------------------------------

test("sendAlertEmail posts to Resend with the required headers", async () => {
  const calls = [];
  const fetchImpl = async (url, options) => {
    calls.push({ url, options });
    return { ok: true, status: 200 };
  };
  const result = await sendAlertEmail({
    fetchImpl,
    apiKey: "re_test",
    from: "alerts@example.com",
    to: "maintainer@example.com",
    subject: "s",
    html: "<p>h</p>",
  });
  assert.deepEqual(result, { ok: true, status: 200 });
  assert.equal(calls[0].url, RESEND_ENDPOINT);
  assert.equal(calls[0].options.method, "POST");
  assert.equal(calls[0].options.headers.Authorization, "Bearer re_test");
  assert.equal(calls[0].options.headers["Content-Type"], "application/json");
  // Regression: Resend rejects a request without User-Agent with HTTP 403.
  assert.ok(calls[0].options.headers["User-Agent"], "User-Agent is mandatory");
  const body = JSON.parse(calls[0].options.body);
  assert.deepEqual(body, { from: "alerts@example.com", to: ["maintainer@example.com"], subject: "s", html: "<p>h</p>" });
});

test("sendAlertEmail caps the idempotency key at the documented 256 characters", async () => {
  let sent = null;
  const fetchImpl = async (_url, options) => {
    sent = options.headers["Idempotency-Key"];
    return { ok: true, status: 200 };
  };
  await sendAlertEmail({ fetchImpl, apiKey: "k", from: "f", to: "t", subject: "s", html: "h", idempotencyKey: "x".repeat(400) });
  assert.equal(sent.length, 256);
});

test("sendAlertEmail never throws: HTTP failure, network failure and missing config all degrade", async () => {
  const failing = await sendAlertEmail({
    fetchImpl: async () => ({ ok: false, status: 422 }),
    apiKey: "k", from: "f", to: "t", subject: "s", html: "h",
  });
  assert.deepEqual(failing, { ok: false, status: 422 });

  const threw = await sendAlertEmail({
    fetchImpl: async () => { throw new Error("ECONNRESET"); },
    apiKey: "k", from: "f", to: "t", subject: "s", html: "h",
  });
  assert.equal(threw.ok, false);
  assert.equal(threw.reason, "ECONNRESET");

  const unconfigured = await sendAlertEmail({ fetchImpl: async () => ({ ok: true }), apiKey: "", from: "f", to: "t", subject: "s" });
  assert.equal(unconfigured.ok, false);
  assert.equal(unconfigured.reason, "missing-config");
});

test("the alert state file is git-ignored so it can never be committed by the sync PR", async () => {
  const { readFileSync } = await import("node:fs");
  const { fileURLToPath } = await import("node:url");
  const { dirname, join } = await import("node:path");
  const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
  assert.match(readFileSync(join(root, ".gitignore"), "utf8"), new RegExp(`^${ALERT_STATE_FILE.replace(".", "\\.")}$`, "m"));
});

// Offline node:test suite for the pass-1 capture navigation contract in
// scripts/lib/portfolio-thumbnail.mjs: the deployment capture must navigate with
// `waitUntil: "load"`, never `networkidle`. A page that streams media (hls video
// segments) never sits silent long enough for networkidle, so networkidle turns a
// healthy page into an intermittent hard timeout. No network, no browser.

import test from "node:test";
import assert from "node:assert/strict";
import { captureAndCompose } from "../lib/portfolio-thumbnail.mjs";

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

// Minimal fake page: records goto arguments, resolves every lifecycle hook
// immediately, and hands back a PNG-signature buffer for both screenshots.
// `clock` is deliberately omitted so the existing optional clock-install guards
// in captureAndCompose stay exercised.
function fakePage(log) {
  const png = Buffer.concat([PNG_SIGNATURE, Buffer.alloc(32)]);
  return {
    goto: async (...args) => {
      log.gotos.push(args);
    },
    addStyleTag: async () => {},
    evaluate: async () => {},
    waitForTimeout: async () => {},
    setContent: async (...args) => {
      log.setContents.push(args);
    },
    screenshot: async ({ type }) => {
      log.screenshots.push(type);
      return png;
    },
  };
}

// Fake browser with one context per call, mirroring the two contexts
// captureAndCompose opens (capture, then composition).
function fakeBrowser(log) {
  let page;
  return {
    newContext: async () => {
      page = fakePage(log);
      return {
        newPage: async () => page,
        close: async () => {},
      };
    },
    close: async () => {},
  };
}

const source = {
  id: "test-source",
  productionUrl: "https://example.com/",
  thumbnail: { gradient: ["#0B1224", "#132A5E"] },
};

test("the deployment capture navigates with waitUntil 'load' and a numeric timeout", async () => {
  const log = { gotos: [], setContents: [], screenshots: [] };
  await captureAndCompose(fakeBrowser(log), source);
  assert.equal(log.gotos.length, 1, "pass 1 opens the deployment exactly once");
  const [url, options] = log.gotos[0];
  assert.equal(url, source.productionUrl);
  assert.equal(
    options.waitUntil,
    "load",
    "networkidle is unusable here because a page that streams media never goes " +
      "network-idle, so it intermittently hard-times-out on a healthy deployment"
  );
  assert.equal(typeof options.timeout, "number", "the navigation keeps a bounded timeout");
});

test("the capture flow still resolves and returns the composition screenshot", async () => {
  const log = { gotos: [], setContents: [], screenshots: [] };
  const composed = await captureAndCompose(fakeBrowser(log), source);
  assert.ok(Buffer.isBuffer(composed), "the composed thumbnail is a buffer");
  assert.ok(composed.subarray(0, 8).equals(PNG_SIGNATURE), "the buffer carries the PNG signature");
  assert.deepEqual(log.screenshots, ["png", "png"], "pass 1 captures, pass 2 composes");
  assert.equal(log.setContents.length, 1, "pass 2 composes the captured shot into page html");
});

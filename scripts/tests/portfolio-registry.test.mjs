// Offline node:test suite for scripts/lib/portfolio-registry.mjs: source
// loading from the three registries and the approved-source gate. No network,
// no writes. The deterministic discovery/manual merge and the fail-closed
// sync gates are covered in portfolio-source-resolution.test.mjs.

import test from "node:test";
import assert from "node:assert/strict";
import { loadSources } from "../lib/portfolio-registry.mjs";

// --- Committed registry -------------------------------------------------------------

test("loadSources({ allowEmpty: true }) loads the committed manual registry", () => {
  const sources = loadSources({ allowEmpty: true });
  const hakui = sources.find((source) => source.id === "hakui-medical");
  assert.ok(hakui, "committed Hakui entry survives the migration integration");
  assert.equal(hakui.clientApproved, true);
});

import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = await readFile(new URL("../../src/lib/productionHost.js", import.meta.url), "utf8");
const { productionHostKey } = await import(`data:text/javascript,${encodeURIComponent(source)}`);

test("GitHub project identities distinguish repositories while deduplicating the same repository", () => {
  const agent = productionHostKey("https://github.com/enderdev01/agent-notch");
  assert.equal(agent, productionHostKey("https://www.github.com/EnderDev01/Agent-Notch.git/"));
  assert.notEqual(agent, productionHostKey("https://github.com/enderdev01/mis-servicios-donde"));
  assert.notEqual(agent, productionHostKey("https://github.com/enderdev01/butacas-libres"));
  assert.equal(productionHostKey("https://github.com"), null);
  assert.equal(productionHostKey("https://www.example.com/page"), "example.com");
});

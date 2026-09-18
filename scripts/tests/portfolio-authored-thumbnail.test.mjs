// Offline node:test suite for the authored-thumbnail contract: the PNG header
// reader in scripts/lib/portfolio-thumbnail.mjs and the fail-closed validation in
// scripts/lib/portfolio-artifacts.mjs. No network, no browser.

import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  AUTHORED_THUMBNAIL_SIZE,
  readPngSize,
} from "../lib/portfolio-thumbnail.mjs";
import {
  assertAuthoredThumbnail,
  committedThumbnailPath,
} from "../lib/portfolio-artifacts.mjs";

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

// Minimal PNG header: signature, IHDR length, "IHDR", width, height. Enough for a
// header reader, and cheap enough to build inline.
function pngHeader(width, height) {
  const header = Buffer.alloc(24);
  PNG_SIGNATURE.copy(header, 0);
  header.writeUInt32BE(13, 8);
  header.write("IHDR", 12, "latin1");
  header.writeUInt32BE(width, 16);
  header.writeUInt32BE(height, 20);
  return header;
}

function scratchPng(bytes) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-thumbnail-"));
  const filePath = path.join(dir, "thumb.png");
  fs.writeFileSync(filePath, bytes);
  return filePath;
}

// --- The canvas contract -------------------------------------------------------------

test("every committed thumbnail matches the authored canvas", () => {
  // Pins the contract against what the compositor actually publishes: if the
  // composition viewport ever changes, this fails before an authored image can
  // drift out of alignment with the generated ones.
  for (const file of fs.readdirSync(path.dirname(committedThumbnailPath("x")))) {
    if (!file.endsWith(".png")) continue;
    const size = readPngSize(fs.readFileSync(committedThumbnailPath(file.slice(0, -4))), file);
    assert.deepEqual(size, { width: 1920, height: 1080 }, `${file} is 1920x1080`);
  }
  assert.deepEqual(AUTHORED_THUMBNAIL_SIZE, { width: 1920, height: 1080 });
});

// --- PNG header reading --------------------------------------------------------------

test("readPngSize reads the dimensions from the IHDR header", () => {
  assert.deepEqual(readPngSize(pngHeader(1920, 1080), "test"), { width: 1920, height: 1080 });
  assert.deepEqual(readPngSize(pngHeader(1, 2), "test"), { width: 1, height: 2 });
});

test("readPngSize rejects bytes that are not a PNG", () => {
  assert.throws(() => readPngSize(Buffer.from("not a png at all, really not"), "test"), /not a PNG file/);
  assert.throws(() => readPngSize(Buffer.alloc(0), "test"), /not a PNG file/);
  assert.throws(() => readPngSize("a string", "test"), /not a PNG file/);
});

test("readPngSize rejects a PNG whose first chunk is not IHDR", () => {
  const broken = pngHeader(1920, 1080);
  broken.write("IDAT", 12, "latin1");
  assert.throws(() => readPngSize(broken, "test"), /missing its IHDR header chunk/);
});

// --- Authored-thumbnail validation ---------------------------------------------------

test("assertAuthoredThumbnail accepts a 1920x1080 PNG", () => {
  const filePath = scratchPng(pngHeader(1920, 1080));
  assert.deepEqual(assertAuthoredThumbnail({ id: "sample", filePath }), { width: 1920, height: 1080 });
});

test("assertAuthoredThumbnail aborts when the committed file is missing", () => {
  const missing = path.join(os.tmpdir(), "portfolio-authored-thumbnail-does-not-exist.png");
  assert.throws(() => assertAuthoredThumbnail({ id: "sample", filePath: missing }), /is missing at/);
});

test("assertAuthoredThumbnail aborts on a size that drifted from the canvas", () => {
  const filePath = scratchPng(pngHeader(1600, 900));
  assert.throws(
    () => assertAuthoredThumbnail({ id: "sample", filePath }),
    /is 1600x900; every portfolio thumbnail must be 1920x1080/
  );
});

test("assertAuthoredThumbnail aborts on a file that is not a PNG", () => {
  const filePath = scratchPng(Buffer.from("<html>a screenshot renamed to .png</html>"));
  assert.throws(() => assertAuthoredThumbnail({ id: "sample", filePath }), /not a PNG file/);
});

test("committedThumbnailPath keeps the published /portfolio/<id>.png contract", () => {
  const filePath = committedThumbnailPath("butacas-libres");
  assert.equal(path.basename(filePath), "butacas-libres.png");
  assert.equal(path.basename(path.dirname(filePath)), "portfolio");
});

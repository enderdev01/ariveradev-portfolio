// Artifact staging & install logic: stages every output in a temporary
// directory and installs files into their final locations atomically.
//
// Guarantees owned here:
//   - Staging first: nothing final is touched until every output exists.
//   - Atomic installation: temp copy in the target directory + rename.
//   - No-op writes: a file is written only when its content actually changed,
//     so unchanged content produces no diff.
//   - Temporary cleanup: the staging directory is removed on both success and
//     failure paths.

import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { fail } from "./portfolio-registry.mjs";
import { AUTHORED_THUMBNAIL_SIZE, readPngSize } from "./portfolio-thumbnail.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..", "..");

const GENERATED_JSON_PATH = path.join(repoRoot, "src", "data", "portfolio.generated.json");
export const PUBLIC_PORTFOLIO_DIR = path.join(repoRoot, "public", "portfolio");

// Committed path of a project thumbnail, generated or authored. The generated JSON
// always points at /portfolio/<id>.png, so an authored image needs no schema change.
export const committedThumbnailPath = (id) => path.join(PUBLIC_PORTFOLIO_DIR, `${id}.png`);

// Validates a hand-authored, committed thumbnail. The sync never captures or
// installs these, so nothing else in the pipeline would notice a missing file, a
// file that is not a PNG, or a size that drifted from the compositor canvas.
export function assertAuthoredThumbnail({ id, filePath = committedThumbnailPath(id) } = {}) {
  if (!fs.existsSync(filePath)) {
    fail(`authored thumbnail for ${id} is missing at ${path.relative(repoRoot, filePath)}`);
  }
  const { width, height } = readPngSize(fs.readFileSync(filePath), `authored thumbnail ${id}`);
  if (width !== AUTHORED_THUMBNAIL_SIZE.width || height !== AUTHORED_THUMBNAIL_SIZE.height) {
    fail(
      `authored thumbnail for ${id} is ${width}x${height}; ` +
        `every portfolio thumbnail must be ${AUTHORED_THUMBNAIL_SIZE.width}x${AUTHORED_THUMBNAIL_SIZE.height}`
    );
  }
  return { width, height };
}

// Installs a staged file into its final location atomically (temp copy in the
// target directory + rename), skipping the write when content is unchanged.
function installFile(stagedPath, targetPath) {
  const staged = fs.readFileSync(stagedPath);
  const previous = fs.existsSync(targetPath) ? fs.readFileSync(targetPath) : null;
  if (previous && previous.equals(staged)) return false;
  const tmpTarget = `${targetPath}.tmp`;
  try {
    fs.copyFileSync(stagedPath, tmpTarget);
    fs.renameSync(tmpTarget, targetPath);
  } catch (error) {
    fs.rmSync(tmpTarget, { force: true });
    throw error;
  }
  return true;
}

// Stages the generated JSON and thumbnails in a temporary directory, installs
// the thumbnails first and the JSON last (so the JSON never points at a
// thumbnail that has not been installed yet), and cleans up the staging
// directory on both success and failure paths.
export function stageAndInstall(generatedJson, thumbnails) {
  const stagingDir = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-sync-"));
  try {
    const stagedJson = path.join(stagingDir, "portfolio.generated.json");
    fs.writeFileSync(stagedJson, generatedJson, "utf8");
    const stagedThumbnails = thumbnails.map(({ id, png }) => {
      const stagedPath = path.join(stagingDir, `${id}.png`);
      fs.writeFileSync(stagedPath, png);
      return { id, stagedPath };
    });

    fs.mkdirSync(PUBLIC_PORTFOLIO_DIR, { recursive: true });
    const imageResults = stagedThumbnails.map(({ id, stagedPath }) => ({
      id,
      changed: installFile(stagedPath, path.join(PUBLIC_PORTFOLIO_DIR, `${id}.png`)),
    }));
    const jsonChanged = installFile(stagedJson, GENERATED_JSON_PATH);

    return { imageResults, jsonChanged, generatedJsonPath: GENERATED_JSON_PATH };
  } finally {
    // Temporary staging is cleaned up on both success and failure paths.
    fs.rmSync(stagingDir, { recursive: true, force: true });
  }
}

// Playwright thumbnail capture & composition logic: pass 1 captures the
// deployment viewport, pass 2 composes it inside a browser frame over a
// configurable dark gradient to produce the 1920x1080 Glass Dark thumbnail.
//
// Guarantees owned here:
//   - Deterministic capture: no animations, no caret, no transitions, and a
//     frozen clock so time-driven UI always renders the same instant.
//   - Strict interpolation safety: the composed page interpolates only
//     HTML-escaped values and strictly validated gradient stops (plain hex
//     colors only; named colors, css functions, url(), commas rejected).
//   - Bounded visual equivalence: a newly composed PNG that differs from the
//     committed one only within a tiny, documented rasterization noise budget
//     is reported as equivalent so the committed bytes can be preserved.

// Keeps captured pages deterministic: no animations, no caret, no transitions,
// and a frozen clock so time-driven UI (tickers, "próxima cita", etc.) always
// renders the same instant.
const FREEZE_CSS = `
  *, *::before, *::after {
    animation: none !important;
    transition: none !important;
    caret-color: transparent !important;
    scroll-behavior: auto !important;
  }
`;
const FROZEN_CLOCK_TIME = new Date("2025-01-06T12:00:00Z");

// Deployment capture viewport (pass 1) and composition canvas (pass 2).
//
// Both are 4:3 because that is the geometry the rest of the portfolio already uses:
// every hand-curated project image is 4:3 (1920x1440 or 960x720) and both the grid
// card and the project page render into an `aspect-[4/3]` box with `object-cover`.
// A 16:9 capture in a 4:3 box loses the bottom 28% of the image, which is why the
// capture viewport is 4:3 too: it fills the frame without cropping the sides.
const CAPTURE_VIEWPORT = { width: 1600, height: 1200 };
const COMPOSITION_VIEWPORT = { width: 1920, height: 1440 };

// Browser frame inside the composition canvas: 1620 wide, and 1215px of viewport
// below the 52px chrome, so the frame's own open area is exactly 4:3 and the 4:3
// capture scales to it without cropping either axis.
const COMPOSITION_FRAME = { width: 1620, chromeHeight: 52, viewportHeight: 1215 };

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

// Hand-authored thumbnails are committed by hand instead of composed, so they must
// match this canvas exactly: a different size would shift one card relative to
// every generated one in the grid and on the project page.
export const AUTHORED_THUMBNAIL_SIZE = Object.freeze({
  width: COMPOSITION_VIEWPORT.width,
  height: COMPOSITION_VIEWPORT.height,
});

// Reads the PNG signature and IHDR header only, so an authored file can be
// validated without a browser and without decoding the image.
export function readPngSize(bytes, label) {
  if (!Buffer.isBuffer(bytes) || bytes.length < 24 || !bytes.subarray(0, 8).equals(PNG_SIGNATURE)) {
    fail(`${label}: not a PNG file`);
  }
  if (bytes.subarray(12, 16).toString("latin1") !== "IHDR") {
    fail(`${label}: PNG is missing its IHDR header chunk`);
  }
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

function fail(message) {
  throw new Error(message);
}

// Escapes a value for safe interpolation into HTML text/attribute contexts.
function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Strict validation for configurable gradient stops. Only plain hex colors
// (#rgb, #rrggbb, #rrggbbaa) are accepted; anything else (named colors, css
// functions, url(), commas...) is rejected rather than interpolated.
function validateGradientStops(stops, label) {
  if (!Array.isArray(stops) || stops.length < 2 || stops.length > 6) {
    fail(`${label}: thumbnail.gradient must be an array of 2-6 color stops`);
  }
  return stops.map((stop) => {
    if (typeof stop !== "string" || !/^#[0-9a-fA-F]{3}([0-9a-fA-F]{3}([0-9a-fA-F]{2})?)?$/.test(stop)) {
      fail(`${label}: invalid gradient color stop ${JSON.stringify(stop)} (expected #rgb/#rrggbb/#rrggbbaa)`);
    }
    return stop;
  });
}

function composePageHtml(shotPng, source, gradientStops) {
  const stops = gradientStops.map((color, index) => `${color} ${Math.round((index / (gradientStops.length - 1)) * 100)}%`).join(", ");
  const dataUrl = `data:image/png;base64,${shotPng.toString("base64")}`;
  const safeUrl = escapeHtml(source.productionUrl);
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <style>
      html, body {
        margin: 0;
        width: ${COMPOSITION_VIEWPORT.width}px;
        height: ${COMPOSITION_VIEWPORT.height}px;
        overflow: hidden;
        font-family: system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
      }
      .stage {
        position: relative;
        width: ${COMPOSITION_VIEWPORT.width}px;
        height: ${COMPOSITION_VIEWPORT.height}px;
        display: flex;
        align-items: center;
        justify-content: center;
        background:
          radial-gradient(1100px 700px at 12% 8%, rgba(14, 165, 233, 0.22), transparent 60%),
          radial-gradient(900px 650px at 88% 92%, rgba(37, 99, 235, 0.30), transparent 55%),
          linear-gradient(160deg, ${stops});
      }
      .frame {
        width: ${COMPOSITION_FRAME.width}px;
        height: ${COMPOSITION_FRAME.chromeHeight + COMPOSITION_FRAME.viewportHeight}px;
        border-radius: 18px;
        overflow: hidden;
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.14);
        box-shadow: 0 40px 120px rgba(2, 8, 23, 0.55);
      }
      .chrome {
        height: ${COMPOSITION_FRAME.chromeHeight}px;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 0 18px;
        background: rgba(15, 23, 42, 0.78);
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }
      .dot { width: 12px; height: 12px; border-radius: 50%; }
      .url {
        margin-left: 14px;
        flex: 1;
        max-width: 720px;
        padding: 6px 14px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.10);
        color: rgba(226, 232, 240, 0.85);
        font-size: 14px;
        letter-spacing: 0.01em;
      }
      .viewport { position: relative; height: ${COMPOSITION_FRAME.viewportHeight}px; }
      img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: top center;
      }
    </style>
  </head>
  <body>
    <div class="stage">
      <div class="frame">
        <div class="chrome">
          <span class="dot" style="background:#FF5F57"></span>
          <span class="dot" style="background:#FEBC2E"></span>
          <span class="dot" style="background:#28C840"></span>
          <span class="url">${safeUrl}</span>
        </div>
        <div class="viewport"><img src="${dataUrl}" alt=""></div>
      </div>
    </div>
  </body>
</html>`;
}

export async function captureAndCompose(browser, source) {
  const { chromium } = await import("playwright");
  // Pass 1: capture the deployment viewport.
  const captureContext = await browser.newContext({
    viewport: CAPTURE_VIEWPORT,
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
  });
  const capturePage = await captureContext.newPage();
  if (typeof capturePage.clock?.install === "function") {
    await capturePage.clock.install();
    await capturePage.clock.setFixedTime(FROZEN_CLOCK_TIME);
  }
  await capturePage.goto(source.productionUrl, {
    waitUntil: "networkidle",
    timeout: 60000,
  });
  if (typeof capturePage.clock?.pauseAt === "function") {
    await capturePage.clock.pauseAt(FROZEN_CLOCK_TIME);
  }
  await capturePage.addStyleTag({ content: FREEZE_CSS });
  await capturePage.evaluate(() => document.fonts.ready);
  await capturePage.waitForTimeout(300);
  const deploymentShot = await capturePage.screenshot({
    type: "png",
    animations: "disabled",
  });
  await captureContext.close();

  // Pass 2: compose inside the browser frame over the configured gradient.
  const configuredStops =
    Array.isArray(source.thumbnail?.gradient) && source.thumbnail.gradient.length >= 2
      ? source.thumbnail.gradient
      : ["#0B1224", "#132A5E", "#0E7490"];
  const gradientStops = validateGradientStops(configuredStops, source.id);
  const compositionContext = await browser.newContext({
    viewport: COMPOSITION_VIEWPORT,
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
  });
  const compositionPage = await compositionContext.newPage();
  await compositionPage.setContent(composePageHtml(deploymentShot, source, gradientStops), {
    waitUntil: "load",
  });
  await compositionPage.waitForTimeout(100);
  const composed = await compositionPage.screenshot({ type: "png" });
  await compositionContext.close();
  return composed;
}

// ---------------------------------------------------------------------------
// Visual-equivalence guard: decoded-pixel comparison, never compressed bytes.
//
// Budget (documented, deliberately strict):
//   - NOISE_CHANNEL_DELTA = 2: a pixel differs only when at least one RGBA
//     channel changes by more than 2; sub-perceptual rasterization and
//     antialiasing jitter stay at or below this.
//   - MAX_NOISE_PIXELS = 683: hard cap of differing pixels. The original budget was
//     512 pixels on the former 1920x1080 canvas, i.e. ~0.025% of it; 683 keeps that
//     same ratio on the 1920x1440 canvas instead of silently tightening it.
//     Observed real-world instability was 51 pixels in an 11x23 glyph-shaped region;
//     meaningful content, text or layout changes alter thousands of pixels with large
//     channel deltas and never qualify.
//   - Dimensions must match exactly; any size difference is never equivalent.

const NOISE_CHANNEL_DELTA = 2;
const MAX_NOISE_PIXELS = 683;

export const VISUAL_EQUIVALENCE_BUDGET = Object.freeze({
  noiseChannelDelta: NOISE_CHANNEL_DELTA,
  maxNoisePixels: MAX_NOISE_PIXELS,
});

// Decodes both PNG buffers in a browser canvas and returns diff statistics
// computed on decoded pixels: whether dimensions match, how many pixels exceed
// the per-channel noise delta, and the largest per-channel delta observed.
export async function diffDecodedPixels(browser, existingPng, newPng) {
  const context = await browser.newContext({ viewport: { width: 640, height: 480 } });
  try {
    const page = await context.newPage();
    return await page.evaluate(async ({ existingUrl, newUrl, noiseChannelDelta }) => {
      async function decode(dataUrl) {
        const image = new Image();
        await new Promise((resolve, reject) => {
          image.onload = resolve;
          image.onerror = () => reject(new Error("PNG decode failed"));
          image.src = dataUrl;
        });
        const canvas = document.createElement("canvas");
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        ctx.drawImage(image, 0, 0);
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        return { width: canvas.width, height: canvas.height, data };
      }
      const [existing, next] = await Promise.all([decode(existingUrl), decode(newUrl)]);
      if (existing.width !== next.width || existing.height !== next.height) {
        return { dimensionsMatch: false, differingPixels: -1, maxChannelDelta: -1 };
      }
      let differingPixels = 0;
      let maxChannelDelta = 0;
      for (let i = 0; i < existing.data.length; i += 4) {
        let pixelDelta = 0;
        for (let channel = 0; channel < 4; channel += 1) {
          const delta = Math.abs(existing.data[i + channel] - next.data[i + channel]);
          if (delta > pixelDelta) pixelDelta = delta;
        }
        if (pixelDelta > maxChannelDelta) maxChannelDelta = pixelDelta;
        if (pixelDelta > noiseChannelDelta) differingPixels += 1;
      }
      return { dimensionsMatch: true, differingPixels, maxChannelDelta };
    }, {
      existingUrl: `data:image/png;base64,${existingPng.toString("base64")}`,
      newUrl: `data:image/png;base64,${newPng.toString("base64")}`,
      noiseChannelDelta: NOISE_CHANNEL_DELTA,
    });
  } finally {
    await context.close();
  }
}

// Equivalent only when dimensions match and the count of pixels exceeding the
// per-channel noise delta stays inside the strict budget.
export function isWithinNoiseBudget(stats) {
  return stats.dimensionsMatch && stats.differingPixels <= MAX_NOISE_PIXELS;
}

export async function isVisuallyEquivalent(browser, existingPng, newPng) {
  return isWithinNoiseBudget(await diffDecodedPixels(browser, existingPng, newPng));
}

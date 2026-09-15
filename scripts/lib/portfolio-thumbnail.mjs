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

// Deployment capture viewport (pass 1). The composition canvas is 1920x1080.
const CAPTURE_VIEWPORT = { width: 1600, height: 1000 };
const COMPOSITION_VIEWPORT = { width: 1920, height: 1080 };

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
        width: 1920px;
        height: 1080px;
        overflow: hidden;
        font-family: system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
      }
      .stage {
        position: relative;
        width: 1920px;
        height: 1080px;
        display: flex;
        align-items: center;
        justify-content: center;
        background:
          radial-gradient(1100px 700px at 12% 8%, rgba(14, 165, 233, 0.22), transparent 60%),
          radial-gradient(900px 650px at 88% 92%, rgba(37, 99, 235, 0.30), transparent 55%),
          linear-gradient(160deg, ${stops});
      }
      .frame {
        width: 1620px;
        height: 940px;
        border-radius: 18px;
        overflow: hidden;
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.14);
        box-shadow: 0 40px 120px rgba(2, 8, 23, 0.55);
      }
      .chrome {
        height: 52px;
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
      .viewport { position: relative; height: calc(100% - 53px); }
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

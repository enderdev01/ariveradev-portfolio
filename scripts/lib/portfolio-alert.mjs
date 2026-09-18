// Skipped-project alert: notifies the maintainer, by email, when discovery
// skips one or more tagged repositories.
//
// Why email and not a public GitHub issue: skip records are identity-safe by
// design ({ projectId, reason } only), so a public artifact can never name a
// private client repository. Email is private, which makes it the only channel
// that can name the repository. The names are therefore resolved here, at the
// very last step, from the numeric ids — the identity never travels through the
// discovery layer.
//
// Guarantees owned here:
//   - Never breaks the sync: every function returns a result instead of throwing
//     on transport, HTTP or shape failures. A missing API key, a Resend outage or
//     a network error degrades to "not notified", never to a failed sync.
//   - No repeat noise: the caller stores the skip signature between runs, and an
//     unchanged signature sends nothing.
//   - Identity resolution is best-effort: a repository whose name cannot be
//     resolved is still reported by numeric id, so a skip is never hidden.
//
// The Resend API contract (verified against the official documentation):
//   - POST https://api.resend.com/emails
//   - Authorization: Bearer re_...
//   - Content-Type: application/json
//   - A User-Agent header is REQUIRED: requests without it are rejected with 403.
//   - `from`, `to` and `subject` are required; `to` accepts a string or an array.

export const RESEND_ENDPOINT = "https://api.resend.com/emails";
export const ALERT_STATE_FILE = ".portfolio-discovery-alert-state.json";

// Human-readable explanation per stable skip reason code. Unknown codes fall
// back to the raw code so a new reason is never silently dropped.
const REASON_TEXT = {
  "vercel-project-not-found": "no Vercel project is linked to this repository",
  "vercel-production-url-unavailable": "the production deployment has no usable URL",
  "deployed-html-unavailable": "the production page could not be read (network, non-OK, cross-origin redirect or missing <title>)",
  "no-public-deployment": "the repository declares no public deployment, not even a repository URL",
};
const REASON_PREFIX = {
  "vercel-production-not-ready": "the production deployment is not READY yet",
};

export function describeReason(reason) {
  if (REASON_TEXT[reason]) return REASON_TEXT[reason];
  for (const [prefix, text] of Object.entries(REASON_PREFIX)) {
    if (reason === prefix || reason.startsWith(`${prefix}-`)) return text;
  }
  return reason;
}

// Stable signature of the skipped set: sorted projectId:reason pairs. Contains no
// repository identity, so it is safe to persist between runs.
export function skipSignature(skipped = []) {
  return (Array.isArray(skipped) ? skipped : [])
    .filter((entry) => Number.isInteger(entry?.projectId))
    .map((entry) => `${entry.projectId}:${entry.reason}`)
    .sort()
    .join(",");
}

// Notify only when the skipped set actually changed. An empty signature means
// nothing was skipped: it re-arms the alert, so the same set skipping again
// later notifies once more instead of staying silent forever.
export function shouldNotify({ signature = "", previousSignature = null } = {}) {
  if (!signature) return false;
  return signature !== previousSignature;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char]);
}

export function buildAlertSubject(skipped = []) {
  const count = Array.isArray(skipped) ? skipped.length : 0;
  return count === 1
    ? "Portfolio sync: 1 tagged project was skipped"
    : `Portfolio sync: ${count} tagged projects were skipped`;
}

// `names` maps a numeric projectId to a "owner/repo" string when it could be
// resolved. Every skipped entry appears in the body either way.
export function buildAlertHtml({ skipped = [], names = new Map() } = {}) {
  const rows = (Array.isArray(skipped) ? skipped : []).map((entry) => {
    const fullName = names instanceof Map ? names.get(entry.projectId) : undefined;
    const label = fullName ? escapeHtml(fullName) : `projectId ${entry.projectId}`;
    const link = fullName ? `https://github.com/${escapeHtml(fullName)}` : null;
    const name = link ? `<a href="${link}">${label}</a>` : label;
    return `<tr><td style="padding:6px 12px 6px 0">${name}</td>` +
      `<td style="padding:6px 12px 6px 0"><code>${escapeHtml(entry.reason)}</code></td>` +
      `<td style="padding:6px 0">${escapeHtml(describeReason(entry.reason))}</td></tr>`;
  });
  return [
    "<h2>Portfolio sync: tagged projects were skipped</h2>",
    "<p>These repositories carry the portfolio topic but were not synced on the last run. " +
      "Nothing was published for them, and no published project was removed.</p>",
    "<table><thead><tr><th align=\"left\">Repository</th><th align=\"left\">Reason</th>" +
      "<th align=\"left\">What it means</th></tr></thead><tbody>",
    rows.join(""),
    "</tbody></table>",
  ].join("\n");
}

// Resolves numeric repository ids to "owner/repo". Best-effort: a failed lookup
// is reported as null rather than aborting the alert.
export async function resolveRepositoryNames({ fetchImpl, token, ids = [], userAgent = "OniLabs-Portfolio-Sync/1.0" } = {}) {
  const names = new Map();
  if (typeof fetchImpl !== "function" || !token) return names;
  for (const id of ids) {
    try {
      const response = await fetchImpl(`https://api.github.com/repositories/${id}`, {
        headers: { Accept: "application/vnd.github+json", "User-Agent": userAgent, Authorization: `Bearer ${token}` },
      });
      if (!response?.ok) continue;
      const body = await response.json();
      if (typeof body?.full_name === "string" && body.full_name) names.set(id, body.full_name);
    } catch {
      // Best-effort only: an unresolved name still appears as a numeric id.
    }
  }
  return names;
}

// Sends the alert. Returns { ok, status, skipped: true } and never throws, so a
// mail outage can never abort the sync that produced it.
export async function sendAlertEmail({
  fetchImpl,
  apiKey,
  from,
  to,
  subject,
  html,
  idempotencyKey = null,
  userAgent = "OniLabs-Portfolio-Sync/1.0",
} = {}) {
  if (typeof fetchImpl !== "function") return { ok: false, status: null, reason: "no-fetch" };
  if (!apiKey || !from || !to || !subject) return { ok: false, status: null, reason: "missing-config" };
  const headers = {
    // Required by Resend: a request without User-Agent is rejected with 403.
    "User-Agent": userAgent,
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };
  if (idempotencyKey) headers["Idempotency-Key"] = idempotencyKey.slice(0, 256);
  try {
    const response = await fetchImpl(RESEND_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify({ from, to: [to], subject, html }),
    });
    return { ok: Boolean(response?.ok), status: response?.status ?? null };
  } catch (error) {
    return { ok: false, status: null, reason: error?.message ?? "fetch-failed" };
  }
}

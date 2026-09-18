// Compatibility facade for the Vercel deployment discovery split.
//
// The former single module now lives in two cohesive pieces:
//   - vercel-projects.mjs: paginated project listing and the shared Vercel
//     HTTP helpers.
//   - vercel-project-match.mjs: project normalization, GitHub-repository
//     matching and hostname validation.
//   - vercel-production.mjs: production deployment resolution (READY check)
//     and production URL / allowed-origin selection.
//
// This facade re-exports the previous public API unchanged so existing
// imports (tests and external consumers) keep working.
export {
  normalizeVercelRepoRef,
  normalizeProject,
  listVercelProjects,
  matchVercelProject,
} from "./vercel-projects.mjs";
export {
  resolveProductionDeployment,
  pickProductionUrl,
  deriveAllowedOrigins,
} from "./vercel-production.mjs";

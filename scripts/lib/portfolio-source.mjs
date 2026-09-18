// Compatibility facade for the portfolio-source split.
//
// The former single module now lives in three cohesive pieces:
//   - portfolio-registry.mjs: source loading from the three registries,
//     validation and the approved-source gate.
//   - portfolio-source-resolution.mjs: deterministic discovery/manual merge
//     and the fail-closed discovery gates.
//   - portfolio-record.mjs: GitHub metadata / public production HTML
//     fetching and deterministic public-record building.
//
// This facade re-exports the previous public API unchanged so existing
// imports (scripts/sync-portfolio.mjs and the test seam) keep working.
export { loadSources } from "./portfolio-registry.mjs";
export {
  mergeSources,
  resolveSyncSources,
  resolveDiscoveryGate,
} from "./portfolio-source-resolution.mjs";
export {
  fetchRepoMetadata,
  fetchProductionHtml,
  buildRecord,
} from "./portfolio-record.mjs";

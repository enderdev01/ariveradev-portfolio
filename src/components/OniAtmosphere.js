import { useCallback, useEffect, useRef } from "react";

import { ONI } from "../effects/oni/config";
import useSectionIntensity from "../effects/oni/useSectionIntensity";
import useAttractors from "../effects/oni/useAttractors";

// Client-only wrapper around the WebGL atmosphere. Kept deliberately thin: it
// owns mounting, the reduced-motion preference, the scroll binding and
// teardown, nothing visual.
//
// The canvas is fixed to the viewport rather than living inside one section, so
// a single field carries across the whole page and only its character changes
// per section. That requires the sections above it to be transparent — an
// opaque section background hides the layer completely.
export default function OniAtmosphere() {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);

  const handleScroll = useCallback(({ intensity, heroCoverage }) => {
    const engine = engineRef.current;
    if (!engine) return;
    engine.setIntensity(intensity);
    // The density well follows the hero copy and dissolves with it.
    engine.setSafeStrength(ONI.safeZone.strength * heroCoverage);
  }, []);

  useSectionIntensity(handleScroll);

  const getEngine = useCallback(() => engineRef.current, []);
  useAttractors(getEngine);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    let engine = null;
    let cancelled = false;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    const mount = async () => {
      const { default: OniAtmosphereEngine } = await import(
        "../effects/oni/Atmosphere"
      );
      if (cancelled) return;

      engine = new OniAtmosphereEngine(canvas, {
        intensity: ONI.sections.hero,
        reducedMotion: media.matches,
      });
      if (!engine.enabled) {
        engine = null;
        return;
      }
      engineRef.current = engine;
      engine.start();

      // Dev-only handle. Tuning this field means watching it move, so keep the
      // instance reachable from the console. Stripped from production builds.
      if (process.env.NODE_ENV !== "production") {
        window.__oni = engine;
      }
    };

    // A change in the preference rebuilds the field, since particle count and
    // time scale are both baked in at construction.
    const onPreferenceChange = () => {
      if (engine) {
        engine.dispose();
        engine = null;
        engineRef.current = null;
      }
      mount();
    };

    mount();
    media.addEventListener?.("change", onPreferenceChange);

    return () => {
      cancelled = true;
      media.removeEventListener?.("change", onPreferenceChange);
      if (engine) engine.dispose();
      engineRef.current = null;
      if (process.env.NODE_ENV !== "production" && window.__oni) {
        delete window.__oni;
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 h-full w-full pointer-events-none"
      aria-hidden="true"
    />
  );
}

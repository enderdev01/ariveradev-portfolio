// Ink Field shader — a breathing sumi-e haze layer rendered on a fullscreen
// quad behind the particles. Built from existing background/surface/ink colors
// only. Pure procedural fbm, extremely slow motion (spec §10).

export const inkVertex = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

export const inkFragment = /* glsl */ `
  precision highp float;

  varying vec2 vUv;

  uniform float uTime;
  uniform float uOpacity;
  uniform float uScale;
  uniform float uLacunarity;
  uniform float uPresenceStrength;
  uniform float uPresencePeriod;
  uniform float uPresenceWarp;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float amp = 0.5;
    float freq = 1.0;
    for (int i = 0; i < 4; i++) {
      v += amp * noise(p * freq);
      freq *= uLacunarity;
      amp *= 0.55;
    }
    return v;
  }

  // ---- ONI PRESENCE ------------------------------------------------------
  // Not a drawing. The whole point is pareidolia: the viewer should think
  // "something is there" and never be able to point at a figure.
  //
  // Three rules keep it from becoming an illustration:
  //   1. Symmetry is free. Mirroring x means one horn and one hollow are
  //      authored and two appear, which is what the eye latches onto.
  //   2. The hollows are SUBTRACTED, never drawn. Painted eyes read as a face
  //      instantly; absences read as depth.
  //   3. The sample point is warped by the same fbm as the ink, so the form
  //      never has a clean edge and dissolves into the plume it lives in.
  float presence(vec2 uv, float seed) {
    vec2 s = vec2(abs(uv.x - 0.5), uv.y);

    float cy = 0.40 + hash(vec2(seed, 5.1)) * 0.18;
    float scale = 1.7 + hash(vec2(seed, 9.7)) * 0.9;
    s.x /= scale;
    s.y = (s.y - cy) / scale + 0.5;

    // Brow: a wide low mass, heavier at the centre.
    float brow = smoothstep(
      0.22, 0.0,
      abs(s.y - 0.5) * 3.0 + max(s.x - 0.17, 0.0) * 2.4
    );

    // Horn: rises outward from the brow and tapers. Mirrored into a pair.
    vec2 hp = s - vec2(0.12, 0.50);
    hp = vec2(hp.x * 0.86 - hp.y * 0.51, hp.x * 0.51 + hp.y * 0.86);
    float horn = smoothstep(
      0.08, 0.0,
      length(vec2(hp.x * 3.6, max(hp.y, 0.0) * 1.05))
    );

    // Hollow where an eye would be. Removed from the mass, never added to it.
    float hollow = smoothstep(
      0.08, 0.0,
      length((s - vec2(0.078, 0.545)) * vec2(1.5, 2.5))
    );

    return clamp(max(brow, horn) - hollow * 0.95, 0.0, 1.0);
  }


  void main() {
    vec2 p = vUv * uScale;
    // Offset the sample field in a slow orbital path so the mass deforms.
    float t = uTime * 0.05;
    p += vec2(sin(t * 0.8) * 0.4, cos(t * 0.6) * 0.4);

    float n = fbm(p);
    // Two-lobe breathing: a slow large plume + a smaller counter-plume that
    // periodically coalesces near the center (suggests presence, spec §11).
    float breath = 0.5 + 0.5 * sin(uTime * 0.12);
    float plume1 = smoothstep(0.35, 0.75, n) * (0.6 + 0.4 * breath);
    float plume2 = smoothstep(0.55, 0.85, fbm(p * 0.6 + 7.3)) * 0.35;

    float ink = clamp(plume1 + plume2, 0.0, 1.0);

    // The presence surfaces rarely and briefly: one appearance per long cycle,
    // each with a different height and scale so it is never the same shape
    // twice. Fading in and out slowly is what keeps it ambiguous — a form that
    // snaps into view invites the eye to read it.
    float cycle = uTime / uPresencePeriod;
    float idx = floor(cycle);
    float ph = fract(cycle);
    float env = smoothstep(0.02, 0.13, ph) * smoothstep(0.30, 0.17, ph);
    if (env > 0.001) {
      vec2 warped = vUv + (vec2(fbm(p * 1.7), fbm(p * 1.7 + 19.1)) - 0.5)
        * uPresenceWarp;
      // Damped by the plume it lives in, but not erased by it: weighting the
      // form by the raw noise made it surface only where the noise peaked.
      float form = presence(warped, idx) * (0.5 + 0.5 * n);
      ink = clamp(ink + form * env * uPresenceStrength, 0.0, 1.0);
    }

    // Sumi-e depth needs both directions around the ground tone: masses that
    // sink below #080616 read as pigment, lifts above it read as suspended
    // haze. Both are derived from the existing background/surface tokens.
    // Kept at the same ratio to the ground as the slate palette they replace:
    // deep sits at ~53% of the ground, haze at the surface-alt step above it.
    vec3 deep = vec3(0.017, 0.013, 0.046); // below the #080616 ground
    vec3 haze = vec3(0.090, 0.185, 0.585); // surface-alt (#162E93) lift
    float lift = smoothstep(0.15, 0.85, plume2 * 2.2 + breath * 0.25);
    vec3 col = mix(deep, haze, lift);

    float alpha = ink * uOpacity;

    gl_FragColor = vec4(col, alpha);
  }
`;

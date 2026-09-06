// GLSL for the Oni particle field. Every particle is a procedural silhouette,
// never a disc: ink motes are dried splatters with bitten edges and the odd
// satellite speck, brush fragments are bent fibres with uneven thickness and
// frayed ends, ash is soft suspended matter, glow is a rare dim accent. The
// kind (0..3) travels as a per-particle attribute so one draw call renders the
// whole mix.
//
// The governing constraint: a point sprite only reads as a shape if it is big
// enough to show one. Silhouette detail here is sized against a power-law size
// distribution on the CPU side, where a minority of large particles carry the
// material identity and the small ones fill the field.

export const particleVertex = /* glsl */ `
  attribute float aKind;
  attribute float aSize;
  attribute vec3 aColor;
  attribute float aSeed;

  uniform float uPixelRatio;
  uniform float uMaxSize;
  uniform float uIntensity;
  uniform vec4 uSafe;         // xy = center in NDC, zw = half extents
  uniform float uSafeStrength;
  uniform vec2 uDepthRange;   // view-space distance of the near / far plane
  uniform float uDepthFade;

  varying float vKind;
  varying vec3 vColor;
  varying float vSeed;
  varying float vFade;

  void main() {
    vKind = aKind;
    vColor = aColor;
    vSeed = aSeed;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = clamp(
      aSize * uPixelRatio * (300.0 / max(-mvPosition.z, 0.001)),
      1.0,
      uMaxSize
    );

    // Reduced-density well around the copy. Fades rather than clears, so the
    // field still reads as one continuous atmosphere behind the text.
    vec2 ndc = gl_Position.xy / max(gl_Position.w, 0.0001);
    vec2 d = abs(ndc - uSafe.xy) / max(uSafe.zw, vec2(0.0001));
    float inside = 1.0 - smoothstep(0.65, 1.0, max(d.x, d.y));

    // Atmospheric perspective: the back of the field sits further into the
    // haze. Depth testing is off, so this gradient is the only cue that the
    // field has thickness at all — without it 800 particles read as one plane.
    float depth = clamp(
      (-mvPosition.z - uDepthRange.x) / max(uDepthRange.y - uDepthRange.x, 0.0001),
      0.0,
      1.0
    );
    float haze = mix(1.0, 1.0 - uDepthFade, smoothstep(0.0, 1.0, depth));

    vFade = uIntensity * mix(1.0, 1.0 - uSafeStrength, inside) * haze;
  }
`;

export const particleFragment = /* glsl */ `
  precision highp float;

  uniform float uPetalShare;
  uniform float uOpacity;

  varying float vKind;
  varying vec3 vColor;
  varying float vSeed;
  varying float vFade;

  const float TAU = 6.2831853;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  // Per-particle random draw. Every call with a distinct key is an independent
  // property of this particle, stable for its whole life.
  float h(float key) {
    return hash(vec2(vSeed, key));
  }

  vec2 rot(vec2 p, float a) {
    float c = cos(a), s = sin(a);
    return mat2(c, -s, s, c) * p;
  }

  // Reversed ramp: 1 at or inside the inner edge, 0 at or outside the outer.
  // Written out rather than calling smoothstep(outer, inner, x), because the
  // GLSL ES spec leaves smoothstep undefined when edge0 >= edge1 — most drivers
  // happen to do the right thing, but that is luck, not a contract.
  float band(float outer, float inner, float x) {
    float t = clamp((x - outer) / (inner - outer), 0.0, 1.0);
    return t * t * (3.0 - 2.0 * t);
  }

  // Soft-edged disc coverage: 1 inside, 0 outside.
  float disc(vec2 p, vec2 c, float r, float e) {
    return band(r, r - e, length(p - c));
  }

  // ---- INK MOTE ----------------------------------------------------------
  // A dried splatter. Deliberately LOW angular frequency: high-frequency radial
  // lobes plus a bright centre is the recipe for a snowflake. Irregularity
  // comes from an off-centre body, three low harmonics, two concave bites and
  // an occasional satellite speck thrown clear of the main mass.
  float inkMote(vec2 p) {
    float s1 = h(1.1), s2 = h(2.3), s3 = h(3.7);
    float s4 = h(4.9), s5 = h(5.3), s6 = h(6.1);

    // Two behaviours in one family: compact drops and open, ragged ones.
    float open = step(0.52, s6);

    vec2 off = (vec2(s1, s2) - 0.5) * 0.13;
    vec2 q = p - off;
    float rr = length(q);
    float ang = atan(q.y, q.x);

    float base = 0.19 + s3 * 0.17;
    float wob = mix(0.17, 0.31, open);
    float radius = base * (
      1.0
      + wob * sin(ang + s1 * TAU)
      + wob * 0.62 * sin(2.0 * ang + s2 * TAU)
      + wob * 0.34 * sin(3.0 * ang + s4 * TAU)
    );

    // Tight edge: pigment has a boundary, it does not glow outward.
    float body = band(radius, radius - 0.035, rr);

    // Bites. Without them the outline closes into an oval and reads as a dot.
    float ba = s4 * TAU;
    vec2 c1 = off + vec2(cos(ba), sin(ba)) * base * 0.95;
    body *= 1.0 - disc(p, c1, base * (0.44 + 0.30 * open), 0.045) * 0.95;

    float bb = ba + 2.0 + s5 * 2.6;
    vec2 c2 = off + vec2(cos(bb), sin(bb)) * base * 0.86;
    body *= 1.0 - disc(p, c2, base * 0.36, 0.04) * (0.5 + 0.45 * open);

    // Satellite speck: the fleck that broke away when the drop landed.
    float sa = s5 * TAU;
    vec2 sp = off + vec2(cos(sa), sin(sa)) * (base + 0.15);
    float sat = disc(p, sp, 0.028 + s3 * 0.028, 0.02) * step(0.5, s2);

    return max(body, sat * 0.8);
  }

  // ---- PETAL ---------------------------------------------------------------
  // The second silhouette of the ink family, taken from the geometry of a
  // peony petal rather than from any flower as a motif: narrow base, belly
  // past the middle, defined tip, a midrib that curves, and two sides of
  // different width. Nothing here is radially symmetric and nothing reads as
  // a blossom on its own — it is a petal-shaped piece of pigment.
  //
  // The whole shape is kept inside a disc of radius 0.5 so that an arbitrary
  // rotation never clips against the square sprite.
  float petal(vec2 p) {
    float s1 = h(20.1), s2 = h(21.3), s3 = h(22.7), s4 = h(23.9);

    vec2 q = rot(p, s1 * TAU);
    q.y += 0.30;                      // grow upward from a base below centre

    float len = 0.60 + s2 * 0.13;
    float t = q.y / len;
    if (t < 0.0 || t > 1.0) return 0.0;

    // Midrib: straight at the base, curving harder toward the tip.
    float axis = (s3 - 0.5) * 0.26 * t * t;

    // Width profile. The exponents put the belly at t ~ 0.43; the factor 2.0
    // renormalises the peak back to wMax.
    float wMax = 0.17 + s4 * 0.07;
    float w = wMax * 2.0 * pow(max(t, 1e-4), 0.45) * pow(max(1.0 - t, 1e-4), 0.6);

    // Uneven sides, and an edge that wavers rather than running true.
    float asym = 0.18 + s3 * 0.18;
    float d = q.x - axis;
    float halfW = w * (d < 0.0 ? 1.0 + asym : 1.0 - asym);
    halfW *= 1.0 + 0.14 * sin(t * 6.0 + s4 * TAU);
    halfW = max(halfW, 0.0025);

    float body = band(halfW, halfW * 0.72, abs(d));

    // A faint midrib: the one place a petal is denser than its blade.
    float rib = band(halfW * 0.16, 0.0, abs(d)) * band(1.0, 0.55, t) * 0.22;

    return min(body + rib * body, 1.0);
  }

  // ---- BRUSH FRAGMENT ----------------------------------------------------
  // A bent fibre, not a line segment: the spine curves, thickness wobbles
  // along the length, the two ends taper at different rates, and the pigment
  // sometimes runs out mid-stroke.
  float brush(vec2 p) {
    float s1 = h(7.1), s2 = h(8.3), s3 = h(9.7), s4 = h(10.1);

    vec2 q = rot(p, s1 * TAU);
    float halfLen = 0.28 + s2 * 0.18;
    float t = q.x / halfLen;
    if (abs(t) > 1.0) return 0.0;

    float bend = 0.055 * sin(t * 1.7 + s3 * TAU) * (1.0 - t * t);
    float d = abs(q.y - bend);

    // Asymmetric tapers: one end runs out, the other is a blunt landing.
    // Exponents below 1 keep the middle of the stroke fat and pull the taper
    // into the tips, which is how a loaded brush actually lays pigment down.
    float endA = pow(max(1.0 - max(t, 0.0), 1e-4), 0.35 + s3 * 0.4);
    float endB = pow(max(1.0 + min(t, 0.0), 1e-4), 0.45 + s4 * 0.45);
    float wobble = 0.60
      + 0.25 * sin(t * 5.3 + s3 * TAU)
      + 0.15 * sin(t * 11.0 + s4 * TAU);
    // Half-width, in sprite units. This has to stay well clear of a pixel:
    // a stroke thinner than the rasterizer's sample grid renders as nothing,
    // and a quarter of the field silently disappears.
    float th = (0.075 + s2 * 0.055) * endA * endB * max(wobble, 0.55);
    th = max(th, 0.006);

    float stroke = band(th, th * 0.3, d);

    // Dry-brush break somewhere along the stroke.
    float gapAt = s4 * 1.4 - 0.7;
    float gap = band(0.11, 0.0, abs(t - gapAt)) * step(0.58, s3);

    return stroke * (1.0 - gap * 0.85);
  }

  // ---- ASH ---------------------------------------------------------------
  // Squashed and tilted, with a long soft falloff: suspended matter, not a
  // bead. Small and dim enough that it never dominates the field.
  float ash(vec2 p) {
    vec2 q = rot(p, h(12.1) * TAU);
    q.y /= 0.55 + h(13.3) * 0.35;
    return band(0.33, 0.02, length(q)) * 0.5;
  }

  // ---- GLOW --------------------------------------------------------------
  // Tiny and dim, with barely any halo. A bright point with a bloom is what
  // turns a pigment field into a star field.
  float glowFleck(vec2 p) {
    float r = length(p);
    return band(0.13, 0.0, r) * 0.55 + band(0.28, 0.0, r) * 0.08;
  }

  void main() {
    vec2 p = gl_PointCoord - 0.5;

    float alpha;
    if (vKind < 0.5) {
      // Two silhouettes inside one family, split per particle and stable for
      // its lifetime — the same trick the mote already uses for compact vs
      // open. Keeps the mix ratios and the fill-rate budget untouched.
      float form = h(19.3);
      float a;
      if (form < uPetalShare) a = petal(p);
      else a = inkMote(p);
      alpha = a * (0.66 + 0.26 * h(14.7));
    } else if (vKind < 1.5) {
      alpha = brush(p) * (0.55 + 0.25 * h(15.9));
    } else if (vKind < 2.5) {
      alpha = ash(p);
    } else {
      alpha = glowFleck(p);
    }

    alpha *= vFade * uOpacity;
    if (alpha <= 0.004) discard;

    gl_FragColor = vec4(vColor, alpha);
  }
`;

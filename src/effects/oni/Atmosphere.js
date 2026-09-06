import { Scene } from "three/src/scenes/Scene.js";
import { PerspectiveCamera } from "three/src/cameras/PerspectiveCamera.js";
import { WebGLRenderer } from "three/src/renderers/WebGLRenderer.js";
import { BufferGeometry } from "three/src/core/BufferGeometry.js";
import { BufferAttribute } from "three/src/core/BufferAttribute.js";
import { ShaderMaterial } from "three/src/materials/ShaderMaterial.js";
import { Points } from "three/src/objects/Points.js";
import { Mesh } from "three/src/objects/Mesh.js";
import { PlaneGeometry } from "three/src/geometries/PlaneGeometry.js";
import { Color } from "three/src/math/Color.js";
import { Vector2 } from "three/src/math/Vector2.js";
import { Vector4 } from "three/src/math/Vector4.js";
import { NormalBlending } from "three/src/constants.js";

import { ONI } from "./config";
import { particleVertex, particleFragment } from "./shaders/particles";
import { inkVertex, inkFragment } from "./shaders/ink";

// Stride of the CPU-side particle state buffer.
const S_X = 0;
const S_Y = 1;
const S_Z = 2;
const S_VX = 3;
const S_VY = 4;
const S_KIND = 5;
const S_SPEED = 6;
const STRIDE = 7;

const KIND_INK = 0;
const KIND_BRUSH = 1;
const KIND_ASH = 2;
const KIND_GLOW = 3;

// Seeded 2D gradient noise. Seeded so the field is identical across reloads
// and across resizes, which keeps the drift from visibly re-rolling.
function makeNoise(seed) {
  let s = (seed >>> 0) || 1;
  const rnd = () => {
    s ^= s << 13; s >>>= 0;
    s ^= s >>> 17;
    s ^= s << 5; s >>>= 0;
    return s / 4294967296;
  };

  const gx = new Float32Array(256);
  const gy = new Float32Array(256);
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) {
    p[i] = i;
    const a = rnd() * Math.PI * 2;
    gx[i] = Math.cos(a);
    gy[i] = Math.sin(a);
  }
  for (let i = 255; i > 0; i--) {
    const j = (rnd() * (i + 1)) | 0;
    const t = p[i]; p[i] = p[j]; p[j] = t;
  }
  const perm = new Uint16Array(512);
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];

  const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);

  return function noise2(x, y) {
    const fx0 = Math.floor(x);
    const fy0 = Math.floor(y);
    const X = fx0 & 255;
    const Y = fy0 & 255;
    const dx = x - fx0;
    const dy = y - fy0;
    const u = fade(dx);
    const v = fade(dy);

    const aa = perm[perm[X] + Y];
    const ba = perm[perm[X + 1] + Y];
    const ab = perm[perm[X] + Y + 1];
    const bb = perm[perm[X + 1] + Y + 1];

    const n00 = gx[aa] * dx + gy[aa] * dy;
    const n10 = gx[ba] * (dx - 1) + gy[ba] * dy;
    const n01 = gx[ab] * dx + gy[ab] * (dy - 1);
    const n11 = gx[bb] * (dx - 1) + gy[bb] * (dy - 1);

    const l0 = n00 + u * (n10 - n00);
    const l1 = n01 + u * (n11 - n01);
    return l0 + v * (l1 - l0);
  };
}

export default class OniAtmosphere {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {{ intensity?: number, reducedMotion?: boolean }} [options]
   */
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.noise = makeNoise(0x6f6e69);
    this.enabled = false;
    this.rafId = null;
    this.clock = 0;
    this.lastTime = 0;
    this.intensity = options.intensity ?? ONI.sections.hero;
    this.targetIntensity = this.intensity;
    this.safeStrength = ONI.safeZone.strength;
    this.targetSafeStrength = this.safeStrength;
    this.reducedMotion = Boolean(options.reducedMotion);

    // Pointer state, in world units. `raw` is the latest sample, `x/y` is the
    // eased value the field actually reacts to.
    this.pointer = {
      x: 0, y: 0, rawX: 0, rawY: 0,
      vx: 0, vy: 0, speed: 0,
      active: false, lastMove: 0,
    };

    // A soft attractor parked on whatever element the pointer is hovering.
    // Strength is eased in and out so the flow bends toward the element and
    // relaxes back rather than snapping.
    this.attractor = { x: 0, y: 0, strength: 0, target: 0, radius: 0 };

    this._init();
  }

  // ---- lifecycle -----------------------------------------------------------

  _init() {
    try {
      if (!this._supportsWebGL()) return;

      this.renderer = new WebGLRenderer({
        canvas: this.canvas,
        antialias: false,
        alpha: true,
        powerPreference: "low-power",
      });
      this.renderer.setClearColor(0x000000, 0);

      this.scene = new Scene();
      this.camera = new PerspectiveCamera(
        ONI.camera.fov,
        1,
        ONI.camera.near,
        ONI.camera.far
      );
      this.camera.position.set(0, 0, ONI.camera.distance);

      this._measure();

      // Ink field: a fullscreen quad whose vertex shader writes clip space
      // directly, so it is camera independent. renderOrder keeps it behind the
      // particles (both have depth testing off).
      this.inkMaterial = new ShaderMaterial({
        vertexShader: inkVertex,
        fragmentShader: inkFragment,
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: NormalBlending,
        uniforms: {
          uTime: { value: 0 },
          uOpacity: { value: ONI.inkField.opacity },
          uScale: { value: ONI.inkField.scale },
          uLacunarity: { value: ONI.inkField.lacunarity },
          uPresenceStrength: {
            value:
              ONI.presence.strength *
              (this.reducedMotion ? ONI.presence.reducedMotionScale : 1),
          },
          uPresencePeriod: { value: ONI.presence.period },
          uPresenceWarp: { value: ONI.presence.warp },
        },
      });
      this.inkQuad = new Mesh(new PlaneGeometry(2, 2), this.inkMaterial);
      this.inkQuad.frustumCulled = false;
      this.inkQuad.renderOrder = 0;
      this.scene.add(this.inkQuad);

      this.particleMaterial = new ShaderMaterial({
        vertexShader: particleVertex,
        fragmentShader: particleFragment,
        transparent: true,
        depthWrite: false,
        depthTest: false,
        // Source-over, not additive: pigment paints, it does not glow. Additive
        // could only ever lighten the ground, which flattened every silhouette
        // to the same grey wherever sprites overlapped.
        blending: NormalBlending,
        uniforms: {
          uPixelRatio: { value: 1 },
          uMaxSize: { value: ONI.particle.maxScreenSize },
          uOpacity: { value: ONI.particle.opacity },
          uIntensity: { value: this.intensity },
          uSafe: {
            value: new Vector4(
              ONI.safeZone.x,
              ONI.safeZone.y,
              ONI.safeZone.halfW,
              ONI.safeZone.halfH
            ),
          },
          uSafeStrength: { value: ONI.safeZone.strength },
          uPetalShare: { value: ONI.petalShare },
          // The field is centered on z=0 and spans ONI.camera.depth, so in view
          // space it runs from (distance - depth/2) to (distance + depth/2).
          // Derived here rather than in the shader: the camera never moves, so
          // there is nothing to recompute per frame.
          uDepthRange: {
            value: new Vector2(
              ONI.camera.distance - ONI.camera.depth * 0.5,
              ONI.camera.distance + ONI.camera.depth * 0.5
            ),
          },
          uDepthFade: { value: ONI.particle.depthFade },
        },
      });

      this._buildParticles();
      this._applyPixelRatio();

      this.enabled = true;
      this._bind();
    } catch (error) {
      console.error("[OniAtmosphere] init failed", error);
      this.enabled = false;
    }
  }

  _supportsWebGL() {
    // Probe on a throwaway canvas: calling getContext on the real canvas would
    // lock in attributes that differ from the ones WebGLRenderer requests.
    try {
      const probe = document.createElement("canvas");
      return Boolean(
        probe.getContext("webgl2") ||
          probe.getContext("webgl") ||
          probe.getContext("experimental-webgl")
      );
    } catch {
      return false;
    }
  }

  start() {
    if (!this.enabled || this.rafId !== null) return;
    this.lastTime = performance.now();
    const loop = () => {
      this._frame();
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }

  stop() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  dispose() {
    this.stop();
    this._unbind();

    if (this.points) {
      this.scene.remove(this.points);
      this.points.geometry.dispose();
      this.points = null;
    }
    if (this.inkQuad) {
      this.scene.remove(this.inkQuad);
      this.inkQuad.geometry.dispose();
      this.inkQuad = null;
    }
    if (this.particleMaterial) {
      this.particleMaterial.dispose();
      this.particleMaterial = null;
    }
    if (this.inkMaterial) {
      this.inkMaterial.dispose();
      this.inkMaterial = null;
    }
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.forceContextLoss?.();
      this.renderer = null;
    }
    this.enabled = false;
  }

  // ---- sizing and quality --------------------------------------------------

  _pickQuality() {
    const coarse =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(pointer: coarse)").matches;
    const small = this.cssWidth < 820;
    if (coarse || small) return ONI.quality.low;
    if (this.cssWidth < 1440) return ONI.quality.medium;
    return ONI.quality.high;
  }

  // Derives the world extents from the perspective camera so the field always
  // covers the viewport, whatever the aspect ratio.
  _measure() {
    this.cssWidth = Math.max(this.canvas.clientWidth, 1);
    this.cssHeight = Math.max(this.canvas.clientHeight, 1);

    this.camera.aspect = this.cssWidth / this.cssHeight;
    this.camera.updateProjectionMatrix();

    const halfFov = (ONI.camera.fov * Math.PI) / 360;
    this.worldHeight = 2 * ONI.camera.distance * Math.tan(halfFov);
    this.worldWidth = this.worldHeight * this.camera.aspect;

    this.halfW = (this.worldWidth * ONI.camera.margin) / 2;
    this.halfH = (this.worldHeight * ONI.camera.margin) / 2;

    // Pixel -> world scale, used to keep the cursor radius perceptually stable.
    this.pxToWorld = this.worldWidth / this.cssWidth;
    this.cursorRadius = ONI.cursor.radiusPx * this.pxToWorld;
  }

  _applyPixelRatio() {
    const quality = this._pickQuality();
    const pr = Math.min(window.devicePixelRatio || 1, quality.pixelRatioCap);
    this.renderer.setPixelRatio(pr);
    this.renderer.setSize(this.cssWidth, this.cssHeight, false);
    this.particleMaterial.uniforms.uPixelRatio.value = pr;
  }

  resize() {
    if (!this.enabled) return;
    const previousQuality = this.quality;
    this._measure();
    this._applyPixelRatio();
    // Only rebuild the field when the tier actually changed; a plain resize
    // just re-frames the same particles.
    if (this._pickQuality() !== previousQuality) this._buildParticles();
  }

  // ---- particle field ------------------------------------------------------

  _buildParticles() {
    const quality = this._pickQuality();
    this.quality = quality;

    const area = this.cssWidth * this.cssHeight;
    const raw = (area / 10000) * ONI.particle.densityPerMpx;
    let count = Math.round(
      Math.max(
        ONI.particle.minCount,
        Math.min(ONI.particle.maxCount, raw)
      ) * quality.particleScale
    );
    if (this.reducedMotion) {
      count = Math.round(count * ONI.reducedMotion.particleScale);
    }

    const positions = new Float32Array(count * 3);
    const kinds = new Float32Array(count);
    const sizes = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    const state = new Float32Array(count * STRIDE);

    const r = ONI.ratios;
    const c = ONI.colors;
    const inkColor = new Color(c.ink);
    const inkDense = new Color(c.inkDense);
    const ashColor = new Color(c.ash);
    const accentColor = new Color(c.accent);
    const primaryColor = new Color(c.primary);
    const sealColor = new Color(c.seal);
    const scratch = new Color();

    for (let i = 0; i < count; i++) {
      const roll = Math.random();
      let kind;
      if (roll < r.ink) kind = KIND_INK;
      else if (roll < r.ink + r.brush) kind = KIND_BRUSH;
      else if (roll < r.ink + r.brush + r.ash) kind = KIND_ASH;
      else kind = KIND_GLOW;

      const x = (Math.random() * 2 - 1) * this.halfW;
      const y = (Math.random() * 2 - 1) * this.halfH;
      const z = (Math.random() * 2 - 1) * (ONI.camera.depth / 2);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      kinds[i] = kind;
      seeds[i] = Math.random();

      const m = ONI.particle.sizeMinScale;
      const base =
        ONI.particle.size *
        (m + (1 - m) * Math.pow(Math.random(), ONI.particle.sizeBias));
      if (kind === KIND_BRUSH) sizes[i] = base * ONI.particle.brushScale;
      else if (kind === KIND_ASH) sizes[i] = base * ONI.particle.ashScale;
      else if (kind === KIND_GLOW) sizes[i] = base * ONI.particle.glowScale;
      else sizes[i] = base;

      // Color per kind. Variation comes from luminance only — no new hues.
      if (kind === KIND_INK) {
        scratch.copy(Math.random() < 0.68 ? inkColor : inkDense);
      } else if (kind === KIND_BRUSH) {
        scratch.copy(inkColor);
      } else if (kind === KIND_ASH) {
        scratch.copy(ashColor);
      } else {
        const glowRoll = Math.random();
        scratch.copy(
          glowRoll < 0.7 ? accentColor : glowRoll < 0.94 ? primaryColor : sealColor
        );
      }
      scratch.multiplyScalar(0.45 + Math.random() * 0.55);
      colors[i * 3] = scratch.r;
      colors[i * 3 + 1] = scratch.g;
      colors[i * 3 + 2] = scratch.b;

      const s = i * STRIDE;
      state[s + S_X] = x;
      state[s + S_Y] = y;
      state[s + S_Z] = z;
      state[s + S_VX] = 0;
      state[s + S_VY] = 0;
      state[s + S_KIND] = kind;
      state[s + S_SPEED] =
        1 + (Math.random() - 0.5) * ONI.motion.speedVariation;
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(positions, 3));
    geometry.setAttribute("aKind", new BufferAttribute(kinds, 1));
    geometry.setAttribute("aSize", new BufferAttribute(sizes, 1));
    geometry.setAttribute("aColor", new BufferAttribute(colors, 3));
    geometry.setAttribute("aSeed", new BufferAttribute(seeds, 1));

    if (this.points) {
      this.scene.remove(this.points);
      this.points.geometry.dispose();
    }

    this.points = new Points(geometry, this.particleMaterial);
    this.points.frustumCulled = false;
    this.points.renderOrder = 1;
    this.scene.add(this.points);

    this.state = state;
    this.count = count;
    this.geometry = geometry;
  }

  // ---- input ---------------------------------------------------------------

  _bind() {
    this._onResize = () => this.resize();
    this._onPointerMove = (event) => {
      const rect = this.canvas.getBoundingClientRect();
      // NDC, with Y flipped: screen Y grows downward, world Y grows upward.
      const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      this.pointer.rawX = nx * (this.worldWidth / 2);
      this.pointer.rawY = ny * (this.worldHeight / 2);
      this.pointer.active = true;
      this.pointer.lastMove = performance.now();
    };
    this._onPointerLeave = () => {
      this.pointer.active = false;
    };
    this._onVisibility = () => {
      if (document.hidden) this.stop();
      else this.start();
    };

    window.addEventListener("resize", this._onResize);
    window.addEventListener("pointermove", this._onPointerMove, { passive: true });
    window.addEventListener("pointerleave", this._onPointerLeave);
    document.addEventListener("visibilitychange", this._onVisibility);
  }

  _unbind() {
    if (this._onResize) window.removeEventListener("resize", this._onResize);
    if (this._onPointerMove) {
      window.removeEventListener("pointermove", this._onPointerMove);
    }
    if (this._onPointerLeave) {
      window.removeEventListener("pointerleave", this._onPointerLeave);
    }
    if (this._onVisibility) {
      document.removeEventListener("visibilitychange", this._onVisibility);
    }
  }

  // ---- simulation ----------------------------------------------------------

  setIntensity(value) {
    this.targetIntensity = Math.max(0, Math.min(1, value));
  }

  // The reduced-density well exists to protect the hero copy. Every other
  // section lays its text out differently, so the well has to fade out as the
  // hero leaves the viewport instead of punching a hole through the whole page.
  // Point the local flow at an element. Coordinates are viewport pixels; the
  // engine converts them itself so callers never deal in world units.
  setAttractor(clientX, clientY, radiusPx) {
    const rect = this.canvas.getBoundingClientRect();
    const nx = ((clientX - rect.left) / rect.width) * 2 - 1;
    const ny = -(((clientY - rect.top) / rect.height) * 2 - 1);
    this.attractor.x = nx * (this.worldWidth / 2);
    this.attractor.y = ny * (this.worldHeight / 2);
    this.attractor.radius = radiusPx * this.pxToWorld;
    this.attractor.target = 1;
  }

  clearAttractor() {
    this.attractor.target = 0;
  }

  setSafeStrength(value) {
    this.targetSafeStrength = Math.max(0, Math.min(1, value));
  }

  // Divergence-free curl of the scalar noise field: v = (dN/dy, -dN/dx).
  // Two extra samples per axis, so the drift bends around invisible currents
  // instead of following a single gradient.
  _flow(x, y, out) {
    const k = ONI.motion.curlScale;
    const e = ONI.motion.curlEpsilon;
    const drift = this.clock * ONI.motion.fieldDrift;
    const nx = x * k + drift;
    const ny = y * k - drift * 0.6;

    if (!this.quality.curl) {
      // Low tier: one sample, read as a flow angle. Cheaper, still organic.
      const angle = this.noise(nx, ny) * Math.PI * 2;
      out[0] = Math.cos(angle);
      out[1] = Math.sin(angle);
      return;
    }

    const dy = (this.noise(nx, ny + e) - this.noise(nx, ny - e)) / (2 * e);
    const dx = (this.noise(nx + e, ny) - this.noise(nx - e, ny)) / (2 * e);
    out[0] = dy;
    out[1] = -dx;
  }

  _step(dt) {
    const state = this.state;
    const flow = this._flowScratch || (this._flowScratch = [0, 0]);
    const damping = Math.pow(ONI.motion.damping, dt * 60);
    const cursorEnabled =
      this.pointer.active && (!this.reducedMotion || ONI.reducedMotion.cursor);
    const radius = this.cursorRadius;
    const radiusSq = radius * radius;
    const attractStrength = this.attractor.strength;
    const attractRadiusSq = this.attractor.radius * this.attractor.radius;
    // A calmer section is not just a fainter one: drift slows down with it.
    const motionScale =
      ONI.motion.intensityFloor +
      (1 - ONI.motion.intensityFloor) * this.intensity;
    const speedRatio = Math.min(
      this.pointer.speed / ONI.cursor.maxVelocityPx,
      1
    );
    // A still cursor must exert nothing, otherwise it carves a void that
    // follows it around instead of letting the field close back over it.
    const activity = Math.min(
      this.pointer.speed / ONI.cursor.activityFloorPx,
      1
    );

    for (let i = 0; i < this.count; i++) {
      const s = i * STRIDE;
      const x = state[s + S_X];
      const y = state[s + S_Y];
      const kind = state[s + S_KIND];

      this._flow(x, y, flow);

      const kindFactor =
        kind === KIND_BRUSH
          ? ONI.motion.brushSpeedFactor
          : kind === KIND_ASH
          ? ONI.motion.ashSpeedFactor
          : 1;
      const accel =
        ONI.motion.baseSpeed *
        ONI.motion.curlStrength *
        state[s + S_SPEED] *
        kindFactor *
        motionScale;

      let vx = state[s + S_VX] + flow[0] * accel * dt;
      let vy = state[s + S_VY] + flow[1] * accel * dt;

      // Ash keeps a faint vertical bias so it reads as suspended material
      // settling and lifting, rather than pure horizontal drift.
      if (kind === KIND_ASH) {
        vy += Math.sin(this.clock * 0.21 + state[s + S_SPEED] * 6.2831) * 0.12 * dt;
      }

      if (cursorEnabled) {
        const dx = x - this.pointer.x;
        const dy = y - this.pointer.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < radiusSq) {
          const dist = Math.sqrt(distSq) || 0.0001;
          const falloff = 1 - dist / radius;
          const strength =
            (ONI.cursor.repel * activity +
              ONI.cursor.velocityStrength * speedRatio) *
            falloff *
            falloff;
          vx += (dx / dist) * strength * dt;
          vy += (dy / dist) * strength * dt;
        }
      }

      // Hovered element: a gentle pull with a tangential component, so nearby
      // particles drift in and a few skim around the edge instead of every one
      // collapsing onto the centre.
      if (attractStrength > 0.001) {
        const ax = this.attractor.x - x;
        const ay = this.attractor.y - y;
        const aDistSq = ax * ax + ay * ay;
        if (aDistSq < attractRadiusSq) {
          const aDist = Math.sqrt(aDistSq) || 0.0001;
          const fall = 1 - aDist / this.attractor.radius;
          const pull = ONI.attract.strength * attractStrength * fall * fall * dt;
          vx += (ax / aDist) * pull;
          vy += (ay / aDist) * pull;
          // Perpendicular nudge -> a slow orbit rather than a straight fall.
          vx += (-ay / aDist) * pull * ONI.attract.swirl;
          vy += (ax / aDist) * pull * ONI.attract.swirl;
        }
      }

      vx *= damping;
      vy *= damping;

      state[s + S_VX] = vx;
      state[s + S_VY] = vy;

      let nextX = x + vx * dt;
      let nextY = y + vy * dt;

      // Wrap around the padded world box.
      if (nextX > this.halfW) nextX = -this.halfW;
      else if (nextX < -this.halfW) nextX = this.halfW;
      if (nextY > this.halfH) nextY = -this.halfH;
      else if (nextY < -this.halfH) nextY = this.halfH;

      state[s + S_X] = nextX;
      state[s + S_Y] = nextY;
    }
  }

  _syncPositions() {
    const attribute = this.geometry.attributes.position;
    const array = attribute.array;
    for (let i = 0; i < this.count; i++) {
      const s = i * STRIDE;
      array[i * 3] = this.state[s + S_X];
      array[i * 3 + 1] = this.state[s + S_Y];
      array[i * 3 + 2] = this.state[s + S_Z];
    }
    attribute.needsUpdate = true;
  }

  _updatePointer(dt, now) {
    const easing = 1 - Math.pow(1 - ONI.cursor.easing, dt * 60);
    const prevX = this.pointer.x;
    const prevY = this.pointer.y;

    this.pointer.x += (this.pointer.rawX - prevX) * easing;
    this.pointer.y += (this.pointer.rawY - prevY) * easing;

    if (dt > 0) {
      const moved = Math.hypot(this.pointer.x - prevX, this.pointer.y - prevY);
      const px = (moved / this.pxToWorld) / dt;
      // Smooth the reported speed so a single fast sample cannot spike the
      // whole field.
      this.pointer.speed += (px - this.pointer.speed) * 0.2;
    }
    if (now - this.pointer.lastMove > ONI.cursor.idleTimeout) {
      this.pointer.speed *= 0.9;
    }
  }

  _frame() {
    const now = performance.now();
    let dt = (now - this.lastTime) / 1000;
    this.lastTime = now;
    // Clamp so a backgrounded tab cannot teleport the whole field on return.
    dt = Math.min(Math.max(dt, 0), 0.05);
    if (this.reducedMotion) dt *= ONI.reducedMotion.timeScale;
    this.clock += dt;

    this.intensity += (this.targetIntensity - this.intensity) * 0.06;
    this.safeStrength += (this.targetSafeStrength - this.safeStrength) * 0.08;
    this.attractor.strength +=
      (this.attractor.target - this.attractor.strength) * ONI.attract.easing;

    this._updatePointer(dt, now);
    this._step(dt);
    this._syncPositions();

    this.particleMaterial.uniforms.uIntensity.value = this.intensity;
    this.particleMaterial.uniforms.uSafeStrength.value = this.safeStrength;
    this.inkMaterial.uniforms.uTime.value = this.clock;
    this.inkMaterial.uniforms.uOpacity.value =
      ONI.inkField.opacity *
      this.intensity *
      (this.reducedMotion ? ONI.reducedMotion.inkOpacityScale : 1);

    this.renderer.render(this.scene, this.camera);
  }
}

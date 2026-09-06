import { useEffect, useRef, useState } from "react";
import { Scene } from "three/src/scenes/Scene.js";
import { PerspectiveCamera } from "three/src/cameras/PerspectiveCamera.js";
import { WebGLRenderer } from "three/src/renderers/WebGLRenderer.js";
import { BoxGeometry } from "three/src/geometries/BoxGeometry.js";
import { MeshStandardMaterial } from "three/src/materials/MeshStandardMaterial.js";
import { Mesh } from "three/src/objects/Mesh.js";
import { AmbientLight } from "three/src/lights/AmbientLight.js";
import { DirectionalLight } from "three/src/lights/DirectionalLight.js";
import { Color } from "three/src/math/Color.js";

// The ONLY file inside the showcase boundary that imports `three`. Loaded via
// next/dynamic (ssr: false). Imports go through `three/src/*` subpaths so
// webpack tree-shakes the rest of the library away — importing the `three`
// root drags in the full ESM bundle (~160 kB gzip) and blows the 60 kB gzip
// budget (spec T4.4). Scene is deliberately minimal: one box, standard
// material, two lights. No drei, no r3f, no post-processing.
export default function ProjectShowcaseCanvas() {
  const mountRef = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer;
    let rafId;
    let disposed = false;

    try {
      const scene = new Scene();
      scene.background = new Color("#22345E");

      const camera = new PerspectiveCamera(
        45,
        mount.clientWidth / mount.clientHeight,
        0.1,
        100
      );
      camera.position.set(0, 0, 5);

      renderer = new WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      mount.appendChild(renderer.domElement);

      scene.add(new AmbientLight(0xffffff, 0.7));
      const key = new DirectionalLight(0xffffff, 1.2);
      key.position.set(4, 3, 5);
      scene.add(key);

      const geometry = new BoxGeometry(2.1, 2.1, 2.1);
      const material = new MeshStandardMaterial({
        color: new Color("#3E6E96"),
        metalness: 0.55,
        roughness: 0.3,
      });
      const mesh = new Mesh(geometry, material);
      scene.add(mesh);

      let previous = performance.now();
      const animate = (now) => {
        if (disposed) return;
        const dt = Math.min((now - previous) / 1000, 0.1);
        previous = now;
        mesh.rotation.x += dt * 0.5;
        mesh.rotation.y += dt * 0.7;
        renderer.render(scene, camera);
        rafId = requestAnimationFrame(animate);
      };
      rafId = requestAnimationFrame(animate);

      const onResize = () => {
        if (!renderer || !mount) return;
        camera.aspect = mount.clientWidth / mount.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(mount.clientWidth, mount.clientHeight);
      };
      window.addEventListener("resize", onResize);
      mount.__onResize = onResize;
    } catch {
      setFailed(true);
    }

    return () => {
      disposed = true;
      if (rafId) cancelAnimationFrame(rafId);
      if (mount.__onResize) window.removeEventListener("resize", mount.__onResize);
      if (renderer) {
        renderer.dispose();
        if (renderer.domElement.parentNode === mount) {
          mount.removeChild(renderer.domElement);
        }
      }
    };
  }, []);

  if (failed) return null;

  return <div ref={mountRef} className="w-full h-full" />;
}

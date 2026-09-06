import Image from "next/image";

// Static branch for the WebGL showcase. This is the SINGLE fallback for all
// three conditions — reduced-motion, no-WebGL2, and not-yet-in-view — so the
// dynamic import is never requested in those paths. Imports nothing from
// `three`.
export default function ShowcaseFallback({ proyecto }) {
  if (!proyecto?.imagen) return null;

  return (
    <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-border bg-surface">
      <Image
        src={proyecto.imagen}
        alt={`Vista del proyecto ${proyecto.nombre}`}
        fill
        sizes="(min-width: 768px) 768px, 100vw"
        className="object-cover object-top"
      />
    </div>
  );
}

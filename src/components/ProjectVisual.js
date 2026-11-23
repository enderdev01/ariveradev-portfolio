import Image from "next/image";
import ProjectBadges from "./ProjectBadges";

export default function ProjectVisual({
  proyecto,
  sizes = "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw",
  imageClassName = "object-cover",
  showBadges = true,
  // Pass when a visible heading already names the project, so the image is not
  // announced twice.
  decorative = false,
  priority = false,
}) {
  if (proyecto.imagen) {
    return (
      <>
        <Image
          src={proyecto.imagen}
          alt={decorative ? "" : proyecto.nombre}
          fill
          priority={priority}
          sizes={sizes}
          className={imageClassName}
        />
        {showBadges && (
          <div className="absolute left-4 top-4">
            <ProjectBadges proyecto={proyecto} />
          </div>
        )}
      </>
    );
  }

  return (
    <div className="absolute inset-0 flex flex-col justify-between bg-text-primary p-5 text-white">
      <div className="flex justify-between gap-3">
        {showBadges && <ProjectBadges proyecto={proyecto} />}
        <span className="text-xs font-medium text-white/70">Sin imagen</span>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary-soft">
          Onilabs
        </p>
        <p className="mt-2 max-w-[14rem] text-2xl font-bold leading-tight">
          {proyecto.nombre}
        </p>
      </div>
      <div className="grid grid-cols-5 gap-2 opacity-40" aria-hidden="true">
        {Array.from({ length: 10 }).map((_, index) => (
          <span key={index} className="h-2 rounded-sm bg-white" />
        ))}
      </div>
    </div>
  );
}

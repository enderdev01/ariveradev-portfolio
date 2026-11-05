"use client";

import Link from "next/link";
import { proyectosReales } from "../data/onilabs";
import ProjectBadges from "./ProjectBadges";
import ProjectVisual from "./ProjectVisual";
import Reveal from "./Reveal";

export default function FeaturedProjects() {
  const proyectosDestacados = proyectosReales
    .filter((proyecto) => proyecto.estado !== "proximamente" && !proyecto.sinSoporte)
    .slice(0, 3);
  const proyectosMoviles = proyectosDestacados.slice(0, 2);

  return (
    <section id="proyectos" className="w-full bg-background py-16 sm:py-20 lg:py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-10 sm:mb-12 lg:mb-8">
          <Reveal blur>
            <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-3">
              Nuestro trabajo
            </p>
          </Reveal>
          <Reveal blur delay={90}>
            <h2 className="mb-4 text-2xl sm:text-4xl md:text-5xl lg:text-4xl font-bold text-text-primary">
              Portfolio
            </h2>
          </Reveal>
          <Reveal delay={180}>
            <p className="mx-auto max-w-2xl text-base sm:text-lg text-text-secondary leading-relaxed">
              Proyectos reales que hemos desarrollado para nuestros clientes
            </p>
          </Reveal>
        </div>

        <Reveal className="sm:hidden space-y-5">
          {proyectosMoviles.map((proyecto) => (
            <a
              key={proyecto.id}
              href={proyecto.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block overflow-hidden rounded-xl border border-border bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-surface">
                <ProjectVisual
                  proyecto={proyecto}
                  sizes="(max-width: 639px) calc(100vw - 3rem), 1px"
                  showBadges={false}
                />
              </div>
              <div className="flex min-h-[52px] items-center justify-between gap-4 px-4 py-3">
                <h3 className="font-bold leading-tight text-text-primary">
                  {proyecto.nombre}
                </h3>
                <span
                  aria-hidden="true"
                  className="shrink-0 text-xl text-primary transition-transform duration-hover-in ease-hover group-hover:translate-x-1"
                >
                  &rarr;
                </span>
              </div>
            </a>
          ))}
        </Reveal>

        {/* Grid */}
        {/* Lead project gets the large slot; the rest stack beside it. */}
        <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2 gap-8 lg:gap-6">
          {proyectosDestacados.map((proyecto, i) => (
            <Reveal
              key={proyecto.id}
              delay={i * 110}
              className={`bg-white rounded-2xl border border-border overflow-hidden flex flex-col hover-lift ${
                i === 0 ? "md:col-span-2 lg:row-span-2" : ""
              }`}
              style={{ boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)" }}
            >
              {/* Image */}
              <div
                className={`relative w-full overflow-hidden bg-surface border-b border-border ${
                  i === 0
                    ? "aspect-[4/3] md:aspect-[16/9] lg:aspect-auto lg:flex-1 lg:min-h-[18rem]"
                    : "aspect-[4/3] lg:aspect-video"
                }`}
              >
                <ProjectVisual
                  proyecto={proyecto}
                  showBadges={false}
                />
              </div>

              {/* Content */}
              <div className="p-6 lg:p-5 flex flex-col flex-grow">
                <ProjectBadges proyecto={proyecto} />
                <h3
                  className={`font-bold text-text-primary mb-3 leading-tight ${
                    i === 0 ? "text-2xl lg:text-3xl" : "text-xl"
                  }`}
                >
                  {proyecto.nombre}
                </h3>
                <p
                  className={`text-text-secondary text-sm mb-6 lg:mb-4 leading-relaxed ${
                    i === 0 ? "" : "flex-grow"
                  }`}
                >
                  {proyecto.descripcion}
                </p>
                <div>
                  {proyecto.url && !proyecto.sinSoporte ? (
                    <a
                      href={proyecto.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-text-secondary text-sm font-medium py-2 px-5 rounded-md bg-border hover:bg-surface-alt transition-colors duration-hover-in ease-hover"
                    >
                      Ver proyecto
                    </a>
                  ) : (
                    <span className="inline-block text-text-muted text-sm font-medium py-2 px-5 rounded-md bg-surface">
                      {proyecto.sinSoporte ? "Sin soporte activo" : "Próximamente"}
                    </span>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-10 sm:mt-12 lg:mt-8 flex justify-center">
          <Reveal delay={150}>
            <Link
              href="/proyectos"
              className="bg-primary hover:bg-primary-dark text-white font-semibold py-4 px-12 rounded-full hover-press text-sm uppercase tracking-wider inline-block"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.12)" }}
            >
              Ver más proyectos
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

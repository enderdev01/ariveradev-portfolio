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

  return (
    <section id="proyectos" className="w-full bg-background py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-10 sm:mb-12">
          <Reveal blur>
            <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-3">
              Nuestro trabajo
            </p>
          </Reveal>
          <Reveal blur delay={90}>
            <h2 className="mb-4 text-2xl sm:text-4xl md:text-5xl font-bold text-text-primary">
              Repositorio
            </h2>
          </Reveal>
          <Reveal delay={180}>
            <p className="mx-auto max-w-2xl text-base sm:text-lg text-text-secondary leading-relaxed">
              Proyectos reales que hemos desarrollado para nuestros clientes
            </p>
          </Reveal>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {proyectosDestacados.map((proyecto, i) => (
            <Reveal
              key={proyecto.id}
              delay={i * 110}
              className="bg-white rounded-2xl border border-border overflow-hidden flex flex-col hover:-translate-y-1 transition-transform duration-base ease-out-expo"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface border-b border-border">
                <ProjectVisual
                  proyecto={proyecto}
                  showBadges={false}
                />
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                <ProjectBadges proyecto={proyecto} />
                <h3 className="text-xl font-bold text-text-primary mb-3 leading-tight">
                  {proyecto.nombre}
                </h3>
                <p className="text-text-secondary text-sm mb-6 flex-grow leading-relaxed">
                  {proyecto.descripcion}
                </p>
                <div>
                  {proyecto.url && !proyecto.sinSoporte ? (
                    <a
                      href={proyecto.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-border hover:bg-slate-300 text-text-secondary text-sm font-medium py-2 px-5 rounded-md transition-colors duration-fast ease-out-expo"
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
        <div className="mt-10 sm:mt-12 flex justify-center">
          <Reveal delay={150}>
            <Link
              href="/proyectos"
              className="bg-primary hover:bg-primary-dark text-white font-semibold py-4 px-12 rounded-full transition-colors duration-fast ease-out-expo text-sm uppercase tracking-wider inline-block shadow-lg shadow-primary/25"
            >
              Ver más proyectos
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

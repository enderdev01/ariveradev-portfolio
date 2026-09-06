"use client";

import { useState } from "react";
import Link from "next/link";
import { proyectosReales } from "../data/onilabs";
import { proyectosSeo } from "../data/proyectos-seo";
import { toCategoryKey } from "../lib/categories";
import ProjectVisual from "./ProjectVisual";

const CATEGORIAS = [
  { label: "Todos", value: "all" },
  { label: "Ecommerce", value: "ecommerce" },
  { label: "Landing", value: "landing" },
  { label: "App Móvil", value: "app" },
  { label: "Plataformas", value: "platform" },
  { label: "Juegos", value: "game" },
  { label: "Próximamente", value: "proximamente", featured: true },
];

// Filter pill classes. Colors are provisional Tailwind utilities for Phase 1
// (pink for the "featured" próximamente pill has no Ai-Zome token yet); the
// final token classes (border-seal/text-seal per D4/D2) land in Phase 2 (T2.6).
const PILL_IDLE = "border border-border text-text-muted hover:border-primary hover:text-primary";
const PILL_ACTIVE = "border border-primary text-primary bg-primary/10";
const PILL_FEATURED_IDLE = "border border-pink-300 text-pink-700 bg-pink-50 hover:border-pink-400";
const PILL_FEATURED_ACTIVE = "border border-pink-600 text-white bg-pink-600 shadow-md shadow-pink-600/20";

export default function AllProjects() {
  const [activa, setActiva] = useState("all");

  const proyectosFiltrados = proyectosReales.filter((proyecto) => {
    const esProximamente = proyecto.estado === "proximamente";

    if (activa === "proximamente") return esProximamente;
    if (esProximamente) return false;
    if (activa === "all") return true;

    return toCategoryKey(proyectosSeo[proyecto.id]?.categoria) === activa;
  });

  return (
    <section className="w-full bg-background min-h-screen py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-10">
          <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-3">
            Nuestro trabajo
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-text-primary mb-8">
            Repositorio
          </h1>

          {/* Filtros */}
          <div className="flex flex-wrap gap-3">
            {CATEGORIAS.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiva(cat.value)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors duration-fast ease-out-expo ${
                  cat.featured
                    ? activa === cat.value
                      ? PILL_FEATURED_ACTIVE
                      : PILL_FEATURED_IDLE
                    : activa === cat.value
                      ? PILL_ACTIVE
                      : PILL_IDLE
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {proyectosFiltrados.map((proyecto) => (
            <article
              key={proyecto.id}
              className="bg-white rounded-xl border border-border overflow-hidden flex flex-col hover:-translate-y-1 transition-transform duration-base ease-out-expo"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface">
                <ProjectVisual
                  proyecto={proyecto}
                  imageClassName="object-cover transition-transform duration-slow ease-out-expo hover:scale-[1.03]"
                />
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-xl font-bold text-text-primary mb-3 leading-tight">
                  {proyectosSeo[proyecto.id] ? (
                    <Link
                      href={`/proyectos/${proyectosSeo[proyecto.id].slug}`}
                      className="hover:text-primary transition-colors"
                    >
                      {proyecto.nombre}
                    </Link>
                  ) : (
                    proyecto.nombre
                  )}
                </h2>
                <p className="text-text-secondary text-sm mb-4 flex-grow leading-relaxed">
                  {proyecto.descripcion}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {proyecto.stack?.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-md text-xs font-medium text-text-muted bg-surface-alt"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div>
                  {proyecto.url && !proyecto.sinSoporte ? (
                    <a
                      href={proyecto.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white text-sm font-medium py-2 px-4 rounded-md transition-colors duration-fast ease-out-expo"
                    >
                      Ver proyecto
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </a>
                  ) : (
                    <span className="inline-flex items-center text-sm font-medium py-2 px-4 rounded-md text-text-muted bg-surface">
                      {proyecto.sinSoporte ? "Sin soporte activo" : "Próximamente"}
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Empty state */}
        {proyectosFiltrados.length === 0 && (
          <div className="text-center py-20 text-text-muted text-sm">
            No hay proyectos en esta categoría aún.
          </div>
        )}
      </div>
    </section>
  );
}

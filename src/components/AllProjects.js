"use client";

import { useState } from "react";
import Link from "next/link";
import { proyectosReales } from "../data/onilabs";
import { getProyectoSeo } from "../data/proyectos-seo";
import { CATEGORIAS, coincideConFiltro } from "../lib/projectFilters.mjs";
import ProjectVisual from "./ProjectVisual";

// Cada proyecto hereda su filtro del catálogo. La regla —categoría SEO más el
// estado "proximamente"— vive en src/lib/projectFilters.mjs, junto con el mapeo
// total que impide que una categoría renderizada quede fuera de todo filtro.

export default function AllProjects() {
  const [activa, setActiva] = useState("all");

  const proyectosFiltrados = proyectosReales.filter((proyecto) =>
    coincideConFiltro({ proyecto, seo: getProyectoSeo(proyecto.id), activa })
  );

  return (
    <section className="w-full bg-background min-h-screen py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-10">
          <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-3">
            Nuestro trabajo
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-text-primary mb-8">
            Portfolio
          </h1>

          {/* Filtros */}
          <div className="flex flex-wrap gap-3">
            {CATEGORIAS.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiva(cat.value)}
                className="px-4 py-1.5 rounded-md text-sm font-medium transition-colors duration-hover-in ease-hover"
                style={{
                  border: cat.featured
                    ? activa === cat.value
                      ? "1px solid #DB2777"
                      : "1px solid #F9A8D4"
                    : activa === cat.value
                      ? "1px solid #2563EB"
                      : "1px solid #E2E8F0",
                  color: cat.featured
                    ? activa === cat.value
                      ? "#FFFFFF"
                      : "#BE185D"
                    : activa === cat.value
                      ? "#2563EB"
                      : "#64748B",
                  background: cat.featured
                    ? activa === cat.value
                      ? "#DB2777"
                      : "#FDF2F8"
                    : activa === cat.value
                      ? "#EFF6FF"
                      : "transparent",
                  boxShadow: cat.featured && activa === cat.value ? "0 8px 18px rgba(219, 39, 119, 0.22)" : "none",
                }}
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
              className="bg-white rounded-xl border border-border overflow-hidden flex flex-col hover-lift"
              style={{ boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)" }}
            >
              {/* Image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface">
                <ProjectVisual
                  proyecto={proyecto}
                  imageClassName="object-cover transition-transform duration-slow ease-hover hover:scale-[1.03]"
                />
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-text-primary mb-3 leading-tight">
                  {(() => {
                    const seo = getProyectoSeo(proyecto.id);
                    return seo ? (
                      <Link
                        href={`/proyectos/${seo.slug}`}
                        className="hover:text-primary transition-colors duration-hover-in ease-hover"
                      >
                        {proyecto.nombre}
                      </Link>
                    ) : (
                      proyecto.nombre
                    );
                  })()}
                </h3>
                <p className="text-text-secondary text-sm mb-4 flex-grow leading-relaxed">
                  {proyecto.descripcion}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {proyecto.stack?.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-md text-xs font-medium text-text-muted"
                      style={{ background: "#F1F5F9" }}
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
                      className="inline-flex items-center gap-2 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors duration-hover-in ease-hover"
                      style={{ background: "#2563EB" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#1E40AF")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "#2563EB")}
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

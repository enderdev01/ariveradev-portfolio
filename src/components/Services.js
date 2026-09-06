import Link from "next/link";
import Reveal from "./Reveal";
import { getServicios } from "../data/onilabs";
import { DEFAULT_LOCALE } from "../lib/i18n";

export default function Services() {
  const servicios = getServicios(DEFAULT_LOCALE);
  return (
    <section id="servicios" className="py-16 sm:py-20 bg-washi">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12">
          <Reveal blur>
            <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-3">
              Lo que hacemos
            </p>
          </Reveal>
          <Reveal blur delay={90}>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-5 text-text-primary">
              Nuestras Especialidades
            </h2>
          </Reveal>
          <Reveal delay={180}>
            <p className="text-text-secondary text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Ofrecemos soluciones tecnológicas completas para impulsar tu negocio digital
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {servicios.map((servicio, i) => (
            <Reveal
              key={servicio.id}
              delay={i * 90}
              className="group relative bg-background text-center border border-border rounded-2xl p-6 sm:p-8 transition-all duration-base ease-out-expo hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30 hover:-translate-y-0.5"
            >
              <div className="text-4xl mb-5" aria-hidden="true">
                {servicio.icono}
              </div>

              <h3 className="text-lg sm:text-xl font-bold mb-3 text-text-primary">
                {servicio.titulo}
              </h3>

              <p className="text-sm sm:text-base text-text-secondary leading-relaxed mb-5">
                {servicio.descripcion}
              </p>

              <Link
                href={`/servicios/${servicio.slug}`}
                className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all"
              >
                Ver más
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Reveal delay={120}>
            <Link
              href="/servicios"
              className="inline-flex items-center gap-2 border border-border rounded-lg px-6 py-3 font-semibold text-text-primary hover:border-primary hover:text-primary transition-colors"
            >
              Ver todos los servicios
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

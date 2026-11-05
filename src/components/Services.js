import Link from "next/link";
import Reveal from "./Reveal";
import { servicios } from "../data/onilabs";

export default function Services() {
  const serviciosPrioritarios = servicios.filter(({ id }) => [1, 2, 4].includes(id));

  return (
    <section id="servicios" className="py-16 sm:py-20 lg:py-16 bg-baseEsp">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center lg:text-left mb-10 sm:mb-12 lg:mb-8">
          <Reveal blur>
            <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-3">
              Lo que hacemos
            </p>
          </Reveal>
          <Reveal blur delay={90}>
            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-4xl font-bold mb-5 text-text-primary">
              Nuestras Especialidades
            </h2>
          </Reveal>
          <Reveal delay={180}>
            <p className="text-text-secondary text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Ofrecemos soluciones tecnológicas completas para impulsar tu negocio digital
            </p>
          </Reveal>
        </div>

        {/* A list, not a card grid: secondary services show only on tablet. */}
        <ul className="border-t border-border">
          {servicios.map((servicio, i) => (
            <Reveal
              as="li"
              key={servicio.id}
              delay={i * 70}
              className={`border-b border-border ${
                serviciosPrioritarios.some(({ id }) => id === servicio.id)
                  ? ""
                  : "hidden sm:block lg:hidden"
              }`}
            >
              <Link
                href={`/servicios/${servicio.slug}`}
                className="group grid min-h-[56px] grid-cols-[minmax(0,1fr)_auto] sm:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)_auto] items-center sm:items-baseline gap-4 sm:gap-8 py-3 sm:py-6 text-left text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-baseEsp"
              >
                <h3 className="font-semibold leading-tight sm:text-2xl transition-colors duration-hover-in ease-hover group-hover:text-primary">
                  {servicio.titulo}
                </h3>
                <p className="hidden sm:block text-base text-text-secondary leading-relaxed">
                  {servicio.descripcion}
                </p>
                <span
                  aria-hidden="true"
                  className="shrink-0 text-xl text-primary transition-transform duration-hover-in ease-hover group-hover:translate-x-1"
                >
                  &rarr;
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>

        <div className="mt-12 lg:mt-8 text-center">
          <Reveal delay={120}>
            <Link
              href="/servicios"
              className="inline-flex items-center gap-2 border border-border rounded-lg px-6 py-3 font-semibold text-text-primary hover-press hover:border-primary hover:text-primary"
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

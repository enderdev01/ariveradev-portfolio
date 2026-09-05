import { useEffect, useRef } from "react";
import Link from "next/link";
import { servicios } from "../data/onilabs";

export default function Services() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll(".service-card");
            cards.forEach((card, i) => {
              setTimeout(() => {
                card.classList.add("visible");
              }, i * 60);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="servicios" className="py-20 sm:py-28 bg-baseEsp">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 md:mb-20">
          <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-3">
            Lo que hacemos
          </p>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-5 text-text-primary">
            Nuestras Especialidades
          </h2>
          <p className="text-text-secondary text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Ofrecemos soluciones tecnológicas completas para impulsar tu negocio digital
          </p>
        </div>

        <div
          ref={sectionRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
        >
          {servicios.map((servicio) => (
            <div
              key={servicio.id}
              className="service-card reveal group relative bg-background text-center border border-border rounded-2xl p-6 sm:p-8 transition-all duration-base ease-out-expo hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30 hover:-translate-y-0.5"
            >
              {/* Gradient accent top */}
        

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
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/servicios"
            className="inline-flex items-center gap-2 border border-border rounded-lg px-6 py-3 font-semibold text-text-primary hover:border-primary hover:text-primary transition-colors"
          >
            Ver todos los servicios
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

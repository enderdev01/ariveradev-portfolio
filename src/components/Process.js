import { useState } from "react";
import AnimatedDisclosure from "./AnimatedDisclosure";
import Reveal from "./Reveal";
import { procesoi, procesop } from "../data/onilabs";

export default function Process() {
  const [procesoAbierto, setProcesoAbierto] = useState(null);
  const procesosOrdenados = [...procesoi, ...procesop].sort(
    (a, b) => a.id - b.id,
  );

  return (
    <section
      id="proceso"
      className="relative py-16 sm:py-20 lg:py-16 px-4 sm:px-6 lg:px-8 bg-background"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center lg:text-left mb-10 sm:mb-12 lg:mb-8">
          <Reveal blur>
            <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-3">
              Cómo trabajamos
            </p>
          </Reveal>
          <Reveal blur delay={90}>
            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-4xl font-bold text-text-primary">
              Nuestro Proceso de Trabajo
            </h2>
          </Reveal>
        </div>

        <Reveal className="sm:hidden divide-y divide-border border-y border-border">
          {procesosOrdenados.map((item) => (
            <AnimatedDisclosure
              key={item.id}
              id={`proceso-${item.id}-contenido`}
              open={procesoAbierto === item.id}
              onToggle={() =>
                setProcesoAbierto((actual) => (actual === item.id ? null : item.id))
              }
              buttonClassName="flex min-h-[56px] w-full items-center gap-3 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
              contentClassName="pb-4 pl-10 pr-8 text-sm leading-relaxed text-text-secondary"
              label={
                <>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {item.id}
                  </span>
                  <span className="flex-1 font-semibold text-text-primary">
                    {item.paso}
                  </span>
                </>
              }
            >
              <p>{item.descripcion}</p>
            </AnimatedDisclosure>
          ))}
        </Reveal>

        {/* Tablet cards */}
        <div className="hidden sm:block lg:hidden space-y-6">
          {procesosOrdenados.map((item, i) => (
            <Reveal
              key={item.id}
              delay={i * 90}
              className="group relative bg-background border border-border rounded-2xl p-6 shadow-sm select-none cursor-default hover-lift hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10"
            >
              <div className="absolute -top-4 left-5 w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent text-white flex items-center justify-center font-bold text-sm shadow-md transition-transform duration-hover-in ease-hover group-hover:scale-[1.08]">
                {item.id}
              </div>

              <h3 className="mt-3 text-lg font-semibold text-text-primary">
                {item.paso}
              </h3>
              <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                {item.descripcion}
              </p>
            </Reveal>
          ))}
        </div>

        {/* Desktop timeline */}
        <div className="relative hidden lg:block">
          <Reveal
            aria-hidden="true"
            className="timeline-reveal absolute left-[10%] right-[4%] top-[5px] h-6"
          >
            <div className="timeline-track absolute inset-0">
              <span className="absolute left-0 right-3 top-[11px] h-0.5 bg-gradient-to-r from-primary via-primary to-accent" />
              <svg
                className="absolute right-0 top-0 h-6 w-6 bg-background text-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 13V2l8 4-8 4" />
                <path d="M20.561 10.222a9 9 0 1 1-12.55-5.29" />
                <path d="M8.002 9.997a5 5 0 1 0 8.9 2.02" />
              </svg>
            </div>
          </Reveal>

          <ol className="relative grid grid-cols-5 gap-4">
            {procesosOrdenados.map((item, i) => (
              <Reveal
                as="li"
                key={item.id}
                delay={i * 120}
                className="group min-w-0 text-center"
              >
                <span className="relative z-10 mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-primary to-accent text-sm font-bold text-white ring-8 ring-background shadow-sm transition-transform duration-hover-in ease-hover group-hover:scale-110">
                  {item.id}
                </span>
                <div className="mt-5 px-2">
                  <h3 className="min-w-0 break-words text-base font-semibold leading-tight text-text-primary transition-colors duration-hover-in ease-hover group-hover:text-primary">
                    {item.paso}
                  </h3>
                  <p className="mt-2 break-words text-sm leading-relaxed text-text-secondary">
                    {item.descripcion}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

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
              contentClassName="pb-4 pr-8 text-sm leading-relaxed text-text-secondary"
              label={
                <span className="flex-1 font-semibold text-text-primary">
                  {item.paso}
                </span>
              }
            >
              <p>{item.descripcion}</p>
              <p className="mt-3 text-text-primary">
                <span className="font-semibold">Entregamos: </span>
                {item.entregable}
              </p>
            </AnimatedDisclosure>
          ))}
        </Reveal>

        {/* Each stage is told by what the client receives at the end of it. */}
        <ol className="hidden sm:block border-t border-border">
          {procesosOrdenados.map((item, i) => (
            <Reveal
              as="li"
              key={item.id}
              delay={i * 90}
              className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:grid-cols-[13rem_minmax(0,1fr)_minmax(0,19rem)] gap-x-8 gap-y-3 border-b border-border py-6"
            >
              <h3 className="text-xl font-semibold leading-tight text-text-primary">
                {item.paso}
              </h3>
              <p className="text-sm leading-relaxed text-text-secondary sm:text-base">
                {item.descripcion}
              </p>
              <p className="col-start-2 lg:col-start-3 text-sm leading-relaxed text-text-primary lg:border-l lg:border-border lg:pl-6">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-primary">
                  Entregamos
                </span>
                {item.entregable}
              </p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

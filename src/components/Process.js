import Reveal from "./Reveal";
import { procesoi, procesop } from "../data/onilabs";

export default function Process() {
  const procesosOrdenados = [...procesoi, ...procesop].sort(
    (a, b) => a.id - b.id,
  );

  return (
    <section
      id="proceso"
      className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-background"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14 md:mb-20">
          <Reveal blur>
            <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-3">
              Cómo trabajamos
            </p>
          </Reveal>
          <Reveal blur delay={90}>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-text-primary">
              Nuestro Proceso de Trabajo
            </h2>
          </Reveal>
        </div>

        {/* Mobile cards */}
        <div className="lg:hidden space-y-6">
          {procesosOrdenados.map((item, i) => (
            <Reveal
              key={item.id}
              delay={i * 90}
              className="group relative bg-background border border-border rounded-2xl p-6 shadow-sm select-none cursor-default transition-all duration-base ease-out-expo hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5"
            >
              <div className="absolute -top-4 left-5 w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent text-white flex items-center justify-center font-bold text-sm shadow-md transition-transform duration-base ease-out-expo group-hover:scale-[1.08]">
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
        <div className="hidden lg:block relative">
          <div
            className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-primary -translate-x-1/2"
            aria-hidden="true"
          />

          <div className="space-y-0">
            {procesosOrdenados.map((item, i) => {
              const esProcesoi = procesoi.some((p) => p.id === item.id);

              return (
                <Reveal
                  key={item.id}
                  delay={i * 90}
                  className={`group flex items-center ${
                    esProcesoi ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div className={`flex-1 ${esProcesoi ? "pl-12" : "pr-12"}`}>
                    <div
                      className={`
                        relative bg-background
                        border border-border rounded-xl p-6
                        shadow-sm select-none cursor-default
                        transition-all duration-base ease-out-expo
                        group-hover:border-primary/40
                        group-hover:shadow-lg group-hover:shadow-primary/10
                        group-hover:-translate-y-0.5
                        ${esProcesoi ? "text-left" : "text-right"}
                      `}
                    >
                      <h3 className="text-xl font-semibold mb-2 text-text-primary">
                        {item.paso}
                      </h3>
                      <p className="text-text-secondary leading-relaxed">
                        {item.descripcion}
                      </p>
                    </div>
                  </div>

                  <div className="w-14 h-14 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white font-bold text-lg border-4 border-background z-10 shadow-md transition-all duration-base ease-out-expo group-hover:scale-[1.08] group-hover:shadow-lg">
                    {item.id}
                  </div>

                  <div className="flex-1" />
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

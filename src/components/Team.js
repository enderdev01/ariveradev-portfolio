import Image from "next/image";
import Reveal from "./Reveal";
import { getEquipo } from "../data/onilabs";
import { DEFAULT_LOCALE } from "../lib/i18n";

export default function Team() {
  const equipo = getEquipo(DEFAULT_LOCALE);
  return (
    <section
      id="equipo"
      className="
        py-16 lg:py-20
        w-full
        bg-gradient-to-b from-surface via-surface to-background
      "
    >
      <div className="w-full px-4 sm:px-8 lg:px-16">
        <div className="text-center mb-10 sm:mb-12">
          <Reveal blur>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 text-text-primary">
              Nuestro Equipo
            </h2>
          </Reveal>
          <Reveal delay={90}>
            <div className="w-40 sm:w-64 lg:w-96 h-1 mx-auto bg-gradient-to-r from-primary to-accent rounded-full" />
          </Reveal>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {equipo.map((miembro, i) => (
            <Reveal
              key={miembro.id}
              delay={i * 110}
              className="
                group relative bg-background border border-border rounded-3xl
                p-8 lg:p-20
                lg:min-h-[440px]
                flex flex-col items-center text-center
                shadow-sm overflow-hidden
                select-none cursor-default
                transition-all duration-base ease-out-expo
                hover:border-primary/50 hover:shadow-xl hover:shadow-primary/8 hover:-translate-y-0.5
                focus-within:border-primary/50 focus-within:shadow-xl
              "
            >
              <div
                className="
                  absolute -top-16 lg:-top-20 left-1/2 -translate-x-1/2
                  w-52 h-52 lg:w-72 lg:h-72
                  bg-primary/20 rounded-full
                  hidden lg:block blur-3xl
                  opacity-0 z-0
                  transition-opacity duration-base ease-out-expo
                  group-hover:opacity-100
                  group-focus-within:opacity-100
                  pointer-events-none
                "
                aria-hidden="true"
              />

              <div className="relative z-10 w-28 h-48 lg:w-40 lg:h-64 mb-6 lg:mb-10">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent hidden lg:block blur-xl opacity-30 rounded-full" />
                <div className="relative w-full h-full rounded-full overflow-hidden shadow-md bg-surface">
                  <Image
                    src={miembro.imagen}
                    alt={miembro.nombre}
                    loading="lazy"
                    width={160}
                    height={256}
                    sizes="(min-width: 1024px) 160px, 112px"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>

              <h3 className="relative z-10 text-lg lg:text-xl font-bold text-text-primary mb-1">
                {miembro.nombre}
              </h3>

              <p className="relative z-10 text-accent mb-4 lg:mb-6 font-semibold text-sm lg:text-base">
                {miembro.rol}
              </p>

              <p className="relative z-10 text-text-secondary text-sm lg:text-base font-medium leading-relaxed">
                {miembro.bio}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";
import Reveal from "./Reveal";
import { equipo } from "../data/onilabs";

export default function Team() {
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

        <Reveal className="sm:hidden space-y-3">
          {equipo.map((miembro) => (
            <article
              key={miembro.id}
              className="flex items-start gap-4 rounded-xl border border-border bg-background p-4 transition-[border-color,box-shadow,transform] duration-hover-in ease-hover hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md motion-reduce:transform-none motion-reduce:transition-none"
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-surface shadow-sm">
                <Image
                  src={miembro.imagen}
                  alt={miembro.nombre}
                  loading="lazy"
                  fill
                  sizes="80px"
                  className="object-cover object-center"
                />
              </div>
              <div className="min-w-0 flex-1 pt-1 text-left">
                <h3 className="font-bold leading-tight text-text-primary">
                  {miembro.nombre}
                </h3>
                <p className="mt-1 text-sm font-semibold text-accent-strong">
                  {miembro.rol}
                </p>
                <p className="mt-2 text-sm font-medium leading-relaxed text-text-secondary">
                  {miembro.bio}
                </p>
              </div>
            </article>
          ))}
        </Reveal>

        <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
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
                hover-lift
                hover:border-primary/50 hover:shadow-xl hover:shadow-primary/8
                focus-within:border-primary/50 focus-within:shadow-xl
              "
            >
              <div
                className="
                  glow-bloom
                  absolute -top-20 lg:-top-28 left-1/2
                  w-64 h-64 lg:w-[22rem] lg:h-[22rem]
                  rounded-full
                  hidden lg:block
                  z-0 pointer-events-none
                "
                aria-hidden="true"
              />

              <div className="relative z-10 w-36 h-36 lg:w-52 lg:h-52 mb-6 lg:mb-10">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent hidden lg:block blur-xl opacity-20 rounded-full" />
                <div className="relative w-full h-full rounded-full overflow-hidden shadow-md bg-surface">
                  <Image
                    src={miembro.imagen}
                    alt={miembro.nombre}
                    loading="lazy"
                    width={208}
                    height={208}
                    sizes="(min-width: 1024px) 208px, 144px"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </div>

              <h3 className="relative z-10 text-lg lg:text-xl font-bold text-text-primary mb-1">
                {miembro.nombre}
              </h3>

              <p className="relative z-10 text-accent-strong mb-4 lg:mb-6 font-semibold text-sm lg:text-base">
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

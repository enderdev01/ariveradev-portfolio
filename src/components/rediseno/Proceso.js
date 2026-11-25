import useInView from "./useInView";
import { section, wrap, h2, lead } from "./ui";
import { pasos } from "../../data/rediseno";

// A rail that fills as the section comes in: across on desktop, down on
// phones. Step numbers are real order, so they stay. The 60/40 bar shows the
// payment split as a picture instead of a sentence.
export default function Proceso() {
  const [ref, play] = useInView(0.3);

  return (
    <section
      ref={ref}
      data-play={play}
      aria-labelledby="proceso-rediseno"
      className={`${section} bg-surface`}
    >
      <div className={wrap}>
        <h2 id="proceso-rediseno" className={`${h2} max-w-[22ch]`}>
          De tu primer mensaje a tu web publicada
        </h2>
        <p className={`${lead} mt-6 max-w-[56ch]`}>
          Cuatro pasos, y en cada uno sabes qué sigue. Nada empieza sin que tengas el precio
          por escrito.
        </p>

        <ol className="relative mt-14 grid gap-10 pl-14 lg:mt-20 lg:grid-cols-4 lg:gap-8 lg:pl-0 lg:pt-16">
          <span
            aria-hidden="true"
            className="absolute bottom-2 left-[1.15rem] top-2 w-0.5 bg-border lg:inset-x-0 lg:bottom-auto lg:left-0 lg:top-[1.15rem] lg:h-0.5 lg:w-auto"
          />
          <span
            aria-hidden="true"
            className="rail-fill absolute bottom-2 left-[1.15rem] top-2 w-0.5 origin-top bg-primary lg:inset-x-0 lg:bottom-auto lg:left-0 lg:top-[1.15rem] lg:h-0.5 lg:w-auto lg:origin-left"
          />
          {pasos.map((paso, i) => (
            <li key={paso.titulo} className="relative">
              <span
                aria-hidden="true"
                className="rail-dot absolute -left-14 top-0 flex h-[2.3rem] w-[2.3rem] items-center justify-center rounded-full bg-primary font-sans text-base font-bold text-white ring-[6px] ring-surface lg:-top-16 lg:left-0"
                style={{ "--d": `${200 + i * 380}ms` }}
              >
                {i + 1}
              </span>
              <h3 className="font-sans text-xl font-bold text-text-primary">{paso.titulo}</h3>
              <p className="mt-2 text-lg leading-relaxed text-text-secondary [text-wrap:pretty]">
                {paso.texto}
              </p>
            </li>
          ))}
        </ol>

        <figure className="mt-16 rounded-2xl border border-border bg-background p-6 sm:p-8 lg:mt-20">
          <figcaption className="font-sans text-base font-bold text-text-primary">
            Cómo pagas
          </figcaption>
          <div className="mt-5 flex h-12 gap-1.5 overflow-hidden rounded-xl" aria-hidden="true">
            <span
              className="pay-seg flex flex-[3] origin-left items-center rounded-l-xl bg-primary px-4 font-sans text-lg font-bold text-white"
              style={{ "--d": "500ms" }}
            >
              60%
            </span>
            <span
              className="pay-seg flex flex-[2] origin-left items-center rounded-r-xl bg-primary-soft px-4 font-sans text-lg font-bold text-primary-dark"
              style={{ "--d": "1100ms" }}
            >
              40%
            </span>
          </div>
          <div className="mt-3 grid grid-cols-[3fr_2fr] gap-1.5 text-sm text-text-secondary sm:text-base">
            <p>
              <span className="sr-only">60%: </span>Para empezar
            </p>
            <p>
              <span className="sr-only">40%: </span>Antes de publicar
            </p>
          </div>
        </figure>
      </div>
    </section>
  );
}

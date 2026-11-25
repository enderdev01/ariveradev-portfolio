import { CheckIcon } from "./icons";
import { section, wrap, h2 } from "./ui";
import { caminos } from "../../data/rediseno";

export default function Caminos() {
  return (
    <section aria-labelledby="caminos" className={`${section} bg-surface`}>
      <div className={wrap}>
        <h2 id="caminos" className={h2}>
          Elige según dónde estás hoy
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:mt-16 lg:gap-8">
          {caminos.map((camino) => (
            <article
              key={camino.id}
              aria-labelledby={`camino-${camino.id}`}
              className="flex flex-col rounded-2xl border border-border bg-background p-7 sm:p-10"
            >
              <p className="text-base font-semibold text-text-muted">{camino.situacion}</p>
              <h3 id={`camino-${camino.id}`} className="mt-5 text-text-primary">
                <span className="block text-3xl font-bold sm:text-4xl">{camino.nombre}</span>
                <span className="mt-2 block font-sans text-2xl font-bold text-primary [font-variant-numeric:tabular-nums]">
                  {camino.precio}
                </span>
              </h3>
              <ul className="mt-8 space-y-4 border-t border-border pt-8">
                {camino.items.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-base leading-relaxed text-text-secondary [text-wrap:pretty] sm:text-lg"
                  >
                    <CheckIcon className="mt-1 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              {camino.nota && (
                <p className="mt-auto pt-8 text-sm text-text-muted">{camino.nota}</p>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

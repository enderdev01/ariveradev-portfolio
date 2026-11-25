import { section, wrap, h2 } from "./ui";
import { pasos } from "../../data/rediseno";

// Bordered rows like the home's Process section; the step number is real
// order information, so it stays.
export default function Proceso() {
  return (
    <section aria-labelledby="proceso-rediseno" className={`${section} bg-surface`}>
      <div className={`${wrap} grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24`}>
        <h2 id="proceso-rediseno" className={h2}>
          Cómo trabajamos
        </h2>
        <ol className="border-t border-border">
          {pasos.map((paso, i) => (
            <li
              key={paso}
              className="grid grid-cols-[3rem_minmax(0,1fr)] items-baseline gap-4 border-b border-border py-7 sm:grid-cols-[4rem_minmax(0,1fr)]"
            >
              <span className="font-display text-3xl font-bold text-primary [font-variant-numeric:tabular-nums]">
                {i + 1}
              </span>
              <p className="text-lg leading-relaxed text-text-primary [text-wrap:pretty] sm:text-xl">
                {paso}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

import Image from "next/image";
import Phone from "./Phone";
import useInView from "./useInView";
import { sectionScreen, wrap, h2, lead } from "./ui";
import { trackEvent } from "../../lib/gtag";
import { DEMO_URL } from "../../data/rediseno";

// What to look at on the demo's first screen. `top` places each numbered pin
// on the screenshot; the numbers tie the pin to its line of text.
const detalles = [
  { top: "31%", titulo: "Un título que dice qué haces", texto: "El paciente entiende en un segundo si llegó al lugar correcto." },
  { top: "64%", titulo: "La acción principal, a un toque", texto: "Sin buscar el botón ni bajar hasta el final de la página." },
  { top: "83%", titulo: "Lo importante, a la vista", texto: "Especialidades, sede y tiempos, antes de que tenga que preguntar." },
];

// The real thing at true size: the demo as it renders on a phone, linked to
// the live demo, with numbered pins that teach what makes the first screen work.
export default function Ejemplo() {
  const onDemo = () => trackEvent("demo_click", { page: "rediseno-web" });
  const [ref, play] = useInView(0.4);

  return (
    <section
      ref={ref}
      data-play={play}
      aria-labelledby="ejemplo"
      className={`${sectionScreen} bg-background`}
    >
      <div className={`${wrap} grid items-center gap-14 lg:grid-cols-2 lg:gap-24`}>
        <div className="relative order-2 mx-auto w-fit lg:order-1">
          <a
            href={DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onDemo}
            aria-label="Abrir la demo de Hakui Medical"
            className="group block rounded-[2.8rem]"
          >
            <Phone dark>
              <div className="absolute inset-0 bg-[#052a22]">
                <div className="absolute inset-x-0 bottom-0 top-[62px] overflow-hidden">
                  <Image
                    src="/rediseno/hakui-demo-mobile.webp"
                    alt="Primera pantalla de Hakui Medical en un celular: título, botón principal y datos de la clínica."
                    fill
                    sizes="(min-width: 1024px) 292px, (min-width: 640px) 276px, 244px"
                    className="object-cover object-top transition-transform duration-hover-out ease-hover group-hover:scale-[1.03] group-hover:duration-hover-in motion-reduce:transition-none"
                  />
                </div>
              </div>
            </Phone>
          </a>
          {detalles.map((d, i) => (
            <span
              key={d.titulo}
              aria-hidden="true"
              className="rail-dot pointer-events-none absolute -right-4 flex h-9 w-9 items-center justify-center rounded-full bg-primary font-sans text-base font-bold text-white shadow-[0_8px_20px_-6px_rgba(36,87,214,0.65)] ring-4 ring-background"
              style={{ top: d.top, "--d": `${400 + i * 260}ms` }}
            >
              {i + 1}
            </span>
          ))}
        </div>

        <div className="order-1 lg:order-2">
          <h2 id="ejemplo" className={h2}>
            Así se ve una web de clínica que sí funciona
          </h2>
          <p className={`${lead} mt-6 max-w-[52ch]`}>
            Hakui Medical es una demo que armamos: una clínica ficticia, con marca y datos
            inventados. No es un cliente. Sirve para ver qué cambia cuando la página está
            pensada para el celular.
          </p>

          <ol className="mt-10 space-y-6">
            {detalles.map((d, i) => (
              <li
                key={d.titulo}
                className="callout grid grid-cols-[2.25rem_minmax(0,1fr)] gap-4"
                style={{ "--d": `${500 + i * 260}ms`, "--from": "16px" }}
              >
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-soft font-sans text-base font-bold text-primary-dark"
                >
                  {i + 1}
                </span>
                <div>
                  <p className="text-lg font-bold text-text-primary">{d.titulo}</p>
                  <p className="mt-1 leading-relaxed text-text-secondary [text-wrap:pretty]">{d.texto}</p>
                </div>
              </li>
            ))}
          </ol>

          <a
            href={DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onDemo}
            className="link-underline mt-10 inline-flex min-h-[44px] items-center gap-2 text-lg font-bold text-primary"
          >
            Abrir la demo en tu celular
            <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>
    </section>
  );
}

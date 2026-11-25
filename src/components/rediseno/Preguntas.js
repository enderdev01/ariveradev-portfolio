import AnimatedDisclosure from "../AnimatedDisclosure";
import { section, wrap, h2, lead } from "./ui";
import { preguntas } from "../../data/rediseno";

export default function Preguntas() {
  return (
    <section aria-labelledby="preguntas" className={`${section} bg-background`}>
      <div className={`${wrap} grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24`}>
        <div>
          <h2 id="preguntas" className={h2}>
            Lo que suelen preguntarnos
          </h2>
          <p className={`${lead} mt-6 max-w-[40ch]`}>
            Si tu duda no está aquí, escríbenos por WhatsApp: te responde una persona.
          </p>
        </div>
        <div className="divide-y divide-border border-y border-border">
          {preguntas.map((item) => (
            <AnimatedDisclosure
              name="faq-rediseno"
              key={item.pregunta}
              buttonClassName="flex min-h-[64px] w-full items-center gap-3 py-5 text-left transition-colors duration-hover-in ease-hover hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
              contentClassName="pb-6 pr-8 text-lg leading-relaxed text-text-secondary [text-wrap:pretty]"
              label={<span className="flex-1 text-lg font-semibold sm:text-xl">{item.pregunta}</span>}
            >
              <p>{item.respuesta}</p>
            </AnimatedDisclosure>
          ))}
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";
import WhatsAppButton from "./WhatsAppButton";
import { section } from "./ui";
import { equipo } from "../../data/onilabs";

const fundador = equipo[0];

// A personal close: the person who wrote the outreach message asks the
// question, so the last screen answers "who is this?" and "what now?".
export default function Cierre() {
  return (
    <section aria-labelledby="cierre" className={`${section} bg-surface text-center`}>
      <div className="mx-auto w-full max-w-3xl">
        <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-full bg-background shadow-sm">
          <Image src={fundador.imagen} alt={fundador.nombreReal} fill sizes="96px" className="object-cover" />
        </div>
        <p className="mx-auto mt-6 max-w-[48ch] text-lg leading-relaxed text-text-secondary [text-wrap:pretty]">
          Anthoni Rivera La Rosa, fundador de OniLabs. Somos un equipo de desarrollo web en
          Lima, desde enero de 2026. Si te llegó un mensaje nuestro sobre tu web, fui yo.
        </p>
        <h2
          id="cierre"
          className="mt-10 text-3xl font-bold leading-[1.12] text-text-primary [text-wrap:balance] sm:text-4xl lg:text-5xl"
        >
          ¿Te pasamos precio y plazo para tu web?
        </h2>
        <WhatsAppButton placement="closing" className="mt-10 w-full sm:w-auto" />
        <p className="mt-4 text-sm text-text-muted">
          Te respondemos con la propuesta por escrito, sin compromiso.
        </p>
      </div>
    </section>
  );
}

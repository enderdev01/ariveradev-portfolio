import Reveal from "../Reveal";
import { CheckIcon } from "./icons";
import { section, wrap, h2, lead } from "./ui";
import { trackEvent } from "../../lib/gtag";
import { caminos, whatsappUrl } from "../../data/rediseno";

// Small drawn scenes that say each path at a glance: a broken page becoming a
// working one, and an empty phone getting its first page.
function Escena({ id }) {
  const frame = "fill-white stroke-text-primary";
  if (id === "rediseno") {
    return (
      <svg viewBox="0 0 220 96" className="h-24 w-auto" aria-hidden="true">
        <rect x="12" y="6" width="54" height="84" rx="9" className={frame} strokeWidth="2.5" />
        <rect x="20" y="18" width="38" height="4" rx="2" className="fill-border" />
        <rect x="20" y="28" width="30" height="3" rx="1.5" className="fill-border" />
        <rect x="20" y="35" width="36" height="3" rx="1.5" className="fill-border" />
        <path d="M22 52l8 8 8-8 8 8 8-8" className="fill-none stroke-error" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="20" y="70" width="22" height="3" rx="1.5" className="fill-border" />
        <path d="M84 48h46m-10-10 10 10-10 10" className="fill-none stroke-primary" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="150" y="6" width="54" height="84" rx="9" className={frame} strokeWidth="2.5" />
        <rect x="158" y="18" width="38" height="7" rx="2" className="fill-text-primary" />
        <rect x="158" y="30" width="30" height="3" rx="1.5" className="fill-border" />
        <rect x="158" y="44" width="38" height="11" rx="5.5" className="fill-[#1fa855]" />
        <rect x="158" y="60" width="38" height="9" rx="4.5" className="fill-none stroke-border" strokeWidth="1.5" />
        <rect x="158" y="74" width="17" height="8" rx="2" className="fill-surface-alt" />
        <rect x="179" y="74" width="17" height="8" rx="2" className="fill-surface-alt" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 220 96" className="h-24 w-auto" aria-hidden="true">
      <rect x="12" y="6" width="54" height="84" rx="9" className="fill-white stroke-text-muted" strokeWidth="2.5" strokeDasharray="5 5" />
      <circle cx="39" cy="48" r="9" className="fill-none stroke-text-muted" strokeWidth="2" />
      <path d="M39 44v8m-4-4h8" className="stroke-text-muted" strokeWidth="2" strokeLinecap="round" />
      <path d="M84 48h46m-10-10 10 10-10 10" className="fill-none stroke-primary" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="150" y="6" width="54" height="84" rx="9" className={frame} strokeWidth="2.5" />
      <rect x="158" y="18" width="38" height="7" rx="2" className="fill-text-primary" />
      <rect x="158" y="30" width="30" height="3" rx="1.5" className="fill-border" />
      <rect x="158" y="44" width="38" height="11" rx="5.5" className="fill-[#1fa855]" />
      <rect x="158" y="62" width="38" height="3" rx="1.5" className="fill-border" />
      <rect x="158" y="69" width="32" height="3" rx="1.5" className="fill-border" />
      <rect x="158" y="76" width="36" height="3" rx="1.5" className="fill-border" />
    </svg>
  );
}

export default function Caminos() {
  return (
    <section aria-labelledby="caminos" className={`${section} bg-surface`}>
      <div className={wrap}>
        <Reveal blur>
          <h2 id="caminos" className={`${h2} max-w-[20ch]`}>
            Dos caminos, con el precio a la vista
          </h2>
          <p className={`${lead} mt-6 max-w-[56ch]`}>
            Depende de si ya tienes web o empiezas de cero. En los dos casos el dominio y los
            accesos quedan a tu nombre.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:mt-16 lg:gap-8">
          {caminos.map((camino, i) => (
            <Reveal
              as="article"
              key={camino.id}
              delay={i * 120}
              aria-labelledby={`camino-${camino.id}`}
              className="hover-lift flex flex-col rounded-2xl border border-border bg-background p-7 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_24px_48px_-28px_rgba(36,87,214,0.45)] sm:p-10"
            >
              <Escena id={camino.id} />
              <p className="mt-8 text-base font-semibold text-text-muted">{camino.situacion}</p>
              <h3 id={`camino-${camino.id}`} className="mt-3 text-text-primary">
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
              <div className="mt-auto pt-8">
                {camino.nota && <p className="text-sm text-text-muted">{camino.nota}</p>}
                <a
                  href={whatsappUrl(camino.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent("whatsapp_click", { placement: `camino-${camino.id}`, page: "rediseno-web" })
                  }
                  className="link-underline mt-4 inline-flex min-h-[44px] items-center gap-2 text-lg font-bold text-primary"
                >
                  Consultar por WhatsApp
                  <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

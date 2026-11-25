import WhatsAppButton from "./WhatsAppButton";
import HeroPhone from "./HeroPhone";
import { CheckIcon } from "./icons";
import { DEMO_URL } from "../../data/rediseno";

// The promise and its proof side by side: the copy on the left, and on the
// right a phone that plays it (page, WhatsApp at the top, "Vengo de la web").
// The ground stays dark so the navbar's transparent-over-hero state still
// reads; the only light is a soft glow that sets the phone forward.
export default function RedisenoHero() {
  return (
    <section className="relative overflow-hidden bg-[#0b1020] px-4 pb-16 pt-28 sm:px-6 lg:flex lg:min-h-[100svh] lg:items-center lg:px-8 lg:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-10%] top-[30%] h-[46rem] w-[46rem] rounded-full bg-[radial-gradient(closest-side,rgba(36,87,214,0.35),rgba(36,87,214,0)_100%)] lg:right-[2%] lg:top-[8%]"
      />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <div>
          <h1 className="animate-fade-in-up stagger-1 text-[2.3rem] font-black leading-[1.06] tracking-tight text-white [text-wrap:balance] sm:text-5xl lg:text-[3.9rem]">
            De tu web a tu WhatsApp,{" "}
            <em className="font-medium not-italic text-accent-light">en un toque.</em>
          </h1>

          <p className="animate-fade-in-up stagger-2 mt-6 max-w-[38rem] text-base font-light leading-relaxed text-white/75 [text-wrap:pretty] sm:text-lg md:text-xl">
            Para negocios en Lima. Rediseñamos tu web desde{" "}
            <span className="font-semibold text-white">US$250</span> o armamos una nueva por{" "}
            <span className="font-semibold text-white">US$300</span> en 14 días hábiles, con el
            dominio a tu nombre.
          </p>

          <div className="animate-fade-in-up stagger-3 mt-8 flex flex-col gap-4 sm:mt-10 sm:flex-row">
            <WhatsAppButton
              id="hero-whatsapp"
              placement="hero"
              className="w-full focus-visible:outline-white sm:w-auto"
            />
            <a
              href={DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-full border border-white/20 bg-white/5 px-8 py-4 text-lg font-bold text-white hover-press hover:border-white/40 hover:bg-white/10 focus-visible:outline-white sm:block"
            >
              Ver la demo
            </a>
          </div>

          <ul className="animate-fade-in-up stagger-4 mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/75 sm:text-base">
            {["Precio por escrito antes de empezar", "Página nueva en 14 días hábiles", "Dominio a tu nombre"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-accent-light" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <HeroPhone className="animate-fade-in-up stagger-4 mx-auto" />
      </div>
    </section>
  );
}

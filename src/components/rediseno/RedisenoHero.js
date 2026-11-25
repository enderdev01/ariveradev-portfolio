import Image from "next/image";
import WhatsAppButton from "./WhatsAppButton";
import { DEMO_URL } from "../../data/rediseno";

// Mirrors components/Hero.js: same background, overlay, pill, type scale and
// proof row, so a visitor coming from the home page sees the same studio.
export default function RedisenoHero() {
  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-black py-28">
      <div className="absolute inset-0 z-0 scale-105" aria-hidden="true">
        <Image
          src="/fondoHero1.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center brightness-[0.85]"
        />
      </div>
      <div
        className="absolute inset-0 z-10 bg-gradient-to-b from-black/70 via-black/55 to-black/80"
        aria-hidden="true"
      />

      <div className="relative z-20 mx-auto max-w-5xl px-4 text-center">
        <p className="animate-fade-in-up stagger-1 mb-6 inline-block rounded-full border border-accent-light/30 bg-accent-light/10 px-4 py-1.5 text-sm font-semibold uppercase tracking-widest text-accent-light backdrop-blur-sm sm:text-base">
          Webs para negocios en Lima
        </p>

        <h1 className="animate-fade-in-up stagger-2 mb-6 text-[2.3rem] font-black leading-[1.06] tracking-tight text-white [text-wrap:balance] sm:text-5xl lg:text-[4.4rem] lg:leading-[1.08]">
          Una web que funciona en el celular,{" "}
          <em className="font-medium not-italic text-accent-light">
            con WhatsApp arriba y a tu nombre.
          </em>
        </h1>

        <p className="animate-fade-in-up stagger-3 mx-auto mb-8 max-w-2xl text-base font-light leading-relaxed text-white/75 [text-wrap:pretty] sm:mb-10 sm:text-lg md:text-xl">
          Si ya tienes web, la rediseñamos desde{" "}
          <span className="font-semibold text-white">US$250</span>. Si no tienes, te
          armamos una página por <span className="font-semibold text-white">US$300</span>{" "}
          en 14 días hábiles. El dominio y los accesos quedan a tu nombre.
        </p>

        <div className="animate-fade-in-up stagger-4 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <WhatsAppButton
            id="hero-whatsapp"
            placement="hero"
            className="w-full max-w-xs focus-visible:outline-white sm:w-auto sm:max-w-none"
          />
          <a
            href={DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-full border border-white/20 bg-white/5 px-8 py-4 text-lg font-bold text-white backdrop-blur-md hover-press hover:border-white/40 hover:bg-white/10 focus-visible:outline-white sm:block"
          >
            Ver la demo
          </a>
        </div>

        <p className="animate-fade-in-up stagger-4 mt-4 text-sm text-white/60">
          Te pasamos alcance, precio y plazo por escrito antes de empezar.
        </p>
      </div>
    </section>
  );
}

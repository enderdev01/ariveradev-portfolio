import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-black py-24 sm:py-28">
      {/* Background image */}
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

      {/* Single gradient overlay */}
      <div
        className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-black/40 to-black/70"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 text-center">
        {/* Tagline */}
        <p className="animate-fade-in-up stagger-1 hidden sm:inline-block text-base font-semibold tracking-widest uppercase text-cyan-400 mb-6 px-4 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 backdrop-blur-sm">
          Laboratorio de programación
        </p>

        <h1 className="animate-fade-in-up stagger-2 text-[2.5rem] sm:text-5xl lg:text-[5.2rem] font-black leading-[1.04] sm:leading-[1.08] tracking-tight text-white mb-5 sm:mb-6">
          Construimos software a medida{" "}
          <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent">
            para negocios reales
          </span>
        </h1>

        <p className="animate-fade-in-up stagger-3 text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-7 sm:mb-10 leading-relaxed font-light">
          Desde microservicios hasta integraciones complejas.
          <span className="hidden sm:inline">
            {" "}Creamos soluciones{" "}
            <span className="text-white font-semibold">
              tecnológicas robustas
            </span>{" "}
            que impulsan tu crecimiento digital.
          </span>
        </p>

        <div className="animate-fade-in-up stagger-4 flex justify-center items-center">
          <a
            href="#contactanos"
            className="group relative w-full max-w-xs sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-full font-bold text-lg overflow-hidden hover-press hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] shadow-[0_0_20px_rgba(37,99,235,0.4)] focus-visible:outline-white"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Agenda una llamada
              <svg className="w-5 h-5 transition-transform duration-hover-in ease-hover group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </a>

          <Link
            href="/#proyectos"
            className="hidden sm:block ml-4 px-8 py-4 bg-white/5 border border-white/20 text-white rounded-full font-bold text-lg backdrop-blur-md hover-press hover:bg-white/10 hover:border-white/40 focus-visible:outline-white"
          >
            Ver repositorio
          </Link>
        </div>

        {/* Nearshore proof: replaces the geography claim the headline used to
            carry. Peru does not observe DST, so the offset against US cities
            shifts by an hour across the year — hence the ranges. */}
        <div className="animate-fade-in-up stagger-4 mt-10 hidden sm:flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-white/70">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" aria-hidden="true" />
            Equipo nearshore en Perú
          </span>
          <span className="text-white/25" aria-hidden="true">/</span>
          <span>UTC−5</span>
          <span className="text-white/25" aria-hidden="true">/</span>
          <span>0–1 h con Nueva York</span>
          <span className="text-white/25" aria-hidden="true">/</span>
          <span>2–3 h con San Francisco</span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 hidden sm:block animate-fade-in stagger-4">
        <div className="animate-scroll-bounce flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity duration-hover-in ease-hover">
          <span className="text-white/60 text-xs tracking-widest uppercase">Scroll</span>
          <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7" />
          </svg>
        </div>
      </div>

      <style jsx global>{`
        html {
          scrollbar-color: var(--border) transparent;
        }

        ::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </section>
  );
}

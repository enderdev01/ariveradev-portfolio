import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { IoCall, IoCard, IoLocationSharp, IoMenu, IoTime } from "react-icons/io5";
import Phone from "./Phone";
import Touch from "./Touch";
import useInView from "./useInView";
import { CheckIcon, CrossIcon } from "./icons";
import { sectionScreen, wrap, h2, lead } from "./ui";
import { arreglos } from "../../data/rediseno";

// Both screens are authored in iOS points (402 wide) inside Phone, so the
// "after" type renders at real phone sizes.

const bar = "block h-[14px] rounded-full bg-[#d4cfc4]";

// A typical broken clinic site on a phone: a 980px desktop page the browser
// shrinks to fit (0.41x), so its text lands too small to read, a cookie bar
// covers the foot, and there is no way to write. Filler is bars; the only
// words are the ones a patient would actually catch.
function PantallaAntes() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-white pt-[62px]" aria-hidden="true">
      <div className="h-[1900px] w-[980px] origin-top-left scale-[0.41] bg-[#f3f1ec]">
        <div className="flex items-center justify-between border-b border-[#d9d5cc] bg-white px-10 py-6">
          <span className="font-display text-[40px] font-bold text-[#2d4a6b]">Clínica Dental Sonrisa</span>
          <span className="flex gap-8">
            {[70, 90, 80, 70, 50, 80].map((w, i) => (
              <span key={i} className="block h-[14px] rounded-full bg-[#b9b4aa]" style={{ width: w }} />
            ))}
          </span>
        </div>
        <div className="mx-10 mt-8 h-[340px] rounded bg-gradient-to-br from-[#c9c3b6] to-[#a9a294]" />
        <p className="mx-10 mt-8 font-display text-[44px] font-bold leading-tight text-[#2d4a6b]">
          Bienvenidos a nuestra clínica
        </p>
        <div className="mx-10 mt-6 grid gap-4">
          {[92, 100, 86, 97, 70].map((w, i) => (
            <span key={i} className={bar} style={{ width: `${w}%` }} />
          ))}
        </div>
        <div className="mx-10 mt-10 grid grid-cols-3 gap-6">
          {[80, 64, 72].map((w, i) => (
            <div key={i}>
              <span className="block h-[180px] rounded bg-[#dcd7cd]" />
              <span className={`${bar} mt-4`} style={{ width: `${w}%` }} />
              <span className={`${bar} mt-3`} style={{ width: `${w - 22}%` }} />
            </div>
          ))}
        </div>
        <div className="mx-10 mt-10 grid gap-4">
          {[96, 80, 90, 74].map((w, i) => (
            <span key={i} className={bar} style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-[#2b2b2b] px-5 pb-10 pt-4 text-[13px] leading-[1.35] text-white/85">
        Usamos cookies para mejorar su experiencia. Al continuar navegando acepta nuestra política.
        <span className="mt-3 block w-fit rounded bg-white px-4 py-1.5 text-[13px] font-bold text-[#2b2b2b]">
          Aceptar
        </span>
      </div>
    </div>
  );
}

// The same clinic after the redesign: what it does in one line, the action
// first, then what a patient checks before writing. The hero reuses it and
// passes `waTouch` to press its WhatsApp button.
export function PantallaDespues({ waTouch = null }) {
  return (
    <div className="absolute inset-0 flex flex-col bg-white pt-[62px] text-text-primary" aria-hidden="true">
      <div className="flex h-[52px] items-center justify-between px-5">
        <span className="font-display text-[19px] font-bold text-primary-dark">Clínica Dental Sonrisa</span>
        <IoMenu className="h-[26px] w-[26px]" />
      </div>
      <div className="px-5 pt-5">
        <p className="font-display text-[34px] font-bold leading-[1.1]">
          Tu dentista en Miraflores, con cita esta semana.
        </p>
        <p className="mt-3 text-[17px] leading-[1.35] text-text-secondary">
          Limpieza, ortodoncia y urgencias. Lunes a sábado.
        </p>
        <span
          className="relative mt-6 flex h-[52px] items-center justify-center gap-2.5 rounded-full text-[17px] font-bold text-white transition-colors duration-100"
          style={{ backgroundColor: waTouch?.pressed ? "#178a45" : "#1fa855" }}
        >
          <FaWhatsapp className="h-[22px] w-[22px]" />
          Escríbenos por WhatsApp
          <Touch touch={waTouch} />
        </span>
        <span className="mt-3 flex h-[52px] items-center justify-center gap-2 rounded-full border border-border text-[17px] font-semibold">
          <IoCall className="h-[18px] w-[18px] text-primary" />
          Llamar
        </span>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-2.5 px-5">
        {["Limpieza", "Ortodoncia", "Implantes", "Urgencias"].map((s) => (
          <span key={s} className="rounded-xl bg-surface px-4 py-3.5 text-[15px] font-semibold">
            {s}
          </span>
        ))}
      </div>
      <div className="mx-5 mt-4 divide-y divide-border rounded-xl border border-border text-[15px]">
        <span className="flex items-center gap-3 px-4 py-3">
          <IoLocationSharp className="h-[18px] w-[18px] shrink-0 text-primary" />
          Av. Larco 123, Miraflores
        </span>
        <span className="flex items-center gap-3 px-4 py-3">
          <IoTime className="h-[18px] w-[18px] shrink-0 text-primary" />
          Lun a sáb, 9:00 a 19:00
        </span>
        <span className="flex items-center gap-3 px-4 py-3">
          <IoCard className="h-[18px] w-[18px] shrink-0 text-primary" />
          Tarjeta, Yape y Plin
        </span>
      </div>
    </div>
  );
}

// The page's authored moment: drag (or arrow-key) between the site a patient
// sees today and the one we would hand over. A native range input drives it,
// so keyboard and screen readers get a real control.
export default function AntesDespues() {
  const [pos, setPos] = useState(50);
  const [ref, play] = useInView(0.45);

  return (
    <section
      ref={ref}
      data-play={play}
      aria-labelledby="prueba"
      className={`${sectionScreen} relative overflow-hidden bg-background`}
    >
      <div className={`${wrap} grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-24`}>
        <div>
          <h2 id="prueba" className={h2}>
            ¿Tu web pasa la prueba del celular?
          </h2>
          <p className={`${lead} mt-6 max-w-[54ch]`}>
            Ábrela en tu teléfono, como lo hace un paciente que te encontró en Google. En
            pocos segundos decide si te escribe o se va con la clínica de al lado.
          </p>

          <ul className="mt-10 space-y-6">
            {arreglos.map((item, i) => (
              <li key={item.antes} className="chat-step grid gap-2" style={{ "--d": `${200 + i * 140}ms` }}>
                <p className="flex gap-3 text-base leading-relaxed text-text-muted line-through decoration-error/50 [text-wrap:pretty]">
                  <CrossIcon className="mt-1 text-error" />
                  {item.antes}
                </p>
                <p className="flex gap-3 text-lg font-semibold leading-relaxed text-text-primary [text-wrap:pretty]">
                  <CheckIcon className="mt-1 text-primary" />
                  {item.despues}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <figure className="relative mx-auto w-fit">
          <div className="relative">
            <Phone>
              <PantallaAntes />
              <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
                <PantallaDespues />
              </div>
            </Phone>

            {/* Handle and control sit over the whole phone, outside the scaled screen. */}
            <div className="pointer-events-none absolute inset-[10px] z-10" aria-hidden="true">
              <div
                className="absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_0_1px_rgba(19,26,39,0.15)]"
                style={{ left: `${pos}%` }}
              >
                <span className="compare-hint absolute left-1/2 top-1/2 -ml-5 -mt-5 flex h-10 w-10 items-center justify-center rounded-full bg-white text-text-primary shadow-[0_6px_18px_-4px_rgba(19,26,39,0.45)]">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 6-6 6 6 6M15 6l6 6-6 6" />
                  </svg>
                </span>
              </div>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={pos}
              onChange={(e) => setPos(Number(e.target.value))}
              aria-label="Comparar la web antes y después del rediseño"
              aria-valuetext={`${pos}% antes, ${100 - pos}% después`}
              className="compare-range absolute inset-[10px] z-20 h-[calc(100%-20px)] w-[calc(100%-20px)] cursor-ew-resize opacity-0"
            />
          </div>

          <figcaption className="mt-6 flex justify-between px-2 text-sm font-semibold" aria-hidden="true">
            <span className="text-text-muted">&larr; Antes</span>
            <span className="text-primary">Después &rarr;</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

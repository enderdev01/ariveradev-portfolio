import {
  TbBrandWhatsapp,
  TbChevronRight,
  TbClock,
  TbDental,
  TbMapPin,
  TbMenu2,
  TbPhone,
} from "react-icons/tb";
import Touch from "./Touch";

// "Clínica Dental Sonrisa": a fictional clinic site the way we would deliver
// it, laid out in iOS points (402 wide) inside Phone. It carries its own
// brand (deep teal, warm white, the system sans) so it reads as the client's
// product, not as this page. Content a patient checks before writing: what
// they do, the action, the next free times, prices, where. No reviews or
// photos are invented. Used by the hero and the before/after compare; the
// hero passes `waTouch` to press the WhatsApp button.

const TEAL = "#0d4a4a";
const TEAL_PRESSED = "#0a3b3b";

const horarios = ["Hoy 16:30", "Hoy 18:00", "Mañana 9:15"];
const servicios = [
  { nombre: "Limpieza dental", precio: "S/ 90" },
  { nombre: "Blanqueamiento", precio: "S/ 350" },
  { nombre: "Ortodoncia", precio: "Evaluación S/ 60" },
];

export default function ClinicaSonrisa({ waTouch = null }) {
  return (
    <div
      className="absolute inset-0 flex flex-col bg-[#f7f5f1] pt-[62px] font-[system-ui] text-[#132322]"
      aria-hidden="true"
    >
      <div className="flex h-[56px] shrink-0 items-center justify-between px-5">
        <span className="flex items-center gap-2">
          <TbDental className="h-[26px] w-[26px]" style={{ color: TEAL }} />
          <span className="leading-none">
            <span className="block text-[19px] font-bold tracking-[-0.02em]">Sonrisa</span>
            <span className="mt-0.5 block text-[11px] font-medium uppercase tracking-[0.08em] text-[#5d6f6d]">
              Clínica dental
            </span>
          </span>
        </span>
        <span className="flex h-[36px] items-center gap-1.5 rounded-full bg-white px-3.5 text-[14px] font-semibold shadow-[0_0_0_1px_rgba(19,35,34,0.08)]">
          <TbMenu2 className="h-[18px] w-[18px]" />
          Menú
        </span>
      </div>

      <div
        className="relative mx-3 mt-1 overflow-hidden rounded-[28px] px-6 pb-6 pt-6 text-white"
        style={{
          backgroundColor: TEAL,
          backgroundImage: "radial-gradient(120% 80% at 100% 0%, rgba(120, 214, 190, 0.28), rgba(120, 214, 190, 0) 60%)",
        }}
      >
        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[13px] font-medium text-[#bff0e2]">
          <span className="h-[7px] w-[7px] rounded-full bg-[#5ee0b5]" />
          Citas disponibles esta semana
        </span>
        <p className="mt-5 text-[34px] font-bold leading-[1.08] tracking-[-0.025em]">
          Tu dentista en Miraflores, sin esperar semanas.
        </p>
        <p className="mt-3 text-[16px] leading-[1.4] text-white/75">
          Limpieza, ortodoncia y urgencias. Lunes a sábado.
        </p>
        <span
          className="relative mt-6 flex h-[54px] items-center justify-center gap-2.5 rounded-full text-[17px] font-semibold transition-colors duration-100"
          style={{
            backgroundColor: waTouch?.pressed ? "#e6efed" : "#ffffff",
            color: TEAL,
          }}
        >
          <TbBrandWhatsapp className="h-[24px] w-[24px] text-[#1fa855]" />
          Escríbenos por WhatsApp
          <Touch touch={waTouch} />
        </span>
        <span className="mt-2.5 flex h-[50px] items-center justify-center gap-2 rounded-full text-[16px] font-semibold text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.28)]">
          <TbPhone className="h-[19px] w-[19px]" />
          Llamar
        </span>
      </div>

      <div className="mt-5 px-5">
        <p className="text-[13px] font-semibold text-[#5d6f6d]">Próximos horarios</p>
        <div className="mt-2.5 flex gap-2">
          {horarios.map((h) => (
            <span
              key={h}
              className="rounded-[12px] bg-white px-3 py-2.5 text-[14px] font-semibold shadow-[0_0_0_1px_rgba(19,35,34,0.08)]"
              style={{ color: TEAL }}
            >
              {h}
            </span>
          ))}
        </div>
      </div>

      <div className="mx-3 mt-5 overflow-hidden rounded-[20px] bg-white shadow-[0_0_0_1px_rgba(19,35,34,0.06)]">
        {servicios.map((s, i) => (
          <div
            key={s.nombre}
            className={`flex h-[52px] items-center gap-3 px-4 ${i ? "border-t border-[#ece9e3]" : ""}`}
          >
            <span className="flex-1 text-[16px] font-medium">{s.nombre}</span>
            <span className="text-[15px] text-[#5d6f6d] [font-variant-numeric:tabular-nums]">{s.precio}</span>
            <TbChevronRight className="h-[18px] w-[18px] text-[#9aa7a5]" />
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-4 px-5 text-[13px] text-[#5d6f6d]">
        <span className="flex items-center gap-1.5">
          <TbMapPin className="h-[16px] w-[16px]" />
          Av. Larco 123, Miraflores
        </span>
        <span className="flex items-center gap-1.5">
          <TbClock className="h-[16px] w-[16px]" />
          9:00 a 19:00
        </span>
      </div>
    </div>
  );
}

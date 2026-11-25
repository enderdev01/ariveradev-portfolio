import { useEffect, useState } from "react";
import {
  IoAdd,
  IoCallOutline,
  IoCameraOutline,
  IoCheckmarkDone,
  IoChevronBack,
  IoMicOutline,
  IoPerson,
  IoSend,
  IoVideocamOutline,
} from "react-icons/io5";
import Phone from "./Phone";
import Touch from "./Touch";
import useInView from "./useInView";
import { PantallaDespues } from "./AntesDespues";

// The hero's story in one loop, the promise of the H1 played out: the
// clinic's new page on a phone, the WhatsApp button at the top tapped, the
// chat opening with "Vengo de la web" already typed (that's how wa.me links
// work), sent, read, answered. The "◀ Safari" breadcrumb iOS shows is the
// visible cause of the return. Poster (no JS, reduced motion): the page.

const EASE_TAP = "cubic-bezier(0.3, 0.75, 0.1, 1)";
const BACK = { x: 69, y: 32 };

const REST = { app: "site", waTouch: null, sendTouch: null, backTouch: null, sent: false, read: false, reply: false };

const SCRIPT = [
  [0, REST],
  [2600, { waTouch: { pressed: false } }],
  [2760, { waTouch: { pressed: true } }],
  [2900, { waTouch: { gone: true }, app: "wa" }],
  [3900, { sendTouch: { pressed: false } }],
  [4060, { sendTouch: { pressed: true } }],
  [4200, { sendTouch: { gone: true }, sent: true }],
  [5000, { read: true }],
  [5800, { reply: true }],
  [7800, { backTouch: { ...BACK, pressed: false } }],
  [7960, { backTouch: { ...BACK, pressed: true } }],
  [8100, { backTouch: { ...BACK, gone: true }, app: "site" }],
  // The chat resets while it is off screen, so nothing rewinds in view.
  [8700, { sent: false, read: false, reply: false }],
];
const LOOP_MS = 8700;

function useHeroScript(play) {
  const [s, setS] = useState(REST);
  useEffect(() => {
    if (play !== "true") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timers = [];
    const run = () => {
      timers = SCRIPT.map(([at, patch]) => setTimeout(() => setS((prev) => ({ ...prev, ...patch })), at));
      timers.push(setTimeout(run, LOOP_MS));
    };
    run();
    return () => timers.forEach(clearTimeout);
  }, [play]);
  return s;
}

const bubble =
  "w-fit max-w-[78%] rounded-[18px] px-3.5 pb-2 pt-2.5 text-[17px] leading-[1.3] shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] transition-[opacity,transform] duration-500";

// WhatsApp on iOS, from the patient's side, in points.
function Chat({ s }) {
  return (
    <div className="absolute inset-0 flex flex-col bg-[#efeae2] text-left text-[#111b21]">
      <div className="bg-[#f6f6f6] pt-[62px] shadow-[0_0.5px_0_rgba(0,0,0,0.15)]">
        <div className="flex h-[52px] items-center gap-2.5 pl-2 pr-4">
          <IoChevronBack className="h-[28px] w-[28px]" />
          <span className="flex h-[38px] w-[38px] items-center justify-center overflow-hidden rounded-full bg-[#dfe5e7]">
            <IoPerson className="mt-2.5 h-[34px] w-[34px] text-white" />
          </span>
          <div className="min-w-0 flex-1 leading-[1.25]">
            <p className="truncate text-[17px] font-semibold">Clínica Dental Sonrisa</p>
            <p className="text-[13px] text-[#667781]">en línea</p>
          </div>
          <IoVideocamOutline className="h-[26px] w-[26px]" />
          <IoCallOutline className="ml-3 h-[22px] w-[22px]" />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 px-3 pt-3">
        <p className="mx-auto w-fit rounded-[8px] bg-white/90 px-3 py-1 text-[13px] font-medium text-[#54656f] shadow-[0_1px_0.5px_rgba(11,20,26,0.1)]">
          Hoy
        </p>
        <p className="mx-6 mt-1 rounded-[8px] bg-[#ffeecd] px-3 py-2 text-center text-[13px] leading-[1.35] text-[#54656f]">
          Los mensajes y las llamadas están cifrados de extremo a extremo.
        </p>
        {/* The intro card WhatsApp shows at the top of a chat with a business. */}
        <div className="mx-10 mb-3 mt-2 flex flex-col items-center rounded-[14px] bg-white px-4 pb-4 pt-5 text-center shadow-[0_1px_0.5px_rgba(11,20,26,0.1)]">
          <span className="flex h-[64px] w-[64px] items-center justify-center overflow-hidden rounded-full bg-[#dfe5e7]">
            <IoPerson className="mt-4 h-[58px] w-[58px] text-white" />
          </span>
          <p className="mt-2.5 text-[17px] font-semibold">Clínica Dental Sonrisa</p>
          <p className="mt-0.5 text-[13px] text-[#667781]">Cuenta de empresa</p>
          <p className="mt-2 text-[13px] leading-[1.35] text-[#54656f]">Miraflores · Lun a sáb, 9:00 a 19:00</p>
        </div>
        <div
          className={`${bubble} ml-auto bg-[#d9fdd3]`}
          style={{ opacity: s.sent ? 1 : 0, transform: s.sent ? "none" : "translateY(10px) scale(0.96)", transformOrigin: "right bottom" }}
        >
          Vengo de la web
          <span className="ml-2 inline-flex items-center gap-0.5 align-[-3px] text-[11px] text-[#667781]">
            10:24
            <IoCheckmarkDone
              className="h-[15px] w-[15px] transition-colors duration-300"
              style={{ color: s.read ? "#53bdeb" : "#8696a0" }}
            />
          </span>
        </div>
        <div
          className={`${bubble} bg-white`}
          style={{ opacity: s.reply ? 1 : 0, transform: s.reply ? "none" : "translateY(10px) scale(0.96)", transformOrigin: "left bottom" }}
        >
          ¡Hola! Gracias por escribirnos. ¿Para qué tratamiento buscas cita?
          <span className="ml-2 align-[-3px] text-[11px] text-[#667781]">10:24</span>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-[#f6f6f6] px-3 pb-[34px] pt-2">
        <IoAdd className="h-[28px] w-[28px]" />
        <span className="flex h-[36px] min-w-0 flex-1 items-center rounded-full border border-[#e3e3e3] bg-white px-3.5 text-[17px]">
          <span className="transition-opacity duration-150" style={{ opacity: s.sent ? 0 : 1 }}>
            Vengo de la web
          </span>
        </span>
        {/* Typed text shows Send; an empty field shows the camera and mic. */}
        <span className="relative h-[36px] w-[64px] shrink-0">
          <span
            className="absolute right-0 top-0 flex h-[36px] w-[36px] items-center justify-center rounded-full bg-[#1fa855] text-white transition-opacity duration-150"
            style={{ opacity: s.sent ? 0 : 1 }}
          >
            <IoSend className="ml-0.5 h-[17px] w-[17px]" />
            <Touch touch={s.sendTouch} />
          </span>
          <span
            className="absolute inset-0 flex items-center justify-end gap-3 transition-opacity duration-150"
            style={{ opacity: s.sent ? 1 : 0 }}
          >
            <IoCameraOutline className="h-[26px] w-[26px]" />
            <IoMicOutline className="h-[26px] w-[26px]" />
          </span>
        </span>
      </div>
    </div>
  );
}

export default function HeroPhone({ className = "" }) {
  const [ref, play] = useInView(0.3);
  const s = useHeroScript(play);
  const inWa = s.app === "wa";

  return (
    <figure
      ref={ref}
      data-app={s.app}
      aria-label="En el celular: la web de una clínica, el botón de WhatsApp arriba y el mensaje que llega con «Vengo de la web»."
      className={className}
    >
      <Phone back={inWa ? "Safari" : null} className="shadow-[0_40px_80px_-24px_rgba(0,0,0,0.7)]">
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden bg-white">
          <div
            className="absolute inset-0"
            style={{ transform: inWa ? "translateX(-28%)" : "none", transition: `transform 500ms ${EASE_TAP}` }}
          >
            <PantallaDespues waTouch={s.waTouch} />
          </div>
          <div
            className="absolute inset-0 shadow-[-8px_0_24px_rgba(0,0,0,0.12)]"
            style={{ transform: inWa ? "none" : "translateX(104%)", transition: `transform 500ms ${EASE_TAP}` }}
          >
            <Chat s={s} />
          </div>
          <Touch touch={s.backTouch} />
        </div>
      </Phone>
    </figure>
  );
}

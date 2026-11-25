import {
  IoAdd,
  IoCallOutline,
  IoCameraOutline,
  IoCheckmarkDone,
  IoChevronBack,
  IoMicOutline,
  IoPerson,
  IoVideocamOutline,
} from "react-icons/io5";
import Phone from "./Phone";
import useInView from "./useInView";
import { sectionScreen, wrap } from "./ui";
import { noPrometemos } from "../../data/rediseno";

// The page's one brand band. The phone plays the exact message the button
// sends, in WhatsApp's own colours, so the measure is seen, not described.
const flujo = [
  { titulo: "Tocan el botón", texto: "en tu web, desde el celular" },
  { titulo: "Te llega el mensaje", texto: "empieza con \u201cVengo de la web\u201d" },
  { titulo: "Los cuentas tú", texto: "en tu WhatsApp, durante 30 días" },
];
// WhatsApp on iOS, in points: a light nav bar, the beige chat ground, white
// bubbles in and pale green out. A new patient is an unsaved number with the
// default avatar, as WhatsApp really shows it. "escribiendo…" swaps in the
// header (not a typing bubble), then the messages land at the bottom, above
// the composer, and the clinic answers.
const bubble = "chat-bubble w-fit max-w-[78%] rounded-[18px] px-3.5 pb-2 pt-2.5 text-[17px] leading-[1.3] shadow-[0_1px_0.5px_rgba(11,20,26,0.13)]";

function ChatScreen() {
  return (
    <div className="absolute inset-0 flex flex-col bg-[#efeae2] text-left text-[#111b21]" aria-hidden="true">
      <div className="bg-[#f6f6f6]/95 pt-[62px] shadow-[0_0.5px_0_rgba(0,0,0,0.15)]">
        <div className="flex h-[52px] items-center gap-2.5 pl-2 pr-4">
          <IoChevronBack className="h-[28px] w-[28px] text-[#111b21]" />
          <span className="flex h-[38px] w-[38px] items-center justify-center overflow-hidden rounded-full bg-[#dfe5e7]">
            <IoPerson className="mt-2.5 h-[34px] w-[34px] text-white" />
          </span>
          <div className="min-w-0 flex-1 leading-[1.25]">
            <p className="truncate text-[17px] font-semibold">+51 987 654 321</p>
            <p className="relative h-[17px] text-[13px] text-[#667781]">
              <span className="chat-online absolute inset-0">en línea</span>
              <span className="chat-typing absolute inset-0 text-[#1fa855]">escribiendo…</span>
            </p>
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
        <div className="mx-6 mb-2 mt-1 rounded-[12px] bg-white px-4 pb-3 pt-3.5 text-center shadow-[0_1px_0.5px_rgba(11,20,26,0.1)]">
          <p className="text-[13px] leading-[1.35] text-[#54656f]">Este número no está en tus contactos.</p>
          <div className="mt-2.5 flex justify-center gap-8 text-[15px] font-semibold text-[#008069]">
            <span>Bloquear</span>
            <span>Agregar</span>
          </div>
        </div>
        <div className={`${bubble} bg-white`}>
          Vengo de la web
          <span className="ml-2 align-[-3px] text-[11px] text-[#667781]">10:24</span>
        </div>
        <div className={`${bubble} bg-white`} style={{ "--d": "1900ms" }}>
          ¿Tienen cita para limpieza el sábado?
          <span className="ml-2 align-[-3px] text-[11px] text-[#667781]">10:24</span>
        </div>
        <div className={`${bubble} ml-auto mt-2 bg-[#d9fdd3]`} style={{ "--d": "3000ms" }}>
          ¡Hola! Sí, a las 10:00. ¿Te la reservo?
          <span className="ml-2 inline-flex items-center gap-0.5 align-[-3px] text-[11px] text-[#667781]">
            10:25
            <IoCheckmarkDone className="h-[15px] w-[15px] text-[#53bdeb]" />
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-[#f6f6f6] px-3 pb-[34px] pt-2">
        <IoAdd className="h-[28px] w-[28px] text-[#111b21]" />
        <span className="h-[36px] flex-1 rounded-full border border-[#e3e3e3] bg-white" />
        <IoCameraOutline className="h-[26px] w-[26px] text-[#111b21]" />
        <IoMicOutline className="h-[26px] w-[26px] text-[#111b21]" />
      </div>
    </div>
  );
}

export default function Medicion() {
  const [ref, play] = useInView(0.35);

  return (
    <section
      ref={ref}
      data-play={play}
      aria-labelledby="medir"
      className={`${sectionScreen} overflow-hidden bg-primary-dark text-white`}
    >
      <div className={`${wrap} grid gap-14 self-stretch lg:grid-cols-[1.2fr_0.8fr] lg:gap-24`}>
        <div className="self-center">
          <h2
            id="medir"
            className="text-3xl font-bold leading-[1.12] text-white [text-wrap:balance] sm:text-4xl lg:text-5xl"
          >
            No te prometemos ventas. Te damos cómo contarlas.
          </h2>
          <p className="mt-6 max-w-[56ch] text-lg leading-relaxed text-white/85 [text-wrap:pretty]">
            El botón de WhatsApp de tu web envía un mensaje que empieza con &ldquo;Vengo de
            la web&rdquo;. Durante 30 días cuentas esos mensajes en tu propio WhatsApp. Y en
            el panel de tu Perfil de Empresa de Google ves cuántas personas tocaron
            &ldquo;Sitio web&rdquo;.
          </p>
          <ol className="mt-10 grid gap-3 sm:grid-cols-3">
            {flujo.map((paso, i) => (
              <li
                key={paso.titulo}
                className="chat-step relative rounded-xl bg-white/[0.07] px-4 py-4 ring-1 ring-inset ring-white/15"
                style={{ "--d": `${150 + i * 180}ms` }}
              >
                <span className="font-display text-2xl font-bold text-accent-light [font-variant-numeric:tabular-nums]">
                  {i + 1}
                </span>
                <p className="mt-1 font-bold text-white">{paso.titulo}</p>
                <p className="mt-0.5 text-sm leading-snug text-white/75">{paso.texto}</p>
              </li>
            ))}
          </ol>

          <p className="mt-8 text-lg font-bold text-white">
            Los números los ves tú, en tus cuentas, no en un reporte nuestro.
          </p>

          <div className="mt-12 border-t border-white/20 pt-8">
            <h3 className="font-sans text-base font-bold text-white">Lo que no prometemos</h3>
            <ul className="mt-4 space-y-2.5">
              {noPrometemos.map((item) => (
                <li key={item} className="flex gap-3 leading-relaxed text-white/80 [text-wrap:pretty]">
                  <span aria-hidden="true" className="mt-[0.7rem] h-px w-3 shrink-0 bg-white/60" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 font-semibold text-white">
              Si alguien te promete eso, pregúntale cómo lo va a medir.
            </p>
          </div>
        </div>

        {/* The phone rises from the band's bottom edge: the crop drops the
            empty composer area and keeps header, notice and messages whole. */}
        <figure
          aria-label="Así llega a tu WhatsApp el mensaje que envía el botón"
          className="-mb-20 h-[24rem] self-end overflow-y-clip pt-2 sm:h-[30rem] lg:-mb-24 lg:h-[36rem]"
        >
          <Phone className="shadow-[0_32px_64px_-20px_rgba(0,0,0,0.6)]">
            <ChatScreen />
          </Phone>
        </figure>
      </div>
    </section>
  );
}

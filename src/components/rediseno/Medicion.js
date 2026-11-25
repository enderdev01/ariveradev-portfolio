import Phone from "./Phone";
import { sectionScreen, wrap } from "./ui";
import { noPrometemos } from "../../data/rediseno";

// The page's one brand band. The phone shows the exact message the button
// sends, in WhatsApp's own colours, so the measure is seen, not described.
function ChatScreen() {
  return (
    <div className="flex h-full flex-col bg-[#efeae2] text-left" aria-hidden="true">
      <div className="flex items-center gap-3 bg-[#075e54] px-4 pb-3 pt-9 text-white">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-sm font-bold">
          P
        </span>
        <div className="leading-tight">
          <p className="text-sm font-semibold">Paciente nuevo</p>
          <p className="text-xs text-white/75">en línea</p>
        </div>
      </div>
      <div className="flex-1 px-3 pt-5">
        <p className="mx-auto mb-4 w-fit rounded-md bg-white/80 px-2.5 py-1 text-[0.7rem] text-text-muted">
          Hoy
        </p>
        <div className="max-w-[80%] rounded-lg rounded-tl-none bg-white px-3 pb-1.5 pt-2 text-text-primary shadow-[0_1px_1px_rgba(0,0,0,0.12)]">
          <p className="text-[0.95rem]">Vengo de la web</p>
          <p className="mt-0.5 text-right text-[0.65rem] text-text-muted">10:24</p>
        </div>
      </div>
      <div className="flex items-center gap-2 px-2.5 pb-5 pt-2">
        <span className="h-9 flex-1 rounded-full bg-white" />
        <span className="h-9 w-9 rounded-full bg-[#00a884]" />
      </div>
    </div>
  );
}

export default function Medicion() {
  return (
    <section aria-labelledby="medir" className={`${sectionScreen} bg-primary-dark text-white`}>
      <div className={`${wrap} grid items-center gap-14 lg:grid-cols-[1.2fr_0.8fr] lg:gap-24`}>
        <div>
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
          <p className="mt-6 text-lg font-bold text-white">
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

        <figure aria-label="Así llega a tu WhatsApp el mensaje que envía el botón">
          <Phone className="shadow-[0_32px_64px_-20px_rgba(0,0,0,0.6)]">
            <ChatScreen />
          </Phone>
        </figure>
      </div>
    </section>
  );
}

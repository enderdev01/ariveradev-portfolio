import { useEffect, useState } from "react";
import Image from "next/image";
import Phone from "./Phone";
import Touch from "./Touch";
import useInView from "./useInView";
import { sectionScreen, wrap, h2, lead } from "./ui";
import { trackEvent } from "../../lib/gtag";
import { DEMO_URL } from "../../data/rediseno";

// What a visitor should notice, one per beat of the phone's script below.
const detalles = [
  { titulo: "Un título que dice qué haces", texto: "El paciente entiende en un segundo si llegó al lugar correcto." },
  { titulo: "Todo a un toque desde el menú", texto: "Agendar, llamar o escribir por WhatsApp, sin buscar." },
  { titulo: "Lo importante, a la vista", texto: "Especialidades y precios antes de que tenga que preguntar." },
];

// Page geometry in iOS points (the screenshots are the live demo at 402pt
// wide). Stops are the tops of "Especialidades" and "Aranceles".
const PAGE_H = 5487;
const STOPS = { top: 0, especialidades: 2905, aranceles: 4675 };
const MENU_BUTTON = { x: 331, y: 100 };

// UIKit-quick response for taps; a thrown page for flicks; a quick return
// for the status-bar tap (Stageshow motion rules).
const EASE_TAP = "cubic-bezier(0.3, 0.75, 0.1, 1)";
const EASE_THROW = "cubic-bezier(0.25, 1, 0.5, 1)";

const REST = { y: 0, scrollMs: 0, ease: EASE_THROW, menu: false, step: 0, touch: null };

// One loop, about 13s: hold the first screen, open and close the menu, flick
// down to the specialties and the prices, then tap the status bar (iOS
// scroll-to-top) as the visible cause of the reset. Each entry is
// [ms from loop start, state patch].
function script() {
  const tap = (x, y) => ({ touch: { x, y, pressed: false } });
  const press = (x, y) => ({ touch: { x, y, pressed: true } });
  // The finger lifts where it is, so the dot fades in place instead of jumping.
  const lift = (x, y) => ({ touch: { x, y, gone: true } });
  return [
    [0, { ...REST, step: 1 }],
    [2400, tap(MENU_BUTTON.x, MENU_BUTTON.y)],
    [2560, press(MENU_BUTTON.x, MENU_BUTTON.y)],
    [2700, { ...tap(MENU_BUTTON.x, MENU_BUTTON.y), menu: true, step: 2 }],
    [2950, lift(MENU_BUTTON.x, MENU_BUTTON.y)],
    [5000, tap(MENU_BUTTON.x, MENU_BUTTON.y)],
    [5160, press(MENU_BUTTON.x, MENU_BUTTON.y)],
    [5300, { ...tap(MENU_BUTTON.x, MENU_BUTTON.y), menu: false }],
    [5550, lift(MENU_BUTTON.x, MENU_BUTTON.y)],
    // Flick 1: the finger lands low, travels up a third of the screen.
    [6000, tap(200, 700)],
    [6060, { touch: { x: 200, y: 420, pressed: true, swipe: true } }],
    [6300, { ...lift(200, 420), y: STOPS.especialidades, scrollMs: 950, ease: EASE_THROW, step: 3 }],
    // Flick 2.
    [8300, tap(200, 700)],
    [8360, { touch: { x: 200, y: 420, pressed: true, swipe: true } }],
    [8600, { ...lift(200, 420), y: STOPS.aranceles, scrollMs: 950 }],
    // Tap the status bar: iOS scrolls to the top.
    [10900, tap(201, 31)],
    [11060, press(201, 31)],
    [11200, { ...lift(201, 31), y: STOPS.top, scrollMs: 650, ease: EASE_TAP, step: 1 }],
  ];
}
const LOOP_MS = 12200;

function useDemoScript(play) {
  const [s, setS] = useState(REST);

  useEffect(() => {
    if (play !== "true") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timers = [];
    const run = () => {
      timers = script().map(([at, patch]) => setTimeout(() => setS((prev) => ({ ...prev, ...patch })), at));
      timers.push(setTimeout(run, LOOP_MS));
    };
    run();
    return () => timers.forEach(clearTimeout);
  }, [play]);

  return s;
}

// The live demo at true size, navigated the way a patient would: the first
// screen, the menu, then a scroll through what the clinic offers. Linked to
// the live demo. Reduced motion or no JavaScript leaves the first screen.
export default function Ejemplo() {
  const onDemo = () => trackEvent("demo_click", { page: "rediseno-web" });
  const [ref, play] = useInView(0.4);
  const s = useDemoScript(play);
  const atTop = s.y === 0 && !s.menu;

  return (
    <section
      ref={ref}
      data-play={play}
      aria-labelledby="ejemplo"
      className={`${sectionScreen} bg-background`}
    >
      <div className={`${wrap} grid items-center gap-14 lg:grid-cols-2 lg:gap-24`}>
        <div className="order-2 mx-auto w-fit lg:order-1">
          <a
            href={DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onDemo}
            aria-label="Abrir la demo de Hakui Medical"
            className="block rounded-[2.8rem]"
          >
            <Phone dark={atTop}>
              <div
                className="absolute inset-0 transition-colors duration-300"
                style={{ backgroundColor: atTop ? "#052a22" : "#ffffff" }}
              >
                <div className="absolute inset-x-0 bottom-0 top-[62px] overflow-hidden">
                  <div
                    className="absolute inset-x-0 top-0 will-change-transform"
                    style={{
                      height: PAGE_H,
                      transform: `translateY(${-s.y}px)`,
                      transition: `transform ${s.scrollMs}ms ${s.ease}`,
                    }}
                  >
                    <Image
                      src="/rediseno/hakui-page.webp"
                      alt="Hakui Medical en un celular: título, botón principal, especialidades y precios."
                      width={600}
                      height={8190}
                      sizes="(min-width: 1024px) 292px, (min-width: 640px) 276px, 244px"
                      className="h-auto w-[402px]"
                    />
                  </div>

                  <div
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{
                      opacity: s.menu ? 1 : 0,
                      transform: `translateY(${s.menu ? 0 : 8}px)`,
                      transition: `opacity 200ms ease, transform 500ms ${EASE_TAP}`,
                    }}
                  >
                    <Image
                      src="/rediseno/hakui-menu.webp"
                      alt=""
                      width={600}
                      height={1212}
                      sizes="(min-width: 1024px) 292px, (min-width: 640px) 276px, 244px"
                      className="h-auto w-[402px]"
                    />
                  </div>
                </div>
                <Touch touch={s.touch} />
              </div>
            </Phone>
          </a>
        </div>

        <div className="order-1 lg:order-2">
          <h2 id="ejemplo" className={h2}>
            Así se ve una web de clínica que sí funciona
          </h2>
          <p className={`${lead} mt-6 max-w-[52ch]`}>
            Hakui Medical es una demo que armamos: una clínica ficticia, con marca y datos
            inventados. No es un cliente. Sirve para ver qué cambia cuando la página está
            pensada para el celular.
          </p>

          <ol className="mt-10 space-y-6">
            {detalles.map((d, i) => {
              const dim = s.step !== 0 && s.step !== i + 1;
              return (
                <li
                  key={d.titulo}
                  aria-current={s.step === i + 1 ? "step" : undefined}
                  className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-4 transition-opacity duration-500"
                  style={{ opacity: dim ? 0.45 : 1 }}
                >
                  <span
                    aria-hidden="true"
                    className={`flex h-9 w-9 items-center justify-center rounded-full font-sans text-base font-bold transition-colors duration-300 ${
                      s.step === i + 1 ? "bg-primary text-white" : "bg-primary-soft text-primary-dark"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-lg font-bold text-text-primary">{d.titulo}</p>
                    <p className="mt-1 leading-relaxed text-text-secondary [text-wrap:pretty]">{d.texto}</p>
                  </div>
                </li>
              );
            })}
          </ol>

          <a
            href={DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onDemo}
            className="link-underline mt-10 inline-flex min-h-[44px] items-center gap-2 text-lg font-bold text-primary"
          >
            Abrir la demo en tu celular
            <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>
    </section>
  );
}

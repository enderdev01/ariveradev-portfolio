import Image from "next/image";
import Phone from "./Phone";
import { sectionScreen, wrap, h2, lead } from "./ui";
import { trackEvent } from "../../lib/gtag";
import { DEMO_URL } from "../../data/rediseno";

// The real thing at true size: the demo as it renders on a phone, linked to
// the live demo (the screenshot zooms slightly inside its frame on hover).
export default function Ejemplo() {
  const onDemo = () => trackEvent("demo_click", { page: "rediseno-web" });

  return (
    <section aria-labelledby="ejemplo" className={`${sectionScreen} bg-background`}>
      <div className={`${wrap} grid items-center gap-14 lg:grid-cols-2 lg:gap-24`}>
        <a
          href={DEMO_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onDemo}
          aria-label="Abrir la demo de Hakui Medical"
          className="group order-2 block rounded-[2.6rem] lg:order-1"
        >
          <Phone>
            <Image
              src="/rediseno/hakui-demo-mobile.webp"
              alt="Primera pantalla de Hakui Medical en un celular: título, botón principal y datos de la clínica."
              fill
              sizes="(min-width: 1024px) 19.5rem, (min-width: 640px) 18.5rem, 16.5rem"
              className="object-cover object-top transition-transform duration-hover-out ease-hover group-hover:scale-[1.03] group-hover:duration-hover-in motion-reduce:transition-none"
            />
          </Phone>
        </a>

        <div className="order-1 lg:order-2">
          <h2 id="ejemplo" className={h2}>
            Un ejemplo para clínicas
          </h2>
          <p className={`${lead} mt-6 max-w-[52ch]`}>
            Hakui Medical es una demo que armamos: una clínica ficticia, con marca y datos
            inventados. No es un cliente. Sirve para ver cómo se ve una página de clínica en
            el celular.
          </p>
          <a
            href={DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onDemo}
            className="link-underline mt-8 inline-flex min-h-[44px] items-center gap-2 text-lg font-bold text-primary"
          >
            Ver la demo
            <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>
    </section>
  );
}

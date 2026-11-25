import { sectionScreen, wrap, lead } from "./ui";

// The page's type moment: the positioning set large, nothing else competing.
export default function Propiedad() {
  return (
    <section aria-labelledby="nombre" className={`${sectionScreen} bg-background`}>
      <div className={wrap}>
        <h2
          id="nombre"
          className="max-w-[18ch] text-[2.6rem] font-bold leading-[1.04] tracking-tight text-text-primary [text-wrap:balance] sm:text-6xl lg:text-[5.5rem]"
        >
          Tu dominio y tus accesos, <span className="text-primary">a tu nombre.</span>
        </h2>
        <p className={`${lead} mt-10 max-w-[58ch] lg:ml-auto lg:mt-16 lg:text-xl`}>
          Registramos el dominio, el correo y las cuentas a nombre de tu negocio. Si mañana
          trabajas con otra persona, te llevas todo. El código fuente también se entrega
          cuando lo incluimos en el acuerdo: lo conversamos en la propuesta.
        </p>
      </div>
    </section>
  );
}

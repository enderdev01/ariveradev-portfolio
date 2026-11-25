import useInView from "./useInView";
import { sectionScreen, wrap, lead } from "./ui";
import { titularidad } from "../../data/rediseno";

// The page's type moment, plus a ledger that shows, line by line, whose name
// each piece is registered under. The source-code line stays conditional.
export default function Propiedad() {
  const [ref, play] = useInView(0.3);

  return (
    <section
      ref={ref}
      data-play={play}
      aria-labelledby="nombre"
      className={`${sectionScreen} bg-background`}
    >
      <div className={wrap}>
        <h2
          id="nombre"
          className="max-w-[18ch] text-[2.6rem] font-bold leading-[1.04] tracking-tight text-text-primary [text-wrap:balance] sm:text-6xl lg:text-[5.5rem]"
        >
          Tu web es tuya. <span className="text-primary">Si te vas, te la llevas.</span>
        </h2>

        <div className="mt-12 grid items-start gap-12 lg:mt-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <p className={`${lead} max-w-[50ch] lg:text-xl`}>
            Registramos el dominio, el correo y las cuentas a nombre de tu negocio. Si mañana
            trabajas con otra persona, te llevas todo. El código fuente también se entrega
            cuando lo incluimos en el acuerdo: lo conversamos en la propuesta.
          </p>

          <div className="rounded-2xl border border-border bg-surface p-2 shadow-[0_30px_60px_-40px_rgba(19,26,39,0.45)]">
            <div className="flex items-center justify-between px-5 pb-3 pt-4 text-sm font-semibold text-text-muted">
              <span>Qué es de quién</span>
              <span>Titular</span>
            </div>
            <ul className="divide-y divide-border rounded-xl bg-background">
              {titularidad.map((item, i) => (
                <li key={item.nombre} className="flex items-center justify-between gap-4 px-5 py-5">
                  <div className="min-w-0">
                    <p className="text-lg font-bold text-text-primary">{item.nombre}</p>
                    <p className="truncate text-sm text-text-muted">{item.detalle}</p>
                  </div>
                  <span
                    className={`stamp shrink-0 rounded-md border-2 px-3 py-1 font-sans text-sm font-bold uppercase tracking-wide ${
                      item.condicion
                        ? "border-dashed border-text-muted/60 text-text-muted"
                        : "border-primary text-primary"
                    }`}
                    style={{ "--d": `${300 + i * 220}ms` }}
                  >
                    {item.condicion ? "Según acuerdo" : "Tu negocio"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

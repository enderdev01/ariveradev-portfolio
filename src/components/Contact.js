import { useState } from "react";
import { AiOutlineLinkedin, AiOutlineMail } from "react-icons/ai";
import Reveal from "./Reveal";
// import { FaWhatsapp } from "react-icons/fa"; // comentado para uso futuro

export default function Contact() {
  const [formData, setFormData] = useState({
    nombre: "",
    empresa: "",
    correo: "",
    estado: "",
    tipo: "",
    mensaje: "",
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = "Nombre requerido";
    if (!formData.correo.trim()) newErrors.correo = "Correo requerido";
    if (!formData.mensaje.trim()) newErrors.mensaje = "Cuéntanos tu idea";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");

    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error();

      setStatus("success");

      setFormData({
        nombre: "",
        empresa: "",
        correo: "",
        estado: "",
        tipo: "",
        mensaje: "",
      });
    } catch {
      setStatus("error");
    }
  };

  const inputClasses =
    "w-full py-3 bg-transparent border-b border-border text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none transition-colors duration-fast ease-out-expo";

  return (
    <section
      id="contactanos"
      className="py-16 sm:py-20 px-4 sm:px-8 bg-gradient-to-b from-surface to-surface-alt"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 sm:mb-12">
          <Reveal blur>
            <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-3">
              Hablemos
            </p>
          </Reveal>
          <Reveal blur delay={90}>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary">
              Contáctanos
            </h2>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          {/* Form */}
          <Reveal delay={120} className="bg-background/80 backdrop-blur border border-border rounded-2xl p-8 sm:p-10 shadow-sm">
            <h3 className="text-xl font-semibold text-text-primary mb-8">
              Cuéntanos qué tienes en mente
            </h3>

            {status === "success" && (
              <div
                role="status"
                className="mb-8 bg-success/10 text-success-strong px-4 py-3 rounded-xl text-center font-medium border border-success/20"
              >
                Mensaje enviado correctamente
              </div>
            )}

            {status === "error" && (
              <div
                role="alert"
                className="mb-8 bg-error/10 text-error px-4 py-3 rounded-xl text-center font-medium border border-error/20"
              >
                Error al enviar el mensaje
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8"
            >
              <div>
                <label htmlFor="nombre" className="text-sm text-text-muted font-medium">
                  Nombre
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className={inputClasses}
                />
                {errors.nombre && (
                  <p className="text-xs text-error mt-2">{errors.nombre}</p>
                )}
              </div>

              <div>
                <label htmlFor="empresa" className="text-sm text-text-muted font-medium">
                  Empresa o proyecto (opcional)
                </label>
                <input
                  id="empresa"
                  name="empresa"
                  value={formData.empresa}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>

              <div>
                <label htmlFor="estado" className="text-sm text-text-muted font-medium">
                  ¿En qué punto estás con tu idea?
                </label>
                <select
                  id="estado"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  className={inputClasses}
                >
                  <option value="">Selecciona una opción</option>
                  <option>Solo tengo una idea</option>
                  <option>Quiero empezar desde cero</option>
                  <option>Ya tengo algo y quiero mejorarlo</option>
                  <option>Mi proyecto ya funciona</option>
                </select>
              </div>

              <div>
                <label htmlFor="tipo" className="text-sm text-text-muted font-medium">
                  ¿Qué te gustaría crear?
                </label>
                <select
                  id="tipo"
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  className={inputClasses}
                >
                  <option value="">Selecciona una opción</option>
                  <option>Página web</option>
                  <option>Tienda online</option>
                  <option>Sistema o plataforma</option>
                  <option>Aún no lo tengo claro</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="correo" className="text-sm text-text-muted font-medium">
                  Correo
                </label>
                <input
                  id="correo"
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  className={inputClasses}
                />
                {errors.correo && (
                  <p className="text-xs text-error mt-2">{errors.correo}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label htmlFor="mensaje" className="text-sm text-text-muted font-medium">
                  Cuéntanos un poco más
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  rows={4}
                  value={formData.mensaje}
                  onChange={handleChange}
                  className={`${inputClasses} resize-none`}
                />
                {errors.mensaje && (
                  <p className="text-xs text-error mt-2">{errors.mensaje}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className={`
                    group w-full py-3.5 rounded-xl text-base font-semibold transition-all duration-base ease-out-expo
                    flex items-center justify-center gap-2
                    ${status === "idle" ? "bg-primary text-white hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/25" : ""}
                    ${status === "loading" ? "bg-text-muted text-white cursor-not-allowed" : ""}
                    ${status === "success" ? "bg-success text-white" : ""}
                    ${status === "error" ? "bg-error text-white" : ""}
                  `}
                >
                  {status === "idle" && (
                    <>
                      Enviar mensaje
                      <svg className="w-5 h-5 transition-transform duration-base ease-out-expo group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </>
                  )}
                  {status === "loading" && "Enviando..."}
                  {status === "success" && "Mensaje enviado"}
                  {status === "error" && "Reintentar"}
                </button>
              </div>
            </form>
          </Reveal>

          {/* Contact info */}
          <div className="flex flex-col gap-8">
            <Reveal delay={220} className="bg-background/80 backdrop-blur border border-border rounded-2xl p-8 sm:p-10">
              <h3 className="text-xl font-semibold text-text-primary mb-5">
                Te acompañamos en todo el proceso
              </h3>

              <p className="text-base text-text-secondary mb-8 leading-relaxed">
                No necesitas saber de tecnología ni tener todo claro. Te
                ayudamos a ordenar tu idea y convertirla en algo real.
              </p>

              <div className="space-y-5 text-base">
                {/* WhatsApp - comentado para uso futuro
                <a
                  href="https://wa.me/51993109998"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-text-secondary hover:text-primary transition-colors duration-fast ease-out-expo group"
                >
                  <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#25D366]/10 group-hover:bg-[#25D366]/20 transition-colors duration-fast ease-out-expo">
                    <FaWhatsapp className="w-5 h-5 text-[#25D366]" />
                  </span>
                  <span>+51 993 109 998</span>
                </a>
                */}

                <a
                  href="https://www.linkedin.com/company/onilabs-dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-text-secondary hover:text-primary transition-colors duration-fast ease-out-expo group"
                >
                  <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#0A66C2]/10 group-hover:bg-[#0A66C2]/20 transition-colors duration-fast ease-out-expo">
                    <AiOutlineLinkedin className="w-5 h-5 text-[#0A66C2]" />
                  </span>
                  <span>OniLabs</span>
                </a>

                <a
                  href="mailto:contacto.onilabs@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-text-secondary hover:text-primary transition-colors duration-fast ease-out-expo group"
                >
                  <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-fast ease-out-expo">
                    <AiOutlineMail className="w-5 h-5 text-primary" />
                  </span>
                  <span>contacto.onilabs@gmail.com</span>
                </a>
              </div>
            </Reveal>

            <Reveal delay={320} className="border border-border rounded-2xl p-8 bg-background/60">
              <p className="mb-4 font-semibold text-text-primary">
                ¿Qué pasa después?
              </p>
              <ul className="space-y-3 text-text-secondary">
                <li className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex-shrink-0">1</span>
                  Leemos tu mensaje
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex-shrink-0">2</span>
                  Respondemos en 24–48 horas hábiles (UTC−5)
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex-shrink-0">3</span>
                  Te proponemos la mejor opción
                </li>
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";
import { AiFillLinkedin, AiFillGithub } from "react-icons/ai";
// import { FaWhatsapp } from "react-icons/fa"; // comentado para uso futuro

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { href: "#servicios", label: "Especialidades" },
    { href: "#portafolio", label: "Repositorio" },
    { href: "#proceso", label: "Proceso" },
    { href: "#equipo", label: "Equipo" },
    { href: "#contactanos", label: "Contacto" },
  ];

  const socialLinks = [
    {
      href: "https://www.linkedin.com/company/onilabs-dev",
      label: "LinkedIn",
      icon: AiFillLinkedin,
    },
    {
      href: "https://github.com/OnichanDevTeam",
      label: "GitHub",
      icon: AiFillGithub,
    },
    // WhatsApp - comentado para uso futuro
    // {
    //   href: "https://wa.me/51993109998",
    //   label: "WhatsApp",
    //   icon: FaWhatsapp,
    // },
  ];

  return (
    <footer className="bg-surface border-t border-border pt-12 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 mb-10">
          {/* Brand */}
          <div className="text-center md:text-left">
            <a href="#" className="inline-flex items-center gap-3 mb-3" aria-label="OniLabs - Inicio">
              <Image
                src="/logo.png"
                alt="OniLabs logo"
                width={48}
                height={48}
                className="h-12 w-12 object-contain"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                OniLabs
              </span>
            </a>
            <p className="text-text-secondary mt-2 text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
              Laboratorio de programación especializado en desarrollo web,
              móvil, microservicios y ecommerce.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col items-center">
            <h4 className="text-text-primary hidden md:block font-semibold mb-4 text-sm uppercase tracking-wider">
              Enlaces
            </h4>
            <ul className="hidden md:flex flex-col gap-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="link-underline text-text-secondary hover:text-primary text-sm transition-colors duration-fast ease-out-expo"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div className="flex flex-col items-center">
            <h4 className="text-text-primary font-semibold mb-4 text-sm uppercase tracking-wider">
              Síguenos
            </h4>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex items-center justify-center w-10 h-10 rounded-lg bg-surface-alt text-text-secondary hover:text-primary hover:bg-primary/10 transition-all duration-fast ease-out-expo"
                >
                  <social.icon className="text-xl" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6 text-center">
          <p className="text-text-muted text-xs sm:text-sm">
            © {currentYear} OniLabs. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

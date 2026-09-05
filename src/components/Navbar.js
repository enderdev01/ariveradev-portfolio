import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleNavClick = (e, href) => {
    const hash = href.replace("/#", "#");
    if (router.pathname === "/") {
      e.preventDefault();
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  const navLinks = [
    { href: "/#servicios", label: "Especialidades" },
    { href: "/#proyectos", label: "Repositorio" },
    { href: "/#proceso", label: "Metodología" },
    { href: "/#equipo", label: "Colaboradores" },
  ];

  return (
    <nav
      className="
        fixed top-0 w-full z-50
        bg-background/90
        backdrop-blur-lg
        border-b border-border/80
        py-2 px-4 sm:px-6 lg:px-8
      "
      role="navigation"
      aria-label="Navegación principal"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/"
            className="flex-shrink-0 flex items-center gap-3"
            aria-label="OniLabs - Inicio"
            onClick={(e) => {
              if (router.pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
          >
            <Image
              src="/logo.png"
              alt="OniLabs logo"
              width={48}
              height={48}
              priority
              className="h-10 w-10 sm:h-12 sm:w-12 object-contain"
            />
            <span
              className="
                text-xl sm:text-2xl font-bold
                bg-gradient-to-r from-primary to-accent
                bg-clip-text text-transparent
              "
            >
              OniLabs
            </span>
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="
                  link-underline relative px-4 py-2 text-sm font-semibold
                  text-text-secondary hover:text-primary
                  transition-colors duration-fast ease-out-expo
                  rounded-lg
                "
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/#contactanos"
              onClick={(e) => handleNavClick(e, "/#contactanos")}
              className="
                ml-3 bg-primary text-white
                px-5 py-2.5 rounded-lg font-bold text-sm
                hover:bg-primary-dark
                transition-all duration-fast ease-out-expo
                hover:shadow-md hover:shadow-primary/20
              "
            >
              Contáctanos
            </Link>
          </div>

          {/* Mobile button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={isMenuOpen}
              className="relative w-10 h-10 flex items-center justify-center rounded-lg text-text-primary hover:bg-surface transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu with transition */}
        <div
          className={`
            md:hidden grid
            transition-[grid-template-rows,opacity] duration-base ease-out-expo
            ${isMenuOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}
          `}
          aria-hidden={!isMenuOpen}
        >
          <div className="overflow-hidden">
          <div className="py-4 space-y-1 border-t border-border/50">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-3 text-text-secondary hover:text-primary hover:bg-primary/5 rounded-lg transition-colors duration-fast ease-out-expo font-medium"
                onClick={(e) => handleNavClick(e, link.href)}
                tabIndex={isMenuOpen ? 0 : -1}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 px-4">
              <Link
                href="/#contactanos"
                className="
                  block
                  bg-primary text-white
                  px-6 py-3 rounded-lg text-center font-bold
                  hover:bg-primary-dark transition-colors duration-fast ease-out-expo
                "
                onClick={(e) => handleNavClick(e, "/#contactanos")}
                tabIndex={isMenuOpen ? 0 : -1}
              >
                Contáctanos
              </Link>
            </div>
          </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

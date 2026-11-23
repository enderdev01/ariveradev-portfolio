import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { scrollToSection } from "../lib/smoothScroll";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef(null);
  const closeButtonRef = useRef(null);
  const router = useRouter();

  // On the home page the hero runs full-bleed underneath the navbar, so the bar
  // stays transparent until the user scrolls past it.
  const isHome = router.pathname === "/";

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The menu is a native modal <dialog>: the browser makes the page inert,
  // contains focus, handles Esc / back gesture and returns focus to the toggle.
  // `data-open` only drives the CSS enter/exit transitions.
  const openMenu = () => {
    const dialog = menuRef.current;
    if (!dialog || dialog.open) return;

    dialog.showModal();
    closeButtonRef.current?.focus();
    // Flush the closed styles so the transition runs from them.
    dialog.getBoundingClientRect();
    dialog.setAttribute("data-open", "true");
    setIsMenuOpen(true);
  };

  const closeMenu = useCallback(async () => {
    const dialog = menuRef.current;
    if (!dialog?.open) return;

    dialog.removeAttribute("data-open");
    setIsMenuOpen(false);

    // Keep the dialog in the top layer until the exit transition finishes.
    const animations = dialog.getAnimations({ subtree: true });
    await Promise.race([
      Promise.allSettled(animations.map((animation) => animation.finished)),
      new Promise((resolve) => setTimeout(resolve, 1000)),
    ]);

    if (dialog.hasAttribute("data-open")) return; // reopened meanwhile
    dialog.close();
  }, []);

  const handleCancel = (event) => {
    // Route Esc through the animated close instead of the instant native one.
    event.preventDefault();
    closeMenu();
  };

  const handleClose = () => {
    menuRef.current?.removeAttribute("data-open");
    setIsMenuOpen(false);
  };

  const isHeaderOnDarkSurface = isMenuOpen || (isHome && !isScrolled);

  const handleNavClick = (e, href) => {
    const hash = href.replace("/#", "#");
    const el = router.pathname === "/" ? document.querySelector(hash) : null;

    closeMenu();
    if (!el) return;

    e.preventDefault();
    scrollToSection(el, hash);
  };

  const navLinks = [
    { href: "/#servicios", label: "Especialidades" },
    { href: "/#proyectos", label: "Portfolio" },
    { href: "/#proceso", label: "Metodología" },
    { href: "/#equipo", label: "Colaboradores" },
  ];

  return (
    <nav
      className={`
        site-nav fixed top-0 w-full z-[70]
        py-2 px-4 sm:px-6 lg:px-8
        border-b
        transition-[background-color,border-color,backdrop-filter,transform] duration-base ease-out-expo
        ${
          isHeaderOnDarkSurface
            ? "bg-transparent border-transparent"
            : "bg-background/90 backdrop-blur-lg border-border/80"
        }
      `}
      role="navigation"
      aria-label="Navegación principal"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center min-h-16">
          <Link
            href="/"
            className="relative z-[80] flex-shrink-0 flex items-center gap-3"
            aria-label="OniLabs - Inicio"
            onClick={(e) => {
              if (router.pathname === "/") {
                e.preventDefault();
                // html's scroll-behavior keeps this smooth, or instant under reduced motion.
                window.scrollTo({ top: 0 });
              }
            }}
          >
            <Image
              src="/logo.png"
              alt="OniLabs logo"
              width={48}
              height={72}
              className="h-9 w-auto sm:h-11"
            />
            <span
              className={`
                text-xl sm:text-2xl font-bold
                ${
                  isHeaderOnDarkSurface
                    ? "text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)]"
                    : "text-text-primary"
                }
              `}
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
                className={`
                  link-underline relative px-4 py-2 text-sm font-semibold
                  transition-colors duration-hover-in ease-hover
                  rounded-lg
                  ${
                    isHeaderOnDarkSurface
                      ? "text-white/85 hover:text-white"
                      : "text-text-secondary hover:text-primary"
                  }
                `}
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
                hover-press
                hover:bg-primary-dark
                hover:shadow-md hover:shadow-primary/20
              "
            >
              Contáctanos
            </Link>
          </div>

          {/* Mobile button */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={openMenu}
              aria-label="Abrir menú"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
              className={`
                relative z-[80] w-11 h-11 flex items-center justify-center rounded-lg
                transition-colors duration-hover-in ease-hover
                ${
                  isHeaderOnDarkSurface
                    ? "text-white hover:bg-white/10"
                    : "text-text-primary hover:bg-surface"
                }
              `}
            >
              <svg
                className="mobile-menu__toggle-icon w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  className={`mobile-menu__toggle-line mobile-menu__toggle-line--top ${isMenuOpen ? "is-open" : ""}`}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 7h16"
                />
                <path
                  className={`mobile-menu__toggle-line mobile-menu__toggle-line--middle ${isMenuOpen ? "is-open" : ""}`}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 12h16"
                />
                <path
                  className={`mobile-menu__toggle-line mobile-menu__toggle-line--bottom ${isMenuOpen ? "is-open" : ""}`}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 17h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Full-screen mobile navigation */}
        <dialog
          ref={menuRef}
          id="mobile-navigation"
          className="mobile-menu"
          aria-labelledby="mobile-menu-title"
          onCancel={handleCancel}
          onClose={handleClose}
        >
          <div className="mobile-menu__orb" aria-hidden="true" />
          {/* The dialog covers the header, so it repeats the brand and offers its own close control. */}
          <div className="absolute inset-x-0 top-0 z-[2] py-2 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto flex min-h-16 items-center justify-between">
              <span className="flex items-center gap-3" aria-hidden="true">
                <Image
                  src="/logo.png"
                  alt=""
                  width={48}
                  height={72}
                  className="h-9 w-auto sm:h-11"
                />
                <span className="text-xl sm:text-2xl font-bold text-white">OniLabs</span>
              </span>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeMenu}
                aria-label="Cerrar menú"
                className="w-11 h-11 flex items-center justify-center rounded-lg text-white hover:bg-white/10 transition-colors duration-hover-in ease-hover"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>
          </div>
          <div className="mobile-menu__inner">
            <div className="mobile-menu__heading">
              <h2 id="mobile-menu-title">Navegación</h2>
              <span aria-hidden="true">OniLabs / 2026</span>
            </div>

            <div className="mobile-menu__nav">
              {navLinks.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{ "--menu-index": index }}
                  className="mobile-menu__link"
                  onClick={(e) => handleNavClick(e, link.href)}
                >
                  <span className="mobile-menu__link-number" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>{link.label}</span>
                  <svg
                    className="mobile-menu__link-arrow"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      d="M5 19 19 5M8 5h11v11"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.7"
                    />
                  </svg>
                </Link>
              ))}
            </div>

            <div className="mobile-menu__footer">
              <Link
                href="/#contactanos"
                className="mobile-menu__cta hover-press"
                onClick={(e) => handleNavClick(e, "/#contactanos")}
              >
                <span>Hablemos de tu proyecto</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                  <path
                    d="M5 12h13M13 6l6 6-6 6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                  />
                </svg>
              </Link>
              <div className="mobile-menu__meta">
                <span>Desarrollo web · móvil · ecommerce</span>
                <span>LinkedIn · GitHub · Lima</span>
              </div>
            </div>
          </div>
        </dialog>
      </div>
    </nav>
  );
}

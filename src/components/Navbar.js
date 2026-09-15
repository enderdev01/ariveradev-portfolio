import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { smoothScrollToElement } from "../lib/smoothScroll";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuButtonRef = useRef(null);
  const menuRef = useRef(null);
  const firstMenuLinkRef = useRef(null);
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

  useEffect(() => {
    if (!isMenuOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const releaseInitialFocus = () => {
      firstMenuLinkRef.current?.removeAttribute("data-menu-initial-focus");
    };

    const focusFrame = window.requestAnimationFrame(() => {
      const firstLink = firstMenuLinkRef.current;
      if (!firstLink) return;

      firstLink.setAttribute("data-menu-initial-focus", "true");
      firstLink.focus({ preventScroll: true });
    });
    const focusTimeout = window.setTimeout(releaseInitialFocus, 750);

    const onKeyDown = (event) => {
      releaseInitialFocus();

      if (event.key === "Escape") {
        event.preventDefault();
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
        return;
      }

      if (event.key !== "Tab") return;

      if (!menuRef.current) return;

      const focusableElements = [
        menuButtonRef.current,
        ...menuRef.current.querySelectorAll("a[href], button:not([disabled])"),
      ].filter(Boolean);

      if (!focusableElements.length) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", releaseInitialFocus);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.clearTimeout(focusTimeout);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", releaseInitialFocus);
      releaseInitialFocus();
      document.body.style.overflow = previousOverflow;
    };
  }, [isMenuOpen]);

  const isHeaderOnDarkSurface = isMenuOpen || (isHome && !isScrolled);

  const handleNavClick = (e, href) => {
    const hash = href.replace("/#", "#");
    const el = router.pathname === "/" ? document.querySelector(hash) : null;

    if (el) {
      e.preventDefault();
      setIsMenuOpen(false);
      window.requestAnimationFrame(() => smoothScrollToElement(el));
      return;
    }

    setIsMenuOpen(false);
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
        fixed top-0 w-full z-[70]
        py-2 px-4 sm:px-6 lg:px-8
        border-b
        transition-[background-color,border-color,backdrop-filter] duration-base ease-out-expo
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
            tabIndex={isMenuOpen ? -1 : 0}
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
              height={72}
              priority
              className="h-9 w-auto sm:h-11"
            />
            <span
              className={`
                text-xl sm:text-2xl font-bold
                ${
                  isHeaderOnDarkSurface
                    ? "text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)]"
                    : "bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
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
              ref={menuButtonRef}
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
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
        <div
          ref={menuRef}
          id="mobile-navigation"
          className="mobile-menu"
          data-open={isMenuOpen}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-menu-title"
          aria-hidden={!isMenuOpen}
        >
          <div className="mobile-menu__orb" aria-hidden="true" />
          <div className="mobile-menu__inner">
            <div className="mobile-menu__heading">
              <h2 id="mobile-menu-title">Navegación</h2>
              <span aria-hidden="true">OniLabs / 2026</span>
            </div>

            <div className="mobile-menu__nav" role="menu">
              {navLinks.map((link, index) => (
                <Link
                  key={link.href}
                  ref={index === 0 ? firstMenuLinkRef : undefined}
                  href={link.href}
                  role="menuitem"
                  tabIndex={isMenuOpen ? 0 : -1}
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
                role="menuitem"
                tabIndex={isMenuOpen ? 0 : -1}
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
        </div>
      </div>
    </nav>
  );
}

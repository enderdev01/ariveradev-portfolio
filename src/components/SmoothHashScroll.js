import { useEffect } from "react";

// next/link performs its own instant scroll for hash targets and ignores the
// CSS `scroll-behavior: smooth`. This intercepts clicks whose target already
// lives on the current page and scrolls there smoothly instead. Links that
// point at another route are left alone so normal navigation still happens.
export default function SmoothHashScroll() {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const onClick = (event) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = event.target.closest("a[href]");
      if (!anchor || anchor.target === "_blank") return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (!url.hash || url.hash === "#") return;
      if (url.pathname !== window.location.pathname) return;

      const target = document.querySelector(url.hash);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.pushState(null, "", url.hash);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}

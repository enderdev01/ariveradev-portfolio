import { useEffect } from "react";
import { scrollToSection } from "../lib/smoothScroll";

// Plain in-page anchors (not next/link, which handles its own clicks) would
// jump instantly when Next's router owns the hash. This intercepts clicks whose
// target already lives on the current page and hands them to the platform
// smooth scroll. Links to another route are left alone.
export default function SmoothHashScroll() {
  useEffect(() => {
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
      scrollToSection(target, url.hash);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}

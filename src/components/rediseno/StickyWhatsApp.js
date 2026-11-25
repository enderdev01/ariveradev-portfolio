import { useEffect, useState } from "react";
import WhatsAppButton from "./WhatsAppButton";

// Phone-only bar. It appears once the element with `watchId` (the hero button)
// has scrolled above the viewport, so the first screen never shows the same
// action twice. Motion and safe-area padding live in globals.css (.whatsapp-bar).
export default function StickyWhatsApp({ watchId }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById(watchId);
    if (!target || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, [watchId]);

  return (
    <div
      aria-hidden={!visible}
      className={`whatsapp-bar fixed inset-x-0 bottom-0 z-[60] border-t border-border bg-background/95 px-3 pt-3 backdrop-blur md:hidden ${
        visible ? "is-visible" : ""
      }`}
    >
      <WhatsAppButton placement="sticky" className="w-full" />
    </div>
  );
}

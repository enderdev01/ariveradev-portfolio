import { FaWhatsapp } from "react-icons/fa";
import { trackEvent } from "../../lib/gtag";
import { WHATSAPP_URL } from "../../data/rediseno";

// Same pill as the home hero button; `placement` tags the GA event so each
// position on the page can be counted separately.
export default function WhatsAppButton({ placement, id, className = "" }) {
  return (
    <a
      id={id}
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent("whatsapp_click", { placement, page: "rediseno-web" })}
      className={`group inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-full bg-primary px-5 py-4 text-[1.0625rem] font-bold sm:px-8 sm:text-lg text-white shadow-[0_2px_6px_rgba(0,0,0,0.25)] hover-press hover:bg-primary-dark ${className}`.trim()}
    >
      <FaWhatsapp aria-hidden="true" className="h-6 w-6 shrink-0" />
      Escríbenos por WhatsApp
    </a>
  );
}

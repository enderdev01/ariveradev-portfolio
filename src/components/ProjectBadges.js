// Badges sit on top of the project photograph, so the tint alone was never
// enough: a 10% wash over an arbitrary image leaves the label at whatever
// contrast the photo happens to give it. Every badge now carries an opaque
// `surface` backing with a blur, and the accent lives in the text and the
// hairline. Ratios below are measured against `surface` (#1A1953).
const SHELL =
  "inline-flex items-center rounded-md border bg-surface/90 backdrop-blur-sm px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide";

export default function ProjectBadges({ proyecto, className = "" }) {
  const badges = [
    // Cross-border delivery leads the row. For the primary audience it answers
    // the one question the rest of the catalog cannot, so it must not queue
    // behind a support-status caveat.
    proyecto.internacional && {
      label: "Cliente internacional",
      className: "text-seal border-seal/40", // 4.88:1
    },
    proyecto.sinSoporte && {
      label: "Sin soporte activo",
      className: "text-warning-strong border-warning/40", // 9.30:1
    },
    proyecto.estado === "proximamente" && {
      label: "Próximamente",
      className: "text-accent border-accent/40", // 9.52:1
    },
  ].filter(Boolean);

  if (badges.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {badges.map((badge) => (
        <span key={badge.label} className={`${SHELL} ${badge.className}`}>
          {badge.label}
        </span>
      ))}
    </div>
  );
}

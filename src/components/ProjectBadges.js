export default function ProjectBadges({ proyecto }) {
  const badges = [
    proyecto.sinSoporte && {
      label: "Sin soporte activo",
      className: "bg-warning/10 text-warning-strong border-warning/30",
    },
    proyecto.estado === "proximamente" && {
      label: "Próximamente",
      className: "bg-accent-soft text-accent border-accent/30",
    },
  ].filter(Boolean);

  if (badges.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((badge) => (
        <span
          key={badge.label}
          className={`inline-flex items-center rounded-md border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${badge.className}`}
        >
          {badge.label}
        </span>
      ))}
    </div>
  );
}

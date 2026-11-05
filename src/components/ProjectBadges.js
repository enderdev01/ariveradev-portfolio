export default function ProjectBadges({ proyecto }) {
  const badges = [
    proyecto.nuevo && {
      label: "Nuevo",
      className: "bg-primary-soft text-primary-dark border-primary/25",
    },
    proyecto.sinSoporte && {
      label: "Sin soporte activo",
      className: "bg-warning/10 text-[#8A5A06] border-warning/30",
    },
    proyecto.estado === "proximamente" && {
      label: "Próximamente",
      className: "bg-primary-soft text-primary-dark border-primary/25",
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

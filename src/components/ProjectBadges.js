export default function ProjectBadges({ proyecto }) {
  const badges = [
    proyecto.nuevo && {
      label: "Nuevo",
      className: "bg-blue-50 text-blue-700 border-blue-200",
    },
    proyecto.sinSoporte && {
      label: "Sin soporte activo",
      className: "bg-amber-50 text-amber-700 border-amber-200",
    },
    proyecto.estado === "proximamente" && {
      label: "Próximamente",
      className: "bg-blue-50 text-blue-700 border-blue-200",
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

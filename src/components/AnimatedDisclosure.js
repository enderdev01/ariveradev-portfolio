export default function AnimatedDisclosure({
  id,
  open,
  onToggle,
  label,
  children,
  className = "",
  buttonClassName = "",
  contentClassName = "",
}) {
  return (
    <div className={className}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={onToggle}
        className={buttonClassName}
      >
        {label}
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`h-5 w-5 shrink-0 text-primary transition-transform duration-[300ms] ease-hover motion-reduce:transition-none ${
            open ? "rotate-180" : "rotate-0"
          }`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-[300ms] ease-hover motion-reduce:transition-none ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            id={id}
            aria-hidden={!open}
            inert={open ? undefined : ""}
            className={`transition-[opacity,transform] duration-[300ms] ease-hover motion-reduce:transform-none motion-reduce:transition-none ${
              open ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0"
            } ${contentClassName}`.trim()}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

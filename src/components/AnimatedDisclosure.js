// Native <details>/<summary> disclosure. The browser owns the open state,
// keyboard support and find-in-page (closed content stays searchable). Items
// sharing a `name` form an exclusive accordion. The open/close slide lives in
// globals.css (`.disclosure::details-content`).
export default function AnimatedDisclosure({
  name,
  label,
  children,
  className = "",
  buttonClassName = "",
  contentClassName = "",
}) {
  return (
    <details name={name} className={`disclosure group ${className}`.trim()}>
      <summary className={`cursor-pointer list-none ${buttonClassName}`.trim()}>
        {label}
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5 shrink-0 text-primary transition-transform duration-[300ms] ease-hover motion-reduce:transition-none group-open:rotate-180"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </summary>

      <div className={contentClassName}>{children}</div>
    </details>
  );
}

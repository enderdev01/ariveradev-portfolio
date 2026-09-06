export default function Hanko({ className = "", title = "Sello OniLabs" }) {
  return (
    <svg
      viewBox="0 0 32 32"
      role="img"
      aria-label={title}
      className={`text-seal ${className}`}
      fill="currentColor"
      aria-hidden="false"
    >
      <rect x="1" y="1" width="30" height="30" rx="6" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M9 9h5v14H9z" />
      <path d="M17 9h5v5h-5z" />
      <path d="M17 16h5v7h-5z" />
    </svg>
  );
}

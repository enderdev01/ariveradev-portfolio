import Link from "next/link";

// Trail of ancestor pages. The last item is the current page: still a link (so
// the structure stays consistent) but marked aria-current. Separators come from
// CSS (`.breadcrumbs li + li::before`) so they stay out of the accessibility tree.
export default function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Ruta de navegación" className="breadcrumbs mb-8">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-text-secondary">
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isCurrent ? "page" : undefined}
                className={
                  isCurrent
                    ? "text-text-primary font-medium"
                    : "hover:text-primary transition-colors duration-hover-in ease-hover"
                }
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

import { getProyectosSeo } from "../data/proyectos-seo";
import { getServiciosSeo } from "../data/servicios-seo";
import { LOCALES, DEFAULT_LOCALE, localePath } from "../lib/i18n";
import { SITE_URL } from "../lib/site";

// Generated on request so new routes never need a manual sitemap edit.
// Locale-aware per design D6: emits each URL once per locale and annotates it
// with hreflang alternates plus x-default. With LOCALES=["es"] this emits
// today's URL set plus a self-referential hreflang="es" and x-default.
const buildSitemap = () => {
  const today = new Date().toISOString().split("T")[0];
  const proyectosSeo = getProyectosSeo(DEFAULT_LOCALE);
  const serviciosSeo = getServiciosSeo(DEFAULT_LOCALE);

  const staticEntries = [
    { loc: `${SITE_URL}/`, priority: "1.0", changefreq: "monthly" },
    { loc: `${SITE_URL}/servicios`, priority: "0.9", changefreq: "monthly" },
    { loc: `${SITE_URL}/proyectos`, priority: "0.8", changefreq: "monthly" },
    ...serviciosSeo.map((servicio) => ({
      loc: `${SITE_URL}/servicios/${servicio.slug}`,
      priority: "0.8",
      changefreq: "monthly",
    })),
    ...Object.values(proyectosSeo).map((proyecto) => ({
      loc: `${SITE_URL}/proyectos/${proyecto.slug}`,
      priority: "0.7",
      changefreq: "yearly",
    })),
  ];

  const locales = LOCALES; // ["es"] today; ["es", "en"] when /en ships

  const hreflang = (path) =>
    locales
      .map(
        (locale) =>
          `    <xhtml:link rel="alternate" hreflang="${locale}" href="${SITE_URL}${localePath(locale, path)}"/>`
      )
      .concat(
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${localePath(DEFAULT_LOCALE, path)}"/>`
      )
      .join("\n");

  const urls = staticEntries.map(({ loc, priority, changefreq }) => {
    const { pathname } = new URL(loc);
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
${hreflang(pathname)}
  </url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>`;
};

export default function Sitemap() {
  return null;
}

export function getServerSideProps({ res }) {
  res.setHeader("Content-Type", "text/xml");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=3600, stale-while-revalidate=86400"
  );
  res.write(buildSitemap());
  res.end();
  return { props: {} };
}

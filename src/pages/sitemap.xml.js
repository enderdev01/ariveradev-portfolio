import { proyectosSeo } from "../data/proyectos-seo";
import { serviciosSeo } from "../data/servicios-seo";
import { SITE_URL } from "../lib/site";

// Generated on request so new routes never need a manual sitemap edit.
const buildSitemap = () => {
  const today = new Date().toISOString().split("T")[0];

  const urls = [
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

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    ({ loc, priority, changefreq }) => `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  )
  .join("\n")}
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

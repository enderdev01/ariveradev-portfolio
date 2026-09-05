import Head from "next/head";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { serviciosSeo } from "../../data/servicios-seo";
import { SITE_URL } from "../../lib/site";

const PAGE_URL = `${SITE_URL}/servicios`;
const TITLE = "Servicios de Desarrollo de Software en Perú | Onilabs";
const DESCRIPTION =
  "Servicios de desarrollo de software en Perú: web, apps móviles, ecommerce WooCommerce, integraciones de APIs, software a medida y mantenimiento.";

export default function ServiciosPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Servicios", item: PAGE_URL },
    ],
  };

  return (
    <>
      <Head>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />

        <link rel="canonical" href={PAGE_URL} />
        <link rel="alternate" hrefLang="x-default" href={PAGE_URL} />
        <link rel="alternate" hrefLang="es" href={PAGE_URL} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:image" content={`${SITE_URL}/og-image.png`} />
        <meta property="og:locale" content="es_PE" />
        <meta property="og:site_name" content="Onilabs" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />
        <meta name="twitter:image" content={`${SITE_URL}/og-image.png`} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <nav aria-label="Ruta de navegación" className="mb-8">
              <ol className="flex items-center gap-2 text-sm text-text-secondary">
                <li>
                  <Link href="/" className="hover:text-primary transition-colors">
                    Inicio
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-text-primary font-medium">Servicios</li>
              </ol>
            </nav>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary leading-tight mb-6">
              Servicios de desarrollo de software en Perú
            </h1>

            <p className="text-lg text-text-secondary leading-relaxed mb-12 max-w-2xl">
              Desarrollamos, integramos y mantenemos software para empresas que
              necesitan que la tecnología acompañe su operación real. Estas son
              las áreas en las que trabajamos.
            </p>

            <ul className="grid sm:grid-cols-2 gap-5">
              {serviciosSeo.map((servicio) => (
                <li key={servicio.slug}>
                  <Link
                    href={`/servicios/${servicio.slug}`}
                    className="block h-full border border-border rounded-xl p-6 bg-surface hover:border-primary transition-colors"
                  >
                    <h2 className="text-xl font-bold text-text-primary mb-2">
                      {servicio.h1}
                    </h2>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      {servicio.descripcion}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}

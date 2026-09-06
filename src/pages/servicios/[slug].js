import Head from "next/head";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { getServiciosSeo, getServicioSeo } from "../../data/servicios-seo";
import { SITE_URL } from "../../lib/site";
import { DEFAULT_LOCALE } from "../../lib/i18n";

export default function ServicioPage({ servicio }) {
  const serviciosSeo = getServiciosSeo(DEFAULT_LOCALE);
  const pageUrl = `${SITE_URL}/servicios/${servicio.slug}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${pageUrl}/#service`,
        name: servicio.h1,
        description: servicio.descripcion,
        serviceType: servicio.keyword,
        areaServed: { "@type": "Country", name: "Perú" },
        provider: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}/#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: "Servicios",
            item: `${SITE_URL}/servicios`,
          },
          { "@type": "ListItem", position: 3, name: servicio.h1, item: pageUrl },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}/#faq`,
        mainEntity: servicio.faq.map((item) => ({
          "@type": "Question",
          name: item.pregunta,
          acceptedAnswer: { "@type": "Answer", text: item.respuesta },
        })),
      },
    ],
  };

  return (
    <>
      <Head>
        <title>{servicio.titulo}</title>
        <meta name="description" content={servicio.descripcion} />

        <link rel="canonical" href={pageUrl} />
        <link rel="alternate" hrefLang="x-default" href={pageUrl} />
        <link rel="alternate" hrefLang="es" href={pageUrl} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content={servicio.titulo} />
        <meta property="og:description" content={servicio.descripcion} />
        <meta property="og:image" content={`${SITE_URL}/og-image.png`} />
        <meta property="og:locale" content="es_PE" />
        <meta property="og:site_name" content="Onilabs" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={servicio.titulo} />
        <meta name="twitter:description" content={servicio.descripcion} />
        <meta name="twitter:image" content={`${SITE_URL}/og-image.png`} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
          <article className="max-w-3xl mx-auto">
            <nav aria-label="Ruta de navegación" className="mb-8">
              <ol className="flex flex-wrap items-center gap-2 text-sm text-text-secondary">
                <li>
                  <Link href="/" className="hover:text-primary transition-colors">
                    Inicio
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link
                    href="/servicios"
                    className="hover:text-primary transition-colors"
                  >
                    Servicios
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-text-primary font-medium">{servicio.h1}</li>
              </ol>
            </nav>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary leading-tight mb-6">
              {servicio.h1}
            </h1>

            <p className="text-lg text-text-secondary leading-relaxed mb-14">
              {servicio.intro}
            </p>

            {servicio.secciones.map((seccion) => (
              <section key={seccion.titulo} className="mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-4">
                  {seccion.titulo}
                </h2>
                {seccion.parrafos.map((parrafo, i) => (
                  <p
                    key={i}
                    className="text-text-secondary leading-relaxed mb-4 last:mb-0"
                  >
                    {parrafo}
                  </p>
                ))}
              </section>
            ))}

            <section className="mb-14">
              <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-6">
                Preguntas frecuentes
              </h2>
              <dl className="space-y-6">
                {servicio.faq.map((item) => (
                  <div
                    key={item.pregunta}
                    className="border border-border rounded-xl p-5 bg-surface"
                  >
                    <dt className="font-semibold text-text-primary mb-2">
                      {item.pregunta}
                    </dt>
                    <dd className="text-text-secondary leading-relaxed">
                      {item.respuesta}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="border-t border-border pt-10 mb-14">
              <h2 className="text-2xl font-bold text-text-primary mb-3">
                ¿Tenés un proyecto en mente?
              </h2>
              <p className="text-text-secondary leading-relaxed mb-6">
                Contanos qué necesitás y te respondemos con una propuesta clara
                de alcance, tiempos y costos.
              </p>
              <Link
                href="/#contactanos"
                className="inline-block bg-primary-fill text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-dark transition-colors"
              >
                Contactanos
              </Link>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text-primary mb-4">
                Otros servicios
              </h2>
              <ul className="grid sm:grid-cols-2 gap-3">
                {serviciosSeo
                  .filter((otro) => otro.slug !== servicio.slug)
                  .map((otro) => (
                    <li key={otro.slug}>
                      <Link
                        href={`/servicios/${otro.slug}`}
                        className="block border border-border rounded-lg px-4 py-3 text-text-secondary hover:text-primary hover:border-primary transition-colors"
                      >
                        {otro.h1}
                      </Link>
                    </li>
                  ))}
              </ul>
            </section>
          </article>
        </main>

        <Footer />
      </div>
    </>
  );
}

export function getStaticPaths() {
  const serviciosSeo = getServiciosSeo(DEFAULT_LOCALE);
  return {
    paths: serviciosSeo.map((servicio) => ({
      params: { slug: servicio.slug },
    })),
    fallback: false,
  };
}

export function getStaticProps({ params }) {
  const servicio = getServicioSeo(params.slug, DEFAULT_LOCALE);
  if (!servicio) return { notFound: true };
  return { props: { servicio } };
}

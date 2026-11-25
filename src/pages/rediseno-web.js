import Head from "next/head";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import RedisenoHero from "../components/rediseno/RedisenoHero";
import Caminos from "../components/rediseno/Caminos";
import Ejemplo from "../components/rediseno/Ejemplo";
import Medicion from "../components/rediseno/Medicion";
import Propiedad from "../components/rediseno/Propiedad";
import Proceso from "../components/rediseno/Proceso";
import Preguntas from "../components/rediseno/Preguntas";
import Cierre from "../components/rediseno/Cierre";
import StickyWhatsApp from "../components/rediseno/StickyWhatsApp";
import { preguntas } from "../data/rediseno";
import { SITE_URL } from "../lib/site";

// Landing for Lima SMBs reached by one-to-one outreach. Approved copy lives in
// onilabs-marketing/campaigns/rediseno-web/landing-page.md.
const PAGE_URL = `${SITE_URL}/rediseno-web`;
const TITLE = "Rediseño de web para negocios en Lima desde US$250 | OniLabs";
const DESCRIPTION =
  "Una web que funciona en el celular, con WhatsApp arriba y a tu nombre. Rediseño desde US$250 o página nueva por US$300 en 14 días hábiles.";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": `${PAGE_URL}/#service`,
      name: "Rediseño de web y páginas para negocios en Lima",
      description: DESCRIPTION,
      areaServed: { "@type": "City", name: "Lima" },
      provider: { "@id": `${SITE_URL}/#organization` },
      offers: [
        {
          "@type": "Offer",
          name: "Rediseño de web",
          priceSpecification: { "@type": "PriceSpecification", minPrice: 250, priceCurrency: "USD" },
        },
        { "@type": "Offer", name: "Página propia", price: 300, priceCurrency: "USD" },
      ],
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${PAGE_URL}/#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Rediseño de web", item: PAGE_URL },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${PAGE_URL}/#faq`,
      mainEntity: preguntas.map((item) => ({
        "@type": "Question",
        name: item.pregunta,
        acceptedAnswer: { "@type": "Answer", text: item.respuesta },
      })),
    },
  ],
};

export default function RedisenoWeb() {
  return (
    <>
      <Head>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover"
        />
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

      <div className="has-whatsapp-bar min-h-screen bg-background">
        <Navbar />
        <main>
          <RedisenoHero />
          <Caminos />
          <Ejemplo />
          <Medicion />
          <Propiedad />
          <Proceso />
          <Preguntas />
          <Cierre />
        </main>
        <Footer />
        <StickyWhatsApp watchId="hero-whatsapp" />
      </div>
    </>
  );
}

import Head from "next/head";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Services from "../components/Services";
import Portfolio from "../components/Portfolio";
import Process from "../components/Process";
import Team from "../components/Team";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import PromoModal from "../components/PromoModal";
import FeaturedProjects from "@/components/FeaturedProjects";
import { SITE_URL } from "../lib/site";


const TITLE = "Onilabs - Laboratorio de Programación";
const DESCRIPTION =
  "Onilabs: Desarrollo web, aplicaciones móviles, microservicios, integraciones y ecommerce WordPress/WooCommerce. Soluciones escalables para tu negocio.";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Onilabs",
      url: SITE_URL,
      description: DESCRIPTION,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
      contactPoint: {
        "@type": "ContactPoint",
        email: "contacto.onilabs@gmail.com",
        contactType: "customer service",
        availableLanguage: "Spanish",
      },
      sameAs: [
        "https://www.linkedin.com/company/onilabs-dev",
        "https://github.com/OnichanDevTeam",
        "https://wa.me/51993109998",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "Onilabs",
      url: SITE_URL,
      inLanguage: "es",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/#webpage`,
      url: SITE_URL,
      name: TITLE,
      description: DESCRIPTION,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "es",
    },
  ],
};

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const el = document.querySelector(hash);
    if (el) {
      setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 100);
    }
  }, [router.asPath]);

  return (
    <>
      <Head>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover"
        />
        <link rel="icon" href="/favicon.ico" />

        {/* Canonical & Hreflang */}
        <link rel="canonical" href={SITE_URL} />
        <link rel="alternate" hrefLang="x-default" href={SITE_URL} />
        <link rel="alternate" hrefLang="es" href={SITE_URL} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:image" content={`${SITE_URL}/og-image.png`} />
        <meta property="og:locale" content="es_PE" />
        <meta property="og:site_name" content="Onilabs" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />
        <meta name="twitter:image" content={`${SITE_URL}/og-image.png`} />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </Head>

      <PromoModal />
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <Hero />
          <Services />
          <FeaturedProjects />
          <Process />
          <Team />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
}

import Head from "next/head";
import Navbar from "../components/Navbar";
import AllProjects from "../components/AllProjects";
import Footer from "../components/Footer";
import { SITE_URL } from "../lib/site";

const PAGE_URL = `${SITE_URL}/proyectos`;
const TITLE = "Proyectos - Onilabs";
const DESCRIPTION =
  "Todos los proyectos desarrollados por Onilabs: ecommerce, plataformas corporativas, apps móviles y más.";

export default function ProyectosPage() {
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
      </Head>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <AllProjects />
        </main>
        <Footer />
      </div>
    </>
  );
}

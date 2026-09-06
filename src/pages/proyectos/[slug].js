import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ProjectShowcase from "../../components/showcase/ProjectShowcase";
import { getProyectosReales } from "../../data/onilabs";
import { getProyectosSeo, getProyectoPorSlug } from "../../data/proyectos-seo";
import { SITE_URL } from "../../lib/site";
import { DEFAULT_LOCALE } from "../../lib/i18n";

export default function ProyectoPage({ proyecto, relacionados }) {
  const pageUrl = `${SITE_URL}/proyectos/${proyecto.slug}`;
  const titulo = `${proyecto.nombre} — Caso de ${proyecto.categoria} | Onilabs`;
  const descripcion = proyecto.descripcion;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${pageUrl}/#project`,
        name: proyecto.nombre,
        description: descripcion,
        url: pageUrl,
        creator: { "@id": `${SITE_URL}/#organization` },
        keywords: proyecto.stack.join(", "),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}/#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: "Proyectos",
            item: `${SITE_URL}/proyectos`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: proyecto.nombre,
            item: pageUrl,
          },
        ],
      },
    ],
  };

  return (
    <>
      <Head>
        <title>{titulo}</title>
        <meta name="description" content={descripcion} />

        <link rel="canonical" href={pageUrl} />
        <link rel="alternate" hrefLang="x-default" href={pageUrl} />
        <link rel="alternate" hrefLang="es" href={pageUrl} />

        <meta property="og:type" content="article" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content={titulo} />
        <meta property="og:description" content={descripcion} />
        <meta
          property="og:image"
          content={
            proyecto.imagen ? `${SITE_URL}${proyecto.imagen}` : `${SITE_URL}/og-image.png`
          }
        />
        <meta property="og:locale" content="es_PE" />
        <meta property="og:site_name" content="Onilabs" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={titulo} />
        <meta name="twitter:description" content={descripcion} />

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
                    href="/proyectos"
                    className="hover:text-primary transition-colors"
                  >
                    Proyectos
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-text-primary font-medium">
                  {proyecto.nombre}
                </li>
              </ol>
            </nav>

            <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-3">
              {proyecto.categoria}
            </p>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary leading-tight mb-6">
              {proyecto.nombre}
            </h1>

            <p className="text-lg text-text-secondary leading-relaxed mb-10">
              {descripcion}
            </p>

            {proyecto.imagen && (
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-border mb-12 bg-surface">
                <Image
                  src={proyecto.imagen}
                  alt={`Captura del proyecto ${proyecto.nombre}`}
                  fill
                  sizes="(min-width: 768px) 768px, 100vw"
                  className="object-cover object-top"
                />
              </div>
            )}

            <section className="mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-4">
                El desafío
              </h2>
              <p className="text-text-secondary leading-relaxed">
                {proyecto.desafio}
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-4">
                Cómo lo resolvimos
              </h2>
              <p className="text-text-secondary leading-relaxed">
                {proyecto.enfoque}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-4">
                Stack
              </h2>
              <ul className="flex flex-wrap gap-2">
                {proyecto.stack.map((tecnologia) => (
                  <li
                    key={tecnologia}
                    className="border border-border rounded-lg px-3 py-1.5 text-sm text-text-secondary bg-surface"
                  >
                    {tecnologia}
                  </li>
                ))}
              </ul>
            </section>

            <section className="mb-12">
              <ProjectShowcase proyecto={proyecto} />
            </section>

            {proyecto.url && (
              <section className="mb-14">
                <a
                  href={proyecto.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors"
                >
                  Ver el proyecto en vivo
                  <span aria-hidden="true">&rarr;</span>
                </a>
              </section>
            )}

            <section className="border-t border-border pt-10 mb-14">
              <h2 className="text-2xl font-bold text-text-primary mb-3">
                ¿Necesitás algo parecido?
              </h2>
              <p className="text-text-secondary leading-relaxed mb-6">
                Contanos qué tenés en mente y te respondemos con una propuesta
                clara de alcance, tiempos y costos.
              </p>
              <Link
                href="/#contactanos"
                className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors"
              >
                Contactanos
              </Link>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text-primary mb-4">
                Otros proyectos
              </h2>
              <ul className="grid sm:grid-cols-2 gap-3">
                {relacionados.map((otro) => (
                  <li key={otro.slug}>
                    <Link
                      href={`/proyectos/${otro.slug}`}
                      className="block border border-border rounded-lg px-4 py-3 hover:border-primary transition-colors"
                    >
                      <span className="block font-semibold text-text-primary">
                        {otro.nombre}
                      </span>
                      <span className="block text-sm text-text-secondary">
                        {otro.categoria}
                      </span>
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

const construirProyecto = (id, proyectosReales, proyectosSeo) => {
  const base = proyectosReales.find((proyecto) => proyecto.id === id);
  const seo = proyectosSeo[id];
  if (!base || !seo) return null;
  return {
    id,
    nombre: base.nombre,
    descripcion: base.descripcion,
    imagen: base.imagen || null,
    url: base.url || null,
    stack: base.stack,
    ...seo,
  };
};

export function getStaticPaths() {
  const proyectosSeo = getProyectosSeo(DEFAULT_LOCALE);
  return {
    paths: Object.values(proyectosSeo).map((datos) => ({
      params: { slug: datos.slug },
    })),
    fallback: false,
  };
}

export function getStaticProps({ params }) {
  const proyectosReales = getProyectosReales(DEFAULT_LOCALE);
  const proyectosSeo = getProyectosSeo(DEFAULT_LOCALE);
  const encontrado = getProyectoPorSlug(params.slug, DEFAULT_LOCALE);
  if (!encontrado) return { notFound: true };

  const proyecto = construirProyecto(encontrado.id, proyectosReales, proyectosSeo);
  if (!proyecto) return { notFound: true };

  const relacionados = Object.entries(proyectosSeo)
    .filter(([id]) => Number(id) !== encontrado.id)
    .map(([id, datos]) => {
      const base = proyectosReales.find((p) => p.id === Number(id));
      return base ? { nombre: base.nombre, slug: datos.slug, categoria: datos.categoria } : null;
    })
    .filter(Boolean)
    .slice(0, 4);

  return { props: { proyecto, relacionados } };
}

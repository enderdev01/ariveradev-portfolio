// Per-project narrative for the /proyectos/[slug] detail pages, keyed by the
// id used in proyectosReales. Only projects listed here get an indexable page,
// which keeps unreleased work out of the index.
//
// Rule for this file: describe the problem and the technical approach only.
// Never state client metrics or outcomes that the team has not provided.
//
// User-visible text fields carry an `{es, en}` shape (design D1). `slug` and
// `categoria`-derived keys are NOT localized: slugs are URL identifiers and
// `categoria` drives `toCategoryKey` only as a resolved string.

import { resolve } from "../lib/i18n";

export const proyectosSeo = {
  1: {
    slug: "taffe-regalos",
    categoria: { es: "Ecommerce", en: null },
    desafio: {
      es: "Vender regalos y giftboxes online tiene un problema propio: la compra es por impulso y casi siempre a contrarreloj. Cada paso extra en el checkout es una venta que se cae.",
      en: null,
    },
    enfoque: {
      es: "Montamos la tienda sobre WooCommerce para que el equipo pudiera administrar el catálogo sin depender de un programador, y ajustamos el flujo de compra para acortar el camino entre ver un producto y pagarlo. La integración con Stripe resuelve el cobro con tarjeta y el manejo de confirmaciones automáticas.",
      en: null,
    },
  },
  2: {
    slug: "integra-bpo",
    categoria: { es: "Sitio corporativo", en: null },
    desafio: {
      es: "Una empresa de BPO que vende a otras empresas se juega la primera impresión en el sitio. El visitante no compra ahí: evalúa si vale la pena una reunión.",
      en: null,
    },
    enfoque: {
      es: "Construimos el sitio con Next.js, priorizando velocidad de carga y una estructura que ordena los servicios de forma comprensible para alguien que llega sin contexto. El foco estuvo en convertir la visita en una consulta comercial concreta, no en acumular secciones.",
      en: null,
    },
  },
  3: {
    slug: "creative-home",
    categoria: { es: "Ecommerce", en: null },
    desafio: {
      es: "Los muebles y la decoración se compran con los ojos. El catálogo tenía que dejar explorar sin fricción, con la imagen como protagonista y no como adorno.",
      en: null,
    },
    enfoque: {
      es: "Ecommerce sobre WooCommerce y WordPress con MySQL, pensado para que la navegación por categorías sea el camino natural y las solicitudes de compra lleguen sin obligar al visitante a completar formularios largos.",
      en: null,
    },
  },
  4: {
    slug: "edificio-loma-amarilla",
    categoria: { es: "Landing inmobiliaria", en: null },
    desafio: {
      es: "Una landing inmobiliaria tiene un solo trabajo: que alguien deje sus datos. Todo lo que no empuje hacia eso es ruido.",
      en: null,
    },
    enfoque: {
      es: "Landing sobre WordPress con Elementor, elegida para que el equipo comercial pudiera ajustar textos y beneficios durante la campaña sin depender de un desarrollo. La estructura ordena los beneficios del proyecto y lleva al formulario de contacto.",
      en: null,
    },
  },
  5: {
    slug: "santed",
    categoria: { es: "Plataforma web", en: null },
    desafio: {
      es: "En salud, la información desordenada genera desconfianza. El paciente necesita entender qué servicios existen y cómo acceder a ellos sin tener que llamar para averiguarlo.",
      en: null,
    },
    enfoque: {
      es: "Plataforma con React en el frontend, Node.js en el servidor y PostgreSQL como base de datos. Esa combinación permite estructurar la información institucional de forma consistente y hacerla crecer sin rehacer el sitio cada vez que se suma un servicio.",
      en: null,
    },
  },
  6: {
    slug: "d-segunda",
    categoria: { es: "Marketplace", en: null },
    desafio: {
      es: "Un marketplace de segunda mano tiene catálogo cambiante y publicaciones que entran y salen todo el tiempo. La navegación tiene que seguir siendo simple aunque el inventario nunca sea estable.",
      en: null,
    },
    enfoque: {
      es: "Ecommerce sobre WooCommerce y WordPress con MySQL, con el catálogo administrable desde el panel para que publicar y dar de baja productos sea una tarea diaria del equipo y no un pedido de desarrollo.",
      en: null,
    },
  },
  8: {
    slug: "impuestos-peru",
    categoria: { es: "App móvil", en: null },
    desafio: {
      es: "Calcular impuestos en Perú es tedioso y la mayoría termina haciéndolo en una planilla. La app tenía que resolverlo en el teléfono, rápido y sin registro previo.",
      en: null,
    },
    enfoque: {
      es: "Aplicación Android desarrollada con React Native y Firebase, publicada en Google Play. React Native permitió mantener una sola base de código, y Firebase resolvió backend y datos sin montar infraestructura propia para un producto de este alcance.",
      en: null,
    },
  },
  9: {
    slug: "bks-moda",
    categoria: { es: "Ecommerce", en: null },
    desafio: {
      es: "En moda el catálogo rota por temporada. Si cargar una colección nueva depende de un desarrollador, la tienda queda siempre desactualizada.",
      en: null,
    },
    enfoque: {
      es: "Tienda sobre WooCommerce y WordPress con catálogo totalmente administrable y pagos online integrados con Stripe. El objetivo fue que la operación diaria —cargar productos, cambiar precios, publicar promociones— quedara del lado del cliente.",
      en: null,
    },
  },
  10: {
    slug: "ecoshipperu",
    categoria: { es: "Landing corporativa", en: null },
    desafio: {
      es: "Logística y envíos es un rubro donde el visitante llega con una duda puntual. Si no la resuelve en la primera pantalla, se va a la siguiente pestaña.",
      en: null,
    },
    enfoque: {
      es: "Landing con Next.js y Tailwind CSS desplegada en Vercel. La estructura explica los servicios en orden de interés y empuja hacia la consulta, con tiempos de carga bajos para no perder visitas antes de que el contenido aparezca.",
      en: null,
    },
  },
  11: {
    slug: "onigrowth",
    categoria: { es: "Plataforma", en: null },
    desafio: {
      es: "Vender sistemas de prompts implica demostrar el valor antes de la compra. El producto es invisible hasta que alguien ve lo que genera.",
      en: null,
    },
    enfoque: {
      es: "Plataforma comercial integrada con modelos de OpenAI, Claude y Gemini. Trabajar con múltiples proveedores permite elegir el modelo según la tarea y no quedar atado a la disponibilidad, los precios o los límites de uno solo.",
      en: null,
    },
  },
  12: {
    slug: "versus-electoral-peru",
    categoria: { es: "Plataforma cívica", en: null },
    desafio: {
      es: "Comparar candidatos exige presentar información sensible sin inclinar la balanza. El diseño tenía que ordenar los datos y dejar que el usuario saque sus propias conclusiones.",
      en: null,
    },
    enfoque: {
      es: "Plataforma con Next.js y Tailwind CSS en Vercel. El renderizado estático mantiene el sitio en pie cuando el tráfico se dispara, que en una plataforma electoral ocurre de golpe y en ventanas muy concretas.",
      en: null,
    },
  },
  14: {
    slug: "yomiru-manga",
    categoria: { es: "Plataforma", en: null },
    desafio: {
      es: "Leer manga online se arruina con esperas. Si cada capítulo tarda en abrir, el lector abandona la plataforma sin importar cuán bueno sea el catálogo.",
      en: null,
    },
    enfoque: {
      es: "Plataforma de lectura construida con Next.js, enfocada en que explorar títulos y abrir capítulos sea inmediato. La carga de imágenes es el punto crítico de un lector de manga y fue el eje de las decisiones técnicas.",
      en: null,
    },
  },
  15: {
    slug: "guess-the-year",
    categoria: { es: "Juego online", en: null },
    desafio: {
      es: "Un juego multijugador no perdona la latencia. Si un jugador ve el resultado antes que otro, la partida pierde sentido.",
      en: null,
    },
    enfoque: {
      es: "Juego multijugador en tiempo real inspirado en Hitster, donde varios jugadores compiten adivinando el año de cada canción. La sincronización del estado entre participantes es el corazón del proyecto: todos tienen que ver lo mismo al mismo tiempo.",
      en: null,
    },
  },
  16: {
    slug: "tds-tech-d-solution",
    categoria: { es: "Landing y ecommerce", en: null },
    desafio: {
      es: "Los productos industriales para transporte, minería y vehículos marítimos tienen fichas técnicas densas y compradores que saben exactamente qué buscan. El catálogo tiene que ser preciso, no vistoso.",
      en: null,
    },
    enfoque: {
      es: "Landing y ecommerce con catálogo estructurado por categoría de producto, pensado para que un comprador técnico llegue rápido a la ficha que necesita y pueda pedir cotización desde ahí.",
      en: null,
    },
  },
  18: {
    slug: "onistore",
    categoria: { es: "Ecommerce", en: null },
    desafio: {
      es: "Un ecommerce de manga y coleccionables maneja mucha referencia, stock que se agota rápido y envíos a todo el país. Sin un panel propio, la operación se vuelve inmanejable.",
      en: null,
    },
    enfoque: {
      es: "Tienda construida con Next.js junto a un panel administrativo propio para gestionar catálogo y pedidos. Desarrollar el panel a medida, en lugar de adaptar uno genérico, permitió que refleje cómo trabaja realmente el negocio.",
      en: null,
    },
  },
};

export const getProyectosSeo = (locale) => resolve(proyectosSeo, locale);

export const getProyectoSeo = (id, locale) => {
  const entry = proyectosSeo[id];
  return entry ? resolve(entry, locale) : null;
};

export const getProyectoPorSlug = (slug, locale) => {
  const entrada = Object.entries(proyectosSeo).find(
    ([, datos]) => datos.slug === slug
  );
  if (!entrada) return null;
  return { id: Number(entrada[0]), ...resolve(entrada[1], locale) };
};

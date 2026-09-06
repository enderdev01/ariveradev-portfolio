// Per-project narrative for the /proyectos/[slug] detail pages, keyed by the
// id used in proyectosReales. Only projects listed here get an indexable page,
// which keeps unreleased work out of the index.
//
// Rule for this file: describe the problem and the technical approach only.
// Never state client metrics or outcomes that the team has not provided.

export const proyectosSeo = {
  1: {
    slug: "taffe-regalos",
    categoria: "Ecommerce",
    desafio:
      "Vender regalos y giftboxes online tiene un problema propio: la compra es por impulso y casi siempre a contrarreloj. Cada paso extra en el checkout es una venta que se cae.",
    enfoque:
      "Montamos la tienda sobre WooCommerce para que el equipo pudiera administrar el catálogo sin depender de un programador, y ajustamos el flujo de compra para acortar el camino entre ver un producto y pagarlo. La integración con Stripe resuelve el cobro con tarjeta y el manejo de confirmaciones automáticas.",
  },
  2: {
    slug: "integra-bpo",
    categoria: "Sitio corporativo",
    desafio:
      "Una empresa de BPO que vende a otras empresas se juega la primera impresión en el sitio. El visitante no compra ahí: evalúa si vale la pena una reunión.",
    enfoque:
      "Construimos el sitio con Next.js, priorizando velocidad de carga y una estructura que ordena los servicios de forma comprensible para alguien que llega sin contexto. El foco estuvo en convertir la visita en una consulta comercial concreta, no en acumular secciones.",
  },
  3: {
    slug: "creative-home",
    categoria: "Ecommerce",
    desafio:
      "Los muebles y la decoración se compran con los ojos. El catálogo tenía que dejar explorar sin fricción, con la imagen como protagonista y no como adorno.",
    enfoque:
      "Ecommerce sobre WooCommerce y WordPress con MySQL, pensado para que la navegación por categorías sea el camino natural y las solicitudes de compra lleguen sin obligar al visitante a completar formularios largos.",
  },
  4: {
    slug: "edificio-loma-amarilla",
    categoria: "Landing inmobiliaria",
    desafio:
      "Una landing inmobiliaria tiene un solo trabajo: que alguien deje sus datos. Todo lo que no empuje hacia eso es ruido.",
    enfoque:
      "Landing sobre WordPress con Elementor, elegida para que el equipo comercial pudiera ajustar textos y beneficios durante la campaña sin depender de un desarrollo. La estructura ordena los beneficios del proyecto y lleva al formulario de contacto.",
  },
  5: {
    slug: "santed",
    categoria: "Plataforma web",
    desafio:
      "En salud, la información desordenada genera desconfianza. El paciente necesita entender qué servicios existen y cómo acceder a ellos sin tener que llamar para averiguarlo.",
    enfoque:
      "Plataforma con React en el frontend, Node.js en el servidor y PostgreSQL como base de datos. Esa combinación permite estructurar la información institucional de forma consistente y hacerla crecer sin rehacer el sitio cada vez que se suma un servicio.",
  },
  6: {
    slug: "d-segunda",
    categoria: "Marketplace",
    desafio:
      "Un marketplace de segunda mano tiene catálogo cambiante y publicaciones que entran y salen todo el tiempo. La navegación tiene que seguir siendo simple aunque el inventario nunca sea estable.",
    enfoque:
      "Ecommerce sobre WooCommerce y WordPress con MySQL, con el catálogo administrable desde el panel para que publicar y dar de baja productos sea una tarea diaria del equipo y no un pedido de desarrollo.",
  },
  8: {
    slug: "impuestos-peru",
    categoria: "App móvil",
    desafio:
      "Calcular impuestos en Perú es tedioso y la mayoría termina haciéndolo en una planilla. La app tenía que resolverlo en el teléfono, rápido y sin registro previo.",
    enfoque:
      "Aplicación Android desarrollada con React Native y Firebase, publicada en Google Play. React Native permitió mantener una sola base de código, y Firebase resolvió backend y datos sin montar infraestructura propia para un producto de este alcance.",
  },
  9: {
    slug: "bks-moda",
    categoria: "Ecommerce",
    desafio:
      "En moda el catálogo rota por temporada. Si cargar una colección nueva depende de un desarrollador, la tienda queda siempre desactualizada.",
    enfoque:
      "Tienda sobre WooCommerce y WordPress con catálogo totalmente administrable y pagos online integrados con Stripe. El objetivo fue que la operación diaria —cargar productos, cambiar precios, publicar promociones— quedara del lado del cliente.",
  },
  10: {
    slug: "ecoshipperu",
    categoria: "Landing corporativa",
    desafio:
      "Logística y envíos es un rubro donde el visitante llega con una duda puntual. Si no la resuelve en la primera pantalla, se va a la siguiente pestaña.",
    enfoque:
      "Landing con Next.js y Tailwind CSS desplegada en Vercel. La estructura explica los servicios en orden de interés y empuja hacia la consulta, con tiempos de carga bajos para no perder visitas antes de que el contenido aparezca.",
  },
  11: {
    slug: "onigrowth",
    categoria: "Plataforma",
    desafio:
      "Vender sistemas de prompts implica demostrar el valor antes de la compra. El producto es invisible hasta que alguien ve lo que genera.",
    enfoque:
      "Plataforma comercial integrada con modelos de OpenAI, Claude y Gemini. Trabajar con múltiples proveedores permite elegir el modelo según la tarea y no quedar atado a la disponibilidad, los precios o los límites de uno solo.",
  },
  12: {
    slug: "versus-electoral-peru",
    categoria: "Plataforma cívica",
    desafio:
      "Comparar candidatos exige presentar información sensible sin inclinar la balanza. El diseño tenía que ordenar los datos y dejar que el usuario saque sus propias conclusiones.",
    enfoque:
      "Plataforma con Next.js y Tailwind CSS en Vercel. El renderizado estático mantiene el sitio en pie cuando el tráfico se dispara, que en una plataforma electoral ocurre de golpe y en ventanas muy concretas.",
  },
  14: {
    slug: "yomiru-manga",
    categoria: "Plataforma",
    desafio:
      "Leer manga online se arruina con esperas. Si cada capítulo tarda en abrir, el lector abandona la plataforma sin importar cuán bueno sea el catálogo.",
    enfoque:
      "Plataforma de lectura construida con Next.js, enfocada en que explorar títulos y abrir capítulos sea inmediato. La carga de imágenes es el punto crítico de un lector de manga y fue el eje de las decisiones técnicas.",
  },
  15: {
    slug: "guess-the-year",
    categoria: "Juego online",
    desafio:
      "Un juego multijugador no perdona la latencia. Si un jugador ve el resultado antes que otro, la partida pierde sentido.",
    enfoque:
      "Juego multijugador en tiempo real inspirado en Hitster, donde varios jugadores compiten adivinando el año de cada canción. La sincronización del estado entre participantes es el corazón del proyecto: todos tienen que ver lo mismo al mismo tiempo.",
  },
  16: {
    slug: "tds-tech-d-solution",
    categoria: "Landing y ecommerce",
    desafio:
      "Los productos industriales para transporte, minería y vehículos marítimos tienen fichas técnicas densas y compradores que saben exactamente qué buscan. El catálogo tiene que ser preciso, no vistoso.",
    enfoque:
      "Landing y ecommerce con catálogo estructurado por categoría de producto, pensado para que un comprador técnico llegue rápido a la ficha que necesita y pueda pedir cotización desde ahí.",
  },
  18: {
    slug: "onistore",
    categoria: "Ecommerce",
    desafio:
      "Un ecommerce de manga y coleccionables maneja mucha referencia, stock que se agota rápido y envíos a todo el país. Sin un panel propio, la operación se vuelve inmanejable.",
    enfoque:
      "Tienda construida con Next.js junto a un panel administrativo propio para gestionar catálogo y pedidos. Desarrollar el panel a medida, en lugar de adaptar uno genérico, permitió que refleje cómo trabaja realmente el negocio.",
  },
};

export const getProyectoSeo = (id) => proyectosSeo[id] || null;

export const getProyectoPorSlug = (slug) => {
  const entrada = Object.entries(proyectosSeo).find(
    ([, datos]) => datos.slug === slug
  );
  return entrada ? { id: Number(entrada[0]), ...entrada[1] } : null;
};

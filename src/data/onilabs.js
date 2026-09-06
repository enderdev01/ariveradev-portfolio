import { resolve } from "../lib/i18n";

export const servicios = [
  {
    id: 1,
    titulo: { es: "Desarrollo Web", en: null },
    slug: "desarrollo-web",
    descripcion: {
      es: "Landing pages, sitios corporativos, dashboards y aplicaciones SaaS con tecnologías modernas y escalables.",
      en: null,
    },
    icono: "🌐",
  },
  {
    id: 2,
    titulo: { es: "Aplicaciones Móviles", en: null },
    slug: "aplicaciones-moviles",
    descripcion: {
      es: "Apps nativas y multiplataforma para Android e iOS con React Native e Ionic.",
      en: null,
    },
    icono: "📱",
  },
  {
    id: 3,
    titulo: { es: "Microservicios & Integraciones", en: null },
    slug: "integraciones-api",
    descripcion: {
      es: "APIs RESTful, integraciones con CRMs, sistemas de pagos, colas de mensajería y webhooks.",
      en: null,
    },
    icono: "🔌",
  },
  {
    id: 4,
    titulo: { es: "Ecommerce/WooCommerce", en: null },
    slug: "ecommerce-woocommerce",
    descripcion: {
      es: "Tiendas online optimizadas, plugins personalizados, integración de pagos y gestión de inventario.",
      en: null,
    },
    icono: "🛒",
  },
  {
    id: 5,
    titulo: { es: "Arquitectura Escalable", en: null },
    slug: "software-a-medida",
    descripcion: {
      es: "Diseño de sistemas robustos, cloud deployment, CI/CD y optimización de performance.",
      en: null,
    },
    icono: "⚡",
  },
  {
    id: 6,
    titulo: { es: "Mantenimiento & Evolución", en: null },
    slug: "mantenimiento-web",
    descripcion: {
      es: "Soporte continuo, mejoras incrementales, observabilidad y monitoreo de aplicaciones.",
      en: null,
    },
    icono: "🔧",
  },
];

export const proyectosEjemplo = [
  {
    id: 1,
    titulo: { es: "Ecommerce WooCommerce para Retail", en: null },
    objetivo: {
      es: "Plataforma de comercio electrónico completa con catálogo extenso, múltiples métodos de pago y gestión de envíos.",
      en: null,
    },
    stack: ["WordPress", "WooCommerce", "PHP", "MySQL", "Stripe"],
    resultado: {
      es: "Mejoró la conversión de visitantes a clientes y redujo tiempos de procesamiento de pedidos.",
      en: null,
    },
  },
  {
    id: 2,
    titulo: { es: "Web Corporativa con CMS Multi-idioma", en: null },
    objetivo: {
      es: "Sitio web corporativo con gestión de contenido y soporte multi-idioma para expansión internacional.",
      en: null,
    },
    stack: ["Next.js", "Contentful", "i18n", "Tailwind CSS"],
    resultado: {
      es: "Aumentó el alcance internacional y facilitó la gestión de contenido por parte del equipo.",
      en: null,
    },
  },
  {
    id: 3,
    titulo: { es: "Dashboard de Analítica Empresarial", en: null },
    objetivo: {
      es: "Panel de control con métricas en tiempo real, roles de usuario y exportación de reportes.",
      en: null,
    },
    stack: ["React", "TypeScript", "Chart.js", "Node.js", "PostgreSQL"],
    resultado: {
      es: "Centralizó la información y mejoró la toma de decisiones estratégicas.",
      en: null,
    },
  },
  {
    id: 4,
    titulo: { es: "App Móvil para Logística", en: null },
    objetivo: {
      es: "Aplicación móvil para seguimiento de entregas, notificaciones push y gestión de estados en tiempo real.",
      en: null,
    },
    stack: ["React Native", "Firebase", "Node.js", "MongoDB"],
    resultado: {
      es: "Optimizó la comunicación con clientes y redujo consultas de seguimiento.",
      en: null,
    },
  },
  {
    id: 5,
    titulo: { es: "Integración de Pagos + Webhooks", en: null },
    objetivo: {
      es: "Sistema de integración con Mercado Pago, procesamiento de webhooks y reconciliación automática.",
      en: null,
    },
    stack: ["Node.js", "NestJS", "PostgreSQL", "Redis", "Mercado Pago API"],
    resultado: {
      es: "Automatizó el proceso de pagos y mejoró la precisión en la reconciliación financiera.",
      en: null,
    },
  },
  {
    id: 6,
    titulo: { es: "Plataforma SaaS con Suscripciones", en: null },
    objetivo: {
      es: "Aplicación SaaS con planes free/premium, control de acceso basado en roles y facturación automática.",
      en: null,
    },
    stack: ["Next.js", "Stripe", "PostgreSQL", "Auth0", "AWS"],
    resultado: {
      es: "Escaló la base de usuarios y automatizó el proceso de facturación y gestión de suscripciones.",
      en: null,
    },
  },
];

export const equipo = [
  {
    id: 1,
    nombre: { es: "ENDER", en: null },
    rol: { es: "CEO", en: null },
    bio: {
      es: "Lidera la visión estratégica y las relaciones con clientes, enfocado en entregar soluciones que generen valor real.",
      en: null,
    },
    iniciales: "E",
    imagen: "/ender.png",
  },
  {
    id: 2,
    nombre: { es: "AKHSEL", en: null },
    rol: { es: "Developer", en: null },
    bio: {
      es: "Especialista en desarrollo full-stack y arquitectura de sistemas escalables con experiencia en tecnologías modernas.",
      en: null,
    },
    iniciales: "A",
    imagen: "/acxeldev.jpeg",
  },
  {
    id: 3,
    nombre: { es: "L1NTCH", en: null },
    rol: { es: "Developer", en: null },
    bio: {
      es: "Desarrollador experto en aplicaciones móviles y APIs, con enfoque en performance y experiencia de usuario.",
      en: null,
    },
    iniciales: "M",
    imagen: "/mauro.jpg",
  },
  {
    id: 4,
    nombre: { es: "GHOST", en: null },
    rol: { es: "Developer", en: null },
    bio: {
      es: "Desarrollador especializado en integraciones complejas, microservicios y optimización de sistemas existentes.",
      en: null,
    },
    iniciales: "G",
    imagen: "/samuel.jpeg",
  },
];

export const procesoi = [
  {
    id: 1,
    paso: { es: "Descubrimiento", en: null },
    descripcion: {
      es: "Analizamos tus necesidades, objetivos y contexto del negocio para definir el alcance del proyecto.",
      en: null,
    },
  },
  {
    id: 3,
    paso: { es: "Diseño/Arquitectura", en: null },
    descripcion: {
      es: "Diseñamos la experiencia de usuario y arquitectura técnica que garantice escalabilidad y mantenibilidad.",
      en: null,
    },
  },
  {
    id: 5,
    paso: { es: "Deploy/Soporte", en: null },
    descripcion: {
      es: "Desplegamos en producción y brindamos soporte continuo, monitoreo y mejoras basadas en métricas reales.",
      en: null,
    },
  },
];

export const procesop = [
  {
    id: 2,
    paso: { es: "Propuesta", en: null },
    descripcion: {
      es: "Presentamos una propuesta técnica detallada con tiempos, tecnologías y presupuesto ajustado a tus requerimientos.",
      en: null,
    },
  },
  {
    id: 4,
    paso: { es: "Desarrollo", en: null },
    descripcion: {
      es: "Desarrollamos iterativamente con entregas incrementales, manteniendo comunicación constante y feedback continuo.",
      en: null,
    },
  },
];

export const proyectosReales = [
  {
    id: 1,
    nombre: { es: "Taffe Regalos", en: null },
    imagen: "/tafferegalos.png",
    url: "https://tafferegalos.com/",
    descripcion: {
      es: "Tienda online para vender regalos y giftboxes con una experiencia de compra rápida y enfocada en conversiones.",
      en: null,
    },
    stack: ["WooCommerce", "WordPress", "PHP", "Stripe"],
  },
  {
    id: 2,
    nombre: { es: "Integra BPO", en: null },
    imagen: "/integra.png",
    url: "https://integrasgp.com/",
    descripcion: {
      es: "Sitio corporativo para presentar servicios BPO, fortalecer la confianza comercial y captar oportunidades desde Latam.",
      en: null,
    },
    stack: ["Next.js", "Tailwind CSS", "Node.js"],
  },
  {
    id: 3,
    nombre: { es: "Creative Home", en: null },
    imagen: "/creativehome.png",
    url: "https://creativehome.pe/",
    descripcion: {
      es: "Ecommerce para exhibir muebles y decoración, pensado para facilitar la exploración de productos y solicitudes de compra.",
      en: null,
    },
    stack: ["WooCommerce", "WordPress", "PHP", "MySQL"],
    sinSoporte: true,
  },
  {
    id: 4,
    nombre: { es: "Edificio Loma Amarilla", en: null },
    imagen: "/lomamarilla.png",
    url: "https://edificiolomaamarilla.com/",
    descripcion: {
      es: "Landing inmobiliaria para presentar el proyecto, comunicar beneficios clave y generar contactos de clientes interesados.",
      en: null,
    },
    stack: ["WordPress", "PHP", "Elementor"],
    sinSoporte: true,
  },
  {
    id: 5,
    nombre: { es: "Santed", en: null },
    imagen: "/santed.png",
    url: "https://www.santed.com.pe/",
    descripcion: {
      es: "Plataforma web para comunicar servicios médicos, ordenar la información institucional y facilitar el contacto con pacientes.",
      en: null,
    },
    stack: ["React", "Node.js", "PostgreSQL"],
  },
  {
    id: 6,
    nombre: { es: "D Segunda", en: null },
    imagen: "/dsegunda.png",
    url: "https://dsegunda.com/",
    descripcion: {
      es: "Marketplace ecommerce para publicar y vender productos de segunda mano con navegación simple y catálogo administrable.",
      en: null,
    },
    stack: ["WooCommerce", "WordPress", "PHP", "MySQL"],
    sinSoporte: true,
  },
  {
    id: 8,
    nombre: { es: "Impuestos Perú", en: null },
    imagen: "/impuestosperu.png",
    url: "https://play.google.com/store/apps/details?id=com.impuestosperu&hl=es_PE",
    descripcion: {
      es: "Aplicación móvil para consultar y calcular impuestos de forma práctica desde Android.",
      en: null,
    },
    stack: ["React Native", "Firebase", "Android"],
    sinSoporte: true,
  },
  {
    id: 9,
    nombre: { es: "BKS Moda", en: null },
    imagen: "/557shots_so.png",
    url: "https://bksmoda.com/",
    descripcion: {
      es: "Ecommerce de moda y accesorios con catálogo administrable, pagos online y una experiencia de compra directa.",
      en: null,
    },
    stack: ["WooCommerce", "WordPress", "Stripe", "PHP"],
  },
  {
    id: 10,
    nombre: { es: "Ecoshipperu", en: null },
    imagen: "/42shots_so.png",
    url: "https://www.ecoshipperu.com/",
    descripcion: {
      es: "Landing para una empresa de logística y envíos, diseñada para explicar servicios y convertir visitas en consultas.",
      en: null,
    },
    stack: ["Next.js", "Tailwind CSS", "Vercel"],
  },
  {
    id: 11,
    nombre: { es: "Onigrowth", en: null },
    imagen: "/279shots_so.png",
    url: "https://www.onigrowth.com/",
    descripcion: {
      es: "Plataforma comercial para vender sistemas de prompts y ayudar a equipos a obtener mejores resultados con IA generativa.",
      en: null,
    },
    stack: ["OpenAI", "Claude", "Gemini"],
  },
  {
    id: 12,
    nombre: { es: "Versus Electoral Perú", en: null },
    imagen: "/387shots_so.png",
    url: "https://www.versuselectoral.com/",
    descripcion: {
      es: "Plataforma cívica para comparar candidatos, organizar información electoral y ayudar a los usuarios a decidir mejor.",
      en: null,
    },
    stack: ["Next.js", "Tailwind CSS", "Vercel"],
  },
  {
    id: 18,
    nombre: { es: "Onistore", en: null },
    imagen: "/onistore2.png",
    url: "https://www.onistore.store/",
    descripcion: {
      es: "Ecommerce de manga, figuras y coleccionables anime con envíos a todo el Perú y panel administrativo para gestionar catálogo y pedidos.",
      en: null,
    },
    stack: ["Next.js", "Ecommerce", "Admin Panel"],
  },
  {
    id: 14,
    nombre: { es: "Yomiru Manga", en: null },
    imagen: "/yomiru.png",
    url: "https://yomiru-manga-web.vercel.app/",
    descripcion: {
      es: "Plataforma de lectura de mangas con una experiencia fluida para explorar títulos, abrir capítulos y leer online.",
      en: null,
    },
    stack: ["Next.js", "Manga Reader", "Plataforma"],
  },
  {
    id: 15,
    nombre: { es: "Guess The Year", en: null },
    imagen: "/guesstheyear.png",
    url: "https://guess-the-year-e7pd.onrender.com/",
    descripcion: {
      es: "Juego multijugador online inspirado en Hitster para competir con amigos adivinando el año de cada canción.",
      en: null,
    },
    stack: ["Realtime", "Multiplayer", "Game"],
  },
  {
    id: 16,
    nombre: { es: "TDS", en: null },
    imagen: "/173shots_so.png",
    descripcion: {
      es: "Landing y ecommerce para presentar productos industriales de transporte, minería y vehículos marítimos.",
      en: null,
    },
    stack: ["Landing", "Ecommerce", "Catálogo"],
    url: "https://www.techdsolution.com/",
  },
  {
    id: 17,
    nombre: { es: "MVP Travel Marketplace", en: null },
    descripcion: {
      es: "MVP de marketplace turístico para vender productos de viaje, paquetes, servicios, blogs y planificación con multisellers.",
      en: null,
    },
    stack: ["Marketplace", "Turismo", "MVP"],
    estado: "proximamente",
  },
].sort((a, b) => {
  if (a.sinSoporte !== b.sinSoporte) return a.sinSoporte ? 1 : -1;
  return b.id - a.id;
});

export const getServicios = (locale) => resolve(servicios, locale);
export const getEquipo = (locale) => resolve(equipo, locale);
export const getProceso = (locale) => {
  const combined = [...resolve(procesoi, locale), ...resolve(procesop, locale)]
    .sort((a, b) => a.id - b.id);
  return combined;
};
export const getProyectosReales = (locale) => resolve(proyectosReales, locale);

export const servicios = [
  {
    id: 1,
    titulo: "Desarrollo Web",
    slug: "desarrollo-web",
    descripcion:
      "Landing pages, sitios corporativos, dashboards y aplicaciones SaaS con tecnologías modernas y escalables.",
    icono: "🌐",
  },
  {
    id: 2,
    titulo: "Aplicaciones Móviles",
    slug: "aplicaciones-moviles",
    descripcion:
      "Apps nativas y multiplataforma para Android e iOS con React Native e Ionic.",
    icono: "📱",
  },
  {
    id: 3,
    titulo: "Microservicios & Integraciones",
    slug: "integraciones-api",
    descripcion:
      "APIs RESTful, integraciones con CRMs, sistemas de pagos, colas de mensajería y webhooks.",
    icono: "🔌",
  },
  {
    id: 4,
    titulo: "Ecommerce/WooCommerce",
    slug: "ecommerce-woocommerce",
    descripcion:
      "Tiendas online optimizadas, plugins personalizados, integración de pagos y gestión de inventario.",
    icono: "🛒",
  },
  {
    id: 5,
    titulo: "Arquitectura Escalable",
    slug: "software-a-medida",
    descripcion:
      "Diseño de sistemas robustos, cloud deployment, CI/CD y optimización de performance.",
    icono: "⚡",
  },
  {
    id: 6,
    titulo: "Mantenimiento & Evolución",
    slug: "mantenimiento-web",
    descripcion:
      "Soporte continuo, mejoras incrementales, observabilidad y monitoreo de aplicaciones.",
    icono: "🔧",
  },
];

export const proyectosEjemplo = [
  {
    id: 1,
    titulo: "Ecommerce WooCommerce para Retail",
    objetivo:
      "Plataforma de comercio electrónico completa con catálogo extenso, múltiples métodos de pago y gestión de envíos.",
    stack: ["WordPress", "WooCommerce", "PHP", "MySQL", "Stripe"],
    resultado:
      "Mejoró la conversión de visitantes a clientes y redujo tiempos de procesamiento de pedidos.",
  },
  {
    id: 2,
    titulo: "Web Corporativa con CMS Multi-idioma",
    objetivo:
      "Sitio web corporativo con gestión de contenido y soporte multi-idioma para expansión internacional.",
    stack: ["Next.js", "Contentful", "i18n", "Tailwind CSS"],
    resultado:
      "Aumentó el alcance internacional y facilitó la gestión de contenido por parte del equipo.",
  },
  {
    id: 3,
    titulo: "Dashboard de Analítica Empresarial",
    objetivo:
      "Panel de control con métricas en tiempo real, roles de usuario y exportación de reportes.",
    stack: ["React", "TypeScript", "Chart.js", "Node.js", "PostgreSQL"],
    resultado:
      "Centralizó la información y mejoró la toma de decisiones estratégicas.",
  },
  {
    id: 4,
    titulo: "App Móvil para Logística",
    objetivo:
      "Aplicación móvil para seguimiento de entregas, notificaciones push y gestión de estados en tiempo real.",
    stack: ["React Native", "Firebase", "Node.js", "MongoDB"],
    resultado:
      "Optimizó la comunicación con clientes y redujo consultas de seguimiento.",
  },
  {
    id: 5,
    titulo: "Integración de Pagos + Webhooks",
    objetivo:
      "Sistema de integración con Mercado Pago, procesamiento de webhooks y reconciliación automática.",
    stack: ["Node.js", "NestJS", "PostgreSQL", "Redis", "Mercado Pago API"],
    resultado:
      "Automatizó el proceso de pagos y mejoró la precisión en la reconciliación financiera.",
  },
  {
    id: 6,
    titulo: "Plataforma SaaS con Suscripciones",
    objetivo:
      "Aplicación SaaS con planes free/premium, control de acceso basado en roles y facturación automática.",
    stack: ["Next.js", "Stripe", "PostgreSQL", "Auth0", "AWS"],
    resultado:
      "Escaló la base de usuarios y automatizó el proceso de facturación y gestión de suscripciones.",
  },
];

export const equipo = [
  {
    id: 1,
    nombre: "ENDER",
    rol: "CEO",
    bio: "Lidera la visión estratégica y las relaciones con clientes, enfocado en entregar soluciones que generen valor real.",
    iniciales: "E",
    imagen: "/ender.png",
  },
  {
    id: 2,
    nombre: "AKHSEL",
    rol: "Developer",
    bio: "Especialista en desarrollo full-stack y arquitectura de sistemas escalables con experiencia en tecnologías modernas.",
    iniciales: "A",
    imagen: "/acxeldev.jpeg",
  },
  {
    id: 3,
    nombre: "L1NTCH",
    rol: "Developer",
    bio: "Desarrollador experto en aplicaciones móviles y APIs, con enfoque en performance y experiencia de usuario.",
    iniciales: "M",
    imagen: "/mauro.jpg",
  },
  {
    id: 4,
    nombre: "GHOST",
    rol: "Developer",
    bio: "Desarrollador especializado en integraciones complejas, microservicios y optimización de sistemas existentes.",
    iniciales: "G",
    imagen: "/samuel.jpeg",
  },
];

export const procesoi = [
  {
    id: 1,
    paso: "Descubrimiento",
    descripcion:
      "Analizamos tus necesidades, objetivos y contexto del negocio para definir el alcance del proyecto.",
  },
  {
    id: 3,
    paso: "Diseño/Arquitectura",
    descripcion:
      "Diseñamos la experiencia de usuario y arquitectura técnica que garantice escalabilidad y mantenibilidad.",
  },
  {
    id: 5,
    paso: "Deploy/Soporte",
    descripcion:
      "Desplegamos en producción y brindamos soporte continuo, monitoreo y mejoras basadas en métricas reales.",
  },
];

export const procesop = [
  {
    id: 2,
    paso: "Propuesta",
    descripcion:
      "Presentamos una propuesta técnica detallada con tiempos, tecnologías y presupuesto ajustado a tus requerimientos.",
  },
  {
    id: 4,
    paso: "Desarrollo",
    descripcion:
      "Desarrollamos iterativamente con entregas incrementales, manteniendo comunicación constante y feedback continuo.",
  },
];

export const proyectosReales = [
  {
    id: 1,
    nombre: "Taffe Regalos",
    imagen: "/tafferegalos.png",
    url: "https://tafferegalos.com/",
    descripcion: "Tienda online para vender regalos y giftboxes con una experiencia de compra rápida y enfocada en conversiones.",
    stack: ["WooCommerce", "WordPress", "PHP", "Stripe"],
  },
  {
    id: 2,
    nombre: "Integra BPO",
    imagen: "/integra.png",
    url: "https://integrasgp.com/",
    descripcion: "Sitio corporativo para presentar servicios BPO, fortalecer la confianza comercial y captar oportunidades desde Latam.",
    stack: ["Next.js", "Tailwind CSS", "Node.js"],
  },
  {
    id: 3,
    nombre: "Creative Home",
    imagen: "/creativehome.png",
    url: "https://creativehome.pe/",
    descripcion: "Ecommerce para exhibir muebles y decoración, pensado para facilitar la exploración de productos y solicitudes de compra.",
    stack: ["WooCommerce", "WordPress", "PHP", "MySQL"],
    sinSoporte: true,
  },
  {
    id: 4,
    nombre: "Edificio Loma Amarilla",
    imagen: "/lomamarilla.png",
    url: "https://edificiolomaamarilla.com/",
    descripcion: "Landing inmobiliaria para presentar el proyecto, comunicar beneficios clave y generar contactos de clientes interesados.",
    stack: ["WordPress", "PHP", "Elementor"],
    sinSoporte: true,
  },
  {
    id: 5,
    nombre: "Santed",
    imagen: "/santed.png",
    url: "https://www.santed.com.pe/",
    descripcion: "Plataforma web para comunicar servicios médicos, ordenar la información institucional y facilitar el contacto con pacientes.",
    stack: ["React", "Node.js", "PostgreSQL"],
  },
  {
    id: 6,
    nombre: "D Segunda",
    imagen: "/dsegunda.png",
    url: "https://dsegunda.com/",
    descripcion: "Marketplace ecommerce para publicar y vender productos de segunda mano con navegación simple y catálogo administrable.",
    stack: ["WooCommerce", "WordPress", "PHP", "MySQL"],
    sinSoporte: true,
  },
  {
    id: 7,
    nombre: "HooBank",
    imagen: "/hoobank.png",
    url: "https://banco-webmodern.vercel.app/",
    descripcion: "Landing moderna para presentar una propuesta de banca digital con diseño claro, secciones comerciales y foco en producto.",
    stack: ["React", "Tailwind CSS", "Vite"],
  },
  {
    id: 8,
    nombre: "Impuestos Perú",
    imagen: "/impuestosperu.png",
    url: "https://play.google.com/store/apps/details?id=com.impuestosperu&hl=es_PE",
    descripcion: "Aplicación móvil para consultar y calcular impuestos de forma práctica desde Android.",
    stack: ["React Native", "Firebase", "Android"],
    sinSoporte: true,
  },
  {
    id: 9,
    nombre: "BKS Moda",
    imagen: "/557shots_so.png",
    url: "https://bksmoda.com/",
    descripcion: "Ecommerce de moda y accesorios con catálogo administrable, pagos online y una experiencia de compra directa.",
    stack: ["WooCommerce", "WordPress", "Stripe", "PHP"],
  },
  {
    id: 10,
    nombre: "Ecoshipperu",
    imagen: "/42shots_so.png",
    url: "https://www.ecoshipperu.com/",
    descripcion: "Landing para una empresa de logística y envíos, diseñada para explicar servicios y convertir visitas en consultas.",
    stack: ["Next.js", "Tailwind CSS", "Vercel"],
  },
  {
    id: 11,
    nombre: "Onigrowth",
    imagen: "/279shots_so.png",
    url: "https://www.onigrowth.com/",
    descripcion: "Plataforma comercial para vender sistemas de prompts y ayudar a equipos a obtener mejores resultados con IA generativa.",
    stack: ["OpenAI", "Claude", "Gemini"],
  },
  {
    id: 12,
    nombre: "Versus Electoral Perú",
    imagen: "/387shots_so.png",
    url: "https://www.versuselectoral.com/",
    descripcion: "Plataforma cívica para comparar candidatos, organizar información electoral y ayudar a los usuarios a decidir mejor.",
    stack: ["Next.js", "Tailwind CSS", "Vercel"],
  },
  {
    id: 18,
    nombre: "Onistore",
    imagen: "/onistore2.png",
    url: "https://www.onistore.store/",
    descripcion: "Ecommerce de manga, figuras y coleccionables anime con envíos a todo el Perú y panel administrativo para gestionar catálogo y pedidos.",
    stack: ["Next.js", "Ecommerce", "Admin Panel"],
  },
  {
    id: 14,
    nombre: "Yomiru Manga",
    imagen: "/yomiru.png",
    url: "https://yomiru-manga-web.vercel.app/",
    descripcion: "Plataforma de lectura de mangas con una experiencia fluida para explorar títulos, abrir capítulos y leer online.",
    stack: ["Next.js", "Manga Reader", "Plataforma"],
  },
  {
    id: 15,
    nombre: "Guess The Year",
    imagen: "/guesstheyear.png",
    url: "https://guess-the-year-e7pd.onrender.com/",
    descripcion: "Juego multijugador online inspirado en Hitster para competir con amigos adivinando el año de cada canción.",
    stack: ["Realtime", "Multiplayer", "Game"],
  },
  {
    id: 16,
    nombre: "TDS",
    imagen: "/173shots_so.png",
    descripcion: "Landing y ecommerce para presentar productos industriales de transporte, minería y vehículos marítimos.",
    stack: ["Landing", "Ecommerce", "Catálogo"],
    url: "https://www.techdsolution.com/",
  },
  {
    id: 17,
    nombre: "MVP Travel Marketplace",
    descripcion: "MVP de marketplace turístico para vender productos de viaje, paquetes, servicios, blogs y planificación con multisellers.",
    stack: ["Marketplace", "Turismo", "MVP"],
    estado: "proximamente",
  },
].sort((a, b) => {
  if (a.sinSoporte !== b.sinSoporte) return a.sinSoporte ? 1 : -1;
  return b.id - a.id;
});

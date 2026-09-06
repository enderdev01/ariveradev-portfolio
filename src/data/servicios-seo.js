// Content for the /servicios/[slug] landing pages.
// Each entry targets one search intent. Keep the copy grounded in what the
// team actually offers: no invented clients, metrics or certifications.
//
// User-visible text fields carry an `{es, en}` shape (design D1). `slug` is a
// URL identifier and is NOT localized.

import { resolve } from "../lib/i18n";

export const serviciosSeo = [
  {
    slug: "desarrollo-web",
    keyword: { es: "desarrollo web Perú", en: null },
    titulo: { es: "Desarrollo Web en Perú | Onilabs", en: null },
    h1: { es: "Desarrollo web a medida en Perú", en: null },
    descripcion: {
      es: "Desarrollo web en Perú: sitios corporativos, landing pages, dashboards y aplicaciones SaaS con Next.js y React. Código propio, sin plantillas.",
      en: null,
    },
    intro: {
      es: "Construimos sitios y aplicaciones web para empresas que necesitan más que una plantilla. Cada proyecto arranca entendiendo el negocio y termina en una plataforma que tu equipo puede mantener y hacer crecer.",
      en: null,
    },
    secciones: [
      {
        titulo: { es: "Qué construimos", en: null },
        parrafos: [
          {
            es: "Sitios corporativos que ordenan la información de tu empresa y convierten visitas en consultas comerciales. Landing pages enfocadas en una sola acción, pensadas para campañas donde cada visita cuesta dinero.",
            en: null,
          },
          {
            es: "Dashboards internos con métricas en tiempo real, roles de usuario y exportación de reportes, para equipos que hoy toman decisiones mirando planillas sueltas. Y aplicaciones SaaS completas, con planes de suscripción, control de acceso y facturación automática.",
            en: null,
          },
        ],
      },
      {
        titulo: { es: "Con qué lo hacemos", en: null },
        parrafos: [
          {
            es: "Trabajamos principalmente con Next.js y React sobre TypeScript, con Tailwind CSS para la interfaz. Del lado del servidor usamos Node.js con PostgreSQL o MongoDB según el caso, y desplegamos en infraestructura cloud con CI/CD.",
            en: null,
          },
          {
            es: "No es una lista de modas: son herramientas con comunidad grande y documentación seria, lo que significa que si mañana trabajás con otro equipo, va a poder tomar el código sin arqueología.",
            en: null,
          },
        ],
      },
      {
        titulo: { es: "Cómo trabajamos", en: null },
        parrafos: [
          {
            es: "Empezamos por descubrimiento: analizamos tus necesidades, objetivos y contexto para definir un alcance real. Después viene la propuesta con tiempos y costos claros, antes de escribir una línea de código.",
            en: null,
          },
          {
            es: "Diseñamos la experiencia de usuario y la arquitectura técnica pensando en escalabilidad y mantenibilidad. Desarrollamos, desplegamos a producción, y seguimos con soporte, monitoreo y mejoras basadas en métricas reales.",
            en: null,
          },
        ],
      },
      {
        titulo: { es: "Para quién es", en: null },
        parrafos: [
          {
            es: "Para empresas en Perú que ya tienen un negocio andando y necesitan que la web deje de ser un folleto. Si tu sitio actual no lo puede editar nadie sin llamar a un programador, si carga lento, o si no tenés idea de cuánta gente lo visita, ese es el punto de partida.",
            en: null,
          },
          {
            es: "También trabajamos con equipos que ya tienen una plataforma y necesitan hacerla crecer sin reescribirla desde cero.",
            en: null,
          },
        ],
      },
    ],
    faq: [
      {
        pregunta: { es: "¿Cuánto demora un proyecto de desarrollo web?", en: null },
        respuesta: {
          es: "Depende del alcance. Una landing page enfocada puede estar en semanas; una plataforma con usuarios, roles e integraciones lleva meses. Lo definimos en la etapa de descubrimiento, antes de comprometernos a una fecha.",
          en: null,
        },
      },
      {
        pregunta: { es: "¿Trabajan con empresas fuera de Lima?", en: null },
        respuesta: {
          es: "Sí. Trabajamos con clientes en todo el Perú y también de forma remota con equipos en Latam.",
          en: null,
        },
      },
      {
        pregunta: { es: "¿El código queda a nombre nuestro?", en: null },
        respuesta: {
          es: "Sí. El código es tuyo y te lo entregamos en tu propio repositorio. No trabajamos con plataformas cerradas que te dejen atado a nosotros.",
          en: null,
        },
      },
    ],
  },
  {
    slug: "aplicaciones-moviles",
    keyword: { es: "desarrollo de apps móviles Perú", en: null },
    titulo: { es: "Desarrollo de Apps Móviles en Perú | Onilabs", en: null },
    h1: { es: "Desarrollo de aplicaciones móviles en Perú", en: null },
    descripcion: {
      es: "Desarrollo de apps móviles en Perú para Android e iOS con React Native e Ionic. Una sola base de código, notificaciones push e integración con tus sistemas.",
      en: null,
    },
    intro: {
      es: "Desarrollamos aplicaciones móviles multiplataforma: una sola base de código que corre en Android y iOS, en vez de mantener dos proyectos separados con dos equipos y dos presupuestos.",
      en: null,
    },
    secciones: [
      {
        titulo: { es: "Multiplataforma, no dos apps", en: null },
        parrafos: [
          {
            es: "Usamos React Native e Ionic. En la práctica eso significa que una funcionalidad se escribe una vez y llega a los dos sistemas operativos, y que las correcciones no hay que aplicarlas dos veces.",
            en: null,
          },
          {
            es: "Para la mayoría de las aplicaciones de negocio, el resultado es indistinguible de una app nativa. Cuando un proyecto realmente necesita capacidades nativas específicas, lo decimos antes de empezar, no a mitad de camino.",
            en: null,
          },
        ],
      },
      {
        titulo: { es: "Qué suele necesitar una app de negocio", en: null },
        parrafos: [
          {
            es: "Notificaciones push para avisar sin depender de que el usuario abra la app. Seguimiento de estados en tiempo real, que es lo que pide cualquier operación de entregas o servicios. Y modo offline para que la app siga siendo útil cuando la señal se cae.",
            en: null,
          },
          {
            es: "Sobre todo eso, integración con los sistemas que ya usás: tu backend, tu CRM, tu pasarela de pagos. Una app aislada de tus datos es una app que nadie abre dos veces.",
            en: null,
          },
        ],
      },
      {
        titulo: { es: "Publicación en las tiendas", en: null },
        parrafos: [
          {
            es: "Nos encargamos del proceso de publicación en Google Play y App Store, que tiene sus propios requisitos de fichas, permisos, políticas de privacidad y revisión.",
            en: null,
          },
          {
            es: "Es la parte que suele sorprender a quien nunca publicó una app: el desarrollo termina y todavía falta pasar la revisión de las tiendas. Lo contemplamos en el cronograma desde el principio.",
            en: null,
          },
        ],
      },
    ],
    faq: [
      {
        pregunta: { es: "¿Android e iOS cuestan el doble?", en: null },
        respuesta: {
          es: "No con el enfoque multiplataforma. Se desarrolla una sola vez y se publica en ambas tiendas. El costo adicional de la segunda plataforma es marginal comparado con desarrollar dos apps nativas.",
          en: null,
        },
      },
      {
        pregunta: { es: "¿Puede conectarse con el sistema que ya tenemos?", en: null },
        respuesta: {
          es: "Sí. Es lo habitual. Si tu sistema ya expone una API la consumimos directamente; si no la tiene, la construimos como parte del proyecto.",
          en: null,
        },
      },
    ],
  },
  {
    slug: "ecommerce-woocommerce",
    keyword: { es: "tienda online WooCommerce Perú", en: null },
    titulo: { es: "Tiendas Online y WooCommerce en Perú | Onilabs", en: null },
    h1: { es: "Desarrollo de tiendas online en Perú", en: null },
    descripcion: {
      es: "Desarrollo de ecommerce en Perú con WooCommerce y plataformas a medida. Pasarelas de pago locales, gestión de inventario y catálogo administrable.",
      en: null,
    },
    intro: {
      es: "Construimos tiendas online que venden de verdad: catálogo administrable por tu equipo, pagos que funcionan en Perú y un proceso de compra que no pierde gente en el camino.",
      en: null,
    },
    secciones: [
      {
        titulo: { es: "WooCommerce o plataforma a medida", en: null },
        parrafos: [
          {
            es: "WooCommerce tiene sentido cuando querés arrancar rápido, administrar el catálogo vos mismo y aprovechar un ecosistema enorme de extensiones. Desarrollamos plugins propios cuando lo que necesitás no existe listo.",
            en: null,
          },
          {
            es: "Una plataforma a medida tiene sentido cuando tu operación no entra en el molde: catálogos muy grandes, lógica de precios particular, integración profunda con un ERP o un flujo de venta que ninguna plantilla contempla. Te decimos cuál conviene según tu caso, no según qué nos resulta más cómodo.",
            en: null,
          },
        ],
      },
      {
        titulo: { es: "Pagos y envíos en Perú", en: null },
        parrafos: [
          {
            es: "Integramos las pasarelas que se usan acá, con el manejo de webhooks y reconciliación automática que hace falta para que los pedidos no queden colgados cuando un pago se confirma tarde.",
            en: null,
          },
          {
            es: "Del lado de envíos, configuramos zonas, costos y estados de pedido para que el cliente sepa dónde está su compra sin escribirte por WhatsApp.",
            en: null,
          },
        ],
      },
      {
        titulo: { es: "Que lo puedas administrar vos", en: null },
        parrafos: [
          {
            es: "El panel de administración es parte del producto, no un extra. Tu equipo tiene que poder cargar productos, cambiar precios, publicar promociones y ver pedidos sin depender de nosotros.",
            en: null,
          },
          {
            es: "Si cada cambio de precio necesita un programador, la tienda te va a costar plata todos los meses.",
            en: null,
          },
        ],
      },
    ],
    faq: [
      {
        pregunta: { es: "¿Puedo migrar mi tienda actual sin perder los productos?", en: null },
        respuesta: {
          es: "Sí. La migración de catálogo, clientes e historial de pedidos es parte habitual del trabajo. Lo evaluamos antes para saber qué se puede traer y qué conviene rehacer.",
          en: null,
        },
      },
      {
        pregunta: { es: "¿Qué pasarelas de pago integran?", en: null },
        respuesta: {
          es: "Trabajamos con las pasarelas locales e internacionales más usadas, incluyendo el manejo de webhooks para confirmar pagos de forma automática. Definimos cuál conviene según tus comisiones y tu volumen.",
          en: null,
        },
      },
    ],
  },
  {
    slug: "integraciones-api",
    keyword: { es: "integración de APIs y pasarelas de pago Perú", en: null },
    titulo: { es: "Integraciones y APIs en Perú | Onilabs", en: null },
    h1: { es: "Integraciones, APIs y microservicios", en: null },
    descripcion: {
      es: "Integración de APIs, pasarelas de pago, CRMs y webhooks en Perú. Conectamos los sistemas que ya usás para que dejen de trabajar aislados.",
      en: null,
    },
    intro: {
      es: "La mayoría de las empresas no necesita otro sistema: necesita que los que ya tiene se hablen entre sí. Eso es lo que hacemos acá.",
      en: null,
    },
    secciones: [
      {
        titulo: { es: "El problema de los sistemas aislados", en: null },
        parrafos: [
          {
            es: "Tenés una tienda por un lado, un CRM por otro y la facturación en un tercero. Alguien de tu equipo pasa datos a mano entre los tres, todos los días. Eso no es un problema de software: es un costo mensual disfrazado de tarea administrativa.",
            en: null,
          },
          {
            es: "Una integración bien hecha elimina esa transcripción manual y, con ella, los errores que trae.",
            en: null,
          },
        ],
      },
      {
        titulo: { es: "Qué integramos", en: null },
        parrafos: [
          {
            es: "APIs RESTful propias y de terceros, pasarelas de pago con procesamiento de webhooks y reconciliación automática, CRMs, y colas de mensajería para trabajos que no pueden bloquear al usuario.",
            en: null,
          },
          {
            es: "Cuando el volumen lo justifica, diseñamos microservicios: piezas independientes que se despliegan y escalan por separado, en vez de un bloque único donde un cambio chico obliga a redesplegar todo.",
            en: null,
          },
        ],
      },
      {
        titulo: { es: "Que falle bien", en: null },
        parrafos: [
          {
            es: "Una integración se juzga por cómo se comporta cuando el otro sistema no responde. Diseñamos con reintentos, colas y registro de errores, para que un servicio caído signifique una demora y no una venta perdida en silencio.",
            en: null,
          },
          {
            es: "Sumamos observabilidad y monitoreo: si algo se rompe, querés enterarte vos antes que tu cliente.",
            en: null,
          },
        ],
      },
    ],
    faq: [
      {
        pregunta: { es: "¿Y si el sistema que tenemos no tiene API?", en: null },
        respuesta: {
          es: "Es un escenario común. Según el caso construimos una capa intermedia o trabajamos directamente contra su base de datos. Lo evaluamos antes de comprometer un alcance.",
          en: null,
        },
      },
      {
        pregunta: { es: "¿Qué es un webhook y por qué me importa?", en: null },
        respuesta: {
          es: "Es un aviso automático que un sistema le manda a otro cuando algo pasa, por ejemplo cuando se confirma un pago. Sin webhooks bien manejados, los pedidos quedan pendientes aunque el cliente ya pagó.",
          en: null,
        },
      },
    ],
  },
  {
    slug: "software-a-medida",
    keyword: { es: "desarrollo de software a medida Perú", en: null },
    titulo: { es: "Software a Medida en Perú | Onilabs", en: null },
    h1: { es: "Desarrollo de software a medida en Perú", en: null },
    descripcion: {
      es: "Desarrollo de software a medida en Perú: arquitectura escalable, cloud, CI/CD y sistemas diseñados alrededor de tu operación real.",
      en: null,
    },
    intro: {
      es: "Cuando ningún producto de estantería encaja con cómo trabaja tu empresa, la alternativa es construir. Pero construir a medida solo se justifica si el software sigue tu operación en vez de obligarte a cambiarla.",
      en: null,
    },
    secciones: [
      {
        titulo: { es: "Cuándo conviene y cuándo no", en: null },
        parrafos: [
          {
            es: "No siempre conviene. Si existe una herramienta que resuelve el ochenta por ciento de tu problema por una suscripción mensual, empezá por ahí. Te lo vamos a decir aunque signifique no vender el proyecto.",
            en: null,
          },
          {
            es: "El software a medida se justifica cuando tu proceso es tu ventaja competitiva, cuando el volumen hace que las licencias por usuario dejen de cerrar, o cuando necesitás integrar sistemas que ninguna herramienta genérica contempla.",
            en: null,
          },
        ],
      },
      {
        titulo: { es: "Arquitectura pensada para durar", en: null },
        parrafos: [
          {
            es: "Diseñamos sistemas robustos con despliegue en la nube, integración continua y optimización de performance. La arquitectura se decide en función de la carga real esperada, no de lo que está de moda.",
            en: null,
          },
          {
            es: "Esto importa porque el costo grande de un sistema no está en construirlo: está en mantenerlo durante los años siguientes. Una arquitectura clara es lo que hace que el año tres no cueste el triple que el año uno.",
            en: null,
          },
        ],
      },
      {
        titulo: { es: "Entrega por etapas", en: null },
        parrafos: [
          {
            es: "Preferimos entregar en incrementos que se puedan usar antes de que el proyecto esté completo. Así validás con usuarios reales temprano y corregís el rumbo cuando todavía es barato hacerlo.",
            en: null,
          },
          {
            es: "Un proyecto que solo se ve el último día es un proyecto donde los errores se descubren cuando ya no hay presupuesto para arreglarlos.",
            en: null,
          },
        ],
      },
    ],
    faq: [
      {
        pregunta: { es: "¿Cómo se cotiza un desarrollo a medida?", en: null },
        respuesta: {
          es: "Primero hacemos descubrimiento para entender el alcance real. Recién con eso presentamos una propuesta con etapas, tiempos y costos. Cotizar antes de entender el problema es cómo nacen los proyectos que se van del presupuesto.",
          en: null,
        },
      },
      {
        pregunta: { es: "¿Qué pasa si nuestras necesidades cambian a mitad del proyecto?", en: null },
        respuesta: {
          es: "Es esperable y por eso trabajamos por etapas. Los cambios se evalúan por su impacto en alcance y tiempos, y se deciden con la información sobre la mesa.",
          en: null,
        },
      },
    ],
  },
  {
    slug: "mantenimiento-web",
    keyword: { es: "mantenimiento de sitios web Perú", en: null },
    titulo: { es: "Mantenimiento y Soporte Web en Perú | Onilabs", en: null },
    h1: { es: "Mantenimiento y evolución de aplicaciones", en: null },
    descripcion: {
      es: "Mantenimiento de sitios web y aplicaciones en Perú: soporte continuo, monitoreo, observabilidad y mejoras incrementales basadas en métricas.",
      en: null,
    },
    intro: {
      es: "Un sistema en producción no se termina: se mantiene. Damos soporte continuo, monitoreo y mejoras incrementales, tanto sobre lo que construimos nosotros como sobre plataformas heredadas de otro equipo.",
      en: null,
    },
    secciones: [
      {
        titulo: { es: "Recibir un proyecto de otro equipo", en: null },
        parrafos: [
          {
            es: "Tomamos plataformas que desarrolló alguien más. El primer paso siempre es el mismo: entender qué hay, documentar lo que no está documentado y estabilizar lo que esté rompiéndose.",
            en: null,
          },
          {
            es: "No proponemos reescribir desde cero como reflejo. Reescribir es caro, lento y arranca perdiendo todas las correcciones acumuladas durante años. A veces hace falta, pero es la última opción, no la primera.",
            en: null,
          },
        ],
      },
      {
        titulo: { es: "Monitoreo y observabilidad", en: null },
        parrafos: [
          {
            es: "Instrumentamos las aplicaciones para saber qué está pasando: errores, tiempos de respuesta, uso real. Sin eso, el mantenimiento es adivinar.",
            en: null,
          },
          {
            es: "El objetivo es enterarte de un problema por una alerta y no por un cliente enojado.",
            en: null,
          },
        ],
      },
      {
        titulo: { es: "Mejoras con criterio", en: null },
        parrafos: [
          {
            es: "Las mejoras se priorizan con métricas de uso, no con opiniones. Si nadie usa una sección, optimizarla es tiempo tirado; si el noventa por ciento del tráfico pasa por una pantalla, ahí es donde conviene invertir.",
            en: null,
          },
          {
            es: "Actualizaciones de seguridad, dependencias al día y correcciones forman parte del servicio continuo.",
            en: null,
          },
        ],
      },
    ],
    faq: [
      {
        pregunta: { es: "¿Mantienen sitios que no desarrollaron ustedes?", en: null },
        respuesta: {
          es: "Sí. Empezamos con una revisión del estado actual para dimensionar el trabajo antes de comprometer un alcance mensual.",
          en: null,
        },
      },
      {
        pregunta: { es: "¿Qué incluye el soporte continuo?", en: null },
        respuesta: {
          es: "Monitoreo, actualizaciones de seguridad, corrección de errores y mejoras incrementales. El alcance exacto se define según la criticidad de la plataforma.",
          en: null,
        },
      },
    ],
  },
];

export const getServiciosSeo = (locale) => resolve(serviciosSeo, locale);

export const getServicioSeo = (slug, locale) => {
  const servicio = serviciosSeo.find((s) => s.slug === slug);
  return servicio ? resolve(servicio, locale) : null;
};

// Content for the /servicios/[slug] landing pages.
// Each entry targets one search intent. Keep the copy grounded in what the
// team actually offers: no invented clients, metrics or certifications.

export const serviciosSeo = [
  {
    slug: "desarrollo-web",
    keyword: "desarrollo web Perú",
    titulo: "Desarrollo Web en Perú | Onilabs",
    h1: "Desarrollo web a medida en Perú",
    descripcion:
      "Desarrollo web en Perú: sitios corporativos, landing pages, dashboards y aplicaciones SaaS con Next.js y React. Código propio, sin plantillas.",
    intro:
      "Construimos sitios y aplicaciones web para empresas que necesitan más que una plantilla. Cada proyecto arranca entendiendo el negocio y termina en una plataforma que tu equipo puede mantener y hacer crecer.",
    secciones: [
      {
        titulo: "Qué construimos",
        parrafos: [
          "Sitios corporativos que ordenan la información de tu empresa y convierten visitas en consultas comerciales. Landing pages enfocadas en una sola acción, pensadas para campañas donde cada visita cuesta dinero.",
          "Dashboards internos con métricas en tiempo real, roles de usuario y exportación de reportes, para equipos que hoy toman decisiones mirando planillas sueltas. Y aplicaciones SaaS completas, con planes de suscripción, control de acceso y facturación automática.",
        ],
      },
      {
        titulo: "Con qué lo hacemos",
        parrafos: [
          "Trabajamos principalmente con Next.js y React sobre TypeScript, con Tailwind CSS para la interfaz. Del lado del servidor usamos Node.js con PostgreSQL o MongoDB según el caso, y desplegamos en infraestructura cloud con CI/CD.",
          "No es una lista de modas: son herramientas con comunidad grande y documentación seria, lo que significa que si mañana trabajás con otro equipo, va a poder tomar el código sin arqueología.",
        ],
      },
      {
        titulo: "Cómo trabajamos",
        parrafos: [
          "Empezamos por descubrimiento: analizamos tus necesidades, objetivos y contexto para definir un alcance real. Después viene la propuesta con tiempos y costos claros, antes de escribir una línea de código.",
          "Diseñamos la experiencia de usuario y la arquitectura técnica pensando en escalabilidad y mantenibilidad. Desarrollamos, desplegamos a producción, y seguimos con soporte, monitoreo y mejoras basadas en métricas reales.",
        ],
      },
      {
        titulo: "Para quién es",
        parrafos: [
          "Para empresas en Perú que ya tienen un negocio andando y necesitan que la web deje de ser un folleto. Si tu sitio actual no lo puede editar nadie sin llamar a un programador, si carga lento, o si no tenés idea de cuánta gente lo visita, ese es el punto de partida.",
          "También trabajamos con equipos que ya tienen una plataforma y necesitan hacerla crecer sin reescribirla desde cero.",
        ],
      },
    ],
    faq: [
      {
        pregunta: "¿Cuánto demora un proyecto de desarrollo web?",
        respuesta:
          "Depende del alcance. Una landing page enfocada puede estar en semanas; una plataforma con usuarios, roles e integraciones lleva meses. Lo definimos en la etapa de descubrimiento, antes de comprometernos a una fecha.",
      },
      {
        pregunta: "¿Trabajan con empresas fuera de Lima?",
        respuesta:
          "Sí. Trabajamos con clientes en todo el Perú y también de forma remota con equipos en Latam.",
      },
      {
        pregunta: "¿El código queda a nombre nuestro?",
        respuesta:
          "Sí. El código es tuyo y te lo entregamos en tu propio repositorio. No trabajamos con plataformas cerradas que te dejen atado a nosotros.",
      },
    ],
  },
  {
    slug: "aplicaciones-moviles",
    keyword: "desarrollo de apps móviles Perú",
    titulo: "Desarrollo de Apps Móviles en Perú | Onilabs",
    h1: "Desarrollo de aplicaciones móviles en Perú",
    descripcion:
      "Desarrollo de apps móviles en Perú para Android e iOS con React Native e Ionic. Una sola base de código, notificaciones push e integración con tus sistemas.",
    intro:
      "Desarrollamos aplicaciones móviles multiplataforma: una sola base de código que corre en Android y iOS, en vez de mantener dos proyectos separados con dos equipos y dos presupuestos.",
    secciones: [
      {
        titulo: "Multiplataforma, no dos apps",
        parrafos: [
          "Usamos React Native e Ionic. En la práctica eso significa que una funcionalidad se escribe una vez y llega a los dos sistemas operativos, y que las correcciones no hay que aplicarlas dos veces.",
          "Para la mayoría de las aplicaciones de negocio, el resultado es indistinguible de una app nativa. Cuando un proyecto realmente necesita capacidades nativas específicas, lo decimos antes de empezar, no a mitad de camino.",
        ],
      },
      {
        titulo: "Qué suele necesitar una app de negocio",
        parrafos: [
          "Notificaciones push para avisar sin depender de que el usuario abra la app. Seguimiento de estados en tiempo real, que es lo que pide cualquier operación de entregas o servicios. Y modo offline para que la app siga siendo útil cuando la señal se cae.",
          "Sobre todo eso, integración con los sistemas que ya usás: tu backend, tu CRM, tu pasarela de pagos. Una app aislada de tus datos es una app que nadie abre dos veces.",
        ],
      },
      {
        titulo: "Publicación en las tiendas",
        parrafos: [
          "Nos encargamos del proceso de publicación en Google Play y App Store, que tiene sus propios requisitos de fichas, permisos, políticas de privacidad y revisión.",
          "Es la parte que suele sorprender a quien nunca publicó una app: el desarrollo termina y todavía falta pasar la revisión de las tiendas. Lo contemplamos en el cronograma desde el principio.",
        ],
      },
    ],
    faq: [
      {
        pregunta: "¿Android e iOS cuestan el doble?",
        respuesta:
          "No con el enfoque multiplataforma. Se desarrolla una sola vez y se publica en ambas tiendas. El costo adicional de la segunda plataforma es marginal comparado con desarrollar dos apps nativas.",
      },
      {
        pregunta: "¿Puede conectarse con el sistema que ya tenemos?",
        respuesta:
          "Sí. Es lo habitual. Si tu sistema ya expone una API la consumimos directamente; si no la tiene, la construimos como parte del proyecto.",
      },
    ],
  },
  {
    slug: "ecommerce-woocommerce",
    keyword: "tienda online WooCommerce Perú",
    titulo: "Tiendas Online y WooCommerce en Perú | Onilabs",
    h1: "Desarrollo de tiendas online en Perú",
    descripcion:
      "Desarrollo de ecommerce en Perú con WooCommerce y plataformas a medida. Pasarelas de pago locales, gestión de inventario y catálogo administrable.",
    intro:
      "Construimos tiendas online que venden de verdad: catálogo administrable por tu equipo, pagos que funcionan en Perú y un proceso de compra que no pierde gente en el camino.",
    secciones: [
      {
        titulo: "WooCommerce o plataforma a medida",
        parrafos: [
          "WooCommerce tiene sentido cuando querés arrancar rápido, administrar el catálogo vos mismo y aprovechar un ecosistema enorme de extensiones. Desarrollamos plugins propios cuando lo que necesitás no existe listo.",
          "Una plataforma a medida tiene sentido cuando tu operación no entra en el molde: catálogos muy grandes, lógica de precios particular, integración profunda con un ERP o un flujo de venta que ninguna plantilla contempla. Te decimos cuál conviene según tu caso, no según qué nos resulta más cómodo.",
        ],
      },
      {
        titulo: "Pagos y envíos en Perú",
        parrafos: [
          "Integramos las pasarelas que se usan acá, con el manejo de webhooks y reconciliación automática que hace falta para que los pedidos no queden colgados cuando un pago se confirma tarde.",
          "Del lado de envíos, configuramos zonas, costos y estados de pedido para que el cliente sepa dónde está su compra sin escribirte por WhatsApp.",
        ],
      },
      {
        titulo: "Que lo puedas administrar vos",
        parrafos: [
          "El panel de administración es parte del producto, no un extra. Tu equipo tiene que poder cargar productos, cambiar precios, publicar promociones y ver pedidos sin depender de nosotros.",
          "Si cada cambio de precio necesita un programador, la tienda te va a costar plata todos los meses.",
        ],
      },
    ],
    faq: [
      {
        pregunta: "¿Puedo migrar mi tienda actual sin perder los productos?",
        respuesta:
          "Sí. La migración de catálogo, clientes e historial de pedidos es parte habitual del trabajo. Lo evaluamos antes para saber qué se puede traer y qué conviene rehacer.",
      },
      {
        pregunta: "¿Qué pasarelas de pago integran?",
        respuesta:
          "Trabajamos con las pasarelas locales e internacionales más usadas, incluyendo el manejo de webhooks para confirmar pagos de forma automática. Definimos cuál conviene según tus comisiones y tu volumen.",
      },
    ],
  },
  {
    slug: "integraciones-api",
    keyword: "integración de APIs y pasarelas de pago Perú",
    titulo: "Integraciones y APIs en Perú | Onilabs",
    h1: "Integraciones, APIs y microservicios",
    descripcion:
      "Integración de APIs, pasarelas de pago, CRMs y webhooks en Perú. Conectamos los sistemas que ya usás para que dejen de trabajar aislados.",
    intro:
      "La mayoría de las empresas no necesita otro sistema: necesita que los que ya tiene se hablen entre sí. Eso es lo que hacemos acá.",
    secciones: [
      {
        titulo: "El problema de los sistemas aislados",
        parrafos: [
          "Tenés una tienda por un lado, un CRM por otro y la facturación en un tercero. Alguien de tu equipo pasa datos a mano entre los tres, todos los días. Eso no es un problema de software: es un costo mensual disfrazado de tarea administrativa.",
          "Una integración bien hecha elimina esa transcripción manual y, con ella, los errores que trae.",
        ],
      },
      {
        titulo: "Qué integramos",
        parrafos: [
          "APIs RESTful propias y de terceros, pasarelas de pago con procesamiento de webhooks y reconciliación automática, CRMs, y colas de mensajería para trabajos que no pueden bloquear al usuario.",
          "Cuando el volumen lo justifica, diseñamos microservicios: piezas independientes que se despliegan y escalan por separado, en vez de un bloque único donde un cambio chico obliga a redesplegar todo.",
        ],
      },
      {
        titulo: "Que falle bien",
        parrafos: [
          "Una integración se juzga por cómo se comporta cuando el otro sistema no responde. Diseñamos con reintentos, colas y registro de errores, para que un servicio caído signifique una demora y no una venta perdida en silencio.",
          "Sumamos observabilidad y monitoreo: si algo se rompe, querés enterarte vos antes que tu cliente.",
        ],
      },
    ],
    faq: [
      {
        pregunta: "¿Y si el sistema que tenemos no tiene API?",
        respuesta:
          "Es un escenario común. Según el caso construimos una capa intermedia o trabajamos directamente contra su base de datos. Lo evaluamos antes de comprometer un alcance.",
      },
      {
        pregunta: "¿Qué es un webhook y por qué me importa?",
        respuesta:
          "Es un aviso automático que un sistema le manda a otro cuando algo pasa, por ejemplo cuando se confirma un pago. Sin webhooks bien manejados, los pedidos quedan pendientes aunque el cliente ya pagó.",
      },
    ],
  },
  {
    slug: "software-a-medida",
    keyword: "desarrollo de software a medida Perú",
    titulo: "Software a Medida en Perú | Onilabs",
    h1: "Desarrollo de software a medida en Perú",
    descripcion:
      "Desarrollo de software a medida en Perú: arquitectura escalable, cloud, CI/CD y sistemas diseñados alrededor de tu operación real.",
    intro:
      "Cuando ningún producto de estantería encaja con cómo trabaja tu empresa, la alternativa es construir. Pero construir a medida solo se justifica si el software sigue tu operación en vez de obligarte a cambiarla.",
    secciones: [
      {
        titulo: "Cuándo conviene y cuándo no",
        parrafos: [
          "No siempre conviene. Si existe una herramienta que resuelve el ochenta por ciento de tu problema por una suscripción mensual, empezá por ahí. Te lo vamos a decir aunque signifique no vender el proyecto.",
          "El software a medida se justifica cuando tu proceso es tu ventaja competitiva, cuando el volumen hace que las licencias por usuario dejen de cerrar, o cuando necesitás integrar sistemas que ninguna herramienta genérica contempla.",
        ],
      },
      {
        titulo: "Arquitectura pensada para durar",
        parrafos: [
          "Diseñamos sistemas robustos con despliegue en la nube, integración continua y optimización de performance. La arquitectura se decide en función de la carga real esperada, no de lo que está de moda.",
          "Esto importa porque el costo grande de un sistema no está en construirlo: está en mantenerlo durante los años siguientes. Una arquitectura clara es lo que hace que el año tres no cueste el triple que el año uno.",
        ],
      },
      {
        titulo: "Entrega por etapas",
        parrafos: [
          "Preferimos entregar en incrementos que se puedan usar antes de que el proyecto esté completo. Así validás con usuarios reales temprano y corregís el rumbo cuando todavía es barato hacerlo.",
          "Un proyecto que solo se ve el último día es un proyecto donde los errores se descubren cuando ya no hay presupuesto para arreglarlos.",
        ],
      },
    ],
    faq: [
      {
        pregunta: "¿Cómo se cotiza un desarrollo a medida?",
        respuesta:
          "Primero hacemos descubrimiento para entender el alcance real. Recién con eso presentamos una propuesta con etapas, tiempos y costos. Cotizar antes de entender el problema es cómo nacen los proyectos que se van del presupuesto.",
      },
      {
        pregunta: "¿Qué pasa si nuestras necesidades cambian a mitad del proyecto?",
        respuesta:
          "Es esperable y por eso trabajamos por etapas. Los cambios se evalúan por su impacto en alcance y tiempos, y se deciden con la información sobre la mesa.",
      },
    ],
  },
  {
    slug: "mantenimiento-web",
    keyword: "mantenimiento de sitios web Perú",
    titulo: "Mantenimiento y Soporte Web en Perú | Onilabs",
    h1: "Mantenimiento y evolución de aplicaciones",
    descripcion:
      "Mantenimiento de sitios web y aplicaciones en Perú: soporte continuo, monitoreo, observabilidad y mejoras incrementales basadas en métricas.",
    intro:
      "Un sistema en producción no se termina: se mantiene. Damos soporte continuo, monitoreo y mejoras incrementales, tanto sobre lo que construimos nosotros como sobre plataformas heredadas de otro equipo.",
    secciones: [
      {
        titulo: "Recibir un proyecto de otro equipo",
        parrafos: [
          "Tomamos plataformas que desarrolló alguien más. El primer paso siempre es el mismo: entender qué hay, documentar lo que no está documentado y estabilizar lo que esté rompiéndose.",
          "No proponemos reescribir desde cero como reflejo. Reescribir es caro, lento y arranca perdiendo todas las correcciones acumuladas durante años. A veces hace falta, pero es la última opción, no la primera.",
        ],
      },
      {
        titulo: "Monitoreo y observabilidad",
        parrafos: [
          "Instrumentamos las aplicaciones para saber qué está pasando: errores, tiempos de respuesta, uso real. Sin eso, el mantenimiento es adivinar.",
          "El objetivo es enterarte de un problema por una alerta y no por un cliente enojado.",
        ],
      },
      {
        titulo: "Mejoras con criterio",
        parrafos: [
          "Las mejoras se priorizan con métricas de uso, no con opiniones. Si nadie usa una sección, optimizarla es tiempo tirado; si el noventa por ciento del tráfico pasa por una pantalla, ahí es donde conviene invertir.",
          "Actualizaciones de seguridad, dependencias al día y correcciones forman parte del servicio continuo.",
        ],
      },
    ],
    faq: [
      {
        pregunta: "¿Mantienen sitios que no desarrollaron ustedes?",
        respuesta:
          "Sí. Empezamos con una revisión del estado actual para dimensionar el trabajo antes de comprometer un alcance mensual.",
      },
      {
        pregunta: "¿Qué incluye el soporte continuo?",
        respuesta:
          "Monitoreo, actualizaciones de seguridad, corrección de errores y mejoras incrementales. El alcance exacto se define según la criticidad de la plataforma.",
      },
    ],
  },
];

export const getServicioSeo = (slug) =>
  serviciosSeo.find((servicio) => servicio.slug === slug) || null;

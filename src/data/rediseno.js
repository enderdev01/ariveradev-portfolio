// Copy for /rediseno-web. Source of truth: onilabs-marketing/campaigns/rediseno-web/landing-page.md
// (approved copy). Edit there first, then here, so the page and the campaign file never drift.

export const WHATSAPP_URL = "https://wa.me/51993109998?text=Vengo%20de%20la%20web";
export const DEMO_URL = "https://hakui-medical.vercel.app/";

export const caminos = [
  {
    id: "rediseno",
    situacion: "Ya tengo web, pero no funciona bien",
    nombre: "Rediseño",
    precio: "desde US$250",
    items: [
      "La adaptamos al celular: se lee sin hacer zoom.",
      "WhatsApp y teléfono arriba, a un toque.",
      "Más rápida, con SEO técnico básico y SSL.",
      "Conservamos tu dominio y el contenido que funciona.",
    ],
    nota: "El precio final lo damos después de revisar tu sitio.",
  },
  {
    id: "pagina",
    situacion: "No tengo web (o mi ficha de Google manda a Instagram)",
    nombre: "Página propia",
    precio: "US$300",
    items: [
      "Hasta 8 secciones: servicios, reseñas, ubicación y contacto.",
      "Formulario y WhatsApp en la primera pantalla.",
      "Dominio, SSL y SEO técnico básico.",
      "Lista en 14 días hábiles desde que tenemos tus textos y fotos.",
    ],
  },
];

export const pasos = [
  {
    titulo: "Nos escribes",
    texto: "Por WhatsApp. Revisamos tu web o tu ficha de Google y te decimos qué falla.",
  },
  {
    titulo: "Te mandamos la propuesta",
    texto: "Alcance, precio y plazo por escrito. Sin sorpresas después.",
  },
  {
    titulo: "Construimos",
    texto: "Pagas 60% para empezar y 40% antes de publicar.",
  },
  {
    titulo: "Publicamos y te acompañamos",
    texto: "Dos rondas de cambios y 30 días de soporte después de entregar.",
  },
];

// The three faults a phone visitor hits first, and what the new page does instead.
export const arreglos = [
  {
    antes: "Letra diminuta: hay que hacer zoom para leer.",
    despues: "Se lee a la primera, sin pellizcar la pantalla.",
  },
  {
    antes: "El WhatsApp está escondido al final, o no está.",
    despues: "WhatsApp y teléfono arriba, a un toque.",
  },
  {
    antes: "Tarda en cargar y el paciente se va.",
    despues: "Carga rápida, con SSL y SEO técnico básico.",
  },
];

// What gets registered in the client's name. `condicion` marks the one item
// that depends on the agreement, so the page never overclaims.
export const titularidad = [
  { nombre: "Dominio", detalle: "tuclinica.pe" },
  { nombre: "Correo", detalle: "contacto@tuclinica.pe" },
  { nombre: "Cuentas y accesos", detalle: "Hosting, Google y analítica" },
  { nombre: "Código fuente", detalle: "Si el acuerdo lo incluye", condicion: true },
];

export const noPrometemos = [
  "Primer lugar en Google, ni en una fecha.",
  "Más clientes o más ventas: eso depende de tu negocio, no solo de la web.",
  "Hosting ilimitado.",
];

export const preguntas = [
  {
    pregunta: "¿Cuánto cuesta?",
    respuesta:
      "El rediseño, desde US$250; el precio final lo damos después de revisar tu sitio. Una página nueva, US$300. Antes de empezar recibes el precio por escrito.",
  },
  {
    pregunta: "¿Cuánto demora?",
    respuesta:
      "Una página nueva, 14 días hábiles desde que tenemos tus textos y fotos. El rediseño depende de tu sitio: el plazo va en la propuesta.",
  },
  {
    pregunta: "¿Qué necesito tener listo?",
    respuesta:
      "Tus textos, fotos y datos de contacto. Si no los tienes ordenados, te decimos qué falta.",
  },
  {
    pregunta: "¿Pierdo mi dominio actual?",
    respuesta: "No. Trabajamos sobre tu dominio y queda a tu nombre.",
  },
  {
    pregunta: "¿El código es mío?",
    respuesta:
      "Tu dominio, tus cuentas y tus accesos son tuyos. El código fuente se entrega cuando el acuerdo lo incluye.",
  },
  {
    pregunta: "¿Por qué no uso Wix o una plantilla?",
    respuesta:
      "Puedes. Si prefieres no armarla tú, nosotros la armamos, conectamos tu WhatsApp y dejamos el dominio a tu nombre.",
  },
];

// Offline production-HTML double for the discovery test files.
//
// Maps deployed production URLs to the public HTML the discovery flow
// validates (title + meta description extraction). Values mirror the former
// fixtures/discovery.json data.
//
// Exports are merged into the router's `fixture` object by
// discovery-router.mjs.

export const htmlByUrl = {
  "https://clinica-nova.example.com":
    "<!doctype html><html><head><title>Clínica Nova — salud digital con agendamiento</title><meta name=\"description\" content=\"Agendamiento de turnos online para clínicas.\"></head><body><script id=\"__NEXT_DATA__\" type=\"application/json\">{}</script></body></html>",
  "https://reportes-ventas.vercel.app":
    "<!doctype html><html><head><title>Reportes de Ventas | Panel interno</title></head><body><div data-v-1a2b3c4d></div></body></html>",
  "https://clinica-nova.alt.example.com":
    "<!doctype html><html><head><title>Clínica Nova – turnos online</title></head><body><astro-island></astro-island></body></html>",
  "https://catalogo.onilabs.example.com":
    "<!doctype html><html><head><title>Catálogo Web :: tienda online</title></head><body><div id=\"wp-content\"></div></body></html>",
};

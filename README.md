<p align="center">
  <b>🚀 ONILABS · Portfolio</b><br>
  <sub>Portfolio del equipo ONILABS — servicios, proyectos, proceso y contacto, con formulario que envía correo.</sub>
</p>

<p align="center">
  <img src="screenshot.png" alt="ONILABS Portfolio" width="600">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js_13-000000?style=flat&logo=next.js&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/Tailwind-06B6D4?style=flat&logo=tailwindcss&logoColor=white" alt="Tailwind">
  <img src="https://img.shields.io/badge/Deploy-Vercel-000000?style=flat&logo=vercel" alt="Vercel">
</p>

---

## Qué hace

Sitio portfolio del equipo **ONILABS**. Presenta los servicios, el proceso de trabajo, el equipo y los proyectos destacados, y permite que un cliente se ponga en contacto mediante un **formulario que envía correo** por detrás (API route con Nodemailer).

## Funcionalidades

- Páginas: `Inicio` y `Proyectos`.
- Secciones: Hero, Servicios, Proyectos destacados, Proceso, Equipo y Contacto.
- Modal promocional.
- Formulario de contacto que envía correo vía **Nodemailer** (serverless).
- Datos de proyectos centralizados en `src/data/onilabs.js`.

## Uso local

```bash
npm install
npm run dev      # http://localhost:3000
```

> El formulario de contacto necesita variables de entorno para Nodemailer:
>
> | Variable | Uso |
> |----------|-----|
> | `EMAIL_USER` | Cuenta que envía el correo |
> | `EMAIL_PASS` | Contraseña / app password |
> | `NEXT_PUBLIC_SITE_URL` | URL pública del sitio |

## Sincronización automática del portfolio

Los datos públicos de proyectos (`src/data/portfolio.generated.json` y `public/portfolio/*.png`) se regeneran con:

```bash
npm run sync:portfolio   # también corre semanalmente vía GitHub Actions
```

El workflow (`.github/workflows/sync-portfolio.yml`) corre el sync y abre un PR; nunca pushea a `main`.

### Modos de origen

1. **Auto-discovery (camino normal).** Con `VERCEL_TOKEN` configurado, el sync descubre los repositorios de GitHub que tienen el topic del portfolio y un deploy de producción READY en Vercel, y los agrega como fuentes aprobadas. La narrativa y los textos SEO se derivan del HTML deployado. **Fail-closed:** con `VERCEL_TOKEN` configurado, cualquier error de discovery (API, auth, formato o HTML de producción) aborta el sync antes de escribir un solo archivo — nunca regenera un JSON solo-manual que borre temporalmente proyectos ya publicados. Además, si un proyecto que **ya está publicado** en `src/data/portfolio.generated.json` queda salteado en discovery (deploy no-READY, link de Vercel faltante o URL de producción no disponible), el sync también aborta antes del capture/staging: un proyecto publicado nunca sale del portfolio por un problema transitorio. Un repositorio recién taggeado que nunca se publicó puede quedar salteado hasta tener su deploy READY.
2. **Registro manual (fallback / override, solo migración).** Las entradas de `scripts/portfolio-sources.json` (más el registro local gitignored y la variable `PORTFOLIO_SOURCES_EXTRA`) siguen funcionando y ganan sobre las descubiertas ante cualquier colisión de identidad (owner/repo de GitHub, id, slug o projectId). El fallback solo-manual es válido **únicamente cuando `VERCEL_TOKEN` no está configurado**: en ese caso el sync avisa y usa solo el registro manual, así que `main` queda verde hasta configurar el secreto una única vez.

### Configuración única (secrets del repo)

| Variable | Dónde | Uso |
|----------|-------|-----|
| `VERCEL_TOKEN` | Secrets | Habilita el auto-discovery (requerido) |
| `PORTFOLIO_GITHUB_TOKEN` | Secrets | **Requerido para discovery:** token de GitHub explícito; el sync aborta de forma segura si falta con `VERCEL_TOKEN` configurado. El `github.token` del workflow no se usa para discovery — solo para publicar el PR |
| `VERCEL_TEAM_ID` | Secrets | Opcional, para cuentas con team |
| `PORTFOLIO_TOPIC` | Variables | Opcional; default `onilabs-portfolio` |

Los tokens solo se exponen al paso de sync del workflow, nunca a la acción que abre el PR.

Las miniaturas se componen en un canvas **4:3 (1920x1440)**, que es la geometría del resto del portfolio: cada imagen de proyecto curada a mano mide 4:3 y tanto la tarjeta del grid como la página de detalle renderizan en una caja `aspect-[4/3]` con `object-cover`. Una captura 16:9 dentro de esa caja pierde el 28% inferior, así que la captura de la página también es 4:3 y el marco del navegador tiene un área abierta exactamente 4:3, para que la captura entre sin recortar ninguno de los dos ejes.

### Assets de autoría (copy e imagen escritos a mano)

La derivación automática es determinista y por diseño no puede ser específica de cada proyecto: cae al fallback genérico cuando los topics y el lenguaje no encajan en ningún bucket conocido, y arma la narrativa variando solo por nombre y categoría. Un proyecto que no despliega nada tampoco tiene página deployada de la que sacar un título o una captura. Para eso existe `scripts/portfolio-authored-assets.json`: copy e imágenes escritos una vez, revisados a mano y commiteados, que el sync **lee** pero nunca regenera.

El sync tiene que seguir siendo determinista —entradas idénticas producen salidas byte-idénticas, y por eso no abre un PR si no hay cambios—, así que generar copy con un modelo en cada corrida queda descartado: abriría un PR por semana, para siempre.

**Precedencia**, de mayor a menor:

1. **Registro manual** (`scripts/portfolio-sources.json` y compañía). Ya está escrito a mano, así que un asset de autoría que apunte a una de sus entradas **aborta** la corrida en vez de perder en silencio: el copy vive en un solo lugar.
2. **Asset de autoría** (`scripts/portfolio-authored-assets.json`).
3. **Valor derivado** (discovery).

Cada asset se identifica por `id` (el slug) y, opcionalmente, por `github: { owner, repo }`, que sobrevive un rename del repositorio. Campos admitidos: `stack`, `card.{nombre,descripcion}`, `seo.{categoria,tituloSeo,descripcionSeo,desafio,enfoque}` y `thumbnail: { authored: true }`. `stack` reemplaza el stack derivado, que lee el lenguaje principal y los topics del repositorio: un proyecto escrito en un lenguaje y construido con varias librerías puede terminar publicando una sola palabra que no dice nada de lo que usa. `seo.slug` **no** es autorable: el slug es la URL pública y cambiarlo es una migración con redirects.

Campos desconocidos, identidades duplicadas, JSON inválido y assets que no matchean ninguna fuente **abortan** la corrida antes de escribir: un typo no puede terminar publicando el boilerplate derivado.

Una miniatura con `thumbnail: { authored: true }` no se captura ni se instala: el sync conserva el PNG commiteado en `public/portfolio/<id>.png` y valida que exista, que sea un PNG y que mida 1920x1080 (el canvas del compositor) antes de publicar el JSON que lo referencia. El contrato del JSON no cambia: sigue apuntando a `/portfolio/<id>.png`.

Para diseñar una de esas portadas:

```bash
node scripts/author-portfolio-thumbnail.mjs butacas-libres   # manual: el sync y CI nunca lo corren
```

Las cifras de una portada tienen que salir del propio proyecto (su README o su salida real). Inventarlas repetiría, en una imagen, el mismo defecto que este mecanismo saca de la narrativa.

### Flujo por proyecto (cero JSON)

Para publicar un proyecto nuevo no hace falta editar ningún JSON:

1. Agregar el topic `onilabs-portfolio` al repositorio del proyecto en GitHub.
2. Hacer deploy del proyecto en Vercel con un deploy de producción READY (dominio propio o `*.vercel.app`).

En la próxima corrida semanal (o manual del workflow), el proyecto entra al portfolio solo.

Si un proyecto descubierto necesita textos a mano, se agrega al registro manual con la misma identidad y esa entrada manual gana. Si necesita copy vendible propio o una portada diseñada en lugar de una captura, va en `scripts/portfolio-authored-assets.json`.

### Filtros de categoría del listado

Cada proyecto aparece en los filtros de `/proyectos` según su `categoria`, y el mapeo vive en `src/lib/projectFilters.mjs`. Tiene que ser **total**: una categoría renderizada sin entrada deja al proyecto fuera de todos los chips menos "Todos", que es invisible para quien navega por categoría. Un test de invariante falla cuando aparece una categoría sin mapear, así que una categoría nueva se arregla mapeándola, no descubriéndola en producción.

### Pruebas

```bash
npm run test:portfolio   # suite offline de discovery + integración (node --test)
```

## Tecnologías

| Capa | Stack |
|------|-------|
| Framework | Next.js 13 (Pages Router) |
| UI | React 18 |
| Estilos | Tailwind CSS |
| Email | Nodemailer |

---

<p align="center"><sub>Hecho con ❤️ por <a href="https://github.com/anthoniriv">ONILABS</a></sub></p>

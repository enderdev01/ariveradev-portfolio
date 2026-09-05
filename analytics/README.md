# Analytics stack (Umami)

Self-hosted, cookie-free web analytics. Replaces Vercel Analytics / GA4.

## Local usage

```bash
cp .env.example .env      # then fill in the secrets
openssl rand -hex 24      # POSTGRES_PASSWORD
openssl rand -hex 32      # APP_SECRET

docker compose up -d
```

Dashboard: http://localhost:3001 — default login `admin` / `umami`.
Change the password immediately after the first sign-in.

Useful commands:

```bash
docker compose logs -f umami   # follow logs
docker compose down            # stop (keeps the database volume)
docker compose down -v         # stop and DELETE all analytics data
```

## Ports

Umami is published on host port 3001 because `next dev` already uses 3000.
Postgres is not published to the host — it is only reachable from the
compose network.

## Tracker script

`TRACKER_SCRIPT_NAME` and `COLLECT_API_ENDPOINT` rename the default paths so
that ad blockers, which match on Umami's default file names, do not drop the
requests. The value of `TRACKER_SCRIPT_NAME` must include the `.js`
extension. With the current settings the script is served at `/metrics.js`.

## Production

This machine is not the production host: the tracking script must be served
from a public URL that stays online, and the collect endpoint must accept
requests from every visitor's browser.

Deploy the same `docker-compose.yml` to a VPS, put a reverse proxy with TLS
in front of it (Caddy or Traefik), and point a subdomain such as
`analytics.onilabs.site` at it. Then set `NEXT_PUBLIC_UMAMI_*` in the site's
environment to that public host.

## Backups

All data lives in the `umami-db-data` volume. Back it up before any upgrade:

```bash
docker compose exec -T db pg_dump -U umami umami | gzip > umami-$(date +%F).sql.gz
```

## Activar en producción (pendiente)

El sitio ya trae la integración cableada en `src/components/Analytics.js`.
No renderiza nada mientras falten las variables, así que activarlo no
requiere tocar código.

Pasos, cuando haya un host público:

1. Deployar este mismo `docker-compose.yml` a un VPS o PaaS, detrás de un
   proxy con TLS (Caddy o Traefik).
2. Apuntar un subdominio, por ejemplo `analytics.onilabs.site`, a ese host.
3. En Vercel, en el proyecto `onilabs-web`, agregar como variables normales
   (no secretas: son `NEXT_PUBLIC_*`, viajan al navegador de todos modos):

   NEXT_PUBLIC_UMAMI_URL=https://analytics.onilabs.site
   NEXT_PUBLIC_UMAMI_WEBSITE_ID=d9452480-c136-4ec4-839e-fc149031db0f

4. Redeployar. El script se carga desde `/metrics.js`.

El `website_id` de arriba corresponde al sitio ya creado en esta instancia
local. Si se levanta una instancia nueva desde cero, el id va a ser otro.

Nota: el sitio está cargado en Umami con dominio `onilabs.site`, pero el
host canónico del sitio es `www.onilabs.site`. Conviene alinearlos.

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

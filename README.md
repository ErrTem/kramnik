# Kramnik Shop

Learning e-commerce monorepo: React (Vite) storefront, NestJS API, PostgreSQL via Docker, and shared TypeScript types.

## Local development

1. **Enable pnpm:** `corepack enable` then `corepack prepare pnpm@9.15.9 --activate`
2. **Install:** `pnpm install`
3. **Database:** `pnpm db:up` — starts PostgreSQL in Docker (not required until Phase 2 API/DB work, but required for FOUND-03)
4. **API env (optional):** copy `apps/api/.env.example` to `apps/api/.env` when working with the API or database
5. **Run apps:** `pnpm dev` — runs `turbo dev`, which builds `@kramnik/types` then starts web and API together

`pnpm dev` and `turbo dev` **do not start PostgreSQL**. Start the database separately with `pnpm db:up` before you need `shop_dev`.

### Ports

| Service | Port |
|---------|------|
| Web (Vite) | **5173** |
| API (Nest) | **3000** |
| PostgreSQL | **5432** |

### Angular background

If you have used Angular CLI, `pnpm dev` is similar to running `ng serve` for both the web and API apps in parallel — Turborepo orchestrates the workspace instead of a single `angular.json` project.

Stack mapping and learning goals: see [.planning/PROJECT.md](.planning/PROJECT.md).

### Optional phase gate

With the API running and after `pnpm db:up`:

- Bash: `bash scripts/verify-phase1.sh`
- PowerShell: `powershell -File scripts/verify-phase1.ps1`

### Security (dev only)

Docker uses tutorial credentials: user/password `postgres`, database `shop_dev`. These are for local development only — never reuse in production. Port **5432** is published to the host; on shared machines, stop the stack with `pnpm db:down` when finished.

`DATABASE_URL` for the API (matches Docker): `postgresql://postgres:postgres@localhost:5432/shop_dev`

### Port conflicts

If another PostgreSQL instance already binds **5432**, stop the conflicting service. Phase 1 keeps the mapping `5432:5432` per project decisions — do not change it without updating planning docs.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Turbo dev (web + API after types build) |
| `pnpm build` | Build all workspace packages |
| `pnpm db:up` | `docker compose up -d` |
| `pnpm db:down` | `docker compose down` |
| `pnpm format` | Prettier format |

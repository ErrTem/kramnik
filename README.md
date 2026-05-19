# Kramnik Shop

Learning e-commerce monorepo: React (Vite) storefront, NestJS API, PostgreSQL via Docker, and shared TypeScript types.

## Local development

1. **Enable pnpm:** `corepack enable` then `corepack prepare pnpm@11.1.3 --activate` (or `corepack use pnpm@11.1.3` from the repo root)
2. **Install:** `pnpm install`
3. **Database:** `pnpm db:up` — starts PostgreSQL in Docker
4. **API env:** copy `apps/api/.env.example` to `apps/api/.env` (required for migrate/seed)
5. **Schema:** `pnpm db:migrate` — applies Prisma migrations to `shop_dev` (first run creates the initial migration if needed)
6. **Seed:** `pnpm db:seed` — loads dev users and sample products
7. **Run apps:** `pnpm dev` — runs `turbo dev`, which builds `@kramnik/types` then starts web and API together

`pnpm dev` and `turbo dev` **do not start PostgreSQL**. Start the database separately with `pnpm db:up` before migrate/seed.

**Prisma 7 note:** After `pnpm db:reset`, run `pnpm db:seed` explicitly (reset reapplies migrations but does not auto-seed).

Optional: `pnpm db:studio` — browser UI to browse/edit tables. Optional: `pnpm db:generate` — regenerate the Prisma client after schema changes.

### Ports

| Service | Port |
|---------|------|
| Web (Vite) | **5173** |
| API (Nest) | **3000** |
| PostgreSQL | **5432** |

### Angular background

If you have used Angular CLI, `pnpm dev` is similar to running `ng serve` for both the web and API apps in parallel — Turborepo orchestrates the workspace instead of a single `angular.json` project. The seed script is like a `DbInitializer` that runs once to populate dev data.

Stack mapping and learning goals: see [.planning/PROJECT.md](.planning/PROJECT.md).

### Phase 3 types (preview)

`packages/types` will generate shared DTOs from `apps/api/prisma/schema.prisma` in a later phase. Public JSON should expose money fields as **strings** (not raw Prisma `Decimal`) — see planning pitfalls for Decimal serialization.

### Optional phase gates

**Phase 1** (API running + Postgres):

- Bash: `bash scripts/verify-phase1.sh`
- PowerShell: `powershell -File scripts/verify-phase1.ps1`

**Phase 2** (Postgres up; migrate + seed already run):

- Bash: `bash scripts/verify-phase2.sh`
- PowerShell: `powershell -File scripts/verify-phase2.ps1`

### Security (dev only)

Docker uses tutorial credentials: user/password `postgres`, database `shop_dev`. These are for local development only — never reuse in production. Port **5432** is published to the host; on shared machines, stop the stack with `pnpm db:down` when finished.

`DATABASE_URL` for the API (matches Docker): `postgresql://postgres:postgres@localhost:5432/shop_dev`

### Dev app logins (dev only)

Tutorial passwords for local auth testing — **never use in production**:

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@kramnik.local` | `Admin123!` |
| Customer | `customer@kramnik.local` | `Customer123!` |

Passwords are stored as bcrypt hashes in the database (see `apps/api/prisma/seed.ts`).

### Port conflicts

If another PostgreSQL instance already binds **5432**, stop the conflicting service. Phase 1 keeps the mapping `5432:5432` per project decisions — do not change it without updating planning docs.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Turbo dev (web + API after types build) |
| `pnpm build` | Build all workspace packages |
| `pnpm test` | Run Vitest suite |
| `pnpm db:up` | `docker compose up -d` |
| `pnpm db:down` | `docker compose down` |
| `pnpm db:migrate` | Prisma migrate dev (`@kramnik/api`) |
| `pnpm db:seed` | Run `prisma/seed.ts` |
| `pnpm db:studio` | Prisma Studio |
| `pnpm db:reset` | Reset DB + reapply migrations (then run `db:seed` on Prisma 7) |
| `pnpm db:generate` | Regenerate Prisma client |
| `pnpm format` | Prettier format |

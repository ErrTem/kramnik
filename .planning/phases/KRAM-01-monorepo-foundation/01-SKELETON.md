# Walking Skeleton — Kramnik Shop

**Phase:** 1  
**Generated:** 2026-05-18

## Capability Proven End-to-End

A developer can run `pnpm install` → `pnpm db:up` → `pnpm dev` from the repo root and reach the **Kramnik Shop** web shell at `http://localhost:5173`, the Nest API welcome and health JSON at `http://localhost:3000`, and a healthy PostgreSQL `shop_dev` instance on `localhost:5432` — without Prisma, auth, or catalog features.

## Architectural Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Monorepo orchestration | **Turborepo 2.x** + **pnpm 9.x workspaces** | Locked D-01/D-03; task graph for `dev`/`build`/`lint`; learning-friendly vs Nx |
| Web framework | **Vite 8 + React 19 + Tailwind 4** (brownfield move to `apps/web`) | Existing repo stack; no greenfield rewrite |
| API framework | **NestJS 11** shell in `apps/api` | Aligns with PROJECT.md; Angular-familiar modules for learner |
| Shared types | **`@kramnik/types` stub** (`tsc` → `dist/`) | FOUND-01 layout early; Turbo `dev` depends on `types#build` (D-07) before Phase 3 Prisma DTOs |
| Database (runtime) | **PostgreSQL 16 via Docker Compose** at repo root | FOUND-03; not started by `turbo dev` (D-09) |
| Data access (app) | **Deferred to Phase 2** (Prisma) | Phase 1 only documents `DATABASE_URL` in `.env.example` |
| Auth | **Deferred to Phase 6** | No JWT or session in skeleton |
| Client state | **Deferred** (Zustand Phase 7, TanStack Query Phase 5) | Phase 1 has no business UI state |
| CORS | **`http://localhost:5173` only** on Nest (D-12) | Explicit origin before catalog API calls |
| Package manager pin | **Corepack** `packageManager: "pnpm@9.15.9"` | D-03 reproducible installs |
| Directory layout (web) | `apps/web/src/app/` + `src/shared/` placeholders | D-18; full `features/*` in Phase 5 |
| Dev ports | Web **5173**, API **3000** | D-10 |
| Formatting | **Prettier** at root + `pnpm format` | D-22 |
| ESLint | **Root shared flat config** + per-app overrides | D-20 |

## Stack Touched in Phase 1

- [x] Project scaffold (pnpm workspaces, Turborepo, shared TS/ESLint/Prettier)
- [x] Routing — minimal web shell only (no React Router yet; Phase 5)
- [ ] Database — **container only**; no ORM read/write until Phase 2
- [x] UI — static shell heading wired to Vite (no API data yet)
- [x] API — health/welcome JSON endpoints (no DB queries)
- [x] Deployment — **documented local full-stack** (`README` + `pnpm db:up` + `pnpm dev`)

## Out of Scope (Deferred to Later Slices)

- Prisma schema, migrations, seed (Phase 2)
- `@kramnik/types` DTO exports from Prisma (Phase 3)
- Product REST API and catalog UI (Phases 4–5)
- JWT auth, Zustand session, cart, checkout, admin (Phases 6–9)
- Production deployment, HTTPS, secrets management, non-default DB credentials
- Starting Postgres inside `turbo dev`
- Importing `@kramnik/types` from web/api (optional in Phase 1; Turbo ordering only)

## Subsequent Slice Plan

Each later phase adds one vertical slice without renegotiating skeleton decisions:

- **Phase 2:** Prisma data model — real DB read/write via migrations + seed
- **Phase 3:** Shared types pipeline — DTOs from Prisma into `@kramnik/types`
- **Phase 4:** Products API — Nest module + public REST reads
- **Phase 5:** Catalog UI — React Router, TanStack Query, product pages
- **Phase 6:** Authentication — JWT end-to-end
- **Phase 7–9:** Cart, checkout, admin

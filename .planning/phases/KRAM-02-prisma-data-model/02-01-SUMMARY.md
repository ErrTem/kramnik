---
phase: 02-prisma-data-model
plan: 01
subsystem: database
tags: [prisma, postgresql, migrations, vitest]

requires:
  - phase: 01-03
    provides: Docker Postgres shop_dev, db:up
provides:
  - apps/api/prisma/schema.prisma (User, Product, Order, OrderItem)
  - apps/api/prisma/migrations/20260519153521_initial
  - apps/api/prisma.config.ts (Prisma 7)
  - Root db:migrate, db:seed, db:studio, db:reset, db:generate
  - tests/data/prisma-schema.test.ts
affects: [phase-2-plan-02, phase-3]

requirements-completed: [DATA-01, DATA-02]

duration: —
completed: 2026-05-19
---

# Phase 02 Plan 01: Schema & Migration Summary

**Prisma 7 schema under `apps/api/prisma/`, initial migration on `shop_dev`, and root `db:*` orchestration with static contract tests.**

## Stack (as implemented)

| Tool | Version |
|------|---------|
| pnpm | **11.1.3** (Corepack) |
| prisma / @prisma/client | **7.8.0** |
| @prisma/adapter-pg | **7.8.0** |
| pg | **8.21.0** |
| bcryptjs | **3.0.3** |
| tsx | **4.22.3** |
| dotenv | **17.4.2** |
| PostgreSQL | **16** (Docker) |

## Accomplishments

- Single `schema.prisma` with enums `Role`, `Category`, `OrderStatus` and four models per CONTEXT (D-08–D-24)
- `prisma.config.ts` for Prisma 7 datasource URL and seed path
- Initial migration `20260519153521_initial` applied to local `shop_dev`
- Root scripts delegate via `pnpm --filter @kramnik/api exec prisma`
- Wave 0 test `tests/data/prisma-schema.test.ts` — 6 assertions

## Deviations from original plan

- **D-33:** Implementer chose **Prisma 7.8.0** instead of pinned 6.19.3; added `@prisma/adapter-pg`, `pg`, `prisma.config.ts`
- Migration folder name `initial` vs plan’s `init` — functionally equivalent

## Verification

- `pnpm exec vitest run tests/data/prisma-schema.test.ts` — pass
- `pnpm --filter @kramnik/api exec prisma migrate status` — up to date (with `pnpm db:up`)

---
phase: 02-prisma-data-model
plan: 02
subsystem: database
tags: [prisma, seed, bcrypt, readme, verify-scripts]

requires:
  - phase: 02-01
    provides: migrated schema and db:* scripts
provides:
  - apps/api/prisma/seed.ts (idempotent users + 12 products)
  - scripts/verify-phase2.sh / verify-phase2.ps1
  - README db workflow and dev logins
  - tests/data/seed-content.test.ts, readme-db-flow.test.ts
  - tests/foundation/verify-phase2-scripts.test.ts
affects: [phase-3, phase-4, phase-6]

requirements-completed: [DATA-03]

duration: —
completed: 2026-05-19
---

# Phase 02 Plan 02: Seed & Developer Workflow Summary

**Idempotent seed with bcryptjs, README database flow, Phase 2 gate scripts, and Vitest static checks.**

## Accomplishments

- `seed.ts`: upsert 2 users (`admin@kramnik.local`, `customer@kramnik.local`) and 12 themed products; no orders
- Prisma 7 seed uses `@prisma/adapter-pg` + `DATABASE_URL` from `.env`
- `scripts/verify-phase2.sh` / `.ps1` — postgres ready, ≥12 products, admin user
- README: `db:up` → `.env` → `db:migrate` → `db:seed` → `dev`; dev-only credentials; Prisma 7 reset/seed note
- Static tests for seed, README, and verify scripts

## Verification

- `pnpm exec vitest run tests/data/seed-content.test.ts tests/data/readme-db-flow.test.ts tests/foundation/verify-phase2-scripts.test.ts` — pass
- `pnpm db:seed` — exit 0 (idempotent re-run)
- `powershell -File scripts/verify-phase2.ps1` — pass (with Docker up, migrate + seed applied)

## Notes for later phases

- Nest `PrismaService` (Phase 4) must use the same **driver adapter** pattern as seed
- Phase 3: generate types from `apps/api/prisma/schema.prisma`; map `Decimal` → `string` in public JSON

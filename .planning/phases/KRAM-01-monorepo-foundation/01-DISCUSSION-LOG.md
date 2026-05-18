# Phase 1: Monorepo Foundation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-18
**Phase:** 1-Monorepo Foundation
**Areas discussed:** Package manager, packages/types, Local dev workflow, Postgres Docker, Vite migration, Shared tooling

---

## Package manager

| Option | Description | Selected |
|--------|-------------|----------|
| pnpm workspaces | Matches research/FOUND; turbo-friendly | ✓ |
| npm workspaces | Keep package-lock habits | |
| You decide | Agent picks | |

**User's choice:** pnpm workspaces

| Option | Description | Selected |
|--------|-------------|----------|
| Remove package-lock.json | Clean break, pnpm-lock.yaml | ✓ |
| Keep both temporarily | Migrate later | |
| You decide | | |

**User's choice:** Remove package-lock.json

| Option | Description | Selected |
|--------|-------------|----------|
| Corepack packageManager field | Node enforces pnpm version | ✓ |
| engines only | Document global install | |
| You decide | | |

**User's choice:** Corepack

| Option | Description | Selected |
|--------|-------------|----------|
| Default pnpm layout | No .npmrc overrides | ✓ (skipped — default applied) |
| shamefully-hoist | Tool compatibility | |

**Notes:** User skipped hoisting question; default pnpm layout recorded in CONTEXT D-04.

---

## packages/types

| Option | Description | Selected |
|--------|-------------|----------|
| Empty stub now | FOUND-01 layout early | ✓ |
| Defer to Phase 3 | apps only in Phase 1 | |
| You decide | | |

**User's choice:** Empty stub

| Option | Description | Selected |
|--------|-------------|----------|
| @kramnik/types | Matches repo name | ✓ |
| @kramnik-shop/types | | |

**User's choice:** @kramnik/types

| Option | Description | Selected |
|--------|-------------|----------|
| tsc build in Phase 1 | turbo build wired | ✓ |
| No build until Phase 3 | | |

**User's choice:** tsc build in Phase 1

| Option | Description | Selected |
|--------|-------------|----------|
| types#build before dev | Ensures dist exists | ✓ |
| No dev dependency | | |

**User's choice:** types#build before dev

---

## Local dev workflow

| Option | Description | Selected |
|--------|-------------|----------|
| pnpm dev → turbo dev | web + api parallel | ✓ |
| turbo dev + db:up combined | | |
| You decide | | |

**User's choice:** turbo dev only (DB separate)

| Option | Description | Selected |
|--------|-------------|----------|
| Web 5173 + API 3000 | Standard defaults | ✓ |
| API 4000 | | |

**User's choice:** 5173 + 3000

| Option | Description | Selected |
|--------|-------------|----------|
| apps/api/.env | API secrets isolated | ✓ |
| Root .env | | |

**User's choice:** apps/api/.env

| Option | Description | Selected |
|--------|-------------|----------|
| CORS for localhost:5173 | Ready for Phase 5 | ✓ |
| No CORS until Phase 5 | | |

**User's choice:** Enable CORS now

---

## Postgres Docker

| Option | Description | Selected |
|--------|-------------|----------|
| Manual pnpm db:up | Document prerequisite | ✓ |
| Document only | | |

**User's choice:** Manual db:up

| Option | Description | Selected |
|--------|-------------|----------|
| postgres/postgres, shop_dev | Tutorial-style | ✓ |
| kramnik/kramnik, kramnik_dev | | |

**User's choice:** postgres/postgres, shop_dev

| Option | Description | Selected |
|--------|-------------|----------|
| Root docker-compose.yml | | ✓ |
| infra/docker/ | | |

**User's choice:** Repo root

| Option | Description | Selected |
|--------|-------------|----------|
| 5432:5432 | Standard | ✓ |
| 5433:5432 | | |

**User's choice:** 5432

---

## Vite migration

| Option | Description | Selected |
|--------|-------------|----------|
| Keep starter demo | | |
| Minimal shell | | |
| Delete starter demo | User free-text | ✓ |

**User's choice:** Delete starter demo (minimal “Kramnik Shop” shell)

| Option | Description | Selected |
|--------|-------------|----------|
| Remove demo assets | | ✓ |
| Keep public/icons.svg only | | |

**User's choice:** Remove unused demo assets

| Option | Description | Selected |
|--------|-------------|----------|
| src/app + src/shared placeholders | Early structure | ✓ |
| Flat src/ until Phase 5 | | |

**User's choice:** Early feature-oriented layout

| Option | Description | Selected |
|--------|-------------|----------|
| Kramnik Shop | Tab title | ✓ |
| Kramnik | | |

**User's choice:** Kramnik Shop

---

## Shared tooling

| Option | Description | Selected |
|--------|-------------|----------|
| Root eslint extended by apps | | ✓ |
| Per-app eslint only | | |

**User's choice:** Root shared ESLint

| Option | Description | Selected |
|--------|-------------|----------|
| tsconfig.base.json at root | | ✓ |
| Independent per package | | |

**User's choice:** Root base tsconfig

| Option | Description | Selected |
|--------|-------------|----------|
| Add Prettier Phase 1 | | ✓ |
| ESLint only | | |

**User's choice:** Prettier in Phase 1

| Option | Description | Selected |
|--------|-------------|----------|
| GET /health only | | |
| GET /health + GET / | | ✓ |
| You decide | | |

**User's choice:** Health + root welcome

---

## Claude's Discretion

- pnpm exact patch version (9.x stable)
- Nest `GET /` welcome copy
- Prettier/ESLint conflict resolution if needed
- Default pnpm hoisting (question skipped)

## Deferred Ideas

None.

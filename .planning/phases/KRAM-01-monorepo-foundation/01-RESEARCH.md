# Phase 01: Monorepo Foundation — Research

**Researched:** 2026-05-18  
**Domain:** Turborepo + pnpm workspaces, brownfield Vite migration, NestJS shell, Docker Postgres  
**Confidence:** HIGH (stack patterns); MEDIUM (Windows/Corepack first-run on fresh machines)

## Summary

Phase 1 converts the existing root-level Vite 8 + React 19 + Tailwind 4 starter into a **pnpm + Turborepo** monorepo with `apps/web`, `apps/api`, and `packages/types`, plus root Docker Compose for PostgreSQL. All layout, tooling, and workflow choices are **locked in `01-CONTEXT.md`** — research focuses on *how* to implement them safely, not whether to use npm, Nx, or skip `packages/types`.

The brownfield path is: scaffold workspace root → **move** (not copy-and-forget) Vite assets into `apps/web` → strip demo UI → add Nest shell with `GET /` and `GET /health` → add empty `@kramnik/types` with `tsc` → `dist/` → wire `turbo.json` so **`dev` depends on `@kramnik/types#build`** (valid: persistent tasks may depend on non-persistent builds, not the reverse) [CITED: turborepo.dev/docs/crafting-your-repository/configuring-tasks] → document `pnpm install` → `pnpm db:up` → `pnpm dev`.

**Primary recommendation:** Follow the three roadmap plans (01-01 workspace + web move, 01-02 API + turbo `dev`, 01-03 Docker + README) in order; delete root `package-lock.json` and npm-era root app files only after `apps/web` runs; pin `packageManager` to **pnpm 9.x** via Corepack before first `pnpm install`.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

#### Package manager & workspace
- **D-01:** Use **pnpm workspaces** as the sole package manager from Phase 1 onward.
- **D-02:** **Remove `package-lock.json`** and generate `pnpm-lock.yaml` (clean break from npm).
- **D-03:** Pin pnpm via **Corepack** (`packageManager` field in root `package.json`, e.g. `pnpm@9.x`).
- **D-04:** Use **default pnpm install layout** (no `shamefully-hoist` unless a tool breaks without it).

#### `packages/types` in Phase 1
- **D-05:** Create **`@kramnik/types`** as an empty stub in Phase 1 (satisfies FOUND-01 folder layout early).
- **D-06:** Include a **minimal `tsc` build** for `packages/types` in the Turbo pipeline from Phase 1.
- **D-07:** **`turbo dev` depends on `types#build`** so `dist/` exists before web/api dev start.

#### Local dev workflow
- **D-08:** Primary dev command: **`pnpm dev` → `turbo dev`** (parallel web + API only).
- **D-09:** **Postgres is not started by `turbo dev`** — document `pnpm db:up` (or equivalent) as a manual prerequisite.
- **D-10:** Default ports: **web `5173`**, **API `3000`**.
- **D-11:** **`DATABASE_URL` and API secrets in `apps/api/.env`** (with `apps/api/.env.example`); web env files deferred until needed.
- **D-12:** Enable **CORS on Nest for `http://localhost:5173`** in Phase 1 (ready before catalog calls API).

#### PostgreSQL (Docker)
- **D-13:** Start DB via **manual `pnpm db:up`** (`docker compose up -d`); document in README as prerequisite to API work in Phase 2+.
- **D-14:** Credentials: **user/password `postgres`**, database **`shop_dev`** (tutorial-style defaults).
- **D-15:** **`docker-compose.yml` at repo root**; host port **`5432:5432`** (document port conflicts).

#### Moving `apps/web`
- **D-16:** **Remove Vite starter demo UI** — replace with a minimal shell (e.g. “Kramnik Shop” heading, empty main).
- **D-17:** **Remove unused demo assets** (hero, react/vite logos under `src/assets`).
- **D-18:** Use **early feature-oriented layout**: `src/app/` + `src/shared/` placeholders (full `features/*` in Phase 5).
- **D-19:** Browser title / `index.html`: **“Kramnik Shop”**.

#### Shared tooling & API surface
- **D-20:** **Root `eslint.config.js`** extended by apps (shared rules + per-app overrides).
- **D-21:** **Root `tsconfig.base.json`** extended by apps and packages.
- **D-22:** Add **Prettier** at root with format script (coexist with ESLint).
- **D-23:** Nest exposes **`GET /health`** (JSON `{ status: "ok" }` or similar) **and `GET /`** (welcome message).

### Claude's Discretion

- Exact `packageManager` patch version for pnpm (use current stable 9.x).
- Nest welcome message copy on `GET /`.
- Minimal shell component structure under `src/app/` until Phase 5.
- Prettier/ESLint integration details (e.g. `eslint-config-prettier`) if conflicts arise.

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| FOUND-01 | Turborepo monorepo with `apps/web`, `apps/api`, `packages/types` | `pnpm-workspace.yaml`, root `turbo.json`, workspace `package.json` names; delete root Vite app after move |
| FOUND-02 | Run web + API from root with documented commands | Root `pnpm dev` → `turbo dev`; README flow `pnpm install` → `pnpm db:up` → `pnpm dev`; health/`/` endpoints |
| FOUND-03 | PostgreSQL locally via Docker Compose | Root `docker-compose.yml`, `pnpm db:up`, `DATABASE_URL` in `apps/api/.env.example` |
</phase_requirements>

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Monorepo orchestration | Repo root (Turborepo + pnpm) | — | Task graph and lockfile are workspace-wide |
| Web UI shell | Browser / `apps/web` | — | Vite serves React; no SSR in v1 |
| API health/welcome | API / `apps/api` | — | Nest owns HTTP surface |
| Shared type stub build | `packages/types` | Turbo (orchestration) | Compile-time artifact `dist/`; not runtime API |
| PostgreSQL instance | Docker (host) | API (consumer, Phase 2+) | DB process outside `turbo dev` per D-09 |
| CORS policy | API / `apps/api` | — | Browser origin enforcement belongs on server |
| Dev documentation | Repo root README | — | Single entry point for learning workflow |

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| **pnpm** | **9.15.9** (9.x line; pin in `packageManager`) | Workspace installs | Locked D-03; Corepack activation verified in research session |
| **turbo** | **2.9.14** | `dev` / `build` / `lint` pipelines | Official monorepo task runner; matches PROJECT preference |
| **Vite** | **^8.0.12** (existing) | `apps/web` dev/build | Already in repo; move wholesale |
| **React** | **^19.2.6** (existing) | UI | Already in repo |
| **Tailwind CSS** | **^4.3.0** + `@tailwindcss/vite` | Styling | Already configured |
| **TypeScript** | **~6.0.2** (existing) / registry **6.0.3** | Shared language | Align workspace on one TS version |
| **NestJS** | **11.x** (`@nestjs/core` **11.1.21**) | `apps/api` shell | Angular-familiar modules; official CLI scaffold |
| **PostgreSQL (Docker)** | **16** image [ASSUMED] | Local DB | STACK.md guidance; pin `postgres:16` in compose |
| **Prettier** | **3.8.3** | Formatting | Locked D-22 |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@nestjs/cli` | **11.0.21** | Scaffold/build API | `apps/api` devDependency |
| `eslint-config-prettier` | **10.1.8** | Disable ESLint rules that conflict with Prettier | If flat-config rule clashes (D-20 discretion) |
| `reflect-metadata`, `rxjs` | Nest peers | Nest runtime | Required by Nest bootstrap |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Turborepo | Nx | Rejected by PROJECT — heavier learning curve |
| pnpm 11.x | pnpm 9.x | **Rejected** — D-03 locks 9.x |
| npm workspaces | pnpm | **Rejected** — D-01/D-02 |
| `nest new` at repo root | `apps/api` only | Root pollution; breaks FOUND-01 layout |

**Installation (root, illustrative):**

```bash
corepack enable
corepack prepare pnpm@9.15.9 --activate
pnpm add -D turbo prettier -w
# apps/api and apps/web dependencies installed per-package after scaffold
```

**Version verification (2026-05-18):** `npm view turbo|pnpm|@nestjs/cli|prettier|eslint-config-prettier|@nestjs/core version` — pnpm registry latest is 11.x; **use 9.15.9 per locked decision**, not registry latest.

## Package Legitimacy Audit

> slopcheck and pip were **unavailable** on the research machine. All packages below require planner **`checkpoint:human-verify`** before install unless the executor re-runs slopcheck.

| Package | Registry | Age | Downloads | Source Repo | slopcheck | Disposition |
|---------|----------|-----|-----------|-------------|-----------|-------------|
| turbo | npm | Mature | Very high | github.com/vercel/turborepo | — | Approved with checkpoint |
| prettier | npm | Mature | Very high | github.com/prettier/prettier | — | Approved with checkpoint |
| eslint-config-prettier | npm | Mature | Very high | github.com/prettier/eslint-config-prettier | — | Approved with checkpoint |
| @nestjs/cli | npm | Mature | High | github.com/nestjs/nest-cli | — | Approved with checkpoint |
| @nestjs/core | npm | Mature | Very high | github.com/nestjs/nest | — | Approved with checkpoint |
| @kramnik/types | **local workspace** | n/a | n/a | this repo | n/a | Private stub — not on npm |

**Packages removed due to slopcheck [SLOP] verdict:** none (slopcheck not run)  
**Packages flagged as suspicious [SUS]:** none (slopcheck not run)

## Project Constraints (from .cursor/rules/)

- **Fixed stack:** React (Vite), TypeScript, Tailwind, Zustand, TanStack Query, NestJS, Prisma, PostgreSQL — no substitutions in later phases without explicit decision change.
- **Monorepo:** Turborepo preferred over Nx; Phase 1 must establish that layout.
- **GSD workflow:** Prefer `/gsd-execute-phase` and related GSD commands for planned work; do not bypass without user request.
- **Learning framing:** Map concepts to Angular where helpful in README/plan notes (e.g. `turbo dev` ≈ running multiple `ng serve` projects).
- **Minimal dependencies:** Only what Phase 1 needs — no Prisma, Query, or Zustand in this phase.

## Architecture Patterns

### System Architecture Diagram

```mermaid
flowchart TB
  subgraph dev["Developer (repo root)"]
    PI["pnpm install"]
    DB["pnpm db:up"]
    PD["pnpm dev → turbo dev"]
  end

  subgraph turbo["Turborepo"]
    TB["@kramnik/types#build"]
    TW["apps/web#dev :5173"]
    TA["apps/api#dev :3000"]
  end

  subgraph docker["Docker Compose"]
    PG[(PostgreSQL shop_dev)]
  end

  PI --> PD
  DB --> PG
  PD --> TB
  TB --> TW
  TB --> TA
  TW -->|HTTP later| TA
  TA -.->|DATABASE_URL Phase 2+| PG
```

### Recommended Project Structure

```
/
├── package.json              # private root, packageManager, scripts: dev, db:up, format
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── turbo.json
├── tsconfig.base.json
├── eslint.config.js
├── .prettierrc
├── docker-compose.yml
├── apps/
│   ├── web/
│   │   ├── index.html        # title: Kramnik Shop
│   │   ├── vite.config.ts
│   │   ├── src/
│   │   │   ├── app/          # shell components
│   │   │   ├── shared/       # placeholders
│   │   │   ├── main.tsx
│   │   │   └── index.css
│   │   └── package.json      # name: @kramnik/web [ASSUMED]
│   └── api/
│       ├── src/
│       │   ├── main.ts       # CORS + listen 3000
│       │   ├── app.module.ts
│       │   └── app.controller.ts  # GET /, GET /health
│       ├── .env.example
│       └── package.json      # name: @kramnik/api [ASSUMED]
└── packages/
    └── types/
        ├── src/index.ts      # export {} stub
        ├── tsconfig.json     # composite, outDir dist
        └── package.json      # name: @kramnik/types
```

### Pattern 1: pnpm workspace root

**What:** Declare workspace packages and pin package manager.  
**When to use:** First step of 01-01, before moving `apps/web`.

```yaml
# pnpm-workspace.yaml
# Source: https://pnpm.io/workspaces
packages:
  - 'apps/*'
  - 'packages/*'
```

```json
{
  "name": "kramnik-shop",
  "private": true,
  "packageManager": "pnpm@9.15.9",
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "lint": "turbo lint",
    "format": "prettier --write \"**/*.{ts,tsx,js,json,md,css}\"",
    "db:up": "docker compose up -d",
    "db:down": "docker compose down"
  }
}
```

[CITED: pnpm.io/workspaces] [CITED: nodejs.org/api/corepack.html]

### Pattern 2: Turbo pipeline — `dev` waits for `types#build`

**What:** Non-persistent `build` on `@kramnik/types` runs before persistent `dev` tasks.  
**When to use:** Satisfies D-06/D-07 without making `dev` depend on another `dev` task.

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "dependsOn": ["@kramnik/types#build"],
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    }
  }
}
```

**Critical constraint:** Do not add `"dependsOn": ["^dev"]` or depend on any **persistent** task — Turbo errors: *"A persistent task cannot depend on it"* [CITED: turborepo.dev/docs/reference/configuration#persistent].

Use package-scoped dependency `@kramnik/types#build` (Turborepo arbitrary task syntax) [CITED: turborepo.dev/docs/crafting-your-repository/configuring-tasks].

### Pattern 3: Brownfield Vite move to `apps/web`

**What:** Relocate `index.html`, `vite.config.ts`, `src/`, `public/` into `apps/web`; fix paths; remove root copies.  
**When to use:** 01-01 after workspace files exist.

- Keep `vite.config.ts` beside `index.html` in `apps/web` (Vite resolves config from project root) [CITED: vite.dev/guide].
- Default dev port **5173** unchanged [CITED: vite.dev/guide].
- Replace demo `App.tsx` with minimal shell; delete `src/assets` demo files (D-16–D-17).
- Add `.gitignore` entries for `apps/api/.env` if not already covered by `*.local` pattern.

### Pattern 4: NestJS shell with CORS and health routes

**What:** Minimal API with welcome + health; CORS for Vite origin only.  
**When to use:** 01-02.

```typescript
// apps/api/src/main.ts
// Source: https://docs.nestjs.com/first-steps
// Source: https://docs.nestjs.com/security/cors
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: 'http://localhost:5173' });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

```typescript
// apps/api/src/app.controller.ts
import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  root() {
    return { message: 'Kramnik Shop API' }; // copy is discretion
  }

  @Get('health')
  health() {
    return { status: 'ok' };
  }
}
```

Scaffold via `pnpm exec nest new api --directory apps/api` **or** equivalent non-interactive flags from `apps` parent — ensure output lands in `apps/api`, not repo root [CITED: docs.nestjs.com/first-steps].

### Pattern 5: `@kramnik/types` stub package

**What:** Empty compiled package so Turbo `build`/`dev` wiring is real before Prisma (Phase 3).  
**When to use:** 01-01 or early 01-02.

```json
// packages/types/package.json
{
  "name": "@kramnik/types",
  "version": "0.0.0",
  "private": true,
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    }
  },
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "lint": "eslint ."
  }
}
```

```typescript
// packages/types/src/index.ts
export {};
```

```json
// packages/types/tsconfig.json — extends ../../tsconfig.base.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "composite": true,
    "declaration": true,
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

Phase 1 does **not** require `apps/web` or `apps/api` to import `@kramnik/types` yet — only Turbo build ordering (D-07).

### Pattern 6: Docker Compose Postgres

**What:** Local `shop_dev` database; not wired into Nest until Phase 2.  
**When to use:** 01-03.

```yaml
# docker-compose.yml
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: shop_dev
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data
volumes:
  postgres_data:
```

```env
# apps/api/.env.example
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/shop_dev
```

### Pattern 7: Root shared ESLint + TypeScript

**What:** Single `eslint.config.js` and `tsconfig.base.json`; apps use `extends` / import pattern for overrides (D-20, D-21).  
**When to use:** During 01-01 after package layout exists.

- Root ESLint: shared ignores (`**/dist`, `**/node_modules`) + TypeScript defaults.
- `apps/web`: add `globals.browser`, React plugins (migrate from current root config).
- `apps/api`: add `globals.node`, Nest-friendly rules.
- Run Prettier separately (`pnpm format`) or add `eslint-config-prettier` last in flat config array if lint/format conflicts appear (D-22 discretion).

### Anti-Patterns to Avoid

- **Leaving root `src/` and root Vite config after move:** Causes double apps and broken `turbo dev` (PITFALLS §5).
- **Running `npm install` at root after migration:** Violates D-01/D-02; produces wrong lockfile.
- **Adding `dependsOn: ["^dev"]`:** Turbo failure on persistent tasks.
- **Starting Postgres inside `turbo dev`:** Violates D-09; couples DB lifecycle to frontend HMR.
- **CORS `origin: true` / `*` in Phase 1:** Over-broad for learning project; use explicit `http://localhost:5173` (D-12).
- **Committing `apps/api/.env`:** Only `.env.example` in git; document copy step.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Monorepo task orchestration | Custom concurrently scripts only | **Turborepo** `turbo.json` | Caching, `dependsOn`, package graph |
| Workspace linking | Manual `file:` paths everywhere | **pnpm** `workspace:*` protocol | Deterministic local packages [CITED: pnpm.io/workspaces] |
| Package manager pinning | Document “install pnpm 9” only | **Corepack** `packageManager` field | Enforces version on `pnpm install` [CITED: nodejs.org/api/corepack.html] |
| Nest HTTP bootstrap | Raw Express server | **NestFactory** + modules | Matches rest of project |
| CORS middleware | Custom headers middleware | **`app.enableCors({ origin })`** | Maintained platform integration [CITED: docs.nestjs.com/security/cors] |
| DB container orchestration | Manual `docker run` docs only | **Docker Compose** file + `pnpm db:up` | Reproducible FOUND-03 |

## Runtime State Inventory

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| **Stored data** | None in application stores. After `pnpm db:up`, Docker volume `postgres_data` holds `shop_dev` (empty until Phase 2 migrations). | Document volume; no migration in Phase 1 |
| **Live service config** | None outside git (greenfield DB). | N/A |
| **OS-registered state** | None — verified: no pm2/systemd/Task Scheduler references in repo | N/A |
| **Secrets/env vars** | None committed. Future `apps/api/.env` (gitignored pattern `*.local` may not cover `.env` — **add `apps/api/.env` to `.gitignore`**) | Add `.env` to gitignore; ship `.env.example` only |
| **Build artifacts** | Root `node_modules/` from npm; future `dist/` per package | Remove root npm artifacts; `pnpm install` from root; add `dist` to ignore (already present) |
| **Lockfiles** | `package-lock.json` (npm) | **Delete** per D-02; replace with `pnpm-lock.yaml` |

**npm-specific state:** Developers may have global habits (`npm run dev` at old root) — README must state new commands (FOUND-02).

## Common Pitfalls

### Pitfall 1: Broken Vite paths after move (PITFALLS §5)

**What goes wrong:** `index.html` still references `/src/main.tsx` but files live elsewhere; dev server serves wrong root.  
**Why it happens:** Partial move leaving duplicate roots.  
**How to avoid:** Move `index.html`, `vite.config.ts`, `src/`, `public/` together; run `pnpm --filter @kramnik/web dev` before deleting root copies.  
**Warning signs:** 404 on `main.tsx`; Turbo runs zero web tasks.

### Pitfall 2: Turbo `dev` / `build` misconfiguration

**What goes wrong:** `types` `dist/` missing; web/api start before `tsc` completes; or Turbo throws on persistent dependency.  
**Why it happens:** Missing `outputs: ["dist/**"]` on `build`; wrong `dependsOn` syntax (`types#build` vs `@kramnik/types#build`).  
**How to avoid:** Use exact package name from `packages/types/package.json`; run `pnpm turbo build --filter=@kramnik/types` once to verify.  
**Warning signs:** Import errors in later phases; Turbo graph error message about persistent tasks.

### Pitfall 3: Corepack/pnpm not available on first clone

**What goes wrong:** `pnpm: command not found` (observed on research machine before `corepack enable`).  
**Why it happens:** pnpm not globally installed; Corepack not enabled (Node 22 includes Corepack but shims need activation).  
**How to avoid:** README step: `corepack enable` then `corepack prepare pnpm@9.15.9 --activate` before `pnpm install`.  
**Warning signs:** CI/local scripts fail immediately on clone.

### Pitfall 4: PostgreSQL port conflict

**What goes wrong:** `docker compose up` fails — port 5432 in use.  
**Why it happens:** Local Postgres already running (common on dev machines).  
**How to avoid:** Document check `5432` and override compose port only as last resort (D-15 locks `5432:5432` — document stop local Postgres instead).  
**Warning signs:** Bind address already in use.

### Pitfall 5: ESLint flat config `parserOptions.project` paths

**What goes wrong:** Type-aware ESLint rules break when `tsconfig` paths still point to old root.  
**Why it happens:** Copied `eslint.config.js` without updating `tsconfigRootDir` / project paths per app.  
**How to avoid:** Per-app `eslint.config.js` that imports shared base and sets `import.meta.dirname` relative to each app.  
**Warning signs:** ESLint cannot find tsconfig; lint passes at root only.

## Code Examples

### Root `pnpm-workspace.yaml` + `packageManager`

See Pattern 1 above. [CITED: pnpm.io/workspaces]

### `turbo.json` for Phase 1

See Pattern 2 above. [CITED: turborepo.dev/docs/crafting-your-repository/configuring-tasks]

### Nest CORS + listen

See Pattern 4 above. [CITED: docs.nestjs.com/security/cors]

### Minimal web shell (conceptual)

```tsx
// apps/web/src/app/AppShell.tsx
export function AppShell() {
  return (
    <main>
      <h1>Kramnik Shop</h1>
    </main>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| npm + single root Vite app | pnpm workspaces + Turborepo | Phase 1 (this phase) | All commands from repo root |
| No shared types package | `@kramnik/types` stub with `tsc` | Phase 1 | Turbo `dev` depends on real `dist/` |
| Implicit local DB | Docker Compose `shop_dev` | Phase 1 | Phase 2 Prisma uses documented `DATABASE_URL` |

**Deprecated/outdated for this repo after Phase 1:**
- Root `package-lock.json` and npm install at root (D-02).
- Vite marketing starter UI and demo assets (D-16–D-17).

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Workspace package names `@kramnik/web`, `@kramnik/api` | Structure | **RESOLVED** — see Open Questions (RESOLVED) §1 |
| A2 | `postgres:16` image tag | Docker | Minor; 15+ acceptable for learning |
| A3 | Nest scaffold via `@nestjs/cli` into `apps/api` | API | **RESOLVED** — CLI primary; hand-scaffold fallback per 01-02 Task 1 |
| A4 | No `shamefully-hoist` needed for Vite/Nest | pnpm | Add only if tooling breaks (D-04 escape hatch) |
| A5 | Phase 1 validation can use shell/curl smoke scripts before Vitest | Validation | Nyquist automation partial until Wave 0 |

## Open Questions (RESOLVED)

1. **Exact `@kramnik/web` / `@kramnik/api` package names** — **RESOLVED:** Use `@kramnik/web` and `@kramnik/api` (locked in `01-01-PLAN.md` Task 3 and `01-02-PLAN.md` Task 1).

2. **Nest CLI interactive prompts on Windows** — **RESOLVED:** Primary: `pnpm exec nest new api --directory apps/api --skip-git --package-manager pnpm`. Fallback: hand-create minimal Nest tree per RESEARCH Pattern 4 if CLI prompts block automation (`01-02-PLAN.md` Task 1).

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | All | ✓ | **22.22.0** | Requires ≥20 per Nest/Vite docs |
| Corepack | pnpm pin (D-03) | ✓ | **0.34.6** | `npm i -g corepack` [CITED: nodejs.org/api/corepack.html] |
| pnpm | Workspace | ✓ (after `corepack enable`) | **9.15.9** activated | `corepack prepare pnpm@9.15.9 --activate` |
| Docker | FOUND-03, `db:up` | ✓ | **29.4.3** | None for FOUND-03 — blocking |
| Turborepo CLI | `pnpm dev` | ✗ global | — | via `pnpm exec turbo` / devDependency |
| `@nestjs/cli` | Scaffold API | ✗ global | — | `pnpm exec nest` in `apps/api` |
| ctx7 / slopcheck | Research tooling | ✗ | — | WebFetch + npm view used instead |

**Missing dependencies with no fallback:**
- Docker (if absent on a machine) blocks FOUND-03 verification.

**Missing dependencies with fallback:**
- Global `pnpm`/`turbo` — use Corepack + workspace devDependencies.

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | **None in repo** — recommend **Vitest 3.x** at root in Wave 0 [ASSUMED] |
| Config file | none — create `vitest.config.ts` at root in Wave 0 |
| Quick run command | `pnpm exec vitest run --passWithNoTests` [ASSUMED] until tests exist |
| Full suite command | same (monorepo smoke only in Phase 1) |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| FOUND-01 | Folders `apps/web`, `apps/api`, `packages/types` exist | unit/smoke | `pnpm exec vitest run tests/foundation/workspace-layout.test.ts` | ❌ Wave 0 |
| FOUND-01 | `turbo.json` defines `dev` → `@kramnik/types#build` | unit | `pnpm exec vitest run tests/foundation/turbo-config.test.ts` | ❌ Wave 0 |
| FOUND-02 | API `GET /health` returns ok | integration | `curl -sf http://localhost:3000/health` (manual/script in `scripts/verify-dev.sh`) | ❌ Wave 0 |
| FOUND-02 | Web dev server responds | smoke | `curl -sf -o /dev/null http://localhost:5173` | ❌ Wave 0 |
| FOUND-03 | Postgres container healthy | smoke | `docker compose ps --status running` + `docker compose exec -T postgres pg_isready` | ❌ Wave 0 |

**Interim (before Vitest):** PLAN should include a **manual verification checklist** in VERIFICATION.md: three commands from README succeed.

### Sampling Rate

- **Per task commit:** `pnpm --filter @kramnik/types build` when touching types; `pnpm lint` if configured
- **Per wave merge:** `pnpm build` (once all packages have `build` scripts)
- **Phase gate:** Manual or script: install → `db:up` → `dev` → curl health + web; Postgres `pg_isready`

### Wave 0 Gaps

- [ ] `vitest.config.ts` + `vitest` devDependency at root
- [ ] `tests/foundation/workspace-layout.test.ts` — FOUND-01 paths
- [ ] `tests/foundation/turbo-config.test.ts` — parses `turbo.json` for `dependsOn`
- [x] `scripts/verify-phase1.ps1` and `.sh` — planned in 01-03 Task 3; chains API health + postgres checks
- [ ] `.gitignore` — ensure `apps/api/.env` ignored

## Security Domain

### Applicable ASVS Categories (ASVS L1, local dev scaffold)

| ASVS Category | Applies | Standard Control |
|---------------|---------|------------------|
| V2 Authentication | no | Phase 6 |
| V3 Session Management | no | Phase 6 |
| V4 Access Control | no | Phase 6+ |
| V5 Input Validation | minimal | No user input endpoints yet; health/root return static JSON |
| V6 Cryptography | no | No secrets in repo; tutorial DB password documented as **dev-only** |

### Known Threat Patterns for Phase 1

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Committed secrets in `.env` | Information disclosure | `.env.example` only; gitignore `.env` |
| Overly permissive CORS | Spoofing / data theft (later) | `origin: 'http://localhost:5173'` only [CITED: docs.nestjs.com/security/cors] |
| Default Postgres credentials | Information disclosure (local) | Document “dev only”; never reuse in production |
| Dependency confusion on `@kramnik/types` | Tampering | `private: true`; `workspace:*` only — never publish |

## Sources

### Primary (HIGH confidence)

- [pnpm workspaces](https://pnpm.io/workspaces) — workspace layout, `workspace:` protocol
- [Turborepo configuring tasks](https://turborepo.dev/docs/crafting-your-repository/configuring-tasks) — `dependsOn`, `@pkg#task`, persistent tasks
- [Turborepo configuration reference](https://turborepo.dev/docs/reference/configuration) — `persistent`, `outputs`
- [Node.js Corepack](https://nodejs.org/api/corepack.html) — `packageManager` field
- [NestJS first steps](https://docs.nestjs.com/first-steps) — bootstrap, CLI
- [NestJS CORS](https://docs.nestjs.com/security/cors) — `enableCors({ origin })`
- [Vite getting started](https://vite.dev/guide) — project root, port 5173, monorepo note
- Codebase: root `package.json`, `vite.config.ts`, `eslint.config.js`, `src/App.tsx`
- `01-CONTEXT.md`, `REQUIREMENTS.md`, `ROADMAP.md`, `PROJECT.md`, `PITFALLS.md` §5

### Secondary (MEDIUM confidence)

- npm registry version queries (2026-05-18) for turbo, prettier, Nest, TypeScript
- Corepack activation on research machine (pnpm 9.15.9)

### Tertiary (LOW confidence)

- `postgres:16` image tag (not verified against Docker Hub in session)
- Nest CLI non-interactive flags (A3)

## Metadata

**Confidence breakdown:**
- Standard stack: **HIGH** — locked decisions + official docs + existing repo versions
- Architecture: **HIGH** — standard Turborepo/pnpm pattern; Turbo persistent-task rule verified
- Pitfalls: **HIGH** — PITFALLS §5 + brownfield audit of current root layout

**Research date:** 2026-05-18  
**Valid until:** 2026-06-18 (stable tooling); re-check Turborepo 2.x / pnpm 9 release notes if upgrading

---

## RESEARCH COMPLETE

**Phase:** 01 - Monorepo Foundation  
**Confidence:** HIGH

### Key Findings

- All workflow decisions are locked in `01-CONTEXT.md` — implement pnpm 9 + Turborepo + three workspace packages, not alternatives.
- `turbo dev` must use `dependsOn: ["@kramnik/types#build"]` (non-persistent build before persistent dev), not `^dev`.
- Brownfield move: relocate entire Vite app tree to `apps/web`, strip demo UI, delete root npm lockfile and duplicate files.
- Postgres stays outside `turbo dev`; document `pnpm db:up` → `pnpm dev` and `DATABASE_URL` in `apps/api/.env.example`.
- No test framework exists — Wave 0 should add Vitest structure tests and/or curl/docker smoke scripts for Nyquist.

### File Created

`.planning/phases/KRAM-01-monorepo-foundation/01-RESEARCH.md`

### Confidence Assessment

| Area | Level | Reason |
|------|-------|--------|
| Standard Stack | HIGH | Locked CONTEXT + registry versions + official docs |
| Architecture | HIGH | Turbo/pnpm patterns cited; codebase audited |
| Pitfalls | HIGH | PITFALLS §5 + migration inventory completed |

### Open Questions (RESOLVED)

- `@kramnik/web` / `@kramnik/api` — locked in plans 01-01 and 01-02.
- Nest CLI — `nest new` with `--directory apps/api` + manual fallback documented in 01-02.

### Ready for Planning

Research complete. Plans 01-01, 01-02, 01-03 created and verified.

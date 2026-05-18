# Phase 1: Monorepo Foundation - Context

**Gathered:** 2026-05-18
**Status:** Ready for planning

<domain>
## Phase Boundary

Establish the Turborepo monorepo layout and local dev environment: move the existing Vite React app to `apps/web`, scaffold a NestJS shell in `apps/api`, add an empty `packages/types` workspace package, and run PostgreSQL via Docker Compose. Phase 1 does not implement Prisma, auth, catalog, or business features — only workspace structure, dev orchestration, health endpoints, and documented local setup (FOUND-01, FOUND-02, FOUND-03).

</domain>

<decisions>
## Implementation Decisions

### Package manager & workspace
- **D-01:** Use **pnpm workspaces** as the sole package manager from Phase 1 onward.
- **D-02:** **Remove `package-lock.json`** and generate `pnpm-lock.yaml` (clean break from npm).
- **D-03:** Pin pnpm via **Corepack** (`packageManager` field in root `package.json`, e.g. `pnpm@9.x`).
- **D-04:** Use **default pnpm install layout** (no `shamefully-hoist` unless a tool breaks without it).

### `packages/types` in Phase 1
- **D-05:** Create **`@kramnik/types`** as an empty stub in Phase 1 (satisfies FOUND-01 folder layout early).
- **D-06:** Include a **minimal `tsc` build** for `packages/types` in the Turbo pipeline from Phase 1.
- **D-07:** **`turbo dev` depends on `types#build`** so `dist/` exists before web/api dev start.

### Local dev workflow
- **D-08:** Primary dev command: **`pnpm dev` → `turbo dev`** (parallel web + API only).
- **D-09:** **Postgres is not started by `turbo dev`** — document `pnpm db:up` (or equivalent) as a manual prerequisite.
- **D-10:** Default ports: **web `5173`**, **API `3000`**.
- **D-11:** **`DATABASE_URL` and API secrets in `apps/api/.env`** (with `apps/api/.env.example`); web env files deferred until needed.
- **D-12:** Enable **CORS on Nest for `http://localhost:5173`** in Phase 1 (ready before catalog calls API).

### PostgreSQL (Docker)
- **D-13:** Start DB via **manual `pnpm db:up`** (`docker compose up -d`); document in README as prerequisite to API work in Phase 2+.
- **D-14:** Credentials: **user/password `postgres`**, database **`shop_dev`** (tutorial-style defaults).
- **D-15:** **`docker-compose.yml` at repo root**; host port **`5432:5432`** (document port conflicts).

### Moving `apps/web`
- **D-16:** **Remove Vite starter demo UI** — replace with a minimal shell (e.g. “Kramnik Shop” heading, empty main).
- **D-17:** **Remove unused demo assets** (hero, react/vite logos under `src/assets`).
- **D-18:** Use **early feature-oriented layout**: `src/app/` + `src/shared/` placeholders (full `features/*` in Phase 5).
- **D-19:** Browser title / `index.html`: **“Kramnik Shop”**.

### Shared tooling & API surface
- **D-20:** **Root `eslint.config.js`** extended by apps (shared rules + per-app overrides).
- **D-21:** **Root `tsconfig.base.json`** extended by apps and packages.
- **D-22:** Add **Prettier** at root with format script (coexist with ESLint).
- **D-23:** Nest exposes **`GET /health`** (JSON `{ status: "ok" }` or similar) **and `GET /`** (welcome message).

### Claude's Discretion
- Exact `packageManager` patch version for pnpm (use current stable 9.x).
- Nest welcome message copy on `GET /`.
- Minimal shell component structure under `src/app/` until Phase 5.
- Prettier/ESLint integration details (e.g. `eslint-config-prettier`) if conflicts arise.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements & roadmap
- `.planning/ROADMAP.md` — Phase 1 goal, success criteria, three plans (01-01..01-03)
- `.planning/REQUIREMENTS.md` — FOUND-01, FOUND-02, FOUND-03
- `.planning/PROJECT.md` — Stack constraints, brownfield note, Angular→React mapping for docs

### Research (stack & pitfalls)
- `.planning/research/STACK.md` — Turborepo + pnpm layout, workspace folders, dev tooling
- `.planning/research/ARCHITECTURE.md` — Target `apps/web` feature layout (placeholders only in Phase 1)
- `.planning/research/PITFALLS.md` — §5 monorepo migration / Vite root breakage prevention

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Root **Vite 8 + React 19 + Tailwind 4** app (`vite.config.ts`, `@tailwindcss/vite`, `src/index.css`) — migrate wholesale into `apps/web`, then strip demo content per D-16–D-17.
- Root **`eslint.config.js`** and **`tsconfig.app.json` / `tsconfig.node.json`** — basis for root shared configs (D-20–D-21).

### Established Patterns
- **Brownfield migration:** no greenfield web app; move then delete starter (PITFALLS §5).
- **Learning monorepo:** Turborepo over Nx; sequential phases; document commands from repo root (PROJECT.md).

### Integration Points
- `turbo.json` pipelines: `dev`, `build`, `lint`; `dev` runs `web` + `api` with `types#build` first.
- `apps/api` reads `apps/api/.env` for future `DATABASE_URL` (Phase 2 Prisma).
- CORS allows Vite origin before Phase 5 catalog.

</code_context>

<specifics>
## Specific Ideas

- Developer has **Angular background** — README/plan notes may map `turbo dev` to “run multiple projects like `ng serve` + API”.
- Prefer **documented, copy-paste dev flow**: `pnpm install` → `pnpm db:up` → `pnpm dev`.
- Phase 1 should feel like a **clean shop shell**, not the Vite marketing page.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 01-Monorepo Foundation*
*Context gathered: 2026-05-18*

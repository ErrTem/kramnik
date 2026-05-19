# Stack Research: Learning E-Commerce Monorepo

**Researched:** 2026-05-18  
**Confidence:** HIGH (aligned with user-specified stack and current ecosystem norms)

## Recommended Stack

### Monorepo

| Tool | Version guidance | Purpose |
|------|------------------|---------|
| **Turborepo** | Latest stable | Task orchestration, `dev`/`build` pipelines across apps/packages |
| **pnpm** | **11.1.3** (repo pin via Corepack) | Fast workspace installs; strict dependency hoisting for monorepos |

**Not Nx for v1:** Nx is powerful but adds generators, plugins, and mental overhead. Turborepo + explicit folder structure is enough for a learning project.

**Workspace layout:**

```
apps/
  web/          # Vite + React
  api/          # NestJS
packages/
  types/        # Shared DTOs derived from Prisma types
  database/     # Optional: prisma schema + client export (or keep in api)
```

### Frontend (`apps/web`)

| Package | Purpose |
|---------|---------|
| React 19 + Vite 8 | UI (already in repo root — migrate into `apps/web`) |
| TypeScript 6 | Shared language |
| Tailwind CSS 4 | Utility-first styling (`@tailwindcss/vite`) |
| **Zustand** | Cart, auth session snapshot, UI toggles |
| **TanStack Query v5** | Products, orders, mutations, cache invalidation |
| **React Router v7** | Client routing (listing, detail, cart, checkout, admin) |
| `zod` + `@hookform/resolvers` | Form validation (checkout, auth forms) — minimal, justified |

**Do not use:** Redux, MobX, class components, RxJS on the client (Angular skill transfers via Query + hooks).

### Backend (`apps/api`)

| Package | Purpose |
|---------|---------|
| NestJS 11 | Modules, controllers, services, DTOs (Angular-like structure) |
| `@nestjs/jwt` + `@nestjs/passport` | JWT auth |
| `class-validator` + `class-transformer` | DTO validation at boundary |
| Prisma **7.8** + `@prisma/adapter-pg` | ORM, migrations, generated client (`prisma.config.ts` in `apps/api`) |
| PostgreSQL 16+ | Database (Docker Compose for local dev) |

### Types pipeline (`packages/types`)

- Import types from `@prisma/client` (or re-export from `packages/database`)
- Export **DTO types** using `Omit`, `Pick`, `Partial` — e.g. `ProductPublic = Omit<Product, 'createdAt'> & { price: string }` if serializing decimals
- API returns DTO shapes; web imports from `@kramnik/types` — never duplicate interfaces by hand

### Dev tooling

| Tool | Purpose |
|------|---------|
| Docker Compose | Postgres only for local dev |
| ESLint + Prettier | Consistent TS across workspace |
| `turbo run dev` | Parallel web + api dev servers |

## Versions & Rationale

- **TanStack Query** replaces Angular `HttpClient` + async pipe pattern: declarative loading/error/cache states.
- **Zustand** replaces a global Angular service + `BehaviorSubject` for cart/auth UI state — minimal API surface.
- **Prisma** replaces TypeORM entities — schema file is the contract; migrations are first-class.

## What NOT to Use

| Avoid | Why |
|-------|-----|
| Redux | User constraint; unnecessary boilerplate for this scope |
| TypeORM / MikroORM entities | Duplicates Prisma; breaks single source of truth |
| GraphQL (v1) | REST is simpler to learn alongside Nest controllers |
| Microservices | Monolith API module is enough |
| Next.js | User chose Vite SPA; keeps focus on React client patterns |

## Environment

- Node 22 LTS
- `DATABASE_URL` in `apps/api/.env`
- `VITE_API_URL` in `apps/web/.env`

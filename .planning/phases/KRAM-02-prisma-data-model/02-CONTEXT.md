# Phase 2: Prisma Data Model - Context

**Gathered:** 2026-05-18
**Updated:** 2026-05-19 — Prisma version (D-33)
**Status:** Ready for planning

<domain>
## Phase Boundary

Define the PostgreSQL data model as the single source of truth: `schema.prisma` in `apps/api`, initial migration, and idempotent seed with sample products and dev users. Prove `prisma migrate dev` and seed on a fresh `shop_dev` database (DATA-01, DATA-02, DATA-03).

Phase 2 does **not** implement Nest `PrismaModule`, REST endpoints, `packages/types` DTOs, or auth guards — those are Phases 3–6. Phase 2 may add `bcrypt`/`bcryptjs` only for seed hashing.

</domain>

<decisions>
## Implementation Decisions

### Prisma version (implementer override)
- **D-33:** Use **latest Prisma 7** in `apps/api` — `prisma` and `@prisma/client` **`^7.8.0`** (matching lockfile at install time). **Supersedes** original planner/research pin **6.19.3**. If the CLI requires it, add **`prisma.config.ts`** and follow [Prisma 7 upgrade docs](https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7) (datasource URL, seed, `db:reset` behavior may differ from Prisma 6).

### Prisma layout & tooling
- **D-01:** `schema.prisma` and migrations live under **`apps/api/prisma/`** (not `packages/database`).
- **D-02:** **Root `pnpm` shortcuts** — `db:migrate`, `db:seed`, `db:studio`, `db:reset`, `db:generate` (names as planner chooses) delegate via **`pnpm --filter @kramnik/api exec prisma …`** so `apps/api/.env` loads.
- **D-03:** **`postinstall` in `apps/api`** runs `prisma generate`.
- **D-04:** **Single `schema.prisma`** file (no multi-file schema folder).
- **D-05:** Initial migration: **`prisma migrate dev --name init`** with full schema in one migration.
- **D-06:** Seed entrypoint: **`apps/api/prisma/seed.ts`** registered in `package.json` `prisma.seed`.
- **D-07:** Phase 3 preview: **`packages/types`** will depend on `@prisma/client` and generate from **`../../apps/api/prisma/schema.prisma`** (document path; implement in Phase 3).

### Product model
- **D-08:** **`Category` enum** on `Product` — values aligned with seed theme: `HOME`, `GARBAGE`, `SCRAPS`, `GARDEN_GNOMES` (exact casing per Prisma convention in plan).
- **D-09:** **Core fields:** `id`, `name`, `slug` (unique), `description`, `price`, `imageUrl`, `category`, `createdAt`, `updatedAt`. No `stock`, `sku`, `isActive`, or `deletedAt` in Phase 2.
- **D-10:** **`imageUrl`** uses **external placeholder URLs** in seed (no `apps/web/public` assets yet).
- **D-11:** All seeded products are **always visible** (no publish/soft-delete flags).

### Money & decimals
- **D-12:** Prices use **`Decimal @db.Decimal(10, 2)`** on `Product.price`, `OrderItem.unitPrice`, and `Order.total`.
- **D-13:** **USD only, implicit** — no `currency` column; UI formats as `$`.
- **D-14:** **`OrderItem.unitPrice`** snapshots price at purchase; **`Order.total`** stored on order (set at checkout in Phase 8; must match line items in transaction).
- **D-15:** Phase 3 must map `Decimal` to **`string` in public JSON/DTOs** (see PITFALLS §6) — note in plan/README; not implemented in Phase 2.

### User & roles
- **D-16:** **`Role` enum:** `CUSTOMER` | `ADMIN`.
- **D-17:** **`User`** includes **`passwordHash`** in Phase 2 (bcrypt in seed; auth logic Phase 6).
- **D-18:** **Minimal profile:** `email` (unique), `passwordHash`, `role`, timestamps — no `name` until a later phase needs it.
- **D-19:** Seed **admin + one demo customer** with fixed dev credentials (see Specifics).

### Order model
- **D-20:** **`OrderStatus` enum:** `PENDING`, `CONFIRMED`, `SHIPPED`, `CANCELLED`.
- **D-21:** **`Order.shippingAddress`** — single `String` (checkout form may concatenate lines).
- **D-22:** **`OrderItem`** includes **`productName` snapshot** plus `productId`, `quantity`, `unitPrice`.
- **D-23:** **No orders in seed** — orders created in Phase 8 checkout only.
- **D-24:** Relations: `User` 1—* `Order`; `Order` 1—* `OrderItem`; `Product` 1—* `OrderItem` (onDelete behavior: planner picks `Restrict` or `SetNull` for product delete vs learning goals — prefer **Restrict** on `productId` if admin must not delete ordered products, or document cascade rules explicitly in plan).

### Seed content
- **D-25:** Seed **~12 products**, spread across all four categories.
- **D-26:** **Themed catalog copy** — playful shop around home, garbage, scraps, and garden gnomes (real enough names/descriptions for filters and detail pages).
- **D-27:** **Idempotent seed:** upsert users by **`email`**, products by **`slug`**.
- **D-28:** **Dev credentials (local only):** `admin@kramnik.local` / `Admin123!`, `customer@kramnik.local` / `Customer123!` — document in README with security warning (tutorial passwords, never production).

### Dev workflow & verification
- **D-29:** Extend root **README Local development** with: `db:up` → copy `.env` → `db:migrate` → `db:seed` → `dev`; optional `db:studio`; dev credentials section.
- **D-30:** **`pnpm db:reset`** → `prisma migrate reset` (reapply migrations + seed).
- **D-31:** **`bcrypt` or `bcryptjs`** as **`apps/api` dependency** (seed now, auth Phase 6).
- **D-32:** Add **`scripts/verify-phase2.sh`** and **`scripts/verify-phase2.ps1`** — smoke-check DB reachable, migrations applied, product count ≥ 12, admin user exists (pattern match Phase 1 verify scripts).

### Claude's Discretion
- `bcrypt` vs `bcryptjs` (prefer `bcryptjs` on Windows if native module friction).
- Exact product seed list (names/slugs/prices) within theme and category distribution.
- `onDelete` / `onUpdate` relation rules where not specified above.
- Root script names if `db:migrate` vs `prisma:migrate` — keep consistent with Phase 1 `db:up` / `db:down` naming.
- Whether `verify-phase2` uses `prisma` CLI JSON or simple SQL/count via a one-off script.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements & roadmap
- `.planning/ROADMAP.md` — Phase 2 goal, success criteria, plans 02-01 / 02-02
- `.planning/REQUIREMENTS.md` — DATA-01, DATA-02, DATA-03
- `.planning/PROJECT.md` — Schema-first pipeline, Prisma-only types, out-of-scope auth/payments

### Research
- `.planning/research/STACK.md` — originally Prisma 6; **Phase 2 implementation uses Prisma 7 per D-33**; api-local schema (D-01)
- `.planning/research/ARCHITECTURE.md` — Entity relations, checkout data flow, type safety chain
- `.planning/research/PITFALLS.md` — §1 duplicate types (Phase 3), §6 Decimal JSON serialization (D-15), §7 admin seed user

### Prior phase context
- `.planning/phases/KRAM-01-monorepo-foundation/01-CONTEXT.md` — `DATABASE_URL`, Docker `shop_dev`, `apps/api/.env`, no Prisma in Phase 1
- `apps/api/.env.example` — `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/shop_dev`
- `docker-compose.yml` — Postgres 16, tutorial credentials

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **`apps/api/.env.example`** — `DATABASE_URL` already matches Docker Compose (Phase 1).
- **Root `pnpm db:up` / `db:down`** — Postgres running before migrate/seed.
- **`scripts/verify-postgres.*`**, **`verify-phase1.*`** — pattern for Phase 2 gate scripts.

### Established Patterns
- **Secrets in `apps/api/.env`** (gitignored); examples only in `.env.example`.
- **Root-orchestrated dev commands** — same as `db:up`, extend with `db:migrate` / `db:seed` / `db:reset`.
- **No Prisma in repo yet** — greenfield schema; `@kramnik/types` remains stub until Phase 3.

### Integration Points
- Phase 4+ will add **`PrismaModule` / `PrismaService`** in Nest reading same `DATABASE_URL`.
- Phase 3 **`packages/types`** imports generated client from shared schema path (D-07).
- Phase 6 auth validates against **`passwordHash`** seeded in Phase 2.

</code_context>

<specifics>
## Specific Ideas

- **Seed tone:** Absurdist junk-shop energy — home clutter, garbage, scraps, garden gnomes (user’s words: “some shit about home, garbage, scraps, garden gnomes”).
- **Dev logins:** `admin@kramnik.local` / `Admin123!`, `customer@kramnik.local` / `Customer123!` — README must label **dev only** like Postgres tutorial creds in Phase 1.
- **Angular learner:** Plans may note Prisma schema ≈ TypeORM entities file, migrations ≈ EF migrations, seed ≈ `DbInitializer`.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 02-Prisma Data Model*
*Context gathered: 2026-05-18*

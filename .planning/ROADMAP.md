# Roadmap: Kramnik Shop

## Overview

Build a learning e-commerce store in nine fine-grained vertical phases: monorepo and database first, then the type pipeline and read-only API, then React catalog with TanStack Query, then auth, cart, checkout, and admin. Each phase delivers one primary concept so it can be understood fully before continuing. Angular experience is leveraged via mapping notes in discuss/plan phases.

## Phases

- [x] **Phase 1: Monorepo Foundation** — Turborepo workspace, move Vite app to `apps/web`, NestJS shell, Docker Postgres (completed 2026-05-18)
- [ ] **Phase 2: Prisma Data Model** — Schema, migrations, seed data
- [x] **Phase 3: Shared Types Pipeline** — `packages/types` DTOs from Prisma
- [ ] **Phase 4: Products API** — NestJS products module and public REST reads
- [ ] **Phase 5: Catalog UI** — React shell, routing, list/filter/detail with TanStack Query
- [ ] **Phase 6: Authentication** — JWT register/login on API and web
- [ ] **Phase 7: Shopping Cart** — Zustand cart store and UI
- [ ] **Phase 8: Checkout & Orders** — Place order, confirmation, order history
- [ ] **Phase 9: Admin Panel** — Admin product CRUD and order management

## Phase Details

### Phase 1: Monorepo Foundation

**Goal:** Establish the monorepo layout and local dev environment so later phases have a stable workspace.
**Mode:** mvp
**Depends on:** Nothing (first phase)
**Requirements:** FOUND-01, FOUND-02, FOUND-03
**UI hint:** no
**Success Criteria** (what must be TRUE):

  1. Developer can run `pnpm install` and `turbo dev` (or documented equivalent) from repo root
  2. `apps/web` serves the existing Vite React app; `apps/api` starts a NestJS hello/health endpoint
  3. PostgreSQL is reachable via Docker Compose with connection string documented

**Plans:** 3/3 plans complete

Plans:
**Wave 1**

- [x] 01-01: Initialize Turborepo + pnpm workspaces; move root Vite app to `apps/web`

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 01-02: Scaffold `apps/api` NestJS app and wire turbo `dev` pipeline

**Wave 3** *(blocked on Wave 2 completion)*

- [x] 01-03: Add Docker Compose for Postgres and root README dev instructions

### Phase 2: Prisma Data Model

**Goal:** Define the database schema as the single source of truth and prove migrations + seed work.
**Mode:** mvp
**Depends on:** Phase 1
**Requirements:** DATA-01, DATA-02, DATA-03
**UI hint:** no
**Success Criteria**:

  1. `schema.prisma` includes User (with role), Product, Order, OrderItem with sensible relations
  2. `prisma migrate dev` succeeds on empty database
  3. Seed creates multiple products and at least one admin user

**Plans:** 2 plans

Plans:

**Wave 1**

- [ ] 02-01-PLAN.md — Prisma 6.19.3 schema, root db:* scripts, Wave 0 schema tests, [BLOCKING] init migration (DATA-01, DATA-02)

**Wave 2** *(blocked on Wave 1 completion)*

- [ ] 02-02-PLAN.md — bcryptjs idempotent seed, README db workflow, verify-phase2 scripts and tests (DATA-03)

### Phase 3: Shared Types Pipeline

**Goal:** Export Prisma-derived DTO types for API and web without manual duplication.
**Mode:** mvp
**Depends on:** Phase 2
**Requirements:** TYPE-01, TYPE-02
**UI hint:** no
**Success Criteria**:

  1. `packages/types` builds and exports public DTOs (e.g. `ProductPublic`, `UserPublic`)
  2. API and web import from `@kramnik/types` (or chosen package name) in at least one file each
  3. Documented rule: no hand-written Product/User interfaces in apps

**Plans:** 2 plans

Plans:

- [x] 03-01: Create `packages/types` with Prisma utility-type DTOs and build config
- [x] 03-02: Wire workspace dependencies and verify typecheck across apps

### Phase 4: Products API

**Goal:** Deliver read-only product REST endpoints with Nest module structure and validation patterns.
**Mode:** mvp
**Depends on:** Phase 3
**Requirements:** (none — prepares for Phase 5; public read endpoints only)
**UI hint:** no
**Success Criteria**:

  1. `GET /products` supports listing with optional filter query params
  2. `GET /products/:id` returns product detail or 404
  3. Responses use DTO shapes aligned with `packages/types`

**Plans:** 2 plans

Plans:

- [ ] 04-01: Implement ProductsModule (controller, service, DTOs) with PrismaService
- [ ] 04-02: Add filtering query support and integration test or manual API checklist

### Phase 5: Catalog UI

**Goal:** Learn React + Tailwind + TanStack Query by building the storefront catalog against the live API.
**Mode:** mvp
**Depends on:** Phase 4
**Requirements:** CAT-01, CAT-02, CAT-03, CAT-04, LEARN-01, LEARN-02, LEARN-03
**UI hint:** yes
**Success Criteria**:

  1. User can browse products in a responsive grid/list
  2. User can apply filters and see updated results via Query cache keys
  3. User can view product detail and see loading/error states

**Plans:** 3 plans

Plans:

- [ ] 05-01: App shell, React Router routes, Tailwind layout, QueryClient provider
- [ ] 05-02: Product list page with `useQuery` and filter UI
- [ ] 05-03: Product detail page and shared API client module

### Phase 6: Authentication

**Goal:** Implement JWT auth end-to-end (Nest guards + React login/register + Zustand session).
**Mode:** mvp
**Depends on:** Phase 5
**Requirements:** AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05
**UI hint:** yes
**Success Criteria**:

  1. New user can register and log in with email/password
  2. Authenticated requests include JWT; protected API routes return 401 without token
  3. User can log out; protected web routes redirect unauthenticated users

**Plans:** 3 plans

Plans:

- [ ] 06-01: AuthModule on API (register, login, JwtStrategy, guards)
- [ ] 06-02: Web auth forms and Zustand auth store with API client interceptor
- [ ] 06-03: Protected route wrapper and logout flow

### Phase 7: Shopping Cart

**Goal:** Practice Zustand for client-only cart state separate from TanStack Query server state.
**Mode:** mvp
**Depends on:** Phase 6
**Requirements:** CART-01, CART-02, CART-03
**UI hint:** yes
**Success Criteria**:

  1. User can add/update/remove items from product detail and listing
  2. Cart persists across refresh
  3. Cart badge/summary visible globally

**Plans:** 2 plans

Plans:

- [ ] 07-01: Zustand cart store with persistence middleware
- [ ] 07-02: Cart drawer/page UI integrated with catalog pages

### Phase 8: Checkout & Orders

**Goal:** Complete the purchase flow with mock payment and order history using mutations and protected API.
**Mode:** mvp
**Depends on:** Phase 7
**Requirements:** ORD-01, ORD-02, ORD-03, ORD-04
**UI hint:** yes
**Success Criteria**:

  1. Logged-in user can checkout with cart review and place order via `POST /orders`
  2. Order is persisted with line items; user sees confirmation page
  3. User can view their order history list

**Plans:** 3 plans

Plans:

- [ ] 08-01: OrdersModule API (create order transaction, list user orders)
- [ ] 08-02: Checkout page and `useMutation` flow
- [ ] 08-03: Order confirmation and order history pages

### Phase 9: Admin Panel

**Goal:** Admin-only management for products and orders with role guards on API and web.
**Mode:** mvp
**Depends on:** Phase 8
**Requirements:** ADM-01, ADM-02, ADM-03
**UI hint:** yes
**Success Criteria**:

  1. Non-admin users cannot access admin UI or admin API routes
  2. Admin can CRUD products and see changes reflected in storefront catalog
  3. Admin can view all orders with customer and line-item summary

**Plans:** 3 plans

Plans:

- [ ] 09-01: AdminModule API with RolesGuard and product CRUD
- [ ] 09-02: Admin product management UI with Query mutations
- [ ] 09-03: Admin orders list UI

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → … → 9

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Monorepo Foundation | 3/3 | Complete   | 2026-05-18 |
| 2. Prisma Data Model | 0/2 | Not started | - |
| 3. Shared Types Pipeline | 0/2 | Not started | - |
| 4. Products API | 0/2 | Not started | - |
| 5. Catalog UI | 0/3 | Not started | - |
| 6. Authentication | 0/3 | Not started | - |
| 7. Shopping Cart | 0/2 | Not started | - |
| 8. Checkout & Orders | 0/3 | Not started | - |
| 9. Admin Panel | 0/3 | Not started | - |

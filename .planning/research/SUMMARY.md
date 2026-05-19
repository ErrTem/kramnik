# Project Research Summary

**Project:** Kramnik Shop  
**Domain:** Learning e-commerce (B2C storefront + basic admin)  
**Researched:** 2026-05-18  
**Confidence:** HIGH

## Executive Summary

This project is a **schema-first, monorepo e-commerce tutorial** for a developer with strong Angular background learning React and NestJS. The winning architecture is a Turborepo workspace with `apps/web` (Vite/React/Tailwind), `apps/api` (NestJS/Prisma/JWT), and `packages/types` bridging Prisma generated types to the UI via utility-type DTOs.

Server state belongs in **TanStack Query**; ephemeral/global client state (cart, auth snapshot) belongs in **Zustand**. Redux and manual entity classes are explicitly out of scope. Checkout should simulate order placement without a payment provider to keep focus on API design and type flow.

Main risks are type duplication, mixing server state into Zustand, and phases that are too large. Fine-grained vertical MVP phases address the learning constraint.

## Key Findings

### Recommended Stack

Turborepo + **pnpm 11.1.3**, React 19/Vite 8, Tailwind 4, Zustand, TanStack Query v5, NestJS 11, **Prisma 7.8** (+ `@prisma/adapter-pg`), PostgreSQL 16 via Docker. Shared types package is non-negotiable for the core value proposition. Phase 2 implemented schema, migrations, and seed under `apps/api/prisma/`.

### Expected Features (v1)

**Must have:** product list/filter/detail, register/login, cart, mock checkout/orders, admin product CRUD, admin order list.

**Defer:** OAuth, email verification, Stripe, reviews, wishlists.

### Architecture Approach

Nest feature modules mirror Angular modules; React uses feature folders and hooks. Build order: monorepo → schema → read API → types → catalog UI → auth → cart → orders → admin.

### Critical Pitfalls

1. Duplicate TypeScript interfaces — derive from Prisma only  
2. Server data in Zustand — use Query  
3. Insecure or missing admin guards  
4. Oversized phases — keep one learning goal per phase  

## Implications for Roadmap

### Phase 1: Monorepo Foundation
**Rationale:** Must exist before splitting starter code  
**Delivers:** Turborepo, `apps/web`, `apps/api` shells, dev scripts  
**Avoids:** Pitfall #5 (broken Vite root)

### Phase 2: Data Model & Prisma
**Rationale:** Schema is source of truth for types  
**Delivers:** `schema.prisma`, migrate, seed  
**Implements:** User, Product, Order models

### Phase 3: Shared Types Package
**Rationale:** Core value — type pipeline  
**Delivers:** `packages/types` with DTO utilities  
**Avoids:** Pitfall #1, #6

### Phase 4: Nest API & Products Read
**Rationale:** First vertical slice backend  
**Delivers:** Products module, public GET endpoints

### Phase 5: Storefront Shell & Catalog UI
**Rationale:** Learn React/Query/Tailwind on real data  
**Delivers:** Layout, routing, list + detail + filters

### Phase 6: Authentication
**Rationale:** Required before checkout and admin  
**Delivers:** JWT register/login, guards, web auth flow

### Phase 7: Shopping Cart
**Rationale:** Isolated Zustand learning  
**Delivers:** Cart store, persistence, UI

### Phase 8: Checkout & Orders
**Rationale:** End-to-end transaction without Stripe  
**Delivers:** Order placement, confirmation, order history

### Phase 9: Admin Panel
**Rationale:** Completes v1 feature set  
**Delivers:** Admin routes, product CRUD, order management

### Phase Ordering Rationale

Dependencies flow data → API → UI → auth → cart → orders → admin. Types package immediately follows schema so later phases never hand-write models.

### Research Flags

- **Phase 3:** Prisma Decimal serialization — document DTO mapping  
- **Phase 6:** JWT storage tradeoffs — discuss httpOnly vs memory  
- **Phases 5, 7, 9:** UI polish — optional `/gsd-ui-phase`  

Phases with standard patterns (4, 8): Nest CRUD, REST mutations.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | User-specified + mainstream 2025/2026 choices |
| Features | HIGH | Standard e-commerce learning scope |
| Architecture | HIGH | Well-trodden monorepo pattern |
| Pitfalls | HIGH | Common learning-project mistakes |

**Overall confidence:** HIGH

## Gaps to Address

- **Payment:** Confirm mock-only at discuss-phase 8  
- **Admin bootstrap:** Seed `ADMIN` user vs self-promotion — decide in Phase 9 planning  
- **Prisma package location:** `packages/database` vs `apps/api/prisma` — decide in Phase 2 planning  

---
*Research completed: 2026-05-18*  
*Ready for roadmap: yes*

# Kramnik Shop

## What This Is

A full-stack e-commerce web store built as a **learning project** to practice React, Tailwind CSS, NestJS, Prisma, and modern client/server state patterns. It is not intended for production launch. The storefront lets visitors browse products, authenticate, manage a cart, check out, and place orders; admins can manage products and orders through a basic panel.

The developer has **3 years of Angular experience** (components, services, DI, RxJS, TypeScript). Explanations and phase notes should map React/Nest concepts to Angular equivalents where helpful.

## Core Value

End-to-end type safety and clear separation of concerns: **schema.prisma → Prisma client → shared DTO types → NestJS API → TanStack Query / Zustand UI** — so each layer is understandable before moving on.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Monorepo with React (Vite) frontend, NestJS API, and shared types package
- [ ] Product catalog (list, filter, detail)
- [ ] User registration and JWT login
- [ ] Shopping cart (Zustand)
- [ ] Checkout and order placement (no real payment processor)
- [ ] Basic admin panel (products and orders)
- [ ] Prisma schema-first data model and migrations
- [ ] TanStack Query for server state; Zustand for global client state

### Out of Scope

- **Redux** — Zustand + TanStack Query are the chosen state stack
- **Class components** — functional components and hooks only
- **Manual TypeORM/entity classes** — Prisma generated types are the DB source of truth
- **Real payment integration (Stripe, etc.)** — learning focus is order flow, not PCI/payments
- **OAuth / social login / email verification** — email/password JWT only for v1
- **Production-grade ops** — no multi-region, CDN, or advanced observability in v1
- **Mobile native apps** — responsive web only

## Context

**Brownfield note:** Repository currently contains a default Vite + React 19 + Tailwind 4 starter at the root. This will be restructured into a monorepo; the starter is not treated as application domain code.

**Background:** Learning-oriented build. Priorities are small, digestible phases, minimal justified dependencies, and patterns that transfer from Angular (modules → Nest modules, services → Nest services + React hooks, RxJS streams → TanStack Query + Zustand).

**Angular → React mental model (for docs and discuss-phase):**

| Angular | This project |
|---------|----------------|
| `@Component` class + template | Function component + JSX |
| `@Injectable()` service | Custom hook and/or Zustand store |
| `HttpClient` + async pipe | TanStack Query (`useQuery`, `useMutation`) |
| NgModule | Feature folders; NestJS keeps explicit modules |
| RxJS Observables | Query cache + Zustand sync; avoid RxJS on frontend unless needed |
| Guards / interceptors | React protected routes + fetch client; Nest `JwtAuthGuard` |
| Pipes | Utility functions / small formatter helpers |

## Constraints

- **Tech**: React (Vite), TypeScript, Tailwind CSS, Zustand, TanStack Query, NestJS, Prisma, PostgreSQL — fixed stack for learning goals
- **Structure**: Monorepo (Turborepo preferred over Nx for lighter learning curve)
- **Types**: Single pipeline — `schema.prisma` → generated client → `packages/types` (Omit/Pick/Partial DTOs) → frontend
- **Scope**: Clarity over production complexity; each phase fully understandable before the next
- **Dependencies**: Minimal and well-justified only

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Turborepo over Nx | Simpler config for a solo learning monorepo; user allowed either | — Pending |
| Zustand + TanStack Query (no Redux) | Matches learning goals; less boilerplate than Redux | — Pending |
| Prisma-only DB types (no manual entities) | Single source of truth; aligns with schema-first teaching | — Pending |
| Vertical MVP phases | User learns end-to-end slices; fine granularity | — Pending |
| Mock checkout (no Stripe) | Focus on API + UI order flow without payment compliance | — Pending |
| Sequential plan execution | Easier to absorb one phase at a time while learning | — Pending |
| Interactive GSD mode | Confirm at gates while learning the workflow | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-18 after initialization*

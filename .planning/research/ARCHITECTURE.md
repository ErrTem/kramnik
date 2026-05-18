# Architecture Research: Learning E-Commerce Monorepo

**Researched:** 2026-05-18  
**Confidence:** HIGH

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│  apps/web (React + Vite)                                     │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────┐ │
│  │ React Router│  │ TanStack     │  │ Zustand (cart, auth   │ │
│  │ pages/layout│  │ Query        │  │  UI snapshot)         │ │
│  └──────┬──────┘  └──────┬───────┘  └──────────┬──────────┘ │
│         │                 │ fetch + JWT          │          │
└─────────┼─────────────────┼──────────────────────┼──────────┘
          │                 ▼                      │
          │         ┌───────────────────┐          │
          │         │ apps/api (NestJS)  │          │
          │         │ Modules:           │          │
          │         │  Products          │          │
          │         │  Auth              │          │
          │         │  Orders            │          │
          │         │  Admin             │          │
          │         └─────────┬─────────┘          │
          │                   │ Prisma Client       │
          │                   ▼                     │
          │         ┌───────────────────┐          │
          └────────►│ PostgreSQL         │◄─────────┘
                    └───────────────────┘
          types: packages/types ← Prisma generated types
```

## Component Boundaries

### `packages/types` (or `packages/database` + types)

- Owns Prisma schema **or** imports from generated client
- Exports DTO types consumed by API and web
- No runtime logic — types only

### `apps/api`

| Nest Module | Responsibility | Angular analogue |
|-------------|----------------|------------------|
| `ProductsModule` | CRUD + public list/filter/detail | Feature module + service |
| `AuthModule` | Register, login, JWT issue/validate | Auth module + guard |
| `OrdersModule` | Create order from cart, list user orders | Feature module |
| `AdminModule` | Admin-only product/order endpoints | Lazy admin module |
| `PrismaModule` | Global PrismaService | `providedIn: 'root'` DB service |

**Guards:** `JwtAuthGuard`, `RolesGuard` (`ADMIN` role on User)

### `apps/web`

| Area | Responsibility |
|------|----------------|
| `features/catalog` | List, filters, ProductDetail |
| `features/auth` | Login, Register forms |
| `features/cart` | Cart drawer/page, Zustand |
| `features/checkout` | Checkout steps, order mutation |
| `features/admin` | Admin layout, product form, order table |
| `shared/api` | `fetch` client with auth header, QueryClient provider |
| `shared/ui` | Button, Input, Layout shell (Tailwind) |

## Data Flow

1. **Read products:** `useQuery(['products', filters])` → `GET /products` → Prisma `findMany`
2. **Add to cart:** Zustand action only (client) until checkout
3. **Checkout:** `useMutation` → `POST /orders` with line items + JWT → Prisma transaction
4. **Admin update product:** `useMutation` → `PATCH /admin/products/:id` → invalidate `['products']`

## Suggested Build Order

1. Monorepo scaffold + empty apps
2. Prisma schema + migrate + seed
3. Nest bootstrap + Products read API
4. Shared types package wired to Prisma
5. Web shell + product list (Query)
6. Auth (API + web)
7. Cart (Zustand)
8. Orders/checkout
9. Admin panel

## Type Safety Chain

```
schema.prisma
  → prisma generate → @prisma/client
  → packages/types (Pick/Omit DTOs)
  → Nest DTO classes implement/align with types
  → API JSON responses typed
  → web imports @kramnik/types for props and Query generics
```

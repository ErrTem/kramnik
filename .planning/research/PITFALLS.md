# Pitfalls Research: Learning E-Commerce Stack

**Researched:** 2026-05-18  
**Confidence:** HIGH

## 1. Duplicating types instead of deriving from Prisma

**Warning signs:** `interface Product` in web, different fields in API DTO, drift on schema change.

**Prevention:** Only define types in `packages/types` using utility types from `@prisma/client`. CI check: no `interface Product` in apps.

**Phase:** 2 (types package) and ongoing

## 2. Putting server state in Zustand

**Warning signs:** `useProductStore`, manual `fetch` in store, stale cache after admin edit.

**Prevention:** TanStack Query owns products/orders; Zustand only for cart, auth token pointer, UI.

**Phase:** 6–7 (catalog + cart)

## 3. NestJS module spaghetti

**Warning signs:** Controllers calling Prisma directly, circular imports, god `AppModule`.

**Prevention:** Controller → Service → PrismaService per module; one direction imports.

**Phase:** 3–4 (API foundation)

## 4. JWT stored insecurely

**Warning signs:** JWT in plain localStorage without XSS awareness, no refresh strategy documented.

**Prevention:** For learning: httpOnly cookie **or** memory + short-lived token with documented tradeoff; at minimum Zustand + `sessionStorage` with note in docs. Use `@nestjs/jwt` secret from env.

**Phase:** 7 (auth)

## 5. Monorepo migration breaks Vite root

**Warning signs:** Broken paths, duplicate `node_modules`, turbo cache issues.

**Prevention:** Phase 1 explicitly moves existing root app to `apps/web`; update README with `pnpm dev` from root.

**Phase:** 1

## 6. Prisma Decimal / Date JSON serialization

**Warning signs:** Frontend receives Decimal objects; price math breaks.

**Prevention:** Map to `string` or `number` in DTO layer in API responses; document in types package.

**Phase:** 2–3

## 7. Admin routes exposed without role guard

**Warning signs:** `PATCH /products` public.

**Prevention:** Separate `/admin/*` controllers with `RolesGuard('ADMIN')`; seed one admin user.

**Phase:** 10 (admin)

## 8. Over-scoping checkout

**Warning signs:** Stripe integration, tax engines, shipping APIs in v1.

**Prevention:** Single-page checkout: cart snapshot → `POST /orders` → confirmation; payment status = `MOCK_PAID`.

**Phase:** 9

## 9. Learning fatigue from huge phases

**Warning signs:** Phase tries to ship catalog + auth + cart together.

**Prevention:** Fine granularity roadmap; one primary concept per phase (per user constraint).

**Phase:** Roadmap design

## 10. Angular habits on React

**Warning signs:** Class components, massive single components, `useEffect` for every data load.

**Prevention:** Custom hooks per feature; Query for data; composition over inheritance; discuss-phase notes map Angular concepts.

**Phase:** All frontend phases

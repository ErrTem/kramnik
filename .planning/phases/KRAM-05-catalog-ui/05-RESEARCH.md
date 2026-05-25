# Phase 5: Catalog UI — Research

**Researched:** 2026-05-25  
**Confidence:** HIGH (stack locked in PROJECT.md; API exists)

## Objective

What planners and executors need to implement the React catalog against `GET /products` and `GET /products/:id` with TanStack Query v5 and React Router v7.

## Stack choices (install in `apps/web`)

| Package | Version guidance | Role |
|---------|------------------|------|
| `react-router-dom` | v7.x (match STACK.md) | Routes, `Link`, `useParams`, `useSearchParams` |
| `@tanstack/react-query` | v5.x | `useQuery`, `QueryClient`, cache keys |
| `@tanstack/react-query-devtools` | v5.x (devDependency) | Devtools in dev only (D-18) |

Existing: React 19, Vite 8, Tailwind 4, `@kramnik/types`.

## API contract (already implemented)

- `GET /products?category=&q=&minPrice=&maxPrice=` → `ProductPublic[]`
- `GET /products/:id` → `ProductPublic` or 404
- `ProductPublic.price` is **string** (decimal); format with `Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })` after `parseFloat` for display only — no cart math in Phase 5

## TanStack Query patterns

```ts
// List — key must include filter object (D-11)
useQuery({
  queryKey: ['products', { category, q, minPrice, maxPrice }],
  queryFn: () => fetchProducts(params),
})

// Detail
useQuery({
  queryKey: ['products', id],
  queryFn: () => fetchProduct(id),
  enabled: !!id,
})
```

- Default `staleTime` OK for learning project (~30s optional)
- Errors: surface `error.message` + `refetch` button (D-17)
- No mutations in Phase 5

## React Router patterns

- `createBrowserRouter` or `BrowserRouter` + `Routes` — prefer **data router** (`createBrowserRouter`) for future loaders if needed
- `/` → `<Navigate to="/products" replace />`
- Layout route with `AppLayout` + `<Outlet />`
- 404 catch-all route

## URL-synced filters

- `useSearchParams` on list page: read on mount, write on filter change with `setSearchParams(..., { replace: true })`
- Omit empty params from URL
- Parse `category` against `Category` enum from `@kramnik/types`

## Folder layout (D-07)

```
apps/web/src/
  app/           AppLayout, providers
  features/catalog/
    ProductListPage.tsx
    ProductDetailPage.tsx
    ProductCard.tsx
    ProductFilters.tsx
    catalog.routes.tsx (optional)
  shared/api/
    client.ts      base URL, fetchJson
    products.ts    fetchProducts, fetchProduct
  shared/lib/
    formatPrice.ts
    categoryLabel.ts
```

## Angular mapping (for comments/README)

| Angular | This phase |
|---------|------------|
| `RouterModule` routes | `createBrowserRouter` / `Route` config |
| `HttpClient.get` | `fetch` + TanStack `useQuery` |
| `async` pipe | Query `isPending` / `isError` / `data` |
| `@Input()` product | props on `ProductCard` |

## Pitfalls

- **PITFALLS §6:** Do not use `Number(product.price)` for persistence — display formatting only
- **CORS:** Phase 1 enabled `localhost:5173` — ensure `VITE_API_URL` points to `http://3000`
- **XSS:** Render `description` as text nodes / JSX children — never `dangerouslySetInnerHTML` for seed HTML
- **Empty filters:** API returns all products when query empty — UI should still show grid

## Validation Architecture

| Property | Value |
|----------|-------|
| Framework | Vitest 4 (repo root `vitest.config.ts`) |
| Quick run | `pnpm test` |
| Full run | `pnpm test` + `pnpm --filter @kramnik/web build` |
| Wave 0 | Add `tests/web/` static or shallow render tests if valuable; manual UAT primary for UI |

**Automated targets (Wave 0 optional):**

- `formatPrice('12.50')` → `$12.50`
- `buildProductsQueryString({ category: 'HOME' })` includes `category=HOME`
- Type-only: web imports `ProductPublic` from `@kramnik/types`

**Manual UAT (primary):**

- `pnpm db:up && pnpm db:migrate && pnpm db:seed && pnpm dev`
- Browse grid, filter by category/search/price, open detail, see loading/error (stop API to test)

## Package Legitimacy Audit

| Package | Publisher | Notes |
|---------|-----------|-------|
| react-router-dom | Remix/React team | [ASSUMED] standard |
| @tanstack/react-query | TanStack | [ASSUMED] standard |

## RESEARCH COMPLETE

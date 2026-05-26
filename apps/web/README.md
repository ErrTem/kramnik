# @kramnik/web

Vite + React storefront for Kramnik Shop. The catalog uses **React Router** and TanStack **useQuery** against the Nest API.

## Development

From the repo root (builds `@kramnik/types`, then starts web and API):

```bash
pnpm dev
```

Web only:

```bash
pnpm --filter @kramnik/web dev
```

The API should be reachable at **http://localhost:3000** (via `pnpm dev` or `pnpm --filter @kramnik/api dev`). PostgreSQL must be running and seeded — see the root [README.md](../../README.md) (`pnpm db:up`, `pnpm db:migrate`, `pnpm db:seed`).

| App | URL |
|-----|-----|
| Web (Vite) | http://localhost:5173 |
| API (Nest) | http://localhost:3000 |

## Environment

Copy `.env.example` to `.env`:

```env
VITE_API_URL=http://localhost:3000
```

`VITE_*` variables are exposed to the browser. If `VITE_API_URL` is unset, the client defaults to **http://localhost:3000**. Restart the Vite dev server after changing `.env`.

## Angular → React (this app)

| Angular | React / this repo |
|---------|-------------------|
| `RouterModule`, `router-outlet` | **react-router-dom**: `createBrowserRouter`, `RouterProvider`, `Outlet` in `src/app/AppLayout.tsx` |
| `HttpClient.get()` + injectable service | `fetch` in `src/shared/api/client.ts` and `products.ts` |
| `async` pipe on observables | TanStack **useQuery** on catalog pages (server state) |
| NgModule per feature | `src/features/catalog/` |
| Global client state (cart, session) | Zustand in later phases — **not** for product lists |

**Server/async data:** use **useQuery** with a `queryKey` that includes filter params. Do not store product lists in Zustand or load catalog data with `useEffect` + manual `fetch` (see `.planning/research/PITFALLS.md`).

## Layout

- `src/app/` — shell: `providers.tsx`, `router.tsx`, `AppLayout.tsx`
- `src/features/catalog/` — product list and detail pages
- `src/shared/api/` — `fetchJson`, `fetchProducts`, `fetchProduct`
- `src/shared/lib/` — `formatPrice` for `ProductPublic.price` strings

## API

- `GET /products` — optional query: `category`, `q`, `minPrice`, `maxPrice`
- `GET /products/:id`

Response types: `@kramnik/types` (`ProductPublic`; `price` is a decimal **string** in JSON).

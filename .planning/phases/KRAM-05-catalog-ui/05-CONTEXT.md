# Phase 5: Catalog UI - Context

**Gathered:** 2026-05-25
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the storefront catalog against the live Products API: React app shell, React Router, TanStack Query provider, shared API client, product list with filters, and product detail with loading/error states (CAT-01, CAT-02, CAT-03, CAT-04, LEARN-01, LEARN-02, LEARN-03).

Phase 5 does **not** implement JWT auth, Zustand cart persistence, checkout, or admin UI — those are Phases 6–9. Add-to-cart on the detail page is a **visual placeholder** only until Phase 7.

</domain>

<decisions>
## Implementation Decisions

### Product grid layout (discussed)
- **D-01:** **Responsive card grid** on the list page — 1 column on mobile, 2 on tablet, 3–4 on desktop (Tailwind breakpoints).
- **D-02:** Each card shows **image, name, price**, plus **category as a small badge/tag** (no description on the card).
- **D-03:** Product images use a **fixed aspect-ratio box** (planner picks square or 4:3) with **`object-cover`** for consistent grid rhythm; handle broken/empty `imageUrl` with a neutral placeholder block.
- **D-04:** **Entire card is one navigation target** — wrap card in React Router `Link` to product detail (no separate “View” button on the card).

### App shell, routing & folders (planner discretion — not discussed)
- **D-05:** Add **`react-router-dom`** and **`@tanstack/react-query`** to `apps/web`; mount **`QueryClientProvider`** in `main.tsx` (or thin `app/providers.tsx`).
- **D-06:** Routes: **`/products`** (list + filters), **`/products/:id`** (detail); **`/` redirects to `/products`**; simple **404** route for unknown paths.
- **D-07:** Implement **`features/catalog`** (list, detail, filter UI) and **`shared/api`** (fetch client + query helpers) per `.planning/research/ARCHITECTURE.md`; keep **`src/app/`** for shell/layout/header.
- **D-08:** **API base URL** via `import.meta.env.VITE_API_URL` defaulting to **`http://localhost:3000`**; document in `apps/web/.env.example`.

### Filters & TanStack Query (planner discretion — not discussed)
- **D-09:** Filter UI as a **horizontal bar above the grid** (category select, search input, min/max price inputs) — not a sidebar.
- **D-10:** **Debounced search** (`q`) ~300ms; category and price filters apply on change/blur.
- **D-11:** **`useQuery` cache key** includes all active filter params: `['products', { category, q, minPrice, maxPrice }]` aligned with `ListProductsQueryDto`.
- **D-12:** **Sync filter state to URL search params** on `/products` so filtered lists are bookmarkable; parse on mount and update params when filters change.
- **D-13:** **No pagination in Phase 5** — render full result set from API (~12 seeded products); revisit if catalog grows in later phases.

### Product detail & add-to-cart placeholder (planner discretion — not discussed)
- **D-14:** Detail page shows **full description**, large image, formatted **USD price** from `price` string, category badge.
- **D-15:** **Add-to-cart button visible but disabled** with label like “Add to cart (coming soon)” and short helper text pointing to Phase 7 — satisfies CAT-03 UI affordance without Zustand cart.

### Loading, error & learning (planner discretion — not discussed)
- **D-16:** List and detail use **per-route loading UI** — skeleton cards on list, skeleton block on detail (not full-app spinner only).
- **D-17:** **Inline error message** with retry (`refetch`) on query failure; no global error boundary required in Phase 5.
- **D-18:** Enable **TanStack Query Devtools** in development only.
- **D-19:** **Angular mapping notes** in plan/README and brief code comments on Router vs `RouterModule`, `useQuery` vs `HttpClient` — not user-visible UI copy.

### Claude's Discretion
- Exact Tailwind breakpoints and gap/padding for the grid.
- Square vs 4:3 aspect ratio for card images (prefer **4:3** if undecided).
- Category badge colors/labels (human-readable enum labels).
- Shared UI primitives (`Button`, `Badge`) vs inline Tailwind on catalog pages only.
- Whether list page header includes shop title only or title + active filter summary.
- `fetch` wrapper error shape and whether to centralize `queryFn` in `shared/api/products.ts`.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements & roadmap
- `.planning/ROADMAP.md` — Phase 5 goal, success criteria, plans 05-01..05-03
- `.planning/REQUIREMENTS.md` — CAT-01..CAT-04, LEARN-01..LEARN-03
- `.planning/PROJECT.md` — Stack constraints, Angular→React mapping table, learning goals

### Research & architecture
- `.planning/research/ARCHITECTURE.md` — `features/catalog`, `shared/api`, Query data flow
- `.planning/research/STACK.md` — React, Vite, Tailwind, TanStack Query versions
- `.planning/research/PITFALLS.md` — §6 Decimal JSON (price as string in UI)

### Prior phase context
- `.planning/phases/KRAM-01-monorepo-foundation/01-CONTEXT.md` — CORS `localhost:5173`, `src/app` + `src/shared` layout, web port 5173
- `.planning/phases/KRAM-02-prisma-data-model/02-CONTEXT.md` — `Category` enum, `ProductPublic` price as string (D-15), seed categories/theme
- `.planning/phases/KRAM-03-shared-types-pipeline/03-01-SUMMARY.md` — `@kramnik/types` exports and mappers

### Live API & types (implementation truth)
- `apps/api/src/products/products.controller.ts` — `GET /products`, `GET /products/:id`
- `apps/api/src/products/dto/list-products-query.dto.ts` — `category`, `q`, `minPrice`, `maxPrice`
- `packages/types/src/product.ts` — `ProductPublic`, `Category` re-export

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **`apps/web`** — Vite 8, React 19, Tailwind 4; minimal `AppShell` imports `ProductPublic` already.
- **`@kramnik/types`** — `ProductPublic`, `Category`, `toProductPublic` (API already uses mappers).
- **Products API** — list filters and detail endpoints implemented; no web client yet.

### Established Patterns
- **Monorepo:** `pnpm` + Turbo; API on port 3000, web on 5173.
- **Money in UI:** format `price` string as USD; never treat as JS number for arithmetic on catalog pages.
- **Schema categories:** `HOME`, `GARBAGE`, `SCRAPS`, `GARDEN_GNOMES` — filter UI should expose all four.

### Integration Points
- Replace/extend `AppShell` with layout + `<Outlet />` for catalog routes.
- `main.tsx` — add Router + QueryClient providers.
- New deps in `apps/web/package.json`: `react-router-dom`, `@tanstack/react-query`, devtools package optional.

</code_context>

<specifics>
## Specific Ideas

- User explicitly chose a **shop-window card grid** with category badges and whole-card navigation — prioritize visual consistency over compact list density.
- Playful seed catalog theme (junk shop / gnomes) — badges and typography can lean casual but stay readable.

</specifics>

<deferred>
## Deferred Ideas

None raised in discussion.

**Undiscussed gray areas** resolved via D-05–D-19 (planner discretion defaults) — filters, URL sync, routes, add-to-cart stub, loading/error, and folder structure were not user-selected for discussion.

</deferred>

---

*Phase: 05-Catalog UI*
*Context gathered: 2026-05-25*

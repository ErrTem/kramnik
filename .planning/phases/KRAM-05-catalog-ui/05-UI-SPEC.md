# Phase 5: Catalog UI — UI Design Contract

**Source:** Derived from `05-CONTEXT.md` (discuss-phase 2026-05-25)  
**Status:** Ready for planning

## Layout

| Surface | Structure |
|---------|-----------|
| App shell | Header with site title “Kramnik Shop”; main `<Outlet />` for catalog routes |
| List `/products` | Horizontal filter bar → responsive product card grid |
| Detail `/products/:id` | Two-column on `md+` (image left, info right); single column on mobile |

## Product card (list)

- **Grid:** 1 / 2 / 3–4 columns (`sm` / `md` / `lg` breakpoints)
- **Card fields:** Image (fixed **4:3** box, `object-cover`), name, **USD** price from `price` string, category **badge**
- **Interaction:** Entire card is one link to `/products/:id`
- **Broken image:** Neutral placeholder block inside image area

## Filters (list)

- **Placement:** Horizontal bar above grid (not sidebar)
- **Controls:** Category `<select>`, search text, min price, max price
- **Behavior:** Debounced search ~300ms; URL search params mirror active filters

## Detail page

- Large image, full description, price (USD), category badge
- **Add to cart:** Visible, **disabled**, label “Add to cart (coming soon)” + short Phase 7 note

## States

| State | List | Detail |
|-------|------|--------|
| Loading | Skeleton cards (grid count ~6) | Skeleton block for image + text lines |
| Error | Inline message + Retry (`refetch`) | Same |
| Empty filter | “No products match your filters” | — |
| 404 product | — | “Product not found” + link back to list |

## Tokens (Tailwind 4)

- Use existing `index.css` theme; casual readable typography for junk-shop theme
- Category badges: distinct soft background per enum (planner picks palette)
- Focus visible on card links and filter controls (`focus-visible:ring`)

## Out of scope (visual)

- Cart drawer, auth forms, admin chrome, pagination controls

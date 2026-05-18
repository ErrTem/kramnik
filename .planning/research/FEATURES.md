# Features Research: E-Commerce (Learning Scope)

**Researched:** 2026-05-18  
**Confidence:** HIGH

## Table Stakes (v1 — users expect these)

| Feature | Complexity | Notes |
|---------|------------|-------|
| Product listing | Low | Grid/list with image, name, price |
| Product detail | Low | Description, price, add to cart |
| Search / filter | Medium | Category, price range, text search |
| Register / login | Medium | Email + password, JWT |
| Shopping cart | Medium | Add/update/remove, persist locally |
| Checkout | Medium | Review cart → submit order (no real payment) |
| Order confirmation | Low | Success page + order id |
| Admin: manage products | Medium | CRUD for catalog |
| Admin: view orders | Low | List orders, status |

## Differentiators (defer to v2)

| Feature | Why defer |
|---------|-----------|
| Wishlists | Not core to learning goals |
| Product reviews | Extra schema + moderation |
| Inventory reservations | Complexity |
| Email notifications | Requires mail provider setup |
| OAuth login | Out of scope per PROJECT.md |

## Anti-Features (deliberately NOT building)

| Anti-feature | Reason |
|--------------|--------|
| Real payment processing | PCI scope; learning focus is order API + UI |
| Multi-vendor marketplace | Scope creep |
| Real-time inventory sync | Overkill for learning |
| Redux architecture | Explicit user constraint |

## Dependencies Between Features

```
Monorepo + DB schema
    → API read products
        → Catalog UI (Query)
    → Auth API
        → Protected checkout
        → Admin guard
    → Cart (Zustand)
        → Checkout → Orders API
    → Admin CRUD
```

## Category Mapping for Requirements

1. **Foundation** — monorepo, tooling, Docker Postgres
2. **Data** — Prisma schema, migrations, seed
3. **Catalog** — list, filter, detail
4. **Auth** — register, login, JWT, guards
5. **Cart** — Zustand store + UI
6. **Orders** — checkout, placement, history
7. **Admin** — product/order management
8. **Types** — shared package (cross-cutting, built incrementally)

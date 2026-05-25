# Phase 5: Catalog UI - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-25
**Phase:** 5-Catalog UI
**Areas discussed:** Product grid layout

---

## Product grid layout

| Option | Description | Selected |
|--------|-------------|----------|
| Responsive card grid | 1→2→3–4 cols; image on top, name + price below | ✓ |
| Compact list rows | Thumbnail left, denser rows | |
| You decide | Claude picks default | |

| Option | Description | Selected |
|--------|-------------|----------|
| Image + name + price + category badge | Category as small tag | ✓ |
| + one-line description | Taller cards | |
| Minimal (no category on card) | | |

| Option | Description | Selected |
|--------|-------------|----------|
| Fixed aspect ratio + object-cover | Consistent grid | ✓ |
| Natural aspect | Variable heights | |
| Placeholder when missing | (can combine with fixed box in implementation) | |

| Option | Description | Selected |
|--------|-------------|----------|
| Whole card navigates to detail | Link wraps card | ✓ |
| Title/image only | Smaller hit target | |
| Card + separate View button | Extra chrome | |

**User's choice:** All four questions — option 1 (responsive grid, badge + core fields, fixed aspect cover, whole-card link).

**Notes:** User selected only this gray area from the initial list; remaining phase topics (filters, routes, detail stub, devtools) were not discussed and were captured as planner-discretion defaults in CONTEXT.md D-05–D-19.

---

## Claude's Discretion

- Filters: horizontal bar, debounced `q`, URL-synced search params, query keys mirror API (CONTEXT D-09–D-12).
- Routes: `/products`, `/products/:id`, `/` redirect (D-06).
- Add-to-cart: disabled placeholder until Phase 7 (D-15).
- Loading/error: per-route skeletons + inline retry (D-16–D-17).
- Feature folders: `features/catalog` + `shared/api` (D-07).

## Deferred Ideas

None.

# Phase 2: Prisma Data Model - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-18
**Phase:** 2-Prisma Data Model
**Areas discussed:** Prisma layout, Product fields, Money & numbers, User & roles, Order model, Seed content, Dev workflow

---

## Prisma layout

| Option | Description | Selected |
|--------|-------------|----------|
| apps/api/prisma only | Schema with Nest app; simpler monorepo | ✓ |
| packages/database | Shared workspace package | |
| You decide | | |

**User's choice:** apps/api/prisma only

| Option | Description | Selected |
|--------|-------------|----------|
| Root shortcuts (db:migrate, db:seed, …) | Delegate to apps/api | ✓ |
| apps/api only | Filter commands in README | |
| You decide | | |

**User's choice:** Root shortcuts

| Option | Description | Selected |
|--------|-------------|----------|
| postinstall generate | After pnpm install | ✓ |
| turbo dev dependency | Generate before api dev | |
| Manual only | | |
| You decide | | |

**User's choice:** postinstall

| Option | Description | Selected |
|--------|-------------|----------|
| packages/types + shared schema path | Generate from apps/api schema in Phase 3 | ✓ |
| Re-export from API | | |
| Defer to Phase 3 | | |
| You decide | | |

**User's choice:** packages/types + shared schema path

| Option | Description | Selected |
|--------|-------------|----------|
| apps/api/prisma/seed.ts | Standard Prisma seed | ✓ |
| apps/api/src/seed/ | | |
| You decide | | |

**User's choice:** prisma/seed.ts

| Option | Description | Selected |
|--------|-------------|----------|
| pnpm --filter @kramnik/api exec prisma | Loads apps/api/.env | ✓ |
| Duplicate root .env | | |
| You decide | | |

**User's choice:** filter exec

| Option | Description | Selected |
|--------|-------------|----------|
| Single schema.prisma | | ✓ |
| Multi-file schema | | |
| You decide | | |

**User's choice:** Single file

| Option | Description | Selected |
|--------|-------------|----------|
| migrate dev --name init | One init migration | ✓ |
| Incremental migrations | | |
| You decide | | |

**User's choice:** init migration

**Notes:** User asked extra Prisma layout questions (Q5–Q8) before moving on.

---

## Product fields

| Option | Description | Selected |
|--------|-------------|----------|
| Category enum | ELECTRONICS-style fixed set | ✓ (themed: HOME, GARBAGE, SCRAPS, GARDEN_GNOMES in CONTEXT) |
| Category table | | |
| Free-text category | | |
| You decide | | |

**User's choice:** Category enum

| Option | Description | Selected |
|--------|-------------|----------|
| Core field set | name, slug, description, price, imageUrl, category, timestamps | ✓ |
| Core + inventory | | |
| Core + SKU | | |
| You decide | | |

**User's choice:** Core set

| Option | Description | Selected |
|--------|-------------|----------|
| Placeholder URLs | External image service | ✓ |
| Static web/public paths | | |
| Nullable imageUrl | | |
| You decide | | |

**User's choice:** Placeholder URLs

| Option | Description | Selected |
|--------|-------------|----------|
| Always visible | No isActive/deletedAt | ✓ |
| isActive Boolean | | |
| deletedAt soft-delete | | |
| You decide | | |

**User's choice:** Always visible

---

## Money & numbers

| Option | Description | Selected |
|--------|-------------|----------|
| Decimal @db.Decimal(10,2) | Phase 3 maps to string in JSON | ✓ |
| Integer cents | | |
| You decide | | |

**User's choice:** Decimal

| Option | Description | Selected |
|--------|-------------|----------|
| USD implicit | No currency column | ✓ |
| currency field | | |
| You decide | | |

**User's choice:** USD implicit

| Option | Description | Selected |
|--------|-------------|----------|
| Snapshot unitPrice on OrderItem | | ✓ |
| Reference product price only | | |
| You decide | | |

**User's choice:** Snapshot unitPrice

| Option | Description | Selected |
|--------|-------------|----------|
| total Decimal on Order | | ✓ |
| Computed only | | |
| You decide | | |

**User's choice:** total on Order

---

## User & roles

| Option | Description | Selected |
|--------|-------------|----------|
| Role enum CUSTOMER \| ADMIN | | ✓ |
| String role | | |
| You decide | | |

**User's choice:** Role enum

| Option | Description | Selected |
|--------|-------------|----------|
| passwordHash in Phase 2 | Seed bcrypt hashes | ✓ |
| Defer to Phase 6 | | |
| You decide | | |

**User's choice:** passwordHash now

| Option | Description | Selected |
|--------|-------------|----------|
| Minimal profile | email, passwordHash, role, timestamps | ✓ |
| Minimal + name | | |
| You decide | | |

**User's choice:** Minimal

| Option | Description | Selected |
|--------|-------------|----------|
| Admin + demo customer | | ✓ |
| Admin only | | |
| You decide | | |

**User's choice:** Admin + demo customer

---

## Order model

| Option | Description | Selected |
|--------|-------------|----------|
| OrderStatus enum | PENDING, CONFIRMED, SHIPPED, CANCELLED | ✓ |
| String status | | |
| Defer to Phase 8 | | |
| You decide | | |

**User's choice:** OrderStatus enum

| Option | Description | Selected |
|--------|-------------|----------|
| Single shippingAddress String | | ✓ |
| Structured address fields | | |
| Defer address | | |
| You decide | | |

**User's choice:** Single shippingAddress

| Option | Description | Selected |
|--------|-------------|----------|
| productName snapshot on OrderItem | | ✓ |
| Join Product only | | |
| You decide | | |

**User's choice:** productName snapshot

| Option | Description | Selected |
|--------|-------------|----------|
| No orders in seed | | ✓ |
| One sample order | | |
| You decide | | |

**User's choice:** No orders in seed

---

## Seed content

| Option | Description | Selected |
|--------|-------------|----------|
| ~12 products | | ✓ |
| ~6 products | | |
| ~24+ products | | |
| You decide | | |

**User's choice:** ~12 products

| Option | Description | Selected |
|--------|-------------|----------|
| Realistic shop names | | |
| Generic placeholders | | |
| Themed / fun | Home, garbage, scraps, garden gnomes | ✓ |
| You decide | | |

**User's choice:** Themed / fun (user free-text: “some shit about home, garbage, scraps, garden gnomes”)

| Option | Description | Selected |
|--------|-------------|----------|
| Fixed tutorial emails/passwords in README | admin@kramnik.local / Admin123!, etc. | ✓ |
| From .env seed vars | | |
| You decide | | |

**User's choice:** Fixed tutorial credentials

| Option | Description | Selected |
|--------|-------------|----------|
| Upsert by email/slug | Idempotent re-seed | ✓ |
| Wipe and re-insert | | |
| You decide | | |

**User's choice:** Upsert

---

## Dev workflow

| Option | Description | Selected |
|--------|-------------|----------|
| verify-phase2 scripts (sh + ps1) | Row counts, admin exists | ✓ |
| README checklist only | | |
| You decide | | |

**User's choice:** verify-phase2

| Option | Description | Selected |
|--------|-------------|----------|
| Extend README Local development | migrate/seed flow | ✓ |
| Separate DATABASE.md | | |
| You decide | | |

**User's choice:** Extend README

| Option | Description | Selected |
|--------|-------------|----------|
| bcrypt in apps/api dependencies | Seed + Phase 6 auth | ✓ |
| devDependency only | | |
| You decide | | |

**User's choice:** bcrypt in apps/api

| Option | Description | Selected |
|--------|-------------|----------|
| pnpm db:reset → migrate reset | | ✓ |
| No reset shortcut | | |
| You decide | | |

**User's choice:** db:reset

---

## Claude's Discretion

See CONTEXT.md — bcrypt vs bcryptjs, exact seed catalog copy, relation onDelete rules, verify-phase2 implementation details.

## Deferred Ideas

None captured during discussion.

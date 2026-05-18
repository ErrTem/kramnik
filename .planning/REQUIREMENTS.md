# Requirements: Kramnik Shop

**Defined:** 2026-05-18  
**Core Value:** End-to-end type safety from `schema.prisma` through shared DTOs to the React UI

## v1 Requirements

### Foundation

- [ ] **FOUND-01**: Repository uses a Turborepo monorepo with `apps/web`, `apps/api`, and `packages/types`
- [ ] **FOUND-02**: Developer can run web and API together from the repo root with documented commands
- [ ] **FOUND-03**: PostgreSQL runs locally via Docker Compose for development

### Data & Types

- [ ] **DATA-01**: `schema.prisma` defines User, Product, Order, and OrderItem (and any supporting enums/roles)
- [ ] **DATA-02**: Prisma migrations apply cleanly on a fresh database
- [ ] **DATA-03**: Seed script populates sample products (and an admin user)
- [ ] **TYPE-01**: `packages/types` exports frontend-safe DTOs derived from Prisma types (Omit/Pick/Partial)
- [ ] **TYPE-02**: Web and API import shared types without duplicating model interfaces

### Product Catalog

- [ ] **CAT-01**: User can view a paginated or scrollable product listing with image, name, and price
- [ ] **CAT-02**: User can filter products (e.g. category and/or price range and/or search text)
- [ ] **CAT-03**: User can open a product detail page with description and add-to-cart action
- [ ] **CAT-04**: Product data is loaded via TanStack Query with loading and error states

### Authentication

- [ ] **AUTH-01**: User can register with email and password
- [ ] **AUTH-02**: User can log in and receive a JWT used for authenticated API calls
- [ ] **AUTH-03**: User can log out and lose access to protected routes
- [ ] **AUTH-04**: Auth session state is available to the UI via Zustand (token/user snapshot)
- [ ] **AUTH-05**: NestJS protects order and admin routes with JWT guards and decorators

### Shopping Cart

- [ ] **CART-01**: User can add, remove, and change quantities of products in the cart (Zustand)
- [ ] **CART-02**: Cart survives page refresh (e.g. localStorage persistence)
- [ ] **CART-03**: User can view cart contents from any page (drawer or dedicated page)

### Checkout & Orders

- [ ] **ORD-01**: Logged-in user can review cart and shipping/checkout summary before placing an order
- [ ] **ORD-02**: User can place an order via the API without a real payment provider (mock/simplified payment)
- [ ] **ORD-03**: User sees an order confirmation with order identifier after successful checkout
- [ ] **ORD-04**: User can view a list of their past orders when logged in

### Admin

- [ ] **ADM-01**: Admin user can access admin-only routes in the web app
- [ ] **ADM-02**: Admin can create, update, and delete products
- [ ] **ADM-03**: Admin can view all orders and see basic order details

### Learning & Quality

- [ ] **LEARN-01**: Web app uses function components and hooks only (no class components)
- [ ] **LEARN-02**: Server/async state uses TanStack Query; global client state uses Zustand (not Redux)
- [ ] **LEARN-03**: UI uses Tailwind utility classes with responsive layouts on catalog and checkout flows

## v2 Requirements

### Payments & Account

- **PAY-01**: Integrate Stripe (or similar) for real payments
- **AUTH-06**: OAuth login (Google/GitHub)
- **AUTH-07**: Email verification and password reset

### Store Features

- **CAT-05**: Product reviews and ratings
- **CAT-06**: Wishlist
- **ORD-05**: Order status emails

## Out of Scope

| Feature | Reason |
|---------|--------|
| Redux | Explicit stack choice: Zustand + TanStack Query |
| TypeORM/manual entities | Prisma is single source of truth |
| Class React components | Learning goal: hooks-only |
| Real payment processing | Focus on order flow and types, not PCI |
| OAuth / social login (v1) | Deferred to v2 |
| Email verification (v1) | Deferred to v2 |
| Production deployment hardening | Learning project, not launch |
| Mobile native apps | Responsive web only |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | Phase 1 | Pending |
| FOUND-02 | Phase 1 | Pending |
| FOUND-03 | Phase 1 | Pending |
| DATA-01 | Phase 2 | Pending |
| DATA-02 | Phase 2 | Pending |
| DATA-03 | Phase 2 | Pending |
| TYPE-01 | Phase 3 | Pending |
| TYPE-02 | Phase 3 | Pending |
| CAT-04 | Phase 5 | Pending |
| CAT-01 | Phase 5 | Pending |
| CAT-02 | Phase 5 | Pending |
| CAT-03 | Phase 5 | Pending |
| AUTH-05 | Phase 6 | Pending |
| AUTH-01 | Phase 6 | Pending |
| AUTH-02 | Phase 6 | Pending |
| AUTH-03 | Phase 6 | Pending |
| AUTH-04 | Phase 6 | Pending |
| CART-01 | Phase 7 | Pending |
| CART-02 | Phase 7 | Pending |
| CART-03 | Phase 7 | Pending |
| ORD-01 | Phase 8 | Pending |
| ORD-02 | Phase 8 | Pending |
| ORD-03 | Phase 8 | Pending |
| ORD-04 | Phase 8 | Pending |
| ADM-01 | Phase 9 | Pending |
| ADM-02 | Phase 9 | Pending |
| ADM-03 | Phase 9 | Pending |
| LEARN-01 | Phase 5–9 | Pending |
| LEARN-02 | Phase 5–9 | Pending |
| LEARN-03 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 28 total
- Mapped to phases: 28
- Unmapped: 0 ✓

---
*Requirements defined: 2026-05-18*  
*Last updated: 2026-05-18 after roadmap creation*

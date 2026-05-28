# Phase 6: Authentication - Context

**Gathered:** 2026-05-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Implement JWT authentication end-to-end: Nest `AuthModule` (register, login, JWT issue/validate, guards), React login/register under `features/auth`, Zustand auth store with persisted token, API client attaching `Authorization: Bearer`, protected web route(s), and logout (AUTH-01..AUTH-05).

Phase 6 does **not** implement shopping cart, checkout, order history UI, or admin product CRUD — Phases 7–9. OAuth, email verification, and password reset remain out of scope (PROJECT.md v2).

</domain>

<decisions>
## Implementation Decisions

### Token persistence & session lifecycle (discussed)
- **D-01:** Persist JWT via **Zustand `persist` + `localStorage`** (login survives browser close). Document XSS/localStorage tradeoff in `apps/web` README per `.planning/research/PITFALLS.md` §4.
- **D-02:** Store **JWT only** in auth state — no persisted user snapshot; load `UserPublic` after login and on app init when a token exists (e.g. `GET /auth/me`).
- **D-03:** On API **401**, **clear auth state and redirect to `/login`** (shared `fetchJson` / interceptor pattern).
- **D-04:** **Logout** clears Zustand auth slice **and** the persist storage key; **do not** invalidate TanStack Query catalog cache.

### Login & register UI (discussed)
- **D-05:** **Separate routes** — `/login` and `/register` under `features/auth`.
- **D-06:** Auth pages use a **centered card** on the existing gray `AppLayout` background (max-width form, consistent with catalog shell).
- **D-07:** **Header links** for guests — “Log in” and “Sign up” on all pages via `AppLayout`.
- **D-08:** **Inline field errors** (email format, password rules) plus a **top red alert banner** for API error messages.

### Protected routes & API guards (discussed)
- **D-09:** Primary protected web route: **stub `/account`** page (signed-in placeholder; Angular guard learning target).
- **D-10:** Unauthenticated access to protected routes → **redirect to `/login`** with **`returnUrl` saved** (location state or `?from=` query) for teaching redirects (see D-19 for post-login landing).
- **D-11:** API Phase 6 proof: **`GET /auth/me`** behind JWT (returns `UserPublic`); use for bootstrap user load. Document order/admin JWT protection for Phases 8–9 — no Orders module required in Phase 6 beyond guard pattern notes.
- **D-12:** **No admin web UI** in Phase 6 — admin `RolesGuard` / `/admin` deferred to Phase 9; role may still be in JWT payload for later.

### Registration behavior (discussed)
- **D-13:** **Auto-login after register** — register endpoint returns JWT; redirect to **`/products`** (same as login success).
- **D-14:** New users always get role **`CUSTOMER`** — no self-serve admin registration.
- **D-15:** Password rules: **minimum 8 characters** on client and API (no complexity rules for v1).
- **D-16:** Duplicate email → clear **409-style** message: “Email already registered” (acceptable for learning project).

### Header & post-auth UX (discussed)
- **D-17:** Logged-in header shows **email + Logout** (replaces Log in / Sign up).
- **D-18:** **No admin role badge** in header in Phase 6.
- **D-19:** After successful **login or register**, redirect to **`/products`** (do not honor `returnUrl` in v1 — keeps flow simple; `returnUrl` still saved on guard redirect for optional future polish).
- **D-20:** On app boot with stored token, show **brief loading/skeleton in header** until `GET /auth/me` completes — avoid flash of guest links.

### Claude's Discretion
- Add **`zustand`** to `apps/web`; persist middleware storage key name (e.g. `kramnik-auth`).
- Nest deps: `@nestjs/jwt`, `@nestjs/passport`, `passport-jwt`; `JWT_SECRET` and expiry in `apps/api/.env.example`.
- Auth API routes: `POST /auth/register`, `POST /auth/login`, `GET /auth/me`; bcryptjs reuse from seed (cost 10).
- JWT payload fields (`sub`, `email`, `role`) and expiry duration (e.g. 7d for learning).
- `features/auth` file split (`LoginPage`, `RegisterPage`, form components) vs single form component.
- Extend `shared/api/client.ts` with optional auth header vs `authFetch` wrapper; wire login/register API helpers in `shared/api/auth.ts`.
- React **`ProtectedRoute`** wrapper vs route `loader` guard — prefer simple wrapper component mapping to Angular `canActivate`.
- Whether login/register routes use `AppLayout` or a minimal auth-only layout (prefer **same `AppLayout`** per D-06/D-07).
- `class-validator` DTOs for register/login bodies; map Prisma user to `UserPublic` via existing `@kramnik/types`.
- Seed dev users (`admin@kramnik.local`, `customer@kramnik.local`) usable for manual login testing — document in README.
- Angular mapping notes in plan/comments: `JwtAuthGuard` ≈ `canActivate`, interceptor ≈ `HttpInterceptor`, Zustand ≈ session service snapshot.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements & roadmap
- `.planning/ROADMAP.md` — Phase 6 goal, success criteria, plans 06-01..06-03
- `.planning/REQUIREMENTS.md` — AUTH-01..AUTH-05
- `.planning/PROJECT.md` — Stack, Angular→React mapping (guards/interceptors), out-of-scope OAuth

### Research & architecture
- `.planning/research/ARCHITECTURE.md` — `AuthModule`, `features/auth`, `shared/api` JWT flow
- `.planning/research/STACK.md` — `@nestjs/jwt`, `@nestjs/passport`
- `.planning/research/PITFALLS.md` — §4 JWT storage (document localStorage choice)

### Prior phase context
- `.planning/phases/KRAM-01-monorepo-foundation/01-CONTEXT.md` — CORS `localhost:5173`, `apps/api/.env`
- `.planning/phases/KRAM-02-prisma-data-model/02-CONTEXT.md` — `User.passwordHash`, `Role`, seed dev credentials
- `.planning/phases/KRAM-05-catalog-ui/05-CONTEXT.md` — `AppLayout`, `shared/api/client.ts`, `features/*` layout, no auth in Phase 5

### Live code (implementation truth)
- `apps/api/prisma/schema.prisma` — `User`, `Role` enum
- `apps/api/prisma/seed.ts` — bcrypt hashes, `admin@kramnik.local` / `customer@kramnik.local`
- `packages/types/src/user.ts` — `UserPublic`
- `apps/web/src/app/router.tsx` — extend with auth + protected routes
- `apps/web/src/app/AppLayout.tsx` — header auth links / email + logout
- `apps/web/src/shared/api/client.ts` — base `fetchJson` to extend with Bearer token

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **`User` model + seed passwords** — Phase 2 seed; bcryptjs already in `apps/api`.
- **`UserPublic`** — `packages/types`; never expose `passwordHash`.
- **`fetchJson`** — `apps/web/src/shared/api/client.ts`; add Bearer header + 401 handling.
- **`AppLayout` + React Router 7** — add routes and header auth affordances.
- **Products API patterns** — Nest module layout, `class-validator` DTOs, `PrismaService` in `apps/api/src/products/`.

### Established Patterns
- **Monorepo:** API `:3000`, web `:5173`, `VITE_API_URL`.
- **Feature folders:** `features/catalog` → add `features/auth`.
- **TanStack Query for server state; Zustand for auth** — first Zustand usage in web (cart is Phase 7).

### Integration Points
- `app.module.ts` — import `AuthModule`.
- `main.tsx` / `providers.tsx` — optional auth bootstrap hook.
- `router.tsx` — `/login`, `/register`, protected `/account`.
- Header in `AppLayout` — guest vs authenticated branches (D-07, D-17, D-20).

</code_context>

<specifics>
## Specific Ideas

- User chose **localStorage persistence** knowingly (learning SPA pattern) — README must mention XSS vs httpOnly cookies briefly.
- **returnUrl** saved on guard redirect (D-10) but post-login always **`/products`** (D-19) — intentional simplicity for v1.
- Dev seed logins remain the fastest way to test admin vs customer JWT payloads before Phase 9 admin UI.

</specifics>

<deferred>
## Deferred Ideas

None raised in discussion.

**Undiscussed gray areas** resolved via Claude's Discretion — JWT expiry, exact Nest passport config, admin API stub, and auth module file naming were not user-selected.

</deferred>

---

*Phase: 06-Authentication*
*Context gathered: 2026-05-28*

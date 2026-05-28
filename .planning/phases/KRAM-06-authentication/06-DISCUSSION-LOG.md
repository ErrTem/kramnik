# Phase 6: Authentication - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-28
**Phase:** 6-Authentication
**Areas discussed:** Token persistence, Login & register UI, Protected routes, After registration, Header when logged in

---

## Token persistence

| Option | Description | Selected |
|--------|-------------|----------|
| localStorage + Zustand persist | Survives browser close | ✓ |
| sessionStorage + Zustand persist | Cleared when session ends | |
| Memory only | Lost on reload | |

| Option | Description | Selected |
|--------|-------------|----------|
| JWT only | Load UserPublic when needed | ✓ |
| JWT + user snapshot | Persist email/role in store | |
| You decide | | |

| Option | Description | Selected |
|--------|-------------|----------|
| 401 → clear + redirect /login | Hard reset | ✓ |
| Clear + stay on page + message | | |
| Clear only | | |

| Option | Description | Selected |
|--------|-------------|----------|
| Logout clears auth + storage | Catalog Query cache untouched | ✓ |
| Logout + invalidate all queries | | |
| Auth only in memory | | |

**User's choice:** 1, 1, 1, 1 for all four questions.

---

## Login & register UI

| Option | Description | Selected |
|--------|-------------|----------|
| Separate /login and /register | | ✓ |
| Single /auth page | | |
| You decide | | |

| Option | Description | Selected |
|--------|-------------|----------|
| Centered card on gray layout | | ✓ |
| Full-width simple form | | |
| Split layout | | |

| Option | Description | Selected |
|--------|-------------|----------|
| Header Log in + Sign up links | | ✓ |
| Single Account entry | | |
| No header links | | |

| Option | Description | Selected |
|--------|-------------|----------|
| Inline errors + API banner | | ✓ |
| Single error line | | |
| You decide | | |

**User's choice:** 1, 1, 1, 1 for all four questions.

---

## Protected routes (Phase 6)

| Option | Description | Selected |
|--------|-------------|----------|
| Stub /account | | ✓ |
| /orders early | | |
| Both | | |

| Option | Description | Selected |
|--------|-------------|----------|
| Redirect /login with returnUrl | | ✓ |
| Redirect without returnUrl | | |
| You decide | | |

| Option | Description | Selected |
|--------|-------------|----------|
| GET /auth/me stub protected endpoint | | ✓ |
| Stub + orders skeleton | | |
| You decide | | |

| Option | Description | Selected |
|--------|-------------|----------|
| No admin UI in Phase 6 | | ✓ |
| Stub /admin protected | | |
| API-only admin ping | | |

**User's choice:** All 1s.

---

## After registration

| Option | Description | Selected |
|--------|-------------|----------|
| Auto-login → /products or /account | | ✓ |
| Redirect to /login | | |
| You decide | | |

| Option | Description | Selected |
|--------|-------------|----------|
| Always CUSTOMER role | | ✓ |
| You decide | | |

| Option | Description | Selected |
|--------|-------------|----------|
| Min 8 characters | | ✓ |
| Match seed style messaging only | | |
| You decide | | |

| Option | Description | Selected |
|--------|-------------|----------|
| 409 "Email already registered" | | ✓ |
| Vague error | | |
| You decide | | |

**User's choice:** All 1s.

---

## Header when logged in

| Option | Description | Selected |
|--------|-------------|----------|
| Email + Logout | | ✓ |
| Account link + Logout | | |
| You decide | | |

| Option | Description | Selected |
|--------|-------------|----------|
| No role badge | | ✓ |
| Admin badge | | |
| You decide | | |

| Option | Description | Selected |
|--------|-------------|----------|
| Land on /products | | ✓ |
| returnUrl if present | | |
| /account default | | |

| Option | Description | Selected |
|--------|-------------|----------|
| Skeleton header while /auth/me loads | | ✓ |
| Guest links until load completes | | |
| You decide | | |

**User's choice:** All 1s.

---

## Claude's Discretion

JWT expiry, Nest Passport/JwtModule wiring, exact storage key, auth file layout, and whether `returnUrl` is ever consumed after login (CONTEXT D-19: always `/products`).

## Deferred Ideas

None.

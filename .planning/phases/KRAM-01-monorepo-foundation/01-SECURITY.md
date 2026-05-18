---
phase: 01-monorepo-foundation
slug: monorepo-foundation
status: verified
threats_open: 0
asvs_level: 1
created: 2026-05-18
verified: 2026-05-18
---

# Phase 01 — Security

> Per-phase security contract: threat register, accepted risks, and audit trail.

---

## Trust Boundaries

| Boundary | Description | Data Crossing |
|----------|-------------|---------------|
| Developer → npm registry | Root/workspace devDependencies installed via pnpm | Package names, versions, lockfile |
| Developer → git | Workspace config and lockfile committed | No secrets in tracked files |
| Browser → API | Local dev CORS from Vite origin only | JSON welcome/health (non-sensitive) |
| Developer → API env | Secrets in gitignored `apps/api/.env` | `DATABASE_URL`, `PORT` |
| Host → Docker daemon | `pnpm db:up` publishes Postgres on 5432 | DB credentials (dev tutorial values) |

---

## Threat Register

| Threat ID | Category | Component | Disposition | Mitigation | Status |
|-----------|----------|-----------|-------------|------------|--------|
| T-01-SC | Tampering | npm installs (turbo, prettier, vitest) | mitigate | Plan 01-01 Task 0 human-verify checkpoint; RESEARCH package legitimacy table | closed |
| T-01-01 | Spoofing | CORS | mitigate | `apps/api/src/main.ts`: `enableCors({ origin: 'http://localhost:5173' })` — no wildcard | closed |
| T-01-02 | Information disclosure | `apps/api/.env` / DATABASE_URL | mitigate | `.gitignore` lists `apps/api/.env`; only `.env.example` tracked; README instructs copy from example | closed |
| T-01-03 | Information disclosure | `apps/api/.env` | mitigate | `.gitignore` line `apps/api/.env` | closed |
| T-01-04 | Tampering | workspace packages | mitigate | `packages/types/package.json`: `"private": true`; pnpm workspace only | closed |
| T-01-05 | Information disclosure | Health endpoint | accept | Public `{ status: 'ok' }` intentional for dev monitoring (plan 01-02) | closed |
| T-01-06 | Information disclosure | Postgres tutorial credentials | mitigate | README **Security (dev only)**; compose file header warns production use | closed |
| T-01-07 | Tampering | `postgres:16` image pull | mitigate | `docker-compose.yml` pins `image: postgres:16` | closed |
| T-01-08 | Denial of service | Host port 5432 bind | accept | README **Port conflicts** — stop conflicting service; mapping locked D-15 | closed |
| T-01-09 | Information disclosure | Published 5432 on LAN | mitigate | README: port published to host; `pnpm db:down` on shared machines | closed |

*Disposition: mitigate · accept · transfer*

---

## Verification Evidence

| Threat ID | Evidence |
|-----------|----------|
| T-01-SC | `01-01-PLAN.md` Task 0 `checkpoint:human-verify`; `01-RESEARCH.md` Package Legitimacy Audit |
| T-01-01 | `apps/api/src/main.ts` |
| T-01-02, T-01-03 | `.gitignore`; `apps/api/.env.example`; `git ls-files` does not list `apps/api/.env` |
| T-01-04 | `packages/types/package.json` |
| T-01-05 | `apps/api/src/app.controller.ts` `@Get('health')` |
| T-01-06, T-01-09 | `README.md` Security subsection |
| T-01-07 | `docker-compose.yml` |
| T-01-08 | `README.md` Port conflicts |

---

## Accepted Risks Log

| Risk ID | Threat Ref | Rationale | Accepted By | Date |
|---------|------------|-----------|-------------|------|
| AR-01-05 | T-01-05 | Dev-only health probe; no auth surface in Phase 1 | Phase plan disposition | 2026-05-18 |
| AR-01-08 | T-01-08 | Local dev port collision is operator responsibility; documented | Phase plan disposition | 2026-05-18 |

---

## Security Audit Trail

| Audit Date | Threats Total | Closed | Open | Run By |
|------------|---------------|--------|------|--------|
| 2026-05-18 | 10 | 10 | 0 | gsd-secure-phase (inline; gsd-security-auditor not installed) |

### Security Audit 2026-05-18

| Metric | Count |
|--------|-------|
| Threats found | 10 |
| Closed | 10 |
| Open | 0 |

Sources: `01-01-PLAN.md`, `01-02-PLAN.md`, `01-03-PLAN.md` threat models; implementation verified against repo root, `apps/api`, `packages/types`, `docker-compose.yml`, `README.md`.

---

## Sign-Off

- [x] All threats have a disposition (mitigate / accept / transfer)
- [x] Accepted risks documented in Accepted Risks Log
- [x] `threats_open: 0` confirmed
- [x] `status: verified` set in frontmatter

**Approval:** verified 2026-05-18

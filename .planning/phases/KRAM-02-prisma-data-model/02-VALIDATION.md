---
phase: 02
slug: prisma-data-model
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-18
---

# Phase 02 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 3.2.4 (root) |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `pnpm test` |
| **Full suite command** | `pnpm test` |
| **Estimated runtime** | ~5 seconds (static) + DB smoke when Docker up |

---

## Sampling Rate

- **After every task commit:** `pnpm test` (static schema/README checks when added)
- **After every plan wave:** `scripts/verify-phase2.sh` or `scripts/verify-phase2.ps1` (requires `pnpm db:up`, migrate, seed)
- **Before `/gsd-verify-work`:** Fresh DB migrate + seed + verify scripts green
- **Max feedback latency:** 30 seconds (static); DB smoke depends on Docker

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 02-01 | 1 | DATA-01 | T-02-01 | Schema has models/enums; passwordHash not plaintext | unit | `pnpm test tests/data/prisma-schema.test.ts` | ❌ W0 | ⬜ pending |
| 02-01-02 | 02-01 | 1 | DATA-02 | — | Migration folder exists; migrate applies | integration | `pnpm --filter @kramnik/api exec prisma migrate status` | ❌ W0 | ⬜ pending |
| 02-01-03 | 02-01 | 1 | DATA-02 | — | [BLOCKING] schema pushed to DB | integration | `pnpm db:migrate` (after schema) | ❌ W0 | ⬜ pending |
| 02-02-01 | 02-02 | 2 | DATA-03 | T-02-02 | Seed uses bcrypt hash; dev creds documented | unit | `pnpm test tests/data/seed-content.test.ts` | ❌ W0 | ⬜ pending |
| 02-02-02 | 02-02 | 2 | DATA-03 | T-02-02 | ≥12 products, admin user exists | integration | `pnpm db:seed && bash scripts/verify-phase2.sh` | ❌ W0 | ⬜ pending |
| 02-02-03 | 02-02 | 2 | DATA-03 | — | README documents db flow + dev passwords | unit | `pnpm test tests/data/readme-db-flow.test.ts` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/data/prisma-schema.test.ts` — assert `schema.prisma` contains models/enums (DATA-01)
- [ ] `tests/data/readme-db-flow.test.ts` — README documents `db:migrate`, `db:seed`, dev credentials (D-29)
- [ ] `scripts/verify-phase2.sh` + `scripts/verify-phase2.ps1` (D-32)
- [ ] `tests/foundation/verify-phase2-scripts.test.ts` — static script content checks
- [ ] Framework: no new install — use root Vitest

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Prisma Studio browse | DATA-03 | Optional UX check | `pnpm db:studio`; confirm products and users visible |
| Fresh DB proof | DATA-02 | Destructive reset | `pnpm db:reset` on empty `shop_dev`; confirm migrate + seed succeed |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s (static tests)
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending

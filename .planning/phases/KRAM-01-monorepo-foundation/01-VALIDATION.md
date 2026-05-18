---
phase: 01
slug: monorepo-foundation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-18
---

# Phase 01 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 3.x (Wave 0 install at repo root) |
| **Config file** | `vitest.config.ts` — none yet; Wave 0 creates |
| **Quick run command** | `pnpm exec vitest run --passWithNoTests` |
| **Full suite command** | `pnpm exec vitest run` |
| **Estimated runtime** | ~5 seconds (smoke tests only) |

---

## Sampling Rate

- **After every task commit:** `pnpm --filter @kramnik/types build` when touching types; `pnpm lint` when configured
- **After every plan wave:** `pnpm build` once all packages have `build` scripts
- **Before `/gsd-verify-work`:** Manual or script: `pnpm install` → `pnpm db:up` → `pnpm dev` → curl health + web; Postgres `pg_isready`
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01-01 | 1 | FOUND-01 | — | Workspace paths exist | unit | `pnpm exec vitest run tests/foundation/workspace-layout.test.ts` | ❌ W0 | ⬜ pending |
| 01-01-02 | 01-01 | 1 | FOUND-01 | — | turbo dev depends on types#build | unit | `pnpm exec vitest run tests/foundation/turbo-config.test.ts` | ❌ W0 | ⬜ pending |
| 01-02-01 | 01-02 | 2 | FOUND-02 | T-01-01 | CORS origin localhost:5173 only | integration | `curl -sf http://localhost:3000/health` | ❌ W0 | ⬜ pending |
| 01-02-02 | 01-02 | 2 | FOUND-02 | — | Web dev server responds | smoke | `curl -sf -o /dev/null http://localhost:5173` | ❌ W0 | ⬜ pending |
| 01-03-01 | 01-03 | 3 | FOUND-03 | T-01-02 | .env not committed; .env.example only | smoke | `docker compose exec -T postgres pg_isready` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `vitest.config.ts` + `vitest` devDependency at root
- [ ] `tests/foundation/workspace-layout.test.ts` — FOUND-01 paths
- [ ] `tests/foundation/turbo-config.test.ts` — parses `turbo.json` for `dependsOn`
- [ ] `scripts/verify-phase1.ps1` or `.sh` — FOUND-02/03 curl/docker smoke
- [ ] `.gitignore` — ensure `apps/api/.env` ignored

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Full dev stack | FOUND-02 | Requires running processes | README: `pnpm install` → `pnpm db:up` → `pnpm dev`; open http://localhost:5173 and http://localhost:3000/health |
| Corepack first run | FOUND-01 | OS-dependent | Fresh machine: `corepack enable` then `pnpm install` |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending

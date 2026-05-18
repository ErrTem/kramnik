---
phase: 01-monorepo-foundation
plan: 01
subsystem: infra
tags: [pnpm, turborepo, vite, vitest, monorepo]

requires: []
provides:
  - pnpm workspace with apps/web, apps/api placeholder, packages/types
  - Turbo dev pipeline depending on @kramnik/types#build
  - Minimal Kramnik Shop shell in apps/web
affects: [01-02, 01-03]

tech-stack:
  added: [pnpm@9.15.9, turbo, vitest, prettier]
  patterns: [pnpm workspaces, turbo task graph, brownfield Vite move]

key-files:
  created:
    - pnpm-workspace.yaml
    - turbo.json
    - packages/types/src/index.ts
    - apps/web/src/app/AppShell.tsx
    - tests/foundation/workspace-layout.test.ts
    - tests/foundation/turbo-config.test.ts
  modified:
    - package.json
    - eslint.config.js
    - .gitignore

key-decisions:
  - "pnpm 9.15.9 via Corepack; package-lock.json removed"
  - "Root eslint shared base; React rules only in apps/web"

patterns-established:
  - "Pattern: turbo dev depends on @kramnik/types#build before persistent dev tasks"
  - "Pattern: apps/web feature-oriented src/app + src/shared layout"

requirements-completed: [FOUND-01]

duration: 25min
completed: 2026-05-18
---

# Phase 01 Plan 01: Monorepo Foundation Summary

**pnpm + Turborepo workspace bootstrapped; brownfield Vite app lives in `apps/web` with a minimal Kramnik Shop shell and `@kramnik/types` stub build wired into `turbo dev`.**

## Performance

- **Duration:** ~25 min
- **Tasks:** 4 (checkpoint + 3 auto)
- **Files modified:** 30+

## Accomplishments

- Root workspace uses pnpm 9.15.9 with `pnpm-workspace.yaml` and `turbo.json`
- `@kramnik/types` compiles to `dist/`; `dev` depends on `@kramnik/types#build`
- Vite React app migrated to `apps/web`; demo UI removed; title "Kramnik Shop"
- Wave 0 Vitest tests for layout and turbo config pass

## Task Commits

1. **Task 1: Wave 0 scaffold** - `f9e8ffc`
2. **Task 2: types + turbo** - `a98e127`
3. **Task 3: apps/web migration** - `4268448`

## Files Created/Modified

- `pnpm-workspace.yaml` - workspace package globs
- `turbo.json` - build/dev/lint task graph
- `packages/types/` - empty types stub with tsc build
- `apps/web/` - Vite app with AppShell
- `tests/foundation/*.test.ts` - automated layout and turbo checks

## Deviations

- `packages/types/tsconfig.json` sets `allowImportingTsExtensions: false` to allow emit (base has it true for Vite apps)

## Issues Encountered

None

## Self-Check: PASSED

- `pnpm exec vitest run tests/foundation/` — pass
- `pnpm --filter @kramnik/types build` — pass
- `pnpm --filter @kramnik/web build` — pass
- No root `package-lock.json` or `src/`

## Next Phase Readiness

Ready for 01-02: NestJS scaffold in `apps/api` and turbo `dev` wiring for web + API.

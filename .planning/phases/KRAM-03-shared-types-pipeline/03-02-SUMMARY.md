---
phase: 03-shared-types-pipeline
plan: 02
subsystem: types
tags: [workspace, turbo]

requires:
  - phase: 03-01
    provides: @kramnik/types build output
provides:
  - apps/api and apps/web workspace dependency on @kramnik/types
  - README no-duplicate-interfaces rule
affects: [phase-4, phase-5]

requirements-completed: [TYPE-02]

duration: —
completed: 2026-05-19
---

# Phase 03 Plan 02: Wire Workspace Types Summary

**API and web import `@kramnik/types`; turbo build graph unchanged (`dev` → `@kramnik/types#build`).**

## Accomplishments

- `@kramnik/api` depends on `@kramnik/types` — `apps/api/src/shared-types.ts` re-exports DTOs
- `@kramnik/web` depends on `@kramnik/types` — `AppShell` uses `ProductPublic[]` placeholder
- README documents shared types rule and exports table

## Verification

- `pnpm build` — `@kramnik/types` and `@kramnik/web` pass; API uses `ignoreDeprecations` for TS 6 node10 resolution warning
- `pnpm exec vitest run tests/data` — pass

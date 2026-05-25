---
phase: 5
slug: catalog-ui
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-05-25
---

# Phase 5 — Validation Strategy

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.x (repo root) |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `pnpm test` |
| **Full suite command** | `pnpm test && pnpm --filter @kramnik/web build && pnpm --filter @kramnik/web lint` |
| **Estimated runtime** | ~30 seconds |

## Sampling Rate

- **After every task commit:** `pnpm test` (when tests added)
- **After every plan wave:** Full suite command above
- **Before `/gsd-verify-work`:** Full suite + manual catalog UAT

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Test Type | Automated Command | Status |
|---------|------|------|-------------|------------|-----------|-------------------|--------|
| 05-01-01 | 01 | 1 | LEARN-02 | T-05-01 | build | `pnpm --filter @kramnik/web build` | ⬜ |
| 05-02-01 | 02 | 2 | CAT-01 | — | manual | UAT grid visible | ⬜ |
| 05-02-02 | 02 | 2 | CAT-02 | — | manual | UAT filters change results | ⬜ |
| 05-03-01 | 03 | 3 | CAT-03 | T-05-02 | manual | UAT detail + disabled cart | ⬜ |

## Wave 0 Requirements

- [ ] `tests/web/format-price.test.ts` — USD formatting from decimal string
- [ ] `tests/web/products-query.test.ts` — query string builder for API params

*If skipped in execution: document in SUMMARY; manual UAT still required.*

## Manual-Only Verifications

| Behavior | Requirement | Test Instructions |
|----------|-------------|-------------------|
| Responsive grid | CAT-01, LEARN-03 | Resize viewport; 1/2/3–4 columns |
| Filter cache | CAT-02, CAT-04 | Change category; list updates without full reload |
| Loading/error | CAT-04 | Throttle network or stop API |
| Disabled add-to-cart | CAT-03 | Detail page button not clickable |

#!/usr/bin/env bash
# Preconditions: API running on port 3000; `pnpm db:up` completed for postgres step.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
bash "$ROOT/scripts/verify-api-health.sh"
bash "$ROOT/scripts/verify-postgres.sh"

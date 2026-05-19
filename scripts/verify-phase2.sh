#!/usr/bin/env bash
# Preconditions: `pnpm db:up`; `pnpm db:migrate` and `pnpm db:seed` already run.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
bash "$ROOT/scripts/verify-postgres.sh"

count="$(docker compose exec -T postgres psql -U postgres -d shop_dev -tAc \
  'SELECT COUNT(*)::int FROM "Product"')"
if [[ "${count// /}" -lt 12 ]]; then
  echo "Expected at least 12 Product rows, got ${count}" >&2
  exit 1
fi

admin="$(docker compose exec -T postgres psql -U postgres -d shop_dev -tAc \
  "SELECT 1 FROM \"User\" WHERE email='admin@kramnik.local' LIMIT 1")"
if [[ "${admin// /}" != "1" ]]; then
  echo "Expected admin@kramnik.local in User table" >&2
  exit 1
fi

echo "Phase 2 DB gate passed (${count} products, admin user present)."

# Preconditions: `pnpm db:up`; `pnpm db:migrate` and `pnpm db:seed` already run.
$ErrorActionPreference = 'Stop'

$Root = Split-Path -Parent $PSScriptRoot
& (Join-Path $Root 'scripts/verify-postgres.ps1')

$countRaw = docker compose exec -T postgres psql -U postgres -d shop_dev -tAc "SELECT COUNT(*)::int FROM \`"Product\`""
if ($LASTEXITCODE -ne 0) {
  throw 'Failed to count Product rows'
}
$count = [int]($countRaw.Trim())
if ($count -lt 12) {
  throw "Expected at least 12 Product rows, got $count"
}

$adminRaw = docker compose exec -T postgres psql -U postgres -d shop_dev -tAc "SELECT 1 FROM \`"User\`" WHERE email='admin@kramnik.local' LIMIT 1"
if ($LASTEXITCODE -ne 0) {
  throw 'Failed to query admin user'
}
if ($adminRaw.Trim() -ne '1') {
  throw 'Expected admin@kramnik.local in User table'
}

Write-Host "Phase 2 DB gate passed ($count products, admin user present)."

# Preconditions: API running on port 3000; `pnpm db:up` completed for postgres step.
$ErrorActionPreference = 'Stop'

$Root = Split-Path -Parent $PSScriptRoot
& (Join-Path $Root 'scripts/verify-api-health.ps1')
& (Join-Path $Root 'scripts/verify-postgres.ps1')

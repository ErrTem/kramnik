# Precondition: operator ran `pnpm db:up` and Docker Compose stack is running.
$ErrorActionPreference = 'Stop'

docker compose exec -T postgres pg_isready -U postgres
if ($LASTEXITCODE -ne 0) {
  throw 'PostgreSQL is not ready'
}

#!/usr/bin/env bash
# Precondition: operator ran `pnpm db:up` and Docker Compose stack is running.
set -euo pipefail

docker compose exec -T postgres pg_isready -U postgres

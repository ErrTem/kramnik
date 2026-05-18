#!/usr/bin/env bash
# Precondition: API is already running on port 3000 (e.g. pnpm dev in another terminal).
set -euo pipefail

curl -sf http://localhost:3000/health | grep -q '"ok"'
curl -sf http://localhost:3000/ | grep -q 'Kramnik Shop API'

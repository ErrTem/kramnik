# Precondition: API is already running on port 3000 (e.g. pnpm dev in another terminal).
$ErrorActionPreference = 'Stop'

$health = Invoke-WebRequest -Uri 'http://localhost:3000/health' -UseBasicParsing
if ($health.Content -notmatch 'ok') {
  throw 'Health endpoint did not return status ok'
}

$root = Invoke-WebRequest -Uri 'http://localhost:3000/' -UseBasicParsing
if ($root.Content -notmatch 'Kramnik Shop API') {
  throw 'Root endpoint did not return welcome message'
}

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const root = join(import.meta.dirname, '../..')

describe('API health verification scripts', () => {
  it('shell script targets localhost:3000/health', () => {
    const sh = readFileSync(join(root, 'scripts/verify-api-health.sh'), 'utf8')
    expect(sh).toContain('localhost:3000/health')
    expect(sh).toContain('3000')
  })

  it('powershell script targets port 3000 health', () => {
    const ps1 = readFileSync(join(root, 'scripts/verify-api-health.ps1'), 'utf8')
    expect(ps1).toContain('3000')
    expect(ps1).toContain('health')
  })
})

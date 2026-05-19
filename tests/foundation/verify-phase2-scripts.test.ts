import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const root = join(import.meta.dirname, '../..')

describe('phase 2 verification scripts', () => {
  it('shell and powershell scripts chain postgres and check seed data', () => {
    const sh = readFileSync(join(root, 'scripts/verify-phase2.sh'), 'utf8')
    const ps1 = readFileSync(join(root, 'scripts/verify-phase2.ps1'), 'utf8')
    expect(sh).toContain('verify-postgres')
    expect(sh).toContain('Product')
    expect(sh).toContain('admin@kramnik.local')
    expect(sh).toContain('shop_dev')
    expect(ps1).toContain('verify-postgres')
    expect(ps1).toContain('Product')
    expect(ps1).toContain('admin@kramnik.local')
    expect(ps1).toContain('shop_dev')
  })
})

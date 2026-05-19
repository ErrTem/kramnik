import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const seedPath = join(import.meta.dirname, '../../apps/api/prisma/seed.ts')

describe('prisma seed script', () => {
  it('uses bcryptjs, upsert, and passwordHash without persisting plaintext passwords', () => {
    const seed = readFileSync(seedPath, 'utf8')
    expect(seed).toMatch(/bcryptjs|bcrypt/)
    expect(seed).toContain('upsert')
    expect(seed).toContain('admin@kramnik.local')
    expect(seed).toContain('customer@kramnik.local')
    expect(seed).toContain('passwordHash')
    expect(seed).not.toMatch(/passwordHash:\s*['"]Admin123!['"]/)
    expect(seed).not.toMatch(/passwordHash:\s*['"]Customer123!['"]/)
    expect(seed).not.toContain('prisma.order.create')
    expect(seed).not.toContain('prisma.order.upsert')
  })

  it('defines at least twelve products across categories', () => {
    const seed = readFileSync(seedPath, 'utf8')
    const slugMatches = seed.match(/slug:\s*'[^']+'/g) ?? []
    expect(slugMatches.length).toBeGreaterThanOrEqual(12)
    expect(seed).toContain('Category.HOME')
    expect(seed).toContain('Category.GARBAGE')
    expect(seed).toContain('Category.SCRAPS')
    expect(seed).toContain('Category.GARDEN_GNOMES')
  })
})

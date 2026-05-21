import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const typesRoot = join(import.meta.dirname, '../../packages/types/src')

describe('packages/types DTO contracts', () => {
  it('defines ProductPublic with string price from Prisma Product', () => {
    const product = readFileSync(join(typesRoot, 'product.ts'), 'utf8')
    expect(product).toContain('Omit<Product')
    expect(product).toContain('price: string')
    expect(product).not.toContain('passwordHash')
  })

  it('defines UserPublic without passwordHash', () => {
    const user = readFileSync(join(typesRoot, 'user.ts'), 'utf8')
    expect(user).toContain("Omit<User, 'passwordHash'>")
  })

  it('maps decimals to strings in mappers', () => {
    const mappers = readFileSync(join(typesRoot, 'mappers.ts'), 'utf8')
    expect(mappers).toContain('toProductPublic')
    expect(mappers).toContain('price.toString()')
    expect(mappers).toContain('toUserPublic')
    expect(mappers).not.toMatch(/passwordHash:\s*['"]/)
  })

  it('package.json generates client from apps/api schema path', () => {
    const pkg = readFileSync(
      join(import.meta.dirname, '../../packages/types/package.json'),
      'utf8',
    )
    expect(pkg).toContain('apps/api/prisma/schema.prisma')
    expect(pkg).toContain('@prisma/client')
  })
})

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const composePath = join(import.meta.dirname, '../../docker-compose.yml')

describe('docker-compose.yml', () => {
  it('defines postgres:16 shop_dev on 5432', () => {
    const text = readFileSync(composePath, 'utf8')
    expect(text).toContain('postgres:16')
    expect(text).toContain('shop_dev')
    expect(text).toContain('5432:5432')
    expect(text).toContain('POSTGRES_USER: postgres')
    expect(text).toContain('postgres_data')
  })
})

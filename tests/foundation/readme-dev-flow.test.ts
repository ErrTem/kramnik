import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const readmePath = join(import.meta.dirname, '../../README.md')

describe('README local development', () => {
  it('documents monorepo dev flow and ports', () => {
    const text = readFileSync(readmePath, 'utf8').toLowerCase()
    expect(text).toContain('pnpm db:up')
    expect(text).toContain('pnpm dev')
    expect(text).toContain('5173')
    expect(text).toContain('3000')
    expect(text).toContain('5432')
    expect(text).toMatch(/do not start postgres|does not start postgres|not start postgres/)
  })
})

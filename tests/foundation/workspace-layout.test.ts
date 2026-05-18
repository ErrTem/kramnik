import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const root = join(import.meta.dirname, '../..')

describe('workspace layout', () => {
  it('has apps/web, apps/api, and packages/types', () => {
    expect(existsSync(join(root, 'apps/web'))).toBe(true)
    expect(existsSync(join(root, 'apps/api'))).toBe(true)
    expect(existsSync(join(root, 'packages/types'))).toBe(true)
  })
})

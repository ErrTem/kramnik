import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const readmePath = join(import.meta.dirname, '../../README.md');

describe('README database workflow', () => {
  it('documents migrate, seed, studio, reset, and dev-only app logins', () => {
    const text = readFileSync(readmePath, 'utf8').toLowerCase();
    expect(text).toContain('pnpm db:up');
    expect(text).toContain('pnpm db:migrate');
    expect(text).toContain('pnpm db:seed');
    expect(text).toContain('pnpm db:studio');
    expect(text).toContain('pnpm db:reset');
    expect(text).toContain('admin@kramnik.local');
    expect(text).toContain('customer@kramnik.local');
    expect(text).toMatch(/dev only|dev-only|never production|never reuse/);
    expect(text).toMatch(/decimal.*string|string.*decimal|phase 3/);
  });
});

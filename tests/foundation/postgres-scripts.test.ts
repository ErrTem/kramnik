import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = join(import.meta.dirname, '../..');

describe('postgres verification scripts', () => {
  it('shell and powershell scripts invoke pg_isready on postgres service', () => {
    const sh = readFileSync(join(root, 'scripts/verify-postgres.sh'), 'utf8');
    const ps1 = readFileSync(join(root, 'scripts/verify-postgres.ps1'), 'utf8');
    expect(sh).toContain('pg_isready');
    expect(sh).toContain('postgres');
    expect(ps1).toContain('pg_isready');
    expect(ps1).toContain('postgres');
  });

  it('phase gate scripts chain API and postgres checks', () => {
    const sh = readFileSync(join(root, 'scripts/verify-phase1.sh'), 'utf8');
    const ps1 = readFileSync(join(root, 'scripts/verify-phase1.ps1'), 'utf8');
    expect(sh).toContain('verify-api-health');
    expect(sh).toContain('verify-postgres');
    expect(ps1).toContain('verify-api-health');
    expect(ps1).toContain('verify-postgres');
  });
});

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const turboPath = join(import.meta.dirname, '../../turbo.json');

describe('turbo.json dev pipeline', () => {
  it('depends on @kramnik/types#build', () => {
    const turbo = JSON.parse(readFileSync(turboPath, 'utf8')) as {
      tasks: { dev: { dependsOn: string[] } };
    };
    expect(turbo.tasks.dev.dependsOn).toContain('@kramnik/types#build');
    expect(turbo.tasks.dev.dependsOn).not.toContain('^dev');
  });
});

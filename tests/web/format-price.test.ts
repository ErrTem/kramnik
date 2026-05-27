import { describe, expect, it } from 'vitest';

import { formatPrice } from '../../apps/web/src/shared/lib/formatPrice.ts';

describe('formatPrice', () => {
  it('formats a decimal string as USD', () => {
    const result = formatPrice('19.99');
    expect(result).toContain('$');
    expect(result).toContain('19.99');
  });
});

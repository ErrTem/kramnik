import { describe, expect, it } from 'vitest';

import { buildProductListQueryString } from '../../apps/web/src/shared/api/products.ts';

describe('buildProductListQueryString', () => {
  it('includes category when set', () => {
    const qs = buildProductListQueryString({ category: 'HOME' });
    expect(qs).toContain('category=HOME');
  });

  it('omits empty optional params', () => {
    expect(buildProductListQueryString({})).toBe('');
  });

  it('includes search and price filters when set', () => {
    const qs = buildProductListQueryString({
      q: 'gnome',
      minPrice: '10',
      maxPrice: '50',
    });
    expect(qs).toContain('q=gnome');
    expect(qs).toContain('minPrice=10');
    expect(qs).toContain('maxPrice=50');
  });
});

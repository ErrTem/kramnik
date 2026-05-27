import type { ProductPublic } from '@kramnik/types';

/** Placeholder until Phase 5 catalog — list items will be `ProductPublic[]`. */
const emptyCatalog: ProductPublic[] = [];

export function AppShell() {
  return (
    <main>
      <h1>Kramnik Shop</h1>
      <p data-catalog-count={emptyCatalog.length}>
        Catalog loads in a later phase.
      </p>
    </main>
  );
}

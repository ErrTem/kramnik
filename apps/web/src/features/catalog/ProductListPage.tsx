import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import {
  fetchProducts,
  type ProductListParams,
} from '../../shared/api/products.ts';
import { ProductCard, ProductCardSkeleton } from './ProductCard.tsx';
import { ProductFilters } from './ProductFilters.tsx';

const SKELETON_COUNT = 6;

export function ProductListPage() {
  const [filters, setFilters] = useState<ProductListParams>({});

  const {
    data,
    isPending,
    isFetching,
    isPlaceholderData,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => fetchProducts(filters),
    placeholderData: keepPreviousData,
  });

  const showSkeleton = isPending && !data;

  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold">Products</h2>
      <ProductFilters onFiltersChange={setFilters} />

      {showSkeleton && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: SKELETON_COUNT }, (_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      )}

      {isError && !data && (
        <div
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800"
          role="alert"
        >
          <p className="font-medium">Could not load products</p>
          <p className="mt-1 text-sm">
            {error instanceof Error ? error.message : 'Something went wrong'}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-3 rounded bg-red-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-800 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Retry
          </button>
        </div>
      )}

      {data && (
        <>
          {isFetching && !showSkeleton && (
            <div className="fixed right-4 bottom-4 z-50 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-lg">
              Updating...
            </div>
          )}

          <div
            className={isPlaceholderData ? 'opacity-60 transition-opacity' : ''}
          >
            {data.length === 0 ? (
              <div>
                <p className="rounded-lg border border-gray-200 bg-white p-6 text-center text-gray-600">
                  No products match your filters.
                </p>
                <button
                  type="button"
                  onClick={() => setFilters({})}
                  className="ml-auto rounded border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
                >
                  Reset
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {data.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}

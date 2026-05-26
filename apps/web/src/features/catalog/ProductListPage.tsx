import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { fetchProducts, type ProductListParams } from '../../shared/api/products.ts'
import { ProductCard, ProductCardSkeleton } from './ProductCard.tsx'
import { ProductFilters } from './ProductFilters.tsx'

const SKELETON_COUNT = 6

export function ProductListPage() {
  const [filters, setFilters] = useState<ProductListParams>({})

  const { data, isPending, isError, error, refetch, isSuccess } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => fetchProducts(filters),
  })

  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold">Products</h2>
      <ProductFilters onFiltersChange={setFilters} />

      {isPending && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: SKELETON_COUNT }, (_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      )}

      {isError && (
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
            className="mt-3 rounded bg-red-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
          >
            Retry
          </button>
        </div>
      )}

      {isSuccess && data.length === 0 && (
        <p className="rounded-lg border border-gray-200 bg-white p-6 text-center text-gray-600">
          No products match your filters.
        </p>
      )}

      {isSuccess && data.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  )
}

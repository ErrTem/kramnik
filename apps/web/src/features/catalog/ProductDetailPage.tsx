import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { fetchProduct } from '../../shared/api/products.ts'
import { formatPrice } from '../../shared/lib/formatPrice.ts'
import { categoryLabel } from '../../shared/lib/categoryLabel.ts'

function isNotFoundError(error: unknown): boolean {
  if (!(error instanceof Error)) return false
  const msg = error.message.toLowerCase()
  return msg.startsWith('404') || msg.includes('not found')
}

function ProductDetailSkeleton() {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="aspect-[4/3] w-full animate-pulse rounded-lg bg-gray-200" />
      <div className="space-y-4">
        <div className="h-8 w-3/4 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
        <div className="h-6 w-28 animate-pulse rounded bg-gray-200" />
        <div className="space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    </div>
  )
}

export function ProductDetailPage() {
  const { id } = useParams()
  const productId = id ?? ''

  const { data: product, isPending, isError, error, refetch, isSuccess } =
    useQuery({
      queryKey: ['products', productId],
      queryFn: () => fetchProduct(productId),
      enabled: Boolean(productId),
    })

  const [imageFailed, setImageFailed] = useState(false)

  useEffect(() => {
    setImageFailed(false)
  }, [product?.id])

  const showImage = product?.imageUrl && !imageFailed

  if (!productId) {
    return (
      <section>
        <Link
          to="/products"
          className="mb-6 inline-block text-sm text-blue-600 hover:underline"
        >
          ← Back to products
        </Link>
        <p className="text-gray-600">Product not found.</p>
        <Link to="/products" className="mt-2 inline-block text-blue-600 underline">
          Browse all products
        </Link>
      </section>
    )
  }

  return (
    <section>
      <Link
        to="/products"
        className="mb-6 inline-block text-sm text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        ← Back to products
      </Link>

      {isPending && <ProductDetailSkeleton />}

      {isError && (
        <div
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800"
          role="alert"
        >
          {isNotFoundError(error) ? (
            <>
              <p className="font-medium">Product not found</p>
              <p className="mt-1 text-sm">
                This item may have been removed or the link is invalid.
              </p>
              <Link
                to="/products"
                className="mt-3 inline-block text-sm font-medium text-red-900 underline"
              >
                Browse all products
              </Link>
            </>
          ) : (
            <>
              <p className="font-medium">Could not load product</p>
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
            </>
          )}
        </div>
      )}

      {isSuccess && product && (
        <article className="grid gap-8 md:grid-cols-2">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-gray-100">
            {showImage ? (
              <img
                src={product.imageUrl!}
                alt={product.name}
                className="h-full w-full object-cover"
                onError={() => setImageFailed(true)}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-400">
                No image
              </div>
            )}
          </div>

          <div>
            <span className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
              {categoryLabel(product.category)}
            </span>
            <h1 className="mt-3 text-2xl font-bold text-gray-900">{product.name}</h1>
            <p className="mt-2 text-2xl font-semibold text-gray-900">
              {formatPrice(product.price)}
            </p>
            <p className="mt-6 leading-relaxed text-gray-700">{product.description}</p>

            <button
              type="button"
              disabled
              aria-disabled="true"
              className="mt-8 cursor-not-allowed rounded-lg bg-gray-300 px-4 py-2.5 font-medium text-gray-600"
            >
              Add to cart (coming soon)
            </button>
            <p className="mt-2 text-sm text-gray-500">
              Shopping cart arrives in Phase 7 — browse for now.
            </p>
          </div>
        </article>
      )}
    </section>
  )
}

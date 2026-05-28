import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { ProductPublic } from '@kramnik/types';

import { formatPrice } from '../../shared/lib/formatPrice.ts';
import { categoryLabel } from '../../shared/lib/categoryLabel.ts';

type ProductCardProps = {
  product: ProductPublic;
  onMouseEnter?: () => void
  onMouseLeave?: () => void  
};

export function ProductCard({ product, onMouseEnter, onMouseLeave }: ProductCardProps) {
  const [imageFailed, setImageFailed] = useState(false);

  const showImage = product.imageUrl && !imageFailed;

  return (
    <Link
      to={`/products/${product.id}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:shadow-md focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
        {showImage ? (
          <img
            src={product.imageUrl!}
            alt={product.name}
            className="h-full w-full object-cover transition group-hover:scale-[1.02]"
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center text-sm text-gray-400"
            aria-hidden
          >
            No image
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <span className="w-fit rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
          {categoryLabel(product.category)}
        </span>
        <h3 className="line-clamp-2 font-medium text-gray-900">
          {product.name}
        </h3>
        <p className="mt-auto text-base font-semibold text-gray-900">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}

export function ProductCardSkeleton() {
  return (
    <div
      className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
      aria-hidden
    >
      <div className="aspect-[4/3] w-full animate-pulse bg-gray-200" />
      <div className="space-y-2 p-3">
        <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
        <div className="h-5 w-20 animate-pulse rounded bg-gray-200" />
      </div>
    </div>
  );
}

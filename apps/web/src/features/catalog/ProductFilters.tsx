import type { Category } from '@kramnik/types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import type { ProductListParams } from '../../shared/api/products.ts';
import { categoryLabel } from '../../shared/lib/categoryLabel.ts';

const CATEGORIES: Category[] = ['HOME', 'GARBAGE', 'SCRAPS', 'GARDEN_GNOMES'];

const DEBOUNCE_MS = 1000;

function isCategory(value: string): value is Category {
  return (CATEGORIES as string[]).includes(value);
}

function parseFiltersFromUrl(params: URLSearchParams): ProductListParams {
  const categoryRaw = params.get('category');
  return {
    category: categoryRaw && isCategory(categoryRaw) ? categoryRaw : undefined,
    q: params.get('q') ?? undefined,
    minPrice: params.get('minPrice') ?? undefined,
    maxPrice: params.get('maxPrice') ?? undefined,
  };
}

function filtersToUrlParams(filters: ProductListParams): URLSearchParams {
  const next = new URLSearchParams();
  if (filters.category) next.set('category', filters.category);
  if (filters.q?.trim()) next.set('q', filters.q.trim());
  if (filters.minPrice) next.set('minPrice', filters.minPrice);
  if (filters.maxPrice) next.set('maxPrice', filters.maxPrice);
  return next;
}

function filtersFromInputs(
  category: string,
  qInput: string,
  minPrice: string,
  maxPrice: string,
): ProductListParams {
  return {
    category: isCategory(category) ? category : undefined,
    q: qInput.trim() || undefined,
    minPrice: minPrice || undefined,
    maxPrice: maxPrice || undefined,
  };
}

type ProductFiltersProps = {
  onFiltersChange: (filters: ProductListParams) => void;
};

export function ProductFilters({ onFiltersChange }: ProductFiltersProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const initial = parseFiltersFromUrl(searchParams);
  const [category, setCategory] = useState(initial.category ?? '');
  const [qInput, setQInput] = useState(initial.q ?? '');
  const [minPrice, setMinPrice] = useState(initial.minPrice ?? '');
  const [maxPrice, setMaxPrice] = useState(initial.maxPrice ?? '');
  const [maxPriceError, setMaxPriceError] = useState(false);

  const lastSyncedUrl = useRef(searchParams.toString());

  const commit = useCallback(
    (filters: ProductListParams) => {
      const nextUrl = filtersToUrlParams(filters).toString();
      lastSyncedUrl.current = nextUrl;
      setSearchParams(filtersToUrlParams(filters), { replace: true });
      onFiltersChange(filters);
    },
    [onFiltersChange, setSearchParams],
  );

  const resetFilters = (): void => {
    setCategory('');
    setQInput('');
    setMinPrice('');
    setMaxPrice('');
    commit({});
  };

  const commitFromInputs = useCallback(() => {
    commit(filtersFromInputs(category, qInput, minPrice, maxPrice));
  }, [category, qInput, minPrice, maxPrice, commit]);

  useEffect(() => {
    onFiltersChange(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount
  }, []);

  useEffect(() => {
    const current = searchParams.toString();
    if (current === lastSyncedUrl.current) return;

    const parsed = parseFiltersFromUrl(searchParams);
    setCategory(parsed.category ?? '');
    setQInput(parsed.q ?? '');
    setMinPrice(parsed.minPrice ?? '');
    setMaxPrice(parsed.maxPrice ?? '');
    lastSyncedUrl.current = current;
    onFiltersChange(parsed);
  }, [searchParams, onFiltersChange]);

  useEffect(() => {
    const handle = window.setTimeout(commitFromInputs, DEBOUNCE_MS);
    return () => window.clearTimeout(handle);
  }, [qInput, commitFromInputs]);

  useEffect(() => {
    const handle = window.setTimeout(commitFromInputs, DEBOUNCE_MS);
    return () => window.clearTimeout(handle);
  }, [minPrice, maxPrice, commitFromInputs]);

  const handlePriceChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'min' | 'max',
  ) => {
    const val = e.target.value;
    if (val === '' || /^[0-9]+$/.test(val)) {
      if (type === 'min') setMinPrice(val);
      else {
        setMaxPrice(val);
      }
    }
  };

  useEffect(() => {
    if (!minPrice || !maxPrice) {
      setMaxPriceError(false);
      return;
    }

    const min = Number(minPrice);
    const max = Number(maxPrice);
    setMaxPriceError(Number.isFinite(min) && Number.isFinite(max) && min > max);
  }, [minPrice, maxPrice]);

  return (
    <div className="mb-6 flex flex-wrap items-end gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <label className="flex min-w-[10rem] flex-col gap-1 text-sm">
        <span className="font-medium text-gray-700">Category</span>
        <select
          className="rounded border border-gray-300 px-2 py-1.5 focus-visible:ring-2 focus-visible:ring-blue-500"
          value={category}
          onChange={(e) => {
            const value = e.target.value;
            setCategory(value);
            commit(filtersFromInputs(value, qInput, minPrice, maxPrice));
          }}
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option
              key={c}
              value={c}
            >
              {categoryLabel(c)}
            </option>
          ))}
        </select>
      </label>

      <label className="flex min-w-[12rem] flex-1 flex-col gap-1 text-sm">
        <span className="font-medium text-gray-700">Search</span>
        <input
          type="search"
          className="rounded border border-gray-300 px-2 py-1.5 focus-visible:ring-2 focus-visible:ring-blue-500"
          placeholder="Name or description"
          value={qInput}
          onChange={(e) => setQInput(e.target.value)}
        />
      </label>

      <label className="flex w-28 flex-col gap-1 text-sm">
        <span className="font-medium text-gray-700">Min price</span>
        <input
          type="text"
          inputMode="numeric"
          className={`rounded border px-2 py-1.5 focus-visible:ring-2 focus-visible:ring-blue-500 ${
            maxPriceError ? 'border-red-400' : 'border-gray-300'
          }`}
          value={minPrice}
          onChange={(e) => {
            handlePriceChange(e, 'min');
          }}
        />
      </label>

      <label className="flex w-28 flex-col gap-1 text-sm">
        <span className="font-medium text-gray-700">Max price</span>
        <input
          type="text"
          inputMode="numeric"
          className={`rounded border px-2 py-1.5 focus-visible:ring-2 focus-visible:ring-blue-500 ${
            maxPriceError ? 'border-red-400' : 'border-gray-300'
          }`}
          value={maxPrice}
          onChange={(e) => {
            handlePriceChange(e, 'max');
          }}
        />
      </label>

      <button
        type="button"
        onClick={resetFilters}
        disabled={!category && !qInput && !minPrice && !maxPrice}
        className="ml-auto rounded border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none disabled:opacity-50"
      >
        Reset
      </button>
    </div>
  );
}

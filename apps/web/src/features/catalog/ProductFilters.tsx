import { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { Category } from '@kramnik/types'

import type { ProductListParams } from '../../shared/api/products.ts'
import { categoryLabel } from '../../shared/lib/categoryLabel.ts'

const CATEGORIES: Category[] = [
  'HOME',
  'GARBAGE',
  'SCRAPS',
  'GARDEN_GNOMES',
]

const DEBOUNCE_MS = 300

function isCategory(value: string): value is Category {
  return (CATEGORIES as string[]).includes(value)
}

function parseFiltersFromUrl(params: URLSearchParams): ProductListParams {
  const categoryRaw = params.get('category')
  return {
    category:
      categoryRaw && isCategory(categoryRaw) ? categoryRaw : undefined,
    q: params.get('q') ?? undefined,
    minPrice: params.get('minPrice') ?? undefined,
    maxPrice: params.get('maxPrice') ?? undefined,
  }
}

function filtersToUrlParams(filters: ProductListParams): URLSearchParams {
  const next = new URLSearchParams()
  if (filters.category) next.set('category', filters.category)
  if (filters.q?.trim()) next.set('q', filters.q.trim())
  if (filters.minPrice) next.set('minPrice', filters.minPrice)
  if (filters.maxPrice) next.set('maxPrice', filters.maxPrice)
  return next
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
  }
}

type ProductFiltersProps = {
  onFiltersChange: (filters: ProductListParams) => void
}

export function ProductFilters({ onFiltersChange }: ProductFiltersProps) {
  const [searchParams, setSearchParams] = useSearchParams()

  const initial = parseFiltersFromUrl(searchParams)
  const [category, setCategory] = useState(initial.category ?? '')
  const [qInput, setQInput] = useState(initial.q ?? '')
  const [minPrice, setMinPrice] = useState(initial.minPrice ?? '')
  const [maxPrice, setMaxPrice] = useState(initial.maxPrice ?? '')

  const lastSyncedUrl = useRef(searchParams.toString())

  const commit = useCallback(
    (filters: ProductListParams) => {
      const nextUrl = filtersToUrlParams(filters).toString()
      lastSyncedUrl.current = nextUrl
      setSearchParams(filtersToUrlParams(filters), { replace: true })
      onFiltersChange(filters)
    },
    [onFiltersChange, setSearchParams],
  )

  const commitFromInputs = useCallback(() => {
    commit(filtersFromInputs(category, qInput, minPrice, maxPrice))
  }, [category, qInput, minPrice, maxPrice, commit])

  useEffect(() => {
    onFiltersChange(initial)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount
  }, [])

  useEffect(() => {
    const current = searchParams.toString()
    if (current === lastSyncedUrl.current) return

    const parsed = parseFiltersFromUrl(searchParams)
    setCategory(parsed.category ?? '')
    setQInput(parsed.q ?? '')
    setMinPrice(parsed.minPrice ?? '')
    setMaxPrice(parsed.maxPrice ?? '')
    lastSyncedUrl.current = current
    onFiltersChange(parsed)
  }, [searchParams, onFiltersChange])

  useEffect(() => {
    const handle = window.setTimeout(commitFromInputs, DEBOUNCE_MS)
    return () => window.clearTimeout(handle)
  }, [qInput, commitFromInputs])

  return (
    <div className="mb-6 flex flex-wrap items-end gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <label className="flex min-w-[10rem] flex-col gap-1 text-sm">
        <span className="font-medium text-gray-700">Category</span>
        <select
          className="rounded border border-gray-300 px-2 py-1.5 focus-visible:ring-2 focus-visible:ring-blue-500"
          value={category}
          onChange={(e) => {
            const value = e.target.value
            setCategory(value)
            commit(
              filtersFromInputs(value, qInput, minPrice, maxPrice),
            )
          }}
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
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
          inputMode="decimal"
          className="rounded border border-gray-300 px-2 py-1.5 focus-visible:ring-2 focus-visible:ring-blue-500"
          value={minPrice}
          onChange={(e) => {
            const value = e.target.value
            setMinPrice(value)
            commit(filtersFromInputs(category, qInput, value, maxPrice))
          }}
        />
      </label>

      <label className="flex w-28 flex-col gap-1 text-sm">
        <span className="font-medium text-gray-700">Max price</span>
        <input
          type="text"
          inputMode="decimal"
          className="rounded border border-gray-300 px-2 py-1.5 focus-visible:ring-2 focus-visible:ring-blue-500"
          value={maxPrice}
          onChange={(e) => {
            const value = e.target.value
            setMaxPrice(value)
            commit(filtersFromInputs(category, qInput, minPrice, value))
          }}
        />
      </label>
    </div>
  )
}

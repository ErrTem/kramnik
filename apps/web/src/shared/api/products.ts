import type { Category, ProductPublic } from '@kramnik/types'
import { fetchJson } from './client.ts'

export type ProductListParams = {
    category?: Category
    q?: string
    minPrice?: string
    maxPrice?: string
}
export function buildProductListQueryString(
    params: ProductListParams = {},
): string {
    const search = new URLSearchParams()
    if (params.category) {
        search.set('category', params.category)
    }
    if (params.q?.trim()) {
        search.set('q', params.q.trim())
    }
    if (params.minPrice) {
        search.set('minPrice', params.minPrice)
    }
    if (params.maxPrice) {
        search.set('maxPrice', params.maxPrice)
    }
    return search.toString()
}

export async function fetchProducts(
    params: ProductListParams = {},
): Promise<ProductPublic[]> {
    const qs = buildProductListQueryString(params)
    const path = qs ? `/products?${qs}` : '/products'

    return fetchJson<ProductPublic[]>(path)
}
export async function fetchProduct(id: string): Promise<ProductPublic> {
    return fetchJson<ProductPublic>(`/products/${id}`)
}
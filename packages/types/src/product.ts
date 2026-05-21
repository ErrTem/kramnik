import type { Category, Product } from '@prisma/client'

/** Public catalog shape — `price` is a decimal string for JSON (D-15). */
export type ProductPublic = Omit<Product, 'price'> & {
  price: string
}

export type { Category }

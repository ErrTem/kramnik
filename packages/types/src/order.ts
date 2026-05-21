import type { Order, OrderItem } from '@prisma/client'

/** Order summary for authenticated clients — money fields as strings. */
export type OrderPublic = Omit<Order, 'total'> & {
  total: string
}

/** Line item with snapshotted product name and string unit price. */
export type OrderItemPublic = Omit<OrderItem, 'unitPrice'> & {
  unitPrice: string
}

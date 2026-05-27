import type { Order, OrderItem, Product, User } from '@prisma/client';

import type { OrderItemPublic, OrderPublic } from './order';
import type { ProductPublic } from './product';
import type { UserPublic } from './user';

export function toProductPublic(product: Product): ProductPublic {
  const { price, ...rest } = product;
  return { ...rest, price: price.toString() };
}

export function toUserPublic(user: User): UserPublic {
  const { passwordHash: _passwordHash, ...rest } = user;
  return rest;
}

export function toOrderPublic(order: Order): OrderPublic {
  const { total, ...rest } = order;
  return { ...rest, total: total.toString() };
}

export function toOrderItemPublic(item: OrderItem): OrderItemPublic {
  const { unitPrice, ...rest } = item;
  return { ...rest, unitPrice: unitPrice.toString() };
}

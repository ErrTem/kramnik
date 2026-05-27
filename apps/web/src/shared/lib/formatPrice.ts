export function formatPrice(price: string): string {
  const value = Number.parseFloat(price);
  if (Number.isNaN(value)) {
    return price;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

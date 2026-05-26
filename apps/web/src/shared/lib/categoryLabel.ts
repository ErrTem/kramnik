import type { Category } from '@kramnik/types'
const LABELS: Record<Category, string> = {
  HOME: 'Home',
  GARBAGE: 'Garbage',
  SCRAPS: 'Scraps',
  GARDEN_GNOMES: 'Garden Gnomes',
}
export function categoryLabel(category: Category): string {
  return LABELS[category]
}

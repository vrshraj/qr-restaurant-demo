import { MENU_ITEMS } from '../data'

export interface RecommendedItem {
  id: string
  name: string
  price: number
  image: string
  frequency?: number
}

/**
 * Logic (Issue 4B): "What items appear most in orders that also contain [items currently in cart]?"
 * For this mock implementation, we return a few popular items that aren't in the cart.
 */
export async function getRecommendations(cartItemIds: string[]): Promise<RecommendedItem[]> {
  // In a real app, this would be the SQL query described in the requirements.
  // For now, we'll return some curated items based on the first item in the cart.
  
  const allItems = MENU_ITEMS
  const inCart = new Set(cartItemIds)
  
  // Rule-based mock logic
  const recommendations = allItems
    .filter(item => !inCart.has(item.id))
    .slice(0, 3) // Just pick first 3 available items for now
    .map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image
    }))

  return recommendations
}

/**
 * Logic (Issue 4A): "Goes well with" items defined in the paired_items column.
 */
export function getPairedItems(itemId: string): RecommendedItem[] {
  const item = MENU_ITEMS.find(i => i.id === itemId)
  if (!item || !item.paired_items) return []
  
  return item.paired_items
    .map(id => MENU_ITEMS.find(i => i.id === id))
    .filter(Boolean) as RecommendedItem[]
}

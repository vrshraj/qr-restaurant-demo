import { create } from 'zustand'

export type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
  imageUrl?: string
  modifiers?: string[]
  note?: string
}

export type PlacedOrderItem = CartItem & {
  status: 'pending' | 'accepted' | 'cooking' | 'ready' | 'served'
  placedAt: Date
}

export type TabType = 'menu' | 'myorder' | 'cart' | 'assist'

interface CartStore {
  // CART STATE
  cartItems: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeItem: (id: string, modifiers?: string[]) => void
  updateQuantity: (id: string, modifiers: string[] | undefined, qty: number) => void
  clearCart: () => void
  cartTotal: () => number
  cartCount: () => number

  // PLACED ORDER STATE
  placedItems: PlacedOrderItem[]
  setPlacedItems: (items: PlacedOrderItem[]) => void

  // NAVIGATION STATE
  activeTab: TabType
  setActiveTab: (tab: TabType) => void

  // SHEET OPEN STATES
  cartOpen: boolean
  setCartOpen: (bool: boolean) => void
  myOrderOpen: boolean
  setMyOrderOpen: (bool: boolean) => void
  assistOpen: boolean
  setAssistOpen: (bool: boolean) => void

  // ANIMATION
  lastAddedId: string | null
  setLastAddedId: (id: string | null) => void
}

export const useCartStore = create<CartStore>((set, get) => ({
  // CART STATE
  cartItems: [],
  addItem: (item) => {
    set((state) => {
      const existing = state.cartItems.find((i) => 
        i.id === item.id && 
        JSON.stringify(i.modifiers || []) === JSON.stringify(item.modifiers || [])
      )
      const quantityToAdd = item.quantity ?? 1
      
      let newItems
      if (existing) {
        newItems = state.cartItems.map((i) =>
          (i.id === item.id && JSON.stringify(i.modifiers || []) === JSON.stringify(item.modifiers || []))
            ? { ...i, quantity: i.quantity + quantityToAdd } 
            : i
        )
      } else {
        newItems = [...state.cartItems, { ...item, quantity: quantityToAdd }]
      }

      // Animation logic
      setTimeout(() => {
        set({ lastAddedId: null })
      }, 600)

      return {
        cartItems: newItems,
        lastAddedId: item.id
      }
    })
  },
  removeItem: (id, modifiers = []) => {
    set((state) => ({
      cartItems: state.cartItems.filter(
        (i) => !(i.id === id && JSON.stringify(i.modifiers || []) === JSON.stringify(modifiers))
      ),
    }))
  },
  updateQuantity: (id, modifiers = [], qty) => {
    if (qty <= 0) {
      get().removeItem(id, modifiers)
      return
    }
    set((state) => ({
      cartItems: state.cartItems.map((i) =>
        (i.id === id && JSON.stringify(i.modifiers || []) === JSON.stringify(modifiers)) 
          ? { ...i, quantity: qty } 
          : i
      ),
    }))
  },
  clearCart: () => set({ cartItems: [] }),
  cartTotal: () => {
    return get().cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  },
  cartCount: () => {
    return get().cartItems.reduce((count, item) => count + item.quantity, 0)
  },

  // PLACED ORDER STATE
  placedItems: [],
  setPlacedItems: (items) => set({ placedItems: items }),

  // NAVIGATION STATE
  activeTab: 'menu',
  setActiveTab: (tab) => set({ activeTab: tab }),

  // SHEET OPEN STATES
  cartOpen: false,
  setCartOpen: (bool) => set({ cartOpen: bool }),
  myOrderOpen: false,
  setMyOrderOpen: (bool) => set({ myOrderOpen: bool }),
  assistOpen: false,
  setAssistOpen: (bool) => set({ assistOpen: bool }),

  // ANIMATION
  lastAddedId: null,
  setLastAddedId: (id) => set({ lastAddedId: id }),
}))

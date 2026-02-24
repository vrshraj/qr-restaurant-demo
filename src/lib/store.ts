// src/lib/store.ts
import { create } from 'zustand'

export interface CartItem {
    id: string
    name: string
    price: number
    qty: number
    modifiers: string[]
    notes: string
    image?: string
}

interface CartState {
    items: CartItem[]
    addItem: (item: Omit<CartItem, 'qty'>) => void
    removeItem: (itemId: string, modifiers: string[]) => void
    updateQty: (itemId: string, modifiers: string[], delta: number) => void
    clearCart: () => void
    getTotal: () => number
}

export const useCart = create<CartState>((set, get) => ({
    items: [],

    addItem: (newItem) => set((state) => {
        // Check if item with same ID and SAME modifiers already exists
        const existingIndex = state.items.findIndex(
            (item) =>
                item.id === newItem.id &&
                JSON.stringify(item.modifiers) === JSON.stringify(newItem.modifiers)
        )

        if (existingIndex > -1) {
            const updatedItems = [...state.items]
            updatedItems[existingIndex].qty += 1
            return { items: updatedItems }
        }

        return {
            items: [...state.items, { ...newItem, qty: 1 }]
        }
    }),

    removeItem: (itemId, modifiers) => set((state) => ({
        items: state.items.filter(
            (item) =>
                !(item.id === itemId && JSON.stringify(item.modifiers) === JSON.stringify(modifiers))
        )
    })),

    updateQty: (itemId, modifiers, delta) => set((state) => {
        const updatedItems = state.items.map((item) => {
            if (item.id === itemId && JSON.stringify(item.modifiers) === JSON.stringify(modifiers)) {
                const newQty = Math.max(0, item.qty + delta)
                return { ...item, qty: newQty }
            }
            return item
        }).filter(item => item.qty > 0)

        return { items: updatedItems }
    }),

    clearCart: () => set({ items: [] }),

    getTotal: () => {
        return get().items.reduce((total, item) => total + (item.price * item.qty), 0)
    }
}))

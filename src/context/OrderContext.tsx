'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { INITIAL_ORDERS, INITIAL_TABLES } from '@/lib/data'
import { crossTabSync } from '@/lib/cross-tab-sync'

// ── Types ──────────────────────────────────────────────────────────────────

export type OrderStatus = 'PENDING' | 'ACCEPTED' | 'PREPARING' | 'READY' | 'SERVED'
export type TableStatus = 'VACANT' | 'OCCUPIED' | 'PAYMENT_PENDING' | 'DIRTY'

export interface OrderItem {
    name: string
    qty: number
    modifiers: string[]
    notes: string
}

export interface Order {
    id: string
    tableNumber: number
    items: OrderItem[]
    total: number
    status: OrderStatus
    createdAt: Date
}

interface OrderContextType {
    orders: Order[]
    tables: Record<number, TableStatus>
    unavailableItems: Set<string>
    addOrder: (order: Order) => void
    updateStatus: (id: string, status: OrderStatus) => void
    setTableStatus: (table: number, status: TableStatus) => void
    toggle86: (itemId: string) => void
}

// ── Context ────────────────────────────────────────────────────────────────

const OrderContext = createContext<OrderContextType | null>(null)

// ── Provider ───────────────────────────────────────────────────────────────

export function OrderProvider({ children }: { children: ReactNode }) {
    const [orders, setOrders] = useState<Order[]>(
        INITIAL_ORDERS.map(o => ({ ...o, status: o.status as OrderStatus }))
    )
    const [tables, setTables] = useState<Record<number, TableStatus>>(
        INITIAL_TABLES as Record<number, TableStatus>
    )
    const [unavailableItems, setUnavailableItems] = useState<Set<string>>(new Set())

    // Subscribe to cross-tab events
    useEffect(() => {
        const unsubscribe86 = crossTabSync.subscribe('86_TOGGLE', (data: unknown) => {
            const itemId = data as string
            setUnavailableItems(prev => {
                const next = new Set(prev)
                next.has(itemId) ? next.delete(itemId) : next.add(itemId)
                return next
            })
        })

        const unsubscribeOrder = crossTabSync.subscribe('ORDER_PLACED', (data: unknown) => {
            const order = data as Order
            setOrders(prev => {
                // Prevent duplicate orders if event fires multiple times
                if (prev.some(o => o.id === order.id)) return prev
                return [order, ...prev]
            })
        })

        const unsubscribeStatus = crossTabSync.subscribe('STATUS_UPDATE', (data: unknown) => {
            const { id, status } = data as { id: string, status: OrderStatus }
            setOrders(prev => prev.map(o => (o.id === id ? { ...o, status } : o)))
        })

        return () => {
            unsubscribe86()
            unsubscribeOrder()
            unsubscribeStatus()
        }
    }, [])

    const addOrder = (order: Order) => {
        setOrders(prev => [order, ...prev])
        crossTabSync.broadcast('ORDER_PLACED', order)
    }

    const updateStatus = (id: string, status: OrderStatus) => {
        setOrders(prev => prev.map(o => (o.id === id ? { ...o, status } : o)))
        crossTabSync.broadcast('STATUS_UPDATE', { id, status })
    }

    const setTableStatus = (table: number, status: TableStatus) => {
        setTables(prev => ({ ...prev, [table]: status }))
    }

    const toggle86 = (itemId: string) => {
        setUnavailableItems(prev => {
            const next = new Set(prev)
            next.has(itemId) ? next.delete(itemId) : next.add(itemId)
            return next
        })
        crossTabSync.broadcast('86_TOGGLE', itemId)
    }

    return (
        <OrderContext.Provider
            value={{ orders, tables, unavailableItems, addOrder, updateStatus, setTableStatus, toggle86 }}
        >
            {children}
        </OrderContext.Provider>
    )
}

// ── Hook ───────────────────────────────────────────────────────────────────

export function useOrders() {
    const ctx = useContext(OrderContext)
    if (!ctx) throw new Error('useOrders must be used inside <OrderProvider>')
    return ctx
}

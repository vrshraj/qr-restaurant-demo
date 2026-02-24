'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { MENU_CATEGORIES, MENU_ITEMS, RESTAURANT } from '@/lib/data'
import { useOrders } from '@/context/OrderContext'
import { useCart } from '@/lib/store'
import { ModifierModal } from '@/components/ModifierModal'
import { CartDrawer } from '@/components/CartDrawer'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, UtensilsCrossed } from 'lucide-react'

interface MenuItem {
    id: string
    categoryId: string
    name: string
    description: string
    price: number
    image: string
    modifierGroups: {
        id: string
        name: string
        required: boolean
        options: { id: string; name: string; priceDelta: number }[]
    }[]
}

interface MenuClientProps {
    tableNumber: string
}

export function MenuClient({ tableNumber }: MenuClientProps) {
    const { unavailableItems } = useOrders()
    const cartItems = useCart(s => s.items)
    const addItem = useCart(s => s.addItem)
    const totalItems = cartItems.reduce((n, i) => n + i.qty, 0)

    const [activeCategory, setActiveCategory] = useState(MENU_CATEGORIES[0].id)
    const [modalItem, setModalItem] = useState<MenuItem | null>(null)
    const [cartOpen, setCartOpen] = useState(false)

    const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

    function scrollToCategory(catId: string) {
        setActiveCategory(catId)
        sectionRefs.current[catId]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    function handleItemTap(item: MenuItem) {
        if (item.modifierGroups.length > 0) {
            setModalItem(item)
        } else {
            addItem({ id: item.id, name: item.name, price: item.price, modifiers: [], notes: '', image: item.image })
        }
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* ── Header ── */}
            <header
                className="sticky top-0 z-30 bg-white shadow-sm"
                style={{ borderBottom: `3px solid ${RESTAURANT.primaryColor}` }}
            >
                <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">{RESTAURANT.logo}</span>
                        <div>
                            <h1 className="font-bold text-base leading-tight">{RESTAURANT.name}</h1>
                            <p className="text-xs text-slate-500">{RESTAURANT.tagline}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-3 py-1">
                        <UtensilsCrossed className="w-3.5 h-3.5 text-amber-600" />
                        <span className="text-xs font-semibold text-amber-700">Table {tableNumber}</span>
                    </div>
                </div>

                {/* Category tabs */}
                <div className="max-w-md mx-auto overflow-x-auto flex gap-1 px-4 pb-2 no-scrollbar">
                    {MENU_CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => scrollToCategory(cat.id)}
                            className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeCategory === cat.id
                                    ? 'bg-amber-500 text-white shadow-sm'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </header>

            {/* ── Menu sections ── */}
            <main className="max-w-md mx-auto px-4 pb-32 pt-4 space-y-8">
                {MENU_CATEGORIES.map(cat => {
                    const catItems = MENU_ITEMS.filter(i => i.categoryId === cat.id)
                    return (
                        <section
                            key={cat.id}
                            ref={el => { sectionRefs.current[cat.id] = el }}
                            className="scroll-mt-28"
                        >
                            <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                                <span
                                    className="inline-block w-1 h-5 rounded-full"
                                    style={{ backgroundColor: RESTAURANT.primaryColor }}
                                />
                                {cat.name}
                            </h2>

                            <div className="space-y-3">
                                {catItems.map(item => {
                                    const unavailable = unavailableItems.has(item.id)
                                    return (
                                        <div
                                            key={item.id}
                                            className="relative bg-white rounded-2xl shadow-sm overflow-hidden flex gap-0"
                                        >
                                            {/* Image */}
                                            <div className="relative w-28 shrink-0 aspect-square bg-slate-100">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                    unoptimized
                                                />
                                                {unavailable && (
                                                    <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
                                                        <Badge variant="secondary" className="text-[10px] font-bold bg-white/90">
                                                            Unavailable
                                                        </Badge>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 px-3 py-3 flex flex-col justify-between">
                                                <div>
                                                    <p className="font-semibold text-sm leading-tight">{item.name}</p>
                                                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{item.description}</p>
                                                </div>
                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="text-sm font-bold text-amber-600">₹{item.price}</span>
                                                    <button
                                                        disabled={unavailable}
                                                        onClick={() => handleItemTap(item)}
                                                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${unavailable
                                                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                                                : 'bg-amber-500 text-white hover:bg-amber-600 active:scale-95'
                                                            }`}
                                                    >
                                                        {item.modifierGroups.length > 0 ? 'Choose' : 'Add'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </section>
                    )
                })}
            </main>

            {/* ── Fixed cart FAB ── */}
            <div className="fixed bottom-6 left-0 right-0 z-40 flex justify-center">
                <button
                    onClick={() => setCartOpen(true)}
                    className="relative flex items-center gap-2 bg-slate-900 text-white px-6 py-3.5 rounded-2xl shadow-lg hover:bg-slate-800 active:scale-95 transition-all"
                >
                    <ShoppingCart className="w-5 h-5" />
                    <span className="font-semibold text-sm">View Cart</span>
                    {totalItems > 0 && (
                        <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow">
                            {totalItems}
                        </span>
                    )}
                </button>
            </div>

            {/* ── Modifier Modal ── */}
            <ModifierModal
                item={modalItem}
                open={!!modalItem}
                onClose={() => setModalItem(null)}
            />

            {/* ── Cart Drawer ── */}
            <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
        </div>
    )
}

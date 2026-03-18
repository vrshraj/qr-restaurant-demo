'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { MENU_CATEGORIES, MENU_ITEMS, RESTAURANT } from '@/lib/data'
import { useOrders } from '@/context/OrderContext'
import { useCart } from '@/lib/store'
import { ModifierModal } from '@/components/ModifierModal'
import CartDrawer from '@/components/CartDrawer'
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* ── Header ── */}
            <header
                className="sticky top-0 z-30 bg-white shadow-lg backdrop-blur-sm"
                style={{ borderBottom: `4px solid ${RESTAURANT.primaryColor}` }}
            >
                <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center gap-2">
                        <span className="text-3xl animate-bounce">{RESTAURANT.logo}</span>
                        <div>
                            <h1 className="font-bold text-base leading-tight">{RESTAURANT.name}</h1>
                            <p className="text-xs text-slate-500">{RESTAURANT.tagline}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-50 to-amber-100 border-2 border-amber-200 rounded-full px-3 py-1.5 shadow-sm">
                        <UtensilsCrossed className="w-4 h-4 text-amber-600 animate-pulse" />
                        <span className="text-xs font-bold text-amber-700">Table {tableNumber}</span>
                    </div>
                </div>

                {/* Category tabs */}
                <div className="max-w-md mx-auto overflow-x-auto flex gap-2 px-4 pb-2 no-scrollbar">
                    {MENU_CATEGORIES.map((cat, idx) => (
                        <button
                            key={cat.id}
                            onClick={() => scrollToCategory(cat.id)}
                            className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 animate-in fade-in slide-in-from-left-4 ${activeCategory === cat.id
                                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg scale-105'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            style={{ animationDelay: `${idx * 50}ms` }}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </header>

            {/* ── Menu sections ── */}
            <main className="max-w-md mx-auto px-4 pb-32 pt-6 space-y-8">
                {MENU_CATEGORIES.map((cat, catIdx) => {
                    const catItems = MENU_ITEMS.filter(i => i.categoryId === cat.id)
                    return (
                        <section
                            key={cat.id}
                            ref={el => { sectionRefs.current[cat.id] = el }}
                            className="scroll-mt-28 animate-in fade-in duration-500"
                            style={{ animationDelay: `${catIdx * 100}ms` }}
                        >
                            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <span
                                    className="inline-block w-1.5 h-6 rounded-full animate-pulse"
                                    style={{ backgroundColor: RESTAURANT.primaryColor }}
                                />
                                {cat.name}
                            </h2>

                            <div className="space-y-3">
                                {catItems.map((item, itemIdx) => {
                                    const unavailable = unavailableItems.has(item.id)
                                    return (
                                        <div
                                            key={item.id}
                                            className="relative bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden flex gap-0 transition-all duration-300 hover:scale-[1.02] cursor-pointer animate-in fade-in slide-in-from-bottom-2"
                                            style={{ animationDelay: `${itemIdx * 50}ms` }}
                                        >
                                            {/* Image */}
                                            <div className="relative w-32 shrink-0 aspect-square bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover hover:scale-110 transition-transform duration-300"
                                                    unoptimized
                                                />
                                                {unavailable && (
                                                    <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center">
                                                        <Badge variant="secondary" className="text-[10px] font-bold bg-white/95 text-slate-800 animate-pulse">
                                                            Unavailable
                                                        </Badge>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 px-4 py-3 flex flex-col justify-between">
                                                <div>
                                                    <p className="font-bold text-sm leading-tight text-slate-800">{item.name}</p>
                                                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{item.description}</p>
                                                </div>
                                                <div className="flex items-center justify-between mt-3">
                                                    <span className="text-base font-bold" style={{ color: RESTAURANT.primaryColor }}>₹{item.price}</span>
                                                    <button
                                                        disabled={unavailable}
                                                        onClick={() => handleItemTap(item)}
                                                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 ${unavailable
                                                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                                                : 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:shadow-lg hover:scale-105'
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
            <div className="fixed bottom-8 left-0 right-0 z-40 flex justify-center">
                <button
                    onClick={() => setCartOpen(true)}
                    className="relative flex items-center gap-2 bg-gradient-to-r from-slate-900 to-slate-800 text-white px-6 py-3.5 rounded-full shadow-2xl hover:shadow-amber-500/50 hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-amber-500/20"
                >
                    <ShoppingCart className="w-5 h-5 animate-bounce" />
                    <span className="font-bold text-sm">View Cart</span>
                    {totalItems > 0 && (
                        <span className="absolute -top-3 -right-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center shadow-lg animate-pulse">
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
            <CartDrawer />
        </div>
    )
}

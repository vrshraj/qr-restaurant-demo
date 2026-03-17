'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Search, Mic, Star, Heart, Clock } from 'lucide-react'
import { MENU_ITEMS } from '@/lib/data'
import { useCart } from '@/lib/store'
import { ModifierModal } from '@/components/ModifierModal'
import { CartDrawer } from '@/components/CartDrawer'
import { SwiggyBanner } from './SwiggyBanner'

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
    const cartItems = useCart(state => state.items)
    const addItem = useCart(state => state.addItem)
    const totalItems = cartItems.reduce((n, i) => n + i.qty, 0)

    const [modalItem, setModalItem] = useState<MenuItem | null>(null)
    const [cartOpen, setCartOpen] = useState(false)
    const [activeTab, setActiveTab] = useState<'reorder' | 'food'>('food')
    const [searchQuery, setSearchQuery] = useState('')
    const [isVegOnly, setIsVegOnly] = useState(false)
    const [favorites, setFavorites] = useState<Set<string>>(new Set())

    function handleItemTap(item: MenuItem) {
        if (item.modifierGroups.length > 0) {
            setModalItem(item)
        } else {
            addItem({ id: item.id, name: item.name, price: item.price, modifiers: [], notes: '', image: item.image })
        }
    }

    const toggleFavorite = (itemId: string) => {
        setFavorites(prev => {
            const next = new Set(prev)
            if (next.has(itemId)) next.delete(itemId)
            else next.add(itemId)
            return next
        })
    }

    // Mock filtering logic
    const filteredItems = MENU_ITEMS.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             item.description.toLowerCase().includes(searchQuery.toLowerCase())
        // For veg filtering, we'll mock that "Vegetable" items are items with "Mushroom", "Gulab", "Bread" etc or just random
        const isVeg = item.name.toLowerCase().includes('mushroom') || 
                     item.name.toLowerCase().includes('bread') || 
                     item.name.toLowerCase().includes('gulab') || 
                     item.name.toLowerCase().includes('lime') || 
                     item.name.toLowerCase().includes('mango')
        
        const matchesVeg = !isVegOnly || isVeg
        
        const matchesTab = activeTab === 'food' || (activeTab === 'reorder' && (item.id === 'item-1' || item.id === 'item-2'))

        return matchesSearch && matchesVeg && matchesTab
    })

    return (
        <div className="min-h-screen bg-white pb-32">
            {/* ── Search & Veg Toggle Section (Replacement for Header) ── */}
            <div className="sticky top-0 z-50 bg-white px-4 pt-6 pb-2 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="flex-1 relative">
                        <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for 'Sweets' or 'Pizza'"
                            className="w-full h-12 bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-12 text-slate-800 text-sm font-medium placeholder:text-slate-400 focus:outline-none shadow-inner"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3 border-l border-slate-100 pl-3">
                            <Mic className="w-5 h-5 text-swiggy-orange" />
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => setIsVegOnly(!isVegOnly)}
                        className={`rounded-2xl h-12 px-3 flex items-center gap-2 transition-all border ${isVegOnly ? 'bg-green-50 border-green-200' : 'bg-white border-slate-100 shadow-sm'}`}
                    >
                        <div className="flex flex-col items-center">
                            <span className={`text-[8px] font-black uppercase leading-none ${isVegOnly ? 'text-green-700' : 'text-slate-900'}`}>Veg</span>
                            <div className={`mt-1 w-6 h-3 rounded-full relative flex items-center p-0.5 transition-colors ${isVegOnly ? 'bg-green-200' : 'bg-slate-200'}`}>
                                <div className={`w-2 h-2 rounded-full shadow-sm transition-transform duration-300 ${isVegOnly ? 'bg-green-600 translate-x-3' : 'bg-slate-400'}`} />
                            </div>
                        </div>
                    </button>
                </div>
            </div>

            <SwiggyBanner />

            <main className="max-w-md mx-auto -mt-6 relative z-20">
                {/* ── Tab Switcher ── */}
                <div className="px-4 mb-6">
                    <div className="bg-slate-100/80 p-1 rounded-2xl flex gap-1">
                        <button 
                            onClick={() => setActiveTab('reorder')}
                            className={`flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'reorder' ? 'bg-white shadow-sm text-slate-900 font-bold' : 'text-slate-500'}`}
                        >
                            Recent Orders
                        </button>
                        <button 
                            onClick={() => setActiveTab('food')}
                            className={`flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'food' ? 'bg-white shadow-sm text-slate-900 font-bold' : 'text-slate-500'}`}
                        >
                            Full Menu
                        </button>
                    </div>
                </div>

                {/* ── Menu Grid ── */}
                <div className="px-4 grid grid-cols-2 gap-x-4 gap-y-8">
                    {filteredItems.map((item, idx) => {
                        const rating = (4 + (idx % 9) * 0.1).toFixed(1)
                        const time = 20 + Math.floor(idx * 5)
                        const discount = idx % 2 === 0 ? "60% OFF" : "50% OFF"
                        const subtext = idx % 2 === 0 ? "UPTO ₹120" : ""
                        const isFav = favorites.has(item.id)

                        return (
                            <div 
                                key={item.id} 
                                className="group flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500"
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                {/* Image Container */}
                                <div className="relative aspect-4/5 rounded-3xl overflow-hidden shadow-lg border border-slate-100">
                                    <Image 
                                        src={item.image} 
                                        alt={item.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        unoptimized
                                    />
                                    
                                    {/* Discount Overlay */}
                                    <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 via-black/20 to-transparent p-3 pt-8">
                                        <div className="flex flex-col">
                                            <span className="text-white font-black text-lg leading-none">{discount}</span>
                                            {subtext && <span className="text-white/70 text-[8px] font-black uppercase tracking-widest">{subtext}</span>}
                                        </div>
                                    </div>

                                    {/* Heart Toggle */}
                                    <div className="absolute top-3 right-3">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); toggleFavorite(item.id); }}
                                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isFav ? 'bg-white text-rose-500 shadow-md' : 'bg-black/20 text-white backdrop-blur-sm border border-white/20'}`}
                                        >
                                            <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                                        </button>
                                    </div>
                                </div>

                                {/* Item Info */}
                                <div className="space-y-1">
                                    <h3 className="font-black text-slate-800 text-sm leading-tight truncate">{item.name}</h3>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1 bg-green-600 rounded-full w-5 h-5 justify-center">
                                            <Star className="w-2.5 h-2.5 text-white fill-current" />
                                        </div>
                                        <span className="text-[11px] font-black text-slate-700">{rating} • {time}-{time+5} mins</span>
                                    </div>
                                    <p className="text-[10px] font-medium text-slate-400 truncate">{item.description}</p>
                                </div>

                                {/* Add Button */}
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleItemTap(item); }}
                                    className="w-full h-10 border-2 border-slate-100 rounded-xl text-xs font-black uppercase tracking-widest text-swiggy-orange hover:bg-swiggy-orange hover:text-white hover:border-swiggy-orange transition-all active:scale-95"
                                >
                                    {item.modifierGroups.length > 0 ? 'Customize' : 'Add'}
                                </button>
                            </div>
                        )
                    })}
                </div>

                {filteredItems.length === 0 && (
                    <div className="py-20 text-center space-y-2">
                        <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-xs">No items found</p>
                        <button 
                            onClick={() => { setSearchQuery(''); setIsVegOnly(false); }}
                            className="text-swiggy-orange font-bold text-sm underline"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </main>

            {/* Existing Cart FAB replacement or keep logic */}
            {cartItems.length > 0 && (
                <div className="fixed bottom-10 left-0 right-0 z-40 flex justify-center px-4">
                    <button
                        onClick={() => setCartOpen(true)}
                        className="w-full bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center justify-between border-2 border-white/10 animate-in slide-in-from-bottom-8"
                    >
                        <div className="flex flex-col items-start">
                            <span className="text-[10px] font-black text-white/50 uppercase tracking-widest leading-none mb-1">Items in cart</span>
                            <span className="text-sm font-black">{totalItems} {totalItems === 1 ? 'Item' : 'Items'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-black text-sm uppercase tracking-widest">View Cart</span>
                            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center italic text-xs font-black">
                                →
                            </div>
                        </div>
                    </button>
                </div>
            )}

            <ModifierModal
                item={modalItem}
                open={!!modalItem}
                onClose={() => setModalItem(null)}
            />

            <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
        </div>
    )
}

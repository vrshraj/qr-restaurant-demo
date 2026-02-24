'use client'

import { useRouter } from 'next/navigation'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { useCart } from '@/lib/store'
import { RESTAURANT } from '@/lib/data'

interface CartDrawerProps {
    open: boolean
    onClose: () => void
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
    const router = useRouter()
    const { items, updateQty, removeItem, getTotal } = useCart()
    const subtotal = getTotal()

    function handleCheckout() {
        onClose()
        router.push('/checkout')
    }

    return (
        <Sheet open={open} onOpenChange={v => !v && onClose()}>
            <SheetContent
                side="bottom"
                className="rounded-t-2xl px-0 pb-0 max-h-[85vh] flex flex-col"
            >
                {/* ── Header ── */}
                <SheetHeader className="px-5 pt-4 pb-2">
                    <SheetTitle className="flex items-center gap-2 text-lg font-bold">
                        <ShoppingBag className="w-5 h-5" style={{ color: RESTAURANT.primaryColor }} />
                        Your Cart
                        <span className="ml-auto text-sm font-normal text-slate-500">
                            {items.reduce((n, i) => n + i.qty, 0)} item
                            {items.reduce((n, i) => n + i.qty, 0) !== 1 ? 's' : ''}
                        </span>
                    </SheetTitle>
                </SheetHeader>

                <Separator />

                {/* ── Empty state ── */}
                {items.length === 0 && (
                    <div className="flex-1 flex flex-col items-center justify-center gap-3 text-slate-400 py-16">
                        <ShoppingBag className="w-12 h-12 opacity-30" />
                        <p className="text-sm">Nothing here yet — browse the menu!</p>
                    </div>
                )}

                {/* ── Item list ── */}
                <div className="flex-1 overflow-y-auto px-5 py-3 space-y-5">
                    {items.map((item, idx) => (
                        <div key={`${item.id}-${idx}`} className="flex gap-3">

                            {/* Thumbnail */}
                            {item.image && (
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-14 h-14 rounded-xl object-cover shrink-0 mt-0.5"
                                />
                            )}

                            {/* Details */}
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm text-slate-800 truncate">{item.name}</p>

                                {/* Modifier badges */}
                                {item.modifiers.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {item.modifiers.map((mod) => (
                                            <span
                                                key={mod}
                                                className="inline-block text-[10px] font-medium bg-slate-100 text-slate-500 rounded-full px-2 py-0.5"
                                            >
                                                {mod}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Notes — italic */}
                                {item.notes && (
                                    <p className="text-xs text-slate-400 italic mt-0.5 truncate">
                                        &ldquo;{item.notes}&rdquo;
                                    </p>
                                )}

                                {/* Line price */}
                                <p className="text-sm font-bold mt-1" style={{ color: RESTAURANT.primaryColor }}>
                                    ₹{(item.price * item.qty).toLocaleString()}
                                </p>
                            </div>

                            {/* Controls */}
                            <div className="flex flex-col items-end justify-between shrink-0 gap-2">
                                {/* Remove */}
                                <button
                                    onClick={() => removeItem(item.id, item.modifiers)}
                                    className="p-1 text-slate-300 hover:text-red-400 transition-colors"
                                    aria-label="Remove item"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>

                                {/* Qty +/- */}
                                <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
                                    <button
                                        onClick={() => updateQty(item.id, item.modifiers, -1)}
                                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white transition-colors"
                                        aria-label="Decrease quantity"
                                    >
                                        <Minus className="w-3.5 h-3.5 text-slate-600" />
                                    </button>
                                    <span className="text-sm font-bold w-5 text-center text-slate-700">
                                        {item.qty}
                                    </span>
                                    <button
                                        onClick={() => updateQty(item.id, item.modifiers, 1)}
                                        className="w-7 h-7 flex items-center justify-center rounded-lg text-white transition-colors"
                                        style={{ background: RESTAURANT.primaryColor }}
                                        aria-label="Increase quantity"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Footer ── */}
                {items.length > 0 && (
                    <div className="border-t border-slate-100 px-5 pt-4 pb-8 space-y-3 bg-white">
                        <div className="flex justify-between font-bold text-base text-slate-800">
                            <span>Subtotal</span>
                            <span>₹{subtotal.toLocaleString()}</span>
                        </div>
                        <Button
                            onClick={handleCheckout}
                            className="w-full h-12 text-base font-semibold text-white rounded-xl border-0"
                            style={{ background: RESTAURANT.primaryColor }}
                        >
                            Checkout — ₹{subtotal.toLocaleString()}
                        </Button>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    )
}

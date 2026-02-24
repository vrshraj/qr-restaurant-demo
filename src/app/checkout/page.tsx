'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/store'
import { useOrders } from '@/context/OrderContext'
import { RESTAURANT } from '@/lib/data'
import type { Order, OrderItem } from '@/context/OrderContext'
import { ShoppingBag, ChevronLeft, ClipboardList, Tag, CheckCircle, XCircle } from 'lucide-react'

// ── Coupon config ──────────────────────────────────────────────────────────

type CouponResult = { type: 'percent'; value: number } | { type: 'flat'; value: number }

const COUPONS: Record<string, CouponResult> = {
    SPICE10: { type: 'percent', value: 10 },
    WELCOME20: { type: 'percent', value: 20 },
    FLAT50: { type: 'flat', value: 50 },
}

function calcDiscount(subtotal: number, coupon: CouponResult | null): number {
    if (!coupon) return 0
    if (coupon.type === 'flat') return Math.min(coupon.value, subtotal)
    return Math.round((subtotal * coupon.value) / 100)
}

function generateOrderId() {
    return `ord-${Date.now().toString(36).toUpperCase()}`
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
    const router = useRouter()
    const { items, clearCart, getTotal } = useCart()
    const { addOrder } = useOrders()
    const [placing, setPlacing] = useState(false)

    // Coupon state
    const [couponInput, setCouponInput] = useState('')
    const [appliedCode, setAppliedCode] = useState<string | null>(null)
    const [appliedCoupon, setAppliedCoupon] = useState<CouponResult | null>(null)
    const [couponError, setCouponError] = useState<string | null>(null)

    const subtotal = getTotal()
    const discount = calcDiscount(subtotal, appliedCoupon)
    const grandTotal = subtotal - discount

    // ── Coupon handlers ──────────────────────────────────────────────────────

    function handleApplyCoupon() {
        const code = couponInput.trim().toUpperCase()
        if (!code) return

        if (COUPONS[code]) {
            setAppliedCode(code)
            setAppliedCoupon(COUPONS[code])
            setCouponError(null)
            setCouponInput('')
        } else {
            setCouponError('Invalid coupon code. Try SPICE10, WELCOME20, or FLAT50.')
            setAppliedCode(null)
            setAppliedCoupon(null)
        }
    }

    function handleRemoveCoupon() {
        setAppliedCode(null)
        setAppliedCoupon(null)
        setCouponError(null)
        setCouponInput('')
    }

    // ── Place order ──────────────────────────────────────────────────────────

    function handlePlaceOrder() {
        if (items.length === 0) return
        setPlacing(true)

        const orderItems: OrderItem[] = items.map((item) => ({
            name: item.name,
            qty: item.qty,
            modifiers: item.modifiers,
            notes: item.notes,
        }))

        const newOrder: Order = {
            id: generateOrderId(),
            tableNumber: 0,
            items: orderItems,
            total: grandTotal,
            status: 'PENDING',
            createdAt: new Date(),
        }

        addOrder(newOrder)
        clearCart()
        router.push(`/confirmation?orderId=${newOrder.id}`)
    }

    // ── Empty guard ──────────────────────────────────────────────────────────

    if (items.length === 0 && !placing) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-stone-50 px-4">
                <ShoppingBag className="w-16 h-16 text-stone-300" />
                <p className="text-xl font-semibold text-stone-500">Your cart is empty</p>
                <button
                    onClick={() => router.push('/menu')}
                    className="mt-2 px-6 py-3 rounded-2xl font-semibold text-white"
                    style={{ background: RESTAURANT.primaryColor }}
                >
                    Back to Menu
                </button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-stone-50">

            {/* ── Header ── */}
            <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-stone-100 px-4 py-3 flex items-center gap-3">
                <button
                    onClick={() => router.back()}
                    className="p-2 rounded-xl hover:bg-stone-100 transition-colors"
                >
                    <ChevronLeft className="w-5 h-5 text-stone-600" />
                </button>
                <div className="flex items-center gap-2">
                    <span className="text-2xl">{RESTAURANT.logo}</span>
                    <div>
                        <p className="text-xs text-stone-400 leading-none">Review</p>
                        <p className="font-bold text-stone-800 leading-tight">Your Order</p>
                    </div>
                </div>
            </header>

            <div className="max-w-lg mx-auto px-4 pb-36 pt-4 space-y-4">

                {/* ── Order Summary ── */}
                <section className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="flex items-center gap-2 px-4 pt-4 pb-2 border-b border-stone-100">
                        <ClipboardList className="w-4 h-4 text-stone-400" />
                        <h2 className="font-semibold text-stone-600 text-sm uppercase tracking-wide">Order Summary</h2>
                    </div>

                    <ul className="divide-y divide-stone-50">
                        {items.map((item) => (
                            <li
                                key={`${item.id}-${item.modifiers.join(',')}`}
                                className="flex items-start gap-3 px-4 py-3"
                            >
                                {item.image && (
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-12 h-12 rounded-xl object-cover shrink-0"
                                    />
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-stone-800 text-sm">{item.name}</p>
                                    {item.modifiers.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {item.modifiers.map((mod) => (
                                                <span
                                                    key={mod}
                                                    className="inline-block text-[10px] font-medium bg-stone-100 text-stone-500 rounded-full px-2 py-0.5"
                                                >
                                                    {mod}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-xs text-stone-400">×{item.qty}</p>
                                    <p className="text-sm font-bold" style={{ color: RESTAURANT.primaryColor }}>
                                        ₹{(item.price * item.qty).toLocaleString()}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* ── Coupon Input ── */}
                <section className="bg-white rounded-2xl shadow-sm p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Tag className="w-4 h-4 text-stone-400" />
                        <h2 className="font-semibold text-stone-600 text-sm uppercase tracking-wide">Coupon Code</h2>
                    </div>

                    {appliedCode ? (
                        // Applied state
                        <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                                <div>
                                    <p className="text-sm font-bold text-green-700">{appliedCode} applied!</p>
                                    <p className="text-xs text-green-600">
                                        You save ₹{discount.toLocaleString()}
                                        {appliedCoupon?.type === 'percent'
                                            ? ` (${appliedCoupon.value}% off)`
                                            : ' (flat discount)'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleRemoveCoupon}
                                className="text-xs font-semibold text-green-700 hover:text-green-900 underline ml-2"
                            >
                                Remove
                            </button>
                        </div>
                    ) : (
                        // Input state
                        <div className="space-y-2">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={couponInput}
                                    onChange={(e) => { setCouponInput(e.target.value); setCouponError(null) }}
                                    onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                                    placeholder="Enter coupon code"
                                    className="flex-1 border border-stone-200 rounded-xl px-4 py-2.5 text-sm font-medium text-stone-800 placeholder:text-stone-300 focus:outline-none focus:ring-2 uppercase"
                                    style={{ '--tw-ring-color': RESTAURANT.primaryColor } as React.CSSProperties}
                                />
                                <button
                                    onClick={handleApplyCoupon}
                                    disabled={!couponInput.trim()}
                                    className="px-5 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-40 transition-opacity"
                                    style={{ background: RESTAURANT.primaryColor }}
                                >
                                    Apply
                                </button>
                            </div>
                            {couponError && (
                                <div className="flex items-center gap-1.5 text-red-500">
                                    <XCircle className="w-4 h-4 shrink-0" />
                                    <p className="text-xs">{couponError}</p>
                                </div>
                            )}
                        </div>
                    )}
                </section>

                {/* ── Price Breakdown ── */}
                <section className="bg-white rounded-2xl shadow-sm p-4 space-y-2">
                    <div className="flex justify-between text-sm text-stone-500">
                        <span>Subtotal</span>
                        <span>₹{subtotal.toLocaleString()}</span>
                    </div>
                    {discount > 0 && (
                        <div className="flex justify-between text-sm font-medium text-green-600">
                            <span>Discount ({appliedCode})</span>
                            <span>−₹{discount.toLocaleString()}</span>
                        </div>
                    )}
                    <div className="border-t border-stone-100 pt-2 flex justify-between font-bold text-stone-800 text-base">
                        <span>Total</span>
                        <span>₹{grandTotal.toLocaleString()}</span>
                    </div>
                </section>

            </div>

            {/* ── Sticky CTA ── */}
            <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur border-t border-stone-100 px-4 py-4">
                <div className="max-w-lg mx-auto">
                    <button
                        onClick={handlePlaceOrder}
                        disabled={placing || items.length === 0}
                        className="w-full py-4 rounded-2xl font-bold text-white text-base flex items-center justify-center gap-2 transition-opacity disabled:opacity-60"
                        style={{ background: RESTAURANT.primaryColor }}
                    >
                        {placing ? (
                            <>
                                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                                Placing Order…
                            </>
                        ) : (
                            <>
                                <ShoppingBag className="w-5 h-5" />
                                Place Order · ₹{grandTotal.toLocaleString()}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

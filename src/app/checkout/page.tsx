'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/useCartStore'
import { useOrders } from '@/context/OrderContext'
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
    const { 
        cartItems: items, 
        clearCart, 
        cartTotal, 
        setPlacedItems 
    } = useCartStore()
    const { addOrder } = useOrders()
    const [placing, setPlacing] = useState(false)

    // Coupon state
    const [couponInput, setCouponInput] = useState('')
    const [appliedCode, setAppliedCode] = useState<string | null>(null)
    const [appliedCoupon, setAppliedCoupon] = useState<CouponResult | null>(null)
    const [couponError, setCouponError] = useState<string | null>(null)

    const subtotal = cartTotal()
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

        const orderItems = items.map((item) => ({
            name: item.name,
            qty: item.quantity,
            modifiers: item.modifiers || [],
            note: item.note || '',
        }))

        const newOrder = {
            id: generateOrderId(),
            tableNumber: 0,
            items: orderItems,
            total: grandTotal,
            status: 'PENDING',
            createdAt: new Date(),
        }

        addOrder(newOrder as any)

        // Set placed items in store for tracking
        setPlacedItems(items.map(i => ({
            ...i,
            status: 'pending',
            placedAt: new Date()
        })))

        clearCart()
        router.push(`/confirmation?orderId=${newOrder.id}`)
    }

    if (items.length === 0 && !placing) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-6 crave-noise px-6" style={{ background: 'var(--bg)' }}>
                <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'var(--surface)' }}>
                    <ShoppingBag className="w-10 h-10 opacity-10 text-foreground" />
                </div>
                <div className="text-center space-y-2">
                    <p className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-syne)' }}>Your cart is empty</p>
                    <p className="text-[14px] text-(--text-secondary)" style={{ fontFamily: 'var(--font-outfit)' }}>Add some flavors before checking out.</p>
                </div>
                <button
                    onClick={() => router.push('/menu')}
                    className="px-8 py-3.5 rounded-full font-bold text-white shadow-lg"
                    style={{ background: 'var(--accent)', fontFamily: 'var(--font-outfit)' }}
                >
                    Return to Menu
                </button>
            </div>
        )
    }

    return (
        <div className="min-h-screen crave-noise pb-32" style={{ background: 'var(--bg)' }}>

            {/* ── Header ── */}
            <header 
                className="sticky top-0 z-30 px-6 py-5 flex items-center gap-4 border-b"
                style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
            >
                <button
                    onClick={() => router.back()}
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                    style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
                >
                    <ChevronLeft className="w-5 h-5 text-foreground" />
                </button>
                <div className="flex flex-col">
                    <h1 
                        className="text-[20px] leading-none text-foreground"
                        style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, letterSpacing: '-0.02em' }}
                    >
                        CHECKOUT
                    </h1>
                    <p className="text-[11px] text-muted uppercase tracking-widest font-bold mt-1" style={{ fontFamily: 'var(--font-outfit)' }}>
                        Review your order
                    </p>
                </div>
            </header>

            <div className="max-w-md mx-auto px-6 py-8 space-y-8">

                {/* ── Order Summary ── */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <ClipboardList className="w-4 h-4 text-(--accent)" />
                        <h2 
                            className="font-bold text-[12px] uppercase tracking-[0.15em] text-muted"
                            style={{ fontFamily: 'var(--font-outfit)' }}
                        >
                            Order Details
                        </h2>
                    </div>

                    <div 
                        className="rounded-[20px] overflow-hidden border divide-y" 
                        style={{ background: 'var(--surface)', borderColor: 'var(--border)', borderStyle: 'solid', divideColor: 'var(--border)' } as any}
                    >
                        {items.map((item, idx) => (
                            <div
                                key={`${item.id}-${idx}`}
                                className="flex items-center gap-4 px-4 py-4"
                            >
                                {item.imageUrl && (
                                    <img
                                        src={item.imageUrl}
                                        alt={item.name}
                                        className="w-12 h-12 rounded-xl object-cover shrink-0"
                                    />
                                )}
                                <div className="flex-1 min-w-0">
                                    <p 
                                        className="font-bold text-[14px] text-foreground truncate"
                                        style={{ fontFamily: 'var(--font-syne)' }}
                                    >
                                        {item.name}
                                    </p>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className="text-[11px] font-bold text-(--accent)" style={{ fontFamily: 'var(--font-outfit)' }}>{item.quantity}×</span>
                                        {item.modifiers && item.modifiers.length > 0 && (
                                            <p className="text-[11px] text-(--text-secondary) truncate uppercase" style={{ fontFamily: 'var(--font-outfit)' }}>
                                                {item.modifiers.join(' • ')}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <p 
                                    className="text-[14px] font-bold text-foreground"
                                    style={{ fontFamily: 'var(--font-outfit)' }}
                                >
                                    ₹{(item.price * item.quantity).toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Coupon Input ── */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Tag className="w-4 h-4 text-(--accent)" />
                        <h2 
                            className="font-bold text-[12px] uppercase tracking-[0.15em] text-muted"
                            style={{ fontFamily: 'var(--font-outfit)' }}
                        >
                            Promo Code
                        </h2>
                    </div>

                    {appliedCode ? (
                        <div 
                            className="flex items-center justify-between rounded-[16px] px-5 py-4 border"
                            style={{ background: 'var(--surface-2)', borderColor: 'rgba(76,175,80,0.2)' }}
                        >
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-[#4CAF50] shrink-0" />
                                <div>
                                    <p className="text-[14px] font-bold text-foreground" style={{ fontFamily: 'var(--font-outfit)' }}>{appliedCode} applied</p>
                                    <p className="text-[12px] text-[#4CAF50]">
                                        Saved ₹{discount.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleRemoveCoupon}
                                className="text-[11px] font-bold text-muted hover:text-foreground uppercase tracking-wider transition-colors"
                            >
                                Remove
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={couponInput}
                                onChange={(e) => { setCouponInput(e.target.value); setCouponError(null) }}
                                placeholder="Enter code…"
                                className="flex-1 rounded-[16px] px-5 py-3.5 text-[14px] font-medium text-foreground placeholder:text-muted focus:outline-none uppercase"
                                style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', fontFamily: 'var(--font-outfit)' }}
                            />
                            <button
                                onClick={handleApplyCoupon}
                                disabled={!couponInput.trim()}
                                className="px-6 py-3.5 rounded-full text-[13px] font-bold text-white disabled:opacity-30 transition-all active:scale-95"
                                style={{ background: 'var(--accent)', fontFamily: 'var(--font-outfit)' }}
                            >
                                Apply
                            </button>
                        </div>
                    )}
                    {couponError && (
                        <div className="flex items-center gap-2 px-1 text-[#FF5252]">
                            <XCircle className="w-3.5 h-3.5 shrink-0" />
                            <p className="text-[11px] font-medium">{couponError}</p>
                        </div>
                    )}
                </section>

                {/* ── Price Breakdown ── */}
                <section 
                    className="rounded-[20px] p-6 space-y-3"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                >
                    <div className="flex justify-between text-[14px] text-(--text-secondary)" style={{ fontFamily: 'var(--font-outfit)' }}>
                        <span>Subtotal</span>
                        <span className="text-foreground">₹{subtotal.toLocaleString()}</span>
                    </div>
                    {discount > 0 && (
                        <div className="flex justify-between text-[14px] font-medium text-[#4CAF50]" style={{ fontFamily: 'var(--font-outfit)' }}>
                            <span>Discount</span>
                            <span>−₹{discount.toLocaleString()}</span>
                        </div>
                    )}
                    <div className="pt-3 border-t flex justify-between items-center text-foreground" style={{ borderColor: 'var(--border)' }}>
                        <span className="text-[16px] font-bold" style={{ fontFamily: 'var(--font-syne)' }}>Grand Total</span>
                        <span className="text-[22px] font-bold text-(--accent)" style={{ fontFamily: 'var(--font-outfit)' }}>₹{grandTotal.toLocaleString()}</span>
                    </div>
                </section>

            </div>

            {/* ── Sticky CTA ── */}
            <div 
                className="fixed bottom-0 inset-x-0 z-30 px-6 py-6 border-t"
                style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
            >
                <div className="max-w-md mx-auto">
                    <button
                        onClick={handlePlaceOrder}
                        disabled={placing || items.length === 0}
                        className="w-full h-14 rounded-full font-bold text-white text-[16px] flex items-center justify-center gap-3 transition-opacity disabled:opacity-30 shadow-lg"
                        style={{ background: 'var(--accent)', fontFamily: 'var(--font-outfit)' }}
                    >
                        {placing ? (
                            <>
                                <svg className="w-5 h-5 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                                <span>Placing Order…</span>
                            </>
                        ) : (
                            <>
                                <ShoppingBag className="w-5 h-5" />
                                <span>Place Order · ₹{grandTotal.toLocaleString()}</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

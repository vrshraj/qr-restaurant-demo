'use client'

import React, { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { VisuallyHidden } from "@/components/ui/visually-hidden"
import { ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'
import { Price } from './Price'
import { cn } from '@/lib/utils'

// Mock recommendations as requested
const MOCK_RECOMMENDATIONS = [
  { id: 'rec-1', name: 'Fresh Lime Soda', price: 85, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=200&auto=format&fit=crop' },
  { id: 'rec-2', name: 'Garlic Naan', price: 65, image: 'https://images.unsplash.com/photo-1601050638917-3606f5095b4e?q=80&w=200&auto=format&fit=crop' },
  { id: 'rec-3', name: 'Masala Papad', price: 45, image: 'https://images.unsplash.com/photo-1626132644529-56e960c19cd2?q=80&w=200&auto=format&fit=crop' },
]

export default function CartDrawer() {
  const {
    cartOpen,
    setCartOpen,
    cartItems,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    cartTotal,
    cartCount,
    setActiveTab,
    setPlacedItems
  } = useCartStore()

  const [isPlacing, setIsPlacing] = useState(false)

  const subtotal = cartTotal()
  const cgst = Number((subtotal * 0.025).toFixed(2))
  const sgst = Number((subtotal * 0.025).toFixed(2))
  const grandTotal = subtotal + cgst + sgst

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return
    setIsPlacing(true)

    // Simulate API call to POST /api/orders
    console.log('Placing order to /api/orders...', {
      items: cartItems,
      totals: { subtotal, cgst, sgst, grandTotal }
    })

    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Update placed items state for tracking
      setPlacedItems(cartItems.map(item => ({
        ...item,
        status: 'pending',
        placedAt: new Date()
      })))

      clearCart()
      setCartOpen(false)
      setActiveTab('myorder')
      // In a real app, you'd show a toast here
    } catch (error) {
      console.error('Failed to place order:', error)
    } finally {
      setIsPlacing(false)
    }
  }

  return (
    <Sheet 
      open={cartOpen} 
      onOpenChange={(open) => {
        if (!open) {
          setCartOpen(false)
          setActiveTab('menu')
        }
      }} 
      modal={false}
    >
      <SheetContent 
        side="bottom" 
        className="rounded-t-[20px] max-h-[90vh] bg-(--surface) p-0 border-0 outline-none flex flex-col"
      >
        <VisuallyHidden>
          <SheetTitle>Your Cart</SheetTitle>
          <SheetDescription>Review items before ordering</SheetDescription>
        </VisuallyHidden>

        {/* Section 1 — scrollable content area */}
        <div className="flex-1 overflow-y-auto" style={{ paddingBottom: "calc(80px + env(safe-area-inset-bottom))" }}>
          {/* Drag Handle */}
          <div className="w-[36px] h-[4px] bg-border rounded-[2px] mx-auto mt-3 mb-4" />

          {/* Header */}
          <div className="px-5 flex items-center justify-between mb-4">
            <div className="flex items-baseline gap-2">
              <h2 className="text-[18px] font-bold text-foreground" style={{ fontFamily: 'var(--font-syne)' }}>
                Your Cart
              </h2>
              <span className="text-[13px] text-muted" style={{ fontFamily: 'var(--font-outfit)' }}>
                ({cartCount()} items)
              </span>
            </div>
          </div>

          {cartItems.length === 0 ? (
            <div className="px-5 py-20 text-center">
              <div className="w-16 h-16 bg-(--surface-2) rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="text-border" size={32} />
              </div>
              <p className="text-[14px] text-muted" style={{ fontFamily: 'var(--font-outfit)' }}>
                Your cart is empty
              </p>
            </div>
          ) : (
            <>
              {/* Item List */}
              <div className="px-5 space-y-0 divider-y divide-border">
                {cartItems.map((item, idx) => (
                  <div key={`${item.id}-${idx}`} className="flex gap-3 py-3 border-b border-border last:border-0">
                    {/* Image */}
                    <div className="w-[44px] h-[44px] shrink-0 rounded-[8px] overflow-hidden bg-(--surface-2) flex items-center justify-center text-[18px] font-bold text-muted">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        item.name.charAt(0)
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[14px] font-medium text-foreground" style={{ fontFamily: 'var(--font-outfit)' }}>
                        {item.name}
                      </h3>
                      {item.modifiers && item.modifiers.length > 0 && (
                        <div className="mt-0.5 space-y-0.5">
                          {item.modifiers.map((mod, midx) => (
                            <p key={midx} className="text-[12px] text-muted" style={{ fontFamily: 'var(--font-outfit)' }}>
                              {mod}
                            </p>
                          ))}
                        </div>
                      )}
                      {item.note && (
                        <p className="text-[11px] italic text-[#D97706] mt-1" style={{ fontFamily: 'var(--font-outfit)' }}>
                          "{item.note}"
                        </p>
                      )}
                    </div>

                    {/* Price & Stepper */}
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-[14px] font-semibold text-[#E8853A]" style={{ fontFamily: 'var(--font-outfit)' }}>
                        ₹{item.price * item.quantity}
                      </span>
                      <div className="flex items-center border border-border rounded-[6px] h-7">
                        <button 
                          onClick={() => updateQuantity(item.id, item.modifiers, item.quantity - 1)}
                          className="w-7 h-full flex items-center justify-center text-(--text-secondary) active:bg-(--surface-2)"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="min-w-[24px] text-center text-[13px] font-medium text-foreground" style={{ fontFamily: 'var(--font-outfit)' }}>
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.modifiers, item.quantity + 1)}
                          className="w-7 h-full flex items-center justify-center text-(--text-secondary) active:bg-(--surface-2)"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recommendations */}
              <div className="mt-6">
                <p className="px-5 text-[12px] font-bold text-muted uppercase tracking-wider mb-3" style={{ fontFamily: 'var(--font-outfit)' }}>
                  Often ordered together
                </p>
                <div className="flex gap-3 overflow-x-auto px-5 pb-4 no-scrollbar">
                  {/* TODO: replace with /lib/db/recommendations.ts query */}
                  {MOCK_RECOMMENDATIONS.map((rec) => (
                    <div 
                      key={rec.id}
                      className="shrink-0 w-[120px] bg-(--surface-2) border border-border rounded-[10px] p-2.5 flex flex-col"
                    >
                      <img src={rec.image} alt={rec.name} className="w-full h-[80px] object-cover rounded-[6px] mb-2" />
                      <h4 className="text-[12px] font-medium text-foreground line-clamp-2 leading-tight h-8 mb-1" style={{ fontFamily: 'var(--font-outfit)' }}>
                        {rec.name}
                      </h4>
                      <span className="text-[11px] text-[#E8853A] font-semibold mb-2">
                        ₹{rec.price}
                      </span>
                      <button 
                        onClick={() => addItem({ ...rec, quantity: 1, modifiers: [], note: '', imageUrl: rec.image })}
                        className="w-full h-7 border border-[#E8853A] text-[#E8853A] rounded-[6px] text-[11px] font-semibold active:bg-[#E8853A10] transition-colors"
                        style={{ fontFamily: 'var(--font-outfit)' }}
                      >
                        + Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* GST Breakdown */}
              <div className="px-5 py-4 border-t border-dashed border-border mt-2 bg-(--surface-2)">
                <div 
                  className="space-y-1 text-[12px] text-(--text-secondary)" 
                  style={{ fontFamily: "'Courier New', monospace" }}
                >
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CGST (2.5%)</span>
                    <span>₹{cgst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SGST (2.5%)</span>
                    <span>₹{sgst.toFixed(2)}</span>
                  </div>
                  <div className="h-px bg-current opacity-20 my-2" />
                  <div className="flex justify-between font-bold text-foreground text-[14px]" style={{ fontFamily: 'var(--font-outfit)' }}>
                    <span>TOTAL</span>
                    <span>₹{grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Section 2 — STICKY checkout footer */}
        {cartItems.length > 0 && (
          <div 
            className="shrink-0 bg-(--surface) border-t border-border"
            style={{
              padding: "12px 16px",
              paddingBottom: "calc(12px + env(safe-area-inset-bottom))",
            }}
          >
            <button
              disabled={isPlacing}
              onClick={handlePlaceOrder}
              className={cn(
                "w-full h-[52px] bg-[#E8853A] text-white rounded-[10px] text-[14px] font-bold uppercase tracking-[0.06em] flex items-center justify-center gap-2 transition-all active:scale-[0.98] active:bg-[#D4720A]",
                isPlacing && "opacity-80 pointer-events-none"
              )}
              style={{ fontFamily: 'var(--font-outfit)' }}
            >
              {isPlacing ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                `Place Order — ₹${grandTotal.toFixed(2)}`
              )}
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

'use client'

import React, { useState, useEffect } from 'react'
import { useCartStore } from '@/store/useCartStore'
import { RESTAURANT } from '@/lib/data'
import { Trash2 } from 'lucide-react'

export function CartBar({ navVisible = true }: { navVisible?: boolean }) {
  const count = useCartStore((s) => s.cartCount())
  const total = useCartStore((s) => s.cartTotal())
  const setCartOpen = useCartStore((s) => s.setCartOpen)
  const clearCart = useCartStore((s) => s.clearCart)

  const [isRendered, setIsRendered] = useState(count > 0)
  const [isExiting, setIsExiting] = useState(false)
  const [bounce, setBounce] = useState(false)
  const [clearConfirm, setClearConfirm] = useState(false)

  // Handle visibility and exit animation
  useEffect(() => {
    if (count > 0) {
      setIsRendered(true)
      setIsExiting(false)
    } else if (count === 0 && isRendered) {
      setIsExiting(true)
      const timer = setTimeout(() => {
        setIsRendered(false)
        setIsExiting(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [count, isRendered])

  // Handle badge bounce animation
  useEffect(() => {
    if (count > 0) {
      setBounce(true)
      const timer = setTimeout(() => setBounce(false), 350)
      return () => clearTimeout(timer)
    }
  }, [count])

  // Clear cart logic
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (clearConfirm) {
      timer = setTimeout(() => {
        setClearConfirm(false)
      }, 2000)
    }
    return () => clearTimeout(timer)
  }, [clearConfirm])

  const handleClear = () => {
    if (clearConfirm) {
      clearCart()
      setClearConfirm(false)
    } else {
      setClearConfirm(true)
    }
  }

  if (!isRendered) return null

  return (
    <>
      <style suppressHydrationWarning>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideDown {
          from { transform: translateY(0); opacity: 1; }
          to { transform: translateY(100%); opacity: 0; }
        }
        @keyframes badgeBounce {
          0% { transform: scale(1); }
          40% { transform: scale(1.5); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        .cartbar-slide-up {
          animation: slideUp 300ms cubic-bezier(0.34,1.56,0.64,1) forwards;
        }
        .cartbar-slide-down {
          animation: slideDown 300ms cubic-bezier(0.34,1.56,0.64,1) forwards;
        }
        .badge-bounce {
          animation: badgeBounce 350ms cubic-bezier(0.34,1.56,0.64,1) forwards;
        }
      `}</style>
      
      <div 
        className={isExiting ? "cartbar-slide-down" : "cartbar-slide-up"}
        style={{
          position: 'fixed',
          bottom: navVisible
            ? "calc(64px + env(safe-area-inset-bottom))"
            : "0px",
          opacity: navVisible ? 1 : 0,
          transition: "bottom 250ms ease, opacity 200ms ease",
          left: '16px',
          right: '16px',
          zIndex: 99,
          borderRadius: '14px',
          overflow: 'visible', // Visible to allow tooltip
          background: '#1A1714',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 6px 0 16px',
          gap: '12px',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.15)'
        }}
      >
        {/* LEFT Section */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <div 
            className={bounce ? "badge-bounce" : ""}
            style={{
              background: '#E8853A',
              color: '#FFFFFF',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              fontFamily: 'var(--font-outfit, sans-serif)',
              fontSize: '12px',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '8px'
            }}
          >
            {count}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ 
              fontFamily: 'var(--font-outfit, sans-serif)', 
              fontSize: '14px', 
              fontWeight: 600, 
              color: '#F5F0E8',
              lineHeight: 1.2 
            }}>
              {count} item{count !== 1 ? 's' : ''} | <span style={{ fontSize: '12px', fontWeight: 400 }}>₹</span>{total}
            </div>
            {RESTAURANT.name && (
              <div style={{ 
                fontFamily: 'var(--font-outfit, sans-serif)', 
                fontSize: '11px', 
                color: 'rgba(255,255,255,0.45)',
                lineHeight: 1.2 
              }}>
                {RESTAURANT.name}
              </div>
            )}
          </div>
        </div>

        {/* MIDDLE Section */}
        <button
          onClick={() => setCartOpen(true)}
          className="hover:bg-[#D4720A] active:scale-95 transition-all duration-150"
          style={{
            background: '#E8853A',
            color: '#FFFFFF',
            fontFamily: 'var(--font-outfit, sans-serif)',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.06em',
            padding: '10px 20px',
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            willChange: 'transform'
          }}
        >
          Checkout
        </button>

        {/* RIGHT Section */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={handleClear}
            className="transition-all duration-200"
            style={{
              width: '40px',
              height: '40px',
              background: clearConfirm ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.08)',
              border: `1px solid ${clearConfirm ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <Trash2 size={16} color={clearConfirm ? '#ef4444' : 'rgba(255,255,255,0.5)'} />
          </button>
          
          {/* Tooltip */}
          {clearConfirm && (
            <div 
              className="cartbar-slide-up"
              style={{
                position: 'absolute',
                bottom: '48px',
                right: '0',
                background: '#1A1714',
                border: '1px solid #2A2A2A',
                fontFamily: 'var(--font-outfit, sans-serif)',
                fontSize: '11px',
                color: '#F5F0E8',
                padding: '4px 10px',
                borderRadius: '6px',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                boxShadow: '0 -2px 10px rgba(0,0,0,0.2)'
              }}
            >
              Tap again to clear
            </div>
          )}
        </div>
      </div>
    </>
  )
}

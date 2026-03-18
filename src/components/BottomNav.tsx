'use client'

import React, { useEffect, useState } from 'react'
import { useCartStore } from '@/store/useCartStore'
import { cn } from '@/lib/utils'

export function BottomNav({ visible = true }: { visible?: boolean }) {
  const {
    activeTab,
    setActiveTab,
    cartCount,
    placedItems,
    lastAddedId,
    setCartOpen,
    setMyOrderOpen,
    setAssistOpen
  } = useCartStore()

  const [bounce, setBounce] = useState(false)

  // Badge Bounce logic
  useEffect(() => {
    if (lastAddedId) {
      setBounce(true)
      const timer = setTimeout(() => setBounce(false), 350)
      return () => clearTimeout(timer)
    }
  }, [lastAddedId])

  const currentCartCount = cartCount()
  const activeOrderCount = placedItems.filter(i => i.status !== 'served').length

  const tabs = [
    {
      id: 'menu',
      label: 'Menu',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      ),
      onClick: () => {
        setActiveTab('menu')
        setCartOpen(false)
        setMyOrderOpen(false)
        setAssistOpen(false)
      }
    },
    {
      id: 'myorder',
      label: 'My Order',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
          <line x1="8" y1="11" x2="16" y2="11" />
          <line x1="8" y1="15" x2="16" y2="15" />
        </svg>
      ),
      badge: activeOrderCount,
      onClick: () => {
        setActiveTab('myorder')
        setMyOrderOpen(true)
        setCartOpen(false)
        setAssistOpen(false)
      }
    },
    {
      id: 'cart',
      label: 'Cart',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      ),
      badge: currentCartCount,
      onClick: () => {
        setActiveTab('cart')
        setCartOpen(true)
        setMyOrderOpen(false)
        setAssistOpen(false)
      }
    },
    {
      id: 'assist',
      label: 'Assist',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <line x1="12" y1="9" x2="12" y2="9.01" />
          <line x1="12" y1="13" x2="12" y2="13.01" />
        </svg>
      ),
      onClick: () => {
        setActiveTab('assist')
        setAssistOpen(true)
        setCartOpen(false)
        setMyOrderOpen(false)
      }
    }
  ]

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-100 h-16 grid grid-cols-4 border-t"
      style={{
        background: 'var(--surface)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTopColor: 'var(--border)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        transform: visible
          ? "translateY(0)"
          : "translateY(calc(100% + env(safe-area-inset-bottom)))",
        transition: visible
          ? "transform 280ms cubic-bezier(0.34,1.56,0.64,1)"
          : "transform 220ms cubic-bezier(0.4,0,1,1)",
      }}
    >
      <style jsx global>{`
        @keyframes badgeBounce {
          0% { transform: scale(1); }
          50% { transform: scale(1.5); }
          80% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        .badge-animate {
          animation: badgeBounce 350ms cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>

      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        const color = isActive ? 'var(--accent)' : 'var(--text-muted)'

        return (
          <button
            key={tab.id}
            onClick={tab.onClick}
            className="relative flex flex-col items-center justify-center gap-1 transition-all outline-none"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            {/* Active Indicator Bar */}
            <div 
              className="absolute top-0 h-[2px] rounded-b-[2px] transition-all duration-300 ease-out"
              style={{ 
                background: '#E8853A',
                width: isActive ? '20px' : '0px',
                left: '50%',
                transform: 'translateX(-50%)'
              }}
            />

            <div className="relative flex items-center justify-center">
              <div style={{ color }}>{tab.icon}</div>
              
              {/* Badge */}
              {tab.badge !== undefined && tab.badge > 0 && (
                <div 
                  className={cn(
                    "absolute -top-1 -right-2 min-w-[14px] h-[14px] flex items-center justify-center rounded-full bg-[#E8853A] text-white",
                    tab.id === 'cart' && bounce ? "badge-animate" : ""
                  )}
                  style={{
                    fontFamily: 'var(--font-outfit)',
                    fontSize: '9px',
                    fontWeight: 800,
                    padding: '0 3px'
                  }}
                >
                  {tab.badge}
                </div>
              )}
            </div>

            <span 
              className="text-[10px] font-medium tracking-[0.04em]"
              style={{ 
                fontFamily: 'var(--font-outfit)',
                color 
              }}
            >
              {tab.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}

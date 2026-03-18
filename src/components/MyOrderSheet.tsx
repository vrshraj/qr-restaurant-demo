'use client'

import React from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { VisuallyHidden } from "@/components/ui/visually-hidden"
import { useCartStore } from '@/store/useCartStore'
import { Price } from './Price'
import { cn } from '@/lib/utils'

// Status mapping for progress bar
const STATUS_STEPS = [
  { label: 'Received', statuses: ['pending'] },
  { label: 'Accepted', statuses: ['accepted'] },
  { label: 'Cooking', statuses: ['cooking'] },
  { label: 'Ready', statuses: ['ready', 'served'] },
]

const STATUS_CONFIG = {
  pending: { color: '#60A5FA', label: 'Received' },
  accepted: { color: '#FBBF24', label: 'Accepted' },
  cooking: { color: '#FB923C', label: 'Cooking', pulse: true },
  ready: { color: '#34D399', label: 'Ready' },
  served: { color: '#D1D5DB', label: 'Served' },
}

export function MyOrderSheet({ tableNumber }: { tableNumber?: string }) {
  const {
    myOrderOpen,
    setMyOrderOpen,
    placedItems,
    setActiveTab,
  } = useCartStore()

  const onClose = () => {
    setMyOrderOpen(false)
    setActiveTab('menu')
  }

  // Calculate current progress step based on the most advanced status
  const getProgressStep = () => {
    if (placedItems.length === 0) return -1
    
    const statuses = placedItems.map(item => item.status)
    if (statuses.some(s => s === 'ready' || s === 'served')) return 3
    if (statuses.some(s => s === 'cooking')) return 2
    if (statuses.some(s => s === 'accepted')) return 1
    return 0 // pending
  }

  const currentStep = getProgressStep()
  const isOrderReady = placedItems.some(item => item.status === 'ready')

  return (
    <Sheet open={myOrderOpen} onOpenChange={(open) => !open && onClose()} modal={false}>
      <SheetContent
        side="bottom"
        className="rounded-t-[20px] max-h-[90vh] overflow-y-auto bg-(--surface) p-0 border-0 outline-none"
      >
        <VisuallyHidden>
          <SheetTitle>My Order</SheetTitle>
          <SheetDescription>Track your placed order status</SheetDescription>
        </VisuallyHidden>

        {/* Drag Handle */}
        <div className="w-[36px] h-[4px] bg-border rounded-[2px] mx-auto mt-3 mb-4" />

        {/* Header */}
        <div className="px-5 mb-6">
          <h2 className="text-[18px] font-bold text-foreground" style={{ fontFamily: 'var(--font-syne)' }}>
            My Order
          </h2>
          <p className="text-[13px] text-muted" style={{ fontFamily: 'var(--font-outfit)' }}>
            Table {tableNumber || '1'}
          </p>
        </div>

        {placedItems.length === 0 ? (
          <div className="px-5 py-20 text-center">
            <div className="text-[48px] mb-4">🍽</div>
            <p className="text-[14px] text-muted font-medium" style={{ fontFamily: 'var(--font-outfit)' }}>
              No active order yet
            </p>
            <p className="text-[12px] text-muted" style={{ fontFamily: 'var(--font-outfit)' }}>
              Add items from the menu
            </p>
          </div>
        ) : (
          <div className="px-5 pb-8">
            {/* Status Progress Bar */}
            <div className="relative flex justify-between mb-8 px-2">
              {/* Connecting Lines */}
              <div className="absolute top-[5px] left-0 right-0 h-[2px] bg-border -z-10 mx-6" />
              <div 
                className="absolute top-[5px] left-0 h-[2px] bg-[#E8853A] -z-10 transition-all duration-500 mx-6"
                style={{ width: `calc(${(currentStep / 3) * 100}% - 0px)` }}
              />

              {STATUS_STEPS.map((step, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <div 
                    className={cn(
                      "w-[12px] h-[12px] rounded-full transition-colors duration-500",
                      idx <= currentStep ? "bg-[#E8853A]" : "bg-border"
                    )}
                  />
                  <span 
                    className={cn(
                      "text-[9px] font-medium tracking-wider uppercase",
                      idx <= currentStep ? "text-[#E8853A]" : "text-muted"
                    )}
                    style={{ fontFamily: 'var(--font-outfit)' }}
                  >
                    {step.label}
                  </span>
                </div>
              ))}
            </div>

            {/* READY banner */}
            {isOrderReady && (
              <div className="mb-6 bg-[#ECFDF5] border border-[#6EE7B7] rounded-[10px] padding-[12px_16px] flex items-center gap-3">
                <span className="text-[20px]">🍽</span>
                <p className="text-[13px] text-[#065F46] font-medium" style={{ fontFamily: 'var(--font-outfit)' }}>
                  Your order is ready! Waiter is on the way.
                </p>
              </div>
            )}

            {/* TODO: add channel subscription here */}
            {/* channel: orders:{org_id}:{location_id} */}

            {/* Item List */}
            <div className="space-y-0 divide-y divide-border border-t border-border">
              {placedItems.map((item, idx) => {
                const config = STATUS_CONFIG[item.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending
                const isCooking = item.status === 'cooking'
                
                return (
                  <div 
                    key={`${item.id}-${idx}`} 
                    className={cn(
                      "flex items-center gap-3 py-3",
                      isCooking && "bg-[rgba(249,115,22,0.04)] rounded-[8px] px-2 -mx-2 my-1 border-none"
                    )}
                  >
                    {/* Status Dot */}
                    <div 
                      className={cn(
                        "w-[10px] h-[10px] rounded-full shrink-0",
                        isCooking && "animate-[cookPulse_1.5s_infinite]"
                      )}
                      style={{ background: config.color }}
                    />
                    
                    {/* Middle: Qty x Name */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[14px] font-medium text-foreground" style={{ fontFamily: 'var(--font-outfit)' }}>
                          {item.quantity} × {item.name}
                        </span>
                      </div>
                      <span className="text-[11px] font-medium" style={{ color: config.color, fontFamily: 'var(--font-outfit)' }}>
                        {config.label}
                      </span>
                    </div>

                    {/* Right: Price */}
                    <span className="text-[13px] font-semibold text-[#E8853A]" style={{ fontFamily: 'var(--font-outfit)' }}>
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Order Total */}
            <div className="mt-6 pt-4 border-t border-border flex justify-between items-center">
              <span className="text-[14px] font-bold text-foreground" style={{ fontFamily: 'var(--font-outfit)' }}>
                Order Total
              </span>
              <span className="text-[14px] font-bold text-foreground" style={{ fontFamily: 'var(--font-outfit)' }}>
                ₹{placedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)}
              </span>
            </div>
          </div>
        )}
      </SheetContent>
      <style jsx global>{`
        @keyframes cookPulse {
          0% { opacity: 1; }
          50% { opacity: 0.3; }
          100% { opacity: 1; }
        }
      `}</style>
    </Sheet>
  )
}

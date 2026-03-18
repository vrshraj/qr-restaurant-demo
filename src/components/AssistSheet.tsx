'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { VisuallyHidden } from "@/components/ui/visually-hidden"
import { useCartStore } from '@/store/useCartStore'
import { ChevronRight, Send } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AssistOption {
  id: string
  emoji: string
  title: string
  subtitle: string
  hasAction?: boolean
}

const ASSIST_OPTIONS: AssistOption[] = [
  { id: 'waiter', emoji: '🙋', title: 'Call Waiter', subtitle: 'Staff will visit your table' },
  { id: 'water', emoji: '💧', title: 'Request Water', subtitle: 'Mineral or normal' },
  { id: 'bill', emoji: '🧾', title: 'Ask for Bill', subtitle: "We'll prepare your check" },
  { id: 'special', emoji: '💬', title: 'Special Request', subtitle: 'Tell us anything', hasAction: true },
]

export function AssistSheet({ orgId = 'demo-org', locationId = 'demo-loc', tableId = '1' }) {
  const {
    assistOpen,
    setAssistOpen,
    setActiveTab,
  } = useCartStore()

  const [sentOptionId, setSentOptionId] = useState<string | null>(null)
  const [isSpecialExpanded, setIsSpecialExpanded] = useState(false)
  const [specialNote, setSpecialNote] = useState('')
  const [isSending, setIsSending] = useState(false)

  const onClose = () => {
    if (isSending) return
    setAssistOpen(false)
    setActiveTab('menu')
    // Reset internal state after sheet closes fully
    setTimeout(() => {
      setSentOptionId(null)
      setIsSpecialExpanded(false)
      setSpecialNote('')
    }, 500)
  }

  const handleRequest = async (option: AssistOption, note?: string) => {
    setIsSending(true)
    
    // Simulate Supabase insert
    // TODO: replace with your /lib/db/tableRequests.ts
    // table: table_requests
    // fields: org_id, location_id, table_id, request_type, created_at
    console.log('Sending table request...', {
      org_id: orgId,
      location_id: locationId,
      table_id: tableId,
      request_type: option.id,
      note: note || '',
      created_at: new Date()
    })

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    setSentOptionId(option.id)
    setIsSending(false)

    // Auto-close after 2s
    setTimeout(() => {
      onClose()
    }, 2000)
  }

  return (
    <Sheet open={assistOpen} onOpenChange={(open) => !open && onClose()} modal={false}>
      <SheetContent
        side="bottom"
        className="rounded-t-[20px] max-h-[70vh] overflow-y-auto bg-(--surface) p-0 border-0 outline-none"
      >
        <VisuallyHidden>
          <SheetTitle>Assist</SheetTitle>
          <SheetDescription>Request assistance from our staff</SheetDescription>
        </VisuallyHidden>

        {/* Drag Handle */}
        <div className="w-[36px] h-[4px] bg-border rounded-[2px] mx-auto mt-3 mb-6" />

        {/* Header */}
        <div className="px-5 mb-6">
          <h2 className="text-[22px] font-bold text-foreground" style={{ fontFamily: 'var(--font-syne)' }}>
            Need something?
          </h2>
          <p className="text-[13px] text-muted" style={{ fontFamily: 'var(--font-outfit)' }}>
            We'll send someone right away
          </p>
        </div>

        {/* Options List */}
        <div className="px-5 pb-8 space-y-[10px]">
          {ASSIST_OPTIONS.map((opt) => {
            const isSent = sentOptionId === opt.id
            const isSpecial = opt.id === 'special'
            const isDisabled = !!sentOptionId && !isSent

            return (
              <div 
                key={opt.id}
                className={cn(
                  "relative flex flex-col transition-all duration-300",
                  isDisabled && "opacity-40 grayscale-[0.5] pointer-events-none"
                )}
              >
                <div
                  onClick={() => {
                    if (isSent || isSending) return
                    if (isSpecial) {
                      setIsSpecialExpanded(!isSpecialExpanded)
                    } else {
                      handleRequest(opt)
                    }
                  }}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-[12px] border-[1.5px] transition-all duration-150 cursor-pointer select-none active:scale-[0.99]",
                    isSent 
                      ? "border-[#34D399] bg-[#ECFDF5] animate-[sentPop_300ms_cubic-bezier(0.34,1.56,0.64,1)] pointer-events-none"
                      : "border-border bg-(--surface-2) hover:border-[#E8853A] hover:bg-[#FFF7F0]"
                  )}
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  {/* Emoji / Icon */}
                  <div 
                    className={cn(
                      "w-[40px] h-[40px] rounded-full flex items-center justify-center text-[20px] shrink-0 transition-colors",
                      isSent ? "bg-[#34D399] text-white" : "bg-(--surface-2)"
                    )}
                  >
                    {isSent ? "✓" : opt.emoji}
                  </div>

                  {/* Middle Text */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[15px] font-semibold text-foreground" style={{ fontFamily: 'var(--font-outfit)' }}>
                      {isSent ? "Request sent!" : opt.title}
                    </h3>
                    <p className="text-[12px] text-muted truncate" style={{ fontFamily: 'var(--font-outfit)' }}>
                      {isSent ? "Staff has been notified" : opt.subtitle}
                    </p>
                  </div>

                  {/* Right Icon */}
                  {!isSent && !isSpecialExpanded && (
                    <ChevronRight className="text-muted shrink-0" size={16} />
                  )}
                </div>

                {/* Special Request Inline Expansion */}
                {isSpecial && isSpecialExpanded && !isSent && (
                  <div className="mt-2 space-y-3 p-1 animate-in fade-in slide-in-from-top-2 duration-300">
                    <textarea
                      autoFocus
                      value={specialNote}
                      onChange={(e) => setSpecialNote(e.target.value)}
                      placeholder="E.g. extra napkins, high chair..."
                      className="w-full h-[80px] p-3 rounded-[8px] border border-border text-[13px] bg-(--surface) resize-none focus:outline-none focus:border-[#E8853A]"
                      style={{ fontFamily: 'var(--font-outfit)' }}
                    />
                    <button
                      disabled={!specialNote.trim() || isSending}
                      onClick={() => handleRequest(opt, specialNote)}
                      className="w-full h-[48px] bg-[#E8853A] text-white rounded-[10px] text-[14px] font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
                      style={{ fontFamily: 'var(--font-outfit)' }}
                    >
                      {isSending ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send size={14} />
                          <span>Send Request</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </SheetContent>
      <style jsx global>{`
        @keyframes sentPop {
          0%  { transform: scale(0.95); opacity: 0.8 }
          60% { transform: scale(1.02) }
          100% { transform: scale(1); opacity: 1 }
        }
      `}</style>
    </Sheet>
  )
}

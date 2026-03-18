'use client'

import Link from 'next/link'
import { CheckCircle, Clock, ChevronRight, MapPin } from 'lucide-react'

interface ConfirmationPageProps {
    searchParams: Promise<{ orderId?: string }>
}

export default async function ConfirmationPage({ searchParams }: ConfirmationPageProps) {
    const { orderId } = await searchParams

    return (
        <div className="min-h-screen crave-noise flex flex-col items-center justify-center px-6 text-center" style={{ background: 'var(--bg)' }}>

            {/* ── Success icon ── */}
            <div
                className="w-28 h-28 rounded-full flex items-center justify-center mb-8 relative"
                style={{ background: 'var(--accent)', opacity: 0.1 }}
            />
            <div className="absolute top-[calc(50%-180px)] w-28 h-28 flex items-center justify-center">
                 <CheckCircle
                    className="w-16 h-16 relative z-10"
                    style={{ color: 'var(--accent)' }}
                    strokeWidth={1.5}
                />
            </div>

            {/* ── Headline ── */}
            <h1 
                className="text-[36px] text-foreground mb-3 leading-none"
                style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, letterSpacing: '-0.02em' }}
            >
                Order Placed!
            </h1>
            <p 
                className="text-(--text-secondary) text-[16px] max-w-xs mx-auto leading-relaxed"
                style={{ fontFamily: 'var(--font-outfit)' }}
            >
                Your request has reached the kitchen.<br/>Relax while we prepare your feast.
            </p>

            {/* ── Info card ── */}
            <div 
                className="mt-10 w-full max-w-sm rounded-[24px] border divide-y"
                style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
            >
                {orderId && (
                    <div className="px-6 py-5 flex items-center justify-between">
                        <span 
                            className="text-[12px] uppercase tracking-widest text-muted font-bold"
                            style={{ fontFamily: 'var(--font-outfit)' }}
                        >
                            Order Ref
                        </span>
                        <span 
                            className="text-[14px] font-bold text-foreground font-mono tracking-wider"
                        >
                            #{orderId}
                        </span>
                    </div>
                )}
                <div className="px-6 py-5 flex items-center gap-4 text-left">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center border" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}>
                        <Clock className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                    </div>
                    <div>
                        <p 
                            className="text-[12px] uppercase tracking-widest text-muted font-bold"
                            style={{ fontFamily: 'var(--font-outfit)' }}
                        >
                            Estimated Wait
                        </p>
                        <p 
                            className="text-[16px] font-bold text-foreground"
                            style={{ fontFamily: 'var(--font-outfit)' }}
                        >
                            15–20 minutes
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Buttons ── */}
            <div className="mt-8 w-full max-w-sm flex flex-col gap-4">
                <Link
                    href={`/tracking?orderId=${orderId ?? ''}`}
                    className="inline-flex items-center justify-center gap-3 w-full h-14 rounded-full font-bold text-white text-[16px] transition-all active:scale-[0.98] shadow-lg shadow-(--accent)/30"
                    style={{ background: 'var(--accent)', fontFamily: 'var(--font-outfit)' }}
                >
                    <MapPin className="w-5 h-5" />
                    Track Progress
                    <ChevronRight className="w-5 h-5" />
                </Link>

                <Link
                    href="/menu"
                    className="inline-flex items-center justify-center w-full h-14 rounded-full font-bold text-(--text-secondary) text-[16px] transition-all active:scale-[0.98]"
                    style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', fontFamily: 'var(--font-outfit)' }}
                >
                    Back to Menu
                </Link>
            </div>

            {/* ── Branding ── */}
            <div className="mt-12 opacity-30">
                <span 
                    className="text-[18px] text-foreground"
                    style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, letterSpacing: '-0.02em' }}
                >
                    CRAVE
                </span>
            </div>
        </div>
    )
}

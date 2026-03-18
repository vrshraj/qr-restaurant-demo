'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, ChefHat, Utensils, ChevronLeft } from 'lucide-react'

// ── Steps config ───────────────────────────────────────────────────────────

const STEPS = [
    { label: 'Order Received', icon: CheckCircle, delay: 0 },
    { label: 'Being Prepared', icon: ChefHat, delay: 8000 },
    { label: 'Ready to Serve', icon: Utensils, delay: 16000 },
]

const COUNTDOWN_SECONDS = 15 * 60 // 15:00

function fmt(s: number) {
    const m = Math.floor(s / 60).toString().padStart(2, '0')
    const sec = (s % 60).toString().padStart(2, '0')
    return `${m}:${sec}`
}

function TrackingContent() {
    const params = useSearchParams()
    const orderId = params.get('orderId') ?? ''

    const [activeStep, setActiveStep] = useState(0)
    const [seconds, setSeconds] = useState(COUNTDOWN_SECONDS)

    useEffect(() => {
        const timers = STEPS.map((step, i) =>
            step.delay > 0
                ? setTimeout(() => setActiveStep(i), step.delay)
                : null
        ).filter(Boolean)

        return () => { timers.forEach(t => clearTimeout(t!)) }
    }, [])

    useEffect(() => {
        if (seconds <= 0) return
        const id = setInterval(() => setSeconds(s => Math.max(0, s - 1)), 1000)
        return () => clearInterval(id)
    }, [seconds])

    return (
        <div className="min-h-screen crave-noise flex flex-col pb-32" style={{ background: 'var(--bg)' }}>
            
            {/* ── Header ── */}
            <header className="px-6 py-6 flex items-center justify-between border-b" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                <Link
                    href="/menu"
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                    style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
                >
                    <ChevronLeft className="w-5 h-5 text-foreground" />
                </Link>
                <div className="flex flex-col items-center">
                    <span 
                        className="text-[18px] text-foreground"
                        style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, letterSpacing: '-0.02em' }}
                    >
                        STATUS
                    </span>
                    <p style={{ fontFamily: 'var(--font-outfit)', fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Live Updates
                    </p>
                </div>
                <div className="w-10" />
            </header>

            <div className="flex-1 flex flex-col items-center justify-start px-6 pt-8 max-w-md mx-auto w-full">

                {/* ── Title Section ── */}
                <div className="text-center mb-10">
                    <p 
                        className="text-[12px] uppercase tracking-[0.2em] font-bold text-muted mb-3"
                        style={{ fontFamily: 'var(--font-outfit)' }}
                    >
                        Thank You
                    </p>
                    <h1 
                        className="text-[32px] font-bold text-foreground leading-tight"
                        style={{ fontFamily: 'var(--font-syne)' }}
                    >
                        Cooking in progress
                    </h1>
                </div>

                {/* ── Countdown ── */}
                <div 
                    className="w-full rounded-[32px] p-10 text-center mb-8 relative overflow-hidden"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                >
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-10 rounded-full -mr-16 -mt-16" style={{ background: 'var(--accent)' }} />
                    
                    <p className="text-[11px] text-(--text-secondary) uppercase tracking-[0.15em] font-bold mb-3" style={{ fontFamily: 'var(--font-outfit)' }}>
                        Estimated Wait
                    </p>
                    <p
                        className="text-[64px] font-extrabold tabular-nums tracking-tighter leading-none text-(--accent)"
                        style={{ fontFamily: 'var(--font-outfit)' }}
                    >
                        {fmt(seconds)}
                    </p>
                    <p className="text-[13px] text-(--text-secondary) mt-5" style={{ fontFamily: 'var(--font-outfit)' }}>
                        Minutes Remaining
                    </p>
                </div>

                {/* ── Progress path ── */}
                <div 
                    className="w-full rounded-[24px] px-8 py-10"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                >
                    <div className="flex flex-col gap-0">
                        {STEPS.map((step, i) => {
                            const done = i < activeStep
                            const active = i === activeStep
                            const Icon = step.icon
                            const isLast = i === STEPS.length - 1

                            return (
                                <div key={step.label} className="flex gap-6">
                                    <div className="flex flex-col items-center">
                                        <div
                                            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-700"
                                            style={{
                                                background: done || active ? 'var(--accent)' : 'var(--surface-2)',
                                                border: done || active ? '0' : '1px solid var(--border)'
                                            }}
                                        >
                                            <Icon
                                                className="w-5 h-5"
                                                style={{ color: done || active ? 'white' : 'var(--text-muted)' }}
                                            />
                                        </div>
                                        {!isLast && (
                                            <div
                                                className="w-px flex-1 min-h-[44px] my-1 transition-all duration-1000"
                                                style={{ background: done ? 'var(--accent)' : 'var(--border)' }}
                                            />
                                        )}
                                    </div>

                                    <div className="pb-10 pt-2 flex flex-col">
                                        <p
                                            className="text-[16px] font-bold transition-colors duration-500"
                                            style={{ 
                                                fontFamily: 'var(--font-outfit)',
                                                color: done || active ? 'var(--text-primary)' : 'var(--text-muted)'
                                            }}
                                        >
                                            {step.label}
                                        </p>
                                        {active && (
                                            <span
                                                className="text-[10px] font-bold uppercase tracking-widest mt-1.5"
                                                style={{ color: 'var(--accent)' }}
                                            >
                                                In progress
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* ── Order Footer ── */}
                {orderId && (
                    <div className="mt-8 px-6 py-4 rounded-xl flex items-center justify-between w-full border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                        <span className="text-[11px] text-muted font-bold uppercase tracking-widest" style={{ fontFamily: 'var(--font-outfit)' }}>Order Ref</span>
                        <span className="text-[13px] text-foreground font-mono font-bold tracking-widest">{orderId}</span>
                    </div>
                )}
            </div>

            {/* ── Fixed back action ── */}
            <div className="fixed bottom-0 inset-x-0 p-6 z-[100] max-w-md mx-auto w-full">
                <Link
                    href="/menu"
                    className="w-full h-14 rounded-full font-bold text-center text-[16px] text-(--text-secondary) transition-all active:scale-[0.98] flex items-center justify-center"
                    style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', fontFamily: 'var(--font-outfit)' }}
                >
                    Back to Menu
                </Link>
            </div>
        </div>
    )
}

export default function TrackingPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen crave-noise flex items-center justify-center text-foreground" style={{ background: 'var(--bg)' }}>
                <div className="w-8 h-8 rounded-full border-2 border-t-(--accent) border-border animate-spin" />
            </div>
        }>
            <TrackingContent />
        </Suspense>
    )
}

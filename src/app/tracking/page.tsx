'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { RESTAURANT } from '@/lib/data'
import { CheckCircle, ChefHat, Utensils } from 'lucide-react'

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

// ── Inner component (uses useSearchParams) ─────────────────────────────────

function TrackingContent() {
    const params = useSearchParams()
    const orderId = params.get('orderId') ?? ''

    const [activeStep, setActiveStep] = useState(0)
    const [seconds, setSeconds] = useState(COUNTDOWN_SECONDS)

    // Step auto-advance
    useEffect(() => {
        const timers = STEPS.map((step, i) =>
            step.delay > 0
                ? setTimeout(() => setActiveStep(i), step.delay)
                : null
        ).filter(Boolean)

        return () => { timers.forEach(t => clearTimeout(t!)) }
    }, [])

    // Countdown
    useEffect(() => {
        if (seconds <= 0) return
        const id = setInterval(() => setSeconds(s => Math.max(0, s - 1)), 1000)
        return () => clearInterval(id)
    }, [seconds])

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col">
            <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 max-w-md mx-auto w-full gap-10">

                {/* ── Restaurant header ── */}
                <div className="text-center">
                    <span className="text-5xl">{RESTAURANT.logo}</span>
                    <h1 className="text-xl font-bold mt-2">{RESTAURANT.name}</h1>
                    <p className="text-slate-400 text-sm mt-1">Your order is being prepared</p>
                </div>

                {/* ── Countdown timer ── */}
                <div className="text-center">
                    <p
                        className="text-7xl font-extrabold tabular-nums tracking-tight"
                        style={{ color: RESTAURANT.primaryColor }}
                    >
                        {fmt(seconds)}
                    </p>
                    <p className="text-slate-500 text-xs mt-2 uppercase tracking-widest">estimated wait</p>
                </div>

                {/* ── Step progress ── */}
                <div className="w-full bg-slate-800 rounded-2xl px-6 py-6">
                    <div className="flex flex-col gap-0">
                        {STEPS.map((step, i) => {
                            const done = i < activeStep
                            const active = i === activeStep
                            const Icon = step.icon
                            const isLast = i === STEPS.length - 1

                            return (
                                <div key={step.label} className="flex gap-4">
                                    {/* Left: icon + connector */}
                                    <div className="flex flex-col items-center">
                                        <div
                                            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-500"
                                            style={
                                                done || active
                                                    ? { background: RESTAURANT.primaryColor }
                                                    : { background: 'rgb(51 65 85)' }
                                            }
                                        >
                                            {done ? (
                                                <CheckCircle className="w-5 h-5 text-white" />
                                            ) : (
                                                <Icon
                                                    className="w-5 h-5"
                                                    style={{ color: active ? 'white' : 'rgb(100 116 139)' }}
                                                />
                                            )}
                                        </div>
                                        {!isLast && (
                                            <div
                                                className="w-0.5 flex-1 min-h-8 mt-1 mb-1 transition-all duration-700 rounded-full"
                                                style={{ background: done ? RESTAURANT.primaryColor : 'rgb(51 65 85)' }}
                                            />
                                        )}
                                    </div>

                                    {/* Right: label */}
                                    <div className="pb-6 flex items-start pt-1.5">
                                        <p
                                            className="text-sm font-semibold transition-colors duration-500"
                                            style={
                                                done || active
                                                    ? { color: 'white' }
                                                    : { color: 'rgb(100 116 139)' }
                                            }
                                        >
                                            {step.label}
                                            {active && (
                                                <span
                                                    className="ml-2 inline-block text-[10px] font-bold uppercase tracking-widest py-0.5 px-2 rounded-full"
                                                    style={{ background: `${RESTAURANT.primaryColor}30`, color: RESTAURANT.primaryColor }}
                                                >
                                                    Now
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* ── Order ID ── */}
                {orderId && (
                    <p className="text-slate-500 text-xs text-center">
                        Order <span className="font-mono text-slate-400">{orderId}</span>
                    </p>
                )}
            </div>

            {/* ── Back to Menu ── */}
            <div className="px-4 pb-10 max-w-md mx-auto w-full">
                <Link
                    href="/menu"
                    className="block w-full py-4 rounded-2xl font-bold text-center text-base transition-opacity hover:opacity-90"
                    style={{ background: RESTAURANT.primaryColor }}
                >
                    Back to Menu
                </Link>
            </div>
        </div>
    )
}

// ── Page (wraps inner in Suspense as required by Next.js) ─────────────────

export default function TrackingPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
                Loading...
            </div>
        }>
            <TrackingContent />
        </Suspense>
    )
}

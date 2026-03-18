'use client'

import { useEffect, useState } from 'react'
import { useOrders } from '@/context/OrderContext'
import { KDSTicket } from '@/components/KDSTicket'

const DM  = 'var(--font-dm-mono), "DM Mono", monospace'
const PJS = 'var(--font-plus-jakarta), "Plus Jakarta Sans", sans-serif'

export default function KDSPage() {
    const { orders, updateStatus } = useOrders()
    const [syncStatus, setSyncStatus] = useState('synced')
    const [time, setTime] = useState(new Date())

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000)
        const checkSync = () => {
            setSyncStatus('syncing')
            setTimeout(() => setSyncStatus('synced'), 300)
        }
        const syncInterval = setInterval(checkSync, 5000)
        return () => { clearInterval(timer); clearInterval(syncInterval) }
    }, [])

    const pending   = orders.filter(o => o.status === 'PENDING')
    const accepted  = orders.filter(o => o.status === 'ACCEPTED')
    const preparing = orders.filter(o => o.status === 'PREPARING')
    const ready     = orders.filter(o => o.status === 'READY')
    const totalActive = pending.length + accepted.length + preparing.length + ready.length

    const STATS = [
        { label: 'INCOMING', count: pending.length,   color: '#FFFFFF'  },
        { label: 'ACCEPTED', count: accepted.length,  color: '#FBBF24'  }, // amber-400
        { label: 'COOKING',  count: preparing.length, color: '#FB923C'  }, // orange-400
        { label: 'READY',    count: ready.length,     color: '#34D399'  }, // emerald-400
    ]

    const SECTIONS = [
        { key: 'pending',   label: 'INCOMING QUEUE',  items: pending   },
        { key: 'accepted',  label: 'ACCEPTED ORDERS', items: accepted  },
        { key: 'preparing', label: 'IN PREPARATION',  items: preparing },
        { key: 'ready',     label: 'READY TO SERVE',  items: ready     },
    ]

    return (
        <>
            <style>{`
                @keyframes kds-dot-pulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50%       { transform: scale(1.5); opacity: 0.6; }
                }
                .kds-dot { animation: kds-dot-pulse 2s ease-in-out infinite; }
            `}</style>

            <div className="min-h-screen flex flex-col" style={{ background: '#F4F3F0' }}>

                {/* ── Header ── */}
                <header className="sticky top-0 z-30" style={{ background: '#FFFFFF', borderBottom: '1px solid #E2DED8', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                    <div className="flex items-center justify-between px-8 py-4">
                        {/* Title */}
                        <h1
                            className="font-bold leading-none"
                            style={{ fontFamily: 'var(--font-syne)', fontSize: 22, letterSpacing: '-0.02em', color: '#1A1714' }}
                        >
                            Kitchen Display <span style={{ color: '#C4BDB6' }}>System</span>
                        </h1>

                        {/* Right cluster */}
                        <div className="flex items-center gap-5">
                            {/* Sync */}
                            <div className={`flex items-center gap-2 transition-opacity duration-500 ${syncStatus === 'synced' ? 'opacity-100' : 'opacity-20'}`}>
                                <div
                                    className="kds-dot w-1.5 h-1.5 rounded-full"
                                    style={{ background: '#22C55E', boxShadow: '0 0 5px rgba(34,197,94,0.5)' }}
                                />
                                <span style={{ fontFamily: DM, fontSize: 9, letterSpacing: '0.18em', color: '#C4BDB6', textTransform: 'uppercase' }}>
                                    System Cloud Sync
                                </span>
                            </div>

                            {/* Clock */}
                            <div
                                className="flex items-center px-3 py-1.5 rounded-md"
                                style={{ background: '#F0EEE9', border: '1px solid #E2DED8' }}
                            >
                                <span style={{ fontFamily: DM, fontSize: 13, color: '#6B6460' }}>
                                    {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* ── Stats bar ── */}
                    <div
                        className="flex items-center"
                        style={{
                            background: '#FFFFFF',
                            borderBottom: '1px solid #E2DED8',
                            padding: '18px 32px',
                        }}
                    >
                        {STATS.map((s, idx) => (
                            <div key={s.label} className="flex" style={{ alignItems: 'center' }}>
                                {idx > 0 && (
                                    <div style={{ width: 1, height: 40, background: '#E2DED8', margin: '0 48px' }} />
                                )}
                                <div className="flex flex-col" style={{ gap: 5 }}>
                                    <span style={{ fontFamily: DM, fontSize: 44, fontWeight: 400, lineHeight: 1, color: s.color === '#FFFFFF' ? '#1A1714' : s.color }}>
                                        {s.count.toString().padStart(2, '0')}
                                    </span>
                                    <span style={{ fontFamily: DM, fontSize: 9, color: '#A09890', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                                        {s.label}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </header>

                {/* ── Main ── */}
                <main className="flex-1 px-8 py-8">
                    {totalActive === 0 ? (
                        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
                            <span style={{ fontSize: 64, opacity: 0.06 }}>👨‍🍳</span>
                            <div className="text-center">
                                <p style={{ fontFamily: 'var(--font-syne)', fontSize: 20, color: '#3A3A3A', fontWeight: 700 }}>The pass is clear</p>
                                <p style={{ fontFamily: DM, fontSize: 10, color: '#525252', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: 6 }}>
                                    Waiting for digital orders
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-12">
                            {SECTIONS.filter(s => s.items.length > 0).map((section, si) => (
                                <section key={section.key} className="animate-in fade-in slide-in-from-bottom-2 duration-700" style={{ animationDelay: `${si * 75}ms` }}>
                                    {/* Section divider label */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                                        {section.key === 'ready' && (
                                            <div className="w-2 h-2 rounded-full bg-[#34D399] animate-ready-pulse shrink-0" />
                                        )}
                                        <span style={{
                                            fontFamily: DM,
                                            fontSize: 10,
                                            fontWeight: 500,
                                            letterSpacing: '0.2em',
                                            textTransform: 'uppercase',
                                            color: section.key === 'ready' ? '#34D399' : '#A09890',
                                            whiteSpace: 'nowrap',
                                        }}>
                                            {section.label}
                                        </span>
                                        <div style={{ flex: 1, height: 1, background: '#E2DED8' }} />
                                    </div>

                                    {/* Cards grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                        {section.items.map(order => (
                                            <KDSTicket key={order.id} order={order} onStatusUpdate={updateStatus} />
                                        ))}
                                    </div>
                                </section>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </>
    )
}

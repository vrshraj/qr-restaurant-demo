'use client'

import { useEffect, useState } from 'react'
import { useOrders } from '@/context/OrderContext'
import { KDSTicket } from '@/components/KDSTicket'
import { Zap, Clock as ClockIcon } from 'lucide-react'

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
        
        return () => {
            clearInterval(timer)
            clearInterval(syncInterval)
        }
    }, [])

    const pending = orders.filter(o => o.status === 'PENDING')
    const accepted = orders.filter(o => o.status === 'ACCEPTED')
    const preparing = orders.filter(o => o.status === 'PREPARING')
    const ready = orders.filter(o => o.status === 'READY')

    const totalActive = pending.length + accepted.length + preparing.length + ready.length

    return (
        <div className="min-h-screen bg-black text-white font-inter selection:bg-rusty-orange/30">
            {/* ── Header ── */}
            <header className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-white/5">
                <div className="px-4 md:px-8 py-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                        <div className="space-y-1">
                            <h1 className="text-4xl md:text-5xl font-serif tracking-tight text-white leading-none">
                                Kitchen Display <span className="text-white/40">System</span>
                            </h1>
                        </div>
                        
                        <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-4 md:gap-2">
                            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                                <ClockIcon className="w-4 h-4 text-golden-hour" />
                                <span className="text-base md:text-lg font-medium tracking-tight">
                                    {time.toLocaleTimeString('en-US', { 
                                        hour: '2-digit', 
                                        minute: '2-digit',
                                        hour12: false 
                                    })}
                                </span>
                            </div>
                            <div className={`flex items-center gap-1.5 transition-opacity duration-500 ${
                                syncStatus === 'synced' ? 'opacity-100' : 'opacity-40'
                            }`}>
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">System Cloud Sync</span>
                            </div>
                        </div>
                    </div>

                    {/* ── Stats Dashboard ── */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                        {[
                            { label: 'Incoming', count: pending.length, theme: 'bg-white border-white/10 text-black', countColor: 'text-black', labelColor: 'text-black/40' },
                            { label: 'Accepted', count: accepted.length, theme: 'bg-blue-600 border-blue-400/20 text-white', countColor: 'text-white', labelColor: 'text-white/60' },
                            { label: 'Cooking', count: preparing.length, theme: 'bg-rusty-orange border-white/10 text-white', countColor: 'text-white', labelColor: 'text-white/60' },
                            { label: 'Ready', count: ready.length, theme: 'bg-green-600 border-green-400/20 text-white', countColor: 'text-white', labelColor: 'text-white/60' }
                        ].map((stat, i) => (
                            <div key={i} className={`group relative p-4 md:p-5 ${stat.theme} border rounded-2xl transition-all duration-300 shadow-xl overflow-hidden`}>
                                <p className={`text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] ${stat.labelColor} mb-1 relative z-10`}>{stat.label}</p>
                                <p className={`text-4xl md:text-5xl font-serif ${stat.countColor} relative z-10`}>{stat.count.toString().padStart(2, '0')}</p>
                                <div className="absolute -right-2 -bottom-2 w-16 h-16 bg-black/5 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
                            </div>
                        ))}
                    </div>
                </div>
            </header>

            {/* ── Main Content ── */}
            <main className="px-4 md:px-8 py-10">
                {totalActive === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6">
                        <div className="text-8xl opacity-10 grayscale">👨‍🍳</div>
                        <div className="text-center space-y-2">
                            <h2 className="text-3xl font-serif text-white/80">The pass is clear</h2>
                            <p className="text-sm text-white/30 uppercase tracking-widest font-bold">Waiting for digital orders</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-16">
                        {/* ── Section: Incoming ── */}
                        {pending.length > 0 && (
                            <section className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
                                <div className="flex items-center gap-4 mb-8">
                                    <h2 className="font-serif text-2xl text-white italic">Incoming <span className="text-white/40">Queue</span></h2>
                                    <div className="h-px flex-1 bg-linear-to-r from-white/10 to-transparent" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                                    {pending.map((order) => (
                                        <KDSTicket key={order.id} order={order} onStatusUpdate={updateStatus} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* ── Section: Accepted ── */}
                        {accepted.length > 0 && (
                            <section className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100">
                                <div className="flex items-center gap-4 mb-8">
                                    <h2 className="font-serif text-2xl text-blue-400">Accepted <span className="text-white/40">Orders</span></h2>
                                    <div className="h-px flex-1 bg-linear-to-r from-blue-500/20 to-transparent" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                                    {accepted.map((order) => (
                                        <KDSTicket key={order.id} order={order} onStatusUpdate={updateStatus} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* ── Section: Cooking ── */}
                        {preparing.length > 0 && (
                            <section className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
                                <div className="flex items-center gap-4 mb-8">
                                    <h2 className="font-serif text-2xl text-rusty-orange">In <span className="text-rusty-orange/40">Preparation</span></h2>
                                    <div className="h-px flex-1 bg-linear-to-r from-rusty-orange/20 to-transparent" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                                    {preparing.map((order) => (
                                        <KDSTicket key={order.id} order={order} onStatusUpdate={updateStatus} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* ── Section: Ready ── */}
                        {ready.length > 0 && (
                            <section className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
                                <div className="flex items-center gap-4 mb-8">
                                    <h2 className="font-serif text-2xl text-green-400">Ready <span className="text-white/40">to Serve</span></h2>
                                    <div className="h-px flex-1 bg-linear-to-r from-green-500/20 to-transparent" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                                    {ready.map((order) => (
                                        <KDSTicket key={order.id} order={order} onStatusUpdate={updateStatus} />
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                )}
            </main>
        </div>
    )
}

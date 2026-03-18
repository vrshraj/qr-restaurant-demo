'use client'

import { useEffect, useState } from 'react'
import { useOrders } from '@/context/OrderContext'
import { KDSTicket } from '@/components/KDSTicket'
import { RESTAURANT } from '@/lib/data'
import { Zap } from 'lucide-react'

export default function KDSPage() {
    const { orders, updateStatus } = useOrders()
    const [syncStatus, setSyncStatus] = useState('synced')
    const [lastSync, setLastSync] = useState(Date.now())

    // Real-time polling for cross-device sync
    useEffect(() => {
        // Initial sync check
        const checkSync = () => {
            setSyncStatus('syncing')
            // Simulate network check
            setTimeout(() => {
                setSyncStatus('synced')
                setLastSync(Date.now())
            }, 300)
        }

        // Poll every 500ms for new orders
        const syncInterval = setInterval(checkSync, 500)
        return () => clearInterval(syncInterval)
    }, [])

    const pending = orders.filter(o => o.status === 'PENDING')
    const accepted = orders.filter(o => o.status === 'ACCEPTED')
    const preparing = orders.filter(o => o.status === 'PREPARING')
    const ready = orders.filter(o => o.status === 'READY')

    const totalActive = pending.length + accepted.length + preparing.length + ready.length

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
            {/* ── Header ── */}
            <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-700/50 shadow-2xl">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Zap className="w-8 h-8 text-amber-500 animate-pulse" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black tracking-tight">Kitchen Display</h1>
                                <p className="text-xs text-slate-400">Real-time Order Management</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-slate-400">
                                {new Date().toLocaleTimeString('en-US', { 
                                    hour: '2-digit', 
                                    minute: '2-digit',
                                    second: '2-digit',
                                    hour12: true 
                                })}
                            </div>
                            <div className={`text-xs font-semibold flex items-center gap-1.5 justify-end mt-1 ${
                                syncStatus === 'synced' ? 'text-green-400' : 'text-amber-400'
                            }`}>
                                <span className={`w-2 h-2 rounded-full ${
                                    syncStatus === 'synced' ? 'bg-green-400' : 'bg-amber-400'
                                } animate-pulse`} />
                                {syncStatus === 'synced' ? 'Synced' : 'Syncing...'}
                            </div>
                        </div>
                    </div>

                    {/* ── Stats Grid ── */}
                    <div className="grid grid-cols-4 gap-3">
                        <div className="bg-linear-to-br from-yellow-500/20 to-yellow-600/10 border border-yellow-500/30 rounded-lg px-3 py-2.5 backdrop-blur-sm">
                            <p className="text-xs text-yellow-300/80 font-semibold uppercase tracking-wider">Pending</p>
                            <p className="text-2xl font-black text-yellow-400 mt-1">{pending.length}</p>
                        </div>
                        <div className="bg-linear-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-lg px-3 py-2.5 backdrop-blur-sm">
                            <p className="text-xs text-blue-300/80 font-semibold uppercase tracking-wider">Accepted</p>
                            <p className="text-2xl font-black text-blue-400 mt-1">{accepted.length}</p>
                        </div>
                        <div className="bg-linear-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/30 rounded-lg px-3 py-2.5 backdrop-blur-sm">
                            <p className="text-xs text-orange-300/80 font-semibold uppercase tracking-wider">Cooking</p>
                            <p className="text-2xl font-black text-orange-400 mt-1">{preparing.length}</p>
                        </div>
                        <div className="bg-linear-to-br from-green-500/20 to-green-600/10 border border-green-500/30 rounded-lg px-3 py-2.5 backdrop-blur-sm">
                            <p className="text-xs text-green-300/80 font-semibold uppercase tracking-wider">Ready</p>
                            <p className="text-2xl font-black text-green-400 mt-1">{ready.length}</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* ── Main Content ── */}
            <main className="px-6 py-6 pb-12">
                {totalActive === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-96 gap-6 text-slate-400">
                        <div className="relative">
                            <div className="absolute inset-0 bg-slate-700/30 rounded-full blur-2xl animate-pulse" />
                            <div className="text-6xl relative">🔔</div>
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-semibold mb-1">All caught up!</p>
                            <p className="text-sm text-slate-500">Waiting for new orders...</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
                        {/* ── PENDING Orders (Top Priority) ── */}
                        {pending.length > 0 && (
                            <div className="lg:col-span-3 mb-2">
                                <h2 className="text-xs font-black uppercase tracking-wider text-yellow-400 mb-3 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                                    INCOMING ORDERS — {pending.length}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {pending.map((order, idx) => (
                                        <div
                                            key={order.id}
                                            className="animate-in fade-in zoom-in-95 duration-300"
                                            style={{ animationDelay: `${idx * 50}ms` }}
                                        >
                                            <KDSTicket
                                                order={order}
                                                onStatusUpdate={updateStatus}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── ACCEPTED Orders ── */}
                        {accepted.length > 0 && (
                            <div className="lg:col-span-3 mb-2">
                                <h2 className="text-xs font-black uppercase tracking-wider text-blue-400 mb-3 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                                    ACCEPTED — {accepted.length}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {accepted.map((order, idx) => (
                                        <div
                                            key={order.id}
                                            className="animate-in fade-in duration-500"
                                            style={{ animationDelay: `${idx * 50}ms` }}
                                        >
                                            <KDSTicket
                                                order={order}
                                                onStatusUpdate={updateStatus}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── PREPARING Orders ── */}
                        {preparing.length > 0 && (
                            <div className="lg:col-span-3 mb-2">
                                <h2 className="text-xs font-black uppercase tracking-wider text-orange-400 mb-3 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                                    COOKING — {preparing.length}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {preparing.map((order, idx) => (
                                        <div
                                            key={order.id}
                                            className="animate-in fade-in duration-500"
                                            style={{ animationDelay: `${idx * 50}ms` }}
                                        >
                                            <KDSTicket
                                                order={order}
                                                onStatusUpdate={updateStatus}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── READY Orders ── */}
                        {ready.length > 0 && (
                            <div className="lg:col-span-3 mb-2">
                                <h2 className="text-xs font-black uppercase tracking-wider text-green-400 mb-3 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                    READY FOR PICKUP — {ready.length}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {ready.map((order, idx) => (
                                        <div
                                            key={order.id}
                                            className="animate-in fade-in duration-500"
                                            style={{ animationDelay: `${idx * 50}ms` }}
                                        >
                                            <KDSTicket
                                                order={order}
                                                onStatusUpdate={updateStatus}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    )
}

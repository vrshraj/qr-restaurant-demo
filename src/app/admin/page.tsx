'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useOrders } from '@/context/OrderContext'
import { MENU_ITEMS, RESTAURANT } from '@/lib/data'
import type { OrderStatus, TableStatus } from '@/context/OrderContext'
import { UtensilsCrossed, Monitor, Settings } from 'lucide-react'

// ── Status helpers ─────────────────────────────────────────────────────────

const ORDER_STATUS_STYLE: Record<OrderStatus, string> = {
    PENDING: 'bg-slate-100 text-slate-600',
    ACCEPTED: 'bg-yellow-100 text-yellow-700',
    PREPARING: 'bg-blue-100 text-blue-700',
    READY: 'bg-green-100 text-green-700',
    SERVED: 'bg-stone-100 text-stone-500',
}

const TABLE_STATUS_STYLE: Record<TableStatus, { badge: string; label: string }> = {
    VACANT: { badge: 'bg-green-100 text-green-700', label: 'Available' },
    OCCUPIED: { badge: 'bg-red-100 text-red-700', label: 'Occupied' },
    PAYMENT_PENDING: { badge: 'bg-yellow-100 text-yellow-700', label: 'Pay Pending' },
    DIRTY: { badge: 'bg-orange-100 text-orange-700', label: 'Needs Cleaning' },
}

function timeAgo(date: Date): string {
    const diff = Math.floor((Date.now() - new Date(date).getTime()) / 60000)
    if (diff < 1) return 'just now'
    if (diff === 1) return '1 min ago'
    return `${diff} min ago`
}

// ── Stat card ──────────────────────────────────────────────────────────────

function StatCard({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
    return (
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm px-5 py-4 flex flex-col gap-1">
            <p className="text-xs text-stone-400 uppercase tracking-widest font-medium">{label}</p>
            <p
                className="text-4xl font-extrabold"
                style={accent ? { color: RESTAURANT.primaryColor } : { color: '#1c1917' }}
            >
                {value}
            </p>
        </div>
    )
}

// ── Toggle switch ──────────────────────────────────────────────────────────

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
    return (
        <button
            role="switch"
            aria-checked={checked}
            onClick={onChange}
            className={`relative inline-flex w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${checked ? '' : 'bg-stone-200'
                }`}
            style={checked ? { background: RESTAURANT.primaryColor } : {}}
        >
            <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'
                    }`}
            />
        </button>
    )
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function AdminPage() {
    const { orders, tables, unavailableItems, toggle86 } = useOrders()

    // Stats
    const total = orders.length
    const pending = orders.filter(o => o.status === 'PENDING').length
    const inProgress = orders.filter(o => o.status === 'ACCEPTED' || o.status === 'PREPARING').length
    const ready = orders.filter(o => o.status === 'READY').length

    // Orders newest first
    const sortedOrders = [...orders].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    return (
        <div className="min-h-screen bg-stone-50">

            {/* ── Header ── */}
            <header className="bg-white border-b border-stone-100 px-6 py-4 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto flex items-center gap-3">
                    <span className="text-2xl">{RESTAURANT.logo}</span>
                    <div>
                        <h1 className="font-bold text-stone-800 text-lg leading-tight">{RESTAURANT.name}</h1>
                        <p className="text-xs text-stone-400 uppercase tracking-widest">Admin Dashboard</p>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 md:px-6 py-6 pb-28 space-y-8">

                {/* ── Stats ── */}
                <section>
                    <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-3">Overview</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <StatCard label="Total Orders" value={total} accent />
                        <StatCard label="Pending" value={pending} />
                        <StatCard label="In Progress" value={inProgress} />
                        <StatCard label="Ready" value={ready} />
                    </div>
                </section>

                {/* ── Tables ── */}
                <section>
                    <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-3">Tables</h2>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                        {Object.entries(tables).map(([num, status]) => {
                            const cfg = TABLE_STATUS_STYLE[status as TableStatus]
                            return (
                                <div
                                    key={num}
                                    className="bg-white rounded-2xl border border-stone-100 shadow-sm px-3 py-3 flex flex-col items-center gap-2"
                                >
                                    <p className="text-2xl font-extrabold text-stone-800">{num}</p>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.badge}`}>
                                        {cfg.label}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </section>

                {/* ── 86 Toggles ── */}
                <section>
                    <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-3">
                        Item Availability <span className="normal-case font-normal text-stone-400">(toggle off = 86&apos;d)</span>
                    </h2>
                    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm divide-y divide-stone-50">
                        {MENU_ITEMS.map((item) => {
                            const available = !unavailableItems.has(item.id)
                            return (
                                <div
                                    key={item.id}
                                    className={`flex items-center justify-between px-5 py-3 transition-opacity ${available ? '' : 'opacity-40'}`}
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-10 h-10 rounded-xl object-cover shrink-0"
                                        />
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-stone-800 truncate">{item.name}</p>
                                            <p className="text-xs text-stone-400">₹{item.price}</p>
                                        </div>
                                    </div>
                                    <Toggle
                                        checked={available}
                                        onChange={() => toggle86(item.id)}
                                    />
                                </div>
                            )
                        })}
                    </div>
                </section>

                {/* ── Orders table ── */}
                <section>
                    <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-3">All Orders</h2>
                    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
                        {sortedOrders.length === 0 ? (
                            <p className="text-stone-400 text-sm text-center py-10">No orders yet</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-stone-100">
                                            <th className="text-left px-5 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wide">Order #</th>
                                            <th className="text-left px-4 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wide">Table</th>
                                            <th className="text-left px-4 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wide">Items</th>
                                            <th className="text-left px-4 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wide">Status</th>
                                            <th className="text-left px-4 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wide">Time</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-stone-50">
                                        {sortedOrders.map((order) => (
                                            <tr key={order.id} className="hover:bg-stone-50 transition-colors">
                                                <td className="px-5 py-3 font-mono text-xs text-stone-600">{order.id}</td>
                                                <td className="px-4 py-3 font-bold text-stone-800">{order.tableNumber || '–'}</td>
                                                <td className="px-4 py-3 text-stone-500 max-w-[260px] truncate">
                                                    {order.items.map(i => `${i.qty}× ${i.name}`).join(', ')}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full ${ORDER_STATUS_STYLE[order.status]}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td suppressHydrationWarning className="px-4 py-3 text-stone-400 text-xs whitespace-nowrap">
                                                    {timeAgo(order.createdAt)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </section>

            </main>

            {/* ── Sticky bottom nav ── */}
            <BottomNav />
        </div>
    )
}

// ── Bottom Nav ─────────────────────────────────────────────────────────────

const NAV_ITEMS = [
    { label: 'Menu', href: '/menu?table=4', Icon: UtensilsCrossed },
    { label: 'KDS', href: '/kds', Icon: Monitor },
    { label: 'Admin', href: '/admin', Icon: Settings },
]

function BottomNav() {
    const pathname = usePathname()
    return (
        <nav className="fixed bottom-0 inset-x-0 z-50 bg-white border-t border-stone-100 flex">
            {NAV_ITEMS.map(({ label, href, Icon }) => {
                const active = pathname === href.split('?')[0]
                return (
                    <Link
                        key={href}
                        href={href}
                        className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 text-[11px] font-semibold transition-colors ${active ? 'text-stone-900' : 'text-stone-400 hover:text-stone-600'
                            }`}
                    >
                        <Icon
                            className="w-5 h-5"
                            style={active ? { color: RESTAURANT.primaryColor } : {}}
                        />
                        {label}
                    </Link>
                )
            })}
        </nav>
    )
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useOrders } from '@/context/OrderContext'
import { MENU_ITEMS, RESTAURANT } from '@/lib/data'
import type { OrderStatus, TableStatus } from '@/context/OrderContext'
import { UtensilsCrossed, Monitor, Settings } from 'lucide-react'

// ── Status helpers ─────────────────────────────────────────────────────────

const ORDER_STATUS_STYLE: Record<OrderStatus, string> = {
    PENDING: 'bg-[#1A1917] text-[#6B6560] border border-[#2A2724]',
    ACCEPTED: 'bg-[#1A1917] text-[#F5F0E8] border border-[#2A2724]',
    PREPARING: 'bg-[#E8853A]/10 text-[#E8853A] border border-[#E8853A]/20',
    READY: 'bg-[#4CAF50]/10 text-[#4CAF50] border border-[#4CAF50]/20',
    SERVED: 'bg-[#1A1917] text-[#4A4542] border border-[#2A2724] opacity-50',
}

const TABLE_STATUS_STYLE: Record<TableStatus, { badge: string; label: string }> = {
    VACANT: { badge: 'bg-[#4CAF50]/10 text-[#4CAF50] border border-[#4CAF50]/20', label: 'Vacant' },
    OCCUPIED: { badge: 'bg-[#E8853A]/10 text-[#E8853A] border border-[#E8853A]/20', label: 'Occupied' },
    PAYMENT_PENDING: { badge: 'bg-[#E8853A]/20 text-[#E8853A] border border-[#E8853A]/40', label: 'Pay Due' },
    DIRTY: { badge: 'bg-[#1A1917] text-[#6B6560] border border-[#2A2724]', label: 'Dirty' },
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
        <div 
            className="rounded-[24px] border px-6 py-6 flex flex-col gap-2 transition-all"
            style={{ background: '#1A1917', borderColor: accent ? '#E8853A/30' : '#2A2724' }}
        >
            <p 
                className="text-[10px] uppercase tracking-[0.2em] font-bold"
                style={{ color: accent ? '#E8853A' : '#6B6560', fontFamily: 'var(--font-outfit)' }}
            >
                {label}
            </p>
            <p
                className="text-[42px] font-bold leading-none tracking-tighter"
                style={{ 
                    fontFamily: 'var(--font-syne)', 
                    color: accent ? '#F5F0E8' : '#F5F0E8' 
                }}
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
            className={`relative inline-flex w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${checked ? '' : 'bg-[#2A2724]'
                }`}
            style={checked ? { background: '#E8853A' } : {}}
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
        <div className="min-h-screen crave-noise flex flex-col font-outfit pb-28" style={{ background: '#0F0E0D' }}>

            {/* ── Header ── */}
            <header className="px-6 py-6 border-b border-[#2A2724] sticky top-0 z-30" style={{ background: '#0F0E0D' }}>
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span 
                            className="text-[28px] text-[#F5F0E8]"
                            style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, letterSpacing: '-0.02em' }}
                        >
                            CRAVE
                        </span>
                        <div className="h-6 w-px bg-[#2A2724]" />
                        <h1 
                            className="text-[12px] uppercase tracking-[0.2em] font-bold text-[#6B6560]"
                            style={{ fontFamily: 'var(--font-outfit)' }}
                        >
                            Admin Dashboard
                        </h1>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-10 space-y-12 w-full">

                {/* ── Stats ── */}
                <section>
                    <h2 
                        className="text-[10px] font-bold text-[#4A4542] uppercase tracking-[0.2em] mb-6"
                        style={{ fontFamily: 'var(--font-outfit)' }}
                    >
                        Performance Overview
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatCard label="Total Orders" value={total} accent />
                        <StatCard label="Pending" value={pending} />
                        <StatCard label="In Progress" value={inProgress} />
                        <StatCard label="Ready" value={ready} />
                    </div>
                </section>

                {/* ── Tables ── */}
                <section>
                    <h2 
                        className="text-[10px] font-bold text-[#4A4542] uppercase tracking-[0.2em] mb-6"
                        style={{ fontFamily: 'var(--font-outfit)' }}
                    >
                        Table Live View
                    </h2>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                        {Object.entries(tables).map(([num, status]) => {
                            const cfg = TABLE_STATUS_STYLE[status as TableStatus]
                            return (
                                <div
                                    key={num}
                                    className="rounded-2xl border px-3 py-5 flex flex-col items-center gap-3 transition-all"
                                    style={{ background: '#1A1917', borderColor: '#2A2724' }}
                                >
                                    <p 
                                        className="text-3xl font-bold text-[#F5F0E8]"
                                        style={{ fontFamily: 'var(--font-syne)' }}
                                    >
                                        {num}
                                    </p>
                                    <span 
                                        className={`text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${cfg.badge}`}
                                        style={{ fontFamily: 'var(--font-outfit)' }}
                                    >
                                        {cfg.label}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </section>

                {/* ── 86 Toggles ── */}
                <section>
                    <h2 
                        className="text-[10px] font-bold text-[#4A4542] uppercase tracking-[0.2em] mb-6"
                        style={{ fontFamily: 'var(--font-outfit)' }}
                    >
                        Kitchen Availability
                    </h2>
                    <div 
                        className="rounded-[24px] border divide-y divide-[#2A2724] overflow-hidden"
                        style={{ background: '#1A1917', borderColor: '#2A2724' }}
                    >
                        {MENU_ITEMS.map((item) => {
                            const available = !unavailableItems.has(item.id)
                            return (
                                <div
                                    key={item.id}
                                    className={`flex items-center justify-between px-6 py-4 transition-all ${available ? '' : 'opacity-40'}`}
                                >
                                    <div className="flex items-center gap-4 min-w-0">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-12 h-12 rounded-[14px] object-cover shrink-0 border border-[#2A2724]"
                                        />
                                        <div className="min-w-0">
                                            <p 
                                                className="text-[15px] font-bold text-[#F5F0E8] truncate"
                                                style={{ fontFamily: 'var(--font-syne)' }}
                                            >
                                                {item.name}
                                            </p>
                                            <p className="text-[12px] text-[#6B6560]" style={{ fontFamily: 'var(--font-outfit)' }}>₹{item.price}</p>
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
                    <h2 
                        className="text-[10px] font-bold text-[#4A4542] uppercase tracking-[0.2em] mb-6"
                        style={{ fontFamily: 'var(--font-outfit)' }}
                    >
                        Order History
                    </h2>
                    <div 
                        className="rounded-[24px] border overflow-hidden"
                        style={{ background: '#1A1917', borderColor: '#2A2724' }}
                    >
                        {sortedOrders.length === 0 ? (
                            <div className="py-20 text-center space-y-2">
                                <p className="text-[#6B6560] text-[14px]" style={{ fontFamily: 'var(--font-outfit)' }}>No recent activity</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-[#2A2724]">
                                            <th className="text-left px-6 py-4 text-[10px] font-bold text-[#4A4542] uppercase tracking-[0.15em]">Ref</th>
                                            <th className="text-left px-4 py-4 text-[10px] font-bold text-[#4A4542] uppercase tracking-[0.15em]">Tbl</th>
                                            <th className="text-left px-4 py-4 text-[10px] font-bold text-[#4A4542] uppercase tracking-[0.15em]">Details</th>
                                            <th className="text-left px-4 py-4 text-[10px] font-bold text-[#4A4542] uppercase tracking-[0.15em]">Status</th>
                                            <th className="text-left px-6 py-4 text-[10px] font-bold text-[#4A4542] uppercase tracking-[0.15em]">Time</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#2A2724]">
                                        {sortedOrders.map((order) => (
                                            <tr key={order.id} className="hover:bg-[#1F1E1C] transition-colors">
                                                <td className="px-6 py-4 font-mono text-[11px] text-[#6B6560]">{order.id.split('-')[1]}</td>
                                                <td className="px-4 py-4 font-bold text-[#F5F0E8]" style={{ fontFamily: 'var(--font-syne)' }}>{order.tableNumber || '–'}</td>
                                                <td className="px-4 py-4 text-[#F5F0E8CC] max-w-[200px] truncate text-[13px]" style={{ fontFamily: 'var(--font-outfit)' }}>
                                                    {order.items.map(i => `${i.qty}× ${i.name}`).join(', ')}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${ORDER_STATUS_STYLE[order.status]}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td suppressHydrationWarning className="px-6 py-4 text-[#6B6560] text-[12px] whitespace-nowrap" style={{ fontFamily: 'var(--font-outfit)' }}>
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
        <nav 
            className="fixed bottom-0 inset-x-0 z-50 border-t flex px-4 pb-6 pt-2 h-24"
            style={{ background: '#0F0E0D', borderColor: '#2A2724' }}
        >
            {NAV_ITEMS.map(({ label, href, Icon }) => {
                const active = pathname === href.split('?')[0]
                return (
                    <Link
                        key={href}
                        href={href}
                        className={`flex-1 flex flex-col items-center justify-center gap-1.5 transition-all ${
                            active ? 'text-[#E8853A]' : 'text-[#4A4542] hover:text-[#6B6560]'
                        }`}
                        style={{ fontFamily: 'var(--font-outfit)' }}
                    >
                        <Icon className="w-5 h-5" />
                        <span className="text-[10px] uppercase tracking-widest font-bold">{label}</span>
                        {active && (
                            <div className="w-1 h-1 rounded-full bg-[#E8853A] mt-0.5" />
                        )}
                    </Link>
                )
            })}
        </nav>
    )
}

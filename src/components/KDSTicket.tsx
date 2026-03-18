'use client'

import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'
import type { Order, OrderStatus } from '@/context/OrderContext'

type AgingLevel = 'normal' | 'warning' | 'critical'

const DM  = 'var(--font-dm-mono), "DM Mono", monospace'
const PJS = 'var(--font-plus-jakarta), "Plus Jakarta Sans", sans-serif'

const STATUS_TEXT_COLOR: Record<OrderStatus, string> = {
    PENDING:   '#2563EB', // blue
    ACCEPTED:  '#D97706', // amber
    PREPARING: '#EA6C00', // orange
    READY:     '#059669', // emerald
    SERVED:    '#A09890', // muted
}

const STATUS_BORDER_COLOR: Record<OrderStatus, string> = {
    PENDING:   '#2563EB',
    ACCEPTED:  '#D97706',
    PREPARING: '#EA6C00',
    READY:     '#059669',
    SERVED:    '#D4CFC8',
}

interface KDSTicketProps {
    order: Order
    onStatusUpdate: (orderId: string, newStatus: OrderStatus) => void
}

export function KDSTicket({ order, onStatusUpdate }: KDSTicketProps) {
    const [elapsedSeconds, setElapsedSeconds] = useState(0)
    const [elapsedTime, setElapsedTime] = useState('0:00')
    const [isUpdating, setIsUpdating] = useState(false)

    useEffect(() => {
        const updateAging = () => {
            const ageMs = Date.now() - new Date(order.createdAt).getTime()
            const totalSecs = Math.floor(ageMs / 1000)
            const mins = Math.floor(totalSecs / 60)
            const secs = totalSecs % 60
            setElapsedSeconds(totalSecs)
            setElapsedTime(`${mins}:${secs.toString().padStart(2, '0')}`)
        }
        updateAging()
        const interval = setInterval(updateAging, 1000)
        return () => clearInterval(interval)
    }, [order.createdAt])

    const nextStatus = {
        PENDING:   'ACCEPTED',
        ACCEPTED:  'PREPARING',
        PREPARING: 'READY',
        READY:     'SERVED',
        SERVED:    null,
    }[order.status] as OrderStatus | null

    const handleStatusUpdate = async () => {
        if (!nextStatus) return
        setIsUpdating(true)
        await new Promise(r => setTimeout(r, 350))
        onStatusUpdate(order.id, nextStatus)
        setIsUpdating(false)
    }

    // Timer appearance by status and aging
    const timerStyle = (() => {
        if (order.status !== 'READY') return { 
            color: '#6B6460', 
            border: '1px solid #E2DED8', 
            background: '#F4F3F0' 
        }

        const ageMins = elapsedSeconds / 60
        if (ageMins >= 10) return { 
            color: '#FFFFFF', 
            border: '1px solid #DC2626', 
            background: '#DC2626',
            className: 'animate-timer-critical'
        }
        if (ageMins >= 5) return { 
            color: '#FFFFFF', 
            border: '1px solid #EA6C00', 
            background: '#EA6C00' 
        }
        return { 
            color: '#FFFFFF', 
            border: '1px solid #059669', 
            background: '#059669' 
        }
    })()

    const cardStyle = {
        background: '#FFFFFF',
        border: '1px solid #E2DED8',
        borderLeft: `4px solid ${STATUS_BORDER_COLOR[order.status]}`,
        borderRadius: 10,
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.04)',
    }

    return (
        <div style={cardStyle as React.CSSProperties}>
            {/* ── Top row ── */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <p style={{ fontFamily: DM, fontSize: 9, color: '#A09890', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 4 }}>
                        Table
                    </p>
                    <p style={{ fontFamily: DM, fontSize: 52, fontWeight: 400, color: '#1A1714', lineHeight: 1, marginTop: 4, marginBottom: 16 }}>
                        {order.tableNumber.toString().padStart(2, '0')}
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                    <span style={{
                        fontFamily: DM,
                        fontSize: 10,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: STATUS_TEXT_COLOR[order.status],
                        fontWeight: 600,
                    }}>
                        {order.status}
                    </span>

                    <span 
                        className={timerStyle.className || ''}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            fontFamily: DM,
                            fontSize: 10,
                            letterSpacing: '0.1em',
                            borderRadius: 6,
                            padding: '4px 8px',
                            transition: 'all 0.3s',
                            color: timerStyle.color,
                            border: timerStyle.border,
                            background: timerStyle.background,
                        }}
                    >
                        {order.status === 'READY' && elapsedSeconds >= 600 && <span style={{ marginRight: 2 }}>!</span>}
                        {order.status === 'READY' && elapsedSeconds >= 300 && elapsedSeconds < 600 && <span style={{ marginRight: 2 }}>⚠</span>}
                        <Clock style={{ width: 10, height: 10, flexShrink: 0 }} />
                        {elapsedTime}
                    </span>
                </div>
            </div>

            {/* ── Items ── */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0 }}>
                {order.items.map((item, idx) => (
                    <div key={idx}>
                        {idx > 0 && <div style={{ borderTop: '1px solid #F0EEE9', margin: '8px 0' }} />}
                        <div style={{ padding: '2px 0' }}>
                            {/* Qty + Name */}
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                                <span style={{ fontFamily: DM, fontSize: 11, color: '#C4BDB6', minWidth: 22 }}>
                                    {item.qty}×
                                </span>
                                <span style={{ fontFamily: PJS, fontSize: 15, fontWeight: 600, color: '#1A1714', letterSpacing: '-0.01em' }}>
                                    {item.name}
                                </span>
                            </div>

                            {/* Modifiers */}
                            {(item.modifiers?.length ?? 0) > 0 && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 3, paddingLeft: 10, marginTop: 4 }}>
                                    {item.modifiers?.map((mod, mIdx) => (
                                        <div key={mIdx} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <div style={{ width: 3, height: 3, background: '#D4CFC8', borderRadius: '50%' }} />
                                            <span style={{ fontFamily: PJS, fontSize: 12, color: '#A09890', fontWeight: 400 }}>
                                                {mod}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Special notes */}
                            {item.notes && (
                                <div style={{ 
                                    marginTop: 6,
                                    padding: '4px 10px',
                                    background: '#FFFBEB',
                                    borderLeft: '2px solid #D97706',
                                    borderRadius: '0 4px 4px 0'
                                }}>
                                    <p style={{ fontFamily: PJS, fontSize: 12, fontStyle: 'italic', color: '#92400E' }}>
                                        {item.notes}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Action button ── */}
            {nextStatus && (
                <div style={{ marginTop: 20 }}>
                    {order.status === 'READY' ? (
                        <button
                            onClick={handleStatusUpdate}
                            disabled={isUpdating}
                            style={{
                                width: '100%',
                                height: 38,
                                background: '#059669',
                                color: '#FFFFFF',
                                border: 'none',
                                borderRadius: 6,
                                fontFamily: PJS,
                                fontSize: 12,
                                fontWeight: 700,
                                letterSpacing: '0.08em',
                                textTransform: 'uppercase',
                                cursor: isUpdating ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 8,
                                transition: 'all 150ms ease',
                                boxShadow: isUpdating ? 'none' : '0 1px 2px rgba(0,0,0,0.1)',
                            }}
                            className="group active:scale-[0.98]"
                            onMouseOver={(e) => {
                                e.currentTarget.style.background = '#047857';
                                e.currentTarget.style.transform = 'translateY(-1px)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(5,150,105,0.25)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.background = '#059669';
                                e.currentTarget.style.transform = 'translateY(0px)';
                                e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.1)';
                            }}
                        >
                            {isUpdating ? (
                                <div style={{ width: 14, height: 14, border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                            ) : (
                                <>
                                    <span style={{ fontSize: 14 }}>✓</span>
                                    SERVED
                                </>
                            )}
                        </button>
                    ) : (
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                                onClick={handleStatusUpdate}
                                disabled={isUpdating}
                                style={{
                                    fontFamily: PJS,
                                    fontSize: 11,
                                    fontWeight: order.status === 'PREPARING' ? 600 : 500,
                                    letterSpacing: '0.1em',
                                    textTransform: 'uppercase',
                                    background: order.status === 'PREPARING' ? '#059669' : 'transparent',
                                    color: order.status === 'PREPARING' ? '#FFFFFF' : '#6B6460',
                                    border: order.status === 'PREPARING' ? 'none' : '1px solid #D4CFC8',
                                    borderRadius: 6,
                                    height: 34,
                                    minWidth: 90,
                                    paddingLeft: 16,
                                    paddingRight: 16,
                                    cursor: isUpdating ? 'not-allowed' : 'pointer',
                                    opacity: isUpdating ? 0.4 : 1,
                                    transition: 'all 150ms ease',
                                }}
                                onMouseOver={(e) => {
                                    if (order.status === 'PREPARING') {
                                        e.currentTarget.style.background = '#047857';
                                    } else {
                                        const color = order.status === 'PENDING' ? '#2563EB' : '#D97706';
                                        e.currentTarget.style.color = color;
                                        e.currentTarget.style.borderColor = color;
                                        e.currentTarget.style.background = `${color}0A`; // 0.04 alpha
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if (order.status === 'PREPARING') {
                                        e.currentTarget.style.background = '#059669';
                                    } else {
                                        e.currentTarget.style.color = '#6B6460';
                                        e.currentTarget.style.borderColor = '#D4CFC8';
                                        e.currentTarget.style.background = 'transparent';
                                    }
                                }}
                            >
                                {isUpdating ? '...' : {
                                    PENDING: 'Accept',
                                    ACCEPTED: 'Start Prep',
                                    PREPARING: 'Mark Ready'
                                }[order.status as 'PENDING' | 'ACCEPTED' | 'PREPARING']}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

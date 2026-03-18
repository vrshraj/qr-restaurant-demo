'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChefHat, Clock, AlertCircle } from 'lucide-react'
import type { Order, OrderStatus } from '@/context/OrderContext'

type AgingLevel = 'normal' | 'warning' | 'critical'

const STATUS_CONFIG: Record<OrderStatus, { 
    next: OrderStatus | null
    label: string
    color: string
    bgGradient: string
    borderColor: string
    glow: string
}> = {
    PENDING: { 
        next: 'ACCEPTED', 
        label: 'Accept Order', 
        color: 'bg-yellow-600 hover:bg-yellow-700',
        bgGradient: 'from-yellow-500/10 to-yellow-600/5',
        borderColor: 'border-yellow-500/50',
        glow: 'shadow-yellow-500/30'
    },
    ACCEPTED: { 
        next: 'PREPARING', 
        label: 'Start Cooking', 
        color: 'bg-blue-600 hover:bg-blue-700',
        bgGradient: 'from-blue-500/10 to-blue-600/5',
        borderColor: 'border-blue-500/50',
        glow: 'shadow-blue-500/30'
    },
    PREPARING: { 
        next: 'READY', 
        label: 'Mark Ready', 
        color: 'bg-orange-600 hover:bg-orange-700',
        bgGradient: 'from-orange-500/10 to-orange-600/5',
        borderColor: 'border-orange-500/50',
        glow: 'shadow-orange-500/30'
    },
    READY: { 
        next: 'SERVED', 
        label: 'Served ✓', 
        color: 'bg-green-600 hover:bg-green-700',
        bgGradient: 'from-green-500/10 to-green-600/5',
        borderColor: 'border-green-500/50',
        glow: 'shadow-green-500/30'
    },
    SERVED: { 
        next: null, 
        label: 'Completed', 
        color: 'bg-slate-600 cursor-default',
        bgGradient: 'from-slate-500/5 to-slate-600/5',
        borderColor: 'border-slate-600/50',
        glow: ''
    }
}

interface KDSTicketProps {
    order: Order
    onStatusUpdate: (orderId: string, newStatus: OrderStatus) => void
}

export function KDSTicket({ order, onStatusUpdate }: KDSTicketProps) {
    const [agingLevel, setAgingLevel] = useState<AgingLevel>('normal')
    const [elapsedTime, setElapsedTime] = useState('0:00')
    const [isUpdating, setIsUpdating] = useState(false)

    useEffect(() => {
        const updateAging = () => {
            const ageMs = Date.now() - new Date(order.createdAt).getTime()
            const ageMinutes = ageMs / 60000

            // Update elapsed time display
            const mins = Math.floor(ageMinutes)
            const secs = Math.floor((ageMs % 60000) / 1000)
            setElapsedTime(`${mins}:${secs.toString().padStart(2, '0')}`)

            // Update aging color (demo pace: 2min warning, 4min critical)
            if (ageMinutes >= 4) {
                setAgingLevel('critical') // Red
            } else if (ageMinutes >= 2) {
                setAgingLevel('warning') // Yellow
            } else {
                setAgingLevel('normal')
            }
        }

        updateAging() // Initial call
        const interval = setInterval(updateAging, 1000) // Update every second

        return () => clearInterval(interval)
    }, [order.createdAt])

    const config = STATUS_CONFIG[order.status]

    const borderClass = {
        normal: `border-l-4 border-slate-600 ${config.borderColor}`,
        warning: `border-l-4 border-yellow-500 shadow-xl ${config.glow} animate-pulse`,
        critical: `border-l-4 border-red-500 shadow-2xl shadow-red-500/50 animate-pulse`
    }[agingLevel]

    const handleStatusUpdate = async () => {
        if (!config.next) return
        setIsUpdating(true)
        // Simulate network call
        await new Promise(r => setTimeout(r, 300))
        onStatusUpdate(order.id, config.next)
        setIsUpdating(false)
    }

    return (
        <Card className={`relative overflow-hidden bg-linear-to-br ${config.bgGradient} border-2 ${borderClass} text-white transition-all duration-300 hover:shadow-xl animate-in fade-in zoom-in-95`}>
            {/* Status indicator bar */}
            <div className={`absolute inset-0 opacity-0 pointer-events-none ${config.borderColor}`} />

            <div className="p-5 space-y-4">
                {/* Header */}
                <div className="flex justify-between items-start gap-3">
                    <div>
                        <h3 className="text-xl font-black leading-none">Table {order.tableNumber}</h3>
                        <p className="text-sm text-slate-300 mt-1">Order #{String(order.id).slice(-4)}</p>
                    </div>
                    <Badge className={`text-xs font-black uppercase tracking-wider ${
                        order.status === 'PENDING' ? 'bg-yellow-500/80 text-yellow-900' :
                        order.status === 'ACCEPTED' ? 'bg-blue-500/80 text-blue-900' :
                        order.status === 'PREPARING' ? 'bg-orange-500/80 text-orange-900' :
                        order.status === 'READY' ? 'bg-green-500/80 text-green-900' :
                        'bg-slate-500/80 text-slate-900'
                    }`}>
                        {order.status}
                    </Badge>
                </div>

                {/* Timing */}
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                    agingLevel === 'critical' ? 'bg-red-500/20 border border-red-500/50' :
                    agingLevel === 'warning' ? 'bg-yellow-500/20 border border-yellow-500/50' :
                    'bg-slate-700/30 border border-slate-600/30'
                }`}>
                    <Clock className="w-4 h-4 shrink-0" />
                    <span className="text-sm font-semibold">{elapsedTime}</span>
                    {agingLevel !== 'normal' && (
                        <AlertCircle className="w-4 h-4 ml-auto text-orange-400 animate-pulse" />
                    )}
                </div>

                {/* Items */}
                <div className="space-y-2.5 bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
                    {order.items.map((item, idx) => (
                        <div key={idx} className="space-y-1">
                            <div className="flex items-start gap-2">
                                <span className="text-lg font-black text-amber-400 min-w-fit">{item.qty}×</span>
                                <span className="font-bold text-white leading-tight">{item.name}</span>
                            </div>
                            {item.modifiers && item.modifiers.length > 0 && (
                                <div className="flex flex-wrap gap-1 ml-6">
                                    {item.modifiers.map((mod, modIdx) => (
                                        <span 
                                            key={modIdx}
                                            className="text-xs px-2 py-1 rounded bg-slate-700/60 text-slate-200 border border-slate-600/50"
                                        >
                                            {mod}
                                        </span>
                                    ))}
                                </div>
                            )}
                            {item.notes && (
                                <p className="text-sm text-amber-300 italic ml-6 font-medium">
                                    💬 {item.notes}
                                </p>
                            )}
                            {idx < order.items.length - 1 && (
                                <div className="h-px bg-slate-700/30 mt-2" />
                            )}
                        </div>
                    ))}
                </div>

                {/* Action Button */}
                {config.next && (
                    <Button
                        onClick={handleStatusUpdate}
                        disabled={isUpdating}
                        className={`w-full h-11 text-sm font-bold uppercase tracking-wider rounded-lg transition-all duration-200 text-white ${config.color} ${
                            isUpdating ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'
                        }`}
                    >
                        {isUpdating ? (
                            <span className="flex items-center gap-2">
                                <span className="w-4 h-4 border-2 border-transparent border-t-white rounded-full animate-spin" />
                                Processing...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2 justify-center">
                                <ChefHat className="w-4 h-4" />
                                {config.label}
                            </span>
                        )}
                    </Button>
                )}
            </div>
        </Card>
    )
}

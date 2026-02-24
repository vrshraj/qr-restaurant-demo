'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Order, OrderStatus } from '@/context/OrderContext'

type AgingLevel = 'normal' | 'warning' | 'critical'

const STATUS_BUTTONS: Record<OrderStatus, { next: OrderStatus | null; label: string; color: string }> = {
    PENDING: { next: 'ACCEPTED', label: 'Accept Order', color: 'bg-yellow-500' },
    ACCEPTED: { next: 'PREPARING', label: 'Start Preparing', color: 'bg-blue-500' },
    PREPARING: { next: 'READY', label: 'Mark Ready', color: 'bg-orange-500' },
    READY: { next: 'SERVED', label: 'Mark Served', color: 'bg-green-500' },
    SERVED: { next: null, label: 'Completed', color: 'bg-gray-400' }
}

interface KDSTicketProps {
    order: Order
    onStatusUpdate: (orderId: string, newStatus: OrderStatus) => void
}

export function KDSTicket({ order, onStatusUpdate }: KDSTicketProps) {
    const [agingLevel, setAgingLevel] = useState<AgingLevel>('normal')
    const [elapsedTime, setElapsedTime] = useState('')

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

    const borderClass = {
        normal: 'border-slate-700',
        warning: 'border-yellow-500 shadow-yellow-500/50 shadow-lg',
        critical: 'border-red-500 shadow-red-500/50 shadow-lg animate-pulse'
    }[agingLevel]

    const statusConfig = STATUS_BUTTONS[order.status]

    return (
        <Card className={`p-4 border-2 ${borderClass} bg-slate-800 text-white transition-all duration-300`}>
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="text-lg font-bold">Table {order.tableNumber}</h3>
                    <p className="text-sm text-slate-400">Order #{order.id.slice(-4)}</p>
                </div>
                <div className="text-right">
                    <Badge className={statusConfig.color}>{order.status}</Badge>
                    <p className="text-xs text-slate-400 mt-1">{elapsedTime} ago</p>
                </div>
            </div>

            {/* Items */}
            <div className="space-y-2 mb-4">
                {order.items.map((item, idx) => (
                    <div key={idx} className="bg-slate-900 p-2 rounded flex flex-col gap-1">
                        <p className="font-medium">
                            {item.qty}x {item.name}
                        </p>
                        {item.modifiers && item.modifiers.length > 0 && (
                            <p className="text-sm text-slate-400">• {item.modifiers.join(', ')}</p>
                        )}
                        {item.notes && (
                            <p className="text-sm text-yellow-500 italic">Note: {item.notes}</p>
                        )}
                    </div>
                ))}
            </div>

            {/* Action Button */}
            {statusConfig.next && (
                <Button
                    onClick={() => onStatusUpdate(order.id, statusConfig.next!)}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                >
                    {statusConfig.label}
                </Button>
            )}
        </Card>
    )
}

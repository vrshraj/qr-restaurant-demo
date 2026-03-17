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
    accent: string
    indicator: string
}> = {
    PENDING: { 
        next: 'ACCEPTED', 
        label: 'Accept', 
        color: 'bg-slate-900 text-white hover:bg-black',
        accent: 'text-slate-500',
        indicator: 'bg-slate-200'
    },
    ACCEPTED: { 
        next: 'PREPARING', 
        label: 'Start', 
        color: 'bg-blue-600 text-white hover:bg-blue-700',
        accent: 'text-blue-600',
        indicator: 'bg-blue-100'
    },
    PREPARING: { 
        next: 'READY', 
        label: 'Finish', 
        color: 'bg-rusty-orange text-white hover:opacity-90',
        accent: 'text-rusty-orange',
        indicator: 'bg-orange-50'
    },
    READY: { 
        next: 'SERVED', 
        label: 'Serve', 
        color: 'bg-green-600 text-white hover:bg-green-700',
        accent: 'text-green-600',
        indicator: 'bg-green-50'
    },
    SERVED: { 
        next: null, 
        label: 'Done', 
        color: 'bg-slate-100 text-slate-400 cursor-default',
        accent: 'text-slate-300',
        indicator: 'bg-slate-50'
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

            const mins = Math.floor(ageMinutes)
            const secs = Math.floor((ageMs % 60000) / 1000)
            setElapsedTime(`${mins}:${secs.toString().padStart(2, '0')}`)

            if (ageMinutes >= 4) setAgingLevel('critical')
            else if (ageMinutes >= 2) setAgingLevel('warning')
            else setAgingLevel('normal')
        }

        updateAging()
        const interval = setInterval(updateAging, 1000)
        return () => clearInterval(interval)
    }, [order.createdAt])

    const config = STATUS_CONFIG[order.status]

    const cardStateClass = {
        normal: 'border-slate-200 shadow-sm',
        warning: 'border-amber-200 shadow-[0_8px_30px_rgb(251,191,36,0.1)] bg-amber-50/30',
        critical: 'border-rusty-orange/30 shadow-[0_8px_30px_rgb(187,92,61,0.15)] bg-orange-50/50 animate-pulse'
    }[agingLevel]

    const handleStatusUpdate = async () => {
        if (!config.next) return
        setIsUpdating(true)
        await new Promise(r => setTimeout(r, 400))
        onStatusUpdate(order.id, config.next)
        setIsUpdating(false)
    }

    return (
        <Card className={`group relative bg-white border ${cardStateClass} rounded-2xl transition-all duration-500 overflow-hidden`}>
            {/* Header Area */}
            <div className="p-4 md:p-6 pb-2 md:pb-4 space-y-3 md:space-y-4">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Table</span>
                            <div className="h-px w-4 bg-slate-100" />
                        </div>
                        <h3 className="text-5xl md:text-6xl font-serif text-slate-900 leading-none tracking-tighter">
                            {order.tableNumber.toString().padStart(2, '0')}
                        </h3>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2 md:gap-3">
                        <Badge variant="outline" className={`px-2 py-0.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest border-slate-200 bg-slate-50 ${config.accent}`}>
                            {order.status}
                        </Badge>
                        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-50 border border-slate-100 ${
                            agingLevel === 'critical' ? 'text-rusty-orange font-bold' : 'text-slate-500'
                        }`}>
                            <Clock className="w-3 h-3" />
                            <span className="text-[10px] md:text-xs font-mono tracking-tight">{elapsedTime}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Items List */}
            <div className="px-4 md:px-6 py-2">
                <div className="space-y-3 md:space-y-4 py-3 md:py-4 border-t border-slate-100">
                    {order.items.map((item, idx) => (
                        <div key={idx} className="group/item space-y-1 md:space-y-2">
                            <div className="flex items-baseline gap-2 md:gap-3">
                                <span className="text-lg md:text-xl font-serif text-slate-300">{item.qty}</span>
                                <span className="text-base md:text-lg font-semibold text-slate-800 leading-tight">
                                    {item.name}
                                </span>
                            </div>
                            
                            {(item.modifiers?.length ?? 0) > 0 && (
                                <div className="flex flex-wrap gap-1 md:gap-2 pl-5 md:pl-6">
                                    {item.modifiers?.map((mod, mIdx) => (
                                        <span key={mIdx} className="text-[9px] md:text-[10px] px-2 py-0.5 rounded-full bg-slate-50 text-slate-500 border border-slate-200">
                                            {mod}
                                        </span>
                                    ))}
                                </div>
                            )}
                            
                            {item.notes && (
                                <p className="pl-5 md:pl-6 text-xs md:sm text-rusty-orange/80 italic font-medium leading-relaxed">
                                    “{item.notes}”
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer Action */}
            <div className="p-4 md:p-6 pt-2">
                {config.next && (
                    <Button
                        onClick={handleStatusUpdate}
                        disabled={isUpdating}
                        className={`w-full h-12 md:h-14 rounded-xl font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs transition-all duration-300 active:scale-95 shadow-lg shadow-slate-200 ${config.color} ${
                            isUpdating ? 'opacity-50' : ''
                        }`}
                    >
                        {isUpdating ? (
                            <div className="flex items-center gap-2 md:gap-3">
                                <div className="w-3 md:w-4 h-3 md:h-4 border-2 border-current/20 border-t-current rounded-full animate-spin" />
                                <span>Wait</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <ChefHat className="w-3.5 md:w-4 h-3.5 md:h-4" />
                                <span>{config.label}</span>
                            </div>
                        )}
                    </Button>
                )}
            </div>
            
            {/* Status Indicator Bar */}
            <div className={`absolute bottom-0 left-0 right-0 h-1.5 transition-colors duration-500 ${config.indicator}`} />
        </Card>
    )
}

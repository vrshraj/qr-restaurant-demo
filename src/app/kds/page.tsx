'use client'

import { useOrders } from '@/context/OrderContext'
import { KDSTicket } from '@/components/KDSTicket'

export default function KdsPage() {
    const { orders, updateStatus } = useOrders()

    return (
        <div className="min-h-screen bg-slate-900 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-6">Kitchen Display System</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {orders.map(order => (
                        <KDSTicket
                            key={order.id}
                            order={order}
                            onStatusUpdate={updateStatus}
                        />
                    ))}
                </div>

                {orders.length === 0 && (
                    <div className="text-center text-slate-400 mt-12">
                        <p className="text-xl">No orders in queue</p>
                    </div>
                )}
            </div>
        </div>
    )
}

import Link from 'next/link'
import { RESTAURANT } from '@/lib/data'
import { CheckCircle, Clock, ChevronRight, MapPin } from 'lucide-react'

interface ConfirmationPageProps {
    searchParams: Promise<{ orderId?: string }>
}

export default async function ConfirmationPage({ searchParams }: ConfirmationPageProps) {
    const { orderId } = await searchParams

    return (
        <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-4 text-center">

            {/* ── Success icon ── */}
            <div
                className="w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-lg"
                style={{ background: `${RESTAURANT.primaryColor}18` }}
            >
                <CheckCircle
                    className="w-14 h-14"
                    style={{ color: RESTAURANT.primaryColor }}
                    strokeWidth={1.5}
                />
            </div>

            {/* ── Headline ── */}
            <h1 className="text-3xl font-extrabold text-stone-800 mb-2">Order Placed! 🎉</h1>
            <p className="text-stone-500 text-base max-w-xs">
                Your order has been sent to the kitchen. Sit tight!
            </p>

            {/* ── Info card ── */}
            <div className="mt-8 w-full max-w-sm bg-white rounded-2xl shadow-sm divide-y divide-stone-100 text-left">
                {orderId && (
                    <div className="px-5 py-4 flex items-center justify-between">
                        <span className="text-sm text-stone-500 font-medium">Order ID</span>
                        <span className="text-sm font-bold text-stone-800 font-mono">{orderId}</span>
                    </div>
                )}
                <div className="px-5 py-4 flex items-center gap-3">
                    <Clock className="w-5 h-5 shrink-0" style={{ color: RESTAURANT.primaryColor }} />
                    <div>
                        <p className="text-sm font-semibold text-stone-800">Estimated time</p>
                        <p className="text-sm text-stone-500">25–30 mins</p>
                    </div>
                </div>
            </div>

            {/* ── Buttons ── */}
            <div className="mt-6 w-full max-w-sm flex flex-col gap-3">
                {/* Track Order — primary */}
                <Link
                    href={`/tracking?orderId=${orderId ?? ''}`}
                    className="inline-flex items-center justify-center gap-2 w-full px-8 py-4 rounded-2xl font-bold text-white text-base transition-opacity hover:opacity-90"
                    style={{ background: RESTAURANT.primaryColor }}
                >
                    <MapPin className="w-5 h-5" />
                    Track Order
                    <ChevronRight className="w-5 h-5" />
                </Link>

                {/* Back to Menu — secondary */}
                <Link
                    href="/menu"
                    className="inline-flex items-center justify-center gap-2 w-full px-8 py-4 rounded-2xl font-bold text-stone-600 text-base bg-stone-100 hover:bg-stone-200 transition-colors"
                >
                    Back to Menu
                </Link>
            </div>

            {/* ── Branding footer ── */}
            <p className="mt-10 text-stone-400 text-xs">
                {RESTAURANT.logo} {RESTAURANT.name}
            </p>
        </div>
    )
}

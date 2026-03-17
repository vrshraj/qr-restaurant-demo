'use client'

import { ChevronRight } from 'lucide-react'
import Image from 'next/image'

const OFFERS = [
    { title: 'CRAVING MEETS OFFERS', amount: '₹100', sub: 'CASHBACK', color: 'bg-swiggy-yellow' },
    { title: 'BINGE WORTHY DEALS', amount: '₹200', sub: 'OFF & MORE', color: 'bg-swiggy-yellow' },
    { title: 'NON-VEG DELIGHTS', amount: '15%', sub: 'OFFER', color: 'bg-swiggy-yellow', hasImage: true },
    { title: 'EATRIGHT', amount: '₹300', sub: 'FREE CASH', color: 'bg-swiggy-yellow' }
]

export function SwiggyBanner() {
    return (
        <section className="max-w-md mx-auto py-10">
            {/* Crave Logo & Image */}
            <div className="px-6 flex items-center justify-between mb-8">
                <div className="flex flex-col">
                    <h2 className="text-5xl font-black text-swiggy-orange tracking-tighter italic">CRAVE</h2>
                </div>
                
                <div className="relative">
                    <div className="absolute -left-12 -top-12 animate-in zoom-in spin-in-12 duration-1000">
                        <div className="relative w-24 h-24">
                            <Image 
                                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=60" 
                                alt="Food bowl"
                                fill
                                className="object-cover rounded-full border-4 border-slate-100 shadow-2xl"
                                unoptimized
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Cashback Divider */}
            <div className="px-4 flex items-center gap-4 mb-6">
                <div className="h-[2px] flex-1 bg-slate-100" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Get assured ₹100 cashback</span>
                <div className="h-[2px] flex-1 bg-slate-100" />
            </div>

            {/* Offer Cards Horizontal Scroll */}
            <div className="flex gap-4 px-4 overflow-x-auto no-scrollbar pb-4">
                {OFFERS.map((offer, i) => (
                    <div 
                        key={i} 
                        className={`${offer.color} shrink-0 w-[140px] aspect-3/4 rounded-3xl p-4 flex flex-col items-center justify-between text-center shadow-lg relative overflow-hidden transition-transform active:scale-95`}
                    >
                        <p className="text-[10px] font-black text-swiggy-purple uppercase leading-tight">{offer.title}</p>
                        
                        <div className="relative z-10">
                            <div className="bg-swiggy-purple text-swiggy-yellow rounded-full px-4 py-8 flex flex-col items-center justify-center shadow-2xl border-4 border-white/20">
                                <span className="text-2xl font-black leading-none">{offer.amount}</span>
                                <span className="text-[8px] font-black uppercase opacity-70 mt-1">{offer.sub}</span>
                            </div>
                        </div>

                        <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-swiggy-purple/10 rounded-full blur-xl" />
                    </div>
                ))}
            </div>
        </section>
    )
}

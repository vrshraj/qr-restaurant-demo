'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from '@/components/ui/sheet'
import { useCartStore } from '@/store/useCartStore'
import { Price } from './Price'
import { getPairedItems, RecommendedItem } from '@/lib/db/recommendations'

interface Particle {
    id: number
    x: number
    y: number
}

interface ModifierOption {
    id: string
    name: string
    priceDelta: number
}

interface ModifierGroup {
    id: string
    name: string
    required: boolean
    options: ModifierOption[]
}

interface MenuItem {
    id: string
    name: string
    description: string
    price: number
    image: string
    modifierGroups: ModifierGroup[]
}

interface ModifierModalProps {
    item: MenuItem | null
    open: boolean
    onClose: () => void
}

export function ModifierModal({ item, open, onClose }: ModifierModalProps) {
    const addItem = useCartStore(s => s.addItem)
    const [selected, setSelected] = useState<Record<string, ModifierOption>>({})
    const [notes, setNotes] = useState('')
    const [particles, setParticles] = useState<Particle[]>([])

    const pairedItems = item ? getPairedItems(item.id) : []

    const spawnParticle = (e: React.MouseEvent) => {
        const newParticle = {
            id: Date.now(),
            x: e.clientX,
            y: e.clientY
        }
        setParticles(prev => [...prev, newParticle])
        setTimeout(() => {
            setParticles(prev => prev.filter(p => p.id !== newParticle.id))
        }, 600)
    }

    if (!item) return null

    const itemSafe = item
    const extraCost = Object.values(selected).reduce((sum, o) => sum + o.priceDelta, 0)
    const finalPrice = itemSafe.price + extraCost

    function handleSelect(groupId: string, option: ModifierOption) {
        setSelected(prev => ({ ...prev, [groupId]: option }))
    }

    function handleAdd() {
        const modifierLabels = Object.values(selected).map(o => o.name)
        addItem({
            id: itemSafe.id,
            name: itemSafe.name,
            price: finalPrice,
            modifiers: modifierLabels,
            note: notes,
            imageUrl: itemSafe.image,
        })
        setSelected({})
        setNotes('')
        onClose()
    }

    const allRequiredMet = itemSafe.modifierGroups
        .filter(g => g.required)
        .every(g => selected[g.id])

    return (
        <Sheet open={open} onOpenChange={v => !v && onClose()}>
            <SheetContent 
                side="bottom" 
                className="rounded-t-[24px] px-0 pb-0 max-h-[92vh] overflow-y-auto crave-noise border-0"
                style={{ background: 'var(--bg)' }}
            >
                {/* Hero image */}
                <div className="relative w-full h-56 shrink-0 bg-var(--surface-2)">
                    <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        unoptimized
                        onError={(e) => {
                            const target = e.currentTarget;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                                parent.classList.add('img-placeholder');
                                parent.setAttribute('data-name', item.name.charAt(0).toUpperCase());
                            }
                        }}
                    />
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-var(--bg) to-transparent" />
                </div>

                <div className="px-6 pt-2 pb-10 relative">
                    <SheetHeader className="text-left mb-2">
                        <SheetTitle 
                            className="text-[28px] leading-tight text-var(--text-primary)"
                            style={{ fontFamily: 'var(--font-syne)', fontWeight: 700 }}
                        >
                            {item.name}
                        </SheetTitle>
                        <SheetDescription className="sr-only">
                            Customize your dish with extra options and notes.
                        </SheetDescription>
                    </SheetHeader>
                    
                    <p 
                        className="text-[14px] text-var(--text-secondary) mb-2 leading-relaxed"
                        style={{ fontFamily: 'var(--font-outfit)' }}
                    >
                        {item.description}
                    </p>
                    
                    <Price 
                        amount={finalPrice} 
                        className="mb-8"
                        amountClassName="text-[20px]"
                    />

                    {/* Modifier groups */}
                    {item.modifierGroups.map(group => (
                        <div key={group.id} className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <h3 
                                    className="font-bold text-[12px] uppercase tracking-widest text-var(--text-primary)"
                                    style={{ fontFamily: 'var(--font-outfit)' }}
                                >
                                    {group.name}
                                </h3>
                                {group.required && (
                                    <span 
                                        className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full tracking-wider"
                                        style={{ background: 'rgba(232,133,58,0.15)', color: '#E8853A', fontFamily: 'var(--font-outfit)' }}
                                    >
                                        Required
                                    </span>
                                )}
                            </div>
                            
                            <div className="space-y-3">
                                {group.options.map(opt => {
                                    const isSelected = selected[group.id]?.id === opt.id
                                    return (
                                        <button
                                            key={opt.id}
                                            onClick={() => handleSelect(group.id, opt)}
                                            className="w-full flex items-center justify-between px-5 py-4 rounded-[16px] border transition-all"
                                            style={{
                                                background: isSelected ? 'rgba(232,133,58,0.08)' : 'var(--surface-2)',
                                                borderColor: isSelected ? 'var(--accent)' : 'var(--border)',
                                            }}
                                        >
                                            <span 
                                                className="text-[15px] font-medium transition-colors"
                                                style={{ 
                                                    fontFamily: 'var(--font-outfit)', 
                                                    color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)' 
                                                }}
                                            >
                                                {opt.name}
                                            </span>
                                            <div className="flex items-center gap-3">
                                                {opt.priceDelta > 0 && (
                                                    <span 
                                                        className="text-[13px] text-var(--text-muted)"
                                                        style={{ fontFamily: 'var(--font-outfit)' }}
                                                    >
                                                        +₹{opt.priceDelta}
                                                    </span>
                                                )}
                                                <div 
                                                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                                                    style={{ 
                                                        borderColor: isSelected ? '#E8853A' : '#2A2724',
                                                        background: isSelected ? '#E8853A' : 'transparent'
                                                    }}
                                                >
                                                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-var(--bg)" />}
                                                </div>
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    ))}

                    {/* Notes */}
                    <div className="mb-10">
                        <label 
                            className="block font-bold text-[12px] uppercase tracking-widest text-var(--text-primary) mb-4"
                            style={{ fontFamily: 'var(--font-outfit)' }}
                        >
                            Special Requests
                        </label>
                        <textarea
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            rows={3}
                            placeholder="e.g. Extra spicy, no onions…"
                            className="w-full rounded-[16px] px-5 py-4 text-[14px] resize-none focus:outline-none placeholder:text-var(--text-muted) text-var(--text-primary)"
                            style={{ 
                                background: 'var(--surface-2)', 
                                border: '1px solid var(--border)',
                                fontFamily: 'var(--font-outfit)'
                            }}
                        />
                    </div>
                    {/* Recommendations: Goes well with */}
                    {pairedItems.length > 0 && (
                        <div className="mb-10">
                            <h3 
                                className="font-bold text-[12px] uppercase tracking-widest text-var(--text-primary) mb-4"
                                style={{ fontFamily: 'var(--font-outfit)' }}
                            >
                                Goes well with
                            </h3>
                            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                                {pairedItems.map((p) => (
                                    <div 
                                        key={p.id}
                                        className="shrink-0 w-40 p-3 rounded-[20px] bg-var(--surface-2) border border-var(--border) flex flex-col gap-2"
                                    >
                                        <div className="relative w-full aspect-square rounded-[12px] overflow-hidden bg-var(--border)">
                                            <img src={p.image} alt={p.name} className="object-cover w-full h-full" />
                                            <button 
                                                onClick={(e) => {
                                                    spawnParticle(e)
                                                    addItem({ id: p.id, name: p.name, price: p.price, modifiers: [], imageUrl: p.image })
                                                }}
                                                className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-[#E8853A] text-[#0F0E0D] flex items-center justify-center shadow-lg active:scale-95"
                                            >
                                                <span className="text-lg font-bold">+</span>
                                            </button>
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                          <p className="text-[13px] font-bold text-var(--text-primary) truncate" style={{ fontFamily: 'var(--font-syne)' }}>{p.name}</p>
                                          <Price amount={p.price} amountClassName="text-[12px]" symbolClassName="text-[11px]" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Primary Button */}
                    <button
                        onClick={handleAdd}
                        disabled={!allRequiredMet}
                        className="w-full h-14 text-[16px] font-bold text-white rounded-full disabled:opacity-30 transition-all active:scale-[0.98] shadow-lg shadow-var(--accent)/20"
                        style={{ 
                            background: '#E8853A',
                            fontFamily: 'var(--font-outfit)'
                        }}
                    >
                        Add to Cart — <Price amount={finalPrice} symbolClassName="text-inherit" amountClassName="text-inherit" />
                    </button>
                </div>

                {/* Floating Particles */}
                {particles.map(p => (
                    <div
                        key={p.id}
                        style={{
                            position: 'fixed',
                            left: p.x,
                            top: p.y,
                            pointerEvents: 'none',
                            zIndex: 9999,
                            font: '600 14px var(--font-outfit)',
                            color: '#E8853A',
                            animation: 'flyUp 600ms ease forwards'
                        }}
                    >
                        +1
                    </div>
                ))}
            </SheetContent>
        </Sheet>
    )
}

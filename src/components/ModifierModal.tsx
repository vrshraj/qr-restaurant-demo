'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useCart } from '@/lib/store'

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
    const addItem = useCart(s => s.addItem)
    const [selected, setSelected] = useState<Record<string, ModifierOption>>({})
    const [notes, setNotes] = useState('')

    if (!item) return null

    const itemSafe = item  // narrowed: guaranteed non-null past this point
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
            notes,
            image: itemSafe.image,
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
            <SheetContent side="bottom" className="rounded-t-2xl px-0 pb-0 max-h-[90vh] overflow-y-auto">
                {/* Hero image */}
                <div className="relative w-full h-44 bg-slate-100">
                    <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        unoptimized
                    />
                </div>

                <div className="px-5 pt-4 pb-8">
                    <SheetHeader className="text-left mb-1">
                        <SheetTitle className="text-xl font-bold">{item.name}</SheetTitle>
                    </SheetHeader>
                    <p className="text-sm text-slate-500 mb-1">{item.description}</p>
                    <p className="text-lg font-semibold text-amber-600 mb-4">₹{finalPrice}</p>

                    {/* Modifier groups */}
                    {item.modifierGroups.map(group => (
                        <div key={group.id} className="mb-5">
                            <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-sm uppercase tracking-wide text-slate-700">
                                    {group.name}
                                </h3>
                                {group.required && (
                                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                                        Required
                                    </span>
                                )}
                            </div>
                            <div className="space-y-2">
                                {group.options.map(opt => {
                                    const isSelected = selected[group.id]?.id === opt.id
                                    return (
                                        <button
                                            key={opt.id}
                                            onClick={() => handleSelect(group.id, opt)}
                                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium ${isSelected
                                                ? 'border-amber-500 bg-amber-50 text-amber-700'
                                                : 'border-slate-200 text-slate-700 hover:border-slate-300'
                                                }`}
                                        >
                                            <span>{opt.name}</span>
                                            {opt.priceDelta > 0 && (
                                                <span className="text-slate-500">+₹{opt.priceDelta}</span>
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                            <Separator className="mt-4" />
                        </div>
                    ))}

                    {/* Notes */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Any special requests?
                        </label>
                        <textarea
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            rows={2}
                            placeholder="e.g. Extra spicy, no onions…"
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                    </div>

                    <Button
                        onClick={handleAdd}
                        disabled={!allRequiredMet}
                        className="w-full h-12 text-base font-semibold bg-amber-500 hover:bg-amber-600 text-white rounded-xl disabled:opacity-40"
                    >
                        Add to Cart — ₹{finalPrice}
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    )
}

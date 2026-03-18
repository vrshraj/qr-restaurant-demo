'use client'

import React, { useState, useEffect } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { SlidersHorizontal, ChevronDown, Check } from 'lucide-react'

const FILTERS = [
  { key: "offers",    label: "Offers",          icon: "%" },
  { key: "veg",       label: "Pure Veg",        icon: "🌿" },
  { key: "rating",    label: "Rating 4.0+",     icon: "★" },
  { key: "under200",  label: "Under ₹200",      icon: null },
  { key: "spicy",     label: "Spicy",           icon: "🌶" },
  { key: "new",       label: "New Items",       icon: null },
]

const SORT_OPTIONS = [
  { key: "default",   label: "Relevance",          sub: "Default ordering" },
  { key: "price_asc", label: "Price: Low to High",  sub: null },
  { key: "price_desc",label: "Price: High to Low",  sub: null },
  { key: "name",      label: "Name: A to Z",        sub: null },
]

interface FilterChipsProps {
  onFilterChange: (filters: string[]) => void
  onSortChange?: (sortKey: string) => void
  compact?: boolean
}

export function FilterChips({ onFilterChange, onSortChange, compact = false }: FilterChipsProps) {
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [sortSheetOpen, setSortSheetOpen] = useState(false)
  const [activeSort, setActiveSort] = useState("default")

  const toggleFilter = (key: string) => {
    setActiveFilters(prev => {
      const newFilters = prev.includes(key)
        ? prev.filter(f => f !== key)
        : [...prev, key]
      return newFilters
    })
  }

  useEffect(() => {
    onFilterChange(activeFilters)
  }, [activeFilters, onFilterChange])

  return (
    <>
      <style suppressHydrationWarning>{`
        .filter-chips-wrapper {
          overflow-x: auto;
          display: flex;
          gap: 8px;
          padding: 0 16px 4px;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
          margin-bottom: 16px;
        }
        .filter-chips-wrapper::-webkit-scrollbar {
          display: none;
        }
        .filter-chip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: ${compact ? '5px 12px' : '7px 14px'};
          border-radius: 999px;
          flex-shrink: 0;
          cursor: pointer;
          transition: all 150ms ease;
          white-space: nowrap;
          font-family: var(--font-outfit, sans-serif);
          font-size: ${compact ? '11px' : '12px'};
          font-weight: 500;
          -webkit-tap-highlight-color: transparent;
        }
        .filter-chip.inactive {
          background: var(--surface);
          border: 1px solid var(--border);
          color: var(--text-secondary);
        }
        .filter-chip.active {
          background: rgba(232,133,58,0.15);
          border: 1.5px solid var(--accent);
          color: var(--accent);
          font-weight: 600;
        }
        .filter-icon {
          font-size: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .filter-icon-percent {
          background: #E8853A;
          color: #FFFFFF;
          width: 16px;
          height: 16px;
          border-radius: 3px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 9px;
          font-weight: 800;
        }
      `}</style>
      
      <div className="filter-chips-wrapper">
        {compact && (
          <>
            <div 
              className="filter-chip inactive" 
              onClick={() => {}}
            >
              <span className="filter-icon"><SlidersHorizontal size={12} /></span>
              Filter
            </div>
            <div 
              className="filter-chip inactive" 
              onClick={() => setSortSheetOpen(true)}
            >
              Sort by
              <span className="filter-icon" style={{ marginLeft: 2 }}><ChevronDown size={14} /></span>
            </div>
          </>
        )}

        {FILTERS.map(filter => {
          const isActive = activeFilters.includes(filter.key)
          
          return (
            <div 
              key={filter.key}
              className={`filter-chip ${isActive ? 'active' : 'inactive'}`}
              onClick={() => toggleFilter(filter.key)}
            >
              {filter.icon === "%" ? (
                <span className="filter-icon-percent">%</span>
              ) : filter.icon ? (
                <span className="filter-icon">{filter.icon}</span>
              ) : null}
              {filter.label}
            </div>
          )
        })}
      </div>

      <Sheet open={sortSheetOpen} onOpenChange={setSortSheetOpen}>
        <SheetContent side="bottom" className="rounded-t-[24px] px-0 pb-6 max-h-[92vh] overflow-y-auto border-0" style={{ background: 'var(--surface)' }}>
          <SheetHeader className="px-6 mb-4 text-left">
            <SheetTitle className="sr-only">Sort by</SheetTitle>
            <h2 style={{ fontFamily: 'var(--font-syne)', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Sort by</h2>
          </SheetHeader>
          
          <div className="flex flex-col">
            {SORT_OPTIONS.map(opt => (
              <button
                key={opt.key}
                onClick={() => {
                  setActiveSort(opt.key)
                  onSortChange?.(opt.key)
                  setSortSheetOpen(false)
                }}
                className="flex items-center justify-between transition-colors active:bg-gray-50"
                style={{
                  padding: '16px 20px',
                  borderBottom: '1px solid var(--border)',
                  fontFamily: 'var(--font-outfit)',
                  textAlign: 'left'
                }}
              >
                <div className="flex flex-col">
                  <span style={{ fontSize: 15, fontWeight: activeSort === opt.key ? 600 : 500, color: activeSort === opt.key ? 'var(--accent)' : 'var(--text-primary)' }}>
                    {opt.label}
                  </span>
                  {opt.sub && (
                    <span style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
                      {opt.sub}
                    </span>
                  )}
                </div>
                {activeSort === opt.key && (
                  <Check size={20} color="#E8853A" />
                )}
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

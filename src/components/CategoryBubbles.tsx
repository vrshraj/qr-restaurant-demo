'use client'

import React from 'react'

const CATEGORIES = [
  { label: "Starters",  emoji: "🥗", url: "https://images.unsplash.com/photo-1541014741259-de529411b96a?w=120&q=80" },
  { label: "Mains",     emoji: "🍛", url: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=120&q=80" },
  { label: "Biryani",   emoji: "🍚", url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=120&q=80" },
  { label: "Breads",    emoji: "🫓", url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=120&q=80" },
  { label: "Drinks",    emoji: "🥤", url: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=120&q=80" },
  { label: "Desserts",  emoji: "🍮", url: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=120&q=80" },
  { label: "Soups",     emoji: "🍲", url: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=120&q=80" },
]

interface CategoryBubblesProps {
  activeCategory: string
  onSelectCategory: (category: string) => void
  size?: 'full' | 'compact'
}

export function CategoryBubbles({ activeCategory, onSelectCategory, size = 'full' }: CategoryBubblesProps) {
  const sizes = {
    full:    { circle: 84, font: 13, gap: 28 },
    compact: { circle: 56, font: 11, gap: 18 },
  }
  const s = sizes[size]
  return (
    <>
      <style suppressHydrationWarning>{`
        .category-bubbles-container {
          overflow-x: auto;
          overflow-y: visible;
          display: flex;
          gap: ${s.gap}px;
          padding: 4px 16px 8px;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
        }
        .category-bubbles-container::-webkit-scrollbar {
          display: none;
        }
        .category-bubble-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 7px;
          flex-shrink: 0;
          cursor: pointer;
        }
        .category-bubble-circle {
          width: ${s.circle}px;
          height: ${s.circle}px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid transparent;
          transition: border-color 200ms, transform 200ms, width 200ms, height 200ms;
          background: var(--surface-2);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .category-bubble-item:hover .category-bubble-circle {
          transform: scale(1.05);
          border-color: rgba(232,133,58,0.4);
        }
        .category-bubble-item.active .category-bubble-circle {
          border: 2.5px solid #E8853A;
          transform: scale(1.05);
        }
        .category-bubble-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }
        .category-bubble-fallback {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: ${size === 'compact' ? '18px' : '24px'};
          background: var(--surface-2);
          color: var(--text-primary);
        }
        .category-bubble-label {
          font-family: var(--font-outfit, sans-serif);
          font-size: ${s.font}px;
          font-weight: 500;
          color: var(--text-secondary);
          text-align: center;
          white-space: nowrap;
          max-width: ${s.circle + 10}px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .category-bubble-item.active .category-bubble-label {
          color: #E8853A;
          font-weight: 600;
        }
      `}</style>
      
      <div className="category-bubbles-container">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.label.toLowerCase()
          return (
            <div 
              key={cat.label} 
              className={`category-bubble-item ${isActive ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat.label.toLowerCase())}
            >
              <div className="category-bubble-circle">
                <div className="category-bubble-fallback">
                  {cat.emoji}
                </div>
                <img 
                  src={cat.url} 
                  alt={cat.label}
                  className="category-bubble-img"
                  style={{ position: 'relative', zIndex: 1 }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <span className="category-bubble-label">
                {cat.label}
              </span>
            </div>
          )
        })}
      </div>
    </>
  )
}

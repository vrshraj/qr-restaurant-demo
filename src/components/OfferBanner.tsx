'use client'

import React, { useState, useEffect, useRef } from 'react'

const SLIDES_COUNT = 3

const SLIDE_DATA = [
  {
    tag: 'LIMITED TIME',
    headline: '₹100 Cashback',
    sub: 'On orders above ₹500',
    cta: 'Claim →',
    image: 'https://images.unsplash.com/photo-1604909052743-94e838986d24?w=800&q=80'
  },
  {
    tag: "CHEF'S CHOICE",
    headline: 'Family Platter',
    sub: 'Authentic Indian Flavors',
    cta: 'Order Now →',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&q=80'
  },
  {
    tag: 'WEEKEND SPECIAL',
    headline: 'Free Dessert',
    sub: 'With every main course',
    cta: 'Claim →',
    image: 'https://images.unsplash.com/photo-1666190092159-3171cf0fbb12?w=800&q=80'
  }
]

export function OfferBanner() {
  const [current, setCurrent] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const touchStartX = useRef(0)

  const startAutoPlay = () => {
    stopAutoPlay()
    intervalRef.current = setInterval(() => {
      goNext()
    }, 3500)
  }

  const stopAutoPlay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  const goNext = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrent(prev => (prev + 1) % SLIDES_COUNT)
    setTimeout(() => setIsTransitioning(false), 500)
  }

  const goPrev = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrent(prev => (prev - 1 + SLIDES_COUNT) % SLIDES_COUNT)
    setTimeout(() => setIsTransitioning(false), 500)
  }

  useEffect(() => {
    startAutoPlay()
    return () => stopAutoPlay()
  }, [isTransitioning])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    stopAutoPlay()
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const delta = e.changedTouches[0].clientX - touchStartX.current
    if (delta < -40) goNext()
    else if (delta > 40) goPrev()
    startAutoPlay()
  }

  return (
    <div className="px-4 mb-5">
      <div 
        className="relative w-full h-[160px] rounded-[14px] overflow-hidden select-none bg-slate-900"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slides Track */}
        <div 
          style={{
            display: "flex",
            width: `${SLIDES_COUNT * 100}%`,
            transform: `translateX(-${current * (100 / SLIDES_COUNT)}%)`,
            transition: isTransitioning 
              ? "transform 500ms cubic-bezier(0.25,0.46,0.45,0.94)" 
              : "none",
            willChange: "transform",
            height: '100%'
          }}
        >
          {SLIDE_DATA.map((slide, i) => (
            <div key={i} className="relative h-full shrink-0" style={{ width: `${100 / SLIDES_COUNT}%` }}>
              <img 
                src={slide.image} 
                alt={slide.headline} 
                className="w-full h-full object-cover" 
              />
              
              {/* Gradient Overlay */}
              <div 
                className="absolute inset-0" 
                style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)' }}
              />

              {/* Text Content */}
              <div className="absolute inset-0 p-4 flex flex-col justify-between">
                {/* TOP: Tag */}
                <div className="flex items-start">
                  <span 
                    className="inline-flex text-[10px] text-white font-bold tracking-widest uppercase px-2.5 py-1 rounded-[6px] backdrop-blur-md bg-white/10 border border-white/20 shadow-sm"
                    style={{ fontFamily: 'var(--font-outfit, sans-serif)' }}
                  >
                    {slide.tag}
                  </span>
                </div>

                {/* BOTTOM: Headline, Subtext, CTA */}
                <div className="flex flex-col items-start gap-0.5">
                  <h2 
                    className="text-[24px] font-bold text-white leading-tight"
                    style={{ fontFamily: 'var(--font-syne, sans-serif)' }}
                  >
                    {slide.headline}
                  </h2>
                  <p 
                    className="text-[13px] text-white/80 font-medium mb-1.5"
                    style={{ fontFamily: 'var(--font-outfit, sans-serif)' }}
                  >
                    {slide.sub}
                  </p>
                  <button 
                    className="inline-flex items-center justify-center bg-[#E8853A] hover:bg-[#D97706] active:scale-95 text-white text-[12px] font-bold px-4 py-1.5 rounded-full shadow-lg transition-all duration-200"
                    style={{ fontFamily: 'var(--font-outfit, sans-serif)' }}
                  >
                    {slide.cta}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dot Indicators */}
        <div className="absolute bottom-3 right-4 flex gap-1.5 items-center">
          {Array.from({ length: SLIDES_COUNT }).map((_, i) => (
            <button
              key={i}
              onClick={(e) => { 
                e.stopPropagation();
                stopAutoPlay(); 
                setCurrent(i); 
                startAutoPlay();
              }}
              style={{
                width: i === current ? 16 : 6,
                height: 6,
                borderRadius: 999,
                background: i === current 
                  ? "#FFFFFF" 
                  : "rgba(255,255,255,0.4)",
                transition: "all 300ms cubic-bezier(0.34,1.56,0.64,1)",
              }}
              className="hover:bg-white/80 transition-colors duration-200"
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Search, Mic, Square, Moon, Sun, Leaf } from 'lucide-react'
import { MENU_ITEMS, MENU_CATEGORIES } from '@/lib/data'
import { useCartStore } from '@/store/useCartStore'
import { cn } from '@/lib/utils'
import { Price } from '@/components/Price'
import { OfferBanner } from '@/components/OfferBanner'
import CartDrawer from '@/components/CartDrawer'
import { CartBar } from '@/components/CartBar'
import { BottomNav } from '@/components/BottomNav'
import { AssistSheet } from '@/components/AssistSheet'
import { MyOrderSheet } from '@/components/MyOrderSheet'
import { ModifierModal } from '@/components/ModifierModal'
import { CategoryBubbles } from '@/components/CategoryBubbles'
import { FilterChips } from '@/components/FilterChips'

interface Particle {
  id: number
  x: number
  y: number
}

interface MenuItem {
  id: string
  categoryId: string
  name: string
  description: string
  price: number
  image: string
  modifierGroups: {
    id: string
    name: string
    required: boolean
    options: { id: string; name: string; priceDelta: number }[]
  }[]
}

interface MenuClientProps {
  tableNumber: string
}

// ── Theme Toggle Component ──────────────────────────────────────────────────
function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('light')

  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'dark' | 'light' | null
    const initial = saved || 'light'
    setTheme(initial)
    document.documentElement.setAttribute('data-theme', initial)
  }, [])

  const toggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
  }

  return (
    <button
      onClick={toggle}
      className="w-[44px] h-[24px] rounded-full relative flex items-center p-0.5 transition-all duration-300"
      style={{
        background: 'var(--surface-2)',
        border: '1px solid var(--border)',
      }}
    >
      <div
        className="w-[18px] h-[18px] rounded-full flex items-center justify-center transition-transform duration-300 cubic-bezier(0.34,1.56,0.64,1)"
        style={{
          background: theme === 'dark' ? '#F0EDE8' : '#1A1714',
          transform: theme === 'dark' ? 'translateX(20px)' : 'translateX(0)',
        }}
      >
        {theme === 'dark' ? (
          <Moon size={10} color="#1A1714" fill="#1A1714" />
        ) : (
          <Sun size={10} color="#F0EDE8" fill="#F0EDE8" />
        )}
      </div>
    </button>
  )
}

// ── Inline Add / Stepper Button ──────────────────────────────────────────────
function AddButton({
  item,
  onAdd,
  onCustomize,
  onAnimate,
}: {
  item: MenuItem
  onAdd: (item: MenuItem) => void
  onCustomize: (item: MenuItem) => void
  onAnimate?: (e: React.MouseEvent) => void
}) {
  const cartItems = useCartStore((s) => s.cartItems)
  const addItem = useCartStore((s) => s.addItem)
  const removeItem = useCartStore((s) => s.removeItem)
  const cartStore = useCartStore()

  const inCart = cartItems.find(i => i.id === item.id)
  const qty = inCart?.quantity || 0
  const [isPopping, setIsPopping] = useState(false)

  const handleAction = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsPopping(true)
    setTimeout(() => setIsPopping(false), 400)
    onAnimate?.(e)
    if (qty === 0 && item.modifierGroups.length > 0) {
      onCustomize(item)
    } else {
      onAdd(item)
    }
  }

  if ((item.modifierGroups?.length || 0) > 0 && qty === 0) {
    return (
      <button
        onClick={handleAction}
        className={cn(
          "w-7 h-7 rounded-full flex items-center justify-center transition-all active:scale-90",
          isPopping && "popping"
        )}
        style={{
          border: '1.5px solid var(--accent)',
          color: 'var(--accent)',
          background: 'var(--surface)',
          fontSize: 18,
          lineHeight: 1,
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
        }}
      >
        +
      </button>
    )
  }

  if (qty === 0) {
    return (
      <button
        onClick={handleAction}
        className={cn(
          "w-7 h-7 rounded-full flex items-center justify-center transition-all active:scale-90",
          isPopping && "popping"
        )}
        style={{
          border: '1.5px solid var(--accent)',
          color: 'var(--accent)',
          background: 'var(--surface)',
          fontSize: 18,
          lineHeight: 1,
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
        }}
      >
        +
      </button>
    )
  }

  return (
    <div
      className="crave-stepper flex items-center justify-between rounded-full"
      style={{
        width: 80,
        background: 'var(--surface-2)',
        border: '1px solid var(--border)',
        height: 28,
      }}
    >
      <button
        onClick={(e) => {
          e.stopPropagation()
          if (inCart) {
            useCartStore.getState().updateQuantity(inCart.id, inCart.modifiers, inCart.quantity - 1)
          }
        }}
        className="w-7 h-7 flex items-center justify-center text-foreground rounded-full transition-colors"
        style={{ fontSize: 16 }}
      >
        −
      </button>
      <span
        style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}
      >
        {qty}
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation()
          if ((item.modifierGroups?.length || 0) > 0) {
            onCustomize(item)
          } else {
            useCartStore.getState().addItem({ id: item.id, name: item.name, price: item.price, imageUrl: item.image })
          }
        }}
        className="w-7 h-7 flex items-center justify-center text-(--accent) rounded-full transition-all"
        style={{ fontSize: 16 }}
      >
        +
      </button>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export function MenuClient({ tableNumber }: MenuClientProps) {
  const {
    cartItems,
    addItem,
    activeTab,
    setActiveTab,
    cartCount,
    cartTotal,
    lastAddedId
  } = useCartStore()

  const [particles, setParticles] = useState<Particle[]>([])

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

  const [modalItem, setModalItem] = useState<MenuItem | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isVegOnly, setIsVegOnly] = useState(false)
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeChips, setActiveChips] = useState<string[]>([])
  const [activeSort, setActiveSort] = useState("default")
  const [isRecording, setIsRecording] = useState(false)

  const [scrollY, setScrollY] = useState(0)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [scrollDir, setScrollDir] = useState<"up" | "down">("down")
  const [stickyVisible, setStickyVisible] = useState(false)
  const [searchInSticky, setSearchInSticky] = useState(false)

  const [navVisible, setNavVisible] = useState(true)
  const [lastScrollForNav, setLastScrollForNav] = useState(0)

  const STICKY_TRIGGER = 310
  const NAV_SCROLL_THRESHOLD = 8

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY
      const dir = current > lastScrollY ? "down" : "up"

      setScrollDir(dir)
      setScrollY(current)
      setLastScrollY(current)

      setStickyVisible(current > STICKY_TRIGGER)

      if (current > STICKY_TRIGGER) {
        setSearchInSticky(dir === "up")
      }

      const delta = current - lastScrollForNav
      if (Math.abs(delta) > NAV_SCROLL_THRESHOLD) {
        if (delta > 0 && current > 100) {
          setNavVisible(false)
        } else {
          setNavVisible(true)
        }
        setLastScrollForNav(current)
      }

      const nearBottom = window.innerHeight + current >= document.body.scrollHeight - 60
      if (nearBottom) setNavVisible(true)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [lastScrollY, lastScrollForNav])

  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.lang = 'en-IN'
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setSearchQuery(transcript)
        setIsRecording(false)
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event)
        setIsRecording(false)
      }

      recognitionRef.current.onend = () => {
        setIsRecording(false)
      }
    }
  }, [])

  const startVoiceSearch = () => {
    if (!recognitionRef.current) {
      alert('Voice search not available on this browser')
      return
    }
    if (isRecording) {
      recognitionRef.current.stop()
      return
    }
    setSearchQuery('')
    setIsRecording(true)
    recognitionRef.current.start()
  }

  function handleItemAdd(item: MenuItem) {
    useCartStore.getState().addItem({ id: item.id, name: item.name, price: item.price, modifiers: [], note: '', imageUrl: item.image })
  }

  function handleCustomize(item: MenuItem) {
    setModalItem(item)
  }

  const filteredItems = useMemo(() => {
    let result = MENU_ITEMS.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())

      const isVeg =
        item.name.toLowerCase().includes('mushroom') ||
        item.name.toLowerCase().includes('bread') ||
        item.name.toLowerCase().includes('gulab') ||
        item.name.toLowerCase().includes('lime') ||
        item.name.toLowerCase().includes('mango') ||
        item.name.toLowerCase().includes('veg') ||
        item.name.toLowerCase().includes('dosa') ||
        item.name.toLowerCase().includes('idli') ||
        item.name.toLowerCase().includes('vada') ||
        item.name.toLowerCase().includes('uttapam') ||
        item.name.toLowerCase().includes('pad thai') ||
        item.name.toLowerCase().includes('green curry') ||
        item.name.toLowerCase().includes('water') ||
        item.name.toLowerCase().includes('chai') ||
        item.name.toLowerCase().includes('coffee') ||
        item.name.toLowerCase().includes('juice') ||
        item.name.toLowerCase().includes('soda') ||
        item.name.toLowerCase().includes('mojito') ||
        item.categoryId === 'desserts'

      const matchesVeg = !isVegOnly || isVeg
      const matchesCat = activeCategory === 'all' || item.categoryId === activeCategory

      return matchesSearch && matchesVeg && matchesCat
    })

    if (activeChips.includes("veg")) {
      result = result.filter(item => {
        return item.name.toLowerCase().includes('mushroom') ||
          item.name.toLowerCase().includes('bread') ||
          item.name.toLowerCase().includes('gulab') ||
          item.name.toLowerCase().includes('lime') ||
          item.name.toLowerCase().includes('mango') ||
          item.name.toLowerCase().includes('veg') ||
          item.name.toLowerCase().includes('dosa') ||
          item.name.toLowerCase().includes('idli') ||
          item.name.toLowerCase().includes('vada') ||
          item.name.toLowerCase().includes('uttapam') ||
          item.name.toLowerCase().includes('pad thai') ||
          item.name.toLowerCase().includes('green curry') ||
          item.name.toLowerCase().includes('water') ||
          item.name.toLowerCase().includes('chai') ||
          item.name.toLowerCase().includes('coffee') ||
          item.name.toLowerCase().includes('juice') ||
          item.name.toLowerCase().includes('soda') ||
          item.name.toLowerCase().includes('mojito') ||
          item.categoryId === 'desserts'
      })
    }

    if (activeChips.includes("rating")) {
      // Mock: Items over ₹300 are rated 4.0+
      result = result.filter(i => i.price > 300)
    }
    if (activeChips.includes("under200")) {
      result = result.filter(i => i.price <= 200)
    }
    if (activeChips.includes("spicy")) {
      result = result.filter(i => {
        const text = (i.name + " " + i.description).toLowerCase()
        return text.includes('spicy') || text.includes('chilli') || text.includes('curry') || text.includes('schezwan')
      })
    }
    if (activeChips.includes("offers")) {
      // Mock: Items between ₹400 and ₹600 have offers
      result = result.filter(i => i.price > 400 && i.price < 600)
    }
    if (activeChips.includes("new")) {
      // Mock: Category drinks or desserts have 'new' items
      result = result.filter(i => i.categoryId === 'drinks' || i.categoryId === 'desserts')
    }

    if (activeSort === "price_asc") {
      result.sort((a, b) => a.price - b.price)
    } else if (activeSort === "price_desc") {
      result.sort((a, b) => b.price - a.price)
    } else if (activeSort === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name))
    }

    return result
  }, [searchQuery, isVegOnly, activeCategory, activeChips, activeSort])

  const categories = [{ id: 'all', name: 'All' }, ...MENU_CATEGORIES]

  return (
    <div
      className="crave-noise min-h-screen relative"
      style={{
        background: 'var(--bg)',
        paddingBottom: "calc(64px + env(safe-area-inset-bottom))"
      }}
    >
      <style suppressHydrationWarning>{`
        @keyframes stickyIn {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes stickyOut {
          from { transform: translateY(0); opacity: 1; }
          to { transform: translateY(-100%); opacity: 0; }
        }
        @keyframes searchSlideIn {
          from { transform: translateY(-52px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes searchSlideOut {
          from { transform: translateY(0); opacity: 1; }
          to { transform: translateY(-52px); opacity: 0; }
        }
        .sticky-wrapper {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 90;
          background: rgba(255,255,255,0.97);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
        }
        .sticky-wrapper.visible {
          animation: stickyIn 280ms cubic-bezier(0.32,0.72,0,1) forwards;
        }
        .sticky-wrapper.hidden {
          animation: stickyOut 220ms ease-in forwards;
          pointer-events: none;
        }
      `}</style>

      {/* ── New Header Structure ── */}
      <header className="relative z-20 transition-all duration-300" style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        padding: '14px 16px'
      }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
              {/* Fallback to initials if no logo */}
              <div className="w-full h-full flex items-center justify-center bg-(--accent) text-white text-xs font-bold">
                GS
              </div>
            </div>
            <div className="flex flex-col">
              <h1 style={{
                fontFamily: 'var(--font-syne)',
                fontSize: 18,
                fontWeight: 700,
                color: 'var(--text-primary)',
                lineHeight: 1.2
              }}>
                The Grand Spice
              </h1>
              <p style={{
                fontFamily: 'var(--font-outfit)',
                fontSize: 11,
                color: 'var(--text-muted)'
              }}>
                Table {tableNumber} · Dine-in
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* ── Search & Voice ── */}
      <div className="px-4 py-5 flex items-center gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isRecording ? "Listening..." : "Search dishes…"}
            className="w-full h-11 pl-11 pr-4 text-sm placeholder:text-muted text-foreground focus:outline-none transition-all"
            style={{
              fontFamily: 'var(--font-outfit)',
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderRadius: 10,
            }}
          />
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: 'var(--text-muted)' }}
          />
        </div>

        {/* Prominent Mic Button */}
        <button
          onClick={startVoiceSearch}
          className={`shrink-0 w-11 h-11 rounded-[10px] flex items-center justify-center transition-all ${isRecording ? 'voice-record-active' : ''}`}
          style={{
            background: isRecording ? '#EF4444' : 'var(--accent)',
            boxShadow: '0 2px 8px rgba(232,133,58,0.3)',
          }}
        >
          {isRecording ? (
            <Square size={16} color="#FFF" fill="#FFF" />
          ) : (
            <Mic size={18} color="#FFF" />
          )}
        </button>
      </div>

      <OfferBanner />

      {/* ── Category Section (Normal Data Flow) ── */}
      <div
        id="category-section"
        className="transition-all duration-300"
        style={{
          opacity: stickyVisible ? 0 : 1,
          pointerEvents: stickyVisible ? "none" : "auto",
        }}
      >
        <p style={{
          fontFamily: 'var(--font-outfit)',
          fontSize: '12px',
          color: 'var(--text-muted)',
          letterSpacing: '0.08em',
          padding: "16px 16px 8px",
        }}>
          What's on your mind?
        </p>

        <CategoryBubbles
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          size="full"
        />

        <div className="mt-2 pb-2">
          <FilterChips
            onFilterChange={setActiveChips}
            onSortChange={setActiveSort}
          />
        </div>
      </div>

      {/* ── Dish Count Divider ── */}
      <div className="px-4 mb-6 flex items-center gap-2.5">
        <span style={{
          fontFamily: 'var(--font-dm-mono)',
          fontSize: 10,
          letterSpacing: '0.15em',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap'
        }}>
          {filteredItems.length} DISHES
        </span>
        <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
      </div>

      {/* ── Single Column Menu List ── */}
      <main className="space-y-2 mt-4 px-4 pb-20 relative z-10">
        {filteredItems.map((item, idx) => (
          <div
            key={item.id}
            className="flex flex-row items-center gap-3 p-3.5 rounded-xl animate-in fade-in slide-in-from-bottom-2 duration-500"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              animationDelay: `${idx * 40}ms`,
            }}
          >
            {/* Left Side: Info */}
            <div className="flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <h3 style={{
                  fontFamily: 'var(--font-syne)',
                  fontSize: 16,
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  lineHeight: 1.2
                }}>
                  {item.name}
                </h3>
              </div>

              <p style={{
                fontFamily: 'var(--font-outfit)',
                fontSize: 12,
                color: 'var(--text-secondary)',
                lineHeight: 1.4,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                marginTop: 2
              }}>
                {item.description}
              </p>

              <Price
                amount={item.price}
                className="mt-2"
                amountClassName="text-[17px]"
              />
            </div>

            {/* Right Side: Image with overlaid ADD */}
            <div className="relative shrink-0 w-[88px] h-[88px] rounded-lg">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover rounded-lg"
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

              {/* Absolute Overlaid ADD Button at bottom-right of image */}
              <div className="absolute bottom-[-6px] right-[-6px] z-10 text-white">
                <AddButton
                  item={item}
                  onAdd={handleItemAdd}
                  onCustomize={handleCustomize}
                  onAnimate={spawnParticle}
                />
              </div>
            </div>
          </div>
        ))}

        {/* Empty state */}
        {filteredItems.length === 0 && (
          <div className="py-20 text-center space-y-3">
            <p
              className="uppercase tracking-[0.2em] text-xs"
              style={{ fontFamily: 'var(--font-dm-mono)', color: 'var(--text-muted)' }}
            >
              No dishes found
            </p>
            <button
              onClick={() => { setSearchQuery(''); setIsVegOnly(false); setActiveCategory('all') }}
              style={{ fontFamily: 'var(--font-outfit)', color: 'var(--accent)', fontSize: 14 }}
              className="underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </main>

      <CartDrawer />
      <MyOrderSheet tableNumber={tableNumber} />

      <CartBar navVisible={navVisible} />
      <BottomNav visible={navVisible} />

      <AssistSheet
        orgId="demo-org"
        tableId={tableNumber}
      />

      <ModifierModal
        item={modalItem}
        open={!!modalItem}
        onClose={() => setModalItem(null)}
      />

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
            color: 'var(--accent)',
            animation: 'flyUp 600ms ease forwards'
          }}
        >
          +1
        </div>
      ))}

      {/* ── FIXED PREMIUM STICKY OVERLAY ── */}
      <div
        className="transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] shadow-sm"
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 40,
          background: "var(--surface)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid var(--border)",
          opacity: stickyVisible ? 1 : 0,
          visibility: stickyVisible ? "visible" : "hidden",
          transform: stickyVisible ? "translateY(0)" : "translateY(-12px)",
          pointerEvents: stickyVisible ? "auto" : "none"
        }}
      >
        {/* COMPACT SEARCH BAR */}
        <div
          className="transition-all duration-300 ease-out flex items-center gap-3"
          style={{
            maxHeight: searchInSticky ? 52 : 0,
            opacity: searchInSticky ? 1 : 0,
            padding: searchInSticky ? "8px 16px 0" : "0 16px",
            overflow: "hidden",
            borderBottom: searchInSticky ? "1px solid var(--border)" : "none"
          }}
        >
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes…"
              className="w-full h-[36px] pl-10 pr-4 text-[13px] placeholder:text-muted text-foreground focus:outline-none transition-all"
              style={{ fontFamily: 'var(--font-outfit)', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8 }}
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          </div>
        </div>

        {/* Compact Categories & Filters */}
        <div style={{ paddingTop: 8, paddingBottom: 8 }}>
          <CategoryBubbles
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            size="compact"
          />
          <div className="mt-[-4px]">
            <FilterChips
              compact
              onFilterChange={setActiveChips}
              onSortChange={setActiveSort}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

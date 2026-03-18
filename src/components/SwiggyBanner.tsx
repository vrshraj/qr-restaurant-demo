'use client'

const OFFERS = [
  { label: 'OFFER', amount: '₹100', sub: 'cashback' },
  { label: 'OFFER', amount: '₹200', sub: 'free delivery' },
  { label: 'PROMO', amount: '15%', sub: 'on mains' },
  { label: 'DEAL', amount: '₹300', sub: 'weekend special' },
]

export function SwiggyBanner() {
  return (
    <section className="pt-2 pb-6">
      {/* Offer Cards — horizontal editorial strip */}
      <div className="flex gap-3 px-4 overflow-x-auto no-scrollbar">
        {OFFERS.map((offer, i) => (
          <div
            key={i}
            className="shrink-0 flex flex-col justify-between rounded-xl px-4 py-4"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderLeft: '2px solid var(--accent)',
              minWidth: '140px',
              height: '100px'
            }}
          >
            <div>
              <span
                className="text-[28px] leading-none"
                style={{ fontFamily: 'var(--font-syne)', color: 'var(--text-primary)', fontWeight: 700 }}
              >
                {offer.amount}
              </span>
            </div>
            <div>
              <span
                className="text-[11px]"
                style={{ fontFamily: 'var(--font-outfit)', color: 'var(--text-muted)' }}
              >
                {offer.sub}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

import type { Metadata } from 'next'
import { Syne, Outfit, DM_Mono, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { OrderProvider } from '@/context/OrderContext'

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne',
})

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-outfit',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-dm-mono',
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plus-jakarta',
})

export const metadata: Metadata = {
  title: 'CRAVE — Table Ordering',
  description: 'Scan. Order. Enjoy.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning className={`${syne.variable} ${outfit.variable} ${dmMono.variable} ${plusJakarta.variable}`}>
      <body className="antialiased font-outfit bg-crave-bg text-crave-cream" suppressHydrationWarning>
        <OrderProvider>{children}</OrderProvider>
      </body>
    </html>
  )
}

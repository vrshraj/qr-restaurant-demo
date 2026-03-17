import type { Metadata } from 'next'
import { Instrument_Serif, Inter } from 'next/font/google'
import './globals.css'
import { OrderProvider } from '@/context/OrderContext'

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-serif',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Spice Garden — QR Ordering',
  description: 'Scan. Order. Enjoy.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${instrumentSerif.variable} ${inter.variable}`}>
      <body className="antialiased font-inter" suppressHydrationWarning>
        <OrderProvider>{children}</OrderProvider>
      </body>
    </html>
  )
}

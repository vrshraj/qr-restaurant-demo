import type { Metadata } from 'next'
import './globals.css'
import { OrderProvider } from '@/context/OrderContext'

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
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <OrderProvider>{children}</OrderProvider>
      </body>
    </html>
  )
}

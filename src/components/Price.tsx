'use client'

import { cn } from "@/lib/utils"

interface PriceProps {
  amount: number
  className?: string
  symbolClassName?: string
  amountClassName?: string
}

export function Price({ amount, className, symbolClassName, amountClassName }: PriceProps) {
  return (
    <span className={cn("price", className)}>
      <span 
        className={cn(symbolClassName)}
        style={{ fontSize: '0.8em', fontWeight: 500 }}
      >
        ₹
      </span>
      <span 
        className={cn(amountClassName)}
        style={{ fontSize: '1em', fontWeight: 600 }}
      >
        {amount.toLocaleString()}
      </span>
    </span>
  )
}

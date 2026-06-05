import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type StadiumCardProps = {
  children: ReactNode
  className?: string
  solid?: boolean
  glass?: boolean
  glow?: boolean
  pad?: number
  onClick?: () => void
}

function StadiumCard({
  children,
  className,
  solid = false,
  glass = false,
  glow = false,
  pad = 16,
  onClick,
}: StadiumCardProps) {
  const useGlass = glass && !solid

  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onClick()
              }
            }
          : undefined
      }
      className={cn(
        'border border-[var(--cf-card-border)]',
        useGlass && 'cf-glass-card',
        glow &&
          'shadow-[0_0_0_1px_rgba(230,197,119,0.2),0_16px_40px_-20px_rgba(0,0,0,0.65)]',
        onClick && 'cursor-pointer',
        className
      )}
      style={{
        padding: pad,
        borderRadius: 'var(--cf-radius-card)',
        background: useGlass
          ? undefined
          : solid
            ? 'var(--cf-card-solid)'
            : 'var(--cf-card)',
        boxShadow: useGlass
          ? '0 1px 0 rgba(255,255,255,0.06) inset, 0 16px 36px -26px rgba(0,0,0,0.75)'
          : undefined,
      }}
    >
      {children}
    </div>
  )
}

export { StadiumCard }

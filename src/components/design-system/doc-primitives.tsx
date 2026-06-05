import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

function DocSection({
  n,
  title,
  desc,
  children,
}: {
  n: string
  title: string
  desc?: string
  children: ReactNode
}) {
  return (
    <section className="mt-16">
      <div className="mb-1.5 flex items-baseline gap-3">
        <span className="font-mono text-[13px] font-medium text-[var(--cf-gold)]">
          {n}
        </span>
        <h2 className="m-0 text-[26px] font-extrabold tracking-tight text-white">
          {title}
        </h2>
      </div>
      {desc ? (
        <p className="mb-[22px] max-w-[620px] text-[15px] leading-normal text-[var(--cf-muted)]">
          {desc}
        </p>
      ) : null}
      {children}
    </section>
  )
}

function DocSubLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mt-[26px] mb-3 text-xs font-extrabold tracking-wide text-[var(--cf-faint)] uppercase">
      {children}
    </div>
  )
}

function DocPanel({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'rounded-[18px] border border-[var(--cf-card-border-soft)] bg-white/[0.03] p-[22px]',
        className
      )}
    >
      {children}
    </div>
  )
}

function DocGrid({
  children,
  min = 150,
  gap = 12,
  className,
}: {
  children: ReactNode
  min?: number
  gap?: number
  className?: string
}) {
  return (
    <div
      className={cn('grid', className)}
      style={{
        gridTemplateColumns: `repeat(auto-fill, minmax(${min}px, 1fr))`,
        gap,
      }}
    >
      {children}
    </div>
  )
}

function DocSwatch({
  name,
  token,
  value,
  swatch,
  note,
  dark,
}: {
  name: string
  token: string
  value: string
  swatch?: string
  note?: string
  dark?: boolean
}) {
  const fill = swatch ?? value
  return (
    <div className="overflow-hidden rounded-[14px] border border-[var(--cf-card-border-soft)] bg-white/[0.02]">
      <div className="relative h-[76px]" style={{ background: fill }}>
        {note ? (
          <span
            className={cn(
              'absolute bottom-2 left-2.5 text-[10px] font-extrabold tracking-wide uppercase',
              dark ? 'text-[var(--cf-ink)]' : 'text-white'
            )}
          >
            {note}
          </span>
        ) : null}
      </div>
      <div className="px-3 py-2.5">
        <div className="text-[13.5px] font-bold text-white">{name}</div>
        <div className="mt-0.5 font-mono text-[11px] text-[var(--cf-muted)]">
          {token}
        </div>
        <div className="mt-px font-mono text-[11px] text-[var(--cf-faint)]">
          {value}
        </div>
      </div>
    </div>
  )
}

export { DocGrid, DocPanel, DocSection, DocSubLabel, DocSwatch }

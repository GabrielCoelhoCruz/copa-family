import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type PageSectionProps = {
  children: ReactNode
  title?: string
  titleId?: string
  description?: string
  className?: string
  variant?: 'surface' | 'elevated' | 'plain'
}

function PageSection({
  children,
  title,
  titleId,
  description,
  className,
  variant = 'surface',
}: PageSectionProps) {
  const headingId = titleId ?? (title ? `${title.replace(/\s+/g, '-').toLowerCase()}-heading` : undefined)

  return (
    <section
      className={cn(
        variant === 'surface' &&
          'rounded-2xl border border-border/70 bg-card/60 p-4 shadow-sm',
        variant === 'elevated' &&
          'rounded-2xl border border-border bg-card/90 p-4 shadow-lg shadow-brand-field/5',
        variant === 'plain' && 'space-y-3',
        className
      )}
      aria-labelledby={headingId}
    >
      {title ? (
        <header className={cn(description ? 'space-y-1' : undefined)}>
          <h2
            id={headingId}
            className="font-heading text-lg font-bold tracking-tight"
          >
            {title}
          </h2>
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </header>
      ) : null}
      {children}
    </section>
  )
}

export { PageSection }

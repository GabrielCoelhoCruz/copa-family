import type { ReactNode } from 'react'

import { CopaAmbient } from '@/components/patterns/copa-ambient'
import { cn } from '@/lib/utils'

type SiteAmbient = 'home' | 'flow' | 'none'

type SiteShellProps = {
  children: ReactNode
  ambient?: SiteAmbient
  footer?: ReactNode
  className?: string
  mainClassName?: string
}

function SiteShell({
  children,
  ambient = 'flow',
  footer,
  className,
  mainClassName,
}: SiteShellProps) {
  return (
    <div
      className={cn(
        'relative mx-auto flex min-h-dvh w-full max-w-md flex-col',
        className
      )}
    >
      {ambient === 'home' ? <CopaAmbient variant="home" /> : null}
      {ambient === 'flow' ? (
        <div
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
          aria-hidden="true"
        >
          <div className="absolute -right-6 top-8 size-44 rounded-full bg-brand-trophy/25 blur-3xl" />
          <div className="absolute -left-10 bottom-32 size-40 rounded-full bg-brand-field/20 blur-3xl" />
          <div className="absolute right-1/4 top-1/2 size-28 rounded-full bg-brand-sky/15 blur-3xl" />
        </div>
      ) : null}

      <div
        className={cn(
          'relative z-10 flex min-h-0 flex-1 flex-col',
          mainClassName
        )}
      >
        {children}
      </div>

      {footer}
    </div>
  )
}

export { SiteShell }
export type { SiteAmbient }

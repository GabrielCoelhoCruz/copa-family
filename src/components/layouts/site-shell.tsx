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
      {ambient === 'flow' ? <CopaAmbient variant="home" className="-z-10" /> : null}

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

import type { ReactNode } from 'react'

import { FlowLayout } from '@/components/flow-layout'
import { PageTopBar } from '@/components/layouts/page-top-bar'

type FlowPageProps = {
  backHref: string
  backLabel?: string
  title: string
  description?: string
  children: ReactNode
}

function FlowPage({
  backHref,
  backLabel,
  title,
  description,
  children,
}: FlowPageProps) {
  return (
    <FlowLayout>
      <div className="flex items-center gap-3 px-0.5 pb-4 pt-1.5">
        <PageTopBar href={backHref} label={backLabel} />
        <div className="min-w-0">
          <h1 className="truncate font-heading text-[22px] font-extrabold leading-tight text-white">
            {title}
          </h1>
          {description ? (
            <p className="mt-0.5 text-[13px] text-[var(--cf-muted)]">{description}</p>
          ) : null}
        </div>
      </div>
      {children}
    </FlowLayout>
  )
}

export { FlowPage }

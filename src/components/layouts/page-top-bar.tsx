import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

import { cn } from '@/lib/utils'

type PageTopBarProps = {
  href: string
  label?: string
  className?: string
}

function PageTopBar({ href, label = 'Voltar', className }: PageTopBarProps) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={cn(
        'cf-pressable flex size-11 shrink-0 items-center justify-center rounded-full border border-[var(--cf-card-border)] bg-[var(--cf-glass)]',
        className
      )}
    >
      <ChevronLeft className="size-[22px] text-[var(--cf-gold)]" aria-hidden />
    </Link>
  )
}

export { PageTopBar }

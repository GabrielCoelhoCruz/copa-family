import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import { buttonVariants } from '@/components/ui/button'
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
      className={cn(
        buttonVariants({ variant: 'ghost', size: 'sm' }),
        'cf-pressable w-fit -ml-1',
        className
      )}
    >
      <ArrowLeft aria-hidden />
      {label}
    </Link>
  )
}

export { PageTopBar }

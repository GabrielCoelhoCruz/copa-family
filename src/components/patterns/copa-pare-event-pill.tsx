import Link from 'next/link'
import { PartyPopper, Trophy } from 'lucide-react'

import { buttonVariants } from '@/components/ui/button'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils'

type CopaPareEventPillProps = {
  roomCode: string
}

function CopaPareEventPill({ roomCode }: CopaPareEventPillProps) {
  return (
    <Link
      href={routes.copaPare(roomCode)}
      className={cn(
        buttonVariants({ variant: 'party', size: 'lg' }),
        'cf-pressable cf-trophy-glow flex min-h-14 w-full items-center justify-center gap-2 px-3 text-pretty text-center text-sm leading-snug shadow-xl shadow-brand-party/25 ring-2 ring-brand-party/30 sm:text-base'
      )}
    >
      <PartyPopper className="size-5 shrink-0" aria-hidden />
      <span className="font-heading text-base font-black">Intervalo: jogar Copa Pare</span>
      <Trophy className="size-4 shrink-0" aria-hidden />
    </Link>
  )
}

export { CopaPareEventPill }

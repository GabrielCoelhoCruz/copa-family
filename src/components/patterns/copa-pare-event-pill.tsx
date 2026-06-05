import Link from 'next/link'
import { ChevronRight, Zap } from 'lucide-react'

import { POINTS } from '@/features/points/rules'
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
        'cf-pressable cf-pulse-big flex h-[50px] w-full items-center gap-2.5 rounded-2xl border-0 px-4',
        'bg-gradient-to-r from-[#ff6b5e] to-[#ffb33f] text-[#3a1500] shadow-[0_10px_24px_-10px_rgba(255,107,94,0.7)]'
      )}
    >
      <div className="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-black/18">
        <Zap className="size-[19px]" aria-hidden />
      </div>
      <div className="min-w-0 flex-1 text-left">
        <div className="font-heading text-sm font-black leading-tight">
          Copa Stop está aberto!
        </div>
        <div className="text-[11.5px] font-bold opacity-80">
          Toque pra jogar no intervalo · +{POINTS.copaPareParticipation}
        </div>
      </div>
      <ChevronRight className="size-5 shrink-0" aria-hidden />
    </Link>
  )
}

export { CopaPareEventPill }

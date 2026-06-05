import { Shuffle } from 'lucide-react'

import { reshuffleCopaPareLetterFormAction } from '@/features/rooms/actions'
import { copaPareCategoryLabel } from '@/lib/copa-pare-categories'
import { Button } from '@/components/ui/button'

type CopaStopHostPanelProps = {
  matchId: string
  roomId: string
  roomCode: string
  category: string
  letter: string
}

function CopaStopHostPanel({
  matchId,
  roomId,
  roomCode,
  category,
  letter,
}: CopaStopHostPanelProps) {
  return (
    <div className="mt-3 space-y-3">
      <div className="rounded-xl border border-[var(--cf-card-border-soft)] bg-[var(--cf-glass)] px-3 py-2.5 text-sm">
        <p className="font-bold text-white">Copa Stop ativo</p>
        <p className="mt-1 text-[var(--cf-muted)]">
          {copaPareCategoryLabel(category)} · letra{' '}
          <strong className="text-[var(--cf-gold)]">{letter}</strong>
        </p>
      </div>

      <form action={reshuffleCopaPareLetterFormAction}>
        <input type="hidden" name="matchId" value={matchId} />
        <input type="hidden" name="roomId" value={roomId} />
        <input type="hidden" name="roomCode" value={roomCode} />
        <Button
          type="submit"
          variant="outline"
          className="min-h-11 w-full gap-2 border-[var(--cf-card-border)] bg-[var(--cf-glass)]"
        >
          <Shuffle className="size-4" aria-hidden />
          Sortear outra letra
        </Button>
        <p className="mt-2 text-xs text-[var(--cf-muted)]">
          Apaga todas as respostas do intervalo. A família joga de novo com a nova letra.
        </p>
      </form>
    </div>
  )
}

export { CopaStopHostPanel }

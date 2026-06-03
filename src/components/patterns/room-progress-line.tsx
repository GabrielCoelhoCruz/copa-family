import Link from 'next/link'

import { routes } from '@/lib/routes'

type RoomProgressLineProps = {
  roomCode: string
  userPosition: number | null
  userPoints: number
  currentMatchPoints?: number
}

function RoomProgressLine({
  roomCode,
  userPosition,
  userPoints,
  currentMatchPoints,
}: RoomProgressLineProps) {
  const positionLabel =
    userPosition != null ? `${userPosition}º` : '—'

  return (
    <p className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border/70 bg-card/80 px-3 py-2.5 text-sm">
      <span className="font-medium text-foreground">
        Você:{' '}
        <span className="font-heading font-bold tabular-nums">{positionLabel}</span>
        {' · '}
        <span className="font-heading font-bold tabular-nums">
          {userPoints.toLocaleString('pt-BR')} pts
        </span>
        {currentMatchPoints != null ? (
          <>
            {' · '}
            <span className="text-muted-foreground">
              jogo: {currentMatchPoints.toLocaleString('pt-BR')} pts
            </span>
          </>
        ) : null}
      </span>
      <span className="flex gap-3 text-xs font-semibold">
        <Link
          href={routes.ranking(roomCode)}
          className="text-primary underline-offset-4 hover:underline"
        >
          Ranking
        </Link>
        <Link
          href={routes.perfil(roomCode)}
          className="text-primary underline-offset-4 hover:underline"
        >
          Perfil
        </Link>
      </span>
    </p>
  )
}

export { RoomProgressLine }

import { StadiumCard } from '@/components/patterns/stadium-card'
import { StadiumFlag } from '@/components/patterns/stadium-flag'
import { StadiumLabel } from '@/components/patterns/stadium-label'
import type { RoomMatchHistorySummary } from '@/features/rooms/queries'

type RoomMatchHistoryListProps = {
  items: RoomMatchHistorySummary[]
}

function RoomMatchHistoryList({ items }: RoomMatchHistoryListProps) {
  if (items.length === 0) return null

  return (
    <section aria-labelledby="historico-sala-heading" className="space-y-2.5">
      <StadiumLabel>Histórico da sala</StadiumLabel>
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <StadiumCard key={item.matchId} glass pad={12}>
            <div className="flex items-center gap-2.5">
              <StadiumFlag teamName={item.homeTeamName} size={24} round />
              <span className="font-heading text-[15px] font-extrabold text-white tabular-nums">
                {item.homeScore} – {item.awayScore}
              </span>
              <StadiumFlag teamName={item.awayTeamName} size={24} round />
              <div className="flex-1" />
              {item.topPlayerName ? (
                <span className="text-right text-xs text-[var(--cf-muted)]">
                  melhor:{' '}
                  <b className="font-bold text-[var(--cf-gold)]">
                    {item.topPlayerName}
                  </b>
                </span>
              ) : null}
            </div>
          </StadiumCard>
        ))}
      </div>
    </section>
  )
}

export { RoomMatchHistoryList }

'use client'

import { useState } from 'react'
import { Crown } from 'lucide-react'

import { StadiumAvatar } from '@/components/patterns/stadium-avatar'
import { StadiumCard } from '@/components/patterns/stadium-card'
import { cn } from '@/lib/utils'

type RankingEntry = {
  userId: string
  displayName: string
  points: number
  position: number
  detail?: string
  avatarInitial: string
  avatarColor: string
  avatarPhotoUrl: string | null
  isCurrentUser: boolean
}

type RankingTabsViewProps = {
  roomRanking: RankingEntry[]
  matchRanking: RankingEntry[]
  matchFinished: boolean
  currentUserId: string | null
}

function RankingTabsView({
  roomRanking,
  matchRanking,
  matchFinished,
  currentUserId,
}: RankingTabsViewProps) {
  const [tab, setTab] = useState<'room' | 'match'>('room')
  const list = tab === 'room' ? roomRanking : matchRanking
  const myIdx = list.findIndex((r) => r.userId === currentUserId)
  const myRow = myIdx >= 0 ? list[myIdx] : null

  return (
    <div className="space-y-4">
      {myRow ? (
        <StadiumCard glow className="flex items-center gap-3 p-3.5">
          <div className="w-[34px] text-center font-heading text-[26px] font-black text-[var(--cf-gold)]">
            {myIdx + 1}º
          </div>
          <StadiumAvatar
            initial={myRow.avatarInitial}
            color={myRow.avatarColor}
            photoUrl={myRow.avatarPhotoUrl}
            size={42}
            ring="var(--cf-gold)"
          />
          <div className="min-w-0 flex-1">
            <div className="font-heading text-[15.5px] font-extrabold">Sua posição</div>
            <div className="text-xs text-[var(--cf-muted)]">
              {tab === 'room' ? 'no ranking da sala' : 'neste jogo'}
            </div>
          </div>
          <div className="text-right">
            <div className="font-heading text-[22px] font-black">{myRow.points}</div>
            <div className="text-[10px] font-bold text-[var(--cf-faint)]">PTS</div>
          </div>
        </StadiumCard>
      ) : null}

      <div className="flex gap-1.5 rounded-2xl border border-[var(--cf-card-border)] bg-[var(--cf-glass)] p-1">
        {(
          [
            ['room', 'Ranking da sala'],
            ['match', 'Ranking da partida'],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={cn(
              'h-[42px] flex-1 rounded-[11px] border-0 font-heading text-[13px] font-extrabold transition-[filter] duration-[var(--duration-fast)]',
              tab === key
                ? 'cf-bg-gold-gradient hover:brightness-105'
                : 'bg-transparent text-[var(--cf-muted)] hover:bg-white/[0.06] hover:text-white'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'match' && !matchFinished ? (
        <p className="flex items-center gap-2 rounded-[13px] border border-[rgba(86,179,240,0.25)] bg-[rgba(86,179,240,0.1)] px-3 py-2.5 text-xs text-[#cfeaff]">
          Pontos da partida contam quando o jogo encerrar.
        </p>
      ) : null}

      <div className="flex flex-col gap-2">
        {list.map((row, i) => (
          <div
            key={row.userId}
            className={cn(
              'flex items-center gap-3 rounded-2xl border px-3.5 py-2.5',
              row.isCurrentUser
                ? 'border-[rgba(230,197,119,0.45)] bg-[rgba(230,197,119,0.12)]'
                : 'border-[var(--cf-card-border)] bg-[var(--cf-glass)]'
            )}
          >
            <div
              className={cn(
                'w-6 text-center font-heading text-base font-extrabold',
                i < 3 ? 'text-[var(--cf-gold)]' : 'text-[var(--cf-faint)]'
              )}
            >
              {i + 1}
            </div>
            <StadiumAvatar
              initial={row.avatarInitial}
              color={row.avatarColor}
              photoUrl={row.avatarPhotoUrl}
              size={38}
            />
            <div className="min-w-0 flex-1">
              <div className="text-[15px] font-bold">
                {row.displayName}
                {row.isCurrentUser ? (
                  <span className="font-semibold text-[var(--cf-gold)]"> · você</span>
                ) : null}
              </div>
              {row.detail ? (
                <div className="text-[11.5px] text-[var(--cf-muted)]">{row.detail}</div>
              ) : null}
            </div>
            {i === 0 ? <Crown className="size-[18px] text-[var(--cf-gold)]" aria-hidden /> : null}
            <div className="text-right">
              <div className="font-heading text-lg font-black">{row.points}</div>
              <div className="text-[9.5px] font-bold text-[var(--cf-faint)]">PTS</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export { RankingTabsView }
export type { RankingEntry }

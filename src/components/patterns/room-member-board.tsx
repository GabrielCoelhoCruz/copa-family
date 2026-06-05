import { StadiumAvatar } from '@/components/patterns/stadium-avatar'
import { StadiumCard } from '@/components/patterns/stadium-card'
import type { RoomMemberBoardRow } from '@/features/rooms/queries'
import { cn } from '@/lib/utils'

type RoomMemberBoardProps = {
  rows: RoomMemberBoardRow[]
  predictionCount?: number
  memberCount?: number
  showPredictionProgress?: boolean
}

function RoleBadge({ role }: { role: RoomMemberBoardRow['role'] }) {
  if (role === 'owner') {
    return (
      <span className="shrink-0 rounded-[10px] bg-[rgba(230,197,119,0.13)] px-2 py-0.5 text-[10px] font-extrabold tracking-wide text-[var(--cf-gold)] uppercase">
        dono
      </span>
    )
  }

  if (role === 'co_host') {
    return (
      <span className="shrink-0 rounded-[10px] bg-[rgba(86,179,240,0.13)] px-2 py-0.5 text-[10px] font-extrabold tracking-wide text-[var(--cf-sky)] uppercase">
        co-org
      </span>
    )
  }

  return null
}

function RoomMemberBoard({
  rows,
  predictionCount = 0,
  memberCount = 0,
  showPredictionProgress = false,
}: RoomMemberBoardProps) {
  const progress =
    memberCount > 0 ? Math.round((predictionCount / memberCount) * 100) : 0

  return (
    <StadiumCard glass pad={6}>
      {showPredictionProgress && memberCount > 0 ? (
        <div className="border-b border-[var(--cf-card-border-soft)] px-2.5 py-2.5">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-[13.5px] font-bold text-white">
              Palpites enviados
            </span>
            <span className="font-heading text-sm font-extrabold text-[var(--cf-gold)]">
              {predictionCount}/{memberCount}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-[5px] bg-white/[0.08]">
            <div
              className="h-full rounded-[5px] bg-[var(--cf-gold-gradient)] transition-[width] duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : null}

      <ul>
        {rows.map((row, index) => (
          <li
            key={row.userId}
            className={cn(
              'flex items-center gap-2.5 px-2.5 py-2',
              index < rows.length - 1 &&
                'border-b border-[var(--cf-card-border-soft)]',
              row.isCurrentUser && 'bg-[rgba(230,197,119,0.06)]'
            )}
          >
            <span
              className={cn(
                'w-5 shrink-0 text-center font-heading text-xs font-extrabold',
                row.position <= 3 ? 'text-[var(--cf-gold)]' : 'text-[var(--cf-faint)]'
              )}
            >
              {row.position}
            </span>
            <StadiumAvatar
              initial={row.avatarInitial}
              color={row.avatarColor}
              photoUrl={row.avatarPhotoUrl}
              size={34}
            />
            <div className="min-w-0 flex-1">
              <div className="flex min-w-0 items-center gap-1.5">
                <p className="truncate text-sm font-bold text-white">
                  {row.displayName}
                  {row.isCurrentUser ? (
                    <span className="font-semibold text-[var(--cf-gold)]">
                      {' '}
                      · você
                    </span>
                  ) : null}
                </p>
                <RoleBadge role={row.role} />
              </div>
              <p className="text-[11.5px] text-[var(--cf-muted)]">
                {row.statusLabel}
              </p>
            </div>
            <span className="shrink-0 font-heading text-sm font-extrabold text-white tabular-nums">
              {row.points}
            </span>
          </li>
        ))}
      </ul>
    </StadiumCard>
  )
}

export { RoomMemberBoard }

import Link from 'next/link'
import { Target, Users } from 'lucide-react'
import { notFound } from 'next/navigation'

import { MatchResultForm } from '@/components/match-result-form'
import { HostChecklist } from '@/components/patterns/host-checklist'
import { HostControlPanel } from '@/components/patterns/host-control-panel'
import { EmptyState } from '@/components/patterns/empty-state'
import { ParticipantRow } from '@/components/patterns/participant-row'
import { RoomCodeDisplay } from '@/components/patterns/room-code-display'
import { getLobbyStats, getRoomContext } from '@/features/rooms/queries'
import { ANALYTICS_EVENTS, trackEvent } from '@/lib/analytics'
import { getAvatarFallback } from '@/lib/avatars'
import { getInviteUrl } from '@/lib/invite-url'
import { routes } from '@/lib/routes'
import { getGuestUserId } from '@/lib/session'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type SalaLobbyPageProps = {
  params: Promise<{ roomCode: string }>
  searchParams: Promise<{ qr?: string; statusErro?: string; resultado?: string }>
}

export default async function SalaLobbyPage({
  params,
  searchParams,
}: SalaLobbyPageProps) {
  const { roomCode } = await params
  const { qr, statusErro, resultado } = await searchParams
  const context = await getRoomContext(roomCode)

  if (!context) {
    notFound()
  }

  const { room, match, members, pointsByUser } = context
  const userId = await getGuestUserId()
  const inviteUrl = await getInviteUrl(room.code)
  const isOwner = userId === room.owner_user_id
  const stats = await getLobbyStats(room.id, match.id)
  const hasMatchResult =
    match.winner != null &&
    match.home_score != null &&
    match.away_score != null

  if (qr === '1') {
    await trackEvent({
      eventName: ANALYTICS_EVENTS.qrOpened,
      roomId: room.id,
      matchId: match.id,
      userId: userId ?? undefined,
    })
  }

  const showResultForm =
    isOwner &&
    match.status !== 'lobby' &&
    match.status !== 'predictions_open'

  return (
    <div className="flex flex-col gap-4">
      <RoomCodeDisplay
        roomCode={room.code}
        inviteUrl={inviteUrl}
        salaPath={routes.sala(room.code)}
        showQr={qr === '1'}
      />

      {statusErro ? (
        <p
          className="rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive"
          role="alert"
        >
          {decodeURIComponent(statusErro)}
        </p>
      ) : null}

      {resultado === '1' ? (
        <p
          className="rounded-xl border border-match-finished/35 bg-match-finished/10 px-3 py-2 text-sm font-medium text-foreground"
          role="status"
        >
          Resultado salvo e pontos recalculados.
        </p>
      ) : null}

      {!isOwner && match.status === 'predictions_open' ? (
        <div className="flex flex-col gap-3 rounded-2xl border border-match-predictions/35 bg-gradient-to-br from-match-predictions/15 to-card px-4 py-4 text-sm shadow-sm">
          <p className="font-semibold text-foreground">Palpites abertos</p>
          <p className="text-muted-foreground">
            Vá na aba Palpites e envie o seu antes do jogo começar.
          </p>
          <Link
            href={routes.palpites(room.code)}
            className={cn(buttonVariants({ variant: 'party', size: 'sm' }), 'w-fit min-h-11')}
          >
            <Target />
            Fazer palpite
          </Link>
        </div>
      ) : null}

      {(match.status === 'halftime' || match.status === 'live') && !isOwner ? (
        <div className="rounded-2xl border border-brand-party/30 bg-gradient-to-br from-brand-party/10 to-card px-4 py-3 text-sm">
          <p className="font-semibold">Intervalo ou jogo ao vivo</p>
          <p className="mt-1 text-muted-foreground">
            Participe do Copa Pare na aba dedicada (+100 pts).
          </p>
          <Link
            href={routes.copaPare(room.code)}
            className={cn(buttonVariants({ variant: 'party', size: 'sm' }), 'mt-2 min-h-11')}
          >
            Copa Pare
          </Link>
        </div>
      ) : null}

      {isOwner ? (
        <>
          <HostChecklist
            status={match.status}
            memberCount={stats.memberCount}
            predictionCount={stats.predictionCount}
            hasMatchResult={hasMatchResult}
          />
          <HostControlPanel
            matchId={match.id}
            roomId={room.id}
            roomCode={room.code}
            status={match.status}
            isOwner
          />
        </>
      ) : null}

      {showResultForm ? (
        <MatchResultForm
          matchId={match.id}
          roomId={room.id}
          roomCode={room.code}
          defaultWinner={match.winner ?? ''}
          defaultHomeScore={match.home_score ?? 0}
          defaultAwayScore={match.away_score ?? 0}
          defaultPlayer={match.player_of_match ?? ''}
        />
      ) : null}

      <section className="space-y-3 rounded-2xl border border-border/70 bg-card/60 p-4 shadow-sm">
        <h2 className="font-heading text-lg font-bold tracking-tight">
          Participantes ({members.length})
        </h2>

        {members.length === 0 ? (
          <EmptyState
            icon={<Users className="size-6" />}
            title="Ninguém na sala ainda"
            description="Copie o link acima e mande no grupo da família."
          />
        ) : (
          <ul className="flex flex-col gap-2">
            {members.map((member) => (
              <li key={member.id}>
                <ParticipantRow
                  name={member.users.display_name}
                  fallback={getAvatarFallback(
                    member.users.avatar_key,
                    member.users.display_name
                  )}
                  role={member.role}
                  points={pointsByUser.get(member.user_id) ?? 0}
                  isOnline={member.user_id === userId}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

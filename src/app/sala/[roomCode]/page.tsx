import { Users } from 'lucide-react'
import { notFound } from 'next/navigation'

import { PageSection } from '@/components/layouts/page-section'
import { MatchResultForm } from '@/components/match-result-form'
import { SuccessBanner } from '@/components/success-banner'
import { EmptyState } from '@/components/patterns/empty-state'
import { FixturePicker } from '@/components/patterns/fixture-picker'
import { HostGameControl } from '@/components/patterns/host-game-control'
import { ParticipantRow } from '@/components/patterns/participant-row'
import { QuickReactionBar } from '@/components/patterns/quick-reaction-bar'
import { RoomMatchHero } from '@/components/patterns/room-match-hero'
import { RoomProgressLine } from '@/components/patterns/room-progress-line'
import { RoomCodeDisplay } from '@/components/patterns/room-code-display'
import { ApiSportsGameWidgetPanel } from '@/components/api-sports/api-sports-game-widget-panel'
import { buttonVariants } from '@/components/ui/button'
import { fixtureDisplayTitle } from '@/features/fixtures/format'
import { getWorldCupCatalogFixtures } from '@/features/fixtures/queries'
import {
  assumeRoomHostAction,
  createNextMatchAction,
  promoteCoHostAction,
} from '@/features/rooms/actions'
import { canAssumeRoom } from '@/features/rooms/host-resilience'
import {
  getRoomContext,
  getRoomDashboardData,
  getRoomMatchHistory,
} from '@/features/rooms/queries'
import { ANALYTICS_EVENTS, trackEvent } from '@/lib/analytics'
import { getAvatarFallback } from '@/lib/avatars'
import { getInviteUrl } from '@/lib/invite-url'
import { routes } from '@/lib/routes'
import { getGuestUserId } from '@/lib/session'
import type { MatchStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

type SalaGameBoardPageProps = {
  params: Promise<{ roomCode: string }>
  searchParams: Promise<{
    qr?: string
    statusErro?: string
    resultado?: string
    hostAssumido?: string
    coHost?: string
    proximoJogo?: string
  }>
}

function shouldShowInviteProminent(status: MatchStatus, isOwner: boolean) {
  return status === 'lobby' || (isOwner && status === 'predictions_open')
}

export default async function SalaGameBoardPage({
  params,
  searchParams,
}: SalaGameBoardPageProps) {
  const { roomCode } = await params
  const { qr, statusErro, resultado, hostAssumido, coHost, proximoJogo } =
    await searchParams
  const [context, userId] = await Promise.all([
    getRoomContext(roomCode),
    getGuestUserId(),
  ])

  if (!context) {
    notFound()
  }

  const { room, match, fixture, members, pointsByUser } = context
  const inviteUrl = await getInviteUrl(room.code)
  const currentMember =
    userId != null ? members.find((member) => member.user_id === userId) : null
  const isOwner = currentMember?.role === 'owner' || userId === room.owner_user_id
  const isHost = isOwner || currentMember?.role === 'co_host'
  const canAssumeHost =
    currentMember?.role === 'member' && canAssumeRoom(room.last_host_action_at)
  const dashboard = await getRoomDashboardData(context, userId, isHost)
  const nextMatchFixtures =
    isHost && match.status === 'finished' ? await getWorldCupCatalogFixtures() : []
  const matchHistory = await getRoomMatchHistory(room.id)

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
    isHost &&
    match.status !== 'lobby' &&
    match.status !== 'predictions_open'

  const showInvite = shouldShowInviteProminent(match.status, isOwner)

  return (
    <>
      <RoomMatchHero
        title={match.title}
        status={match.status}
        predictionCount={dashboard.stats.predictionCount}
        memberCount={dashboard.stats.memberCount}
        homeScore={match.home_score}
        awayScore={match.away_score}
        winner={match.winner}
        nextAction={dashboard.nextAction}
        fixture={fixture}
      />

      {matchHistory.length > 1 ? (
        <PageSection
          title="Histórico da sala"
          titleId="historico-sala-heading"
          description="A sala guarda os jogos anteriores e soma o ranking da família."
        >
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            {matchHistory.slice(1, 4).map((historyMatch) => (
              <li
                key={historyMatch.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-card/70 px-3 py-2"
              >
                <span className="font-semibold">{historyMatch.title}</span>
                <span className="text-xs font-medium text-muted-foreground">
                  {historyMatch.status === 'finished' ? 'encerrado' : historyMatch.status}
                </span>
              </li>
            ))}
          </ul>
        </PageSection>
      ) : null}

      {fixture ? (
        <ApiSportsGameWidgetPanel
          providerFixtureId={fixture.provider_fixture_id}
          title={fixtureDisplayTitle(fixture)}
        />
      ) : null}

      {userId != null ? (
        <RoomProgressLine
          roomCode={room.code}
          userPosition={dashboard.userPosition}
          userPoints={dashboard.userPoints}
          currentMatchPoints={dashboard.currentMatchPoints}
        />
      ) : null}

      {userId != null && match.status === 'live' ? (
        <QuickReactionBar matchId={match.id} roomId={room.id} />
      ) : null}

      <PageSection title={`Quem está jogando (${members.length})`} titleId="participants-heading">
        {members.length === 0 ? (
          <EmptyState
            icon={<Users className="size-6" />}
            title="Ninguém na sala ainda"
            description="Convide a família pelo link abaixo."
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
      </PageSection>

      {showInvite ? (
        <div id="convite-sala">
          <RoomCodeDisplay
            roomCode={room.code}
            inviteUrl={inviteUrl}
            salaPath={routes.sala(room.code)}
            showQr={qr === '1'}
          />
        </div>
      ) : null}

      {statusErro ? (
        <p
          className="rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive"
          role="alert"
        >
          {decodeURIComponent(statusErro)}
        </p>
      ) : null}

      {resultado === '1' ? (
        <SuccessBanner
          title="Resultado salvo"
          description="Palpites pontuados. Confira o ranking."
        />
      ) : null}

      {hostAssumido === '1' ? (
        <SuccessBanner
          title="Você assumiu a sala"
          description="Agora você pode conduzir status, intervalo e resultado."
        />
      ) : null}

      {coHost === '1' ? (
        <SuccessBanner
          title="Co-anfitrião promovido"
          description="Essa pessoa já pode ajudar a conduzir a sala."
        />
      ) : null}

      {proximoJogo === '1' ? (
        <SuccessBanner
          title="Próximo jogo criado"
          description="A sala continua com os mesmos participantes."
        />
      ) : null}

      {canAssumeHost ? (
        <PageSection
          title="Anfitrião ausente?"
          titleId="assumir-sala-heading"
          description="Depois de 10 minutos sem ação do anfitrião, um membro pode conduzir a sala."
        >
          <form action={assumeRoomHostAction} className="mt-3">
            <input type="hidden" name="roomId" value={room.id} />
            <input type="hidden" name="roomCode" value={room.code} />
            <button
              type="submit"
              className={cn(
                buttonVariants({ variant: 'outline', size: 'lg' }),
                'min-h-12 w-full'
              )}
            >
              Assumir sala
            </button>
          </form>
        </PageSection>
      ) : null}

      {isHost ? (
        <HostGameControl
          status={match.status}
          matchId={match.id}
          roomId={room.id}
          roomCode={room.code}
          memberCount={dashboard.stats.memberCount}
          predictionCount={dashboard.stats.predictionCount}
          hasMatchResult={hasMatchResult}
        />
      ) : null}

      {isOwner ? (
        <PageSection
          title="Co-anfitriões"
          titleId="co-host-heading"
          description="Promova alguém para ajudar a controlar status, intervalo e resultado."
        >
          <ul className="mt-3 flex flex-col gap-2">
            {members
              .filter((member) => member.role === 'member')
              .map((member) => (
                <li
                  key={member.user_id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-card/70 px-3 py-2"
                >
                  <span className="text-sm font-semibold">
                    {member.users.display_name}
                  </span>
                  <form action={promoteCoHostAction}>
                    <input type="hidden" name="roomId" value={room.id} />
                    <input type="hidden" name="roomCode" value={room.code} />
                    <input type="hidden" name="memberUserId" value={member.user_id} />
                    <button
                      type="submit"
                      className={buttonVariants({ variant: 'outline', size: 'sm' })}
                    >
                      Tornar co-host
                    </button>
                  </form>
                </li>
              ))}
          </ul>
        </PageSection>
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
          winnerSuggestions={dashboard.winnerSuggestions}
          playerSuggestions={dashboard.playerSuggestions}
        />
      ) : null}

      {isHost && match.status === 'finished' && nextMatchFixtures.length > 0 ? (
        <PageSection
          title="Próximo jogo"
          titleId="proximo-jogo-heading"
          description="Escolha outro jogo da Copa e mantenha a mesma sala."
        >
          <form action={createNextMatchAction} className="mt-3 flex flex-col gap-3">
            <input type="hidden" name="roomId" value={room.id} />
            <input type="hidden" name="roomCode" value={room.code} />
            <FixturePicker fixtures={nextMatchFixtures} />
            <button
              type="submit"
              className={cn(
                buttonVariants({ variant: 'party', size: 'lg' }),
                'min-h-12 w-full'
              )}
            >
              Escolher próximo jogo
            </button>
          </form>
        </PageSection>
      ) : null}

      {!showInvite ? (
        <details className="rounded-xl border border-border/70 bg-card/60 px-3 py-2 text-sm">
          <summary className="cursor-pointer font-semibold text-foreground">
            Convidar mais pessoas
          </summary>
          <div className="mt-3">
            <RoomCodeDisplay
              roomCode={room.code}
              inviteUrl={inviteUrl}
              salaPath={routes.sala(room.code)}
              showQr={false}
            />
          </div>
        </details>
      ) : null}
    </>
  )
}

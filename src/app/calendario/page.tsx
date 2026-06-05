import Link from 'next/link'
import { CalendarDays } from 'lucide-react'

import { PageTopBar } from '@/components/layouts/page-top-bar'
import { SiteShell } from '@/components/layouts/site-shell'
import { CalendarioExplorer } from '@/components/patterns/calendario-explorer'
import { EmptyState } from '@/components/patterns/empty-state'
import { WorldCupSummaryStrip } from '@/components/patterns/world-cup-summary-strip'
import { getTodayDateKey } from '@/features/fixtures/format'
import {
  getWorldCupCalendarPageData,
  groupFixturesByKickoffDate,
  pickCalendarFocusDateKey,
} from '@/features/fixtures/queries'
import { buttonVariants } from '@/components/ui/button'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils'

type CalendarioPageProps = {
  searchParams: Promise<{ sala?: string }>
}

function resolveReturnRoomCode(sala: string | undefined): string | null {
  const code = sala?.trim().toUpperCase()
  return code ? code : null
}

export default async function CalendarioPage({ searchParams }: CalendarioPageProps) {
  const { sala } = await searchParams
  const returnRoomCode = resolveReturnRoomCode(sala)

  let pageData: Awaited<ReturnType<typeof getWorldCupCalendarPageData>>
  try {
    pageData = await getWorldCupCalendarPageData()
  } catch {
    return (
      <SiteShell
        ambient="flow"
        mainClassName="cf-scrollbar-hidden flex-1 gap-[var(--site-section-gap)] overflow-x-hidden px-[var(--site-page-px)] pb-8 pt-6"
      >
        {returnRoomCode ? (
          <PageTopBar href={routes.sala(returnRoomCode)} label="Voltar para a sala" />
        ) : null}
        <header className="space-y-3">
          <h1 className="font-heading text-2xl font-black tracking-tight">
            Calendário da Copa 2026
          </h1>
          <p className="text-sm text-muted-foreground">
            Jogos no app — escolha um jogo e abra uma sala para a família em um toque.
          </p>
        </header>

        <EmptyState
          icon={<CalendarDays className="size-6" />}
          title="Calendário indisponível"
          description="Não conseguimos carregar o calendário agora. Tente novamente em instantes."
        />
      </SiteShell>
    )
  }

  const { fixtures, teamGroups, summary } = pageData
  const todayKey = getTodayDateKey()
  const dateGroups = groupFixturesByKickoffDate(fixtures, { todayKey })
  const focusDateKey = pickCalendarFocusDateKey(dateGroups, todayKey)

  return (
    <SiteShell
      ambient="flow"
      mainClassName="cf-scrollbar-hidden flex-1 gap-[var(--site-section-gap)] overflow-x-hidden px-[var(--site-page-px)] pb-8 pt-6"
    >
      {returnRoomCode ? (
        <PageTopBar href={routes.sala(returnRoomCode)} label="Voltar para a sala" />
      ) : null}
      <header className="space-y-3">
        <h1 className="font-heading text-2xl font-black tracking-tight">
          Calendário da Copa 2026
        </h1>
        <p className="text-sm text-muted-foreground">
          {returnRoomCode
            ? 'Consulte horários e placares. Para trocar o jogo da sua sala, volte e use “Próximo jogo” quando a partida terminar.'
            : 'Por dia ou tabela completa da Copa — escolha um jogo e abra uma sala para a família em um toque.'}
        </p>
        {fixtures.length > 0 ? (
          <WorldCupSummaryStrip
            fixtureCount={summary.fixtureCount}
            groupCount={summary.groupCount}
            venueCount={summary.venueCount}
            daysUntilKickoff={summary.daysUntilKickoff}
          />
        ) : null}
        {!returnRoomCode ? (
          <div className="flex flex-wrap gap-2">
            <Link
              href={routes.criarSala}
              className={cn(buttonVariants({ variant: 'party' }), 'inline-flex min-h-11')}
            >
              Criar nova sala
            </Link>
            <Link
              href={routes.entrar}
              className={cn(buttonVariants({ variant: 'outline' }), 'inline-flex min-h-11')}
            >
              Adicionar a sala existente
            </Link>
          </div>
        ) : null}
      </header>

      {fixtures.length === 0 ? (
        <EmptyState
          icon={<CalendarDays className="size-6" />}
          title="Nenhum jogo no calendário"
          description="Peça ao administrador para sincronizar os jogos da Copa em /admin/catalogo."
        />
      ) : (
        <CalendarioExplorer
          fixtures={fixtures}
          dateGroups={dateGroups}
          focusDateKey={focusDateKey}
          teamGroups={teamGroups}
          showCreateRoomCta={!returnRoomCode}
        />
      )}
    </SiteShell>
  )
}

import Link from 'next/link'
import { CalendarDays } from 'lucide-react'

import { PageSection } from '@/components/layouts/page-section'
import { SiteShell } from '@/components/layouts/site-shell'
import { EmptyState } from '@/components/patterns/empty-state'
import { FixtureRow } from '@/components/patterns/fixture-row'
import { WorldCupSummaryStrip } from '@/components/patterns/world-cup-summary-strip'
import {
  getWorldCupCalendarPageData,
  groupFixturesByKickoffDate,
} from '@/features/fixtures/queries'
import { WorldCupTeamsPanel } from '@/components/patterns/world-cup-teams-panel'
import { buttonVariants } from '@/components/ui/button'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils'

export default async function CalendarioPage() {
  let pageData: Awaited<ReturnType<typeof getWorldCupCalendarPageData>>
  try {
    pageData = await getWorldCupCalendarPageData()
  } catch {
    return (
      <SiteShell
        ambient="flow"
        mainClassName="cf-scrollbar-hidden flex-1 gap-[var(--site-section-gap)] overflow-x-hidden px-[var(--site-page-px)] pb-8 pt-6"
      >
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
          description="Não conseguimos carregar o catálogo agora. Tente novamente ou valide o sync em /admin/catalogo."
        />
      </SiteShell>
    )
  }

  const { fixtures, teamGroups, summary } = pageData
  const dateGroups = groupFixturesByKickoffDate(fixtures)

  return (
    <SiteShell
      ambient="flow"
      mainClassName="cf-scrollbar-hidden flex-1 gap-[var(--site-section-gap)] overflow-x-hidden px-[var(--site-page-px)] pb-8 pt-6"
    >
      <header className="space-y-3">
        <h1 className="font-heading text-2xl font-black tracking-tight">
          Calendário da Copa 2026
        </h1>
        <p className="text-sm text-muted-foreground">
          Jogos no app — escolha um jogo e abra uma sala para a família em um toque.
        </p>
        {fixtures.length > 0 ? (
          <WorldCupSummaryStrip
            fixtureCount={summary.fixtureCount}
            groupCount={summary.groupCount}
            venueCount={summary.venueCount}
            daysUntilKickoff={summary.daysUntilKickoff}
          />
        ) : null}
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
      </header>

      <WorldCupTeamsPanel groups={teamGroups} />

      {fixtures.length === 0 ? (
        <EmptyState
          icon={<CalendarDays className="size-6" />}
          title="Nenhum jogo no calendário"
          description="Peça ao administrador para sincronizar os jogos da Copa em /admin/catalogo."
        />
      ) : (
        dateGroups.map((group) => (
          <PageSection key={group.dateKey} title={group.label}>
            <ul className="flex flex-col gap-3">
              {group.fixtures.map((fixture) => (
                <li key={fixture.id}>
                  <FixtureRow fixture={fixture} />
                </li>
              ))}
            </ul>
          </PageSection>
        ))
      )}
    </SiteShell>
  )
}

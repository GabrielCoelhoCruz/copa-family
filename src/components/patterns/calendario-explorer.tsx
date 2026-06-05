'use client'

import { CalendarDays, TableProperties } from 'lucide-react'

import { CalendarDayTags } from '@/components/patterns/calendar-day-tags'
import { FixtureDayGroup } from '@/components/patterns/fixture-row'
import { WorldCupScheduleTable } from '@/components/patterns/world-cup-schedule-table'
import { WorldCupTeamsPanel } from '@/components/patterns/world-cup-teams-panel'
import { PageSection } from '@/components/layouts/page-section'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { CatalogFixtureView } from '@/features/fixtures/catalog-view'
import {
  getFixtureDateSectionId,
  type FixtureDateGroup,
} from '@/features/fixtures/calendar-groups'
import type { TeamGroup } from '@/lib/types'

type CalendarioExplorerProps = {
  fixtures: CatalogFixtureView[]
  dateGroups: FixtureDateGroup[]
  focusDateKey: string | null
  teamGroups: TeamGroup[]
  showCreateRoomCta?: boolean
}

function CalendarioExplorer({
  fixtures,
  dateGroups,
  focusDateKey,
  teamGroups,
  showCreateRoomCta = true,
}: CalendarioExplorerProps) {
  return (
    <Tabs defaultValue="dia" className="gap-[var(--site-section-gap)]">
      <TabsList className="grid h-auto w-full grid-cols-2">
        <TabsTrigger value="dia" className="min-h-11 gap-1.5">
          <CalendarDays className="size-4" aria-hidden />
          Por dia
        </TabsTrigger>
        <TabsTrigger value="tabela" className="min-h-11 gap-1.5">
          <TableProperties className="size-4" aria-hidden />
          Tabela da Copa
        </TabsTrigger>
      </TabsList>

      <TabsContent value="dia" className="space-y-[var(--site-section-gap)]">
        <WorldCupTeamsPanel groups={teamGroups} />
        <CalendarDayTags groups={dateGroups} focusDateKey={focusDateKey} />
        {dateGroups.map((group) => (
          <div
            key={group.dateKey}
            id={getFixtureDateSectionId(group.dateKey)}
            className="scroll-mt-24"
          >
            <FixtureDayGroup
              label={group.label}
              fixtures={group.fixtures}
              showCreateRoomCta={showCreateRoomCta}
            />
          </div>
        ))}
      </TabsContent>

      <TabsContent value="tabela" className="space-y-[var(--site-section-gap)]">
        <PageSection
          variant="plain"
          title="Todos os jogos"
          description="Horários, placares e fases da Copa. Use os filtros para achar jogos do seu grupo."
        >
          <WorldCupScheduleTable fixtures={fixtures} showCreateRoomCta={showCreateRoomCta} />
        </PageSection>
        <WorldCupTeamsPanel groups={teamGroups} />
      </TabsContent>
    </Tabs>
  )
}

export { CalendarioExplorer }

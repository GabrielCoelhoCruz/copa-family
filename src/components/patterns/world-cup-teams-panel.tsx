import { TeamBadge } from '@/components/patterns/team-badge'
import { isKnockoutPlaceholderName } from '@/features/fixtures/normalize'
import type { TeamGroup } from '@/lib/types'
import { cn } from '@/lib/utils'

type WorldCupTeamsPanelProps = {
  groups: TeamGroup[]
}

function WorldCupTeamsPanel({ groups }: WorldCupTeamsPanelProps) {
  if (groups.length === 0) return null

  return (
    <section aria-labelledby="selecoes-heading" className="space-y-4">
      <h2 id="selecoes-heading" className="font-heading text-lg font-bold tracking-tight">
        Seleções
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {groups.map((group) => (
          <div
            key={group.groupName}
            className="rounded-xl border border-border/70 bg-card/80 p-3"
          >
            <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
              {group.groupName}
            </h3>
            <ul className="flex flex-col gap-2">
              {group.teams.map((team) => {
                const placeholder = isKnockoutPlaceholderName(team.name)
                return (
                  <li key={team.id} className="flex items-center gap-2">
                    <TeamBadge
                      name={team.name}
                      badgeUrl={team.badge_url ?? team.flag_url}
                      size="sm"
                    />
                    <span
                      className={cn(
                        'text-sm font-medium',
                        placeholder ? 'text-muted-foreground italic' : 'text-foreground'
                      )}
                    >
                      {team.name}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

export { WorldCupTeamsPanel }

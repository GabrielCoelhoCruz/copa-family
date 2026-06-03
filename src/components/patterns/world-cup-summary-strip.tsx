import { CalendarDays, Flag, MapPin, Users } from 'lucide-react'

type WorldCupSummaryStripProps = {
  fixtureCount: number
  groupCount: number
  venueCount: number
  daysUntilKickoff: number | null
}

function WorldCupSummaryStrip({
  fixtureCount,
  groupCount,
  venueCount,
  daysUntilKickoff,
}: WorldCupSummaryStripProps) {
  const kickoffLabel =
    daysUntilKickoff == null
      ? 'Calendário publicado'
      : daysUntilKickoff === 0
        ? 'Começa hoje'
        : `Começa em ${daysUntilKickoff} dia${daysUntilKickoff === 1 ? '' : 's'}`

  const items = [
    { icon: CalendarDays, label: `${fixtureCount} jogos` },
    { icon: Users, label: `${groupCount} grupos` },
    { icon: MapPin, label: `${venueCount} sedes` },
    { icon: Flag, label: kickoffLabel },
  ] as const

  return (
    <div
      className="grid grid-cols-2 gap-2 rounded-2xl border border-brand-field/20 bg-gradient-to-br from-brand-field/10 via-card to-card p-3 sm:grid-cols-4"
      role="list"
      aria-label="Resumo da Copa 2026"
    >
      {items.map(({ icon: Icon, label }) => (
        <div
          key={label}
          role="listitem"
          className="flex flex-col items-center gap-1 rounded-xl bg-card/60 px-2 py-2 text-center"
        >
          <Icon className="size-4 text-brand-field" aria-hidden />
          <span className="text-xs font-semibold leading-tight text-foreground sm:text-sm">
            {label}
          </span>
        </div>
      ))}
    </div>
  )
}

export { WorldCupSummaryStrip }

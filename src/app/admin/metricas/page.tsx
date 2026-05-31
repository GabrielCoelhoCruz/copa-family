import { BarChart3 } from 'lucide-react'
import { notFound } from 'next/navigation'

import { EmptyState } from '@/components/patterns/empty-state'
import { getMvpMetrics } from '@/features/rooms/queries'

export const dynamic = 'force-dynamic'

export default async function AdminMetricasPage() {
  if (process.env.ENABLE_ADMIN_METRICS !== 'true') {
    notFound()
  }

  let metrics: Awaited<ReturnType<typeof getMvpMetrics>> = []
  try {
    metrics = await getMvpMetrics()
  } catch {
    return (
      <EmptyState
        icon={<BarChart3 className="size-6" />}
        title="Métricas indisponíveis"
        description="Confira se a migration 002 (analytics_events) foi aplicada no Supabase."
      />
    )
  }

  const total = metrics.reduce((sum, row) => sum + row.count, 0)

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col gap-4 p-4">
      <header>
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          Métricas MVP
        </h1>
        <p className="text-sm text-muted-foreground">
          Somente desenvolvimento (`ENABLE_ADMIN_METRICS=true`). Total: {total}{' '}
          eventos.
        </p>
      </header>

      {metrics.length === 0 ? (
        <EmptyState
          icon={<BarChart3 className="size-6" />}
          title="Nenhum evento ainda"
          description="Use o app (criar sala, palpite, QR, ranking) para popular analytics_events."
        />
      ) : (
        <ul className="flex flex-col gap-2">
          {metrics.map((row) => (
            <li
              key={row.eventName}
              className="flex items-center justify-between rounded-xl border border-border/70 bg-card px-3 py-2 text-sm"
            >
              <span className="font-mono text-xs">{row.eventName}</span>
              <span className="font-semibold tabular-nums">{row.count}</span>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

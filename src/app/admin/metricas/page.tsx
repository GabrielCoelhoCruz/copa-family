import Link from 'next/link'
import { BarChart3 } from 'lucide-react'

import { PageSection } from '@/components/layouts/page-section'
import { PageStack } from '@/components/layouts/page-stack'
import { SiteShell } from '@/components/layouts/site-shell'
import { EmptyState } from '@/components/patterns/empty-state'
import { getMvpMetrics } from '@/features/rooms/queries'
import {
  buildAnalyticsFunnel,
  calculateFunnelRate,
  calculateReturnRate,
} from '@/lib/analytics-funnel'
import { assertAdminMetricsPageEnabled } from '@/lib/admin/metrics-gate'
import { ANALYTICS_EVENTS } from '@/lib/analytics'
import { routes } from '@/lib/routes'

export const dynamic = 'force-dynamic'

export default async function AdminMetricasPage() {
  assertAdminMetricsPageEnabled()

  let metrics: Awaited<ReturnType<typeof getMvpMetrics>> = []
  try {
    metrics = await getMvpMetrics()
  } catch {
    return (
      <SiteShell ambient="none" mainClassName="p-[var(--site-page-px)] pt-6">
        <EmptyState
          icon={<BarChart3 className="size-6" />}
          title="Métricas indisponíveis"
          description="Confira se a migration 002 (analytics_events) foi aplicada no Supabase."
        />
      </SiteShell>
    )
  }

  const funnel = buildAnalyticsFunnel(metrics)
  const total = metrics.reduce((sum, row) => sum + row.count, 0)
  const maxFunnel = Math.max(...funnel.map((step) => step.count), 1)
  const counts = new Map(metrics.map((row) => [row.eventName, row.count]))
  const hostCompletionRate = calculateFunnelRate(funnel, 'rooms', 'results')
  const returnRate = calculateReturnRate({
    returned: counts.get(ANALYTICS_EVENTS.rankingViewed) ?? 0,
    eligible: counts.get(ANALYTICS_EVENTS.roomJoined) ?? 0,
  })

  return (
    <SiteShell
      ambient="none"
      mainClassName="gap-[var(--site-section-gap)] p-[var(--site-page-px)] pb-8 pt-6"
    >
      <PageStack>
        <header>
          <h1 className="font-heading text-2xl font-bold tracking-tight">
            Métricas MVP
          </h1>
          <p className="text-sm text-muted-foreground">
            Funil de validação. {total} eventos no total
          </p>
          <p className="text-xs text-muted-foreground">
            <Link
              href={routes.adminCatalogo}
              className="font-semibold text-brand-field underline-offset-2 hover:underline"
            >
              Catálogo da Copa
            </Link>
          </p>
        </header>

        {metrics.length === 0 ? (
          <EmptyState
            icon={<BarChart3 className="size-6" />}
            title="Nenhum evento ainda"
            description="Use o app (criar sala, palpite, QR, ranking) para popular analytics_events."
          />
        ) : (
          <>
            <PageSection title="Funil North Star" titleId="funnel-heading" variant="elevated">
              <div className="mb-4 grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-border/70 bg-background/70 px-3 py-3">
                  <p className="text-xs font-medium text-muted-foreground">
                    Host completion
                  </p>
                  <p className="font-heading text-2xl font-black">
                    {hostCompletionRate}%
                  </p>
                  <p className="text-xs text-muted-foreground">
                    salas criadas → resultado
                  </p>
                </div>
                <div className="rounded-xl border border-border/70 bg-background/70 px-3 py-3">
                  <p className="text-xs font-medium text-muted-foreground">Retorno</p>
                  <p className="font-heading text-2xl font-black">{returnRate}%</p>
                  <p className="text-xs text-muted-foreground">
                    entradas → ranking visto
                  </p>
                </div>
              </div>
              <ul className="mt-4 flex flex-col gap-3">
                {funnel.map((step) => {
                  const width = Math.max(8, (step.count / maxFunnel) * 100)
                  return (
                    <li key={step.id}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="font-medium">{step.label}</span>
                        <span className="font-semibold tabular-nums">{step.count}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-brand-field transition-[width] duration-[var(--duration-base)]"
                          style={{ width: `${width}%` }}
                        />
                      </div>
                    </li>
                  )
                })}
              </ul>
            </PageSection>

            <PageSection title="Eventos brutos" titleId="raw-events-heading" variant="plain">
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
            </PageSection>
          </>
        )}
      </PageStack>
    </SiteShell>
  )
}

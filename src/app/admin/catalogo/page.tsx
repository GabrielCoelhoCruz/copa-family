import Link from 'next/link'
import { Database } from 'lucide-react'

import { PageSection } from '@/components/layouts/page-section'
import { PageStack } from '@/components/layouts/page-stack'
import { SiteShell } from '@/components/layouts/site-shell'
import { CatalogAdminActions } from '@/components/patterns/catalog-admin-actions'
import { EmptyState } from '@/components/patterns/empty-state'
import { getCatalogAdminSnapshot } from '@/features/fixtures/admin-queries'
import { formatSyncTime } from '@/features/fixtures/format'
import {
  assertAdminMetricsPageEnabled,
  getCatalogAdminSyncToken,
} from '@/lib/admin/metrics-gate'
import { routes } from '@/lib/routes'

export const dynamic = 'force-dynamic'

export default async function AdminCatalogoPage() {
  assertAdminMetricsPageEnabled()

  let snapshot: Awaited<ReturnType<typeof getCatalogAdminSnapshot>>
  try {
    snapshot = await getCatalogAdminSnapshot()
  } catch {
    return (
      <SiteShell ambient="none" mainClassName="p-[var(--site-page-px)] pt-6">
        <EmptyState
          icon={<Database className="size-6" />}
          title="Catálogo indisponível"
          description="Confira SUPABASE_SERVICE_ROLE_KEY e se a migration 005 foi aplicada."
        />
      </SiteShell>
    )
  }

  let syncToken: string
  try {
    syncToken = getCatalogAdminSyncToken()
  } catch {
    return (
      <SiteShell ambient="none" mainClassName="p-[var(--site-page-px)] pt-6">
        <EmptyState
          icon={<Database className="size-6" />}
          title="Token de sync ausente"
          description="Configure FIXTURE_SYNC_TOKEN no .env.local para habilitar ações de catálogo."
        />
      </SiteShell>
    )
  }

  const cards = [
    { label: 'Jogos', value: snapshot.fixtureCount },
    { label: 'Seleções (DB)', value: snapshot.teamCount },
    { label: 'Seleções reais', value: snapshot.realTeamCount },
    { label: 'Sedes', value: snapshot.venueCount },
    { label: 'Grupos', value: snapshot.groupCount },
    { label: 'Bandeiras', value: snapshot.teamsWithBadge },
  ]

  return (
    <SiteShell
      ambient="none"
      mainClassName="gap-[var(--site-section-gap)] p-[var(--site-page-px)] pb-8 pt-6"
    >
      <PageStack>
        <header className="space-y-2">
          <h1 className="font-heading text-2xl font-bold tracking-tight">
            Catálogo da Copa
          </h1>
          <p className="text-sm text-muted-foreground">
            Status do sync no Supabase. Nenhuma chave de API é exibida aqui.
          </p>
          <p className="text-xs text-muted-foreground">
            <Link
              href={routes.calendario}
              className="font-semibold text-brand-field underline-offset-2 hover:underline"
            >
              Ver calendário público
            </Link>
            {' · '}
            <Link
              href={routes.adminMetricas}
              className="font-semibold text-brand-field underline-offset-2 hover:underline"
            >
              Métricas MVP
            </Link>
          </p>
        </header>

        <PageSection title="Resumo" titleId="catalog-summary" variant="elevated">
          <p className="text-sm text-muted-foreground">
            Provider ativo:{' '}
            <span className="font-mono font-semibold text-foreground">
              {snapshot.provider}
            </span>
          </p>
          <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {cards.map((card) => (
              <li
                key={card.label}
                className="rounded-xl border border-border/70 bg-card px-3 py-3"
              >
                <p className="text-xs text-muted-foreground">{card.label}</p>
                <p className="font-heading text-2xl font-black tabular-nums">
                  {card.value}
                </p>
              </li>
            ))}
          </ul>
        </PageSection>

        <PageSection title="Último sync" titleId="catalog-last-sync" variant="plain">
          {snapshot.lastSync ? (
            <dl className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">Status</dt>
                <dd className="font-semibold">{snapshot.lastSync.status}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">Provider / modo</dt>
                <dd className="font-mono text-xs">
                  {snapshot.lastSync.provider} · {snapshot.lastSync.mode}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">Linhas</dt>
                <dd className="tabular-nums">{snapshot.lastSync.rowsUpserted}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">Início</dt>
                <dd>{formatSyncTime(snapshot.lastSync.startedAt)}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">Fim</dt>
                <dd>{formatSyncTime(snapshot.lastSync.completedAt)}</dd>
              </div>
              {snapshot.lastSync.errorMessage ? (
                <p className="text-destructive">{snapshot.lastSync.errorMessage}</p>
              ) : null}
            </dl>
          ) : (
            <p className="text-sm text-muted-foreground">Nenhuma execução registrada ainda.</p>
          )}
        </PageSection>

        <PageSection title="Variáveis de ambiente" titleId="catalog-env" variant="plain">
          <ul className="flex flex-col gap-2">
            {snapshot.envChecks.map((check) => (
              <li
                key={check.key}
                className="flex items-center justify-between rounded-xl border border-border/70 bg-card px-3 py-2 text-sm"
              >
                <span>
                  <span className="font-medium">{check.label}</span>
                  <span className="ml-2 font-mono text-xs text-muted-foreground">
                    {check.key}
                  </span>
                </span>
                <span
                  className={
                    check.configured
                      ? 'text-xs font-semibold text-brand-field'
                      : 'text-xs font-semibold text-destructive'
                  }
                >
                  {check.configured ? 'OK' : 'Ausente'}
                </span>
              </li>
            ))}
          </ul>
        </PageSection>

        <PageSection title="Ações" titleId="catalog-actions" variant="elevated">
          <p className="mb-3 text-sm text-muted-foreground">
            Sincroniza jogos e seleções via RapidAPI WC26 (servidor). Bandeiras usam
            flagcdn sem quota externa.
          </p>
          <CatalogAdminActions syncToken={syncToken} />
        </PageSection>
      </PageStack>
    </SiteShell>
  )
}

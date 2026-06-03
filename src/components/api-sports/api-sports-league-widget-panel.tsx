'use client'

import { ApiSportsConfig } from '@/components/api-sports/api-sports-config'
import {
  WORLD_CUP_LEAGUE_ID,
  WORLD_CUP_SEASON,
} from '@/features/fixtures/constants'
import { useApiSportsScript } from '@/components/api-sports/use-api-sports-script'
import { PageSection } from '@/components/layouts/page-section'

function readWidgetConfig(): { enabled: boolean; key: string | undefined } {
  const enabled = process.env.NEXT_PUBLIC_ENABLE_API_SPORTS_WIDGETS === 'true'
  const key = process.env.NEXT_PUBLIC_API_SPORTS_WIDGET_KEY?.trim()
  return { enabled, key: key || undefined }
}

function ApiSportsLeagueWidgetPanel() {
  const { enabled, key } = readWidgetConfig()
  const ready = useApiSportsScript(enabled && Boolean(key))

  if (!enabled || !key) return null

  return (
    <PageSection
      title="Referência API-Sports"
      description="Painel opcional. Consome requisições da sua cota quando ativado."
    >
      <details className="rounded-xl border border-border/70 bg-card/60">
        <summary className="cursor-pointer px-3 py-2.5 text-sm font-semibold">
          Ver calendário ao vivo (widget)
        </summary>
        <div className="min-h-[200px] border-t border-border/70 p-2">
          <ApiSportsConfig widgetKey={key} />
          {ready ? (
            <api-sports-widget
              data-type="league"
              data-league={String(WORLD_CUP_LEAGUE_ID)}
              data-season={String(WORLD_CUP_SEASON)}
              data-refresh="false"
              data-standings="true"
            />
          ) : (
            <p className="p-3 text-sm text-muted-foreground">Carregando widget…</p>
          )}
        </div>
      </details>
    </PageSection>
  )
}

export { ApiSportsLeagueWidgetPanel }

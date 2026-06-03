'use client'

import { useApiSportsScript } from '@/components/api-sports/use-api-sports-script'
type ApiSportsConfigProps = {
  widgetKey: string
}

function ApiSportsConfig({ widgetKey }: ApiSportsConfigProps) {
  const ready = useApiSportsScript(true)

  if (!ready) return null

  return (
    <api-sports-widget
      data-type="config"
      data-key={widgetKey}
      data-sport="football"
      data-lang="en"
      data-theme="grey"
      data-timezone="America/Sao_Paulo"
      data-show-logos="true"
      data-show-errors="false"
      data-refresh="false"
    />
  )
}

export { ApiSportsConfig }

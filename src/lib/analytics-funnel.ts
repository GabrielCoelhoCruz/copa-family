import { ANALYTICS_EVENTS } from '@/lib/analytics'

export type FunnelStep = {
  id: string
  label: string
  eventName: string
  count: number
}

const FUNNEL_STEPS = [
  { id: 'rooms', label: 'Salas criadas', eventName: ANALYTICS_EVENTS.roomCreated },
  { id: 'joins', label: 'Entradas na sala', eventName: ANALYTICS_EVENTS.roomJoined },
  {
    id: 'predictions',
    label: 'Palpites enviados',
    eventName: ANALYTICS_EVENTS.predictionSubmitted,
  },
  { id: 'qr', label: 'QR aberto', eventName: ANALYTICS_EVENTS.qrOpened },
  {
    id: 'halftime',
    label: 'Intervalos abertos',
    eventName: ANALYTICS_EVENTS.halftimeStarted,
  },
  {
    id: 'copa-pare',
    label: 'Copa Pare',
    eventName: ANALYTICS_EVENTS.copaPareSubmitted,
  },
  {
    id: 'ranking',
    label: 'Ranking visto',
    eventName: ANALYTICS_EVENTS.rankingViewed,
  },
  {
    id: 'results',
    label: 'Resultados salvos',
    eventName: ANALYTICS_EVENTS.matchResultSubmitted,
  },
] as const

export function buildAnalyticsFunnel(
  metrics: { eventName: string; count: number }[]
): FunnelStep[] {
  const counts = new Map(metrics.map((row) => [row.eventName, row.count]))

  return FUNNEL_STEPS.map((step) => ({
    ...step,
    count: counts.get(step.eventName) ?? 0,
  }))
}

export function calculateReturnRate({
  returned,
  eligible,
}: {
  returned: number
  eligible: number
}): number {
  if (eligible <= 0) return 0
  return Math.round((returned / eligible) * 100)
}

export function calculateFunnelRate(
  funnel: FunnelStep[],
  fromId: string,
  toId: string
): number {
  const from = funnel.find((step) => step.id === fromId)?.count ?? 0
  const to = funnel.find((step) => step.id === toId)?.count ?? 0
  return calculateReturnRate({ returned: to, eligible: from })
}

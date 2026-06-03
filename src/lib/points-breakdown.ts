import { BADGE_DEFINITIONS } from '@/lib/badges'
import { POINTS } from '@/features/points/rules'

export type PointsSource =
  | 'prediction_submitted'
  | 'match_winner_correct'
  | 'match_player_correct'
  | 'match_exact_score'
  | 'copa_pare_participation'

export type PointsBreakdownRow = {
  source: PointsSource
  label: string
  amount: number
  count: number
  detail?: string
}

const POINTS_SOURCE_ORDER: PointsSource[] = [
  'prediction_submitted',
  'match_winner_correct',
  'match_player_correct',
  'match_exact_score',
  'copa_pare_participation',
]

const SOURCE_META: Record<PointsSource, { label: string; unitAmount: number }> = {
  prediction_submitted: {
    label: 'Palpite enviado',
    unitAmount: POINTS.predictionSubmitted,
  },
  match_winner_correct: {
    label: 'Vencedor certo',
    unitAmount: POINTS.winnerCorrect,
  },
  match_player_correct: {
    label: 'Craque certo',
    unitAmount: POINTS.playerOfMatchCorrect,
  },
  match_exact_score: {
    label: 'Placar exato',
    unitAmount: POINTS.exactScore,
  },
  copa_pare_participation: {
    label: 'Copa Pare',
    unitAmount: POINTS.copaPareParticipation,
  },
}

function isPointsSource(value: string): value is PointsSource {
  return value in SOURCE_META
}

export function buildPointsBreakdown(
  rows: { source: string; amount: number; metadata?: unknown }[]
): PointsBreakdownRow[] {
  const grouped = new Map<
    PointsSource,
    { amount: number; count: number; details: string[] }
  >()

  for (const row of rows) {
    if (!isPointsSource(row.source)) continue
    const current = grouped.get(row.source) ?? { amount: 0, count: 0, details: [] }
    const detail = pointsMetadataDetail(row.metadata)
    grouped.set(row.source, {
      amount: current.amount + row.amount,
      count: current.count + 1,
      details: detail ? [...current.details, detail] : current.details,
    })
  }

  return POINTS_SOURCE_ORDER.filter((source) => grouped.has(source)).map((source) => {
    const meta = SOURCE_META[source]
    const data = grouped.get(source)!
    return {
      source,
      label: meta.label,
      amount: data.amount,
      count: data.count,
      detail: data.details.at(-1),
    }
  })
}

export function getLockedBadgesCount(earnedCount: number) {
  return Math.max(0, BADGE_DEFINITIONS.length - earnedCount)
}

function pointsMetadataDetail(metadata: unknown) {
  if (!metadata || typeof metadata !== 'object') return undefined
  const value = metadata as { multiplier?: unknown; streakLength?: unknown }
  if (value.multiplier !== 1 && typeof value.multiplier === 'number') {
    return `x${value.multiplier.toLocaleString('pt-BR')} sequência ${value.streakLength ?? ''}`.trim()
  }
  if (typeof value.streakLength === 'number' && value.streakLength >= 2) {
    return `${value.streakLength} acertos seguidos`
  }
  return undefined
}

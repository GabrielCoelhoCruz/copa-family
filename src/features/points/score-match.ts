import { POINTS, SCORING_RULES_VERSION } from '@/features/points/rules'

const SCORING_SOURCES = [
  'match_winner_correct',
  'match_player_correct',
  'match_exact_score',
] as const

type MatchResult = {
  winner: string
  homeScore: number
  awayScore: number
  playerOfMatch: string
}

type PredictionRow = {
  user_id: string
  winner: string | null
  home_score: number | null
  away_score: number | null
  player_of_match: string | null
}

type PriorPredictionResult = {
  winner: string | null
  resultWinner: string | null
}

export type CalculatedPointRow = {
  room_id: string
  match_id: string
  user_id: string
  source: (typeof SCORING_SOURCES)[number]
  amount: number
  metadata: Record<string, unknown>
}

function normalizeText(value: string) {
  return value.trim().toLowerCase()
}

function textsMatch(left: string | null, right: string | null) {
  if (!left || !right) return false
  return normalizeText(left) === normalizeText(right)
}

export function calculateWinnerStreak(results: PriorPredictionResult[]) {
  let streak = 0

  for (const result of results) {
    if (textsMatch(result.winner, result.resultWinner)) {
      streak += 1
      continue
    }
    streak = 0
  }

  return streak
}

export function calculateMatchPointRows({
  roomId,
  matchId,
  predictions,
  result,
  previousWinnerStreaks = new Map<string, number>(),
}: {
  roomId: string
  matchId: string
  predictions: PredictionRow[]
  result: MatchResult
  previousWinnerStreaks?: Map<string, number>
}): CalculatedPointRow[] {
  const inserts: CalculatedPointRow[] = []
  const normalizedWinner = normalizeText(result.winner)
  const normalizedPlayer = normalizeText(result.playerOfMatch)

  for (const prediction of predictions) {
    const winnerCorrect =
      prediction.winner != null && normalizeText(prediction.winner) === normalizedWinner
    const streakLength = winnerCorrect
      ? (previousWinnerStreaks.get(prediction.user_id) ?? 0) + 1
      : 0
    const multiplier =
      winnerCorrect && streakLength >= 3 ? POINTS.streakMultiplier : 1

    if (winnerCorrect) {
      inserts.push({
        room_id: roomId,
        match_id: matchId,
        user_id: prediction.user_id,
        source: 'match_winner_correct',
        amount: POINTS.winnerCorrect * multiplier,
        metadata: {
          rule: 'winner_correct',
          rulesVersion: SCORING_RULES_VERSION,
          baseAmount: POINTS.winnerCorrect,
          multiplier,
          streakLength,
        },
      })
    }

    if (
      prediction.player_of_match &&
      normalizeText(prediction.player_of_match) === normalizedPlayer
    ) {
      inserts.push({
        room_id: roomId,
        match_id: matchId,
        user_id: prediction.user_id,
        source: 'match_player_correct',
        amount: POINTS.playerOfMatchCorrect,
        metadata: {
          rule: 'player_of_match_correct',
          rulesVersion: SCORING_RULES_VERSION,
          baseAmount: POINTS.playerOfMatchCorrect,
          multiplier: 1,
        },
      })
    }

    if (
      prediction.home_score === result.homeScore &&
      prediction.away_score === result.awayScore
    ) {
      inserts.push({
        room_id: roomId,
        match_id: matchId,
        user_id: prediction.user_id,
        source: 'match_exact_score',
        amount: POINTS.exactScore,
        metadata: {
          rule: 'exact_score',
          rulesVersion: SCORING_RULES_VERSION,
          baseAmount: POINTS.exactScore,
          multiplier: 1,
        },
      })
    }
  }

  return inserts
}

export async function applyMatchScoring(
  supabase: Awaited<ReturnType<typeof import('@/lib/supabase/server').createClient>>,
  {
    roomId,
    matchId,
    result,
  }: {
    roomId: string
    matchId: string
    result: MatchResult
  }
) {
  await supabase
    .from('points')
    .delete()
    .eq('match_id', matchId)
    .in('source', [...SCORING_SOURCES])

  const { data: predictions, error } = await supabase
    .from('predictions')
    .select('user_id, winner, home_score, away_score, player_of_match')
    .eq('match_id', matchId)

  if (error) throw error

  const rows = (predictions ?? []) as PredictionRow[]
  const previousWinnerStreaks = await getPreviousWinnerStreaks(supabase, {
    roomId,
    matchId,
    userIds: rows.map((prediction) => prediction.user_id),
  })
  const inserts = calculateMatchPointRows({
    roomId,
    matchId,
    predictions: rows,
    result,
    previousWinnerStreaks,
  })

  if (inserts.length > 0) {
    const { error: insertError } = await supabase.from('points').insert(inserts)
    if (insertError) throw insertError
  }

  return inserts.length
}

async function getPreviousWinnerStreaks(
  supabase: Awaited<ReturnType<typeof import('@/lib/supabase/server').createClient>>,
  {
    roomId,
    matchId,
    userIds,
  }: {
    roomId: string
    matchId: string
    userIds: string[]
  }
) {
  const uniqueUserIds = [...new Set(userIds)]
  const streaks = new Map<string, number>()
  if (uniqueUserIds.length === 0) return streaks

  const { data: matches, error: matchesError } = await supabase
    .from('matches')
    .select('id, winner, created_at')
    .eq('room_id', roomId)
    .not('winner', 'is', null)
    .neq('id', matchId)
    .order('created_at', { ascending: true })

  if (matchesError) throw matchesError

  const matchIds = (matches ?? []).map((match) => match.id)
  if (matchIds.length === 0) return streaks

  const { data: predictions, error: predictionsError } = await supabase
    .from('predictions')
    .select('match_id, user_id, winner')
    .in('match_id', matchIds)
    .in('user_id', uniqueUserIds)

  if (predictionsError) throw predictionsError

  const predictionsByUserMatch = new Map<string, string | null>()
  for (const prediction of predictions ?? []) {
    predictionsByUserMatch.set(
      `${prediction.user_id}:${prediction.match_id}`,
      prediction.winner
    )
  }

  for (const userId of uniqueUserIds) {
    const history = (matches ?? []).map((match) => ({
      winner: predictionsByUserMatch.get(`${userId}:${match.id}`) ?? null,
      resultWinner: match.winner,
    }))
    streaks.set(userId, calculateWinnerStreak(history))
  }

  return streaks
}

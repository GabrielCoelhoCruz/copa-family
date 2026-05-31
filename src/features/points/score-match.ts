import { POINTS } from '@/features/points/rules'

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

function normalizeText(value: string) {
  return value.trim().toLowerCase()
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
  const inserts: {
    room_id: string
    match_id: string
    user_id: string
    source: string
    amount: number
  }[] = []

  const normalizedWinner = normalizeText(result.winner)
  const normalizedPlayer = normalizeText(result.playerOfMatch)

  for (const prediction of rows) {
    if (
      prediction.winner &&
      normalizeText(prediction.winner) === normalizedWinner
    ) {
      inserts.push({
        room_id: roomId,
        match_id: matchId,
        user_id: prediction.user_id,
        source: 'match_winner_correct',
        amount: POINTS.winnerCorrect,
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
      })
    }
  }

  if (inserts.length > 0) {
    const { error: insertError } = await supabase.from('points').insert(inserts)
    if (insertError) throw insertError
  }

  return inserts.length
}

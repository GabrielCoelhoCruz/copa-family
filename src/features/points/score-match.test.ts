import { describe, expect, it } from 'vitest'

import { POINTS } from '@/features/points/rules'

function normalizeText(value: string) {
  return value.trim().toLowerCase()
}

function scorePrediction(
  prediction: {
    winner: string | null
    home_score: number | null
    away_score: number | null
    player_of_match: string | null
  },
  result: {
    winner: string
    homeScore: number
    awayScore: number
    playerOfMatch: string
  }
) {
  let total = 0
  if (
    prediction.winner &&
    normalizeText(prediction.winner) === normalizeText(result.winner)
  ) {
    total += POINTS.winnerCorrect
  }
  if (
    prediction.player_of_match &&
    normalizeText(prediction.player_of_match) ===
      normalizeText(result.playerOfMatch)
  ) {
    total += POINTS.playerOfMatchCorrect
  }
  if (
    prediction.home_score === result.homeScore &&
    prediction.away_score === result.awayScore
  ) {
    total += POINTS.exactScore
  }
  return total
}

describe('match scoring rules', () => {
  it('awards winner, player and exact score', () => {
    const bonus = scorePrediction(
      {
        winner: 'Brasil',
        home_score: 2,
        away_score: 1,
        player_of_match: 'Neymar',
      },
      {
        winner: 'brasil',
        homeScore: 2,
        awayScore: 1,
        playerOfMatch: 'NEYMAR',
      }
    )
    expect(bonus).toBe(
      POINTS.winnerCorrect + POINTS.playerOfMatchCorrect + POINTS.exactScore
    )
  })

  it('awards only winner when placar differs', () => {
    const bonus = scorePrediction(
      {
        winner: 'Brasil',
        home_score: 1,
        away_score: 0,
        player_of_match: 'Neymar',
      },
      {
        winner: 'Brasil',
        homeScore: 2,
        awayScore: 1,
        playerOfMatch: 'Neymar',
      }
    )
    expect(bonus).toBe(POINTS.winnerCorrect + POINTS.playerOfMatchCorrect)
  })
})

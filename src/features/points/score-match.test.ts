import { describe, expect, it } from 'vitest'

import { POINTS } from '@/features/points/rules'
import {
  calculateMatchPointRows,
  calculateWinnerStreak,
} from '@/features/points/score-match'

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

  it('calculates auditable point rows without persistence', () => {
    const rows = calculateMatchPointRows({
      roomId: 'room-1',
      matchId: 'match-3',
      predictions: [
        {
          user_id: 'user-1',
          winner: 'Brasil',
          home_score: 2,
          away_score: 1,
          player_of_match: 'Marta',
        },
      ],
      result: {
        winner: 'Brasil',
        homeScore: 2,
        awayScore: 1,
        playerOfMatch: 'Marta',
      },
      previousWinnerStreaks: new Map([['user-1', 2]]),
    })

    expect(rows).toEqual([
      expect.objectContaining({
        user_id: 'user-1',
        source: 'match_winner_correct',
        amount: POINTS.winnerCorrect * POINTS.streakMultiplier,
        metadata: expect.objectContaining({
          rule: 'winner_correct',
          multiplier: POINTS.streakMultiplier,
          streakLength: 3,
        }),
      }),
      expect.objectContaining({
        source: 'match_player_correct',
        metadata: expect.objectContaining({ rule: 'player_of_match_correct' }),
      }),
      expect.objectContaining({
        source: 'match_exact_score',
        metadata: expect.objectContaining({ rule: 'exact_score' }),
      }),
    ])
  })

  it('keeps winner points at base value before a three-match streak', () => {
    const rows = calculateMatchPointRows({
      roomId: 'room-1',
      matchId: 'match-2',
      predictions: [
        {
          user_id: 'user-1',
          winner: 'Brasil',
          home_score: 1,
          away_score: 0,
          player_of_match: 'Marta',
        },
      ],
      result: {
        winner: 'Brasil',
        homeScore: 2,
        awayScore: 1,
        playerOfMatch: 'Neymar',
      },
      previousWinnerStreaks: new Map([['user-1', 1]]),
    })

    expect(rows).toHaveLength(1)
    expect(rows[0]).toMatchObject({
      source: 'match_winner_correct',
      amount: POINTS.winnerCorrect,
      metadata: expect.objectContaining({
        multiplier: 1,
        streakLength: 2,
      }),
    })
  })

  it('breaks winner streak after an incorrect prediction', () => {
    const streak = calculateWinnerStreak([
      { winner: 'Brasil', resultWinner: 'Brasil' },
      { winner: 'Brasil', resultWinner: 'Brasil' },
      { winner: 'Brasil', resultWinner: 'Argentina' },
    ])

    expect(streak).toBe(0)
  })
})

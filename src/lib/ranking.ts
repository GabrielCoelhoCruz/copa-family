export type RankingPointsEntry = {
  userId: string
  points: number
}

export type RankingPositionedEntry<T extends RankingPointsEntry> = T & {
  position: number
}

/**
 * Standard competition ranking: tied scores share the same position;
 * next position skips (1, 1, 3).
 */
export function withRankingPositions<T extends RankingPointsEntry>(
  entries: T[]
): RankingPositionedEntry<T>[] {
  return entries.map((entry, index) => {
    if (index === 0) {
      return { ...entry, position: 1 }
    }

    const previous = entries[index - 1]
    if (previous && entry.points === previous.points) {
      let tieIndex = index - 1
      while (tieIndex > 0 && entries[tieIndex - 1]?.points === entry.points) {
        tieIndex -= 1
      }
      return { ...entry, position: tieIndex + 1 }
    }

    return { ...entry, position: index + 1 }
  })
}

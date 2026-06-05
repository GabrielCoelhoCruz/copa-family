import { POINTS, SCORING_RULES_VERSION } from '@/features/points/rules'
import { normalizeCopaPareAnswer } from '@/lib/copa-pare-categories'
import type { AdminSupabaseClient } from '@/lib/supabase/service-client'

export type CopaPareEntryRow = {
  user_id: string
  answer: string
}

export type CopaPareUniquePointRow = {
  room_id: string
  match_id: string
  user_id: string
  source: 'copa_pare_unique'
  amount: number
  metadata: Record<string, unknown>
}

export function calculateCopaPareUniqueRows(
  entries: CopaPareEntryRow[],
  {
    roomId,
    matchId,
  }: {
    roomId: string
    matchId: string
  }
): CopaPareUniquePointRow[] {
  const counts = new Map<string, number>()

  for (const entry of entries) {
    const key = normalizeCopaPareAnswer(entry.answer)
    if (!key) continue
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }

  const rows: CopaPareUniquePointRow[] = []

  for (const entry of entries) {
    const key = normalizeCopaPareAnswer(entry.answer)
    if (!key || (counts.get(key) ?? 0) !== 1) continue

    rows.push({
      room_id: roomId,
      match_id: matchId,
      user_id: entry.user_id,
      source: 'copa_pare_unique',
      amount: POINTS.copaPareUnique,
      metadata: {
        rule: 'copa_pare_unique',
        rulesVersion: SCORING_RULES_VERSION,
        baseAmount: POINTS.copaPareUnique,
        multiplier: 1,
        normalizedAnswer: key,
      },
    })
  }

  return rows
}

export async function applyCopaPareUniqueScoring(
  supabase: AdminSupabaseClient,
  {
    roomId,
    matchId,
  }: {
    roomId: string
    matchId: string
  }
) {
  const { error: deleteError } = await supabase
    .from('points')
    .delete()
    .eq('match_id', matchId)
    .eq('source', 'copa_pare_unique')

  if (deleteError) throw deleteError

  const { data: entries, error } = await supabase
    .from('copa_pare_entries')
    .select('user_id, answer')
    .eq('match_id', matchId)

  if (error) throw error

  const rows = calculateCopaPareUniqueRows((entries ?? []) as CopaPareEntryRow[], {
    roomId,
    matchId,
  })

  if (rows.length === 0) return 0

  const { error: insertError } = await supabase.from('points').insert(rows)
  if (insertError) throw insertError

  return rows.length
}

export async function reshuffleCopaPareLetterInDb(
  supabase: AdminSupabaseClient,
  {
    matchId,
    newLetter,
  }: {
    matchId: string
    newLetter: string
  }
) {
  const { error } = await supabase.rpc('reshuffle_copa_pare_letter', {
    p_match_id: matchId,
    p_new_letter: newLetter,
  })

  if (error) throw error
}

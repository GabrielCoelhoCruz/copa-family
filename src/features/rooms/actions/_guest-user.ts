import { assertSelectablePlayerId } from '@/features/players/queries'
import { setGuestUserId } from '@/lib/session'
import { createAdminClient } from '@/lib/supabase/admin'

export async function createGuestUser(displayName: string, avatarPlayerId: string) {
  const selectable = await assertSelectablePlayerId(avatarPlayerId)
  if (!selectable) {
    throw new Error('Jogador inválido ou sem retrato disponível.')
  }

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('users')
    .insert({
      display_name: displayName,
      avatar_key: 'player',
      avatar_player_id: avatarPlayerId,
    })
    .select('id')
    .single()

  if (error) throw error
  await setGuestUserId(data.id)
  return data.id
}

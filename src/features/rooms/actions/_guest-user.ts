import { setGuestUserId } from '@/lib/session'
import { createAdminClient } from '@/lib/supabase/admin'

export async function createGuestUser(displayName: string, avatarKey: string) {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('users')
    .insert({ display_name: displayName, avatar_key: avatarKey })
    .select('id')
    .single()

  if (error) throw error
  await setGuestUserId(data.id)
  return data.id
}

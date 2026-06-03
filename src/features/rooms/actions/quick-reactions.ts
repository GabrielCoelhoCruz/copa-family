'use server'

import { ANALYTICS_EVENTS, trackEvent } from '@/lib/analytics'
import {
  isRoomMember,
  roomMembershipRole,
  trackPermissionDenied,
  type ActionMembership,
} from '@/features/rooms/actions/permissions'
import { quickReactionSchema } from '@/features/rooms/schemas'
import { checkActionRateLimit } from '@/lib/action-rate-limit'
import { getGuestUserId } from '@/lib/session'
import { createAdminClient } from '@/lib/supabase/admin'

export async function submitQuickReactionAction(input: {
  matchId: string
  roomId: string
  reaction: string
}): Promise<{ error?: string }> {
  const parsed = quickReactionSchema.safeParse(input)

  if (!parsed.success) {
    return { error: 'Reação inválida.' }
  }

  const userId = await getGuestUserId()
  if (!userId) {
    return { error: 'Entre na sala para reagir.' }
  }

  const rateLimit = await checkActionRateLimit({
    action: 'quick_reaction',
    identifier: userId,
    limit: 20,
    windowMs: 60_000,
  })
  if (!rateLimit.allowed) {
    return { error: rateLimit.message }
  }

  const supabase = createAdminClient()
  const { data: match } = await supabase
    .from('matches')
    .select('status, room_id')
    .eq('id', parsed.data.matchId)
    .maybeSingle()

  if (!match || match.room_id !== parsed.data.roomId || match.status !== 'live') {
    return { error: 'Reações rápidas ficam disponíveis com a bola rolando.' }
  }

  const { data: memberships } = await supabase
    .from('room_members')
    .select('user_id, role')
    .eq('room_id', parsed.data.roomId)
  const role = roomMembershipRole((memberships ?? []) as ActionMembership[], userId)

  if (!isRoomMember(role)) {
    await trackPermissionDenied({
      roomId: parsed.data.roomId,
      matchId: parsed.data.matchId,
      userId,
      action: 'quick_reaction',
      reason: 'not_room_member',
    })
    return { error: 'Entre na sala antes de reagir.' }
  }

  await trackEvent({
    eventName: ANALYTICS_EVENTS.quickReactionSubmitted,
    roomId: parsed.data.roomId,
    matchId: parsed.data.matchId,
    userId,
    metadata: { reaction: parsed.data.reaction },
  })

  return {}
}

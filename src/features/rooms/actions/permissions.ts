import { ANALYTICS_EVENTS, trackEvent } from '@/lib/analytics'
import type { AdminSupabaseClient } from '@/lib/supabase/service-client'
import type { RoomMemberRole } from '@/lib/types'

export type ActionMembership = {
  user_id: string
  role: RoomMemberRole
}

export function roomMembershipRole(
  memberships: ActionMembership[],
  userId: string | null
): RoomMemberRole | null {
  if (!userId) return null
  return memberships.find((membership) => membership.user_id === userId)?.role ?? null
}

export function isRoomMember(role: RoomMemberRole | null): boolean {
  return role != null
}

export function canControlRoom(role: RoomMemberRole | null): boolean {
  return role === 'owner' || role === 'co_host'
}

export async function fetchRoomMemberRole(
  supabase: AdminSupabaseClient,
  roomId: string,
  userId: string | null
): Promise<RoomMemberRole | null> {
  const { data, error } = await supabase
    .from('room_members')
    .select('user_id, role')
    .eq('room_id', roomId)

  if (error) throw error

  return roomMembershipRole((data ?? []) as ActionMembership[], userId)
}

export async function trackPermissionDenied(input: {
  roomId?: string
  matchId?: string
  userId?: string | null
  action: string
  reason: string
}) {
  await trackEvent({
    eventName: ANALYTICS_EVENTS.permissionDenied,
    roomId: input.roomId,
    matchId: input.matchId,
    userId: input.userId ?? undefined,
    metadata: {
      action: input.action,
      reason: input.reason,
    },
  })
}

'use server'

import { redirect } from 'next/navigation'

import { buildMatchTitleFromFixture } from '@/features/fixtures/api-football'
import { getFixtureById } from '@/features/fixtures/queries'
import { canAssumeRoom } from '@/features/rooms/host-resilience'
import {
  canControlRoom,
  roomMembershipRole,
  trackPermissionDenied,
  type ActionMembership,
} from '@/features/rooms/actions/permissions'
import { ANALYTICS_EVENTS, trackEvent } from '@/lib/analytics'
import { routes } from '@/lib/routes'
import { getGuestUserId } from '@/lib/session'
import { createAdminClient } from '@/lib/supabase/admin'

export async function assumeRoomHostAction(formData: FormData) {
  const roomId = formData.get('roomId')
  const roomCode = formData.get('roomCode')
  if (typeof roomId !== 'string' || typeof roomCode !== 'string') {
    redirect(routes.home)
  }

  const userId = await getGuestUserId()
  const supabase = createAdminClient()

  const { data: room } = await supabase
    .from('rooms')
    .select('id, code, last_host_action_at')
    .eq('id', roomId)
    .maybeSingle()

  if (!room || !userId) {
    redirect(routes.sala(roomCode))
  }

  const role = await getUserRole(supabase, roomId, userId)
  if (role !== 'member' || !canAssumeRoom(room.last_host_action_at)) {
    await trackPermissionDenied({
      roomId,
      userId,
      action: 'assume_room_host',
      reason: role === 'member' ? 'host_still_active' : 'not_regular_member',
    })
    redirect(`${routes.sala(roomCode)}?statusErro=${encodeURIComponent('A sala ainda não pode ser assumida.')}`)
  }

  await supabase
    .from('room_members')
    .update({ role: 'co_host' })
    .eq('room_id', roomId)
    .eq('user_id', userId)

  await supabase
    .from('rooms')
    .update({ last_host_action_at: new Date().toISOString() })
    .eq('id', roomId)

  await trackEvent({
    eventName: ANALYTICS_EVENTS.hostAssumed,
    roomId,
    userId,
  })

  redirect(`${routes.sala(room.code)}?hostAssumido=1`)
}

export async function promoteCoHostAction(formData: FormData) {
  const roomId = formData.get('roomId')
  const roomCode = formData.get('roomCode')
  const memberUserId = formData.get('memberUserId')
  if (
    typeof roomId !== 'string' ||
    typeof roomCode !== 'string' ||
    typeof memberUserId !== 'string'
  ) {
    redirect(routes.home)
  }

  const userId = await getGuestUserId()
  const supabase = createAdminClient()
  const role = await getUserRole(supabase, roomId, userId)

  if (role !== 'owner') {
    await trackPermissionDenied({
      roomId,
      userId,
      action: 'promote_co_host',
      reason: 'requires_owner',
    })
    redirect(`${routes.sala(roomCode)}?statusErro=${encodeURIComponent('Só o dono pode promover co-anfitrião.')}`)
  }

  await supabase
    .from('room_members')
    .update({ role: 'co_host' })
    .eq('room_id', roomId)
    .eq('user_id', memberUserId)
    .eq('role', 'member')

  await supabase
    .from('rooms')
    .update({ last_host_action_at: new Date().toISOString() })
    .eq('id', roomId)

  redirect(`${routes.sala(roomCode)}?coHost=1`)
}

export async function createNextMatchAction(formData: FormData) {
  const roomId = formData.get('roomId')
  const roomCode = formData.get('roomCode')
  const fixtureId = formData.get('fixtureId')
  if (
    typeof roomId !== 'string' ||
    typeof roomCode !== 'string' ||
    typeof fixtureId !== 'string' ||
    fixtureId.length === 0
  ) {
    redirect(routes.home)
  }

  const userId = await getGuestUserId()
  const supabase = createAdminClient()
  const role = await getUserRole(supabase, roomId, userId)

  if (!canControlRoom(role)) {
    await trackPermissionDenied({
      roomId,
      userId,
      action: 'create_next_match',
      reason: 'requires_host_role',
    })
    redirect(`${routes.sala(roomCode)}?statusErro=${encodeURIComponent('Só o dono ou co-anfitrião pode escolher o próximo jogo.')}`)
  }

  const fixture = await getFixtureById(fixtureId)
  if (!fixture) {
    redirect(`${routes.sala(roomCode)}?statusErro=${encodeURIComponent('Jogo não encontrado no calendário.')}`)
  }

  const title = buildMatchTitleFromFixture({
    home_team_name: fixture.home_team_name,
    away_team_name: fixture.away_team_name,
    round: fixture.round,
    stage: fixture.stage,
  })

  await supabase.from('matches').insert({
    room_id: roomId,
    title,
    status: 'lobby',
    fixture_id: fixtureId,
  })

  await supabase
    .from('rooms')
    .update({ last_host_action_at: new Date().toISOString() })
    .eq('id', roomId)

  redirect(`${routes.sala(roomCode)}?proximoJogo=1`)
}

async function getUserRole(
  supabase: ReturnType<typeof createAdminClient>,
  roomId: string,
  userId: string | null
) {
  const { data } = await supabase
    .from('room_members')
    .select('user_id, role')
    .eq('room_id', roomId)

  return roomMembershipRole((data ?? []) as ActionMembership[], userId)
}

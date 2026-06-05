'use server'

import { redirect } from 'next/navigation'

import {
  ANALYTICS_EVENTS,
  trackFailureEvent,
  trackEvent,
  type AnalyticsEventName,
} from '@/lib/analytics'
import { applyCopaPareUniqueScoring } from '@/features/points/score-copa-pare'
import { applyMatchScoring } from '@/features/points/score-match'
import {
  drawCopaPareCategory,
  drawCopaPareLetter,
} from '@/lib/copa-pare-categories'
import {
  canTransitionMatchStatus,
  getInvalidTransitionMessage,
} from '@/features/rooms/match-status'
import {
  canControlRoom,
  fetchRoomMemberRole,
  trackPermissionDenied,
} from '@/features/rooms/actions/permissions'
import { matchResultSchema } from '@/features/rooms/schemas'
import {
  actionStateFromZod,
  type ActionState,
} from '@/features/rooms/action-state'
import { routes } from '@/lib/routes'
import { getGuestUserId } from '@/lib/session'
import { createAdminClient } from '@/lib/supabase/admin'
import type { MatchStatus } from '@/lib/types'

export async function updateMatchStatusFormAction(formData: FormData) {
  const matchId = formData.get('matchId')
  const roomCode = formData.get('roomCode')
  const roomId = formData.get('roomId')
  const status = formData.get('status')

  if (
    typeof matchId !== 'string' ||
    typeof roomCode !== 'string' ||
    typeof roomId !== 'string' ||
    typeof status !== 'string'
  ) {
    redirect(routes.sala(String(roomCode)))
    return
  }

  const result = await updateMatchStatusAction(
    matchId,
    roomCode,
    roomId,
    status as MatchStatus
  )

  if (result.error) {
    redirect(`${routes.sala(roomCode)}?statusErro=${encodeURIComponent(result.error)}`)
    return
  }

  redirect(routes.sala(roomCode))
}

export async function updateMatchStatusAction(
  matchId: string,
  roomCode: string,
  roomId: string,
  status: MatchStatus
): Promise<ActionState> {
  const supabase = createAdminClient()
  const userId = await getGuestUserId()

  const { data: match, error: fetchError } = await supabase
    .from('matches')
    .select('status, room_id')
    .eq('id', matchId)
    .maybeSingle()

  if (fetchError || !match) {
    return { error: 'Partida não encontrada.' }
  }

  if (match.room_id !== roomId) {
    await trackPermissionDenied({
      roomId,
      matchId,
      userId,
      action: 'update_match_status',
      reason: 'match_room_mismatch',
    })
    return { error: 'Partida não pertence a esta sala.' }
  }

  const { data: room } = await supabase
    .from('rooms')
    .select('code')
    .eq('id', roomId)
    .maybeSingle()

  if (!room || room.code !== roomCode.toUpperCase()) {
    await trackPermissionDenied({
      roomId,
      matchId,
      userId,
      action: 'update_match_status',
      reason: 'room_code_mismatch',
    })
    return { error: 'Sala inválida para esta partida.' }
  }

  const role = await fetchRoomMemberRole(supabase, roomId, userId)
  if (!canControlRoom(role)) {
    await trackPermissionDenied({
      roomId,
      matchId,
      userId,
      action: 'update_match_status',
      reason: 'requires_host_role',
    })
    return { error: 'Só o dono ou co-anfitrião pode mudar a partida.' }
  }

  const current = match.status as MatchStatus
  if (!canTransitionMatchStatus(current, status)) {
    return { error: getInvalidTransitionMessage(current, status) }
  }

  const timestamps: Record<string, string | null> = {}
  if (status === 'live') timestamps.started_at = new Date().toISOString()
  if (status === 'halftime') timestamps.halftime_started_at = new Date().toISOString()
  if (status === 'finished') timestamps.finished_at = new Date().toISOString()

  const matchUpdate: Record<string, string | null> = {
    status,
    ...timestamps,
  }

  if (status === 'halftime') {
    const category = drawCopaPareCategory()
    matchUpdate.copa_pare_category = category.value
    matchUpdate.copa_pare_letter = drawCopaPareLetter()
  }

  const { error } = await supabase
    .from('matches')
    .update(matchUpdate)
    .eq('id', matchId)

  if (error) {
    return { error: 'Não foi possível atualizar o status da partida.' }
  }

  await supabase
    .from('rooms')
    .update({ last_host_action_at: new Date().toISOString() })
    .eq('id', roomId)

  if (current === 'halftime' && (status === 'live' || status === 'finished')) {
    try {
      await applyCopaPareUniqueScoring(supabase, { roomId, matchId })
    } catch {
      return {
        error:
          'Status atualizado, mas não foi possível calcular respostas únicas do Copa Stop. Tente retomar ou encerrar de novo.',
      }
    }
  }

  const statusEvents: Partial<Record<MatchStatus, AnalyticsEventName>> = {
    live: ANALYTICS_EVENTS.matchStarted,
    halftime: ANALYTICS_EVENTS.halftimeStarted,
    finished: ANALYTICS_EVENTS.matchFinished,
  }

  const eventName = statusEvents[status]
  if (eventName) {
    await trackEvent({
      eventName,
      roomId,
      matchId,
    })
  }

  return {}
}

export async function submitMatchResultAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = matchResultSchema.safeParse({
    matchId: formData.get('matchId'),
    roomId: formData.get('roomId'),
    roomCode: formData.get('roomCode'),
    winner: formData.get('winner'),
    homeScore: formData.get('homeScore'),
    awayScore: formData.get('awayScore'),
    playerOfMatch: formData.get('playerOfMatch'),
  })

  if (!parsed.success) {
    return actionStateFromZod(parsed.error, 'Confira o resultado da partida.')
  }

  const supabase = createAdminClient()
  const userId = await getGuestUserId()

  const { data: room } = await supabase
    .from('rooms')
    .select('code')
    .eq('id', parsed.data.roomId)
    .maybeSingle()

  if (!room || room.code !== parsed.data.roomCode.toUpperCase()) {
    await trackPermissionDenied({
      roomId: parsed.data.roomId,
      matchId: parsed.data.matchId,
      userId,
      action: 'submit_match_result',
      reason: 'room_code_mismatch',
    })
    return { error: 'Sala inválida para este resultado.' }
  }

  const role = await fetchRoomMemberRole(supabase, parsed.data.roomId, userId)
  if (!canControlRoom(role)) {
    await trackPermissionDenied({
      roomId: parsed.data.roomId,
      matchId: parsed.data.matchId,
      userId,
      action: 'submit_match_result',
      reason: 'requires_host_role',
    })
    return { error: 'Só o dono ou co-anfitrião pode informar o resultado.' }
  }

  const { data: match, error: matchError } = await supabase
    .from('matches')
    .select('status, room_id')
    .eq('id', parsed.data.matchId)
    .maybeSingle()

  if (matchError || !match) {
    return { error: 'Partida não encontrada.' }
  }

  if (match.room_id !== parsed.data.roomId) {
    await trackPermissionDenied({
      roomId: parsed.data.roomId,
      matchId: parsed.data.matchId,
      userId,
      action: 'submit_match_result',
      reason: 'match_room_mismatch',
    })
    return { error: 'Partida não pertence a esta sala.' }
  }

  if (match.status === 'lobby' || match.status === 'predictions_open') {
    return { error: 'Informe o resultado depois de iniciar a partida.' }
  }

  const result = {
    winner: parsed.data.winner,
    homeScore: parsed.data.homeScore,
    awayScore: parsed.data.awayScore,
    playerOfMatch: parsed.data.playerOfMatch,
  }

  const { error: updateError } = await supabase
    .from('matches')
    .update({
      winner: result.winner,
      home_score: result.homeScore,
      away_score: result.awayScore,
      player_of_match: result.playerOfMatch,
    })
    .eq('id', parsed.data.matchId)

  if (updateError) {
    return { error: 'Não foi possível salvar o resultado.' }
  }

  await supabase
    .from('rooms')
    .update({ last_host_action_at: new Date().toISOString() })
    .eq('id', parsed.data.roomId)

  try {
    await applyMatchScoring(supabase, {
      roomId: parsed.data.roomId,
      matchId: parsed.data.matchId,
      result,
    })
  } catch {
    await trackFailureEvent({
      eventName: ANALYTICS_EVENTS.scoreFailed,
      roomId: parsed.data.roomId,
      matchId: parsed.data.matchId,
      userId: userId ?? undefined,
      action: 'submit_match_result',
      reason: 'apply_match_scoring_failed',
    })
    return { error: 'Resultado salvo, mas a pontuação falhou. Tente de novo.' }
  }

  await trackEvent({
    eventName: ANALYTICS_EVENTS.matchResultSubmitted,
    roomId: parsed.data.roomId,
    matchId: parsed.data.matchId,
    userId: userId ?? undefined,
  })

  redirect(`${routes.sala(parsed.data.roomCode)}?resultado=1`)
}

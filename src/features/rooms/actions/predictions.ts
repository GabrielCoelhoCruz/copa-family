'use server'

import { redirect } from 'next/navigation'

import { ANALYTICS_EVENTS, trackEvent, trackFailureEvent } from '@/lib/analytics'
import { POINTS, SCORING_RULES_VERSION } from '@/features/points/rules'
import {
  isRoomMember,
  roomMembershipRole,
  trackPermissionDenied,
  type ActionMembership,
} from '@/features/rooms/actions/permissions'
import { predictionSchema } from '@/features/rooms/schemas'
import {
  actionStateFromZod,
  type ActionState,
} from '@/features/rooms/action-state'
import { routes } from '@/lib/routes'
import { checkActionRateLimit } from '@/lib/action-rate-limit'
import { getGuestUserId } from '@/lib/session'
import { createAdminClient } from '@/lib/supabase/admin'

export async function submitPredictionAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = predictionSchema.safeParse({
    matchId: formData.get('matchId'),
    roomId: formData.get('roomId'),
    winner: formData.get('winner'),
    homeScore: formData.get('homeScore'),
    awayScore: formData.get('awayScore'),
    playerOfMatch: formData.get('playerOfMatch'),
  })

  if (!parsed.success) {
    return actionStateFromZod(parsed.error, 'Confira os campos do palpite.')
  }

  const supabase = createAdminClient()
  const userId = await getGuestUserId()
  const roomCode = formData.get('roomCode')

  if (!userId || typeof roomCode !== 'string') {
    return { error: 'Sessão inválida. Entre na sala de novo.' }
  }

  const rateLimit = await checkActionRateLimit({
    action: 'submit_prediction',
    identifier: userId,
    limit: 6,
    windowMs: 60_000,
  })
  if (!rateLimit.allowed) {
    return { error: rateLimit.message }
  }

  const { data: match, error: matchError } = await supabase
    .from('matches')
    .select('status, room_id')
    .eq('id', parsed.data.matchId)
    .maybeSingle()

  if (matchError) {
    return { error: 'Não conseguimos validar a partida. Atualize a página.' }
  }
  if (!match || match.status !== 'predictions_open') {
    return {
      error: 'Palpites fechados. Peça ao dono da sala para abrir os palpites na aba Jogo.',
    }
  }

  if (match.room_id !== parsed.data.roomId) {
    await trackPermissionDenied({
      roomId: parsed.data.roomId,
      matchId: parsed.data.matchId,
      userId,
      action: 'submit_prediction',
      reason: 'match_room_mismatch',
    })
    return { error: 'Partida não pertence a esta sala.' }
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
      action: 'submit_prediction',
      reason: 'not_room_member',
    })
    return { error: 'Entre na sala antes de enviar palpite.' }
  }

  const { data: existing } = await supabase
    .from('predictions')
    .select('id')
    .eq('match_id', parsed.data.matchId)
    .eq('user_id', userId)
    .maybeSingle()

  if (existing) {
    return { error: 'Você já enviou palpite nesta partida.' }
  }

  const { error: predictionError } = await supabase.from('predictions').insert({
    match_id: parsed.data.matchId,
    user_id: userId,
    winner: parsed.data.winner,
    home_score: parsed.data.homeScore,
    away_score: parsed.data.awayScore,
    player_of_match: parsed.data.playerOfMatch,
  })

  if (predictionError) {
    await trackFailureEvent({
      eventName: ANALYTICS_EVENTS.actionFailed,
      roomId: parsed.data.roomId,
      matchId: parsed.data.matchId,
      userId,
      action: 'submit_prediction',
      reason: 'prediction_insert_failed',
    })
    return { error: 'Não foi possível salvar o palpite. Tente de novo.' }
  }

  const { error: pointsError } = await supabase.from('points').insert({
    room_id: parsed.data.roomId,
    match_id: parsed.data.matchId,
    user_id: userId,
    source: 'prediction_submitted',
    amount: POINTS.predictionSubmitted,
    metadata: {
      rule: 'prediction_submitted',
      rulesVersion: SCORING_RULES_VERSION,
      baseAmount: POINTS.predictionSubmitted,
      multiplier: 1,
    },
  })

  if (pointsError) {
    await trackFailureEvent({
      eventName: ANALYTICS_EVENTS.actionFailed,
      roomId: parsed.data.roomId,
      matchId: parsed.data.matchId,
      userId,
      action: 'submit_prediction',
      reason: 'prediction_points_failed',
    })
    return {
      error: 'Palpite salvo, mas os +10 pontos não entraram. Avise o dono da sala.',
    }
  }

  await trackEvent({
    eventName: ANALYTICS_EVENTS.predictionSubmitted,
    roomId: parsed.data.roomId,
    matchId: parsed.data.matchId,
    userId,
  })

  redirect(`${routes.palpites(String(roomCode))}?enviado=1`)
}

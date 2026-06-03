'use server'

import { redirect } from 'next/navigation'

import { ANALYTICS_EVENTS, trackEvent, trackFailureEvent } from '@/lib/analytics'
import { POINTS, SCORING_RULES_VERSION } from '@/features/points/rules'
import { isCopaParePlayPhase } from '@/features/rooms/copa-pare-visibility'
import {
  isRoomMember,
  roomMembershipRole,
  trackPermissionDenied,
  type ActionMembership,
} from '@/features/rooms/actions/permissions'
import { copaPareSchema } from '@/features/rooms/schemas'
import {
  actionStateFromZod,
  type ActionState,
} from '@/features/rooms/action-state'
import { routes } from '@/lib/routes'
import { checkActionRateLimit } from '@/lib/action-rate-limit'
import { getGuestUserId } from '@/lib/session'
import { createAdminClient } from '@/lib/supabase/admin'
import type { MatchStatus } from '@/lib/types'

export async function submitCopaPareAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = copaPareSchema.safeParse({
    matchId: formData.get('matchId'),
    roomId: formData.get('roomId'),
    roomCode: formData.get('roomCode'),
    category: formData.get('category'),
    answer: formData.get('answer'),
  })

  if (!parsed.success) {
    return actionStateFromZod(parsed.error, 'Confira sua resposta.')
  }

  const supabase = createAdminClient()
  const userId = await getGuestUserId()

  if (!userId) {
    return { error: 'Sessão inválida. Entre na sala de novo.' }
  }

  const rateLimit = await checkActionRateLimit({
    action: 'submit_copa_pare',
    identifier: userId,
    limit: 5,
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

  if (matchError || !match) {
    return { error: 'Partida não encontrada.' }
  }

  if (match.room_id !== parsed.data.roomId) {
    await trackPermissionDenied({
      roomId: parsed.data.roomId,
      matchId: parsed.data.matchId,
      userId,
      action: 'submit_copa_pare',
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
      action: 'submit_copa_pare',
      reason: 'not_room_member',
    })
    return { error: 'Entre na sala antes de jogar Copa Pare.' }
  }

  if (!isCopaParePlayPhase(match.status as MatchStatus)) {
    return { error: 'Copa Pare só está disponível durante o intervalo.' }
  }

  const { data: existing } = await supabase
    .from('copa_pare_entries')
    .select('id')
    .eq('match_id', parsed.data.matchId)
    .eq('user_id', userId)
    .maybeSingle()

  if (existing) {
    return { error: 'Você já participou do Copa Pare nesta partida.' }
  }

  const { error: entryError } = await supabase.from('copa_pare_entries').insert({
    match_id: parsed.data.matchId,
    room_id: parsed.data.roomId,
    user_id: userId,
    category: parsed.data.category,
    answer: parsed.data.answer,
  })

  if (entryError) {
    await trackFailureEvent({
      eventName: ANALYTICS_EVENTS.actionFailed,
      roomId: parsed.data.roomId,
      matchId: parsed.data.matchId,
      userId,
      action: 'submit_copa_pare',
      reason: 'entry_insert_failed',
    })
    return { error: 'Não foi possível salvar sua resposta.' }
  }

  const { error: pointsError } = await supabase.from('points').insert({
    room_id: parsed.data.roomId,
    match_id: parsed.data.matchId,
    user_id: userId,
    source: 'copa_pare_participation',
    amount: POINTS.copaPareParticipation,
    metadata: {
      rule: 'copa_pare_participation',
      rulesVersion: SCORING_RULES_VERSION,
      baseAmount: POINTS.copaPareParticipation,
      multiplier: 1,
    },
  })

  if (pointsError) {
    await trackFailureEvent({
      eventName: ANALYTICS_EVENTS.actionFailed,
      roomId: parsed.data.roomId,
      matchId: parsed.data.matchId,
      userId,
      action: 'submit_copa_pare',
      reason: 'copa_pare_points_failed',
    })
    return {
      error: 'Resposta salva, mas os +100 pontos não entraram. Avise o anfitrião.',
    }
  }

  await trackEvent({
    eventName: ANALYTICS_EVENTS.copaPareSubmitted,
    roomId: parsed.data.roomId,
    matchId: parsed.data.matchId,
    userId,
  })

  redirect(`${routes.copaPare(parsed.data.roomCode)}?enviado=1`)
}

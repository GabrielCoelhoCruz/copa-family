'use server'

import { redirect } from 'next/navigation'

import { ANALYTICS_EVENTS, trackEvent, trackFailureEvent } from '@/lib/analytics'
import { createRoomSchema, joinRoomSchema } from '@/features/rooms/schemas'
import { createGuestUser } from '@/features/rooms/actions/_guest-user'
import {
  actionStateFromZod,
  type ActionState,
} from '@/features/rooms/action-state'
import { buildMatchTitleFromFixture } from '@/features/fixtures/api-football'
import { getFixtureById } from '@/features/fixtures/queries'
import { generateRoomCode } from '@/lib/room-code'
import { routes } from '@/lib/routes'
import { checkActionRateLimit } from '@/lib/action-rate-limit'
import { createAdminClient } from '@/lib/supabase/admin'

export async function createRoomAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const rawFixtureId = formData.get('fixtureId')
  const parsed = createRoomSchema.safeParse({
    displayName: formData.get('displayName'),
    avatarKey: formData.get('avatarKey'),
    roomName: formData.get('roomName'),
    fixtureId: typeof rawFixtureId === 'string' ? rawFixtureId : '',
  })

  if (!parsed.success) {
    return actionStateFromZod(parsed.error, 'Revise os campos e tente de novo.')
  }

  const rateLimit = await checkActionRateLimit({
    action: 'create_room',
    identifier: parsed.data.displayName,
    limit: 4,
    windowMs: 60_000,
  })
  if (!rateLimit.allowed) {
    return { error: rateLimit.message }
  }

  const supabase = createAdminClient()
  let userId: string
  try {
    userId = await createGuestUser(
      parsed.data.displayName,
      parsed.data.avatarKey
    )
  } catch {
    return { error: 'Não foi possível salvar seu perfil. Verifique a conexão e tente de novo.' }
  }

  let roomCode = generateRoomCode()
  let room: { id: string; code: string } | null = null

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const { data, error } = await supabase
      .from('rooms')
      .insert({
        code: roomCode,
        name: parsed.data.roomName,
        owner_user_id: userId,
      })
      .select('id, code')
      .single()

    if (!error) {
      room = data
      break
    }

    roomCode = generateRoomCode()
  }

  if (!room) {
    await trackFailureEvent({
      eventName: ANALYTICS_EVENTS.actionFailed,
      userId,
      action: 'create_room',
      reason: 'room_insert_failed',
    })
    return {
      error: 'Não foi possível criar a sala agora. Confira a internet e tente de novo.',
    }
  }

  const { error: memberError } = await supabase.from('room_members').insert({
    room_id: room.id,
    user_id: userId,
    role: 'owner',
  })

  if (memberError) {
    await trackFailureEvent({
      eventName: ANALYTICS_EVENTS.actionFailed,
      roomId: room.id,
      userId,
      action: 'create_room',
      reason: 'owner_membership_failed',
    })
    return { error: 'A sala foi criada, mas algo falhou ao registrar você como dono.' }
  }

  const fixtureId =
    parsed.data.fixtureId && parsed.data.fixtureId.length > 0
      ? parsed.data.fixtureId
      : null

  let matchTitle = 'Partida da Copa'
  if (fixtureId) {
    const fixture = await getFixtureById(fixtureId)
    if (!fixture) {
      return {
        error: 'Jogo não encontrado. Atualize a página e escolha outro jogo.',
        fieldErrors: { fixtureId: 'Jogo inválido ou removido.' },
      }
    }
    matchTitle = buildMatchTitleFromFixture({
      home_team_name: fixture.home_team_name,
      away_team_name: fixture.away_team_name,
      round: fixture.round,
      stage: fixture.stage,
    })
  }

  const { data: match, error: matchError } = await supabase
    .from('matches')
    .insert({
      room_id: room.id,
      title: matchTitle,
      status: 'lobby',
      fixture_id: fixtureId,
    })
    .select('id')
    .single()

  if (matchError || !match) {
    await trackFailureEvent({
      eventName: ANALYTICS_EVENTS.actionFailed,
      roomId: room.id,
      userId,
      action: 'create_room',
      reason: 'match_insert_failed',
    })
    return { error: 'A sala foi criada, mas não iniciamos a partida. Tente abrir de novo.' }
  }

  await trackEvent({
    eventName: ANALYTICS_EVENTS.roomCreated,
    roomId: room.id,
    matchId: match.id,
    userId,
  })

  redirect(routes.sala(room.code))
}

export async function joinRoomAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = joinRoomSchema.safeParse({
    roomCode: formData.get('roomCode'),
    displayName: formData.get('displayName'),
    avatarKey: formData.get('avatarKey'),
  })

  if (!parsed.success) {
    return actionStateFromZod(parsed.error, 'Revise os campos e tente de novo.')
  }

  const rateLimit = await checkActionRateLimit({
    action: 'join_room',
    identifier: parsed.data.roomCode,
    limit: 8,
    windowMs: 60_000,
  })
  if (!rateLimit.allowed) {
    return { error: rateLimit.message }
  }

  const supabase = createAdminClient()
  const { data: room, error: roomError } = await supabase
    .from('rooms')
    .select('id, code')
    .eq('code', parsed.data.roomCode)
    .maybeSingle()

  if (roomError) {
    return { error: 'Não conseguimos buscar a sala. Tente de novo em instantes.' }
  }
  if (!room) {
    const roomCodeMessage =
      'Código não encontrado. Peça o código de 6 letras a quem criou a sala.'
    return {
      error: roomCodeMessage,
      fieldErrors: { roomCode: roomCodeMessage },
    }
  }

  let userId: string
  try {
    userId = await createGuestUser(
      parsed.data.displayName,
      parsed.data.avatarKey
    )
  } catch {
    return { error: 'Não foi possível salvar seu perfil. Verifique a conexão e tente de novo.' }
  }

  const { error: memberError } = await supabase.from('room_members').insert({
    room_id: room.id,
    user_id: userId,
    role: 'member',
  })

  if (memberError) {
    await trackFailureEvent({
      eventName: ANALYTICS_EVENTS.actionFailed,
      roomId: room.id,
      userId,
      action: 'join_room',
      reason: 'member_insert_failed',
    })
    return { error: 'Não foi possível entrar na sala. Tente de novo.' }
  }

  const { data: match } = await supabase
    .from('matches')
    .select('id')
    .eq('room_id', room.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  await trackEvent({
    eventName: ANALYTICS_EVENTS.roomJoined,
    roomId: room.id,
    matchId: match?.id,
    userId,
  })

  redirect(routes.sala(room.code))
}

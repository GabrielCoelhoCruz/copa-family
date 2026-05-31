'use server'

import { redirect } from 'next/navigation'

import {
  ANALYTICS_EVENTS,
  trackEvent,
  type AnalyticsEventName,
} from '@/lib/analytics'
import { applyMatchScoring } from '@/features/points/score-match'
import { POINTS } from '@/features/points/rules'
import {
  canTransitionMatchStatus,
  getInvalidTransitionMessage,
} from '@/features/rooms/match-status'
import {
  copaPareSchema,
  createRoomSchema,
  joinRoomSchema,
  matchResultSchema,
  predictionSchema,
} from '@/features/rooms/schemas'
import { generateRoomCode } from '@/lib/room-code'
import { routes } from '@/lib/routes'
import { getGuestUserId, setGuestUserId } from '@/lib/session'
import { createClient } from '@/lib/supabase/server'
import type { MatchStatus } from '@/lib/types'

export type ActionState = {
  error?: string
}

async function createGuestUser(displayName: string, avatarKey: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('users')
    .insert({ display_name: displayName, avatar_key: avatarKey })
    .select('id')
    .single()

  if (error) throw error
  await setGuestUserId(data.id)
  return data.id
}

export async function createRoomAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = createRoomSchema.safeParse({
    displayName: formData.get('displayName'),
    avatarKey: formData.get('avatarKey'),
    roomName: formData.get('roomName'),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Revise os campos e tente de novo.' }
  }

  const supabase = await createClient()
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
    return { error: 'A sala foi criada, mas algo falhou ao registrar você como dono.' }
  }

  const { data: match, error: matchError } = await supabase
    .from('matches')
    .insert({
      room_id: room.id,
      title: 'Partida da Copa',
      status: 'lobby',
    })
    .select('id')
    .single()

  if (matchError || !match) {
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
    return { error: parsed.error.issues[0]?.message ?? 'Revise os campos e tente de novo.' }
  }

  const supabase = await createClient()
  const { data: room, error: roomError } = await supabase
    .from('rooms')
    .select('id, code')
    .eq('code', parsed.data.roomCode)
    .maybeSingle()

  if (roomError) {
    return { error: 'Não conseguimos buscar a sala. Tente de novo em instantes.' }
  }
  if (!room) {
    return {
      error: 'Código não encontrado. Peça o código de 6 letras a quem criou a sala.',
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
    return { error: parsed.error.issues[0]?.message ?? 'Confira os campos do palpite.' }
  }

  const supabase = await createClient()
  const userId = formData.get('userId')
  const roomCode = formData.get('roomCode')

  if (typeof userId !== 'string' || typeof roomCode !== 'string') {
    return { error: 'Sessão inválida. Entre na sala de novo.' }
  }

  const { data: match, error: matchError } = await supabase
    .from('matches')
    .select('status')
    .eq('id', parsed.data.matchId)
    .maybeSingle()

  if (matchError) {
    return { error: 'Não conseguimos validar a partida. Atualize a página.' }
  }
  if (!match || match.status !== 'predictions_open') {
    return {
      error: 'Palpites fechados. Peça ao dono da sala para abrir os palpites no lobby.',
    }
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
    return { error: 'Não foi possível salvar o palpite. Tente de novo.' }
  }

  const { error: pointsError } = await supabase.from('points').insert({
    room_id: parsed.data.roomId,
    match_id: parsed.data.matchId,
    user_id: userId,
    source: 'prediction_submitted',
    amount: POINTS.predictionSubmitted,
  })

  if (pointsError) {
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
  const supabase = await createClient()

  const { data: match, error: fetchError } = await supabase
    .from('matches')
    .select('status')
    .eq('id', matchId)
    .maybeSingle()

  if (fetchError || !match) {
    return { error: 'Partida não encontrada.' }
  }

  const current = match.status as MatchStatus
  if (!canTransitionMatchStatus(current, status)) {
    return { error: getInvalidTransitionMessage(current, status) }
  }

  const timestamps: Record<string, string | null> = {}
  if (status === 'live') timestamps.started_at = new Date().toISOString()
  if (status === 'halftime') timestamps.halftime_started_at = new Date().toISOString()
  if (status === 'finished') timestamps.finished_at = new Date().toISOString()

  const { error } = await supabase
    .from('matches')
    .update({ status, ...timestamps })
    .eq('id', matchId)

  if (error) {
    return { error: 'Não foi possível atualizar o status da partida.' }
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
    return { error: parsed.error.issues[0]?.message ?? 'Confira o resultado da partida.' }
  }

  const supabase = await createClient()
  const userId = await getGuestUserId()

  const { data: room } = await supabase
    .from('rooms')
    .select('owner_user_id')
    .eq('id', parsed.data.roomId)
    .maybeSingle()

  if (!room || room.owner_user_id !== userId) {
    return { error: 'Só o dono da sala pode informar o resultado.' }
  }

  const { data: match, error: matchError } = await supabase
    .from('matches')
    .select('status')
    .eq('id', parsed.data.matchId)
    .maybeSingle()

  if (matchError || !match) {
    return { error: 'Partida não encontrada.' }
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

  try {
    await applyMatchScoring(supabase, {
      roomId: parsed.data.roomId,
      matchId: parsed.data.matchId,
      result,
    })
  } catch {
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

export async function submitCopaPareAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = copaPareSchema.safeParse({
    matchId: formData.get('matchId'),
    roomId: formData.get('roomId'),
    roomCode: formData.get('roomCode'),
    userId: formData.get('userId'),
    category: formData.get('category'),
    answer: formData.get('answer'),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Confira sua resposta.' }
  }

  const supabase = await createClient()

  const { data: match, error: matchError } = await supabase
    .from('matches')
    .select('status')
    .eq('id', parsed.data.matchId)
    .maybeSingle()

  if (matchError || !match) {
    return { error: 'Partida não encontrada.' }
  }

  if (match.status !== 'halftime' && match.status !== 'live') {
    return { error: 'Copa Pare só está disponível durante o intervalo ou jogo ao vivo.' }
  }

  const { data: existing } = await supabase
    .from('copa_pare_entries')
    .select('id')
    .eq('match_id', parsed.data.matchId)
    .eq('user_id', parsed.data.userId)
    .maybeSingle()

  if (existing) {
    return { error: 'Você já participou do Copa Pare nesta partida.' }
  }

  const { error: entryError } = await supabase.from('copa_pare_entries').insert({
    match_id: parsed.data.matchId,
    room_id: parsed.data.roomId,
    user_id: parsed.data.userId,
    category: parsed.data.category,
    answer: parsed.data.answer,
  })

  if (entryError) {
    return { error: 'Não foi possível salvar sua resposta.' }
  }

  const { error: pointsError } = await supabase.from('points').insert({
    room_id: parsed.data.roomId,
    match_id: parsed.data.matchId,
    user_id: parsed.data.userId,
    source: 'copa_pare_participation',
    amount: POINTS.copaPareParticipation,
  })

  if (pointsError) {
    return {
      error: 'Resposta salva, mas os +100 pontos não entraram. Avise o anfitrião.',
    }
  }

  await trackEvent({
    eventName: ANALYTICS_EVENTS.copaPareSubmitted,
    roomId: parsed.data.roomId,
    matchId: parsed.data.matchId,
    userId: parsed.data.userId,
  })

  redirect(`${routes.copaPare(parsed.data.roomCode)}?enviado=1`)
}

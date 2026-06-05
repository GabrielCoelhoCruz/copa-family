import { z } from 'zod'

export const createRoomSchema = z.object({
  displayName: z.string().trim().min(2, 'Nome muito curto').max(40),
  avatarPlayerId: z.string().uuid('Escolha um jogador'),
  roomName: z.string().trim().min(2, 'Nome da sala muito curto').max(50),
  fixtureId: z.union([z.string().uuid('Escolha um jogo da Copa'), z.literal('')]).optional(),
})

export const joinRoomSchema = z.object({
  roomCode: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z0-9]{6}$/, 'Use exatamente 6 letras ou números, sem espaços.'),
  displayName: z.string().trim().min(2, 'Nome muito curto').max(40),
  avatarPlayerId: z.string().uuid('Escolha um jogador'),
})

export const predictionSchema = z.object({
  matchId: z.string().uuid(),
  roomId: z.string().uuid(),
  winner: z.string().trim().min(1, 'Informe o vencedor').max(60),
  homeScore: z.coerce.number().int().min(0).max(20),
  awayScore: z.coerce.number().int().min(0).max(20),
  playerOfMatch: z.string().trim().min(1, 'Informe o craque').max(60),
})

export const matchResultSchema = z.object({
  matchId: z.string().uuid(),
  roomId: z.string().uuid(),
  roomCode: z.string().min(1),
  winner: z.string().trim().min(1, 'Informe o vencedor').max(60),
  homeScore: z.coerce.number().int().min(0).max(20),
  awayScore: z.coerce.number().int().min(0).max(20),
  playerOfMatch: z.string().trim().min(1, 'Informe o craque').max(60),
})

export const copaPareSchema = z.object({
  matchId: z.string().uuid(),
  roomId: z.string().uuid(),
  roomCode: z.string().min(1),
  answer: z.string().trim().min(2, 'Resposta muito curta').max(80),
})

export const reshuffleCopaPareLetterSchema = z.object({
  matchId: z.string().uuid(),
  roomId: z.string().uuid(),
  roomCode: z.string().min(1),
})

export const quickReactionSchema = z.object({
  matchId: z.string().uuid(),
  roomId: z.string().uuid(),
  reaction: z.enum(['⚽', '🔥', '😱', '👏', '😂']),
})

export type CreateRoomInput = z.infer<typeof createRoomSchema>
export type JoinRoomInput = z.infer<typeof joinRoomSchema>
export type PredictionInput = z.infer<typeof predictionSchema>
export type MatchResultInput = z.infer<typeof matchResultSchema>
export type CopaPareInput = z.infer<typeof copaPareSchema>
export type QuickReactionInput = z.infer<typeof quickReactionSchema>

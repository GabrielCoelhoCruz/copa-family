import { z } from 'zod'

import { AVATAR_OPTIONS } from '@/lib/avatars'

const avatarKeys = AVATAR_OPTIONS.map((avatar) => avatar.key) as [
  string,
  ...string[],
]

export const createRoomSchema = z.object({
  displayName: z.string().trim().min(2, 'Nome muito curto').max(40),
  avatarKey: z.enum(avatarKeys),
  roomName: z.string().trim().min(2, 'Nome da sala muito curto').max(50),
})

export const joinRoomSchema = z.object({
  roomCode: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z0-9]{6}$/, 'Use exatamente 6 letras ou números, sem espaços.'),
  displayName: z.string().trim().min(2, 'Nome muito curto').max(40),
  avatarKey: z.enum(avatarKeys),
})

export const predictionSchema = z.object({
  matchId: z.string().uuid(),
  roomId: z.string().uuid(),
  winner: z.string().trim().min(1, 'Informe o vencedor'),
  homeScore: z.coerce.number().int().min(0).max(20),
  awayScore: z.coerce.number().int().min(0).max(20),
  playerOfMatch: z.string().trim().min(1, 'Informe o craque'),
})

export const matchResultSchema = z.object({
  matchId: z.string().uuid(),
  roomId: z.string().uuid(),
  roomCode: z.string().min(1),
  winner: z.string().trim().min(1, 'Informe o vencedor'),
  homeScore: z.coerce.number().int().min(0).max(20),
  awayScore: z.coerce.number().int().min(0).max(20),
  playerOfMatch: z.string().trim().min(1, 'Informe o craque'),
})

export const copaPareSchema = z.object({
  matchId: z.string().uuid(),
  roomId: z.string().uuid(),
  roomCode: z.string().min(1),
  userId: z.string().uuid(),
  category: z.enum(['player', 'team', 'coach', 'stadium']),
  answer: z.string().trim().min(2, 'Resposta muito curta').max(80),
})

export type CreateRoomInput = z.infer<typeof createRoomSchema>
export type JoinRoomInput = z.infer<typeof joinRoomSchema>
export type PredictionInput = z.infer<typeof predictionSchema>
export type MatchResultInput = z.infer<typeof matchResultSchema>
export type CopaPareInput = z.infer<typeof copaPareSchema>

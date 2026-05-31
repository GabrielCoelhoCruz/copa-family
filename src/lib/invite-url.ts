import { headers } from 'next/headers'

import { routes } from '@/lib/routes'

export async function getInviteUrl(roomCode: string) {
  const headersList = await headers()
  const host =
    headersList.get('x-forwarded-host') ?? headersList.get('host') ?? 'localhost:3000'
  const protocol =
    headersList.get('x-forwarded-proto') ??
    (process.env.NODE_ENV === 'production' ? 'https' : 'http')

  const code = roomCode.toUpperCase()
  return `${protocol}://${host}${routes.entrar}?code=${code}`
}

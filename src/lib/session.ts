import { cookies } from 'next/headers'

export const GUEST_USER_COOKIE = 'cf_guest_user_id'

export async function getGuestUserId() {
  const cookieStore = await cookies()
  return cookieStore.get(GUEST_USER_COOKIE)?.value ?? null
}

export async function setGuestUserId(userId: string) {
  const cookieStore = await cookies()
  cookieStore.set(GUEST_USER_COOKIE, userId, {
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    sameSite: 'lax',
  })
}

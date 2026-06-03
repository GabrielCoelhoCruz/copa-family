import { headers } from 'next/headers'

import { consumeRateLimit } from '@/lib/rate-limit'

type ActionRateLimitInput = {
  action: string
  identifier?: string | null
  limit: number
  windowMs: number
}

export async function checkActionRateLimit({
  action,
  identifier,
  limit,
  windowMs,
}: ActionRateLimitInput): Promise<{ allowed: boolean; message?: string }> {
  const headersList = await headers()
  const forwardedFor = headersList.get('x-forwarded-for')?.split(',')[0]?.trim()
  const ipAddress =
    forwardedFor ?? headersList.get('x-real-ip') ?? headersList.get('cf-connecting-ip') ?? 'local'
  const safeIdentifier = identifier?.trim() || 'anonymous'
  const result = consumeRateLimit({
    key: `${action}:${safeIdentifier}:${ipAddress}`,
    limit,
    windowMs,
  })

  if (result.allowed) {
    return { allowed: true }
  }

  return {
    allowed: false,
    message: `Muitas tentativas. Aguarde ${result.retryAfterSeconds}s e tente de novo.`,
  }
}

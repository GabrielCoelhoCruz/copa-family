type RateLimitBucket = {
  count: number
  resetAtMs: number
}

type RateLimitStore = Map<string, RateLimitBucket>

type ConsumeRateLimitInput = {
  store?: RateLimitStore
  key: string
  limit: number
  windowMs: number
  nowMs?: number
}

type RateLimitResult = {
  allowed: boolean
  retryAfterSeconds: number
}

const globalRateLimitStore = new Map<string, RateLimitBucket>()

export function createRateLimitStore(): RateLimitStore {
  return new Map<string, RateLimitBucket>()
}

export function consumeRateLimit({
  store = globalRateLimitStore,
  key,
  limit,
  windowMs,
  nowMs = Date.now(),
}: ConsumeRateLimitInput): RateLimitResult {
  const bucket = store.get(key)

  if (!bucket || bucket.resetAtMs <= nowMs) {
    store.set(key, { count: 1, resetAtMs: nowMs + windowMs })
    return { allowed: true, retryAfterSeconds: 0 }
  }

  if (bucket.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAtMs - nowMs) / 1000)),
    }
  }

  bucket.count += 1
  store.set(key, bucket)
  return { allowed: true, retryAfterSeconds: 0 }
}

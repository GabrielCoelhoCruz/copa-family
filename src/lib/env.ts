/**
 * Server-only env accessors. Never import from client components.
 */

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value?.trim()) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value.trim()
}

function optionalEnv(name: string): string | undefined {
  const value = process.env[name]?.trim()
  return value || undefined
}

export function getApiFootballKey(): string {
  if (optionalEnv('API_FOOTBALL_KEY')) {
    return requireEnv('API_FOOTBALL_KEY')
  }
  throw new Error(
    'Missing API_FOOTBALL_KEY (optional unless syncing via api-football provider)'
  )
}

/** TheSportsDB free/premium key (defaults to public test key `3`). */
export function getTheSportsDbApiKey(): string {
  return optionalEnv('THESPORTSDB_API_KEY') ?? '3'
}

/** RapidAPI WC26 Live Football API key (full 104-match schedule). */
export function getWc26RapidApiKey(): string {
  return requireEnv('RAPIDAPI_WC26_KEY')
}

export function getSupabaseServiceRoleKey(): string {
  return requireEnv('SUPABASE_SERVICE_ROLE_KEY')
}

export function getFixtureSyncToken(): string {
  return requireEnv('FIXTURE_SYNC_TOKEN')
}

export function isApiSportsWidgetsEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_API_SPORTS_WIDGETS === 'true'
}

export function getApiSportsWidgetKey(): string | undefined {
  if (!isApiSportsWidgetsEnabled()) return undefined
  return optionalEnv('NEXT_PUBLIC_API_SPORTS_WIDGET_KEY')
}

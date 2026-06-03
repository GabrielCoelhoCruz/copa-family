export const E2E_ENV_SKIP_MESSAGE =
  'Configure .env.local com NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY e SUPABASE_SERVICE_ROLE_KEY'

export const hasE2EEnv =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()) &&
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim()) &&
  Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim())

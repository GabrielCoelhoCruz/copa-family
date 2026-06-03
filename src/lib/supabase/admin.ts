import { createClient } from '@supabase/supabase-js'

import { getSupabaseServiceRoleKey } from '@/lib/env'

/**
 * Service-role Supabase client for trusted server operations (fixture sync).
 * Bypasses RLS — use only in API routes / server scripts, never in the browser.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url?.trim()) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL')
  }

  return createClient(url, getSupabaseServiceRoleKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

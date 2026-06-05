import type { createAdminClient } from '@/lib/supabase/admin'

/** Service-role client used by server actions and scoring helpers. */
export type AdminSupabaseClient = ReturnType<typeof createAdminClient>

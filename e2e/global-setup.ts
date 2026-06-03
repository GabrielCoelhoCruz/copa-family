import { config as loadEnv } from 'dotenv'
import { resolve } from 'node:path'

loadEnv({ path: resolve(__dirname, '../.env.local') })
loadEnv({ path: resolve(__dirname, '../.env') })

import { E2E_ENV_SKIP_MESSAGE, hasE2EEnv } from './env'

async function globalSetup() {
  if (!hasE2EEnv) {
    console.warn(`[e2e] ${E2E_ENV_SKIP_MESSAGE}`)
    return
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!.trim()
  if (!url.startsWith('https://')) {
    throw new Error(
      `[e2e] NEXT_PUBLIC_SUPABASE_URL must be an https URL (got: ${url.slice(0, 32)}...)`
    )
  }
}

export default globalSetup

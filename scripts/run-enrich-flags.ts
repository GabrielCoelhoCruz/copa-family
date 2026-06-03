/**
 * Run flagcdn badge enrichment (no dev server).
 * Usage: npx tsx scripts/run-enrich-flags.ts
 */
import { config } from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
config({ path: path.join(root, '.env.local') })

const required = ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'] as const

for (const name of required) {
  if (!process.env[name]?.trim()) {
    console.error(`Missing ${name} in .env.local`)
    process.exit(1)
  }
}

const { enrichTeamFlagsFromFlagcdn } = await import(
  '../src/features/fixtures/enrich-team-flags'
)

try {
  const result = await enrichTeamFlagsFromFlagcdn()
  console.log(JSON.stringify(result, null, 2))
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
}

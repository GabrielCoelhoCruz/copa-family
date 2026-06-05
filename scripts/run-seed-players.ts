/**
 * Upsert featured players from JSON (no photos).
 * Usage: npx tsx scripts/run-seed-players.ts
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

async function main() {
  const { seedFeaturedPlayers } = await import('../src/features/players/seed-featured-players')
  const result = await seedFeaturedPlayers()
  console.log(JSON.stringify(result, null, 2))
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})

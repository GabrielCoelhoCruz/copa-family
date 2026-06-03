/**
 * @deprecated Use `npm run enrich:flags` (tsx → enrich-team-flags.ts).
 */
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const result = spawnSync(
  'npx',
  ['tsx', path.join(root, 'scripts', 'run-enrich-flags.ts')],
  { stdio: 'inherit', cwd: root, shell: true }
)
process.exit(result.status ?? 1)

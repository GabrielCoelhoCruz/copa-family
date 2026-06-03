/**
 * Reads mcp-payload-{i}.json and prints JSON args for execute_sql (one batch per argv).
 * Usage: node scripts/run-mcp-payloads-exec.mjs 0
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dir = path.dirname(fileURLToPath(import.meta.url))
const i = Number(process.argv[2])
if (!Number.isInteger(i) || i < 0 || i > 7) {
  console.error('Usage: node run-mcp-payloads-exec.mjs <0-7>')
  process.exit(1)
}
const payload = JSON.parse(
  fs.readFileSync(path.join(dir, `mcp-payload-${i}.json`), 'utf8')
)
process.stdout.write(
  JSON.stringify({ project_id: payload.project_id, query: payload.query })
)

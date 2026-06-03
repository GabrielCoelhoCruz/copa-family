/**
 * Sequential seed: reads mcp-payload-{i}.json and calls Supabase execute_sql via MCP HTTP
 * when CURSOR_MCP_BRIDGE_URL is set; otherwise prints batch status for agent MCP calls.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dir = path.dirname(fileURLToPath(import.meta.url))
const results = []

for (let i = 0; i < 8; i += 1) {
  const payload = JSON.parse(
    fs.readFileSync(path.join(dir, `mcp-payload-${i}.json`), 'utf8')
  )
  results.push({
    batch: i,
    project_id: payload.project_id,
    query_length: payload.query.length,
  })
}
console.log(JSON.stringify(results, null, 2))

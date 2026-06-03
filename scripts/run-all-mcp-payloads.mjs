/**
 * Runs mcp-payload-{0..7}.json via Supabase Management API (same backend as MCP execute_sql).
 * Requires: supabase login (token in ~/.supabase/access-token) or SUPABASE_ACCESS_TOKEN.
 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dir = path.dirname(fileURLToPath(import.meta.url))
const projectId = 'hhgbjkdclpqrcajmdadq'

function getAccessToken() {
  if (process.env.SUPABASE_ACCESS_TOKEN) {
    return process.env.SUPABASE_ACCESS_TOKEN
  }
  const tokenPath = path.join(os.homedir(), '.supabase', 'access-token')
  if (fs.existsSync(tokenPath)) {
    return fs.readFileSync(tokenPath, 'utf8').trim()
  }
  return null
}

async function executeSql(query) {
  const token = getAccessToken()
  if (!token) {
    throw new Error(
      'No Supabase access token. Run `supabase login` or set SUPABASE_ACCESS_TOKEN.'
    )
  }
  const res = await fetch(
    `https://api.supabase.com/v1/projects/${projectId}/database/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    }
  )
  const text = await res.text()
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${text}`)
  }
  return text ? JSON.parse(text) : null
}

const results = []
for (let i = 0; i < 8; i += 1) {
  const payload = JSON.parse(
    fs.readFileSync(path.join(dir, `mcp-payload-${i}.json`), 'utf8')
  )
  try {
    await executeSql(payload.query)
    results.push({ batch: i, success: true })
    console.error(`batch ${i}: success`)
  } catch (err) {
    results.push({ batch: i, success: false, error: err.message })
    console.error(`batch ${i}: failure`, err.message)
    break
  }
}

let n = null
if (results.every((r) => r.success)) {
  try {
    const countRows = await executeSql(
      'select count(*)::int as n from public.football_fixtures'
    )
    n = countRows?.[0]?.n ?? countRows?.[0]?.count ?? null
  } catch (err) {
    results.push({ batch: 'count', success: false, error: err.message })
  }
}

console.log(JSON.stringify({ results, n }, null, 2))

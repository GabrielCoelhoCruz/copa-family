# RapidAPI MCP — WC26 Live Football API

Use this for **agent tooling** in Cursor (explore endpoints via MCP). The app sync uses the same API over HTTP with `RAPIDAPI_WC26_KEY` in `.env.local` — do not commit keys.

## Cursor MCP config

Add to your user or project MCP settings (replace `YOUR_RAPIDAPI_KEY`):

```json
{
  "mcpServers": {
    "RapidAPI Hub - WC26 Live Football API": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://mcp.rapidapi.com",
        "--header",
        "x-api-host: wc26-live-football-api.p.rapidapi.com",
        "--header",
        "x-api-key: YOUR_RAPIDAPI_KEY"
      ]
    }
  }
}
```

Reload Cursor after saving. The MCP proxies RapidAPI; your app does **not** need MCP at runtime.

## HTTP endpoints (used by sync)

| Path | Description |
| --- | --- |
| `GET /matches` | Full schedule (~104 matches) |
| `GET /groups` | Groups and team lists |
| `GET /schedule` | Matches grouped by date |
| `GET /live` | Live matches |
| `GET /matches/{id}` | Single match |

Host: `wc26-live-football-api.p.rapidapi.com`

## App sync

```bash
# .env.local
RAPIDAPI_WC26_KEY=your_key
FIXTURE_SYNC_PROVIDER=wc26-rapidapi
SUPABASE_SERVICE_ROLE_KEY=...
FIXTURE_SYNC_TOKEN=...

npm run dev
curl -X POST http://localhost:3000/api/admin/fixtures/sync \
  -H "Authorization: Bearer $FIXTURE_SYNC_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"provider":"wc26-rapidapi","mode":"catalog"}'
```

Rotate any API key that was shared in chat.

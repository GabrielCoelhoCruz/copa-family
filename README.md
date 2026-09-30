# Copa Family

A social game for families and friend groups during the World Cup: predictions, points, rankings, and half-time fun.

## Context for design and code

| File | Purpose |
| --- | --- |
| [PRODUCT.md](./PRODUCT.md) | Audience, voice, anti-references, MVP scope |
| [DESIGN.md](./DESIGN.md) | Tokens, components, routes, anti-patterns (contract for AI tools) |
| [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | Human reference for the design system |
| [AGENTS.md](./AGENTS.md) | Instructions for coding agents in this repo |
| [IMPECCABLE.md](./IMPECCABLE.md) | Commands, ready-made prompts, and the Impeccable workflow |

Visual workflow: [Impeccable — designing](https://impeccable.style/designing/#start) (Start → Iterate → Polish → Maintain).

## Getting started

```bash
cd copa-family
cp .env.example .env.local   # if present; configure Supabase
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Impeccable (design in Cursor)

```bash
npm run design:install   # installs the /impeccable skill in Cursor (Windows-safe)
```

Reload Cursor and use `/impeccable` in chat. Ready-made prompts for the lobby, predictions, and ranking: **[IMPECCABLE.md](./IMPECCABLE.md)**.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run design:install` | Installs the Impeccable skill in `.cursor/skills/` |
| `npm run design:check` | Checks for skill updates |
| `npm run design:detect` | Anti-slop design gate (41 rules, fails CI) |
| `npm run design:ci` | lint + detect + build (local, same as CI) |

## Stack

- Next.js (App Router), TypeScript, Tailwind CSS v4
- shadcn/ui (Base UI)
- Supabase
- Vercel (deploy)

## Deploy and real-world testing

- **[DEPLOY.md](./DEPLOY.md)** — Vercel, env vars, smoke test, CI secrets
- **[TESTE_REAL.md](./TESTE_REAL.md)** — test script with family members before new features
- **[PUBLICAR_E_TESTAR.md](./PUBLICAR_E_TESTAR.md)** — PWA, in-person and remote test formats, funnel

## MVP loop

**create room → join (link/QR) → lobby → predictions → match/half-time → Copa Pare → result → ranking → profile/medals**

| Command | Description |
| --- | --- |
| `npm test` | Unit tests (Vitest) |
| `npm run playwright:install` | Chromium for E2E (first run) |
| `npm run test:e2e` | Playwright mobile 390×844 (`next dev`, ~1.5 min) |
| `npm run test:e2e:ci` | Same as CI: `build` + `next start`, 2 retries |
| `npm run test:e2e:ui` | Playwright UI mode (debug) |
| `npm run design:ci` | lint + detect + build |

### E2E (Playwright)

**Required `.env.local`:** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (server actions use the service role).

```bash
npm run playwright:install
npm run test:e2e
```

Local CI mode (PowerShell): `$env:CI='true'; npm run test:e2e` or `npm run test:e2e:ci` (requires `cross-env`).

App already running: `$env:PLAYWRIGHT_SKIP_WEBSERVER='1'; npm run test:e2e`

| Symptom | Fix |
| --- | --- |
| Tests skipped | Set the 3 Supabase variables in `.env.local` |
| Timeout when creating a room / prediction | Check `SUPABASE_SERVICE_ROLE_KEY` |
| Strict mode on `Palpite` / `10 pts` | Use the helpers in `e2e/helpers.ts` (tabs and `Ranking da sala`) |

Details: [DEPLOY.md](./DEPLOY.md#e2e-playwright).

Analytics live in `src/lib/analytics.ts`. Dev dashboard: `/admin/metricas` with `ENABLE_ADMIN_METRICS=true`.

Routes: `src/lib/routes.ts`. World Cup calendar: `/calendario`. Match sync: see [docs/plans/2026-06-02-world-cup-fixtures.md](./docs/plans/2026-06-02-world-cup-fixtures.md) and [DEPLOY.md](./DEPLOY.md).

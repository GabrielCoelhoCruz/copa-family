# Deploy — Copa Family (Vercel)

## Pré-requisitos

- Conta [Vercel](https://vercel.com)
- Projeto Supabase com migrations aplicadas (`001`–`007`)
- Repositório Git conectado (recomendado)

## Variáveis de ambiente (Vercel)

| Variável | Obrigatória | Descrição |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Sim | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Sim | Chave anon/publishable |
| `ENABLE_ADMIN_METRICS` | Não | `true` habilita `/admin/metricas` (somente dev/staging) |
| `RAPIDAPI_WC26_KEY` | Sync | RapidAPI WC26 — catálogo completo (~104 jogos) |
| `THESPORTSDB_API_KEY` | Sync | TheSportsDB (dev pode usar `3`) |
| `FIXTURE_SYNC_PROVIDER` | Não | `wc26-rapidapi` (padrão), `thesportsdb`, ou `api-football` |
| `API_FOOTBALL_KEY` | Sync | Só se `FIXTURE_SYNC_PROVIDER=api-football` |
| `SUPABASE_SERVICE_ROLE_KEY` | Sim | Service role para server actions validadas, sync e writes sob RLS restritiva |
| `FIXTURE_SYNC_TOKEN` | Sync | Bearer token para `POST /api/admin/fixtures/sync` |
| `WORLD_CUP_SEASON` | Não | Temporada no banco (padrão `2026`) |
| `NEXT_PUBLIC_ENABLE_API_SPORTS_WIDGETS` | Não | `true` para widgets (consome cota por visita) |
| `NEXT_PUBLIC_API_SPORTS_WIDGET_KEY` | Widgets | Chave visível no HTML — restrinja domínios no dashboard |

Copie de `.env.example` para o painel **Settings → Environment Variables** (Production + Preview).

### Sincronizar catálogo da Copa (times, estádios, jogos)

Após deploy, com envs de sync configuradas:

```bash
curl -X POST "https://SEU_DOMINIO/api/admin/fixtures/sync" \
  -H "Authorization: Bearer SEU_FIXTURE_SYNC_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"provider":"wc26-rapidapi","mode":"catalog"}'
```

Local (com `npm run dev`):

```bash
node scripts/sync-world-cup-catalog.mjs --provider=wc26-rapidapi --mode=catalog
```

Depois confira `/calendario` (seleções + jogos) e crie uma sala em `/criar-sala`.

### Retratos de jogadores (avatars)

A migration `007_football_players.sql` cria a tabela e o bucket `player-portraits` (leitura pública).

Ordem local (com `.env.local` e service role):

```bash
npm run seed:players    # importa data/world-cup/featured-players.json (24 jogadores)
npm run sync:players    # TheSportsDB → download → Supabase Storage → photo_url
```

Ou use `/admin/catalogo` (com `ENABLE_ADMIN_METRICS=true`): **Importar lista** e **Sincronizar retratos**.

Antes de abrir criar/entrar sala em produção, confira em `/admin/catalogo` que há pelo menos ~20 jogadores com retrato (`com foto / total`).

Usuários antigos sem `avatar_player_id` veem iniciais do nome até entrarem de novo com um jogador escolhido.

### Runbook de operação do catálogo

Use este roteiro antes de qualquer teste real ou jogo de alta atenção:

1. **Rodar sync** — execute o `curl` acima com `provider="wc26-rapidapi"` e `mode="catalog"` até 24h antes do jogo.
2. **Validar catálogo** — abra `/admin/catalogo` e confira `football_data_sync_runs`: status `completed`, warnings vazios ou acionáveis, e contagem próxima de 104 jogos.
3. **Validar calendário** — abra `/calendario`; jogos sem bandeira, horário ou sede ainda devem aparecer com fallback claro.
4. **Enriquecer flags** — quando houver seleções sem bandeira, rode `npm run enrich:flags` localmente com envs do Supabase e valide `/calendario`.
5. **Plano B manual** — se o provider retornar poucos jogos ou zero jogos perto de teste real, importe JSON revisado via script/admin antes de convidar usuários.
6. **Reverter dado ruim** — rode novo sync com provider confiável ou restaure os registros afetados no Supabase; depois confira uma sala recém-criada com fixture.

## Deploy via CLI

```bash
cd copa-family
npm i -g vercel
vercel login
vercel link
vercel env pull .env.local   # opcional, sync local
vercel --prod
```

## Deploy via Git

1. Push para `main`
2. Importe o repo na Vercel (framework: Next.js, root: `copa-family` se monorepo)
3. Configure as envs acima
4. Deploy automático em cada PR (preview) e merge em `main` (production)

## Smoke test pós-deploy

1. Abrir URL de produção `/`
2. **Criar sala** → lobby com código
3. **QR Code** → painel com imagem
4. **Abrir palpites** → enviar palpite → +10 pts
5. **Ranking** → conferir pontos da partida e acumulado
6. (Dono/co-host) Informar **resultado da partida** → pontos de acerto sem duplicar
7. **Próximo jogo** → criar outra partida na mesma sala
8. **Host resiliente** → promover co-host ou assumir sala após 10 min em staging

## Critérios production-ready

- Migrations `001`–`006` aplicadas.
- `SUPABASE_SERVICE_ROLE_KEY` configurada apenas no servidor.
- `npm run lint`, `npm test`, `npm run build` verdes.
- Smoke mobile cobre criar sala, entrar, palpite, intervalo, Copa Pare, resultado e próximo jogo.
- Usuário fora da sala não consegue gravar palpite, Copa Pare, status ou resultado.
- Resultado salvo duas vezes não duplica pontos.
- `/calendario` carregado com catálogo validado antes de teste real.

## CI (GitHub Actions)

- `quality`: lint, unit tests, `design:detect`, build
- **E2E Playwright não roda no GitHub** — execute localmente: `npm run test:e2e` (ver seção E2E abaixo)

Secrets no GitHub: não são necessários para o CI atual (apenas build/lint/testes unitários).

## E2E (Playwright)

Pré-requisitos: Node 20, `npm ci`, `npm run playwright:install`, `.env.local` com as três variáveis Supabase acima, migration `006_production_security` aplicada.

| Modo | Comando | Servidor |
| --- | --- | --- |
| Dev rápido | `npm run test:e2e` | `next dev` :3000 |
| Igual CI | `npm run test:e2e:ci` ou `$env:CI='true'; npm run test:e2e` (PowerShell) | `build` + `next start` |
| Debug | `npm run test:e2e:ui` | dev |
| App manual | `$env:PLAYWRIGHT_SKIP_WEBSERVER='1'; npm run test:e2e` | você sobe o app |

Suíte: 6 testes em `e2e/` (mobile-chrome 390×844). Helpers compartilhados em `e2e/helpers.ts` — evite seletores ambíguos (`Palpite` vs `Fazer palpite`; pontos sem escopo `Ranking da sala`).

Falha: `npx playwright show-trace test-results/.../trace.zip` e `error-context.md` na pasta do teste.

## Checklist de release

Antes de promover para produção:

1. `npm run lint`
2. `npm test`
3. `npm run design:detect`
4. `npm run build`
5. `npm run test:e2e` com secrets Supabase configurados
6. Smoke test em preview no celular 390×844
7. Sync de catálogo validado em `/admin/catalogo` e `/calendario`
8. Beta wave atual sem P0/P1 aberto em `TESTE_REAL.md`

## Supabase migrations

No SQL Editor ou CLI:

```bash
supabase db push
```

Ordem: `001` → `002` → `003` → `004_world_cup_fixtures.sql` → `005_world_cup_catalog.sql` → `006_production_security.sql`

# Deploy — Copa Family (Vercel)

## Pré-requisitos

- Conta [Vercel](https://vercel.com)
- Projeto Supabase com migrations aplicadas (`001`, `002`, `003`)
- Repositório Git conectado (recomendado)

## Variáveis de ambiente (Vercel)

| Variável | Obrigatória | Descrição |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Sim | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Sim | Chave anon/publishable |
| `ENABLE_ADMIN_METRICS` | Não | `true` habilita `/admin/metricas` (somente dev/staging) |

Copie de `.env.example` para o painel **Settings → Environment Variables** (Production + Preview).

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
5. **Ranking** → lista com pontos
6. (Dono) Informar **resultado da partida** → pontos de acerto

## CI (GitHub Actions)

- `quality`: lint, unit tests, `design:detect`, build
- `e2e-mobile`: Playwright 390×844 (requer secrets Supabase no repositório)

Secrets no GitHub:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

## Supabase migrations

No SQL Editor ou CLI:

```bash
supabase db push
```

Ordem: `001_initial_schema.sql` → `002_analytics_events.sql` → `003_copa_pare_and_badges.sql`

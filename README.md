# Copa Family

Jogo social para famílias e grupos durante a Copa do Mundo — palpites, pontos, ranking e diversão no intervalo.

## Contexto para design e código

| Arquivo | Uso |
| --- | --- |
| [PRODUCT.md](./PRODUCT.md) | Público, voz, anti-referências, escopo do MVP |
| [DESIGN.md](./DESIGN.md) | Tokens, componentes, rotas, anti-patterns (contrato para IA) |
| [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | Referência humana do design system |
| [AGENTS.md](./AGENTS.md) | Instruções para agentes no repositório |
| [IMPECCABLE.md](./IMPECCABLE.md) | Comandos, prompts prontos e roteiro Impeccable |

Workflow visual: [Impeccable — designing](https://impeccable.style/designing/#start) (Start → Iterate → Polish → Maintain).

## Getting started

```bash
cd copa-family
cp .env.example .env.local   # se existir; configurar Supabase
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Impeccable (design no Cursor)

```bash
npm run design:install   # skill /impeccable no Cursor (Windows-safe)
```

Recarregue o Cursor e use `/impeccable` no chat. Prompts prontos para lobby, palpites e ranking: **[IMPECCABLE.md](./IMPECCABLE.md)**.

## Scripts

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run lint` | ESLint |
| `npm run design:install` | Instala skill Impeccable em `.cursor/skills/` |
| `npm run design:check` | Verifica atualização da skill |
| `npm run design:detect` | Gate anti-slop (41 regras, falha CI) |
| `npm run design:ci` | lint + detect + build (local, igual ao CI) |

## Stack

- Next.js (App Router), TypeScript, Tailwind CSS v4
- shadcn/ui (Base UI)
- Supabase
- Vercel (deploy)

## Deploy e teste real

- **[DEPLOY.md](./DEPLOY.md)** — Vercel, envs, smoke test, CI secrets
- **[TESTE_REAL.md](./TESTE_REAL.md)** — roteiro com família antes de novas features

## Loop do MVP

**criar sala → entrar (link/QR) → lobby → palpites → jogo/intervalo → Copa Pare → resultado → ranking → perfil/medalhas**

| Comando | Descrição |
| --- | --- |
| `npm test` | Testes unitários (Vitest) |
| `npm run test:e2e` | Playwright mobile 390×844 (requer `.env.local`) |
| `npm run design:ci` | lint + detect + build |

Analytics centralizados em `src/lib/analytics.ts`. Painel dev: `/admin/metricas` com `ENABLE_ADMIN_METRICS=true`.

Rotas: `src/lib/routes.ts`. Issues: Linear (Copa Family MVP).

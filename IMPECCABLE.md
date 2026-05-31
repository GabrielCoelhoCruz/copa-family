# Impeccable — Copa Family

Guia rápido para usar [Impeccable](https://impeccable.style/designing/) neste repositório. Leia sempre **`PRODUCT.md`** + **`DESIGN.md`** antes de pedir mudanças de UI.

## Instalação (Cursor)

```bash
cd copa-family
npm run design:install    # copia skill para .cursor/skills/impeccable
```

Recarregue o Cursor. No chat: `/impeccable` (lista os 23 subcomandos).

Atalhos úteis (opcional, no chat do Cursor):

```
/impeccable pin polish
/impeccable pin audit
/impeccable pin live
```

Atualizar a skill: `npm run design:install -- --force` (funciona no Windows; o CLI oficial exige `unzip`).

A skill fica versionada em `.cursor/skills/impeccable/` — faça commit para o time usar a mesma versão.

## CLI (sem chat)

| Comando | Uso |
| --- | --- |
| `npm run design:detect` | 41 regras anti-slop em `src/` (falha o CI se violar) |
| `npm run design:check` | Verifica se a skill está instalada / desatualizada |

Extensão Chrome: mesmo detector em staging ou sites externos — [Chrome Web Store](https://impeccable.style/).

## Roteiro por fase do MVP

### Agora (loop sala → palpites → ranking)

| Ordem | Comando | Alvo sugerido |
| --- | --- | --- |
| 1 | `/impeccable polish src/app/sala` | Lobby, tabs, cards |
| 2 | `/impeccable clarify src/app/sala` | Erros, empty states, CTAs em pt-BR |
| 3 | `/impeccable harden src/components/patterns` | Nomes longos, 0 pts, código inválido |
| 4 | `/impeccable audit src/app` | A11y, 390px, touch targets |
| 5 | `/impeccable critique src/app/page.tsx` | Landing ainda parece “festiva” e não genérica? |

Com `npm run dev` aberto:

```
/impeccable live
```

Aponte o picker para o header da sala, `RoomCodeDisplay` ou `PredictionCard` — 3 variantes, aceite uma.

### Antes de merge / release

```bash
npm run lint
npm test
npm run design:detect
npm run build
npm run playwright:install   # primeira vez
npm run test:e2e             # requer .env.local + Supabase
```

No chat: `/impeccable audit src/app` e corrija P0/P1 antes de ship.

### Depois de novas features (fotos, QR, pareamento)

| Comando | Quando |
| --- | --- |
| `/impeccable craft galeria de fotos da sala` | Feature nova end-to-end |
| `/impeccable shape fluxo de pareamento no intervalo` | Planejar UX antes do código |
| `/impeccable document` | Re-sincronizar `DESIGN.md` com tokens e rotas reais |
| `/impeccable consolidate src/` | Mesmo markup 3× → pattern ou token |
| `/impeccable extract src/app/sala` | Extrair repetições para `components/patterns` |

### Disciplinas pontuais

| Comando | Exemplo Copa Family |
| --- | --- |
| `/impeccable typeset` | Hierarquia Bricolage vs Nunito no lobby |
| `/impeccable layout` | Grid de avatares, tabs da sala |
| `/impeccable colorize` | Reforçar verde campo / amarelo troféu sem virar carnaval |
| `/impeccable animate` | Transições em `MatchStatusBadge`, não `transition-all` |
| `/impeccable onboard` | Home → criar/entrar → primeiro palpite (+10 pts) |
| `/impeccable quieter` | Se alguma tela estiver “gritando” demais |

Evite **`bolder`** se a tela já estiver no limite da direção festiva. Não use a skill Anthropic **`frontend-design`** no mesmo projeto (colide com Impeccable — ver `AGENTS.md`).

## Mobile-first (foco principal)

Base de layout: `max-w-md`, padding `p-4`, alvos de toque `min-h-11`. Validar sempre em **390×844** (iPhone 14) e, se possível, **360×640**.

### Já feito (manual + CLI)

| Item | Status |
| --- | --- |
| `npm run design:detect` | OK no CI |
| Copy / harden / polish parcial | Lobby, forms, ranking |
| Touch targets principais | Nav, CTAs, host |
| E2E manual | Criar sala → palpites → ranking |
| `npm test` | Schemas + truncate (Vitest) |

### Impeccable — ordem recomendada (mobile)

| Prioridade | Comando | Por quê |
| --- | --- | --- |
| 1 | `/impeccable adapt src/app` | Revisão explícita mobile-only (thumb zone, overflow, 1 col) |
| 2 | `/impeccable audit src/app` | Score responsive + a11y (P0/P1) em 390px |
| 3 | `/impeccable layout src/app/sala` | Tabs, grid anfitrião 2×2, formulários |
| 4 | `/impeccable onboard` | Home → primeiro palpite sem fricção |
| 5 | `/impeccable live` (dev aberto) | Variantes visuais com viewport estreita |
| 6 | `/impeccable critique src/app` | Hierarquia e clima festivo vs genérico |
| 7 | `/impeccable consolidate` | Antes de fotos/QR |
| Depois | `craft` / `shape` | Só para features novas |

### O que NÃO priorizar agora

- **`bolder` / `overdrive`** — risco de exagerar no festivo
- **`optimize`** — só se Lighthouse mobile reclamar
- **`document`** — quando entrar fotos ou mudar tokens

### Testes (complemento ao Impeccable)

| Tipo | Comando / ferramenta | Cobre |
| --- | --- | --- |
| Anti-slop | `npm run design:detect` | Padrões “AI” no código |
| Unitário | `npm test` | Zod, helpers de UI |
| E2E mobile | `npm run test:e2e` (Playwright 390×844) | Criar sala → palpite → ranking; QR |
| Visual | `/impeccable live` + Chrome ext. | Iteração rápida |

Prompt mobile no Cursor:

```
/impeccable adapt src/app — mobile-only product UI, max-w-md, thumb zone, 390px viewport. Read PRODUCT.md and DESIGN.md. No desktop layouts.
```

## Prompts prontos (copiar no Cursor)

**Lobby**

```
/impeccable polish src/app/sala/[roomCode]/page.tsx — register product, read PRODUCT.md and DESIGN.md. Mobile 390px, Copa festiva without generic SaaS.
```

**Palpites**

```
/impeccable clarify src/app/sala/[roomCode]/palpites and src/components/prediction-form.tsx — pt-BR voice: caloroso, direto, sem hype. Empty state when predictions closed.
```

**Ranking**

```
/impeccable harden src/app/sala/[roomCode]/ranking/page.tsx and RankRow — long display names, zero points, tie scores.
```

**Landing**

```
/impeccable critique src/app/page.tsx — does it match PRODUCT anti-references (no purple gradient, no glassmorphism)?
```

**Manutenção**

```
/impeccable document — refresh DESIGN.md from globals.css and src/components/patterns, keep route table accurate.
```

## Referências

- [Getting started](https://impeccable.style/tutorials/getting-started/)
- [Designing loop](https://impeccable.style/designing/)
- [audit](https://impeccable.style/docs/audit) · [harden](https://impeccable.style/docs/harden) · [onboard](https://impeccable.style/docs/onboard)

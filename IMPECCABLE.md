# Impeccable — Copa Family

Guia rápido para usar [Impeccable](https://impeccable.style/designing/) neste repositório. Leia sempre **`PRODUCT.md`** + **`DESIGN.md`** + **`LAYOUT.md`** antes de pedir mudanças de UI.

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
npm run test:e2e             # .env.local: URL + publishable + SERVICE_ROLE
# CI local: npm run test:e2e:ci  ou  $env:CI='true'; npm run test:e2e
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
| `/impeccable animate` | Motion + visual Copa — ver seção abaixo |
| `/impeccable onboard` | Home → criar/entrar → primeiro palpite (+10 pts) |
| `/impeccable quieter` | Se alguma tela estiver “gritando” demais |

Evite **`bolder`** se a tela já estiver no limite da direção festiva.

**Layout unificado:** shells em `src/components/layouts/` — ver `LAYOUT.md`. Prompt:

```
/impeccable layout src/app src/components/layouts — read LAYOUT.md, DESIGN.md, PRODUCT.md. Mobile 390px, max-w-md, PageStack rhythm, no nested card soup.
```

**frontend-design:** `npm run design:install:frontend` — use com tokens Copa (não SaaS genérico). Ver `AGENTS.md`.

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
| E2E mobile | `npm run test:e2e` (6 testes, 390×844) | Criar sala → palpite → ranking; QR; multiusuário |
| Visual | `/impeccable live` + Chrome ext. | Iteração rápida |

Prompt mobile no Cursor:

```
/impeccable adapt src/app — mobile-only product UI, max-w-md, thumb zone, 390px viewport. Read PRODUCT.md and DESIGN.md. No desktop layouts.
```

## Animações + visual Copa (com `/impeccable animate`)

**Princípio (PRODUCT.md):** festa de Copa **sem** bandeira verde-amarela em todo pixel. Use **campo** (`brand-field`), **troféu** (`brand-trophy`), **céu** (`brand-sky`), **festa** (`brand-party`) + motivos de futebol abstratos (gramado, arco, bola).

### O que já existe no código

| Peça | Onde |
| --- | --- |
| Tokens + keyframes | `src/app/globals.css` — `cf-animate-in`, `cf-stagger-children`, `cf-live-dot`, … |
| Atmosphere | `src/components/patterns/copa-ambient.tsx` |
| Listas | classe `cf-stagger-children` no `ul` + `--cf-i` por item |
| Live | `MatchStatusBadge` → `cf-live-dot` |
| Feedback | `SuccessBanner`, CTAs `.cf-pressable` na home |

### Ordem sugerida com Impeccable

| # | Comando | Foco |
| --- | --- | --- |
| 1 | `/impeccable animate src/app/page.tsx` | Hero + CTAs; uma entrada, não scroll-reveal em tudo |
| 2 | `/impeccable animate src/components/patterns/match-status-badge.tsx` | Troca de status (lobby → live → fim) |
| 3 | `/impeccable animate src/app/sala/[roomCode]/ranking` | Stagger + destaque 1º; celebração sutil em +100 |
| 4 | `/impeccable animate src/components/copa-pare-play.tsx` | Timer urgente + confirmação (+100) |
| 5 | `/impeccable colorize src/components/patterns/copa-ambient.tsx` | Refinar gramado/arco sem poluir |
| 6 | `/impeccable quieter src/app` | Se ficar cansativo, cortar decor |

**Regras ao pedir animate:** 150–250 ms na maior parte; só `transform`/`opacity` em UI; sem `transition-all`; sem bounce/elastic; respeitar `prefers-reduced-motion`. Referência: `.cursor/skills/impeccable/reference/animate.md`.

### Prompt único (copiar)

```
/impeccable animate src/app and src/components/patterns — read PRODUCT.md, DESIGN.md (Motion + Copa visual). Mobile 390px. Use existing cf-* classes in globals.css and CopaAmbient; add purposeful motion on: status changes, success after palpite/resultado, ranking top 3, Copa Pare timer. Football/Copa atmosphere without literal Brazil flag. No page-load choreography on every section.
```

### Momentos de alto impacto (priorize estes)

1. **Status da partida** — pulso ao vivo, transição suave ao encerrar
2. **+10 / +50 / +100** — micro pop no delta de pontos (se existir componente)
3. **Ranking** — stagger na lista; brilho discreto no 1º
4. **Copa Pare** — timer nos últimos 10s; burst leve ao enviar
5. **Home** — `CopaAmbient` + uma entrada no hero (já iniciado)

Evite: fade-on-scroll em cada bloco, confetti em todo clique, animar `width`/`height`.

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

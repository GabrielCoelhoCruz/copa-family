# Copa Family — DESIGN

> Contrato de design para agentes e ferramentas (formato alinhado ao [Impeccable](https://impeccable.style/designing/#start)). Humanos: ver também `DESIGN_SYSTEM.md`.

**Taste Skill (anti-slop landing audit):** status and remaining optional work → [`TASTE-SKILL-AUDIT.md`](./TASTE-SKILL-AUDIT.md) (0 must-fix items as of pass 2).

## Register

**Product UI.** Fluent density on mobile, semantic match states, repeatable patterns. Users finish a task per screen.

## Direction

**Copa festiva organizada:** cores vivas de torcida, cards limpos, hierarquia óbvia. Festa controlada — não carnaval visual.

## Stack

- Next.js App Router, TypeScript, Tailwind v4
- shadcn/ui (`base-nova`, Base UI primitives)
- Tokens: `src/app/globals.css`
- Primitivos: `src/components/ui/*`
- Padrões de produto: `src/components/patterns/*`

## Typography

| Role | Family | Usage |
| --- | --- | --- |
| Display / headings | Bricolage Grotesque | Títulos, placar, timer, ranking |
| Body | Nunito Sans | UI copy, labels, listas |
| Mono | Geist Mono | Código de sala, tracking largo |

Classes: `font-heading`, `font-sans`, `font-mono`.

## Color tokens

Definidos em `:root` e `.dark` em `src/app/globals.css`. Use Tailwind theme aliases (`bg-primary`, `text-brand-party`, etc.), not ad-hoc hex in components.

### Brand

| Token | Tailwind | Use |
| --- | --- | --- |
| `--brand-field` | `brand-field` | CTAs principais, primary |
| `--brand-trophy` | `brand-trophy` | Pontos, celebração, top 1 |
| `--brand-sky` | `brand-sky` | Navegação, palpites abertos |
| `--brand-party` | `brand-party` | Intervalo, festa, CTA destaque |
| `--brand-cream` | `brand-cream` | Fundo quente |

### Match status (always icon + label + color)

| Status | Badge variant | Component |
| --- | --- | --- |
| `lobby` | `match-lobby` | `MatchStatusBadge` |
| `predictions_open` | `match-predictions` | `MatchStatusBadge` |
| `live` | `match-live` | `MatchStatusBadge` (pulse on indicator) |
| `halftime` | `match-halftime` | `MatchStatusBadge` |
| `finished` | `match-finished` | `MatchStatusBadge` |

### Ranking

| Token | Badge variant |
| --- | --- |
| 1º | `rank-gold` |
| 2º | `rank-silver` |
| 3º | `rank-bronze` |

## Motion

- `--duration-fast` 140ms, `--duration-base` 220ms, `--duration-slow` 320ms
- Easing: `--ease-out-strong`, `--ease-in-out-strong`
- Animate `transform` and `opacity` only on interactive UI (Impeccable `/animate`)
- Respect `prefers-reduced-motion` (global in `globals.css`)
- No `transition-all` on new complex components
- Button press: `.cf-pressable` (`scale(0.97)` on `:active`) or `scale(0.98)` on buttons

### Utilities (`globals.css`)

| Class | Uso |
| --- | --- |
| `cf-animate-in` | Entrada de card/banner (220ms) |
| `cf-stagger-children` | Lista com `--cf-i` por item (cap 10) |
| `cf-live-dot` | Indicador ao vivo em `MatchStatusBadge` |
| `cf-ball-float` / `cf-trophy-glow` | Decor em `CopaAmbient` |
| `cf-pressable` | Links/CTAs com feedback de toque |
| `cf-status-swap` | Troca de status (`AnimatedMatchStatusBadge`) |
| `cf-points-pop` | Delta de pontos (`PointsDelta`) |
| `cf-timer-urgent` | Últimos 10s do Copa Pare |
| `cf-rank-gold-glow` | Destaque do 1º no ranking |

### Visual Copa (sem bandeira literal)

- `CopaAmbient` — gramado, arco de gol, bola, brilho troféu (`src/components/patterns/copa-ambient.tsx`)
- `CopaPareSuccess` — tela pós-envio com `variant="celebrate"`
- Variantes: `home`, `sala`, `celebrate` — ver `PRODUCT.md` anti-references

## Components (use these first)

### Primitives (`src/components/ui`)

| Component | Notes |
| --- | --- |
| `Button` | Variants: `default`, `party`, `celebrate`, `success`, `outline`, `secondary`, `ghost`, `destructive`, `link` |
| `Badge` | Match + rank + `points` variants |
| `Card`, `Input`, `Label`, `Avatar`, `Dialog`, `Tabs`, `Separator` | Generic; compose in patterns |

### Patterns (`src/components/patterns`)

| Component | When |
| --- | --- |
| `MatchStatusBadge` | Header da sala, lobby |
| `RoomCodeDisplay` | Convite + copiar link + QR |
| `RoomCodeInput` | Entrar por código |
| `ParticipantRow` | Lista no lobby |
| `HostGameControl` | Anfitrião: status, ações e roteiro compacto |
| `RoomMatchHero` | Hero da partida no game board da sala |
| `RoomProgressLine` | Linha resumo: posição e pontos |
| `CopaPareEventPill` | CTA fixo acima da tab bar quando Copa Pare está ativo |
| `RoundResultCard` | Fechamento pós-ação (palpite, Copa Pare, fim de jogo) |
| `PredictionCard` | Uma pergunta por card |
| `PointsDelta` | +10, +50, +100 |
| `RankRow` | Ranking com top 3 |
| `PhotoTile` | Feed de fotos |
| `CopaPareTimer` | Intervalo |
| `EmptyState` | Listas vazias, erros suaves |
| `ShareScoreCard` | Perfil — compartilhar placar com Web Share/copy |
| `QuickReactionBar` | Sala ao vivo — 5 reações fixas, sem chat |

**Rule:** Do not rebuild domain UI with raw `div` + borders. Extend patterns or add a new pattern file.

## Routes (planned / existing)

| Route | Status | Patterns |
| --- | --- | --- |
| `/` | Done | Landing — `Button`, `Badge` |
| `/calendario` | Done | `FixtureRow`, optional API-Sports league widget |
| `/criar-sala` | Done | `CreateRoomForm` + `FixturePicker` + avatar picker |
| `/entrar` | Done | `JoinRoomForm` + `RoomCodeInput` (`?code=` prefill) |
| `/sala/[roomCode]` | Done | Game board — `RoomMatchHero`, participantes, convite, `HostGameControl` |
| `/sala/[roomCode]/perfil` | Done | Pontos, breakdown, medalhas |
| `/sala/[roomCode]/palpites` | Done | `PredictionForm` / submitted summary |
| `/sala/[roomCode]/ranking` | Done | `RankRow` list |

Route helpers: `src/lib/routes.ts`.

## Layout rules

Full shell map and primitives: **`LAYOUT.md`**.

- Max content width: `max-w-md` via `SiteShell` / `RoomShell`
- Horizontal padding: `var(--site-page-px)` (1rem)
- Section vertical rhythm: `var(--site-section-gap)` via `PageStack` / `PageSection`
- **Sala:** `RoomShell` + `PageStack`; grid layout with scrollable `main` and in-flow bottom tab bar
- **Flow routes:** `FlowPage` (title + back) → form card without duplicate headers
- **Home:** `SiteShell` + `SiteStickyFooter` for CTAs
- **Forms:** `StickyFormSubmit` (thumb zone); palpites uses `withSalaNav`
- Inputs: `h-11`; one primary action per screen section
- Match status visible in room header at all times

## Copy (micro)

- Erros: diretos (“Código inválido”, não “Oops!”)
- Empty states: convite à ação (`EmptyState`)
- Pontos: sempre com sinal explícito (`PointsDelta`, `pt-BR` locale)
- Anfitrião: “Dono”, não “Admin”

## FC Quiz–inspired patterns (hierarchy only)

Borrow from competitive mobile quiz UIs **without** dark/neon reskin:

- One dominant CTA per screen section (`Button` `party` / `celebrate`).
- Slim progress line: position + points (`RoomProgressLine`).
- Answer tiles: full-width choices, clear selected state (`PredictionCard`, Copa Pare).
- Result moment: headline + points delta + two actions (`RoundResultCard`, `CopaPareSuccess`).

Keep **Copa festiva** tokens; do not add coins, ELO, or opponent-vs-you framing for the whole app.

## Anti-patterns (do not ship)

- Purple gradients, glassmorphism, generic SaaS hero
- `transition-all` on cards with many children
- Status communicated by color alone (always + text + icon)
- `scale(0)` enter animations
- Nested cards without purpose
- Geist as display font (body stack only via layout — headings use Bricolage)
- New hex colors in JSX instead of tokens

## Pre-ship checklist (Impeccable polish)

1. **Accessibility:** contrast AA on primary buttons and badges; focus rings visible; touch targets ≥ 44px
2. **Responsive:** test ~390px width; room tabs usable one-handed
3. **Stress:** nomes longos, sala sem participantes, código inválido, 0 pontos no ranking
4. **Detect:** `npx impeccable detect src/` (optional CI gate)
5. **Drift:** if same class combo appears 3×, promote to pattern or token

## Changelog

- **2026-06-02:** Production readiness social/ops — `ShareScoreCard`, `QuickReactionBar`, Copa Pare halftime-first, métricas de host completion/retorno
- **2026-06-02:** Calendário Copa (`/calendario`), `FixturePicker` / `FixtureRow`, widgets API-Sports opcionais
- **2026-06-02:** Vitrine do catálogo — `WorldCupSummaryStrip`, cards com bandeiras e CTA `Criar sala`; `/admin/catalogo` (status + sync server-only); hero da sala com `TeamVersusStrip`; `/criar-sala?fixture=<uuid>`
- **2026-05-31:** QR Code no convite (`RoomQrPanel` expansível); Playwright E2E mobile 390×844
- **2026-05-31:** Impeccable adapt/layout/onboard — bottom sala nav, sticky form CTAs, onboarding na home, inputs 44px
- **2026-05-31:** Polish Impeccable — copy pt-BR, a11y (nav, badges, forms), harden nomes longos, CTAs 44px, erros de servidor
- **2026-05-31:** V1 — Copa festiva tokens, Bricolage + Nunito, patterns layer, landing updated
- **2026-06-01:** Room game board (`RoomMatchHero`, ranking preview, challenges, activity); landing simplified; FC Quiz hierarchy on Copa tokens
- **2026-06-01:** Room nav `Jogo | Palpite | Ranking | Perfil`; Copa Pare via event pill + hero CTA; Jogo simplified

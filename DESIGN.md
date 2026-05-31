# Copa Family — DESIGN

> Contrato de design para agentes e ferramentas (formato alinhado ao [Impeccable](https://impeccable.style/designing/#start)). Humanos: ver também `DESIGN_SYSTEM.md`.

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

- `--duration-fast` 140ms, `--duration-base` 220ms
- Easing: `--ease-out-strong`, `--ease-in-out-strong`
- Animate `transform` and `opacity` only on interactive UI
- Respect `prefers-reduced-motion` (global in `globals.css`)
- No `transition-all` on new complex components
- Button press: `scale(0.98)`, not `translate-y`

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
| `HostControlPanel` | Só dono da sala |
| `PredictionCard` | Uma pergunta por card |
| `PointsDelta` | +10, +50, +100 |
| `RankRow` | Ranking com top 3 |
| `PhotoTile` | Feed de fotos |
| `CopaPareTimer` | Intervalo |
| `EmptyState` | Listas vazias, erros suaves |

**Rule:** Do not rebuild domain UI with raw `div` + borders. Extend patterns or add a new pattern file.

## Routes (planned / existing)

| Route | Status | Patterns |
| --- | --- | --- |
| `/` | Done | Landing — `Button`, `Badge` |
| `/criar-sala` | Done | `CreateRoomForm` + avatar picker |
| `/entrar` | Done | `JoinRoomForm` + `RoomCodeInput` (`?code=` prefill) |
| `/sala/[roomCode]` | Done | Lobby — `RoomCodeDisplay`, `ParticipantRow`, `HostControlPanel` |
| `/sala/[roomCode]/palpites` | Done | `PredictionForm` / submitted summary |
| `/sala/[roomCode]/ranking` | Done | `RankRow` list |

Route helpers: `src/lib/routes.ts`.

## Layout rules

- Max content width: `max-w-md` centered on mobile-first screens (~390px design target)
- Horizontal padding: `p-4` / `px-4`
- **Sala:** fixed bottom tab bar (`RoomShell`, `--sala-tab-bar-height`); content `pb` clears bar + safe area
- **Forms:** primary submit in `StickyFormSubmit` (thumb zone); palpites form uses `withSalaNav` offset
- **Home:** `OnboardingSteps` + sticky bottom CTAs
- Inputs: `h-11` (16px text, no iOS zoom)
- One primary action per screen section
- Match status visible in room header at all times

## Copy (micro)

- Erros: diretos (“Código inválido”, não “Oops!”)
- Empty states: convite à ação (`EmptyState`)
- Pontos: sempre com sinal explícito (`PointsDelta`, `pt-BR` locale)
- Anfitrião: “Dono”, não “Admin”

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

- **2026-05-31:** QR Code no convite (`RoomQrPanel` expansível); Playwright E2E mobile 390×844
- **2026-05-31:** Impeccable adapt/layout/onboard — bottom sala nav, sticky form CTAs, onboarding na home, inputs 44px
- **2026-05-31:** Polish Impeccable — copy pt-BR, a11y (nav, badges, forms), harden nomes longos, CTAs 44px, erros de servidor
- **2026-05-31:** V1 — Copa festiva tokens, Bricolage + Nunito, patterns layer, landing updated

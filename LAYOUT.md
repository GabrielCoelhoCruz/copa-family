# Copa Family — Layout system

Unified layout for the whole app. Implements **Impeccable** (`/impeccable layout`, `adapt`, `onboard`) and **frontend-design** (rhythm, asymmetry, no card soup) on top of `DESIGN.md` tokens.

## Shell map

| Route group | Shell | File |
| --- | --- | --- |
| `/` | `SiteShell` + `SiteStickyFooter` | `src/app/page.tsx` |
| `/calendario` | `SiteShell` + `PageStack` | `src/app/calendario/page.tsx` |
| `/criar-sala`, `/entrar` | `FlowPage` → `FlowLayout` → `SiteShell` | `src/components/layouts/flow-page.tsx` |
| `/sala/[roomCode]/*` | `RoomShell` + `PageStack` | `src/components/room-shell.tsx` |

The default sala route (`/sala/[roomCode]`) is the **room game board**, not a generic lobby. Bottom tabs: **Jogo · Palpite · Ranking · Perfil**. Copa Pare is a route (`/copa-pare`), not a tab; access via hero CTA or `CopaPareEventPill` when live/halftime.
| `/admin/metricas` | `SiteShell` + `PageStack` | `src/app/admin/metricas/page.tsx` |

## Primitives (`src/components/layouts/`)

| Component | Role |
| --- | --- |
| `SiteShell` | `max-w-md`, `min-h-dvh`, ambient (`home` \| `flow` \| `none`), optional footer slot |
| `SiteStickyFooter` | Home CTAs in thumb zone |
| `FlowPage` | Back link + page title + description + children |
| `PageTopBar` | Ghost “Voltar” with arrow |
| `PageStack` | `gap: var(--site-section-gap)` between blocks |
| `PageSection` | Surface card with title/description (`surface` \| `elevated` \| `plain`) |

## Tokens (`globals.css`)

| Token | Value | Use |
| --- | --- | --- |
| `--site-page-px` | `1rem` | Horizontal padding (all shells) |
| `--site-section-gap` | `1rem` | Vertical gap between sections |
| `--sticky-submit-clearance` | `4rem` | Scroll space for sticky form CTAs inside sala `main` |

## Rules

1. **One shell per route group** — do not reimplement `max-w-md` / padding on pages.
2. **Page content** inside sala uses `PageStack` automatically via `RoomShell`.
3. **Sections** use `PageSection` or domain patterns (`PredictionCard`, etc.), not ad-hoc `rounded-2xl border` triplets.
4. **Forms** on flow routes: title on `FlowPage`, fields inside `Card` without duplicate `CardTitle`.
5. **Sticky actions**: `SiteStickyFooter` (home), `StickyFormSubmit` (forms; sticks inside sala `main` scroll area), in-flow bottom nav (`RoomShell` grid).

## Skills

```bash
npm run design:install:all   # Impeccable + frontend-design into .cursor/skills
```

- **Impeccable:** polish, layout, audit, detect — `IMPECCABLE.md`
- **frontend-design:** distinctive UI, anti-template — use with `PRODUCT.md` (Copa festiva, not generic SaaS)
- **taste-skill:** landing/marketing only — `TASTE-SKILL-AUDIT.md`

## Prototype parity (Variação C)

Room chrome matches [`copa-family.html`](../copa-family.html): compact header (code + QR), gold tab bar, glass cards (`StadiumCard`), flow back button (44px circle). See [`PROTOTYPE-PARITY.md`](./PROTOTYPE-PARITY.md).

## Changelog

- **2026-06-04:** Prototype UX parity — stadium patterns, room shell, screen restyles
- **2026-03-31:** Initial layout system (`SiteShell`, `FlowPage`, `PageStack`, `PageSection`)

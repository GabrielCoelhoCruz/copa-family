# Agent instructions — Copa Family

## Before any UI or product work

1. Read `PRODUCT.md` (who, voice, anti-references, MVP scope).
2. Read `DESIGN.md` (tokens, components, routes, anti-patterns).
3. Read `LAYOUT.md` for shells (`SiteShell`, `RoomShell`, `FlowPage`, `PageStack`).
4. For landing polish: `TASTE-SKILL-AUDIT.md`. For distinctive UI craft: `frontend-design` skill (with `PRODUCT.md`, not generic SaaS).
5. Prefer `src/components/layouts` and `src/components/patterns` over ad-hoc markup.

## Design workflow (Impeccable)

Follow https://impeccable.style/designing/#start:

- **Start:** brief is already in `PRODUCT.md`; design contract in `DESIGN.md`.
- **Iterate:** implement in App Router; run `npm run dev`.
- **Polish:** accessibility, copy, stress cases; optional `npx impeccable detect src/`.
- **Maintain:** update `DESIGN.md` when adding tokens or patterns.

Use **Impeccable** as the workflow (`/impeccable layout`, `polish`, `audit`). Use **frontend-design** for craft direction; always override with `PRODUCT.md` + `DESIGN.md` (Copa festiva, not purple SaaS).

## Implementation priorities

1. Supabase schema + env
2. Loop mínimo: criar sala → entrar → game board da sala → palpites → ranking
3. Apply patterns from `DESIGN.md` on each new route
4. Room home (`/sala/[roomCode]`) is match-first; landing (`/`) is create/join only

## Design skills

```bash
npm run design:install:all   # Impeccable + frontend-design → .cursor/skills
```

| Skill | Path | Use |
| --- | --- | --- |
| Impeccable | `.cursor/skills/impeccable/` | Layout, polish, audit, detect — `IMPECCABLE.md` |
| frontend-design | `.cursor/skills/frontend-design/` | Distinctive UI; pair with Copa tokens |
| taste-skill | `.agents/skills/design-taste-frontend/` | Landing/marketing — `TASTE-SKILL-AUDIT.md` |

## Impeccable

- Install skill (Cursor): `npm run design:install` — then reload Cursor, use `/impeccable`
- Prompts and workflow: `IMPECCABLE.md`
- Pre-merge: `npm run design:ci` (lint + detect + build)

## Commands

```bash
npm run dev
npm run lint
npm run build
npm run design:detect
npm run design:ci
```

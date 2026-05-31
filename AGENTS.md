# Agent instructions — Copa Family

## Before any UI or product work

1. Read `PRODUCT.md` (who, voice, anti-references, MVP scope).
2. Read `DESIGN.md` (tokens, components, routes, anti-patterns).
3. Prefer `src/components/patterns` over ad-hoc markup.

## Design workflow (Impeccable)

Follow https://impeccable.style/designing/#start:

- **Start:** brief is already in `PRODUCT.md`; design contract in `DESIGN.md`.
- **Iterate:** implement in App Router; run `npm run dev`.
- **Polish:** accessibility, copy, stress cases; optional `npx impeccable detect src/`.
- **Maintain:** update `DESIGN.md` when adding tokens or patterns.

Do **not** load Anthropic `frontend-design` skill alongside this — vocabulary collides. This project uses Impeccable + `DESIGN.md`.

## Implementation priorities

1. Supabase schema + env
2. Loop mínimo: criar sala → entrar → lobby → palpites → ranking
3. Apply patterns from `DESIGN.md` on each new route

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

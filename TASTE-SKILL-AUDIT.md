# Taste Skill audit — Copa Family

Status after installing [taste-skill](https://github.com/Leonxlnx/taste-skill) (`design-taste-frontend`) and applying two implementation passes (March 2026).

**Skill location:** `.agents/skills/design-taste-frontend/SKILL.md`

---

## TL;DR

| Priority | Count | Action |
| --- | --- | --- |
| **Must fix** | **0** | Nothing blocking ship for audited surfaces |
| **Optional polish** | **0** | Optional items implemented; pass 4 replaced stock-photo visuals with Copa-native UI |
| **Out of scope** | — | Room/product UI; taste-skill defers (Section 13) |

Landing now uses branded football UI motifs instead of placeholder photography.

---

## What was fixed

### Pass 1 (audit action items)

| Item | Surface | Change |
| --- | --- | --- |
| Three equal feature cards | `/` landing | `HomeFeatureBento` — asymmetric 2×2 (Salas tall + two tiles) |
| Middle-dot scoring legend | `/sala/.../ranking` | Three-line `<ul>` instead of `+10 · +50 · +100` |
| Form a11y | `/entrar`, `/criar-sala` | Label → hint → input; `aria-describedby` / `aria-invalid` |
| Em-dash in hero | `/` | Two sentences, no `—` |

### Pass 2 (optional polish)

| Item | Change |
| --- | --- |
| Bento visual diversity | Field stripes, gradients, radial highlights on bento cells |
| Em-dash / `·` in UI copy | PWA banner, sala success, palpites empty, host halftime, admin métricas, match-result scoring |
| Field-level form errors | `action-state.ts` + `FieldError`; Zod + “código não encontrado” map to fields |

---

## Pre-flight: audited surfaces (pass)

These taste-skill checks are **green** for the areas we touched:

- Landing hero stack (≤ 4 elements, CTAs visible, no em-dash)
- Asymmetric bento (not 3 equal cards); 3 cells for 3 features
- Ranking points legend (no multi-dot separators)
- Create/join forms (labels, hints, field errors where applicable)
- Typography (Bricolage + Nunito, not Inter-default)
- OKLCH brand tokens, dark mode, `min-h-dvh`, `prefers-reduced-motion`
- `lucide-react` — **allowed** (project already depends on it; skill Section 3.C override)

---

## Optional polish (pass 3 — done)

### 1. Field-level errors on all guest forms

**Done:** `JoinRoomForm`, `CreateRoomForm`, `PredictionForm`, `MatchResultForm`, `CopaParePlay`  
**Shared:** `action-state.ts`, `field-error.tsx`, `form-a11y.ts` (`fieldDescribedBy`)

### 2. Hero visual on landing

**Done:** `HomeHeroVisual` renders a Copa match-card composition (pitch, score chips, avatars, trophy)  
**Kept:** `CopaAmbient` as atmosphere layer behind the card

### 3. Richer bento cells

**Done:** per-tile football motifs in `HomeFeatureBento` (mini pitch, timer, podium). No stock thumbnails.

### 4. Product screens vs taste-skill scope

Taste-skill is for **landing / portfolio / marketing**, not dense product UI (Section 13). Do **not** force marketing pre-flight on:

- Room lobby, palpites, ranking list, host controls, Copa Pare play UI

For those, keep following `DESIGN.md` + `PRODUCT.md` + Impeccable.

---

## Non-issues (do not “fix”)

| Finding | Why it’s OK |
| --- | --- |
| Em-dashes in **comments** only (`copa-ambient.tsx`, `pwa-install-store.ts`, etc.) | Not user-visible |
| `Sala · {roomCode}` in `room-shell.tsx` | One middle-dot per line (skill allows) |
| `uppercase tracking` on room code input | Typographic tracking for mono code, not a section “eyebrow” |
| `lucide-react` | Explicit project choice + skill override when already in use |
| No scroll-driven motion on landing | `MOTION_INTENSITY ~5`; `cf-animate-in` is sufficient for this PWA |
| `OnboardingSteps` (3 similar rows) | Explainer steps, not banned hero feature cards |

---

## Install / re-run audit

```bash
# Already installed in this repo:
npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"
```

**Design read for this project:** mobile consumer PWA, playful/trustworthy, **Redesign — Preserve**, dials ~**5 / 5 / 4**.

Ask an agent: *“Run TASTE-SKILL-AUDIT.md checklist on `/` only”* — expect no must-fix items unless new UI was added.

---

## Related docs

| Doc | Role |
| --- | --- |
| `DESIGN.md` | Primary design contract (tokens, patterns, routes) |
| `DESIGN_SYSTEM.md` | Token reference |
| `IMPECCABLE.md` | Impeccable workflow (this repo’s main polish tool) |
| `PRODUCT.md` | Voice, scope, anti-references |
| `AGENTS.md` | Agent entrypoint |

Taste-skill **complements** Impeccable; it does not replace `DESIGN.md`. For room/product work, prefer `DESIGN.md`.

---

## Changelog

| Date | Note |
| --- | --- |
| 2026-03-31 | Initial audit + pass 1 fixes |
| 2026-03-31 | Pass 2 polish + this document |
| 2026-03-31 | Pass 3: optional field errors, hero image, bento thumbs |
| 2026-06-01 | Pass 4: remove stock visuals; make landing soccer-first |

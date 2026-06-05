# Prototype parity checklist (390px viewport)

Reference: [`../copa-family.html`](../copa-family.html) · App: `src/`

| Route | Prototype | App page / pattern | Status |
| --- | --- | --- | --- |
| `/` | `FrontDoor.Home` | `home-landing-screen.tsx` | parity pass |
| `/calendario` | `FrontDoor.Calendario` | `calendario-explorer.tsx` | parity pass |
| `/criar-sala` | `FrontDoor.CriarSala` | `create-room-form.tsx` + `fixture-picker-compact.tsx` | parity pass |
| `/entrar` | `FrontDoor.Entrar` | `join-room-form.tsx` | parity pass |
| `/sala/[code]` | `RoomScreens.Jogo` | `sala/page.tsx` + `room-match-hero.tsx` | parity pass |
| `.../palpites` | `RoomScreens.Palpites` | `prediction-form.tsx` | parity pass |
| `.../ranking` | `RoomScreens.Ranking` | `ranking/page.tsx` + `rank-row.tsx` | parity pass |
| `.../copa-pare` | `ExtraScreens.CopaPare` | `copa-pare/*` + `copa-pare-timer.tsx` | parity pass |
| `.../perfil` | `ExtraScreens.Perfil` | `perfil/page.tsx` | parity pass |

## Shared chrome

| Element | Prototype | App | Status |
| --- | --- | --- | --- |
| Room header | Code + QR, subtitle, status | `room-shell.tsx` | parity pass |
| Tab bar | Gold active, ball on Jogo | `room-tab-nav.tsx` | parity pass |
| Copa Pare pill | Gradient + pulse | `copa-pare-event-pill.tsx` | parity pass |
| Flow header | 44px back, 22px title | `flow-page.tsx` | parity pass |
| Sticky CTA footer | Gradient fade | `cf-sticky-footer` + layouts | parity pass |

## Excluded from product

- `PhoneShell` (fake device frame)
- `Director` demo panel

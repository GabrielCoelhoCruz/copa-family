# Roteiro de teste real (GAB-26)

Use este checklist com família ou amigos **antes** de lançar features sociais novas. Registre bugs no Linear com reprodução curta.

## Pré-requisitos

- App em preview ou produção (Vercel) — ver [DEPLOY.md](./DEPLOY.md)
- Migrations `001`, `002`, `003` aplicadas no Supabase
- Pelo menos 3 celulares (ou 1 celular + 2 abas anônimas)

## Roteiro (~20 min)

1. **Criar sala** — um anfitrião cria sala com nome da família.
2. **Convidar** — compartilhar link ou QR; cada pessoa entra com nome e avatar.
3. **Lobby** — anfitrião confere checklist e participantes listados.
4. **Abrir palpites** — status “Palpites abertos”; todos enviam palpite (+10 pts).
5. **Iniciar jogo** — status ao vivo; opcional: abrir intervalo.
6. **Copa Pare** (intervalo) — cada um responde uma categoria (+100 pts).
7. **Resultado** — anfitrião informa vencedor, placar e craque; conferir pontos no ranking.
8. **Ranking final** — empates e nomes longos legíveis; perfil/medalhas conferidos.

## O que observar (North Star)

| Momento | Pergunta |
| --- | --- |
| Antes do jogo | Todos entraram sem fricção? QR funcionou? |
| Intervalo | Alguém abriu o app para Copa Pare? |
| Depois | Ranking gerou conversa? Medalhas fazem sentido? |

## Triagem de bugs

| Severidade | Exemplo | Ação |
| --- | --- | --- |
| P0 | Não entra na sala / não salva palpite | Bloqueia teste; corrigir antes de escalar |
| P1 | Pontos errados após resultado | Corrigir idempotência / scoring |
| P2 | Copy confusa, layout quebrado em um aparelho | Backlog próximo sprint |
| P3 | Polish visual | Após validação do loop |

## Métricas (opcional)

Com `ENABLE_ADMIN_METRICS=true` em staging, abra `/admin/metricas` e confira:

- `room_created`, `room_joined`, `prediction_submitted`
- `qr_opened`, `ranking_viewed`
- `halftime_started`, `copa_pare_submitted`

## Critério de “validado”

- [ ] 1 sala real completou o roteiro sem P0/P1
- [ ] Analytics registram eventos principais
- [ ] Checklist E2E e `npm run design:ci` verdes no CI
- [ ] Bugs P0/P1 triados no Linear

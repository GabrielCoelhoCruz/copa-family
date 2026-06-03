# Roteiro de teste real (GAB-26)

Use este checklist com família ou amigos **antes** de lançar features sociais novas. Registre bugs no Linear com reprodução curta.

## Pré-requisitos

- App em preview ou produção (Vercel) — ver [DEPLOY.md](./DEPLOY.md)
- Migrations `001`–`006` aplicadas no Supabase
- Pelo menos 3 celulares (ou 1 celular + 2 abas anônimas)

## Roteiro (~20 min)

1. **Criar sala** — um anfitrião cria sala com nome da família.
2. **Convidar** — compartilhar link ou QR; cada pessoa entra com nome e avatar.
3. **Lobby** — anfitrião confere checklist e participantes listados.
4. **Abrir palpites** — status “Palpites abertos”; todos enviam palpite (+10 pts).
5. **Iniciar jogo** — status ao vivo; opcional: abrir intervalo.
6. **Copa Pare** (intervalo) — cada um responde uma categoria (+100 pts).
7. **Resultado** — anfitrião informa vencedor, placar e craque; conferir pontos no ranking.
8. **Ranking final** — empates, nomes longos, breakdown e streak legíveis.
9. **Próximo jogo** — anfitrião escolhe outra partida mantendo os membros.
10. **Co-host/assumir sala** — promover alguém ou simular 10 min sem ação do host em staging.

## O que observar (North Star)

| Momento | Pergunta |
| --- | --- |
| Antes do jogo | Todos entraram sem fricção? QR funcionou? |
| Intervalo | Alguém abriu o app para Copa Pare? |
| Depois | Ranking gerou conversa? Medalhas fazem sentido? |
| Próximo jogo | Alguém entendeu que a sala continua? |

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
- [ ] A sala criou um segundo jogo com os mesmos membros
- [ ] Pontuação não duplicou após reenviar/corrigir resultado
- [ ] Co-host ou assumir sala funcionou sem ajuda externa
- [ ] Analytics registram eventos principais
- [ ] Checklist E2E e `npm run design:ci` verdes no CI
- [ ] Bugs P0/P1 triados no Linear

## Beta em 3 ondas

### Onda 1 — 1 sala real

Critério para avançar: uma família completa criar sala → entrar → palpite → Copa Pare → resultado → ranking sem P0/P1. Medir tempo de entrada, taxa de palpite, Copa Pare enviado e ranking visto.

### Onda 2 — 3 a 5 salas simultâneas

Critério para avançar: host completion aceitável em `/admin/metricas`, nenhum bug de pontuação, e feedback do anfitrião registrado com print ou nota curta.

### Onda 3 — jogo real de alta atenção

Critério de go-live: reabertura no intervalo e depois do jogo, sync de catálogo validado, E2E obrigatório no CI, e decisão explícita sobre WhatsApp/PWA ser suficiente sem push.

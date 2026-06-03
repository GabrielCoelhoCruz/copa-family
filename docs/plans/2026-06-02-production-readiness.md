# Production readiness — Copa Family

Este roadmap transforma o MVP validável em produto pronto para beta real e lançamento público. A decisão central continua: jogo social sem cadastro, com sala persistente e anfitrião guiando a partida.

## Decisões

- A sala é o grupo da Copa, não um registro descartável de uma partida.
- O anfitrião continua maestro, mas pode delegar para co-anfitriões.
- Membros podem assumir a sala após 10 minutos sem ação do host.
- Copa Pare é um ritual de intervalo por padrão.
- Pontuação precisa ser idempotente, auditável e clara para o usuário.
- Escritas sensíveis usam server actions validadas e service role; leitura pública cobre dados do jogo.

## Fases 0-4

1. **Governança:** atualizar docs de produto, deploy e teste real com critérios production-ready.
2. **Segurança P0:** derivar identidade do cookie, validar membership, validar vínculo partida-sala, restringir RLS e registrar `permission_denied`.
3. **Scoring:** separar cálculo puro de persistência, recalcular de forma idempotente, adicionar streak de vencedor e metadados em `points`.
4. **Salas persistentes:** expor histórico, ranking da partida e ranking acumulado; criar próximo jogo mantendo membros.
5. **Resiliência do host:** adicionar `co_host`, `last_host_action_at`, promoção pelo dono e assumir sala por inatividade.

## Critérios production-ready

- Usuário fora da sala não envia palpite, Copa Pare, status ou resultado.
- Só dono ou co-anfitrião controla status, resultado e próximo jogo.
- Reenviar/corrigir resultado não duplica pontos.
- Ranking diferencia pontos da partida atual e acumulado da sala.
- Sala continua para outro jogo sem perder participantes.
- Host ausente não bloqueia o grupo.
- `npm run lint`, `npm test` e smoke mobile passam antes de release.

## Fases 5-10 pendentes

- Compartilhar placar e reforçar loop social.
- Operação de calendário com fallback manual.
- Observabilidade e admin metrics de release.
- CI/E2E obrigatório para fluxo multiusuário.
- Abuse prevention leve para zero cadastro.
- Beta em ondas com métricas antes, intervalo e pós-jogo.

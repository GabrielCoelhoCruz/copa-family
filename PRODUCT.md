# Copa Family — PRODUCT

> Contexto de produto para design e implementação. Escrito no espírito do [Impeccable init](https://impeccable.style/designing/#start). Leia junto com `DESIGN.md` antes de gerar UI ou fluxos.

## Register

**Product.** Design serves the task.

Copa Family é app de jogo social durante a Copa: salas, palpites, pontos, ranking e interações em grupo. O usuário está aqui para **participar de uma rodada com a família ou amigos**, não para analisar estatísticas.

## North star

Validar se grupos abrem o app:

- antes do jogo
- no intervalo
- depois do jogo

Se uma feature não ajuda a medir ou aumentar essas aberturas, fica fora do MVP.

## Users

**Primário:** famílias, amigos, churrasco, condomínio — celular na mão, ambiente barulhento, pouca paciência para cadastro.

**Secundário:** escritórios e escolas (mesmo produto, copy pode adaptar depois).

**Anfitrião:** quem criou a sala; controla estados da partida (palpites, ao vivo, intervalo, fim).

**Convidado:** entra com nome + avatar; participa de palpites, fotos e ranking.

## Jobs to be done

1. Criar ou entrar numa sala em segundos.
2. Convidar outras pessoas (link ou QR).
3. Fazer palpites antes do jogo.
4. Acompanhar pontos e ranking durante e depois da partida.
5. Brincar no intervalo (Copa Pare) quando disponível.

## Voice

- Popular e acolhedor, como conversa de sala de estar.
- Competitivo leve, nunca agressivo ou “pro de apostas”.
- Claro em português do Brasil; frases curtas.
- Celebra conquistas com moderação (não hype de startup).

**Exemplos:**

- Bom: “Seu palpite foi salvo. +10 pontos.”
- Ruim: “Parabéns! Você desbloqueou uma experiência incrível.”

## Anti-references

Não parecer:

- Bolão / fantasy / casa de apostas.
- Dashboard admin ou SaaS B2B.
- App genérico com gradiente roxo e glassmorphism.
- Landing de hype (“revolucionário”, “powered by AI”).
- Bandeira verde-amarela literal em todo pixel (Copa festiva ≠ bandeira).

## Product decisions (MVP)

| Decisão | Escolha |
| --- | --- |
| Login | Convidado: nome + retrato de jogador da Copa (24 curados, foto no Storage) |
| Partida | Controle manual do anfitrião |
| Calendário Copa (catálogo Supabase) | Sim — vitrine em `/calendario`; sync em `/admin/catalogo` ou API admin; app lê só Supabase |
| Criar sala a partir de um jogo | Sim — `/criar-sala?fixture=<id>` desde o calendário |
| Placar ao vivo automático | Fora do MVP — anfitrião controla status e resultado |
| Atualização da sala para convidados | Sim — badge, pill Copa Stop e banner in-app via Realtime + fallback (sem push) |
| Cadastro obrigatório | Não |
| Comentários no feed | Não na V1 |
| Limite de fotos | 5 por usuário por partida |

## Product decisions (post-MVP)

| Decisão | Escolha production-ready |
| --- | --- |
| Sala persistente | Sim — a sala representa o grupo da Copa e acumula histórico/ranking entre jogos |
| Co-anfitrião | Sim — dono pode promover membro; co-host conduz status, intervalo, resultado e próximo jogo |
| Host ausente | Membro pode assumir após 10 minutos sem ação do host |
| Compartilhar placar | Planejado para o perfil como loop social leve, sem virar feed ou chat |
| Streak | Multiplicador 1.5x no acerto de vencedor a partir do 3º acerto seguido |
| Copa Pare | Halftime-first: ritual do intervalo por padrão |

## Core loop

Entrar na sala → palpites → intervalo (Copa Pare) → pontos → ranking → voltar no próximo jogo.

## Two surfaces (information architecture)

| Surface | Route | Job |
| --- | --- | --- |
| **Front door** | `/` | Criar sala ou entrar com código. Aquisição, não jogo. |
| **Game board** | `/sala/[roomCode]` | Onde a família passa 95% do tempo: partida, próxima ação, ranking, progresso. |

A aba inicial da sala deve responder, em ordem:

1. **O que está acontecendo?** — título da partida, status, placar se houver.
2. **Quem está jogando?** — preview do ranking e participantes.
3. **O que fazer agora?** — um CTA principal (palpite, Copa Pare, ranking).
4. **Qual é o meu progresso?** — pontos, posição, medalhas na sala.

Evitar cards de “funcionalidades” (Salas, Medalhas, Família) no topo; preferir **verbos** (Fazer palpite, Ver ranking, Copa Pare).

## Métricas mínimas

- `room_created`, `room_joined`, `prediction_submitted`
- `match_started`, `halftime_started`, `match_finished`
- `room_live_status_changed`, `room_live_fallback_poll`, `room_live_channel_error`
- `ranking_viewed`, retorno no próximo jogo

## Fora do escopo (agora)

Chat, vídeo, push, IA narradora, prêmios reais, placar ao vivo automático via API externa (o host ainda controla status; convidados recebem mudanças in-app em tempo quase real).

## Impeccable loop (como usar neste repo)

| Fase | O que fazer |
| --- | --- |
| **Start** | Ler `PRODUCT.md` + `DESIGN.md`; implementar feature com componentes em `src/components/patterns` |
| **Iterate** | Refinar no browser (`npm run dev`); `/impeccable live` com skill instalada (`npm run design:install`) |
| **Polish** | `polish`, `clarify`, `harden`, `audit` — ver `IMPECCABLE.md`; gate: `npm run design:detect` |
| **Maintain** | Atualizar `DESIGN.md`; `/impeccable document` e `consolidate` após novas features |

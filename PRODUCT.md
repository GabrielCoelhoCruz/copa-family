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
| Login | Convidado: nome + avatar |
| Partida | Controle manual do anfitrião |
| API de futebol | Fora do MVP |
| Cadastro obrigatório | Não |
| Comentários no feed | Não na V1 |
| Limite de fotos | 5 por usuário por partida |

## Core loop

Entrar na sala → palpites → intervalo (Copa Pare) → pontos → ranking → voltar no próximo jogo.

## Métricas mínimas

- `room_created`, `room_joined`, `prediction_submitted`
- `match_started`, `halftime_started`, `match_finished`
- `ranking_viewed`, retorno no próximo jogo

## Fora do escopo (agora)

Chat, vídeo, push, IA narradora, prêmios reais, integração com placar ao vivo.

## Impeccable loop (como usar neste repo)

| Fase | O que fazer |
| --- | --- |
| **Start** | Ler `PRODUCT.md` + `DESIGN.md`; implementar feature com componentes em `src/components/patterns` |
| **Iterate** | Refinar no browser (`npm run dev`); `/impeccable live` com skill instalada (`npm run design:install`) |
| **Polish** | `polish`, `clarify`, `harden`, `audit` — ver `IMPECCABLE.md`; gate: `npm run design:detect` |
| **Maintain** | Atualizar `DESIGN.md`; `/impeccable document` e `consolidate` após novas features |

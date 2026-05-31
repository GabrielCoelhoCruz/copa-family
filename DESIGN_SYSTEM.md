# Design System Copa Family

Documentação humana do design system. Para agentes e ferramentas (Impeccable, Cursor, CI), use **`PRODUCT.md`** + **`DESIGN.md`**. Fluxo: [Impeccable — Start](https://impeccable.style/designing/#start).

## Direção

O Copa Family usa a direção visual **Copa festiva**: energia de torcida, cores vivas e clima social, com estrutura limpa para não atrapalhar palpites, lobby e ranking.

O produto deve parecer um jogo de Copa para família e amigos, não um dashboard esportivo. A interface é mobile-first e prioriza o fluxo mínimo: criar sala, convidar pessoas, fazer palpites, acompanhar o intervalo e ver o ranking.

## Princípios

- O estado da partida guia a interface.
- Ações principais precisam ser óbvias em telas pequenas.
- Cores festivas entram como semântica, não como decoração aleatória.
- Celebração aparece em momentos de conquista: sala criada, palpite enviado, pontos ganhos e mudança no ranking.
- Componentes de domínio ficam fora de `components/ui`; primitivos shadcn continuam pequenos.

## Tokens

Os tokens vivem em `src/app/globals.css`.

### Base shadcn

- `background`, `foreground`, `card`, `popover`
- `primary`, `secondary`, `accent`, `muted`
- `destructive`, `border`, `input`, `ring`

### Marca

- `brand-field`: verde campo, usado em CTAs principais.
- `brand-trophy`: amarelo troféu, usado em pontos e celebração.
- `brand-sky`: azul Copa, usado em navegação e ações secundárias.
- `brand-party`: laranja torcida, usado em momentos festivos.
- `brand-cream`: fundo quente do produto.

### Domínio

- `match-lobby`: sala aguardando participantes.
- `match-predictions`: palpites abertos.
- `match-live`: jogo ao vivo.
- `match-halftime`: intervalo e Copa Pare.
- `match-finished`: partida encerrada.
- `points-positive`: ganhos de pontos.
- `rank-gold`, `rank-silver`, `rank-bronze`: ranking e medalhas.

## Tipografia

- Heading: `Bricolage Grotesque`.
- Corpo: `Nunito Sans`.
- Mono: `Geist Mono`, usado em códigos de sala e valores tabulares.

Use `font-heading` para títulos, placares, rankings e chamadas fortes. Use `font-mono` apenas para códigos, IDs e números que precisam alinhar visualmente.

## Componentes

### Primitivos

Os primitivos ficam em `src/components/ui`.

- `Button` inclui variantes `default`, `celebrate`, `party`, `success`, `outline`, `secondary`, `ghost`, `destructive` e `link`.
- `Badge` inclui variantes de status de partida, ranking e pontos.
- `Card`, `Input`, `Avatar` e `Tabs` continuam genéricos.

### Padrões de produto

Os padrões ficam em `src/components/patterns`.

- `MatchStatusBadge`: converte status da partida em cor, ícone e texto.
- `RoomCodeDisplay`: mostra código da sala, link copiável e ação de QR Code.
- `RoomCodeInput`: input mono para entrada por código.
- `ParticipantRow`: participante do lobby com avatar, dono e pontos.
- `HostControlPanel`: ações do anfitrião por status da partida.
- `PredictionCard`: card de pergunta de palpite.
- `PointsDelta`: badge de pontuação ganha.
- `RankRow`: linha de ranking com top 3 destacado.
- `PhotoTile`: foto do feed com autor e curtidas.
- `CopaPareTimer`: timer e categorias do jogo do intervalo.
- `EmptyState`: estados vazios com copy contextual.

## Estados Da Partida

| Estado | Uso visual | Ação principal |
| --- | --- | --- |
| `lobby` | Neutro/azulado | Convidar participantes |
| `predictions_open` | Azul | Enviar palpites |
| `live` | Vermelho controlado | Acompanhar jogo |
| `halftime` | Amarelo/laranja | Jogar Copa Pare |
| `finished` | Verde | Ver ranking e resultado |

## Motion

Animações devem ser rápidas e funcionais.

- Botões e cards clicáveis usam feedback de pressão.
- Badges mudam com transição curta.
- Timer usa barra linear.
- Listas podem usar highlight temporário quando pontos mudam.
- `prefers-reduced-motion` reduz movimentos globais.

Evite `transition-all` em novos componentes complexos, animações longas em ações frequentes e confete em qualquer interação comum.

## Ordem De Implementação

1. Tokens e fontes.
2. Variants mínimos de `Button` e `Badge`.
3. Componentes de produto para lobby, palpites e ranking.
4. Aplicação em landing e próximas telas.
5. Validação mobile, contraste, lint e build.

# Publicar e testar na vida real

Guia prático para levar o Copa Family para família/amigos — além do código, foco em **PWA**, links e formatos de teste.

## Formas de publicar

| Canal | Quando usar | URL |
| --- | --- | --- |
| **Produção (Vercel)** | Teste com família, estável | https://copa-family.vercel.app |
| **Preview (PR)** | Validar mudança antes de merge | URL gerada pela Vercel no PR |
| **Local + ngrok** | Debug ao vivo no sofá | `npm run dev` + túnel HTTPS |

### PWA (instalar no celular)

O app já expõe `manifest`, ícone e banner de instalação na home e no lobby.

**Android (Chrome):** banner “Adicionar à tela inicial” ou menu ⋮ → Instalar app.

**iPhone (Safari):** Compartilhar → **Adicionar à Tela de Início** (banner na home explica isso).

Por que PWA no teste real:

- Ícone na home = mais gente reabre no intervalo
- Tela cheia, sem barra do browser
- Link da sala abre direto no “app”

Limitações atuais (MVP): sem push, sem offline completo — precisa de internet para Supabase.

## Formatos de teste a vera

### 1. Sofá (5–8 pessoas, 20 min)

1. Anfitrião instala PWA e cria sala.
2. Projeta QR na TV ou manda link no WhatsApp.
3. Todos entram, palpitam, anfitrião segue **Status da sala** (próximo passo).
4. Intervalo: todos abrem **Copa Pare** pelo CTA da tela Jogo.
5. Fim: resultado + ranking + perfil/medalhas.
6. Próximo jogo: usar a mesma sala para escolher outra partida.

Observe: tempo para entrar, confusão no lobby, alguém perdeu o intervalo?

### 2. Família remota (assíncrono)

- Anfitrião manda link **24h antes**.
- Palpites abertos no dia do jogo.
- Copa Pare só no intervalo (combinar horário no grupo).
- Ranking depois do jogo.

### 3. Mesa única (1 celular passando)

- Um aparelho por pessoa para entrar (nome + avatar).
- Não compartilhar sessão — cada um precisa do cookie guest.

### 4. Observador (você)

Com `ENABLE_ADMIN_METRICS=true` em staging:

- `/admin/metricas` → funil: sala → entrada → palpite → QR → intervalo → Copa Pare → ranking.

## Checklist rápido do anfitrião

1. Criar sala e instalar PWA  
2. Convidar (QR ou link)  
3. **Abrir palpites**  
4. **Iniciar jogo**  
5. **Abrir intervalo** → avisar: “Aba Copa Pare!”  
6. **Retomar** ou **Encerrar**  
7. Informar **resultado** no lobby  
8. Conferir **ranking**, streak e medalhas
9. Escolher **próximo jogo** na mesma sala
10. Promover **co-anfitrião** se outra pessoa for ajudar

## O que medir (North Star)

- Quantos entraram **antes** do jogo?
- Quantos abriram no **intervalo** (Copa Pare)?
- Quantos viram **ranking** depois?

Use analytics + conversa no grupo. Não precisa dashboard complexo no MVP.

## Problemas comuns

| Sintoma | Causa provável | Ação |
| --- | --- | --- |
| Não instala PWA | iOS só via Safari | Mostrar passo Compartilhar → Tela de Início |
| Link não abre sala | Código errado / sala antiga | Usar link com `?code=` ou QR atual |
| Copa Pare bloqueado | Status não é intervalo | Anfitrião: Abrir intervalo |
| Pontos “estranhos” | Resultado digitado errado | Usar sugestões do formulário de resultado |
| Mesma pessoa 2x no ranking | Dois browsers/nomes | Um dispositivo por jogador |
| Host sumiu | Sem ação por 10 min | Membro usa “Assumir sala” |

## Depois do teste

- Registrar bugs no Linear (P0 = não entra / não pontua).
- Só então priorizar feed de fotos, push, etc.

## Critérios de beta e go-live

1. **Onda 1: 1 sala real** — completa o roteiro sem P0/P1, analytics principais aparecem e todos entendem o Copa Pare no intervalo.
2. **Onda 2: 3 a 5 salas** — host completion em `/admin/metricas` fica aceitável, nenhum bug de pontuação aparece e anfitriões conseguem concluir sem ajuda.
3. **Onda 3: jogo de alta atenção** — usuários voltam no intervalo e depois do jogo, catálogo está validado, CI/E2E obrigatório está verde e o checklist de release em `DEPLOY.md` foi executado.

## Gate production-ready

- `npm run lint`, `npm test` e `npm run build` verdes.
- Supabase com migrations `001`–`006`.
- Service role configurada só no servidor.
- Teste com dois jogos na mesma sala.
- Verificar que não-membro não salva palpite/Copa Pare.
- Verificar que resultado reenviado não duplica pontos.

Ver também: [TESTE_REAL.md](./TESTE_REAL.md), [DEPLOY.md](./DEPLOY.md).

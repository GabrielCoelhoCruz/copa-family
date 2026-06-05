'use client'

import Link from 'next/link'
import {
  Circle,
  Calendar,
  Camera,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Copy,
  Crown,
  Flame,
  Gift,
  Home,
  Info,
  Link2,
  LogOut,
  Medal,
  Minus,
  Pause,
  Pencil,
  Play,
  Plus,
  QrCode,
  Share2,
  SlidersHorizontal,
  Sparkles,
  Star,
  Target,
  Timer,
  Trophy,
  Users,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react'

import {
  DocGrid,
  DocPanel,
  DocSection,
  DocSubLabel,
  DocSwatch,
} from '@/components/design-system/doc-primitives'
import { StadiumCard } from '@/components/design-system/stadium-card'
import { StadiumFlag } from '@/components/design-system/stadium-flag'
import { MatchStatusBadge } from '@/components/patterns/match-status-badge'
import { PointsDelta } from '@/components/patterns/points-delta'
import { Button } from '@/components/ui/button'
import { DESIGN_SYSTEM_MEMBERS } from '@/lib/copa-theme'
import { routes } from '@/lib/routes'
import type { MatchStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

const ICONS: { name: string; Icon: LucideIcon }[] = [
  { name: 'trophy', Icon: Trophy },
  { name: 'target', Icon: Target },
  { name: 'ball', Icon: Circle },
  { name: 'users', Icon: Users },
  { name: 'crown', Icon: Crown },
  { name: 'flame', Icon: Flame },
  { name: 'lightning', Icon: Zap },
  { name: 'medal', Icon: Medal },
  { name: 'star', Icon: Star },
  { name: 'calendar', Icon: Calendar },
  { name: 'home', Icon: Home },
  { name: 'timer', Icon: Timer },
  { name: 'qr', Icon: QrCode },
  { name: 'play', Icon: Play },
  { name: 'pause', Icon: Pause },
  { name: 'check', Icon: Check },
  { name: 'check-circle', Icon: CheckCircle2 },
  { name: 'plus', Icon: Plus },
  { name: 'minus', Icon: Minus },
  { name: 'chevron-left', Icon: ChevronLeft },
  { name: 'chevron-right', Icon: ChevronRight },
  { name: 'share', Icon: Share2 },
  { name: 'copy', Icon: Copy },
  { name: 'link', Icon: Link2 },
  { name: 'edit', Icon: Pencil },
  { name: 'sliders', Icon: SlidersHorizontal },
  { name: 'info', Icon: Info },
  { name: 'x', Icon: X },
  { name: 'camera', Icon: Camera },
  { name: 'gift', Icon: Gift },
  { name: 'logout', Icon: LogOut },
  { name: 'sparkle', Icon: Sparkles },
]

const MATCH_STATUSES: MatchStatus[] = [
  'lobby',
  'predictions_open',
  'live',
  'halftime',
  'finished',
]

function DemoAvatar({
  initial,
  color,
  size,
}: {
  initial: string
  color: string
  size: number
}) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-bold text-white"
      style={{
        width: size,
        height: size,
        background: color,
        fontSize: size * 0.38,
      }}
      aria-hidden
    >
      {initial}
    </div>
  )
}

function DesignSystemScreen() {
  return (
    <div className="min-h-dvh text-white">
      <div className="mx-auto max-w-[1080px] px-7 py-14 pb-[100px]">
        <header className="flex flex-wrap items-center gap-4 border-b border-[var(--cf-card-border-soft)] pb-7">
          <div
            className="flex size-[54px] items-center justify-center rounded-2xl shadow-[0_10px_28px_-10px_rgba(201,162,78,0.6)]"
            style={{ background: 'var(--cf-gold-gradient)' }}
          >
            <Trophy className="size-[30px] text-[var(--cf-ink)]" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="m-0 text-[30px] font-black tracking-tight">
              Copa Family · Design System
            </h1>
            <p className="mt-0.5 text-[14.5px] text-[var(--cf-muted)]">
              Variação C — “Estádio” · verde &amp; ouro · pt-BR · mobile-first
              390×844
            </p>
          </div>
          <div className="text-right">
            <div className="font-mono text-xs text-[var(--cf-gold)]">v1.0</div>
            <div className="mt-0.5 text-[11.5px] text-[var(--cf-faint)]">
              tokens: --cf-* · app integrado
            </div>
          </div>
        </header>

        <p className="mt-6 text-sm text-[var(--cf-muted)]">
          <Link
            href={routes.home}
            className="font-semibold text-[var(--cf-gold)] underline-offset-2 hover:underline"
          >
            ← Voltar ao app
          </Link>
        </p>

        <DocSection
          n="00"
          title="Princípios"
          desc="Três regras que mantêm o app coeso e com energia de torcida — sem virar um bloco verde só."
        >
          <DocGrid min={300}>
            {[
              {
                ic: SlidersHorizontal,
                t: 'Contraste primeiro',
                d: 'Fundo escuro, cards elevados, headline branca. O card principal grita, não sussurra.',
              },
              {
                ic: Crown,
                t: 'Ouro com parcimônia',
                d: 'O dourado é só para campeão, pontuação e o botão principal (CTA).',
              },
              {
                ic: Zap,
                t: 'Diversão > competição',
                d: 'Copa Pare, medalhas, reações. Até quem não entende de futebol pode ganhar.',
              },
            ].map((p) => (
              <DocPanel key={p.t}>
                <div className="mb-3 flex size-[42px] items-center justify-center rounded-xl border border-[var(--cf-gold)]/30 bg-[var(--cf-gold)]/[0.13]">
                  <p.ic className="size-[22px] text-[var(--cf-gold)]" aria-hidden />
                </div>
                <div className="text-base font-extrabold">{p.t}</div>
                <div className="mt-1 text-[13.5px] leading-normal text-[var(--cf-muted)]">
                  {p.d}
                </div>
              </DocPanel>
            ))}
          </DocGrid>
        </DocSection>

        <DocSection
          n="01"
          title="Cores"
          desc="Superfícies escuras para profundidade; o ouro é a cor de ação."
        >
          <DocSubLabel>Superfícies</DocSubLabel>
          <DocGrid>
            <DocSwatch
              name="Fundo"
              token="--cf-bg-solid"
              value="#243018 + hero gradient"
              swatch="var(--cf-bg-gradient)"
              note="base"
            />
            <DocSwatch
              name="Hero (campo)"
              token="--cf-hero"
              value="#243018"
              swatch="var(--cf-hero)"
              note="destaque"
            />
            <DocSwatch
              name="Card"
              token="--cf-card"
              value="glass / #3a4d34 → #2f3d2a"
              swatch="var(--cf-card)"
              note="superfície"
            />
            <DocSwatch
              name="Borda"
              token="--cf-card-border"
              value="white 12%"
              swatch="rgba(255,255,255,0.12)"
            />
          </DocGrid>
          <DocSubLabel>Marca &amp; acentos</DocSubLabel>
          <DocGrid>
            <DocSwatch name="Ouro" token="--cf-gold" value="#e6c577" dark note="CTA" />
            <DocSwatch name="Verde campo" token="--cf-green" value="#3a5a2c" />
            <DocSwatch name="Azul céu" token="--cf-sky" value="#56b3f0" dark />
            <DocSwatch name="Coral" token="--cf-coral" value="#ff6b5e" dark />
            <DocSwatch name="Festa" token="--cf-party" value="#ffd23f" dark />
            <DocSwatch name="Ao vivo" token="--cf-live" value="#5fd07f" dark />
            <DocSwatch name="Tinta" token="--cf-ink" value="#1c2411" note="sobre ouro" />
          </DocGrid>
          <DocSubLabel>Texto</DocSubLabel>
          <DocGrid>
            <DocSwatch name="Texto" token="--cf-text" value="#ffffff" swatch="#fff" dark />
            <DocSwatch name="Suave" token="--cf-muted" value="white 60%" swatch="var(--cf-muted)" />
            <DocSwatch name="Tênue" token="--cf-faint" value="white 38%" swatch="var(--cf-faint)" />
          </DocGrid>
        </DocSection>

        <DocSection
          n="02"
          title="Tipografia"
          desc="Archivo em display e corpo; DM Mono para código da sala."
        >
          <DocPanel>
            {[
              { label: 'Display XL', spec: 'Archivo 900 · 33', size: 33, w: 'font-black', sample: 'Verdadeiro campeão' },
              { label: 'Display L', spec: 'Archivo 900 · 27', size: 27, w: 'font-black', sample: 'É dia de jogo' },
              { label: 'Título', spec: 'Archivo 800 · 22', size: 22, w: 'font-extrabold', sample: 'Mande o palpite' },
              { label: 'Corpo', spec: 'Archivo 600 · 15', size: 15, w: 'font-semibold', sample: 'Palpites e ranking ao vivo.', muted: true },
              { label: 'Label', spec: 'Archivo 800 · 12 · caixa alta', size: 12, w: 'font-extrabold uppercase tracking-wide', sample: 'RANKING DA SALA' },
            ].map((t, i, arr) => (
              <div
                key={t.label}
                className={cn(
                  'flex flex-wrap items-baseline gap-5 py-3.5',
                  i < arr.length - 1 && 'border-b border-[var(--cf-card-border-soft)]'
                )}
              >
                <div className="w-[150px] shrink-0">
                  <div className="text-[13px] font-bold">{t.label}</div>
                  <div className="mt-0.5 font-mono text-[11px] text-[var(--cf-faint)]">{t.spec}</div>
                </div>
                <div
                  className={cn(t.w, t.muted && 'text-[var(--cf-muted)]')}
                  style={{ fontSize: t.size }}
                >
                  {t.sample}
                </div>
              </div>
            ))}
            <div className="flex flex-wrap items-baseline gap-5 pt-4">
              <div className="w-[150px] shrink-0">
                <div className="text-[13px] font-bold">Mono · código</div>
                <div className="mt-0.5 font-mono text-[11px] text-[var(--cf-faint)]">DM Mono 500 · 22</div>
              </div>
              <div className="font-mono text-[22px] font-medium tracking-[0.2em] text-[var(--cf-gold)]">
                COPA-7K2
              </div>
            </div>
          </DocPanel>
        </DocSection>

        <DocSection n="03" title="Espaçamento & raios" desc="Padding de página 18px. Cards 20px, pílulas 30px.">
          <DocSubLabel>Raios</DocSubLabel>
          <div className="flex flex-wrap gap-4">
            {[
              { l: 'sm', v: 12 },
              { l: 'md', v: 14 },
              { l: 'lg', v: 16 },
              { l: 'card', v: 20 },
              { l: 'pill', v: 30 },
            ].map((r) => (
              <div key={r.l} className="text-center">
                <div
                  className="h-16 w-[92px] border border-[var(--cf-card-border)] bg-white/5"
                  style={{ borderRadius: r.v, borderBottomLeftRadius: 0 }}
                />
                <div className="mt-2 text-xs font-bold">{r.l}</div>
                <div className="font-mono text-[11px] text-[var(--cf-faint)]">{r.v}px</div>
              </div>
            ))}
          </div>
        </DocSection>

        <DocSection n="04" title="Iconografia" desc="Lucide 24×24 no app; traço 2px, cantos arredondados.">
          <DocPanel>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(92px,1fr))] gap-1.5">
              {ICONS.map(({ name, Icon }) => (
                <div
                  key={name}
                  className="flex flex-col items-center gap-2 rounded-xl bg-white/[0.02] px-1.5 py-4"
                >
                  <Icon className="size-6 text-[var(--cf-gold)]" aria-hidden />
                  <span className="font-mono text-[10px] text-[var(--cf-faint)]">{name}</span>
                </div>
              ))}
            </div>
          </DocPanel>
        </DocSection>

        <DocSection
          n="05"
          title="Componentes"
          desc="Átomos do produto (Button, Badge, patterns) com tema Estádio."
        >
          <DocSubLabel>Botões</DocSubLabel>
          <DocPanel>
            <div className="flex flex-wrap items-center gap-3.5">
              <Button variant="stadium" className="w-[200px]">
                <Trophy className="size-4" />
                Primário
              </Button>
              <Button variant="stadium-coral" className="w-[200px]">
                <Zap className="size-4" />
                Coral
              </Button>
              <Button variant="stadium-sky" className="w-[180px]">
                <Play className="size-4" />
                Sky
              </Button>
              <Button variant="stadium-ghost" className="w-[170px]">
                <Link2 className="size-4" />
                Ghost
              </Button>
              <Button variant="stadium-dark" className="w-[150px]">
                Dark
              </Button>
              <Button variant="stadium" size="sm" className="h-10 w-[150px] text-sm">
                <Plus className="size-4" />
                Pequeno
              </Button>
            </div>
          </DocPanel>

          <DocSubLabel>Status da partida</DocSubLabel>
          <DocPanel>
            <div className="flex flex-wrap gap-3">
              {MATCH_STATUSES.map((s) => (
                <MatchStatusBadge key={s} status={s} />
              ))}
            </div>
          </DocPanel>

          <DocSubLabel>Cards, avatares &amp; bandeiras</DocSubLabel>
          <DocGrid min={250}>
            <StadiumCard solid glow pad={16}>
              <div className="mb-2.5 flex justify-center">
                <MatchStatusBadge status="predictions_open" />
              </div>
              <div className="flex items-center justify-around">
                <div className="text-center">
                  <StadiumFlag code="BRA" size={40} round className="mx-auto" />
                  <p className="mt-1 text-xs font-bold">Brasil</p>
                </div>
                <span className="font-black text-[var(--cf-gold)]">VS</span>
                <div className="text-center">
                  <StadiumFlag code="ARG" size={40} round className="mx-auto" />
                  <p className="mt-1 text-xs font-bold">Argentina</p>
                </div>
              </div>
            </StadiumCard>
            <StadiumCard pad={16}>
              <p className="mb-3 text-xs font-extrabold tracking-wide text-[var(--cf-muted)] uppercase">
                Avatares
              </p>
              <div className="flex items-center gap-2.5">
                {DESIGN_SYSTEM_MEMBERS.slice(0, 5).map((m) => (
                  <DemoAvatar key={m.id} initial={m.initial} color={m.color} size={40} />
                ))}
              </div>
              <p className="mt-4 mb-2.5 text-xs font-extrabold tracking-wide text-[var(--cf-muted)] uppercase">
                Bandeiras (flagcdn)
              </p>
              <div className="flex flex-wrap gap-2">
                {['BRA', 'ARG', 'FRA', 'POR', 'ESP', 'GER', 'ENG', 'NED'].map((c) => (
                  <StadiumFlag key={c} code={c} size={30} round />
                ))}
              </div>
            </StadiumCard>
          </DocGrid>

          <DocSubLabel>Linha de ranking &amp; pontos</DocSubLabel>
          <DocPanel className="flex flex-col gap-2">
            {DESIGN_SYSTEM_MEMBERS.slice(0, 3).map((m, i) => (
              <div
                key={m.id}
                className={cn(
                  'flex items-center gap-3 rounded-2xl border px-3.5 py-2.5',
                  m.you
                    ? 'border-[var(--cf-gold)]/45 bg-[var(--cf-gold)]/[0.12]'
                    : 'border-[var(--cf-card-border)] bg-[var(--cf-card-solid)]'
                )}
              >
                <span
                  className={cn(
                    'w-[22px] text-center text-base font-extrabold',
                    i < 3 ? 'text-[var(--cf-gold)]' : 'text-[var(--cf-faint)]'
                  )}
                >
                  {i + 1}
                </span>
                <DemoAvatar initial={m.initial} color={m.color} size={36} />
                <span className="flex-1 text-[15px] font-bold">{m.name}</span>
                {i === 0 ? <Crown className="size-[18px] text-[var(--cf-gold)]" aria-hidden /> : null}
                <div className="text-right">
                  <div className="text-lg font-black">{m.roomPts}</div>
                  <div className="text-[9.5px] font-bold text-[var(--cf-faint)]">PTS</div>
                </div>
              </div>
            ))}
            <div className="mt-1.5 flex gap-4 pl-1">
              <PointsDelta value={10} animate={false} />
              <PointsDelta value={50} celebrate animate={false} />
              <PointsDelta value={100} celebrate animate={false} />
            </div>
          </DocPanel>

          <DocSubLabel>Campos &amp; chips</DocSubLabel>
          <DocPanel>
            <input
              defaultValue="Família Coelho"
              className="mb-3.5 h-[54px] w-full rounded-[15px] border-[1.5px] border-[var(--cf-card-border)] bg-[var(--cf-card-solid)] px-4 text-base font-semibold text-white outline-none"
            />
            <div className="flex flex-wrap gap-2">
              {['Vini Jr.', 'Messi', 'Endrick'].map((p, i) => (
                <span
                  key={p}
                  className={cn(
                    'rounded-[20px] border px-3.5 py-2 text-[13.5px] font-bold',
                    i === 0
                      ? 'border-transparent text-[var(--cf-ink)]'
                      : 'border-[var(--cf-card-border)] bg-[var(--cf-card-solid)] text-white'
                  )}
                  style={i === 0 ? { background: 'var(--cf-gold-gradient)' } : undefined}
                >
                  {p}
                </span>
              ))}
            </div>
          </DocPanel>

          <DocSubLabel>Navegação inferior (sala)</DocSubLabel>
          <DocPanel className="overflow-hidden p-0">
            <div className="grid grid-cols-4 bg-[var(--home-chrome-solid)] px-2 py-2.5 pb-2">
              {[
                { Icon: Circle, l: 'Jogo', on: true },
                { Icon: Target, l: 'Palpite', on: false },
                { Icon: Trophy, l: 'Ranking', on: false },
                { Icon: Users, l: 'Perfil', on: false },
              ].map(({ Icon, l, on }) => (
                <div key={l} className="flex flex-col items-center gap-1">
                  <Icon
                    className={cn('size-[23px]', on ? 'text-[var(--cf-gold)]' : 'text-[var(--cf-faint)]')}
                    strokeWidth={on ? 2.4 : 2}
                    aria-hidden
                  />
                  <span
                    className={cn(
                      'text-[11px]',
                      on ? 'font-extrabold text-[var(--cf-gold)]' : 'font-semibold text-[var(--cf-faint)]'
                    )}
                  >
                    {l}
                  </span>
                </div>
              ))}
            </div>
          </DocPanel>
        </DocSection>

        <footer className="mt-[72px] flex flex-wrap justify-between gap-2 border-t border-[var(--cf-card-border-soft)] pt-6 text-[12.5px] text-[var(--cf-faint)]">
          <span>Copa Family · Design System · Variação C</span>
          <span className="font-mono">
            CSS: src/styles/copa-theme.css · rota: {routes.designSystem}
          </span>
        </footer>
      </div>
    </div>
  )
}

export { DesignSystemScreen }

'use client'

import { useEffect } from 'react'
import type { CSSProperties } from 'react'
import Link from 'next/link'
import {
  Calendar,
  ChevronRight,
  Clock3,
  Crown,
  Link2,
  Medal,
  Target,
  Trophy,
  Users,
  Zap,
} from 'lucide-react'

import { LandingGlassCard } from '@/components/patterns/landing-glass-card'
import { LandingPitchPreview } from '@/components/patterns/landing-pitch-preview'
import { PwaInstallBanner } from '@/components/pwa-install-banner'
import { buttonVariants } from '@/components/ui/button'
import { ANALYTICS_EVENTS } from '@/lib/analytics-events'
import { trackClientEvent } from '@/lib/analytics-client'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils'

const DEMO_AVATAR_COLORS = [
  '#3b82f6',
  '#ec4899',
  '#10b981',
  '#f59e0b',
  '#8b5cf6',
] as const

const ROOM_PREVIEW_MEMBERS = [
  { id: 'lu', initial: 'L', color: '#3b82f6' },
  { id: 'ma', initial: 'M', color: '#ec4899' },
  { id: 'vi', initial: 'V', color: '#10b981' },
  { id: 'pe', initial: 'P', color: '#f59e0b' },
] as const

const HOW_IT_WORKS = [
  {
    n: 1,
    title: 'Convide a família',
    description: 'Crie a sala e mande o código no grupo.',
    icon: Users,
  },
  {
    n: 2,
    title: 'Chute os placares',
    description: 'Antes de cada jogo da Copa.',
    icon: Target,
  },
  {
    n: 3,
    title: 'Dispute o topo',
    description: 'Acertou? Sobe no ranking da família.',
    icon: Crown,
  },
] as const

const POINTS_GRID = [
  { icon: Target, title: 'Acertar palpite', pts: '+10 a +100', color: 'var(--home-gold)' },
  { icon: Zap, title: 'Copa Pare', pts: '+100', color: 'var(--home-coral)' },
  { icon: Medal, title: 'Conquistas', pts: 'medalhas', color: 'var(--home-sky)' },
  { icon: Crown, title: 'Sequência de vitórias', pts: '1.5×', color: 'var(--home-party)' },
] as const

function DemoAvatar({
  initial,
  color,
  size = 26,
  className,
  style,
}: {
  initial: string
  color: string
  size?: number
  className?: string
  style?: CSSProperties
}) {
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full border-2 border-[var(--home-ink)] font-extrabold text-white shadow-[0_2px_8px_rgba(0,0,0,0.3)]',
        className
      )}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.42,
        background: `linear-gradient(150deg, ${color}, ${color}bb)`,
        ...style,
      }}
    >
      {initial}
    </div>
  )
}

function HomeLandingScreen() {
  useEffect(() => {
    void trackClientEvent({ eventName: ANALYTICS_EVENTS.landingViewed })
  }, [])

  return (
    <div
      className={cn(
        'relative mx-auto flex min-h-dvh w-full max-w-md flex-col font-sans text-white'
      )}
    >
      <div className="relative z-10 flex min-h-dvh flex-col">
        <main className="space-y-0 px-[18px] pb-0 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <div className="cf-animate-in space-y-3.5">
            <LandingGlassCard
              pad="none"
              className="relative overflow-hidden px-[22px] pt-5 pb-[22px]"
            >
              <div
                className="pointer-events-none absolute -top-12 -right-8 size-[150px] rounded-full bg-[radial-gradient(circle,rgba(217,189,128,0.2),transparent_70%)]"
                aria-hidden
              />
              <div className="relative mb-4 flex items-center gap-[7px]">
                <Trophy className="size-[18px] text-[var(--home-gold)]" aria-hidden />
                <h1 className="text-[15px] font-black tracking-[0.5px] text-[var(--home-gold)]">
                  Copa Family
                </h1>
              </div>
              <p className="relative text-[27px] font-black leading-[1.08] tracking-[-0.5px] text-white">
                Descubra quem é o{' '}
                <span className="text-[var(--home-gold)]">verdadeiro campeão</span> da
                família.
              </p>
              <p className="relative mt-3 text-[15px] leading-[1.45] text-[var(--home-muted)]">
                Palpites, desafios e ranking ao vivo durante os jogos da Copa.
              </p>
            </LandingGlassCard>

            <LandingGlassCard pad="none" className="p-3.5">
              <div className="mb-2.5 flex items-center justify-between gap-2 px-0.5">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--home-live)]">
                  <span className="size-[7px] rounded-full bg-[var(--home-live)] shadow-[0_0_8px_var(--home-live)] cf-live-dot" />
                  Palpites abertos
                </span>
                <span className="inline-flex items-center gap-[5px] text-xs text-[var(--home-muted)]">
                  <Clock3 className="size-[13px] text-[var(--home-gold)]" aria-hidden />
                  Fecha em <strong className="text-white">12:34</strong>
                </span>
              </div>

              <LandingPitchPreview />

              <div className="mt-3 flex items-center gap-2.5 px-0.5">
                <div className="flex">
                  {ROOM_PREVIEW_MEMBERS.map((member, index) => (
                    <DemoAvatar
                      key={member.id}
                      initial={member.initial}
                      color={member.color}
                      className={cn(index > 0 && '-ml-[9px]')}
                      style={{ zIndex: 9 - index }}
                    />
                  ))}
                </div>
                <p className="flex-1 text-[12.5px] text-[var(--home-muted)]">
                  <strong className="text-white">4 da família</strong> já palpitaram ·
                  falta você
                </p>
                <ChevronRight className="size-4 shrink-0 text-[var(--home-faint)]" aria-hidden />
              </div>
            </LandingGlassCard>

            <LandingGlassCard pad="none" className="relative overflow-hidden p-4">
              <div
                className="pointer-events-none absolute -top-10 -right-8 size-[120px] rounded-full bg-[radial-gradient(circle,rgba(217,189,128,0.16),transparent_70%)]"
                aria-hidden
              />
              <div className="relative flex items-center gap-[11px]">
                <div className="flex size-[42px] shrink-0 items-center justify-center rounded-[13px] border border-[var(--home-gold)]/30 bg-[var(--home-gold)]/14">
                  <Users className="size-[22px] text-[var(--home-gold)]" aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[16.5px] font-extrabold leading-tight text-white">
                    Toda família tem um campeão
                  </p>
                  <p className="mt-0.5 text-[12.5px] text-[var(--home-muted)]">
                    Mais de <strong className="text-white">8 mil famílias</strong> já jogam
                    a Copa juntas.
                  </p>
                </div>
              </div>
              <div className="relative mt-4 flex items-center gap-3">
                <div className="flex">
                  {DEMO_AVATAR_COLORS.map((color, index) => (
                    <div
                      key={color}
                      className={cn(
                        'flex size-[34px] items-center justify-center rounded-full border-2 border-[var(--home-ink)] bg-gradient-to-br shadow-[0_2px_8px_rgba(0,0,0,0.3)]',
                        index > 0 && '-ml-2.5'
                      )}
                      style={{
                        zIndex: 6 - index,
                        background: `linear-gradient(150deg, ${color}, ${color}bb)`,
                      }}
                    >
                      <Users className="size-4 text-white/92" aria-hidden />
                    </div>
                  ))}
                </div>
                <p className="flex flex-1 items-center gap-1.5 text-[12.5px] text-[var(--home-muted)]">
                  <Crown className="size-[15px] shrink-0 text-[var(--home-gold)]" aria-hidden />
                  No fim, só sobra um campeão.
                </p>
              </div>
            </LandingGlassCard>
          </div>

          <section
            className="cf-animate-in mt-[26px]"
            style={{ animationDelay: '80ms' }}
            aria-labelledby="como-funciona-heading"
          >
            <h2 id="como-funciona-heading" className="mb-3 text-[19px] font-extrabold text-white">
              Como funciona
            </h2>
            <ol className="flex flex-col gap-2.5">
              {HOW_IT_WORKS.map((step) => {
                const Icon = step.icon
                return (
                  <li key={step.n} className="flex items-center gap-3">
                    <div className="relative flex size-[46px] shrink-0 items-center justify-center rounded-[14px] border border-white/16 bg-white/[0.055]">
                      <Icon className="size-[22px] text-[var(--home-gold)]" aria-hidden />
                      <span className="home-step-badge absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full text-[11px] font-extrabold">
                        {step.n}
                      </span>
                    </div>
                    <div>
                      <p className="text-[15.5px] font-extrabold text-white">{step.title}</p>
                      <p className="mt-0.5 text-[13px] text-[var(--home-muted)]">
                        {step.description}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ol>
          </section>

          <section
            className="cf-animate-in mt-[26px]"
            style={{ animationDelay: '120ms' }}
            aria-labelledby="recursos-heading"
          >
            <h2 id="recursos-heading" className="text-[19px] font-extrabold text-white">
              O que vale pontos?
            </h2>
            <p className="mt-0.5 mb-3 text-[13.5px] text-[var(--home-muted)]">
              Não é só palpite — é a família inteira na zoeira.
            </p>

            <ul className="grid grid-cols-2 gap-2.5">
              {POINTS_GRID.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.title}>
                    <LandingGlassCard pad="none" className="p-3.5">
                      <span
                        className="mb-2.5 flex size-[38px] items-center justify-center rounded-[11px] border"
                        style={{
                          background: `color-mix(in srgb, ${item.color} 12%, transparent)`,
                          borderColor: `color-mix(in srgb, ${item.color} 33%, transparent)`,
                        }}
                      >
                        <Icon className="size-5" style={{ color: item.color }} aria-hidden />
                      </span>
                      <p className="text-sm font-extrabold text-white">{item.title}</p>
                      <p
                        className="mt-0.5 text-[13px] font-extrabold"
                        style={{ color: item.color }}
                      >
                        {item.pts}
                      </p>
                    </LandingGlassCard>
                  </li>
                )
              })}
            </ul>

            <Link
              href={routes.calendario}
              className="cf-pressable mt-4 flex h-[50px] w-full items-center justify-center gap-2 rounded-[14px] border border-white/16 bg-white/[0.055] text-sm font-bold text-white"
            >
              <Calendar className="size-[18px] text-[var(--home-gold)]" aria-hidden />
              Ver calendário da Copa
              <ChevronRight className="size-4 text-[var(--home-faint)]" aria-hidden />
            </Link>
          </section>

          <PwaInstallBanner variant="on-pitch" className="mt-6" />
        </main>

        <footer className="home-landing-footer sticky bottom-0 z-20 shrink-0 px-[18px] pb-[max(1rem,env(safe-area-inset-bottom))] pt-3.5">
          <div className="space-y-2.5">
            <Link
              href={routes.criarSala}
              onClick={() => {
                void trackClientEvent({ eventName: ANALYTICS_EVENTS.landingCreateRoomClicked })
              }}
              className={cn(
                buttonVariants({ size: 'lg' }),
                'cf-pressable home-cta-gold flex h-14 w-full items-center justify-center gap-[9px] rounded-[32px] border-0 text-[17px] font-bold tracking-[0.2px]'
              )}
            >
              <Trophy className="size-[19px]" aria-hidden />
              Criar sala
            </Link>
            <div className="h-2.5" aria-hidden />
            <Link
              href={routes.entrar}
              onClick={() => {
                void trackClientEvent({ eventName: ANALYTICS_EVENTS.landingJoinClicked })
              }}
              className={cn(
                buttonVariants({ variant: 'outline', size: 'lg' }),
                'cf-pressable home-cta-ghost flex min-h-14 w-full items-center justify-center gap-[9px] rounded-[32px] text-[17px] font-bold tracking-[0.2px]'
              )}
            >
              <Link2 className="size-[17px]" aria-hidden />
              Entrar
            </Link>
            <p className="mt-2.5 text-center text-xs text-[var(--home-faint)]">
              Sem cadastro · comece em menos de 1 minuto
              {' · '}
              <Link
                href={routes.privacidade}
                className="text-[var(--home-muted)] underline-offset-2 hover:text-[var(--home-gold)] hover:underline"
              >
                Privacidade
              </Link>
              {' · '}
              <Link
                href={routes.designSystem}
                className="text-[var(--home-muted)] underline-offset-2 hover:text-[var(--home-gold)] hover:underline"
              >
                Design system
              </Link>
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}

export { HomeLandingScreen }

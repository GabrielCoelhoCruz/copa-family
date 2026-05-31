import { Target, Trophy, Users } from 'lucide-react'

const STEPS = [
  {
    icon: Users,
    title: 'Crie ou entre',
    description: 'Nome e avatar. Sem senha.',
  },
  {
    icon: Target,
    title: 'Mande o palpite',
    description: 'Antes do jogo começar.',
  },
  {
    icon: Trophy,
    title: 'Veja o ranking',
    description: 'Quem lidera a torcida.',
  },
] as const

function OnboardingSteps() {
  return (
    <ol className="grid w-full gap-2 text-left">
      {STEPS.map((step, index) => {
        const Icon = step.icon
        return (
          <li
            key={step.title}
            className="flex items-start gap-3 rounded-xl border border-border/70 bg-card/60 px-3 py-2.5"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/15 font-heading text-sm font-bold text-primary">
              {index + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 font-semibold text-foreground">
                <Icon className="size-4 text-brand-party" aria-hidden />
                {step.title}
              </p>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

export { OnboardingSteps }

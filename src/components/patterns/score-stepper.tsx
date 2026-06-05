'use client'

import { Minus, Plus } from 'lucide-react'

import { StadiumFlag } from '@/components/patterns/stadium-flag'

const stepButtonClass =
  'flex size-10 items-center justify-center rounded-full border border-[var(--cf-card-border)] bg-[var(--cf-glass)]'

type ScoreStepperProps = {
  teamName: string
  value: number
  onChange: (value: number) => void
  max?: number
}

function ScoreStepper({ teamName, value, onChange, max = 15 }: ScoreStepperProps) {
  return (
    <div className="flex-1 text-center">
      <StadiumFlag teamName={teamName} size={44} round className="mx-auto" />
      <div className="mt-3 flex items-center justify-center gap-2.5">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - 1))}
          className={stepButtonClass}
          aria-label="Diminuir gols"
        >
          <Minus className="size-[18px] text-[var(--cf-gold)]" aria-hidden />
        </button>
        <div className="w-[46px] font-heading text-[46px] font-black leading-none tabular-nums">
          {value}
        </div>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          className={stepButtonClass}
          aria-label="Aumentar gols"
        >
          <Plus className="size-[18px] text-[var(--cf-gold)]" aria-hidden />
        </button>
      </div>
    </div>
  )
}

export { ScoreStepper }

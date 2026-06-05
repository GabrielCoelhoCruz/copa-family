import { PartyPopper } from 'lucide-react'

import { CopaAmbient } from '@/components/patterns/copa-ambient'
import { RoundResultCard } from '@/components/patterns/round-result-card'
import { POINTS } from '@/features/points/rules'
import { routes } from '@/lib/routes'

type CopaPareSuccessProps = {
  categoryLabel?: string
  answer?: string
  letter?: string | null
  rankingHref: string
  roomCode: string
}

function CopaPareSuccess({
  categoryLabel,
  answer,
  letter,
  rankingHref,
  roomCode,
}: CopaPareSuccessProps) {
  const descriptionParts: string[] = []
  if (letter && categoryLabel) {
    descriptionParts.push(`${categoryLabel} · letra ${letter}`)
  } else if (categoryLabel) {
    descriptionParts.push(categoryLabel)
  }
  if (answer) {
    descriptionParts.push(answer)
  }

  const description =
    descriptionParts.length > 0
      ? descriptionParts.join(' — ')
      : 'Resposta registrada nesta rodada.'

  return (
    <div className="relative flex flex-col gap-4 overflow-hidden">
      <CopaAmbient variant="celebrate" />
      <div className="relative z-10">
        <RoundResultCard
          title="Você entrou no Copa Stop!"
          description={description}
          points={POINTS.copaPareParticipation}
          pointsHint={`+${POINTS.copaPareUnique} se ninguém repetir sua resposta`}
          primaryHref={rankingHref}
          primaryLabel="Ver ranking"
          secondaryHref={routes.sala(roomCode)}
          secondaryLabel="Voltar ao jogo"
          icon={<PartyPopper className="size-7" aria-hidden />}
        />
      </div>
    </div>
  )
}

export { CopaPareSuccess }

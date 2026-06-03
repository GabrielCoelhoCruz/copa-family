import { PartyPopper } from 'lucide-react'

import { CopaAmbient } from '@/components/patterns/copa-ambient'
import { RoundResultCard } from '@/components/patterns/round-result-card'
import { POINTS } from '@/features/points/rules'
import { routes } from '@/lib/routes'

type CopaPareSuccessProps = {
  categoryLabel?: string
  answer?: string
  rankingHref: string
  roomCode: string
}

function CopaPareSuccess({
  categoryLabel,
  answer,
  rankingHref,
  roomCode,
}: CopaPareSuccessProps) {
  const description =
    categoryLabel && answer
      ? `${categoryLabel}: ${answer}`
      : 'Resposta registrada nesta rodada.'

  return (
    <div className="relative flex flex-col gap-4 overflow-hidden">
      <CopaAmbient variant="celebrate" />
      <div className="relative z-10">
        <RoundResultCard
          title="Você entrou no Copa Pare!"
          description={description}
          points={POINTS.copaPareParticipation}
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

'use client'

import { useMemo, useState } from 'react'
import { Share2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { buildScoreShareText } from '@/lib/share-text'

type ShareScoreCardProps = {
  displayName: string
  roomName: string
  position: number | null
  points: number
  predictionCount: number
  copaPareCount: number
  inviteUrl: string
}

function ShareScoreCard({
  displayName,
  roomName,
  position,
  points,
  predictionCount,
  copaPareCount,
  inviteUrl,
}: ShareScoreCardProps) {
  const [feedback, setFeedback] = useState<string | null>(null)
  const shareText = useMemo(
    () =>
      buildScoreShareText({
        displayName,
        roomName,
        position,
        points,
        predictionCount,
        copaPareCount,
        inviteUrl,
      }),
    [copaPareCount, displayName, inviteUrl, points, position, predictionCount, roomName]
  )

  const handleShare = async () => {
    setFeedback(null)

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Meu placar na ${roomName}`,
          text: shareText,
          url: inviteUrl,
        })
        setFeedback('Placar compartilhado.')
        return
      } catch {
        setFeedback(null)
      }
    }

    await navigator.clipboard.writeText(shareText)
    setFeedback('Texto copiado para compartilhar.')
  }

  return (
    <section
      className="cf-animate-in rounded-2xl border border-brand-trophy/35 bg-gradient-to-br from-brand-trophy/15 via-card to-card p-4 shadow-md shadow-brand-trophy/10"
      aria-labelledby="share-score-heading"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Loop da família
      </p>
      <h2 id="share-score-heading" className="mt-1 font-heading text-xl font-black">
        Compartilhar meu placar
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Mostre sua posição e chame mais gente para palpitar e voltar no intervalo.
      </p>

      <div className="mt-3 rounded-xl border border-border/70 bg-background/70 px-3 py-3 text-sm">
        <p className="font-semibold">{displayName}</p>
        <p className="font-heading text-2xl font-black text-brand-trophy">
          {points.toLocaleString('pt-BR')} pts
        </p>
        <p className="text-muted-foreground">
          {position != null ? `${position}º lugar` : 'Sem posição ainda'} · {predictionCount}{' '}
          palpite(s) · {copaPareCount} Copa Pare
        </p>
      </div>

      <Button
        type="button"
        variant="celebrate"
        className="cf-pressable mt-3 min-h-12 w-full"
        onClick={handleShare}
      >
        <Share2 className="size-4" aria-hidden />
        Compartilhar meu placar
      </Button>

      {feedback ? (
        <p className="mt-2 text-center text-xs font-medium text-muted-foreground" role="status">
          {feedback}
        </p>
      ) : null}
    </section>
  )
}

export { ShareScoreCard }

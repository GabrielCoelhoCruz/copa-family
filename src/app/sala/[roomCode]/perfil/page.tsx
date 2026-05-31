import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Medal, User } from 'lucide-react'

import { EmptyState } from '@/components/patterns/empty-state'
import { ParticipantRow } from '@/components/patterns/participant-row'
import { getUserRoomProfile, getRoomContext } from '@/features/rooms/queries'
import { BADGE_DEFINITIONS, getEarnedBadgeIds } from '@/lib/badges'
import { getAvatarFallback } from '@/lib/avatars'
import { routes } from '@/lib/routes'
import { getGuestUserId } from '@/lib/session'
import { cn } from '@/lib/utils'

type PerfilPageProps = {
  params: Promise<{ roomCode: string }>
}

export default async function PerfilPage({ params }: PerfilPageProps) {
  const { roomCode } = await params
  const context = await getRoomContext(roomCode)

  if (!context) {
    notFound()
  }

  const userId = await getGuestUserId()
  if (!userId) {
    return (
      <EmptyState
        icon={<User className="size-6" />}
        title="Perfil indisponível"
        description="Entre na sala pelo link de convite para ver seu perfil."
      />
    )
  }

  const profile = await getUserRoomProfile(context.room.id, userId)
  if (!profile) {
    notFound()
  }

  const earned = getEarnedBadgeIds(profile.sources)

  return (
    <div className="flex flex-col gap-4">
      <ParticipantRow
        name={profile.displayName}
        fallback={getAvatarFallback(profile.avatarKey, profile.displayName)}
        role={profile.role}
        points={profile.points}
        isOnline
      />

      <section
        className="rounded-2xl border border-border/70 bg-card/60 p-4 shadow-sm"
        aria-labelledby="badges-heading"
      >
        <h2
          id="badges-heading"
          className="flex items-center gap-2 font-heading text-lg font-bold tracking-tight"
        >
          <Medal className="size-5 text-brand-trophy" aria-hidden />
          Medalhas
        </h2>
        <ul className="mt-3 flex flex-col gap-2">
          {BADGE_DEFINITIONS.map((badge) => {
            const isEarned = earned.has(badge.id)
            return (
              <li
                key={badge.id}
                className={cn(
                  'rounded-xl border px-3 py-2 text-sm',
                  isEarned
                    ? 'border-brand-trophy/40 bg-brand-trophy/10'
                    : 'border-border/60 opacity-60'
                )}
              >
                <p className="font-semibold">{badge.label}</p>
                <p className="text-muted-foreground">{badge.description}</p>
              </li>
            )
          })}
        </ul>
      </section>

      <Link
        href={routes.sala(context.room.code)}
        className="text-center text-sm font-medium text-primary underline-offset-4 hover:underline"
      >
        Voltar ao lobby
      </Link>
    </div>
  )
}

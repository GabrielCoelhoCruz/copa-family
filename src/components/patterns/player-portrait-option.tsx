'use client'

import Image from 'next/image'

import type { SelectablePlayer } from '@/features/players/types'
import { cn } from '@/lib/utils'

type PlayerPortraitOptionProps = {
  player: SelectablePlayer
  inputId: string
  checked: boolean
  onSelect: (playerId: string) => void
  variant?: 'modal' | 'preview'
}

function PlayerPortraitOption({
  player,
  inputId,
  checked,
  onSelect,
  variant = 'modal',
}: PlayerPortraitOptionProps) {
  const isModal = variant === 'modal'
  const isPreview = variant === 'preview'
  const initials = player.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const content = (
    <>
      <div
        className={cn(
          'flex w-full items-end justify-center bg-muted/25',
          isModal ? 'h-28 px-2 pt-2' : isPreview ? 'h-20 w-20 shrink-0 rounded-lg' : 'h-16 rounded-lg'
        )}
      >
        {player.photo_url ? (
          <Image
            src={player.photo_url}
            alt=""
            width={isModal ? 112 : isPreview ? 80 : 64}
            height={isModal ? 112 : isPreview ? 80 : 64}
            className={cn(
              'w-auto max-w-full object-contain object-bottom',
              isModal ? 'max-h-24' : isPreview ? 'max-h-[4.5rem]' : 'max-h-14'
            )}
            unoptimized
          />
        ) : (
          <span className="flex size-14 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground">
            {initials}
          </span>
        )}
      </div>
      <span
        className={cn(
          isModal ? 'space-y-0.5 px-2 pb-2 pt-1 text-center' : 'min-w-0 flex-1 py-0.5 text-left'
        )}
      >
        <span
          className={cn(
            'block font-semibold leading-snug text-foreground',
            isModal || isPreview ? 'text-sm' : 'truncate text-sm'
          )}
        >
          {player.name}
        </span>
        <span
          className={cn(
            'block text-muted-foreground',
            isModal || isPreview ? 'text-xs' : 'truncate text-xs'
          )}
        >
          {player.team_name}
        </span>
      </span>
    </>
  )

  if (isPreview) {
    return (
      <div
        className={cn(
          'flex w-full flex-row items-center gap-3 overflow-hidden rounded-xl border border-brand-field/40 bg-brand-field/10 p-2'
        )}
      >
        {content}
      </div>
    )
  }

  return (
    <label
      htmlFor={inputId}
      className={cn(
        'flex cursor-pointer flex-col overflow-hidden rounded-xl border text-center transition-colors',
        'hover:border-brand-field/40 has-[:checked]:border-brand-field has-[:checked]:bg-brand-field/10',
        checked && 'border-brand-field ring-1 ring-brand-field/40',
        isModal ? 'bg-card' : 'border-border/80 bg-card/80'
      )}
    >
      <input
        type="radio"
        id={inputId}
        checked={checked}
        onChange={() => onSelect(player.id)}
        className="sr-only"
      />
      {content}
    </label>
  )
}

export { PlayerPortraitOption }

'use client'

import { useState } from 'react'
import type { ComponentProps } from 'react'

import { PlayerAvatarPickerModal } from '@/components/patterns/player-avatar-picker-modal'
import { PlayerPortraitOption } from '@/components/patterns/player-portrait-option'
import { Button } from '@/components/ui/button'
import type { SelectablePlayer } from '@/features/players/types'
import { cn } from '@/lib/utils'

type PlayerAvatarPickerProps = {
  players: SelectablePlayer[]
  name?: string
  defaultValue?: string
  onSelectedChange?: (playerId: string | null) => void
} & Omit<ComponentProps<'fieldset'>, 'children'>

function findPlayer(
  players: SelectablePlayer[],
  playerId: string | null | undefined
): SelectablePlayer | null {
  if (!playerId) return null
  return players.find((player) => player.id === playerId) ?? null
}

function PlayerAvatarPicker({
  players,
  name = 'avatarPlayerId',
  defaultValue,
  onSelectedChange,
  className,
  ...fieldsetProps
}: PlayerAvatarPickerProps) {
  const [selectedId, setSelectedId] = useState<string | null>(defaultValue ?? null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalSession, setModalSession] = useState(0)

  const selectedPlayer = findPlayer(players, selectedId)
  const hasExternalLabel = Boolean(fieldsetProps['aria-labelledby'])

  function selectPlayer(playerId: string) {
    setSelectedId(playerId)
    onSelectedChange?.(playerId)
  }

  function openPlayerModal() {
    setModalSession((value) => value + 1)
    setModalOpen(true)
  }

  if (players.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border bg-muted/30 px-3 py-3 text-sm text-muted-foreground">
        Retratos dos jogadores ainda não foram sincronizados. Peça ao administrador para
        rodar o sync em /admin/catalogo.
      </p>
    )
  }

  return (
    <fieldset className={cn('space-y-2 border-0 p-0', className)} {...fieldsetProps}>
      {hasExternalLabel ? null : (
        <legend className="sr-only">Escolha um jogador da Copa</legend>
      )}
      <input type="hidden" name={name} value={selectedId ?? ''} />

      {selectedPlayer ? (
        <div className="flex items-stretch gap-2">
          <div className="min-w-0 flex-1">
            <PlayerPortraitOption
              variant="preview"
              player={selectedPlayer}
              inputId={`player-preview-${selectedPlayer.id}`}
              checked={false}
              onSelect={selectPlayer}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-auto shrink-0 self-center px-3"
            onClick={openPlayerModal}
          >
            Trocar
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="min-h-11 w-full"
          onClick={openPlayerModal}
        >
          Escolher jogador da Copa
        </Button>
      )}

      <PlayerAvatarPickerModal
        key={modalSession}
        open={modalOpen}
        onOpenChange={setModalOpen}
        players={players}
        selectedId={selectedId}
        onSelect={selectPlayer}
      />
    </fieldset>
  )
}

export { PlayerAvatarPicker }

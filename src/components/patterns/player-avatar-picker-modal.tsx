'use client'

import { useMemo } from 'react'

import { PlayerPortraitOption } from '@/components/patterns/player-portrait-option'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { SelectablePlayer } from '@/features/players/types'
import { cn } from '@/lib/utils'

type PlayerAvatarPickerModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  players: SelectablePlayer[]
  selectedId: string | null
  onSelect: (playerId: string) => void
}

function groupPlayersByTeam(players: SelectablePlayer[]): Map<string, SelectablePlayer[]> {
  const groups = new Map<string, SelectablePlayer[]>()
  for (const player of players) {
    const key = player.team_name
    const list = groups.get(key) ?? []
    list.push(player)
    groups.set(key, list)
  }
  return groups
}

function PlayerAvatarPickerModal({
  open,
  onOpenChange,
  players,
  selectedId,
  onSelect,
}: PlayerAvatarPickerModalProps) {
  const teamGroups = useMemo(() => [...groupPlayersByTeam(players).entries()], [players])

  function handleSelect(playerId: string) {
    onSelect(playerId)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          'flex flex-col gap-2 overflow-hidden p-2.5',
          'left-1/2 w-[calc(min(100vw,28rem)-2*var(--site-page-px))] max-w-[calc(min(100vw,28rem)-2*var(--site-page-px))]',
          'top-[max(0.5rem,3dvh)] max-h-[min(calc(100dvh-3.5rem),32rem)] translate-y-0',
          'sm:top-1/2 sm:max-h-[min(calc(100dvh-3rem),32rem)] sm:-translate-y-1/2'
        )}
        showCloseButton
      >
        <DialogHeader className="shrink-0 gap-0.5">
          <DialogTitle>Escolher jogador</DialogTitle>
          <DialogDescription className="text-xs leading-snug">
            Toque no jogador da Copa que vai representar você na sala.
          </DialogDescription>
        </DialogHeader>

        <div
          className="min-h-[14rem] flex-1 space-y-3 overflow-y-auto cf-scrollbar-hidden"
          role="radiogroup"
          aria-label="Jogadores disponíveis"
        >
          {teamGroups.map(([teamName, teamPlayers]) => (
            <section key={teamName} className="space-y-2">
              <h3 className="px-0.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {teamName}
              </h3>
              <ul className="grid grid-cols-2 gap-2">
                {teamPlayers.map((player) => (
                  <li key={player.id}>
                    <PlayerPortraitOption
                      variant="modal"
                      player={player}
                      inputId={`player-modal-${player.id}`}
                      checked={selectedId === player.id}
                      onSelect={handleSelect}
                    />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { PlayerAvatarPickerModal }

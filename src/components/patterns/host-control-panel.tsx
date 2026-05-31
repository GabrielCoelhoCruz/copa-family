"use client"

import { useFormStatus } from "react-dom"
import { Pause, Play, Target, Trophy } from "lucide-react"

import { updateMatchStatusFormAction } from "@/features/rooms/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MatchStatus, MatchStatusBadge } from "@/components/patterns/match-status-badge"

type HostControlPanelProps = {
  status: MatchStatus
  isOwner: boolean
  matchId: string
  roomId: string
  roomCode: string
}

type HostControlSubmitProps = {
  disabled: boolean
  variant: "party" | "default" | "celebrate" | "success"
  nextStatus: MatchStatus
  matchId: string
  roomId: string
  roomCode: string
  children: React.ReactNode
}

function HostControlSubmit({
  disabled,
  variant,
  nextStatus,
  matchId,
  roomId,
  roomCode,
  children,
}: HostControlSubmitProps) {
  const { pending } = useFormStatus()

  return (
    <form action={updateMatchStatusFormAction}>
      <input type="hidden" name="matchId" value={matchId} />
      <input type="hidden" name="roomId" value={roomId} />
      <input type="hidden" name="roomCode" value={roomCode} />
      <input type="hidden" name="status" value={nextStatus} />
      <Button
        type="submit"
        variant={variant}
        className="min-h-11 w-full"
        disabled={disabled || pending}
      >
        {children}
      </Button>
    </form>
  )
}

function HostControlPanel({
  status,
  isOwner,
  matchId,
  roomId,
  roomCode,
}: HostControlPanelProps) {
  if (!isOwner) {
    return null
  }

  return (
    <Card className="border-primary/25 bg-gradient-to-br from-primary/10 to-card shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>Controle do anfitrião</CardTitle>
          <MatchStatusBadge status={status} />
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2">
        <HostControlSubmit
          disabled={status !== "lobby"}
          variant="party"
          nextStatus="predictions_open"
          matchId={matchId}
          roomId={roomId}
          roomCode={roomCode}
        >
          <Target />
          Abrir palpites
        </HostControlSubmit>
        <HostControlSubmit
          disabled={status !== "predictions_open" && status !== "halftime"}
          variant="default"
          nextStatus="live"
          matchId={matchId}
          roomId={roomId}
          roomCode={roomCode}
        >
          <Play />
          Iniciar jogo
        </HostControlSubmit>
        <HostControlSubmit
          disabled={status !== "live"}
          variant="celebrate"
          nextStatus="halftime"
          matchId={matchId}
          roomId={roomId}
          roomCode={roomCode}
        >
          <Pause />
          Abrir intervalo
        </HostControlSubmit>
        <HostControlSubmit
          disabled={status !== "live" && status !== "halftime"}
          variant="success"
          nextStatus="finished"
          matchId={matchId}
          roomId={roomId}
          roomCode={roomCode}
        >
          <Trophy />
          Encerrar
        </HostControlSubmit>
      </CardContent>
    </Card>
  )
}

export { HostControlPanel }

import type { ComponentProps } from "react"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type RoomCodeInputProps = Omit<
  ComponentProps<typeof Input>,
  "autoCapitalize" | "autoComplete" | "inputMode"
>

function RoomCodeInput({ className, ...props }: RoomCodeInputProps) {
  return (
    <Input
      autoCapitalize="characters"
      autoComplete="off"
      inputMode="text"
      className={cn(
        "h-12 text-center font-mono text-xl font-bold uppercase tracking-[0.32em]",
        className
      )}
      {...props}
    />
  )
}

export { RoomCodeInput }

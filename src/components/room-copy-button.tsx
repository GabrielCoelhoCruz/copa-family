'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

import { Button } from '@/components/ui/button'

type RoomCopyButtonProps = {
  inviteUrl: string
}

function RoomCopyButton({ inviteUrl }: RoomCopyButtonProps) {
  const [hasCopied, setHasCopied] = useState(false)
  const [copyError, setCopyError] = useState<string | null>(null)

  async function copyInviteUrl() {
    setCopyError(null)
    try {
      await navigator.clipboard.writeText(inviteUrl)
      setHasCopied(true)
      window.setTimeout(() => setHasCopied(false), 1800)
    } catch {
      setCopyError('Não foi possível copiar. Segure o código e compartilhe manualmente.')
    }
  }

  return (
    <>
      {copyError ? (
        <p className="text-sm text-destructive" role="alert">
          {copyError}
        </p>
      ) : null}
      <Button
        type="button"
        variant="celebrate"
        className="min-h-11"
        onClick={copyInviteUrl}
        aria-label={hasCopied ? 'Link copiado' : 'Copiar link de convite'}
      >
        {hasCopied ? <Check /> : <Copy />}
        {hasCopied ? 'Copiado' : 'Copiar link'}
      </Button>
    </>
  )
}

export { RoomCopyButton }

'use client'

import type { ComponentProps } from 'react'

import { AVATAR_OPTIONS } from '@/lib/avatars'
import { cn } from '@/lib/utils'

type AvatarPickerProps = {
  name?: string
  defaultValue?: string
} & Omit<ComponentProps<'fieldset'>, 'children'>

function AvatarPicker({
  name = 'avatarKey',
  defaultValue = 'lion',
  className,
  ...fieldsetProps
}: AvatarPickerProps) {
  const hasExternalLabel = Boolean(fieldsetProps['aria-labelledby'])

  return (
    <fieldset
      className={cn('grid grid-cols-4 gap-2 border-0 p-0', className)}
      {...fieldsetProps}
    >
      {hasExternalLabel ? null : (
        <legend className="sr-only">Escolha seu avatar</legend>
      )}
      {AVATAR_OPTIONS.map((avatar) => (
        <label
          key={avatar.key}
          className={cn(
            'flex cursor-pointer flex-col items-center gap-1 rounded-xl border border-border bg-card p-2 text-center transition-[border-color,background-color,transform] duration-[var(--duration-fast)] has-checked:border-primary has-checked:bg-primary/10 has-checked:shadow-sm active:scale-[0.98]'
          )}
        >
          <input
            type="radio"
            name={name}
            value={avatar.key}
            defaultChecked={avatar.key === defaultValue}
            className="sr-only"
          />
          <span className="text-2xl" aria-hidden="true">
            {avatar.emoji}
          </span>
          <span className="text-[10px] font-semibold text-muted-foreground">
            {avatar.label}
          </span>
        </label>
      ))}
    </fieldset>
  )
}

export { AvatarPicker }

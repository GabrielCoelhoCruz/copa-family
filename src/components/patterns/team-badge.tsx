import Image from 'next/image'

import { isKnockoutPlaceholderName } from '@/features/fixtures/normalize'
import { cn } from '@/lib/utils'

type TeamBadgeProps = {
  name: string
  badgeUrl?: string | null
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = {
  sm: { box: 'size-6', text: 'text-[10px]', img: 24 },
  md: { box: 'size-8', text: 'text-xs', img: 32 },
  lg: { box: 'size-10', text: 'text-sm', img: 40 },
} as const

function TeamBadge({ name, badgeUrl, size = 'md', className }: TeamBadgeProps) {
  const s = sizeMap[size]
  const initials = name.slice(0, 2).toUpperCase()
  const placeholder = isKnockoutPlaceholderName(name)
  const showImage = Boolean(badgeUrl) && !placeholder

  if (showImage) {
    return (
      <Image
        src={badgeUrl!}
        alt=""
        width={s.img}
        height={s.img}
        className={cn(s.box, 'shrink-0 object-contain', className)}
        unoptimized
      />
    )
  }

  return (
    <span
      className={cn(
        s.box,
        'flex shrink-0 items-center justify-center rounded-full font-bold',
        placeholder
          ? 'border border-dashed border-muted-foreground/40 bg-muted/50 text-muted-foreground'
          : 'bg-muted text-muted-foreground',
        s.text,
        className
      )}
      aria-hidden
    >
      {initials}
    </span>
  )
}

export { TeamBadge }

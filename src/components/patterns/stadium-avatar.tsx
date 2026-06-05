import Image from 'next/image'

import { cn } from '@/lib/utils'

type StadiumAvatarProps = {
  initial: string
  color: string
  photoUrl?: string | null
  size?: number
  ring?: string
  className?: string
}

function StadiumAvatar({
  initial,
  color,
  photoUrl,
  size = 38,
  ring,
  className,
}: StadiumAvatarProps) {
  const border = ring ? `2px solid ${ring}` : '2px solid rgba(255,255,255,0.12)'
  const src = photoUrl?.trim()

  if (src) {
    return (
      <Image
        src={src}
        alt=""
        width={size}
        height={size}
        unoptimized
        className={cn(
          'shrink-0 rounded-full object-cover shadow-[0_2px_8px_rgba(0,0,0,0.32)]',
          className
        )}
        style={{ width: size, height: size, border }}
      />
    )
  }

  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full font-extrabold text-white shadow-[0_2px_8px_rgba(0,0,0,0.32)]',
        className
      )}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.42,
        background: `linear-gradient(150deg, ${color}, ${color}bb)`,
        border,
      }}
      aria-hidden
    >
      {initial.slice(0, 1).toUpperCase()}
    </div>
  )
}

export { StadiumAvatar }

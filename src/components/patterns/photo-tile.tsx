import Image from "next/image"
import { Heart } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type PhotoTileProps = {
  src: string
  alt: string
  authorName: string
  authorFallback: string
  authorAvatarUrl?: string
  likes: number
  isLiked?: boolean
  className?: string
}

function PhotoTile({
  src,
  alt,
  authorName,
  authorFallback,
  authorAvatarUrl,
  likes,
  isLiked = false,
  className,
}: PhotoTileProps) {
  return (
    <article
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-card shadow-sm",
        className
      )}
    >
      <div className="relative aspect-square bg-muted">
        <Image src={src} alt={alt} fill className="object-cover" sizes="(max-width: 768px) 50vw, 240px" />
      </div>

      <div className="flex items-center gap-2 p-3">
        <Avatar size="sm">
          {authorAvatarUrl ? <AvatarImage src={authorAvatarUrl} alt="" /> : null}
          <AvatarFallback className="bg-brand-party/15 text-brand-party">
            {authorFallback}
          </AvatarFallback>
        </Avatar>
        <p className="min-w-0 flex-1 truncate text-sm font-semibold">
          {authorName}
        </p>
        <Button
          variant={isLiked ? "party" : "ghost"}
          size="sm"
          aria-pressed={isLiked}
        >
          <Heart className={isLiked ? "fill-current" : ""} />
          {likes.toLocaleString("pt-BR")}
        </Button>
      </div>
    </article>
  )
}

export { PhotoTile }

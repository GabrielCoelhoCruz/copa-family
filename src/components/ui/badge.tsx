import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-semibold whitespace-nowrap transition-[background-color,border-color,color,box-shadow] duration-[var(--duration-fast)] ease-[var(--ease-out-strong)] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive:
          "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
        outline:
          "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost:
          "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
        "match-lobby":
          "border-match-lobby/20 bg-match-lobby/10 text-match-lobby",
        "match-predictions":
          "border-match-predictions/20 bg-match-predictions/10 text-match-predictions",
        "match-live":
          "border-match-live/20 bg-match-live/10 text-match-live",
        "match-halftime":
          "border-match-halftime/25 bg-match-halftime/15 text-secondary-foreground dark:text-match-halftime",
        "match-finished":
          "border-match-finished/20 bg-match-finished/10 text-match-finished",
        "rank-gold":
          "border-rank-gold/35 bg-rank-gold/20 text-secondary-foreground dark:text-rank-gold",
        "rank-silver":
          "border-rank-silver/30 bg-rank-silver/15 text-muted-foreground dark:text-rank-silver",
        "rank-bronze":
          "border-rank-bronze/30 bg-rank-bronze/15 text-rank-bronze",
        points:
          "border-points-positive/25 bg-points-positive/10 text-points-positive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }

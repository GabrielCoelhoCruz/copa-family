import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-semibold whitespace-nowrap transition-[background-color,border-color,color,box-shadow,transform] duration-[var(--duration-fast)] ease-[var(--ease-out-strong)] outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        celebrate:
          "bg-brand-trophy text-secondary-foreground shadow-sm shadow-brand-trophy/20 hover:bg-brand-trophy/85",
        party:
          "bg-brand-party text-white shadow-sm shadow-brand-party/20 hover:bg-brand-party/85",
        success:
          "bg-points-positive text-white shadow-sm shadow-points-positive/20 hover:bg-points-positive/85",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
        stadium:
          "home-cta-gold h-14 min-h-14 rounded-full border-0 px-[22px] text-base font-extrabold shadow-none disabled:pointer-events-none disabled:opacity-100 disabled:brightness-[0.58] disabled:saturate-[0.85]",
        "stadium-ghost":
          "home-cta-ghost h-14 min-h-14 rounded-full px-[22px] text-base font-extrabold shadow-none",
        "stadium-coral":
          "h-14 min-h-14 rounded-full border-0 bg-gradient-to-b from-[#ff8073] to-[#ff5a4c] px-[22px] text-base font-extrabold text-white shadow-[0_12px_26px_-10px_rgba(255,90,76,0.6)] hover:brightness-105 disabled:pointer-events-none disabled:opacity-100 disabled:brightness-[0.58] disabled:saturate-[0.85]",
        "stadium-sky":
          "h-14 min-h-14 rounded-full border-0 bg-gradient-to-b from-[#6fc0f5] to-[#3aa0e8] px-[22px] text-base font-extrabold text-[#08263a] shadow-[0_12px_26px_-10px_rgba(58,160,232,0.5)] hover:brightness-105",
        "stadium-dark":
          "h-10 rounded-full border border-[var(--cf-card-border-soft)] bg-black/28 px-4 text-sm font-bold text-white hover:bg-black/36",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

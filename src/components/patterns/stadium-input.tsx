import { forwardRef } from 'react'

import { cn } from '@/lib/utils'

type StadiumInputProps = React.ComponentProps<'input'> & {
  hasError?: boolean
}

const StadiumInput = forwardRef<HTMLInputElement, StadiumInputProps>(
  function StadiumInput({ className, hasError, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          'box-border h-[54px] w-full rounded-[15px] border-[1.5px] bg-[var(--cf-glass)] px-4 text-base font-semibold text-white outline-none placeholder:text-white/32',
          hasError ? 'border-[var(--cf-coral)]' : 'border-[var(--cf-card-border)]',
          className
        )}
        {...props}
      />
    )
  }
)

export { StadiumInput }

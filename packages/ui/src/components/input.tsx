import * as React from "react"
import { cn } from "../lib/utils"

/** The admin compact field text: 13px from 600px up, 16px below so iOS does not zoom on focus. */
export type InputTextSize = "compact"

export type InputProps = React.ComponentProps<"input"> & {
  /**
   * Compact admin text: 13px from 600px up and 16px below, which is the size an
   * admin page would otherwise reach with its own `font-size` rule. Pair it with
   * `data-size="sm"` for the 32px toolbar field; the 44px phone floor below
   * 600px is part of the compact band.
   */
  textSize?: InputTextSize
}

function Input({ className, type, textSize, ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      data-text-size={textSize}
      className={cn(
        "h-9 w-full min-w-0 data-[size=sm]:h-8 data-[size=lg]:h-11 rounded-md border border-input bg-card px-3 py-1 shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30",
        textSize === "compact" ? "text-base min-[600px]:text-[13px] max-[600px]:min-h-11" : "text-base md:text-sm",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Input }

import * as React from "react"
import { IconEye, IconEyeOff } from "@tabler/icons-react"

import { cn } from "../lib/utils"

export interface RevealValueProps {
  /** Shown while the value is hidden, for example "••••••••". */
  masked: React.ReactNode
  /** Shown after the reveal, for example "PPIJ-2026-000123". */
  clear: React.ReactNode
  revealed: boolean
  onReveal: () => void
  onHide: () => void
  /** Toggle label while hidden. Default "Tampilkan". */
  showLabel?: string
  /** Toggle label while revealed. Default "Sembunyikan". */
  hideLabel?: string
  /** Hides the toggle text; the accessible name stays. */
  iconOnly?: boolean
  /** Announced in place of the mask glyphs; the reveal itself stays app-side and audited. */
  maskedLabel?: string
  className?: string
}

/**
 * A masked value with the Tampilkan/Sembunyikan toggle. The masked state is
 * announced as hidden instead of spelling out dots, the toggle is a real button,
 * and the revealed value is announced on its own so the rest of the row is not
 * read again. The audited reveal is the caller's callback.
 */
export function RevealValue({
  masked,
  clear,
  revealed,
  onReveal,
  onHide,
  showLabel = "Tampilkan",
  hideLabel = "Sembunyikan",
  iconOnly = false,
  maskedLabel = "Nilai tersembunyi",
  className,
}: RevealValueProps) {
  return (
    <span data-slot="reveal-value" className={cn("inline-flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1.5", className)}>
      <span aria-live="polite" className={cn("min-w-0 break-words text-[13px] font-semibold", revealed ? "text-brand-ink" : "tracking-[.1em] text-brand-muted")}>
        {revealed ? (
          clear
        ) : (
          <>
            <span className="sr-only">{maskedLabel}</span>
            <span aria-hidden>{masked}</span>
          </>
        )}
      </span>
      <button
        type="button"
        onClick={revealed ? onHide : onReveal}
        className={cn(
          "inline-flex shrink-0 items-center gap-1 rounded-full border border-brand-border bg-card px-2.5 py-0.5 text-[11px] font-bold text-brand-red transition-colors hover:bg-brand-red/5",
          "min-h-8 max-[600px]:min-h-11 max-[600px]:px-3 max-[600px]:text-xs",
          "focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
        )}
      >
        {revealed ? <IconEyeOff className="size-3.5" aria-hidden /> : <IconEye className="size-3.5" aria-hidden />}
        <span className={iconOnly ? "sr-only" : undefined}>{revealed ? hideLabel : showLabel}</span>
      </button>
    </span>
  )
}

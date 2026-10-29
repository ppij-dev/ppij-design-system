import { cn } from "../lib/utils"

export interface SegmentedProgressProps {
  /** Segments filled, counting from 1: the current step number. */
  current: number
  total: number
  /** Accessible name for the progressbar, for example "Progres pendaftaran". */
  label: string
  className?: string
}

/**
 * The wizard's progress indicator (WIZ106-09): one rounded segment
 * per step in a flex row, filled up to and including the current
 * step. This is the standard progress treatment for multi-step
 * flows in the portal; the numbered Stepper is deprecated in its
 * favour.
 */
export function SegmentedProgress({ current, total, label, className }: SegmentedProgressProps) {
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={current}
      className={cn("flex gap-1.5", className)}
    >
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={cn("h-1.5 min-w-0 flex-1 rounded-full", i < current ? "bg-primary" : "bg-secondary")} />
      ))}
    </div>
  )
}

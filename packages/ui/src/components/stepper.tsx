import * as React from "react"
import { IconCheck } from "@tabler/icons-react"

import { cn } from "../lib/utils"

export interface StepperStep {
  label: string
  description?: string
}

export interface StepperProps {
  steps: StepperStep[]
  /** Current step, counting from 1. */
  current: number
  /** Label shown in the compact form, for example "Langkah". */
  stepWord?: string
  className?: string
}

/**
 * Wizard progress. On wide screens every step is shown with its state:
 * completed steps carry a check, the current step is filled red, and
 * upcoming steps stay quiet. On phones it compacts to one line, the
 * current step name, and a progress bar, because seven labels do not
 * fit in a phone width and the person only needs to know where they are.
 *
 * @deprecated The wizard's segmented progress (SegmentedProgress, WIZ106-09) is the
 * standard progress treatment for multi-step flows. Kept for compatibility; do not
 * adopt for new surfaces.
 */
export function Stepper({ steps, current, stepWord = "Langkah", className }: StepperProps) {
  const total = steps.length
  const percent = Math.round((current / total) * 100)
  return (
    <div className={className}>
      <div className="grid gap-2 sm:hidden">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-sm font-medium text-muted-foreground">
            {stepWord} {current} dari {total}
          </span>
          <span className="text-sm font-semibold text-brand-ink">{steps[current - 1]?.label}</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-secondary" role="progressbar" aria-valuenow={current} aria-valuemin={1} aria-valuemax={total} aria-label={stepWord + " " + current + " dari " + total}>
          <div className="h-full rounded-full bg-brand-red transition-all" style={{ width: percent + "%" }} />
        </div>
      </div>
      <ol className="hidden items-start sm:flex">
        {steps.map((step, index) => {
          const number = index + 1
          const state = number < current ? "complete" : number === current ? "current" : "upcoming"
          return (
            <li key={step.label} className={cn("flex items-start", index > 0 && "flex-1")}>
              {index > 0 && <span aria-hidden className={cn("mx-2 mt-4 h-px flex-1", number <= current ? "bg-brand-red" : "bg-border")} />}
              <div className="grid justify-items-center gap-1.5 text-center" aria-current={state === "current" ? "step" : undefined}>
                <span
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full border text-sm font-semibold",
                    state === "complete" && "border-brand-red bg-brand-red text-white",
                    state === "current" && "border-brand-red bg-brand-red text-white ring-4 ring-brand-red/15",
                    state === "upcoming" && "border-border bg-card text-muted-foreground"
                  )}
                >
                  {state === "complete" ? <IconCheck className="size-4" /> : number}
                </span>
                <span className={cn("max-w-24 text-xs leading-tight", state === "upcoming" ? "text-muted-foreground" : "font-medium text-brand-ink")}>
                  {step.label}
                </span>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

import * as React from "react"
import { IconArrowRight } from "@tabler/icons-react"

import { cn } from "../lib/utils"

export interface FiguresBandGroup {
  label: string
  /** The headline figure, already formatted by the page. */
  value: string
  /** `warn` marks a figure that needs attention without changing its size. */
  tone?: "default" | "warn"
  /** The quiet lines under the value; the page states the numbers here too. */
  sub?: React.ReactNode
  /** Decoration under the sub-line, for example a DistributionBar. Always hidden from assistive technology. */
  visual?: React.ReactNode
  linkLabel: string
  onSelect: () => void
}

export interface FiguresBandProps {
  title: string
  description?: string
  groups: FiguresBandGroup[]
  /** Columns from 1101px up. Defaults to the group count, capped at four. */
  columns?: number
  className?: string
}

/** One column below 600px, two at 601-1100px, then the band's own count from 1101px up. */
const columnClass: Record<number, string> = {
  1: "grid-cols-1",
  2: "min-[601px]:grid-cols-2",
  3: "min-[601px]:grid-cols-2 min-[1101px]:grid-cols-3",
  4: "min-[601px]:grid-cols-2 min-[1101px]:grid-cols-4",
}

/**
 * The grouped figures band: one headline per question, its quiet context and a
 * deep link, with an optional visual under each group. The dashboard's national
 * and komsat scopes are the two instances. Presentation only: the metric choice
 * and the numbers are the page's, and the visual slot is decoration because the
 * sub-line already states the same figures.
 */
export function FiguresBand({ title, description, groups, columns, className }: FiguresBandProps) {
  const columnCount = Math.min(Math.max(columns ?? groups.length, 1), 4)

  return (
    <section
      data-slot="figures-band"
      aria-label={title}
      className={cn("rounded-xl border border-brand-border bg-card px-[22px] pt-5 pb-2 max-[600px]:px-4", className)}
    >
      <div className="mb-1 flex flex-wrap items-baseline justify-between gap-3.5">
        <h2 className="m-0 text-lg font-bold tracking-tight text-brand-ink">{title}</h2>
        {description ? <p className="m-0 text-xs text-brand-muted">{description}</p> : null}
      </div>

      <div
        className={cn(
          "grid grid-cols-1",
          columnClass[columnCount],
          // Separators are scoped by width so only one of them ever applies:
          // a left hairline in the four-up row, a top hairline once the groups wrap.
          "[&>button:not(:first-child)]:border-brand-border",
          "min-[1101px]:[&>button:not(:first-child)]:border-l",
          "max-[1100px]:[&>button:not(:first-child)]:border-t",
          "min-[601px]:max-[1100px]:[&>button:nth-child(2)]:border-t-0",
        )}
      >
        {groups.map((group) => (
          <button
            key={group.label}
            type="button"
            onClick={group.onSelect}
            className="grid min-h-11 content-start gap-[7px] px-[18px] pt-4 pb-[18px] text-left transition-colors hover:bg-brand-red/3 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none max-[600px]:min-h-11 max-[600px]:px-0.5 max-[600px]:py-3.5 min-[600px]:min-h-8"
          >
            <span className="text-xs font-bold text-brand-muted">{group.label}</span>
            <span className={cn("text-[30px] leading-[1.1] font-extrabold tracking-tight", group.tone === "warn" ? "text-[#a66d20]" : "text-brand-ink")}>
              {group.value}
            </span>
            {group.sub ? <span className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-brand-muted">{group.sub}</span> : null}
            {group.visual ? (
              <span aria-hidden className="min-w-0 pt-0.5">
                {group.visual}
              </span>
            ) : null}
            <span className="mt-0.5 inline-flex items-center gap-1.5 text-xs font-bold text-brand-red">
              {group.linkLabel}
              <IconArrowRight aria-hidden className="size-3.5" />
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}

/** The 3px separator the prototype drew between two sub-line facts. */
export function FiguresBandSeparator() {
  return <span aria-hidden className="inline-block size-[3px] shrink-0 rounded-full bg-brand-border" />
}

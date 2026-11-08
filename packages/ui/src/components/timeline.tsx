import * as React from "react"
import { IconCheck } from "@tabler/icons-react"

import { cn } from "../lib/utils"

export interface TimelineItem {
  title: string
  /** Any node, so a long note can be an `ExpandableText`. */
  description?: React.ReactNode
  /** When it happened or will happen, already formatted by the page. */
  time?: string
  state: "complete" | "current" | "upcoming"
}

export interface TimelineProps {
  items: TimelineItem[]
  /**
   * Show only this many items (the newest, in the given order) and reveal the
   * rest through a labelled toggle. `undefined` renders every item, which is the
   * default behaviour.
   */
  defaultVisibleCount?: number
  /** Starts expanded; the component is uncontrolled. Default false. */
  defaultExpanded?: boolean
  /** Overrides the reveal label; `{n}` is the number of hidden items. */
  expandLabel?: string
  /** Overrides the collapse label; `{n}` is the visible count. */
  collapseLabel?: string
  onExpandChange?: (expanded: boolean) => void
  className?: string
}

/**
 * A vertical history: what happened, in order, with the current point marked.
 * Used for profile history, verification status and membership history, where
 * the person asks one question: where is my process now. With
 * `defaultVisibleCount` it shows the newest events and keeps the rest behind a
 * real toggle that reports `aria-expanded` and names how many items it hides.
 */
export function Timeline({ items, defaultVisibleCount, defaultExpanded = false, expandLabel, collapseLabel, onExpandChange, className }: TimelineProps) {
  const [expanded, setExpanded] = React.useState(defaultExpanded)
  const limited = defaultVisibleCount !== undefined && items.length > defaultVisibleCount
  const visible = limited && !expanded ? items.slice(0, defaultVisibleCount) : items
  const hidden = items.length - visible.length

  const toggle = () => {
    const next = !expanded
    setExpanded(next)
    onExpandChange?.(next)
  }

  return (
    <>
      <ol data-slot="timeline" className={cn("grid", className)}>
        {visible.map((item, index) => (
          <li key={item.title + index} className="relative flex gap-3 pb-6 last:pb-0">
            {index < visible.length - 1 && (
              <span aria-hidden className={cn("absolute top-6 left-[11px] h-[calc(100%-24px)] w-px", item.state === "complete" ? "bg-brand-red" : "bg-border")} />
            )}
            <span
              className={cn(
                "relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full border",
                item.state === "complete" && "border-brand-red bg-brand-red text-white",
                item.state === "current" && "border-brand-red bg-card ring-4 ring-brand-red/15",
                item.state === "upcoming" && "border-border bg-card"
              )}
            >
              {item.state === "complete" && <IconCheck className="size-3.5" />}
              {item.state === "current" && <span className="size-2 rounded-full bg-brand-red" />}
              {item.state === "upcoming" && <span className="size-2 rounded-full bg-border" />}
            </span>
            <div className="grid min-w-0 gap-0.5 pt-0.5">
              <span className={cn("text-sm", item.state === "upcoming" ? "text-muted-foreground" : "font-medium text-brand-ink")}>{item.title}</span>
              {item.description ? <span className="text-sm text-muted-foreground">{item.description}</span> : null}
              {item.time ? <span className="text-xs text-muted-foreground">{item.time}</span> : null}
            </div>
          </li>
        ))}
      </ol>
      {limited ? (
        <button
          data-slot="timeline-toggle"
          type="button"
          aria-expanded={expanded}
          onClick={toggle}
          className="mt-2.5 ml-9 text-[13px] font-bold text-brand-red underline-offset-2 hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none max-[600px]:min-h-11 min-[600px]:min-h-8"
        >
          {expanded
            ? (collapseLabel ?? `Tampilkan ${defaultVisibleCount} terbaru`)
            : (expandLabel ?? `Lihat selengkapnya (${hidden} peristiwa)`)}
        </button>
      ) : null}
    </>
  )
}

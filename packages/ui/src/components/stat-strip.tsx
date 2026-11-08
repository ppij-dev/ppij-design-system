import * as React from "react"

import { cn } from "../lib/utils"

export interface StatStripItem {
  value: React.ReactNode
  label: string
  /** One quiet line under the label, for example a period or a source. */
  hint?: string
}

export interface StatStripProps {
  items: StatStripItem[]
  /** Columns from 600px up; the strip wraps to two columns on a phone. Default 3. */
  columns?: number
  /**
   * `default` is the Statistik totals band: a white card with 22px values and
   * 11px labels. `compact` is the quiet in-card strip behind the map footer:
   * a top hairline with 21px values and 12px labels.
   */
  size?: "default" | "compact"
  /** Accessible name of the strip. Without it the strip claims no landmark. */
  label?: string
  className?: string
}

const columnClass: Record<number, string> = {
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-2 min-[600px]:grid-cols-4",
  5: "grid-cols-2 min-[601px]:grid-cols-3 min-[1101px]:grid-cols-5",
  6: "grid-cols-2 min-[601px]:grid-cols-3 min-[1101px]:grid-cols-6",
}

/** A wrapped grid keeps a row-end hairline unless the item ends the row. */
const wrapClass: Record<number, string> = {
  4: "max-[600px]:[&>div]:border-r-0",
  5: "max-[1100px]:[&>div:nth-child(3n)]:border-r-0 max-[600px]:[&>div]:border-r-0",
  6: "max-[1100px]:[&>div:nth-child(3n)]:border-r-0 max-[600px]:[&>div]:border-r-0",
}

/**
 * A value-over-label strip: the Statistik totals band and the map card footer.
 * Presentation only; the page computes and formats every number, and a value
 * that is a percentage always carries its label beside it.
 */
export function StatStrip({ items, columns = 3, size = "default", label, className }: StatStripProps) {
  const compact = size === "compact"
  const grid = cn(
    "grid gap-y-3",
    columnClass[columns] ?? "grid-cols-3",
    "max-[600px]:[&>div]:px-2.5",
    "[&>div]:border-r [&>div]:border-brand-border [&>div:last-child]:border-r-0",
    wrapClass[columns],
  )

  return (
    <dl
      data-slot="stat-strip"
      data-size={size}
      {...(label ? { role: "group", "aria-label": label } : {})}
      className={cn(
        grid,
        compact ? "mt-4 border-t border-brand-border pt-3.5" : "rounded-xl border border-brand-border bg-card px-1.5 py-4",
        "[&>div]:min-w-0",
        compact ? "[&>div]:px-[18px] [&>div:first-child]:pl-0 [&>div:last-child]:pr-0" : "[&>div]:px-4 [&>div:first-child]:pl-2.5 [&>div:last-child]:pr-1.5",
        className,
      )}
      style={columnClass[columns] ? undefined : { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {items.map((item) => (
        <div key={item.label} className="flex min-w-0 flex-col-reverse">
          <dt className={cn("text-brand-muted", compact ? "text-xs" : "text-[11px]")}>
            {item.label}
            {item.hint ? <span className="mt-0.5 block text-xs text-brand-muted">{item.hint}</span> : null}
          </dt>
          <dd className={cn("font-bold tracking-tight text-brand-ink max-[600px]:text-[18px]", compact ? "text-[21px]" : "text-[22px]")}>
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  )
}

import * as React from "react"

import { cn } from "../lib/utils"

export interface FactListItem {
  label: string
  value: React.ReactNode
  /** Spans the full width in the column variants, for example a long address. */
  span?: boolean
  /** Quiets the value, for text that is absent or not applicable. */
  muted?: boolean
}

export type FactListVariant = "rows" | "inline" | "twoColumn"

export interface FactListProps {
  items: FactListItem[]
  /**
   * `rows` is the drawer detail: a fixed 96px term column, one fact per row,
   * with a hairline between rows. `twoColumn` stacks term over value in two
   * columns, for review field groups. `inline` puts the value beside its term,
   * two facts per row, for short document facts. Both column variants collapse
   * to one column below 600px; `rows` keeps its term column on a phone.
   */
  variant?: FactListVariant
  /** A final emphasised row, for example a coverage total. */
  total?: { label: string; value: React.ReactNode }
  /** Shown instead of the list when there is nothing to show. */
  emptyLabel?: string
  className?: string
}

const listClass: Record<FactListVariant, string> = {
  rows: "grid",
  twoColumn: "grid grid-cols-2 gap-x-5 gap-y-3 max-[600px]:grid-cols-1",
  inline: "grid grid-cols-2 gap-x-5 gap-y-2.5 max-[600px]:grid-cols-1",
}

const itemClass: Record<FactListVariant, string> = {
  rows: "grid min-w-0 grid-cols-[96px_minmax(0,1fr)] items-baseline gap-x-3 border-b border-brand-border py-2",
  twoColumn: "grid min-w-0 gap-0.5",
  inline: "grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-2",
}

const valueClass: Record<FactListVariant, string> = {
  rows: "text-[13px] font-semibold",
  twoColumn: "text-sm font-semibold",
  inline: "text-[13px] font-semibold",
}

/**
 * Term and value rows: the drawer detail, the review field groups, the document
 * facts, the coverage list, the role detail and the invite summary. It renders
 * a real `<dl>`, so every term stays beside its value and a masked value keeps
 * its own label. Presentation only; the page decides what each value says.
 */
export function FactList({ items, variant = "rows", total, emptyLabel, className }: FactListProps) {
  if (!items.length && !total) {
    return emptyLabel ? <p data-slot="fact-list-empty" className={cn("m-0 text-[13px] text-brand-muted", className)}>{emptyLabel}</p> : null
  }

  return (
    <dl data-slot="fact-list" data-variant={variant} className={cn("m-0", listClass[variant], className)}>
      {items.map((item, index) => (
        <div key={`${item.label}-${index}`} className={cn(itemClass[variant], item.span && "col-span-full max-[600px]:col-span-1")}>
          <dt className="text-xs text-brand-muted">{item.label}</dt>
          <dd className={cn("m-0 break-words", valueClass[variant], item.muted ? "text-brand-muted" : "text-brand-ink")}>{item.value}</dd>
        </div>
      ))}
      {total ? (
        <div className="col-span-full flex items-baseline justify-between gap-3 border-t border-brand-border pt-2.5">
          <dt className="text-xs text-brand-muted">{total.label}</dt>
          <dd className="m-0 text-sm font-bold text-brand-ink">{total.value}</dd>
        </div>
      ) : null}
    </dl>
  )
}

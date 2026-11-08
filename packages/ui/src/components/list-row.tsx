import * as React from "react"

import { cn } from "../lib/utils"

export type ListRowTone = "default" | "danger" | "muted"

const toneClass: Record<ListRowTone, string> = {
  default: "text-brand-ink",
  danger: "text-destructive",
  muted: "text-brand-muted",
}

export interface ListRowProps {
  /** Leading slot: an Avatar, an icon chip, a checkbox. */
  leading?: React.ReactNode
  title: string
  subtitle?: string
  /** Quiet middle column, for example a date or a unit. */
  meta?: React.ReactNode
  /** Right-hand slot: a Badge, a Button, a chevron. */
  trailing?: React.ReactNode
  /** Badge rendered after the title. */
  badge?: React.ReactNode
  tone?: ListRowTone
  /** Makes the whole row one button. */
  onSelect?: () => void
  /** Makes the whole row one link; wins over `onSelect`. */
  href?: string
  /** Highlights the row and reports it as current or pressed. */
  selected?: boolean
  className?: string
}

/**
 * The one selectable row shape behind the priority list, the recent list, the
 * management and invitation lists, the coverage list and the phone member card.
 * It renders a real `<a>` or `<button>` so the whole row is a single tab stop;
 * every child control inside `trailing` stays its own control.
 */
export function ListRow({
  leading,
  title,
  subtitle,
  meta,
  trailing,
  badge,
  tone = "default",
  onSelect,
  href,
  selected = false,
  className,
}: ListRowProps) {
  const body = (
    <>
      {leading ? <span className="flex shrink-0 items-center">{leading}</span> : null}
      <span className="grid min-w-0 gap-1">
        <span className="flex min-w-0 flex-wrap items-center gap-2">
          <strong className={cn("block text-sm leading-snug font-semibold break-words", toneClass[tone])}>{title}</strong>
          {badge}
        </span>
        {subtitle ? <small className="block text-xs leading-snug break-words text-brand-muted">{subtitle}</small> : null}
      </span>
      {meta ? <span className="hidden text-xs text-brand-muted min-[600px]:block">{meta}</span> : null}
      {trailing ? <span className="flex shrink-0 items-center justify-end gap-2">{trailing}</span> : null}
    </>
  )

  const classes = cn(
    "grid w-full items-center gap-x-3 gap-y-1 border-t border-brand-border px-1 py-3 text-left",
    "max-[600px]:min-h-11",
    (onSelect || href) && "transition-colors hover:bg-secondary/50 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
    selected && "bg-secondary/60",
    className,
  )

  // Only the slots that exist get a track, so the title keeps the flexible
  // column whether or not the row has a leading slot or a meta column.
  const columns = [leading ? "auto" : null, "minmax(0,1fr)", meta ? "auto" : null, "auto"].filter(Boolean).join(" ")

  if (href) {
    return (
      <a data-slot="list-row" href={href} aria-current={selected ? "true" : undefined} className={classes} style={{ gridTemplateColumns: columns }}>
        {body}
      </a>
    )
  }
  if (onSelect) {
    return (
      <button data-slot="list-row" type="button" onClick={onSelect} aria-pressed={selected} className={classes} style={{ gridTemplateColumns: columns }}>
        {body}
      </button>
    )
  }
  return (
    <div data-slot="list-row" className={classes} style={{ gridTemplateColumns: columns }}>
      {body}
    </div>
  )
}

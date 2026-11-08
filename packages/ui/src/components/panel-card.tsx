import * as React from "react"

import { cn } from "../lib/utils"

export type PanelCardHeadingLevel = 2 | 3 | 4 | 5 | 6
export type PanelCardPadding = "page" | "panel" | "none"

/** The prototype's islands: `panel` is the standard 22px card, `page` the 28px page island. */
const paddingClass: Record<PanelCardPadding, string> = {
  panel: "p-[22px] max-[700px]:p-[17px]",
  page: "p-7 max-[900px]:p-5 max-[600px]:p-4",
  none: "p-0",
}

const compactPaddingClass: Record<PanelCardPadding, string> = {
  panel: "p-4",
  page: "p-5 max-[600px]:p-4",
  none: "p-0",
}

export interface PanelCardProps {
  title?: string
  description?: string
  /** Header control slot, for example a Button or an IconButton. */
  action?: React.ReactNode
  /** Quiet status next to the title, for example a Badge. */
  badge?: React.ReactNode
  /** Leading Tabler icon; the component sets its size and colour. */
  icon?: React.ReactNode
  /** `panel` is the standard card, `page` the white page island, `none` for a bare body. */
  padding?: PanelCardPadding
  /** `compact` is the admin scale: a 14px title and 12px description with 16px padding. */
  density?: "default" | "compact"
  /** Heading level of the title; the page owns the document outline. Default 2. */
  headingLevel?: PanelCardHeadingLevel
  children: React.ReactNode
  className?: string
}

/**
 * The white island that every admin page is built from: one title, one quiet
 * description, one header action and a body. Replaces `.work-panel`,
 * `.recent-section`, `.side-card`, `.stat-card`, `.figures-band` and the three
 * page islands. Presentation only; the caller owns the content and the action.
 */
export function PanelCard({
  title,
  description,
  action,
  badge,
  icon,
  padding = "panel",
  density = "default",
  headingLevel = 2,
  children,
  className,
}: PanelCardProps) {
  const Heading = `h${headingLevel}` as "h2"
  const compact = density === "compact"
  const hasHead = Boolean(title || description || badge || icon || action)

  return (
    <div
      data-slot="panel-card"
      data-padding={padding}
      data-density={density}
      className={cn(
        "min-w-0 rounded-xl border border-brand-border bg-card text-brand-ink",
        compact ? compactPaddingClass[padding] : paddingClass[padding],
        className,
      )}
    >
      {hasHead ? (
        <div className={cn("flex flex-wrap items-start justify-between gap-x-4 gap-y-3", compact ? "mb-3" : "mb-4")}>
          <div className="flex min-w-0 items-start gap-2.5">
            {icon ? (
              <span aria-hidden className="mt-0.5 shrink-0 text-brand-red [&_svg]:size-5">
                {icon}
              </span>
            ) : null}
            <div className="min-w-0">
              {title || badge ? (
                <div className="flex flex-wrap items-center gap-2">
                  {title ? <Heading className={cn("leading-snug font-bold tracking-tight", compact ? "text-sm" : "text-lg")}>{title}</Heading> : null}
                  {badge}
                </div>
              ) : null}
              {description ? <p className={cn("mt-1 text-brand-muted", compact ? "text-xs" : "text-[13px]")}>{description}</p> : null}
            </div>
          </div>
          {action ? (
            <div className="flex shrink-0 flex-wrap items-center gap-2 max-[600px]:[&_[data-slot=button]]:min-h-11">{action}</div>
          ) : null}
        </div>
      ) : null}
      {children}
    </div>
  )
}

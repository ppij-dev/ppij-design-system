import { IconChevronRight } from "@tabler/icons-react"

import { cn } from "../lib/utils"

export interface IdentityChipProps {
  name: string
  /** Second line, for example the role or the unit. */
  detail: string
  /** Two letters, shown in the avatar square. */
  initials: string
  onClick: () => void
  /** Sidebar rail state: a 44px square that keeps the person's name as its accessible name. */
  collapsed?: boolean
  className?: string
}

/**
 * The sidebar footer identity: who is signed in and which role they hold, as
 * one button that opens the account sheet. The collapsed rail keeps a 44px
 * square target and the person's name as the accessible name, never the
 * initials alone.
 */
export function IdentityChip({ name, detail, initials, onClick, collapsed = false, className }: IdentityChipProps) {
  // WCAG 2.5.3 (label in name), measured with axe 4.14:
  // - Collapsed, the only visible label is the initials, and axe counts
  //   aria-hidden text as visible, so the name has to carry them as well.
  // - Expanded, the two visible lines are separate block spans; axe joins them
  //   without a separator, so no aria-label can match them. The button instead
  //   takes its accessible name from that visible text (the initials and the
  //   chevron are aria-hidden), which is the name plus the role.
  const accessibleName = collapsed ? `${initials}, ${name}${detail ? `, ${detail}` : ""}` : undefined

  return (
    <button
      data-slot="identity-chip"
      data-collapsed={collapsed}
      type="button"
      onClick={onClick}
      aria-label={accessibleName}
      aria-haspopup="dialog"
      className={cn(
        "flex items-center rounded-[10px] border border-brand-border bg-card text-left transition-colors hover:bg-secondary/50 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
        collapsed ? "mx-auto size-11 shrink-0 justify-center p-1.5" : "mx-2 mb-2.5 min-h-11 w-[calc(100%-16px)] gap-2.5 p-2.5 min-[600px]:h-8 min-[600px]:min-h-8 min-[600px]:py-0",
        className,
      )}
    >
      <span aria-hidden className="grid size-7 shrink-0 place-items-center rounded-lg bg-brand-red/8 text-xs leading-none font-extrabold text-brand-red">
        {initials}
      </span>
      {collapsed ? null : (
        <>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] leading-4 font-bold text-brand-ink">{name}</span>
            <span className="block truncate text-xs leading-3.5 text-brand-muted">{detail}</span>
          </span>
          <IconChevronRight aria-hidden className="size-3.5 shrink-0 text-brand-muted" />
        </>
      )}
    </button>
  )
}

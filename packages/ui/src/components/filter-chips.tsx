import { IconX } from "@tabler/icons-react"

import { cn } from "../lib/utils"

export interface FilterChip {
  label: string
  value: string
  /** Per-value count, for example how many rows the value contains. */
  count?: number
  onRemove: () => void
}

export interface FilterChipsProps {
  chips: FilterChip[]
  onClearAll?: () => void
  clearAllLabel?: string
  /** Names the row for assistive technology; each chip's accessible name starts with it. */
  label?: string
  className?: string
}

/**
 * The removable active-filter row: the Statistik warehouse chips, the member
 * directory row, the invitation list and the management lists. Every chip
 * removes its own filter and states what it removes, the counts arrive as
 * props, and clear-all is a separate control so a single mis-tap cannot wipe
 * the row.
 */
export function FilterChips({ chips, onClearAll, clearAllLabel = "Hapus semua filter", label = "Filter aktif", className }: FilterChipsProps) {
  if (!chips.length && !onClearAll) return null

  return (
    <div data-slot="filter-chips" className={cn("flex min-w-0 flex-wrap items-center gap-2", className)}>
      <ul aria-label={label} className="flex min-w-0 flex-wrap items-center gap-2">
        {chips.map((chip) => (
          <li key={`${chip.value}-${chip.label}`} className="min-w-0">
            <button
              type="button"
              onClick={chip.onRemove}
              aria-label={chip.count === undefined ? `${label}: ${chip.label}` : `${label}: ${chip.label} (${chip.count})`}
              className="flex max-w-full items-center gap-1.5 rounded-full border border-[#ecd7db] bg-[#fdf5f6] px-3 py-1.5 text-xs font-semibold text-brand-ink transition-colors hover:bg-brand-red/5 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none max-[600px]:min-h-11 min-[600px]:min-h-8"
            >
              <span className="min-w-0 truncate">
                {chip.label}
                {chip.count === undefined ? null : <strong className="ml-1 font-extrabold text-brand-red">{chip.count}</strong>}
              </span>
              <IconX aria-hidden className="size-3.5 shrink-0 text-brand-muted" />
            </button>
          </li>
        ))}
      </ul>
      {onClearAll ? (
        <button
          type="button"
          onClick={onClearAll}
          aria-label={clearAllLabel}
          className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-bold text-brand-muted transition-colors hover:text-brand-ink focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none max-[600px]:min-h-11 min-[600px]:min-h-8"
        >
          <IconX aria-hidden className="size-3.5" />
          {clearAllLabel}
        </button>
      ) : null}
    </div>
  )
}

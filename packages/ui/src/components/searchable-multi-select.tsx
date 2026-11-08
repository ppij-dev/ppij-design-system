import * as React from "react"
import { IconChevronDown } from "@tabler/icons-react"

import { cn } from "../lib/utils"
import { Button } from "./button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./dropdown-menu"
import { Input } from "./input"

export interface SearchableMultiSelectProps {
  /** Names the control; also the accessible name of the trigger. */
  label: string
  values: string[]
  options: string[]
  /** Single mode replaces the selection; multiple mode adds and removes. */
  onChange: (values: string[]) => void
  /** Trigger label when nothing is selected, for example "Semua komsat". */
  allLabel: string
  /** Hides the caption and drops the trigger to the compact band, for a toolbar. */
  compact?: boolean
  single?: boolean
  /** The "all" row that clears the selection. Defaults to `!single`. */
  showAllOption?: boolean
  searchPlaceholder?: string
  emptyLabel?: string
  /** Forces the caption on or off; by default it shows unless `compact`. */
  visibleLabel?: boolean
  disabled?: boolean
  className?: string
}

/**
 * One searchable select for every unit and facet picker in the admin: the
 * member directory, the invitation form, the management lists and the
 * verifikasi filters. It merges the three local copies that had drifted.
 *
 * The trigger reads `allLabel`, the single value, or "N dipilih". Search
 * matches with `toLocaleLowerCase("id")`, takes focus when the menu opens and
 * resets when it closes; `Escape`, `Tab` and `ArrowDown` pass through to Radix
 * and every other key is stopped so the highlight does not move. Checkbox items
 * keep the menu open, and the "all" row clears the selection.
 */
export function SearchableMultiSelect({
  label,
  values,
  options,
  onChange,
  allLabel,
  compact = false,
  single = false,
  showAllOption,
  searchPlaceholder,
  emptyLabel,
  visibleLabel,
  disabled = false,
  className,
}: SearchableMultiSelectProps) {
  const [query, setQuery] = React.useState("")
  const searchRef = React.useRef<HTMLInputElement>(null)
  const showAll = showAllOption ?? !single
  const showCaption = visibleLabel ?? !compact

  const matches = options.filter((option) => option.toLocaleLowerCase("id").includes(query.trim().toLocaleLowerCase("id")))
  const selectedLabel = values.length === 0 ? allLabel : values.length === 1 ? values[0] : `${values.length} dipilih`
  const placeholder = searchPlaceholder ?? `Cari ${label.toLocaleLowerCase("id")}`

  return (
    <div data-slot="searchable-multi-select" data-compact={compact} className={cn("grid min-w-0 gap-2", className)}>
      <span className={cn("text-[13px] font-semibold text-brand-muted", showCaption ? undefined : "sr-only")}>{label}</span>
      <DropdownMenu
        onOpenChange={(open) => {
          if (open) window.requestAnimationFrame(() => searchRef.current?.focus())
          else setQuery("")
        }}
      >
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            aria-label={`${label}: ${selectedLabel}`}
            className="flex min-h-11 w-full min-w-0 justify-between gap-2.5 px-3 text-[13px] min-[600px]:h-8 min-[600px]:min-h-8"
          >
            <span className="truncate">{selectedLabel}</span>
            <IconChevronDown aria-hidden className="size-4 shrink-0 text-brand-muted" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-[max(230px,var(--radix-dropdown-menu-trigger-width))] max-w-[min(330px,calc(100vw-32px))] bg-card"
        >
          <div className="p-[7px]">
            <Input
              ref={searchRef}
              data-size="sm"
              textSize="compact"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (!["Escape", "Tab", "ArrowDown"].includes(event.key)) event.stopPropagation()
              }}
              placeholder={placeholder}
              aria-label={placeholder}
            />
          </div>
          <div className="max-h-[min(280px,42vh)] overflow-y-auto px-1 pb-1">
            {showAll ? (
              <DropdownMenuCheckboxItem
                checked={values.length === 0}
                onCheckedChange={() => onChange([])}
                onSelect={(event) => event.preventDefault()}
                className="min-h-11 text-[13px] min-[600px]:min-h-[38px]"
              >
                {allLabel}
              </DropdownMenuCheckboxItem>
            ) : null}
            {matches.length ? (
              matches.map((option) => (
                <DropdownMenuCheckboxItem
                  key={option}
                  checked={values.includes(option)}
                  onCheckedChange={(checked) =>
                    onChange(single ? (checked ? [option] : []) : checked ? [...values, option] : values.filter((value) => value !== option))
                  }
                  onSelect={single ? undefined : (event) => event.preventDefault()}
                  className="min-h-11 text-[13px] min-[600px]:min-h-[38px]"
                >
                  {option}
                </DropdownMenuCheckboxItem>
              ))
            ) : (
              <p className="px-2.5 py-2.5 text-[13px] text-brand-muted">{emptyLabel ?? "Tidak ada pilihan yang cocok."}</p>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
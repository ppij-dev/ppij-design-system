import * as React from "react"
import { IconCheck, IconChevronDown } from "@tabler/icons-react"

import { cn } from "../lib/utils"
import { Button } from "./button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "./dropdown-menu"

export interface FilterMenuOption {
  value: string
  label: string
}

export interface FilterMenuProps {
  label: string
  /** The selected value; the empty string is "all". */
  value: string
  options: FilterMenuOption[]
  /** The row that clears the filter, for example "Semua jenis". */
  allLabel: string
  onChange: (value: string) => void
  /** Keeps the caption for assistive technology but drops it from the layout. */
  hideLabel?: boolean
  disabled?: boolean
  className?: string
}

/**
 * The non-searchable single-select with checkmarks: the verifikasi kind,
 * ownership, feedback target and reason filters. The trigger names the control
 * and the current value, the menu is a radio group so the selected row reports
 * `aria-checked`, and the checkmark is decoration on top of that.
 */
export function FilterMenu({ label, value, options, allLabel, onChange, hideLabel = false, disabled = false, className }: FilterMenuProps) {
  const selectedLabel = options.find((option) => option.value === value)?.label ?? allLabel

  return (
    <div data-slot="filter-menu" data-hide-label={hideLabel} className={cn("grid min-w-0 gap-1.5", className)}>
      <span className={cn("text-[13px] font-semibold text-brand-muted", hideLabel && "sr-only")}>{label}</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            aria-label={`${label}: ${selectedLabel}`}
            className="flex w-max max-w-full min-h-11 justify-start gap-2.5 px-3 text-[13px] min-[600px]:h-8 min-[600px]:min-h-8"
          >
            <span className="truncate">{selectedLabel}</span>
            <IconChevronDown aria-hidden className="size-4 shrink-0 text-brand-muted" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-[190px] bg-card">
          <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
            <DropdownMenuRadioItem value="" className="min-h-11 gap-1.5 min-[600px]:min-h-8">
              <IconCheck aria-hidden className={cn("size-4 text-brand-red", value === "" ? undefined : "invisible")} />
              {allLabel}
            </DropdownMenuRadioItem>
            {options.map((option) => (
              <DropdownMenuRadioItem key={option.value} value={option.value} className="min-h-11 gap-1.5 min-[600px]:min-h-8">
                <IconCheck aria-hidden className={cn("size-4 text-brand-red", value === option.value ? undefined : "invisible")} />
                {option.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

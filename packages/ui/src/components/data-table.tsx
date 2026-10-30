import * as React from "react"
import { IconSearch, IconChevronLeft, IconChevronRight } from "@tabler/icons-react"

import { cn } from "../lib/utils"
import { Button } from "./button"
import { Input } from "./input"

export interface DataTableProps {
  searchValue?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
  actions?: React.ReactNode
  children: React.ReactNode
  footerText?: string
  /** Current page, shown only when pagination has an available direction. */
  pageLabel?: string
  onPrevious?: () => void
  onNext?: () => void
  previousDisabled?: boolean
  nextDisabled?: boolean
  previousLabel?: string
  nextLabel?: string
  className?: string
}

/**
 * Presentation shell for admin data tables: a search and actions
 * toolbar, the table itself as children, and a compact footer.
 * Pagination is omitted when no direction can be used; a one-page table
 * shows its result count without inert controls.
 * Fetching, sorting state, and row logic stay in the application.
 */
export function DataTable({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Cari...",
  actions,
  children,
  footerText,
  pageLabel,
  onPrevious,
  onNext,
  previousDisabled,
  nextDisabled,
  previousLabel = "Sebelumnya",
  nextLabel = "Berikutnya",
  className,
}: DataTableProps) {
  const hasPagination = (onPrevious !== undefined || onNext !== undefined) && !(previousDisabled && nextDisabled)
  const hasFooter = Boolean(footerText) || hasPagination

  return (
    <div className={cn("overflow-hidden rounded-xl border border-brand-border bg-card", className)}>
      <div className="flex flex-wrap items-center gap-2 border-b border-brand-border p-3">
        {onSearchChange ? (
          <div className="relative min-w-0 flex-1 sm:max-w-xs">
            <IconSearch size={16} className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-brand-muted" />
            <Input
              value={searchValue ?? ""}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="pl-8"
              aria-label={searchPlaceholder}
            />
          </div>
        ) : null}
        {actions ? <div className="ml-auto flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
      <div className="overflow-x-auto">{children}</div>
      {hasFooter ? (
        <div className="flex min-h-10 flex-wrap items-center justify-between gap-2 border-t border-brand-border px-3 py-1.5">
          {footerText ? <p className="text-xs text-brand-muted">{footerText}</p> : null}
          {hasPagination ? (
            <nav aria-label="Halaman tabel" className="ml-auto flex items-center gap-1">
              {pageLabel ? <span className={cn("mr-1 text-xs text-brand-muted", footerText && "sr-only sm:not-sr-only")}>{pageLabel}</span> : null}
              <Button size="icon-sm" className="size-11 sm:size-8" variant="outline" onClick={onPrevious} disabled={previousDisabled || !onPrevious} aria-label={previousLabel} title={previousLabel}>
                <IconChevronLeft size={16} />
              </Button>
              <Button size="icon-sm" className="size-11 sm:size-8" variant="outline" onClick={onNext} disabled={nextDisabled || !onNext} aria-label={nextLabel} title={nextLabel}>
                <IconChevronRight size={16} />
              </Button>
            </nav>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

import * as React from "react"
import { IconChevronDown, IconChevronUp, IconMaximize, IconMinimize, IconX } from "@tabler/icons-react"

import { cn } from "../lib/utils"
import { Skeleton } from "./skeleton"
import { StatStrip, type StatStripItem } from "./stat-strip"

export interface MapCardChip {
  label: string
  onClear: () => void
}

export interface MapCardProps {
  title: string
  description?: string
  /** The app's map canvas. The package imports no map library and no geography. */
  children: React.ReactNode
  /** The selection summary body, rendered as an overlay, an inline bar or a sheet. */
  panel: React.ReactNode
  /** Accessible name of the panel. Defaults to "Ringkasan peta". */
  panelLabel?: string
  /** The stat strip under the map: three items in practice. */
  footer?: StatStripItem[]
  /** The clear-selection chip, shown when a unit is selected. */
  chip?: MapCardChip
  onExpandChange?: (expanded: boolean) => void
  /** Controlled fullscreen state; uncontrolled when omitted. */
  expanded?: boolean
  expandLabel?: string
  collapseLabel?: string
  /** The one-line summary the snap-sheet handle reads while collapsed. */
  sheetSummary?: string
  /** Quiet note about units with no coordinates yet. */
  unmappedNote?: React.ReactNode
  loading?: boolean
  /** The app's own loading state for the map canvas. */
  loadingFallback?: React.ReactNode
  className?: string
}

/**
 * The map card frame: the approved height steps (420px at 900px and wider,
 * 320px at 601-899px, 240px at 600px and below), the selection panel as an
 * overlay on desktop, an inline bar on tablet and a snap sheet in fullscreen on
 * a phone, plus the stat strip footer. The map itself, the geography and the
 * metrics are the app's; `children` is the canvas.
 *
 * Escape closes fullscreen and returns focus to the expand toggle, the toggle
 * and the panel controls are 44px below 600px and 32px from 600px up, and the
 * panel comes before the footer in DOM order.
 */
export function MapCard({
  title,
  description,
  children,
  panel,
  panelLabel = "Ringkasan peta",
  footer,
  chip,
  onExpandChange,
  expanded,
  expandLabel = "Perbesar peta",
  collapseLabel = "Tutup layar penuh",
  sheetSummary,
  unmappedNote,
  loading = false,
  loadingFallback,
  className,
}: MapCardProps) {
  const [internalExpanded, setInternalExpanded] = React.useState(false)
  const [sheetOpen, setSheetOpen] = React.useState(false)
  const toggleRef = React.useRef<HTMLButtonElement>(null)
  const controlled = expanded !== undefined
  const isExpanded = controlled ? expanded : internalExpanded

  const setExpanded = React.useCallback(
    (next: boolean) => {
      if (!controlled) setInternalExpanded(next)
      if (!next) setSheetOpen(false)
      onExpandChange?.(next)
    },
    [controlled, onExpandChange],
  )

  // Escape closes fullscreen and puts focus back on the toggle that opened it.
  React.useEffect(() => {
    if (!isExpanded) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      setExpanded(false)
      toggleRef.current?.focus()
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [isExpanded, setExpanded])

  return (
    <section
      data-slot="map-card"
      data-expanded={isExpanded}
      aria-label={title}
      className={cn(
        "relative rounded-xl border border-brand-border bg-card p-5 max-[600px]:p-4",
        isExpanded && "fixed inset-0 z-50 flex flex-col overflow-y-auto rounded-none border-0",
        className,
      )}
    >
      <header className="mb-3.5 flex flex-wrap items-start justify-between gap-3.5">
        <div className="min-w-0">
          <h2 className="mb-1 text-lg font-bold tracking-tight text-brand-ink">{title}</h2>
          {description ? <p className="m-0 text-[13px] leading-snug text-brand-muted">{description}</p> : null}
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {chip ? (
            <button
              type="button"
              onClick={chip.onClear}
              aria-label={`Hapus pilihan: ${chip.label}`}
              className="flex max-w-[16rem] items-center gap-1.5 rounded-full border border-brand-red bg-card px-3 py-1.5 text-xs font-bold text-brand-ink transition-colors hover:bg-brand-red/5 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none max-[600px]:min-h-11 min-[600px]:min-h-8"
            >
              <span className="truncate">{chip.label}</span>
              <IconX aria-hidden className="size-3.5 shrink-0 text-brand-muted" />
            </button>
          ) : null}
          <button
            ref={toggleRef}
            type="button"
            aria-expanded={isExpanded}
            onClick={() => setExpanded(!isExpanded)}
            className="flex items-center gap-1.5 rounded-lg border border-brand-border bg-card px-3 text-[13px] font-bold text-brand-ink transition-colors hover:bg-secondary focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none max-[600px]:min-h-11 min-[600px]:min-h-8"
          >
            {isExpanded ? <IconMinimize aria-hidden className="size-4" /> : <IconMaximize aria-hidden className="size-4" />}
            {isExpanded ? collapseLabel : expandLabel}
          </button>
        </div>
      </header>

      <div
        data-slot="map-canvas"
        className={cn(
          "relative z-0 h-60 overflow-hidden rounded-[9px] border border-brand-border bg-[#e8edf2] min-[601px]:h-80 min-[900px]:h-[420px]",
          isExpanded && "h-auto min-h-0 flex-1",
        )}
      >
        {children}
        {loading && loadingFallback ? (
          <div role="status" aria-label="Memuat peta" className="absolute inset-0 flex flex-col gap-3 bg-card p-4">
            {loadingFallback}
          </div>
        ) : null}
        {loading && !loadingFallback ? (
          <div role="status" aria-busy="true" aria-label="Memuat peta" className="absolute inset-0 grid content-start gap-3 bg-card p-4">
            <Skeleton aria-hidden="true" className="h-5 w-44" />
            <Skeleton aria-hidden="true" className="h-full w-full" />
          </div>
        ) : null}
        {/* Desktop overlay: the panel over the canvas, top right, from 900px up. */}
        <div data-slot="map-panel-overlay" className="absolute top-2.5 right-2.5 hidden w-[230px] rounded-[10px] border border-brand-border bg-card p-3.5 shadow-lg min-[900px]:block" aria-label={panelLabel}>
          {panel}
        </div>
      </div>

      {/* Tablet inline bar: below the canvas from 601px to 899px, and under the canvas on a phone. */}
      {!isExpanded ? (
        <aside
          data-slot="map-panel-inline"
          aria-label={panelLabel}
          className="mt-3 flex min-w-0 flex-wrap items-center gap-x-6 gap-y-2 rounded-[10px] border border-brand-border px-4 py-3 min-[900px]:hidden"
        >
          {panel}
        </aside>
      ) : null}

      {/* Phone snap sheet: only inside fullscreen, with its own labelled handle toggle. */}
      {isExpanded ? (
        <div data-slot="map-sheet" className="absolute inset-x-0 bottom-0 z-[1001] hidden rounded-t-[14px] border-t border-brand-border bg-card shadow-[0_-8px_24px_rgba(15,24,39,.14)] max-[899px]:block">
          <button
            type="button"
            aria-expanded={sheetOpen}
            onClick={() => setSheetOpen((value) => !value)}
            className="flex w-full min-h-11 flex-col items-center gap-2 px-4 pt-2.5 pb-2 text-[13px] font-bold text-brand-ink focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <span aria-hidden className="h-[5px] w-9 rounded-full bg-brand-border" />
            <span className="flex w-full items-center justify-center gap-1.5">
              <span className="min-w-0 truncate">{sheetSummary ?? title}</span>
              {sheetOpen ? <IconChevronDown aria-hidden className="size-4" /> : <IconChevronUp aria-hidden className="size-4" />}
            </span>
          </button>
          {sheetOpen ? <div className="min-w-0 px-4 pb-4">{panel}</div> : null}
        </div>
      ) : null}

      {footer?.length ? <StatStrip items={footer} size="compact" label={panelLabel} /> : null}
      {unmappedNote ? <p className="mt-2.5 text-xs text-brand-muted">{unmappedNote}</p> : null}
    </section>
  )
}

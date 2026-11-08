import * as React from "react"
import { IconFileTypePdf, IconPhoto } from "@tabler/icons-react"

import { cn } from "../lib/utils"
import { FactList, type FactListItem } from "./fact-list"
import { Skeleton } from "./skeleton"

export type DocumentViewerLocale = "id" | "en"

const labels = {
  id: { preview: "Pratinjau berkas", image: "Berkas gambar", pdf: "Berkas PDF", empty: "Tidak ada dokumen untuk ditampilkan.", loading: "Memuat pratinjau dokumen" },
  en: { preview: "File preview", image: "Image file", pdf: "PDF file", empty: "No document to show.", loading: "Loading the document preview" },
} as const

export interface DocumentSide {
  id: string
  /** Tab label, for example "Sisi depan". */
  label: string
  kind: "image" | "pdf"
  /** File name in the file row. */
  name: string
  /** Quiet line under the name, for example "Berkas contoh · JPG". */
  meta?: string
}

export interface DocumentViewerProps {
  /** The sides the document has; one or two in practice. */
  sides: DocumentSide[]
  /** The selected side id. */
  value: string
  onChange: (id: string) => void
  /** The app's preview stage: the real image, the PDF viewer or a placeholder. */
  children: React.ReactNode
  /** Facts under the stage, for example the document's own fields. */
  facts?: FactListItem[]
  loading?: boolean
  emptyLabel?: string
  locale: DocumentViewerLocale
  /** Accessible name of the stage region. */
  label?: string
  className?: string
}

/**
 * The student-card frame: the side switcher, the file row, the app's preview
 * stage and the document's own facts. The file itself and the preview stay
 * app-side; this component owns the frame, the accessible names and the
 * loading and empty states. Side tabs are 44px below 600px and 32px from
 * 600px up, and the facts list is one column on a phone.
 */
export function DocumentViewer({ sides, value, onChange, children, facts, loading = false, emptyLabel, locale, label, className }: DocumentViewerProps) {
  const l = labels[locale]
  const selected = sides.find((side) => side.id === value) ?? sides[0]
  const stageName = label ?? l.preview

  if (!sides.length) {
    return (
      <div data-slot="document-viewer" className={cn("grid rounded-[11px] border border-[#dce3e7] bg-card p-5 text-[13px] text-brand-muted", className)}>
        {emptyLabel ?? l.empty}
      </div>
    )
  }

  return (
    <div data-slot="document-viewer" data-loading={loading} className={cn("grid min-w-0 gap-3", className)}>
      {sides.length > 1 ? (
        <div role="group" aria-label={stageName} className="inline-flex w-fit max-w-full gap-1 overflow-x-auto rounded-[9px] border border-[#e4e8eb] bg-card p-[3px]">
          {sides.map((side) => (
            <button
              key={side.id}
              type="button"
              aria-pressed={side.id === selected?.id}
              onClick={() => onChange(side.id)}
              className={cn(
                "min-h-11 shrink-0 rounded-[7px] px-3 text-[13px] font-semibold transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none min-[600px]:min-h-8",
                side.id === selected?.id ? "bg-secondary text-brand-ink" : "text-brand-muted hover:text-brand-ink",
              )}
            >
              {side.label}
            </button>
          ))}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-[11px] border border-[#dce3e7] bg-card">
        {selected ? (
          <div className="flex items-center gap-3 border-b border-[#e4e9ec] px-4 py-3 text-brand-red">
            <span role="img" aria-label={selected.kind === "pdf" ? l.pdf : l.image} className="shrink-0">
              {selected.kind === "pdf" ? <IconFileTypePdf aria-hidden className="size-[22px]" /> : <IconPhoto aria-hidden className="size-[22px]" />}
            </span>
            <span className="grid min-w-0 gap-0.5">
              <strong className="truncate text-sm text-brand-ink">{selected.name}</strong>
              {selected.meta ? <span className="truncate text-xs text-brand-muted">{selected.meta}</span> : null}
            </span>
          </div>
        ) : null}

        <div role="region" aria-label={stageName} aria-live="polite" className="grid min-h-[220px] place-items-center bg-card p-5">
          {loading ? (
            <div role="status" aria-busy="true" aria-label={l.loading} className="grid w-full max-w-[300px] gap-3">
              {/* One status region for the whole stage: the skeletons are decoration inside it. */}
              <Skeleton aria-hidden="true" className="h-[178px] w-full rounded-lg" />
              <Skeleton aria-hidden="true" className="h-4 w-2/3" />
              <Skeleton aria-hidden="true" className="h-4 w-1/3" />
            </div>
          ) : (
            children
          )}
        </div>

        {facts?.length ? <FactList variant="twoColumn" items={facts} className="border-t border-[#e4e9ec] bg-[#fbfcfc] px-4 py-3.5" /> : null}
      </div>
    </div>
  )
}

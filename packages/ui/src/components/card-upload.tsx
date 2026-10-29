import { IconCamera, IconCheck, IconFileTypePdf, IconPhoto, IconRefresh, IconShieldCheck, IconTrash } from "@tabler/icons-react"

import { cn } from "../lib/utils"
import { Button } from "./button"
import { Spinner } from "./spinner"

export type CardSideState = "empty" | "processing" | "uploading" | "failed" | "saved"

export interface CardSide {
  label: string
  optional?: boolean
  state: CardSideState
  /** Image preview URL when saved (or a PDF file name with isPdf). */
  previewSrc?: string
  fileName?: string
  isPdf?: boolean
  error?: string
  onCapture?: () => void
  onPick?: () => void
  onRetry?: () => void
  onRemove?: () => void
}

export interface CardUploadProps {
  front: CardSide
  back?: CardSide
  /** Privacy line under the slots, with the shield icon. */
  note?: string
  className?: string
}

function SideSlot({ side }: { side: CardSide }) {
  const busy = side.state === "processing" || side.state === "uploading"
  return (
    <section aria-label={side.label} className="flex flex-col gap-2">
      <h3 className="text-base font-semibold text-brand-ink">
        {side.label}{" "}
        {side.optional ? <span className="font-normal text-brand-muted">(opsional)</span> : null}
      </h3>
      {side.state === "empty" && (
        <div className="grid gap-3 rounded-md border border-dashed border-brand-border bg-card p-4">
          <p className="text-sm text-brand-muted">Belum ada foto untuk sisi ini.</p>
          <div className="flex flex-wrap gap-2">
            {side.onCapture && (
              <Button type="button" variant="outline" onClick={side.onCapture}>
                <IconCamera className="size-4" aria-hidden="true" />
                Ambil foto
              </Button>
            )}
            {side.onPick && (
              <Button type="button" variant="outline" onClick={side.onPick}>
                <IconPhoto className="size-4" aria-hidden="true" />
                Pilih berkas
              </Button>
            )}
          </div>
        </div>
      )}
      {busy && (
        <div className="flex h-48 items-center justify-center gap-2 rounded-md border border-brand-border bg-card text-sm font-medium text-brand-ink" role="status">
          <Spinner size="sm" decorative />
          {side.state === "processing" ? "Memproses foto..." : "Mengunggah..."}
        </div>
      )}
      {side.state === "saved" && (
        <div className="flex flex-col gap-2">
          {side.isPdf ? (
            <div className="flex h-48 items-center justify-center gap-3 rounded-md border border-brand-border bg-card p-4 text-sm font-medium text-brand-ink">
              <IconFileTypePdf className="size-6 text-brand-red" aria-hidden="true" />
              {side.fileName ?? "dokumen.pdf"}
            </div>
          ) : (
            <img src={side.previewSrc} alt={`Pratinjau ${side.label.toLowerCase()}`} className="h-48 w-full rounded-md border border-brand-border object-cover" />
          )}
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 text-sm font-medium text-success">
              <IconCheck className="size-4" aria-hidden="true" />
              Tersimpan
            </span>
            <span className="flex-1" />
            {side.onRemove && (
              <Button type="button" variant="ghost" size="sm" onClick={side.onRemove}>
                <IconTrash className="size-4" aria-hidden="true" />
                Hapus
              </Button>
            )}
          </div>
        </div>
      )}
      {side.state === "failed" && (
        <div className="grid gap-2 rounded-md border border-destructive/50 bg-card p-4">
          <p role="alert" className="text-sm text-destructive">
            {side.error ?? "Unggahan gagal. Periksa koneksi lalu coba lagi."}
          </p>
          <div>
            {side.onRetry && (
              <Button type="button" variant="outline" size="sm" onClick={side.onRetry}>
                <IconRefresh className="size-4" aria-hidden="true" />
                Coba lagi
              </Button>
            )}
          </div>
        </div>
      )}
    </section>
  )
}

/**
 * Student card capture, extracted from the wizard CardStep: two
 * sides (front required, back optional), each with its own state
 * (empty, processing, uploading, failed, saved with preview). The
 * image preparation and the upload stay in the application; this
 * is the presentation of both slots and their states.
 */
export function CardUpload({ front, back, note, className }: CardUploadProps) {
  return (
    <div className={cn("grid gap-6", className)}>
      <SideSlot side={front} />
      {back && <SideSlot side={back} />}
      {note && (
        <p className="flex items-start gap-2 text-sm text-brand-muted">
          <IconShieldCheck className="mt-0.5 size-4 shrink-0 text-brand-red" aria-hidden="true" />
          {note}
        </p>
      )}
    </div>
  )
}

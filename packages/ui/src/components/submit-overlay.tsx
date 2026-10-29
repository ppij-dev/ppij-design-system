import { IconCircleCheck } from "@tabler/icons-react"

import { cn } from "../lib/utils"
import { Spinner } from "./spinner"

export interface SubmitOverlayProps {
  phase: "sending" | "sent"
  /** Status line, for example "Mengirim pendaftaran..." or "Terkirim. Membuka Beranda...". */
  title: string
  /** Supporting line shown while sending. Defaults to the wizard's "Jangan tutup halaman ini." */
  line?: string
  className?: string
}

/**
 * Full-screen submit layer, extracted from the wizard SubmitOverlay:
 * shown from the moment a submit that ends in a redirect starts
 * until the browser navigates away. A white veiled layer with one
 * centered card, a large spinner while sending, and the success
 * check on the status token once sent.
 */
export function SubmitOverlay({ phase, title, line = "Jangan tutup halaman ini.", className }: SubmitOverlayProps) {
  const sent = phase === "sent"
  return (
    <div className={cn("fixed inset-0 z-50 flex items-center justify-center bg-white/80 p-4 backdrop-blur-sm", className)}>
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 text-center shadow-lg">
        <div className="flex justify-center" aria-hidden="true">
          {sent ? <IconCircleCheck className="size-10 text-success" stroke={1.75} /> : <Spinner size="lg" decorative className="text-primary" />}
        </div>
        <p role="status" aria-live="polite" className="mt-4 text-lg font-bold text-brand-ink">
          {title}
        </p>
        {!sent && <p className="mt-1 text-sm text-brand-muted">{line}</p>}
      </div>
    </div>
  )
}

import * as React from "react"
import { IconLogout, IconX } from "@tabler/icons-react"

import { cn } from "../lib/utils"
import { Dialog, DialogContent } from "./dialog"

export type AccountSheetLocale = "id" | "en"

const labels = {
  id: { close: "Tutup profil", dialog: "Profil pengguna" },
  en: { close: "Close profile", dialog: "User profile" },
} as const

export interface AccountSheetItem {
  label: string
  /** Second line under the label, for example the destination route. */
  sublabel?: string
  icon: React.ReactNode
  onSelect: () => void
  /** `danger` marks the sign-out row. */
  tone?: "default" | "danger"
}

export interface AccountSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  name: string
  detail: string
  initials: string
  items: AccountSheetItem[]
  /** Slot above the rows, for example the Portal | Admin switch. */
  switchSlot?: React.ReactNode
  signOutLabel?: string
  onSignOut?: () => void
  locale: AccountSheetLocale
  /** Overrides the built-in close label for this locale. */
  closeLabel?: string
  /** Accessible name of the dialog. Defaults to the locale's profile label. */
  label?: string
  className?: string
}

/**
 * The account sheet: who is signed in, the context switch, the account rows and
 * sign out, as a bottom sheet on every screen width. Escape, the backdrop and
 * the close button dismiss it; focus starts on the close button and returns to
 * the trigger that opened it; every row is an ordinary button of at least 44px.
 * The rows and their destinations are the caller's.
 */
export function AccountSheet({
  open,
  onOpenChange,
  name,
  detail,
  initials,
  items,
  switchSlot,
  signOutLabel,
  onSignOut,
  locale,
  closeLabel,
  label,
  className,
}: AccountSheetProps) {
  const l = labels[locale]
  const closeRef = React.useRef<HTMLButtonElement>(null)
  const dialogLabel = label ?? l.dialog

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-slot="account-sheet"
        showCloseButton={false}
        aria-label={dialogLabel}
        onOpenAutoFocus={(event) => {
          event.preventDefault()
          closeRef.current?.focus()
        }}
        className={cn(
          "bottom-0 top-auto left-1/2 w-[min(420px,calc(100vw-24px))] translate-x-[-50%] translate-y-0 gap-0 overflow-hidden rounded-b-none rounded-t-[14px] border border-b-0 bg-card p-0 pb-[max(10px,env(safe-area-inset-bottom))]",
          className,
        )}
      >
        <span aria-hidden className="mx-auto mt-2.5 h-[5px] w-[38px] rounded-full bg-brand-border" />

        <div className="relative flex items-center gap-2.5 border-b border-brand-border px-4 pt-2 pb-3 pr-14">
          <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-red/8 text-[13px] font-extrabold text-brand-red">
            {initials}
          </span>
          <span className="min-w-0">
            <b className="block truncate text-sm text-brand-ink">{name}</b>
            <small className="block truncate text-[11.5px] text-brand-muted">{detail}</small>
          </span>
          <button ref={closeRef} type="button" aria-label={closeLabel ?? l.close} onClick={() => onOpenChange(false)} className="absolute top-1 right-1 grid size-11 place-items-center rounded-[10px] text-brand-muted transition-colors hover:bg-secondary hover:text-brand-ink focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none">
            <IconX aria-hidden className="size-[18px]" />
          </button>
        </div>

        {switchSlot ? <div className="grid gap-1.5 px-4 pt-2.5">{switchSlot}</div> : null}

        <div className="px-2 pt-1 pb-2.5">
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={item.onSelect}
              className={cn(
                "flex min-h-11 w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13.5px] font-semibold transition-colors hover:bg-secondary focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
                item.tone === "danger" ? "text-destructive" : "text-brand-ink",
              )}
            >
              <span aria-hidden className={cn("shrink-0 [&_svg]:size-4", item.tone === "danger" ? "text-destructive" : "text-brand-muted")}>
                {item.icon}
              </span>
              <span className="min-w-0">
                <span className="block truncate">{item.label}</span>
                {item.sublabel ? <small className="block text-xs font-normal text-brand-muted">{item.sublabel}</small> : null}
              </span>
            </button>
          ))}
          {onSignOut && signOutLabel ? (
            <button
              type="button"
              onClick={onSignOut}
              className="mt-1 flex min-h-11 w-full items-center gap-2.5 rounded-lg border-t border-brand-border px-2.5 py-2 text-left text-[13.5px] font-semibold text-destructive transition-colors hover:bg-secondary focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <IconLogout aria-hidden className="size-4 shrink-0" />
              <span className="min-w-0 truncate">{signOutLabel}</span>
            </button>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}

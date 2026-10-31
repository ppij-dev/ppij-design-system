import * as React from "react"
import { IconX } from "@tabler/icons-react"
import { cn } from "../lib/utils"
import { Button } from "./button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "./drawer"

/** Screens at or above this width open the drawer from the right; narrower screens from the bottom. */
export type Locale = "id" | "en"

const labels = {
  id: { close: "Tutup", back: "Kembali" },
  en: { close: "Close", back: "Back" },
} as const

const DESKTOP_QUERY = "(min-width: 900px)"

function subscribeDesktop(onChange: () => void): () => void {
  const media = window.matchMedia(DESKTOP_QUERY)
  media.addEventListener("change", onChange)
  return () => media.removeEventListener("change", onChange)
}

/** One matchMedia subscription; the only viewport check in the admin drawer. Server render assumes a phone. */
export function useIsDesktop(): boolean {
  return React.useSyncExternalStore(
    subscribeDesktop,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => false,
  )
}

export type AdminDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Accessible name of the dialog; shown in the fixed header. */
  title: string
  description?: string
  locale: Locale
  /** Overrides the built-in close label for this locale. */
  closeLabel?: string
  /** Overrides the built-in back label for this locale. */
  backLabel?: string
  /** Two-step body: 1 is the first step (default), 2 is the confirmation step. */
  step?: 1 | 2
  /** Shown as the "Kembali" button when step is 2. Going back never submits. */
  onBack?: () => void
  /** Scrolling body of the current step. */
  children: React.ReactNode
  /** Sticky footer actions of the current step. */
  footer?: React.ReactNode
  /** Overrides Radix's focus return on close; the caller decides which control gets focus back. */
  onCloseAutoFocus?: (event: Event) => void
  className?: string
}

/**
 * Admin form or detail in a drawer: right from 900 px, bottom below.
 * Escape, the backdrop and the close button dismiss it without submitting; Radix returns
 * focus to the element that was focused before the drawer opened.
 */
export function AdminDrawer({
  open,
  onOpenChange,
  title,
  description,
  locale,
  closeLabel,
  backLabel,
  step = 1,
  onBack,
  children,
  footer,
  onCloseAutoFocus,
  className,
}: AdminDrawerProps) {
  const isDesktop = useIsDesktop()
  const showBack = step === 2 && onBack !== undefined

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction={isDesktop ? "right" : "bottom"}>
      <DrawerContent
        data-admin-drawer=""
        onCloseAutoFocus={onCloseAutoFocus}
        data-step={step}
        className={cn(
          "min-h-0 gap-0 p-0 text-foreground",
          "data-[vaul-drawer-direction=bottom]:max-h-[85vh]",
          "data-[vaul-drawer-direction=right]:w-[440px] data-[vaul-drawer-direction=right]:sm:max-w-[440px]",
          className,
        )}
      >
        <DrawerHeader
          data-vaul-no-drag=""
          className="shrink-0 flex-row items-start justify-between gap-3 border-b border-border p-4 text-left"
        >
          <div className="min-w-0">
            <DrawerTitle className="text-base leading-6">{title}</DrawerTitle>
            {description ? <DrawerDescription>{description}</DrawerDescription> : null}
          </div>
          <DrawerClose asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={(closeLabel ?? labels[locale].close)}
              className="shrink-0"
            >
              <IconX className="size-4" />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <div data-admin-drawer-body="" className="min-h-0 flex-1 overflow-y-auto p-4">
          {children}
        </div>

        {showBack || footer ? (
          <DrawerFooter
            data-vaul-no-drag=""
            data-admin-drawer-footer=""
            className="shrink-0 flex-row flex-wrap items-center justify-end gap-2 border-t border-border bg-card p-4"
          >
            {showBack ? (
              <Button type="button" variant="outline" onClick={onBack} className="mr-auto">
                {(backLabel ?? labels[locale].back)}
              </Button>
            ) : null}
            {footer}
          </DrawerFooter>
        ) : null}
      </DrawerContent>
    </Drawer>
  )
}

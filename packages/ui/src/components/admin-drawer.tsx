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

/** Width of the right-hand drawer from 900 px: sm 380, md 440 (default), lg 560, each capped to the viewport. Phones always get a full-width bottom sheet. */
export type AdminDrawerSize = "sm" | "md" | "lg"

const sizeClass: Record<AdminDrawerSize, string> = {
  sm: "data-[vaul-drawer-direction=right]:w-[380px] data-[vaul-drawer-direction=right]:sm:max-w-[min(380px,calc(100vw-48px))]",
  md: "data-[vaul-drawer-direction=right]:w-[440px] data-[vaul-drawer-direction=right]:sm:max-w-[min(440px,calc(100vw-48px))]",
  lg: "data-[vaul-drawer-direction=right]:w-[560px] data-[vaul-drawer-direction=right]:sm:max-w-[min(560px,calc(100vw-48px))]",
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
  /** Compact density uses a 13px body, 14px title, and 12px padding. */
  density?: "compact" | "default"
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
  /** Desktop width. Defaults to "md" (440 px), the previous fixed width. */
  size?: AdminDrawerSize
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
  density = "default",
  step = 1,
  onBack,
  children,
  footer,
  onCloseAutoFocus,
  size = "md",
  className,
}: AdminDrawerProps) {
  const isDesktop = useIsDesktop()
  const showBack = step === 2 && onBack !== undefined

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction={isDesktop ? "right" : "bottom"}>
      <DrawerContent
        data-admin-drawer=""
        data-size={size}
        onCloseAutoFocus={onCloseAutoFocus}
        data-step={step}
        data-density={density}
        className={cn(
          "min-h-0 gap-0 p-0 text-foreground",
          "data-[vaul-drawer-direction=bottom]:max-h-[85vh]",
          sizeClass[size],
          density === "compact" && "text-[13px] leading-5",
          className,
        )}
      >
        <DrawerHeader
          data-vaul-no-drag=""
          className={cn("shrink-0 flex-row items-start justify-between gap-3 border-b border-border p-4 text-left", density === "compact" && "p-3")}
        >
          <div className="min-w-0">
            <DrawerTitle className={density === "compact" ? "text-sm leading-5" : "text-base leading-6"}>{title}</DrawerTitle>
            {description ? <DrawerDescription className={cn("break-words", density === "compact" && "text-xs leading-5")}>{description}</DrawerDescription> : null}
          </div>
          <DrawerClose asChild>
            <Button
              type="button"
              variant="ghost"
              size={density === "compact" && isDesktop ? "icon-sm" : "icon"}
              aria-label={(closeLabel ?? labels[locale].close)}
              className="shrink-0"
            >
              <IconX className="size-4" />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <div data-admin-drawer-body="" className={cn("min-h-0 flex-1 overflow-y-auto p-4", density === "compact" && "p-3")}>
          {children}
        </div>

        {showBack || footer ? (
          <DrawerFooter
            data-vaul-no-drag=""
            data-admin-drawer-footer=""
            className={cn("shrink-0 flex-row flex-wrap items-center justify-end gap-2 border-t border-border bg-card p-4", density === "compact" && "p-3")}
          >
            {showBack ? (
              <Button type="button" variant="outline" size={density === "compact" ? "sm" : "default"} onClick={onBack} className="mr-auto">
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

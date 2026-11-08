import * as React from "react"
import { IconBuildingCommunity, IconCheck, IconChevronDown } from "@tabler/icons-react"

import { cn } from "../lib/utils"
import { Input } from "./input"

export type WorkspaceLocale = "id" | "en"

const labels = {
  id: { label: "RUANG KERJA", search: "Cari korda atau komsat", trigger: "Ruang kerja", empty: "Tidak ditemukan." },
  en: { label: "WORKSPACE", search: "Search region or unit", trigger: "Workspace", empty: "Nothing found." },
} as const

export interface WorkspaceOption {
  id: string
  label: string
  /** Short label for the collapsed and phone trigger, for example "OKY". */
  short?: string
  /** Unit kind, shown under the label in the menu, for example "Komsat". */
  kind: string
  /** Menu mark; defaults to a community glyph. */
  icon?: React.ReactNode
}

export interface WorkspaceSelectorProps {
  value: string
  options: WorkspaceOption[]
  onChange: (id: string) => void
  /** Small caption above the trigger value. Defaults to the locale's "RUANG KERJA". */
  label?: string
  searchPlaceholder?: string
  /** Sidebar rail state: a 48px square trigger with the menu beside it. */
  collapsed?: boolean
  /** `sidebar` is the boxed picker; `phone` the compact top-bar trigger. */
  variant: "sidebar" | "phone"
  /** Starts with the menu open; the component is otherwise uncontrolled. */
  defaultOpen?: boolean
  locale: WorkspaceLocale
  className?: string
}

/**
 * The one searchable workspace picker behind the sidebar picker, its collapsed
 * rail form and the phone top-bar picker. The trigger reports `aria-expanded`
 * and names the current workspace; the menu is a labelled group of `aria-pressed`
 * buttons, the search field takes focus on open and Escape closes the menu and
 * returns focus to the trigger.
 */
export function WorkspaceSelector({ value, options, onChange, label, searchPlaceholder, collapsed = false, variant, defaultOpen = false, locale, className }: WorkspaceSelectorProps) {
  const l = labels[locale]
  const [open, setOpen] = React.useState(defaultOpen)
  const [query, setQuery] = React.useState("")
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const searchRef = React.useRef<HTMLInputElement>(null)
  const wrapRef = React.useRef<HTMLDivElement>(null)
  const menuId = React.useId()

  const selected = options.find((option) => option.id === value)
  const current = selected?.label ?? ""
  const triggerText = selected?.short ?? selected?.label ?? ""
  const matches = options.filter((option) => `${option.label} ${option.kind}`.toLocaleLowerCase("id").includes(query.trim().toLocaleLowerCase("id")))

  const close = React.useCallback((restoreFocus = true) => {
    setOpen(false)
    setQuery("")
    if (restoreFocus) triggerRef.current?.focus()
  }, [])

  // A pointer outside the picker closes the menu; the trigger and the menu are
  // the only places a click keeps it open.
  React.useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) close(false)
    }
    document.addEventListener("pointerdown", onPointerDown)
    return () => document.removeEventListener("pointerdown", onPointerDown)
  }, [open, close])

  // The search field takes focus as soon as the menu opens.
  React.useEffect(() => {
    if (open) searchRef.current?.focus()
  }, [open])

  const menu = open ? (
    <div
      id={menuId}
      role="group"
      aria-label={label ?? l.label}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.stopPropagation()
          close()
        }
      }}
      className={cn(
        "absolute z-40 grid max-h-80 gap-0.5 overflow-y-auto rounded-[11px] border border-brand-border bg-card p-1.5 shadow-lg",
        variant === "phone" ? "top-[calc(100%+6px)] right-0 min-w-[185px]" : collapsed ? "top-0 left-[calc(100%+10px)] w-[220px]" : "top-[calc(100%+7px)] right-0 left-0",
      )}
    >
      <Input
        ref={searchRef}
        data-size="sm"
        textSize="compact"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={searchPlaceholder ?? l.search}
        aria-label={searchPlaceholder ?? l.search}
        className="mb-1 w-full"
      />
      {matches.length ? (
        matches.map((option) => (
          <button
            key={option.id}
            type="button"
            aria-pressed={option.id === value}
            onClick={() => {
              onChange(option.id)
              close()
            }}
            className={cn(
              "flex min-h-11 w-full items-center justify-between gap-2 rounded-[7px] px-2.5 py-2 text-left text-[13px] font-bold min-[600px]:min-h-8",
              option.id === value ? "bg-brand-red/8 text-brand-red" : "text-brand-ink hover:bg-secondary",
            )}
          >
            <span className="min-w-0">
              <span className="block truncate">{option.label}</span>
              <span className="block text-xs font-medium text-brand-muted">{option.label === option.kind ? "" : option.kind}</span>
            </span>
            {option.id === value ? <IconCheck aria-hidden className="size-4 shrink-0 text-brand-red" /> : null}
          </button>
        ))
      ) : (
        <p className="px-2.5 py-2 text-[13px] text-brand-muted">{l.empty}</p>
      )}
    </div>
  ) : null

  if (variant === "phone") {
    return (
      <div ref={wrapRef} data-slot="workspace-selector" data-variant="phone" className={cn("relative", className)}>
        <button
          ref={triggerRef}
          type="button"
          aria-expanded={open}
          aria-controls={open ? menuId : undefined}
          aria-label={`${labels[locale].trigger}: ${current}`}
          onClick={() => {
            setOpen((value) => !value)
            setQuery("")
          }}
          className="flex min-h-11 items-center gap-1.5 rounded-[7px] border border-brand-border bg-card px-2.5 text-xs font-bold text-brand-ink min-[600px]:min-h-8"
        >
          <span className="max-w-[9rem] truncate">{triggerText}</span>
          <IconChevronDown aria-hidden className={cn("size-4 shrink-0 transition-transform", open && "rotate-180")} />
        </button>
        {menu}
      </div>
    )
  }

  return (
    <div ref={wrapRef} data-slot="workspace-selector" data-variant="sidebar" data-collapsed={collapsed} className={cn("relative min-w-0", className)}>
      {collapsed ? (
        <button
          ref={triggerRef}
          type="button"
          aria-expanded={open}
          aria-controls={open ? menuId : undefined}
          aria-label={`${labels[locale].trigger}: ${current}`}
          onClick={() => {
            setOpen((value) => !value)
            setQuery("")
          }}
          className="mx-auto grid size-12 place-items-center rounded-[11px] border border-brand-border bg-brand-red/8 text-brand-red focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <span aria-hidden>{selected?.icon ?? <IconBuildingCommunity className="size-[18px]" />}</span>
        </button>
      ) : (
        <button
          ref={triggerRef}
          type="button"
          aria-expanded={open}
          aria-controls={open ? menuId : undefined}
          aria-label={`${labels[locale].trigger}: ${current}`}
          onClick={() => {
            setOpen((value) => !value)
            setQuery("")
          }}
          className="flex min-h-12 w-full items-center gap-2.5 rounded-[11px] border border-brand-border bg-brand-bg/60 p-2.5 text-left focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <span aria-hidden className="grid size-7.5 shrink-0 place-items-center rounded-lg bg-brand-red/8 text-brand-red">
            {selected?.icon ?? <IconBuildingCommunity className="size-[18px]" />}
          </span>
          <span className="min-w-0 flex-1">
            <small className="block text-[11px] leading-3.5 font-extrabold tracking-[.12em] text-brand-muted">{label ?? l.label}</small>
            <strong className="block truncate text-[13px] leading-4 text-brand-ink">{current}</strong>
          </span>
          <IconChevronDown aria-hidden className={cn("size-4 shrink-0 text-brand-muted transition-transform", open && "rotate-180")} />
        </button>
      )}
      {menu}
    </div>
  )
}

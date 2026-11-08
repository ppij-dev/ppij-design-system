import * as React from "react"
import { IconBell, IconChevronRight } from "@tabler/icons-react"

import { cn } from "../lib/utils"

export type TopBarLocale = "id" | "en"

const labels = {
  id: { breadcrumb: "Jejak halaman", notifications: "Notifikasi", identity: "Profil pengguna", brand: "PPI Jepang" },
  en: { breadcrumb: "Breadcrumb", notifications: "Notifications", identity: "User profile", brand: "PPI Japan" },
} as const

export interface TopBarPathItem {
  label: string
  /** Only the last path segment is a link; the title carries the current page. */
  href?: string
}

export interface AdminTopBarIdentity {
  name: string
  initials: string
}

export interface AdminTopBarProps {
  /** Trail above the current page, for example Admin › Organisasi. */
  path?: TopBarPathItem[]
  /** The current page title; it ends the trail and is reported as the current page. */
  title: string
  /** Quiet ambient facts (a date, a timezone), hidden below 1100px to keep the bar calm. */
  meta?: React.ReactNode[]
  /** Right-hand controls; the bar raises them to the 44px touch floor below 600px. */
  actions?: React.ReactNode
  /** Renders the bell. It carries the locale accessible name. */
  onNotificationsClick?: () => void
  /** Unread count beside the bell; announced with the button's name. */
  notificationCount?: number
  identity?: AdminTopBarIdentity
  /** Makes the identity a button that opens the account sheet. */
  onIdentityClick?: () => void
  /** Phone brand lock-up: the logo, its alt text and the label beside it. */
  brand?: { src: string; alt: string; label: string }
  /** Slot at the very start of the bar, for example a sidebar toggle. */
  leading?: React.ReactNode
  /** The shell mounts exactly one variant, so only one `<header>` landmark exists. */
  variant: "desktop" | "phone"
  locale: TopBarLocale
  className?: string
}

/**
 * The admin shell's top bar. Desktop: the breadcrumb trail, quiet facts, the
 * bar's actions and the identity. Phone: the brand, one workspace slot in
 * `leading` and the 44px identity target. The bar owns no route and no session;
 * labels, links and callbacks arrive as props.
 */
export function AdminTopBar({
  path = [],
  title,
  meta = [],
  actions,
  onNotificationsClick,
  notificationCount,
  identity,
  onIdentityClick,
  brand,
  leading,
  variant,
  locale,
  className,
}: AdminTopBarProps) {
  const l = labels[locale]

  if (variant === "phone") {
    return (
      <header
        data-slot="admin-top-bar"
        data-variant="phone"
        className={cn("sticky top-0 z-25 flex h-15 shrink-0 items-center justify-between border-b border-brand-border bg-card px-4", className)}
      >
        {brand ? (
          <span className="flex min-w-0 items-center gap-2 text-[15px] font-bold text-brand-ink">
            <img src={brand.src} alt={brand.alt} className="size-[34px] shrink-0 rounded-md border border-brand-border object-contain" />
            <span className="truncate">{brand.label}</span>
          </span>
        ) : (
          <span className="truncate text-[15px] font-bold text-brand-ink">{title}</span>
        )}
        <div className="ml-auto flex shrink-0 items-center gap-2">
          {leading}
          {identity ? (
            <button
              type="button"
              onClick={onIdentityClick}
              // The visible label is the initials, so the accessible name carries
              // them too (WCAG 2.5.3) and then states the person's name.
              aria-label={`${identity.initials}, ${identity.name}`}
              aria-haspopup={onIdentityClick ? "dialog" : undefined}
              className="grid size-11 shrink-0 place-items-center rounded-[10px] bg-brand-red/8 text-[13px] font-extrabold text-brand-red focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <span aria-hidden>{identity.initials}</span>
            </button>
          ) : null}
        </div>
      </header>
    )
  }

  return (
    <header
      data-slot="admin-top-bar"
      data-variant="desktop"
      className={cn(
        "flex h-17 shrink-0 items-center justify-between gap-4 border-b border-brand-border bg-card px-[clamp(24px,3vw,48px)]",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-2.5">
        {leading}
        <nav aria-label={l.breadcrumb} className="min-w-0">
          <ol className="flex min-w-0 items-center gap-2.5 text-sm text-brand-muted">
            {path.map((item, index) => (
              <li key={`${item.label}-${index}`} className="flex min-w-0 items-center gap-2.5">
                {item.href ? (
                  <a href={item.href} className="truncate hover:text-brand-ink">
                    {item.label}
                  </a>
                ) : (
                  <span className="truncate">{item.label}</span>
                )}
                <IconChevronRight aria-hidden className="size-4 shrink-0 text-brand-border" />
              </li>
            ))}
            <li className="min-w-0">
              <strong aria-current="page" className="block truncate font-bold text-brand-ink">
                {title}
              </strong>
            </li>
          </ol>
        </nav>
      </div>

      <div className="flex shrink-0 items-center gap-2.5 text-[13px] text-brand-muted">
        {meta.length ? (
          <span className="hidden items-center gap-2.5 min-[1100px]:flex">
            {meta.map((item, index) => (
              <span key={index}>{item}</span>
            ))}
          </span>
        ) : null}
        {actions || onNotificationsClick ? (
          <span className="flex items-center gap-1.5 max-[600px]:[&_[data-slot=button]]:min-h-11 min-[600px]:[&_[data-slot=button]]:min-h-8">
            {actions}
            {onNotificationsClick ? (
              <button
                type="button"
                onClick={onNotificationsClick}
                aria-label={notificationCount ? `${l.notifications}, ${notificationCount}` : l.notifications}
                className="relative grid size-8 place-items-center rounded-md text-brand-muted transition-colors hover:bg-secondary hover:text-brand-ink focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none max-[600px]:size-11"
              >
                <IconBell aria-hidden className="size-5" />
                {notificationCount ? (
                  <span aria-hidden className="absolute -top-0.5 -right-0.5 grid min-w-4.5 place-items-center rounded-full bg-brand-red px-1 text-[11px] leading-4.5 font-bold text-white">
                    {notificationCount}
                  </span>
                ) : null}
              </button>
            ) : null}
          </span>
        ) : null}
        {identity ? (
          onIdentityClick ? (
            <button
              type="button"
              onClick={onIdentityClick}
              // No aria-label: the visible name below is the accessible name. An
              // aria-label here would have to repeat the initials, which axe
              // counts as the visible label (WCAG 2.5.3).
              aria-haspopup="dialog"
              className="flex items-center gap-2 rounded-full pr-1 pl-0.5 transition-colors hover:bg-secondary focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none max-[600px]:min-h-11 min-[600px]:h-8"
            >
              <span aria-hidden className="grid size-8 place-items-center rounded-full bg-brand-red/8 text-xs font-extrabold text-brand-red">
                {identity.initials}
              </span>
              <span className="sr-only max-w-40 truncate font-bold text-brand-ink min-[900px]:not-sr-only min-[900px]:block">{identity.name}</span>
            </button>
          ) : (
            <span className="flex items-center gap-2 max-[600px]:min-h-11 min-[600px]:h-8">
              <span aria-hidden className="grid size-8 place-items-center rounded-full bg-brand-red/8 text-xs font-extrabold text-brand-red">
                {identity.initials}
              </span>
              <span className="sr-only max-w-40 truncate font-bold text-brand-ink min-[900px]:not-sr-only min-[900px]:block">{identity.name}</span>
            </span>
          )
        ) : null}
      </div>
    </header>
  )
}

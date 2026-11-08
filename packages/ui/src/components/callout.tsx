import * as React from "react"

import { cn } from "../lib/utils"

export type CalloutTone = "info" | "success" | "warning" | "danger" | "neutral"

/** The prototype's nine inline notes: the same shape, four urgency steps and a quiet neutral. */
const TONES: Record<CalloutTone, string> = {
  info: "bg-[#f0f4fa] text-[#4c627b]",
  success: "bg-[#f1f5f3] text-[#35604a]",
  warning: "bg-[#fff5e6] text-[#7c5014]",
  danger: "border border-[#f0ccd4] bg-[#fdf2f4] text-[#8f1730]",
  neutral: "border border-[#e6eaed] bg-[#f8fafb] text-[#56636d]",
}

/** `role="alert"` interrupts, so only the tone that reports a problem claims it. */
const ROLES: Record<CalloutTone, "status" | "alert" | undefined> = {
  info: "status",
  success: "status",
  warning: undefined,
  danger: "alert",
  neutral: undefined,
}

export interface CalloutProps {
  tone?: CalloutTone
  /** Leading Tabler icon. The component hides it from assistive technology. */
  icon?: React.ReactNode
  title?: string
  children: React.ReactNode
  /** Inline control slot, for example the "Lengkapi data" Button. */
  action?: React.ReactNode
  /** `compact` is the admin drawer note: a 12px body with 10px padding. */
  density?: "default" | "compact"
  className?: string
}

/**
 * One inline note: a colour step, an optional icon, a title and a body, plus
 * one action. Replaces the flag, claim, read-only, sample-note, audit-note,
 * study-prompt, section-note, drawer-stamp and drawer-note rules. Text contrast
 * is checked per tone: the lightest is 5.7:1 against its own surface.
 */
export function Callout({ tone = "info", icon, title, children, action, density = "default", className }: CalloutProps) {
  const compact = density === "compact"

  return (
    <div
      data-slot="callout"
      data-tone={tone}
      role={ROLES[tone]}
      className={cn("rounded-lg", compact ? "px-3 py-2.5 text-xs leading-5" : "px-3.5 py-3 text-[13px] leading-5", TONES[tone], className)}
    >
      <div className="flex items-start gap-2.5">
        {icon ? (
          <span aria-hidden className="mt-0.5 shrink-0 [&_svg]:size-[18px]">
            {icon}
          </span>
        ) : null}
        <div className="min-w-0">
          {title ? <strong className={cn("block font-bold", compact ? "text-xs" : "text-[13px]")}>{title}</strong> : null}
          <div className={cn("min-w-0", title && "mt-0.5 text-xs")}>{children}</div>
        </div>
      </div>
      {action ? (
        <div className={cn("mt-2.5 flex flex-wrap items-center gap-2", icon && "min-[600px]:pl-7", "max-[600px]:[&_[data-slot=button]]:min-h-11")}>
          {action}
        </div>
      ) : null}
    </div>
  )
}

import * as React from "react"

import { cn } from "../lib/utils"

export interface FormFieldProps {
  label: string
  /** Quiet help line under the control. */
  hint?: string
  /** Validation message; renders `role="alert"` and marks the control invalid. */
  error?: string
  /** Spans every column of the surrounding `FormGrid`. */
  wide?: boolean
  children: React.ReactNode
  className?: string
}

/**
 * One labelled field of a `FormGrid`. The label wraps the control, so the
 * association needs no id. When `error` is set, the message carries
 * `role="alert"` and the component marks the control with `aria-invalid` and
 * `aria-describedby` pointing at that message; props the caller sets on the
 * control win.
 */
export function FormField({ label, hint, error, wide = false, children, className }: FormFieldProps) {
  const errorId = React.useId()
  const childProps = (React.isValidElement(children) ? children.props : {}) as Record<string, unknown>
  const control =
    error && React.isValidElement(children)
      ? React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
          ...(childProps["aria-invalid"] === undefined ? { "aria-invalid": true } : {}),
          ...(childProps["aria-describedby"] === undefined ? { "aria-describedby": errorId } : {}),
        })
      : children

  return (
    <label className={cn("grid min-w-0 gap-1.5 text-xs font-semibold text-brand-muted", wide && "col-span-full max-[600px]:col-span-1", className)}>
      <span>{label}</span>
      {control}
      {hint ? <span className="text-xs font-normal text-brand-muted">{hint}</span> : null}
      {error ? (
        <span id={errorId} role="alert" className="text-xs font-semibold text-destructive">
          {error}
        </span>
      ) : null}
    </label>
  )
}

export interface FormGridProps {
  /** Two columns from 600px up; always one column below. Default 2. */
  columns?: 1 | 2
  children: React.ReactNode
  className?: string
}

/**
 * The two-column admin form grid: wide rows span both columns and every field
 * is one column on a phone. Controls inside pick up the sizing band — 32px from
 * 600px up, never under 44px below — so a page does not restate it.
 */
export function FormGrid({ columns = 2, children, className }: FormGridProps) {
  return (
    <div
      data-slot="form-grid"
      data-columns={columns}
      className={cn(
        "grid items-start gap-x-3.5 gap-y-4",
        columns === 2 ? "grid-cols-2 max-[600px]:grid-cols-1" : "grid-cols-1",
        "min-[600px]:[&_input]:h-8 min-[600px]:[&_select]:h-8 min-[600px]:[&_[data-slot=select-trigger]]:h-8",
        "max-[600px]:[&_input]:min-h-11 max-[600px]:[&_select]:min-h-11 max-[600px]:[&_textarea]:min-h-11 max-[600px]:[&_[data-slot=select-trigger]]:min-h-11",
        "max-[600px]:[&_input]:text-base max-[600px]:[&_select]:text-base",
        className,
      )}
    >
      {children}
    </div>
  )
}

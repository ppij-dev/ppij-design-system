import { cn } from "../lib/utils"

export interface DistributionSegment {
  label: string
  value: number
  /** Defaults to the token ramp: brand red first, then its tints, then the neutral greys. */
  color?: string
}

export interface DistributionBarProps {
  segments: DistributionSegment[]
  /** `sm` is the 8px figures-band bar, `md` the 12px stacked bar. A taller card bar takes `className="h-[18px]"`. */
  size?: "sm" | "md"
  /** `inline` is the figures-band legend, `list` the Statistik legend with counts. */
  legend?: "list" | "inline" | "none"
  /** Adds a labelled total row to the `list` legend. */
  totalLabel?: string
  formatValue?: (value: number) => string
  ariaLabel?: string
  className?: string
}

const PALETTE = ["var(--brand-red)", "#efbbc4", "#c6ccd2", "#fae6e9", "#1c1f23"]

const defaultFormat = (value: number) => value.toLocaleString("id-ID")

/**
 * One stacked bar: the completeness split on the dashboard figures band, the
 * degree composition beside it and the Statistik completeness card. Every
 * segment carries its own `title`, the legend is text rather than colour alone,
 * and the accessible name names every segment with its count.
 */
export function DistributionBar({ segments, size = "sm", legend = "list", totalLabel, formatValue = defaultFormat, ariaLabel, className }: DistributionBarProps) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0)
  const summary = segments.length
    ? segments.map((segment) => `${segment.label} ${formatValue(segment.value)}`).join(", ")
    : "Tidak ada data"

  return (
    <div data-slot="distribution-bar" data-size={size} className={cn("grid min-w-0 gap-2", className)}>
      <div
        role="img"
        aria-label={ariaLabel ?? summary}
        className={cn("flex min-w-0 gap-0.5 overflow-hidden", size === "sm" ? "h-2 rounded-full" : "h-3 rounded-md")}
      >
        {segments.map((segment, index) => {
          const pct = total > 0 ? (segment.value / total) * 100 : 0
          const color = segment.color ?? PALETTE[index % PALETTE.length]
          return pct > 0 ? (
            <span
              key={segment.label}
              className="block h-full min-w-0"
              style={{ width: `${pct}%`, background: color }}
              title={`${segment.label}: ${formatValue(segment.value)}`}
            />
          ) : null
        })}
      </div>

      {legend === "inline" ? (
        <p className="flex min-w-0 flex-wrap gap-x-3 gap-y-1 text-[11px] text-brand-muted">
          {segments.map((segment, index) => (
            <span key={segment.label} className="flex min-w-0 items-center gap-1.5">
              <span aria-hidden className="size-2.5 shrink-0 rounded-[3px]" style={{ background: segment.color ?? PALETTE[index % PALETTE.length] }} />
              <span className="truncate">
                {segment.label} <strong className="font-bold text-brand-ink tabular-nums">{formatValue(segment.value)}</strong>
              </span>
            </span>
          ))}
        </p>
      ) : null}

      {legend === "list" ? (
        <ul className="flex min-w-0 flex-wrap gap-x-[18px] gap-y-2 text-xs text-brand-muted">
          {segments.map((segment, index) => (
            <li key={segment.label} className="flex min-w-0 items-center gap-1.5">
              <span aria-hidden className="size-2.5 shrink-0 rounded-[3px]" style={{ background: segment.color ?? PALETTE[index % PALETTE.length] }} />
              <span className="truncate">{segment.label}</span>
              <strong className="font-bold text-brand-ink tabular-nums">{formatValue(segment.value)}</strong>
            </li>
          ))}
          {totalLabel ? (
            <li className="flex min-w-0 items-center gap-1.5 border-t border-brand-border pt-1.5">
              <span className="truncate font-semibold text-brand-ink">{totalLabel}</span>
              <strong className="font-extrabold text-brand-ink tabular-nums">{formatValue(total)}</strong>
            </li>
          ) : null}
        </ul>
      ) : null}
    </div>
  )
}

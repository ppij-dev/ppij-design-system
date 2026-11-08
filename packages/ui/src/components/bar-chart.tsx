import { cn } from "../lib/utils"

export interface BarChartDatum {
  label: string
  value: number
  /** Short context for the bar, for example "12 pendaftaran". */
  hint?: string
}

export interface BarChartProps {
  data: BarChartDatum[]
  /** `vertical` is the monthly trend; `horizontal` the facet distribution. */
  orientation?: "vertical" | "horizontal"
  /** Paints the newest bar in brand red, the earlier ones in the tint. */
  highlightLast?: boolean
  /** Scale ceiling; defaults to the largest value, never below 1. */
  max?: number
  /** Chart height in pixels for the vertical orientation. Default 150. */
  height?: number
  formatValue?: (value: number) => string
  /** Hairlines behind the vertical bars. */
  gridLines?: boolean
  /** `table` adds a screen-reader `<table>` carrying the same numbers. */
  fallback?: "table" | "none"
  ariaLabel?: string
  className?: string
}

const defaultFormat = (value: number) => value.toLocaleString("id-ID")

/**
 * The bar chart: a monthly trend read top to bottom, or a facet distribution
 * read left to right. Both orientations are divs on the token palette, so no
 * chart library and no SVG maths is needed. Every bar carries a `title` and its
 * label, a small value keeps a 4px visible bar, and `fallback="table"` gives a
 * screen reader the same numbers.
 */
export function BarChart({
  data,
  orientation = "vertical",
  highlightLast = false,
  max,
  height = 150,
  formatValue = defaultFormat,
  gridLines = false,
  fallback = "none",
  ariaLabel,
  className,
}: BarChartProps) {
  const ceiling = Math.max(max ?? 0, 1, ...data.map((item) => item.value))
  const summary = data.length
    ? data.map((item) => `${item.label} ${formatValue(item.value)}${item.hint ? ` (${item.hint})` : ""}`).join(", ")
    : "Tidak ada data"

  const table =
    fallback === "table" ? (
      <table className="sr-only">
        <caption>{ariaLabel ?? summary}</caption>
        <tbody>
          {data.map((item) => (
            <tr key={item.label}>
              <th scope="row">{item.label}</th>
              <td>{formatValue(item.value)}</td>
              <td>{item.hint ?? ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : null

  if (orientation === "horizontal") {
    return (
      <div data-slot="bar-chart" data-orientation="horizontal" className={cn("grid min-w-0 gap-3", className)}>
        <ol role="img" aria-label={ariaLabel ?? summary} className="grid list-none gap-2.5">
          {data.map((item) => {
            const pct = ceiling > 0 ? (item.value / ceiling) * 100 : 0
            return (
              <li key={item.label} className="grid grid-cols-[minmax(96px,150px)_minmax(0,1fr)_52px] items-center gap-2.5 text-[13px]">
                <span className="min-w-0 truncate text-brand-ink">{item.label}</span>
                <span className="h-2.5 min-w-0 overflow-hidden rounded-full bg-secondary">
                  <span
                    className="block h-full rounded-full bg-brand-red"
                    style={{ width: `${pct}%` }}
                    title={item.hint ?? `${item.label}: ${formatValue(item.value)}`}
                  />
                </span>
                <strong className="text-right font-extrabold tabular-nums text-brand-ink">{formatValue(item.value)}</strong>
              </li>
            )
          })}
        </ol>
        {table}
      </div>
    )
  }

  return (
    <div data-slot="bar-chart" data-orientation="vertical" className={cn("grid min-w-0 gap-2", className)}>
      <div role="img" aria-label={ariaLabel ?? summary} className="relative flex items-stretch gap-2" style={{ height }}>
        {gridLines ? (
          <span aria-hidden className="pointer-events-none absolute inset-0 grid grid-rows-4">
            {[0, 1, 2, 3].map((line) => (
              <span key={line} className="border-t border-dashed border-brand-border" />
            ))}
          </span>
        ) : null}
        {data.map((item, index) => {
          const pct = ceiling > 0 ? (item.value / ceiling) * 100 : 0
          const last = index === data.length - 1
          return (
            <span key={item.label} className="flex min-w-0 flex-1 flex-col justify-end gap-1.5">
              <span className="text-center text-[10px] font-semibold text-brand-muted tabular-nums">{formatValue(item.value)}</span>
              <span
                className={cn("block min-h-1 w-full rounded-t-[3px]", highlightLast && last ? "bg-brand-red" : "bg-[#efbbc4]")}
                style={{ height: `${pct}%` }}
                title={item.hint ?? `${item.label}: ${formatValue(item.value)}`}
              />
            </span>
          )
        })}
      </div>
      <div aria-hidden className="flex gap-2">
        {data.map((item) => (
          <span key={item.label} className="min-w-0 flex-1 truncate text-center text-[10px] text-brand-muted">
            {item.label}
          </span>
        ))}
      </div>
      {table}
    </div>
  )
}

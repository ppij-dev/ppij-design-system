import * as React from "react"

import { cn } from "../lib/utils"

export interface PieChartDatum {
  label: string
  value: number
  /** Defaults to the token ramp: brand red and its tints, then the neutral greys. */
  color?: string
}

export interface PieChartProps {
  data: PieChartDatum[]
  /** Outer diameter in pixels. Default 168. */
  size?: number
  donut?: boolean
  /** Quiet line inside or under the chart, for example "Total". */
  centerLabel?: string
  /** The figure the centre states, already formatted by the page. */
  centerValue?: string
  /** `list` is the default legend; `none` leaves the chart alone. */
  legend?: "list" | "none"
  /** `table` adds a screen-reader `<table>` carrying the same numbers. */
  fallback?: "table" | "none"
  /** Slices beyond this collapse into one "Lainnya" slice. Default 5. */
  maxSlices?: number
  formatValue?: (value: number) => string
  ariaLabel?: string
  className?: string
}

/** The approved token ramp: brand red first, then its tints, then the neutral greys. */
const PALETTE = ["var(--brand-red)", "#efbbc4", "#fae6e9", "#c6ccd2", "#1c1f23"]

const OTHER_LABEL = "Lainnya"

const defaultFormat = (value: number) => value.toLocaleString("id-ID")

/** One slice every 0.1% apart, with the rounding residual given back to the largest slice. */
function withPercentages(slices: PieChartDatum[]) {
  const total = slices.reduce((sum, slice) => sum + slice.value, 0)
  if (total <= 0) return slices.map((slice) => ({ ...slice, pct: 0 }))
  const rounded = slices.map((slice) => Math.round((slice.value / total) * 1000) / 10)
  const residual = Math.round((100 - rounded.reduce((sum, pct) => sum + pct, 0)) * 10) / 10
  if (residual !== 0) {
    const largest = rounded.indexOf(Math.max(...rounded))
    rounded[largest] = Math.round((rounded[largest] + residual) * 10) / 10
  }
  return slices.map((slice, index) => ({ ...slice, pct: rounded[index] }))
}

/** Keeps the largest slices and folds the rest into one "Lainnya" slice. */
function withMaxSlices(data: PieChartDatum[], maxSlices: number) {
  const positive = data.filter((slice) => slice.value > 0)
  if (positive.length <= maxSlices) return positive
  const sorted = [...positive].sort((a, b) => b.value - a.value)
  const kept = sorted.slice(0, maxSlices - 1)
  const rest = sorted.slice(maxSlices - 1)
  return [...kept, { label: OTHER_LABEL, value: rest.reduce((sum, slice) => sum + slice.value, 0), color: PALETTE[3] }]
}

/**
 * A pie or donut chart drawn by hand: one SVG path per slice, no dependency.
 * The owner's two charts for Statistik (Jenis kelamin and Anggota Biasa vs Luar
 * Biasa) are this component. Every slice is named in the legend beside its
 * count and its percentage, so colour is never the only carrier, and
 * `fallback="table"` puts the same numbers in a table for a screen reader.
 */
export function PieChart({
  data,
  size = 168,
  donut = false,
  centerLabel,
  centerValue,
  legend = "list",
  fallback = "none",
  maxSlices = 5,
  formatValue = defaultFormat,
  ariaLabel,
  className,
}: PieChartProps) {
  const slices = React.useMemo(() => withPercentages(withMaxSlices(data, maxSlices)), [data, maxSlices])
  const total = slices.reduce((sum, slice) => sum + slice.value, 0)

  const cx = size / 2
  const cy = size / 2
  const rOuter = size / 2 - 1
  const rInner = donut ? rOuter * 0.58 : 0

  const polar = (radius: number, deg: number): [number, number] => {
    const radians = ((deg - 90) * Math.PI) / 180
    return [cx + radius * Math.cos(radians), cy + radius * Math.sin(radians)]
  }

  /** One closed ring segment: outer arc, inner arc, back to the start. */
  const ringSeg = (start: number, end: number) => {
    const large = end - start > 180 ? 1 : 0
    const [x1, y1] = polar(rOuter, start)
    const [x2, y2] = polar(rOuter, end)
    const outer = `M ${x1} ${y1} A ${rOuter} ${rOuter} 0 ${large} 1 ${x2} ${y2}`
    if (rInner <= 0) return `${outer} L ${cx} ${cy} Z`
    const [x3, y3] = polar(rInner, end)
    const [x4, y4] = polar(rInner, start)
    return `${outer} L ${x3} ${y3} A ${rInner} ${rInner} 0 ${large} 0 ${x4} ${y4} Z`
  }

  let cursor = 0
  const arcs = slices.map((slice, index) => {
    const sweep = (slice.pct / 100) * 360
    const start = cursor
    const end = cursor + sweep
    cursor = end
    // A full circle degenerates into one arc, so it is drawn as two halves.
    const path = sweep >= 359.9 ? `${ringSeg(0, 180)} ${ringSeg(180, 360)}` : ringSeg(start, end)
    return { ...slice, path, color: slice.color ?? PALETTE[index % PALETTE.length] }
  })

  const summary = arcs.length
    ? arcs.map((arc) => `${arc.label} ${formatValue(arc.value)} (${arc.pct}%)`).join(", ")
    : "Tidak ada data"

  return (
    <div data-slot="pie-chart" data-size={size} className={cn("grid min-w-0 gap-3", className)}>
      <div className="flex min-w-0 flex-wrap items-center justify-center gap-4">
        <svg
          role="img"
          aria-label={ariaLabel ?? summary}
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="shrink-0"
        >
          {arcs.map((arc) => (
            <path
              key={arc.label}
              d={arc.path}
              fill={arc.color}
              stroke="var(--card)"
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
              fillRule="evenodd"
            >
              <title>{`${arc.label}: ${formatValue(arc.value)} (${arc.pct}%)`}</title>
            </path>
          ))}
          {donut && (centerValue || centerLabel) ? (
            <>
              <text x={cx} y={centerLabel ? cy - 2 : cy + 4} textAnchor="middle" className="fill-brand-ink text-[18px] font-extrabold">
                {centerValue}
              </text>
              {centerLabel ? (
                <text x={cx} y={cy + 14} textAnchor="middle" className="fill-brand-muted text-[11px]">
                  {centerLabel}
                </text>
              ) : null}
            </>
          ) : null}
        </svg>

        {legend === "list" ? (
          <ul className="grid min-w-0 gap-1.5 text-[13px]">
            {arcs.map((arc) => (
              <li key={arc.label} className="flex min-w-0 items-center gap-2">
                <span aria-hidden className="size-2.5 shrink-0 rounded-[3px]" style={{ background: arc.color }} />
                <span className="min-w-0 flex-1 truncate text-brand-ink">{arc.label}</span>
                <span className="shrink-0 font-semibold text-brand-ink tabular-nums">{formatValue(arc.value)}</span>
                <span className="w-11 shrink-0 text-right text-brand-muted tabular-nums">{arc.pct}%</span>
              </li>
            ))}
            {arcs.length && (centerLabel || total) ? (
              <li className="mt-0.5 flex items-center gap-2 border-t border-brand-border pt-1.5 text-brand-muted">
                <span className="min-w-0 flex-1">{centerLabel ?? "Total"}</span>
                <span className="shrink-0 font-bold text-brand-ink tabular-nums">{formatValue(total)}</span>
                <span className="w-11 shrink-0" />
              </li>
            ) : null}
          </ul>
        ) : null}
      </div>

      {fallback === "table" ? (
        <table className="sr-only">
          <caption>{ariaLabel ?? summary}</caption>
          <tbody>
            {arcs.map((arc) => (
              <tr key={arc.label}>
                <th scope="row">{arc.label}</th>
                <td>{formatValue(arc.value)}</td>
                <td>{arc.pct}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </div>
  )
}

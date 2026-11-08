import * as React from "react"

import { cn } from "../lib/utils"

export interface ExpandableTextProps {
  /** The text to clamp. Only a string: the clamp needs the text itself. */
  children: string
  /** Lines shown before the toggle appears. Default 3. */
  lines?: number
  /** Starts expanded; the component is uncontrolled. Default false. */
  defaultExpanded?: boolean
  /** Toggle label while clamped. Default "Lihat selengkapnya". */
  expandLabel?: string
  /** Toggle label while expanded. Default "Tampilkan lebih sedikit". */
  collapseLabel?: string
  className?: string
}

/**
 * Long text clamped to a few lines with a Lihat selengkapnya toggle. The clamp
 * is CSS, so the whole text stays in the accessibility tree and stays findable;
 * the toggle only appears when the text actually overflows, and it reports
 * `aria-expanded`.
 */
export function ExpandableText({ children, lines = 3, defaultExpanded = false, expandLabel = "Lihat selengkapnya", collapseLabel = "Tampilkan lebih sedikit", className }: ExpandableTextProps) {
  const textRef = React.useRef<HTMLSpanElement>(null)
  const [expanded, setExpanded] = React.useState(defaultExpanded)
  const [canExpand, setCanExpand] = React.useState(false)

  // The clamp is applied while collapsed, so overflow is measurable. Expanded
  // text is not re-measured: `canExpand` keeps its last value so the collapse
  // direction stays available.
  React.useEffect(() => {
    const element = textRef.current
    if (!element) return
    // Only measure while clamped: expanded text cannot overflow its clamp box.
    if (expanded) {
      setCanExpand(true)
      return
    }
    const measure = () => setCanExpand(element.scrollHeight > element.clientHeight + 1)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => observer.disconnect()
  }, [children, lines, expanded])

  return (
    <span data-slot="expandable-text" className={cn("grid justify-items-start gap-1", className)}>
      <span
        ref={textRef}
        className={cn("block min-w-0 break-words", !expanded && "overflow-hidden")}
        style={expanded ? undefined : { display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: lines }}
      >
        {children}
      </span>
      {canExpand ? (
        <button
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded((value) => !value)}
          className={cn(
            "-ml-px text-left text-[13px] font-bold text-brand-red underline-offset-2 hover:underline",
            "min-h-8 max-[600px]:min-h-11",
            "focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
          )}
        >
          {expanded ? collapseLabel : expandLabel}
        </button>
      ) : null}
    </span>
  )
}

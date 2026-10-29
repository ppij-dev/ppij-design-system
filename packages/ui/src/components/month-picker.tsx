import { cn } from "../lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"

const MONTHS_ID = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]
const MONTHS_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

export interface MonthPickerProps {
  /** Group label; the two menus are meaningless apart. */
  label: string
  /** Wire value "YYYY-MM"; either part may still be empty while the member is choosing. */
  value: string
  onChange: (value: string) => void
  locale?: "id" | "en"
  className?: string
}

/**
 * Month and year entry (WIZ106-09), extracted from the wizard: two
 * Selects, named months plus a year, in a 1.35fr / 1fr grid. The
 * native month input is deliberately not used (WebKit-hostile). The
 * composed "YYYY-MM" wire format never changes.
 */
export function MonthPicker({ label, value, onChange, locale = "id", className }: MonthPickerProps) {
  const [year = "", month = ""] = value ? value.split("-") : []
  const months = locale === "en" ? MONTHS_EN : MONTHS_ID
  const [monthWord, yearWord] = locale === "en" ? ["Month", "Year"] : ["Bulan", "Tahun"]
  const years = Array.from({ length: new Date().getFullYear() - 1989 + 15 }, (_, i) => String(1990 + i)).reverse()
  const compose = (y: string, m: string) => (y || m ? `${y}-${m}` : "")
  return (
    <div role="group" aria-label={label} className={cn("min-w-0 w-full", className)}>
      <p className="mb-2 text-sm font-medium text-brand-ink">{label}</p>
      <div className="grid w-full grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] gap-2">
        <Select value={month || ""} onValueChange={(next) => onChange(compose(year, next))}>
          <SelectTrigger aria-label={`${label}: ${monthWord}`} className="min-h-11 w-full min-w-0 bg-card">
            <SelectValue placeholder={monthWord} />
          </SelectTrigger>
          <SelectContent position="popper" align="start" avoidCollisions={false} className="max-h-72">
            {months.map((name, i) => (
              <SelectItem key={name} value={String(i + 1).padStart(2, "0")}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={year || ""} onValueChange={(next) => onChange(compose(next, month))}>
          <SelectTrigger aria-label={`${label}: ${yearWord}`} className="min-h-11 w-full min-w-0 bg-card">
            <SelectValue placeholder={yearWord} />
          </SelectTrigger>
          <SelectContent position="popper" align="start" avoidCollisions={false} className="max-h-72">
            {years.map((y) => (
              <SelectItem key={y} value={y}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

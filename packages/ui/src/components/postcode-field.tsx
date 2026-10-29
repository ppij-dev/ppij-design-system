import { cn } from "../lib/utils"
import { Button } from "./button"
import { Input } from "./input"

export interface PostcodeCandidate {
  label: string
  onSelect: () => void
}

export interface PostcodeFieldProps {
  value: string
  onChange: (value: string) => void
  /** Runs the address lookup for the current code; the data source stays in the application. */
  onSearch: () => void
  searching?: boolean
  searchLabel?: string
  /** Line under the field: a resolved address, an instruction, or an error. */
  statusText?: string
  /** When a lookup returns several places, each becomes a switchable candidate button. */
  candidates?: PostcodeCandidate[]
  placeholder?: string
  className?: string
}

/**
 * Japanese postcode entry with address lookup, extracted from the
 * wizard PostcodeField: the code input and a "Cari alamat" button on
 * one row (both field height), a status line, and candidate buttons
 * when the code maps to more than one place. The lookup itself is
 * the application's; this is the presentation and the states.
 */
export function PostcodeField({
  value,
  onChange,
  onSearch,
  searching = false,
  searchLabel = "Cari alamat",
  statusText,
  candidates = [],
  placeholder = "700-0001",
  className,
}: PostcodeFieldProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <div className="flex flex-wrap gap-2">
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          inputMode="numeric"
          autoComplete="postal-code"
          placeholder={placeholder}
          className="min-h-11 min-w-0 flex-1"
        />
        <Button type="button" variant="outline" className="min-h-11" disabled={searching} onClick={onSearch}>
          {searchLabel}
        </Button>
      </div>
      {statusText && (
        <p role="status" className="text-sm text-brand-muted">
          {statusText}
        </p>
      )}
      {candidates.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {candidates.map((candidate) => (
            <Button key={candidate.label} type="button" variant="outline" className="min-h-11" onClick={candidate.onSelect}>
              {candidate.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}

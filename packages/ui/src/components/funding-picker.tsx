import { TagInput } from "./tag-input"

export interface FundingPickerProps {
  /** Picked funding sources, as display labels. */
  values: string[]
  onChange: (values: string[]) => void
  /** Catalogue entries offered as one-tap suggestions; the lookup stays in the application. */
  options: string[]
  /** The wizard caps funding at 3 sources (MAX_FUNDING). */
  max?: number
  placeholder?: string
  maxMessage?: string
  className?: string
}

/**
 * Funding source picker, extracted from the wizard FundingPicker:
 * the minat-style multi-pick (chips in the field, catalogue
 * suggestions under it, custom entries allowed) with the funding
 * cap applied. The catalogue itself arrives as props; searching
 * and suggesting new sources stay in the application.
 */
export function FundingPicker({
  values,
  onChange,
  options,
  max = 3,
  placeholder = "Cari atau ketik sumber pendanaan",
  maxMessage,
  className,
}: FundingPickerProps) {
  const reachedMax = values.length >= max
  return (
    <div className={className}>
      <TagInput
        values={values}
        onChange={(next) => {
          if (next.length <= max) onChange(next)
        }}
        suggestions={reachedMax ? [] : options.filter((option) => !values.includes(option))}
        placeholder={reachedMax ? "" : placeholder}
      />
      {reachedMax && (
        <p role="status" className="mt-2 text-sm text-brand-muted">
          {maxMessage ?? `Maksimal ${max} sumber pendanaan.`}
        </p>
      )}
    </div>
  )
}

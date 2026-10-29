import { RadioGroup as RadioGroupPrimitive } from "radix-ui"

import { cn } from "../lib/utils"

export interface PillRadioOption {
  value: string
  label: string
}

export interface PillRadioProps {
  options: PillRadioOption[]
  value: string
  onChange: (value: string) => void
  ariaLabel: string
  className?: string
}

/** The wizard pill treatment (WIZ106-16): the selected pill takes the primary tint. */
export const pillRadioClass =
  "min-h-11 max-w-full rounded-full border border-border bg-card px-4 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 data-[state=checked]:border-primary data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary"

/**
 * Pill radio group, extracted from the wizard steps (Jenis kelamin,
 * Jenjang): one control per group, options as 44px pills that wrap,
 * the chosen pill tinted with the primary color. Use for short,
 * mutually exclusive choice sets where every option should stay
 * visible; longer sets belong in a Select.
 */
export function PillRadio({ options, value, onChange, ariaLabel, className }: PillRadioProps) {
  return (
    <RadioGroupPrimitive.Root
      value={value}
      onValueChange={onChange}
      aria-label={ariaLabel}
      className={cn("flex flex-wrap gap-2", className)}
    >
      {options.map((option) => (
        <RadioGroupPrimitive.Item key={option.value} value={option.value} className={pillRadioClass}>
          {option.label}
        </RadioGroupPrimitive.Item>
      ))}
    </RadioGroupPrimitive.Root>
  )
}

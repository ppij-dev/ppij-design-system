import { IconCheck, IconLanguage } from "@tabler/icons-react"

import { cn } from "../lib/utils"
import { Button } from "./button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu"
import { SavingIndicator, type SavingStatus } from "./saving-indicator"
import { SegmentedProgress } from "./segmented-progress"

export interface WizardLanguage {
  label: string
  current?: boolean
}

export interface WizardHeaderProps {
  /** Counter text, for example "Langkah 3 dari 7". */
  stepText: string
  /** Step title shown after the counter on sm and wider. */
  title: string
  current: number
  total: number
  progressLabel: string
  savingStatus: SavingStatus
  locale?: "id" | "en"
  languages: WizardLanguage[]
  languageLabel?: string
  onLanguageSelect?: (language: WizardLanguage) => void
  className?: string
}

/**
 * The wizard's sticky sub-header (WIZ106-09), extracted from
 * Wizard.tsx: step counter with the step title, the draft
 * SavingIndicator and the language menu on the right, and the
 * segmented progress below. It sits under the portal header inside
 * the shell content; the consumer supplies the horizontal bleed
 * (for example -mx-4) its layout needs.
 */
export function WizardHeader({
  stepText,
  title,
  current,
  total,
  progressLabel,
  savingStatus,
  locale = "id",
  languages,
  languageLabel = "Pilih bahasa",
  onLanguageSelect,
  className,
}: WizardHeaderProps) {
  return (
    <div className={cn("sticky top-0 z-40 border-b border-border bg-card px-4 py-3", className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="min-w-0 text-sm leading-5 font-medium text-brand-ink" aria-live="polite">
          {stepText}
          <span className="hidden sm:inline"> — {title}</span>
        </p>
        <div className="flex shrink-0 items-center gap-1">
          <SavingIndicator status={savingStatus} locale={locale} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="ghost" size="icon" aria-label={languageLabel}>
                <IconLanguage />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {languages.map((language) => (
                <DropdownMenuItem key={language.label} onSelect={() => onLanguageSelect?.(language)}>
                  <span className="flex-1">{language.label}</span>
                  {language.current && <IconCheck className="size-4 text-brand-red" aria-hidden="true" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <SegmentedProgress current={current} total={total} label={progressLabel} className="mt-3" />
    </div>
  )
}

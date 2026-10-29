import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react"

import { cn } from "../lib/utils"
import { Button } from "./button"
import { Spinner } from "./spinner"

export interface WizardFooterProps {
  onBack: () => void
  onContinue: () => void
  backLabel?: string
  continueLabel?: string
  backDisabled?: boolean
  continueDisabled?: boolean
  /** While continuing submits: spinner plus loadingLabel inside the primary button. */
  continueLoading?: boolean
  loadingLabel?: string
  /** The final submit carries no arrow. */
  showArrow?: boolean
  className?: string
}

/**
 * The wizard's fixed bottom navigation bar, extracted from
 * Wizard.tsx: two equal buttons (Kembali outline, Lanjut primary)
 * in a white bar pinned to the viewport bottom. Named exception to
 * the default button size: a fixed navigation bar is a navigation
 * target, so its buttons are field height (44px) and text-base,
 * like the portal bottom nav. The loading state follows the rule:
 * spinner inside the primary button.
 */
export function WizardFooter({
  onBack,
  onContinue,
  backLabel = "Kembali",
  continueLabel = "Lanjut",
  backDisabled = false,
  continueDisabled = false,
  continueLoading = false,
  loadingLabel = "Mengirim…",
  showArrow = true,
  className,
}: WizardFooterProps) {
  return (
    <div className={cn("fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card", className)}>
      <div className="mx-auto flex max-w-2xl gap-3 px-4 py-3">
        <Button type="button" variant="outline" onClick={onBack} disabled={backDisabled} className="min-h-11 flex-1 text-base font-semibold">
          <IconArrowLeft size={18} aria-hidden="true" />
          {backLabel}
        </Button>
        <Button
          type="submit"
          onClick={onContinue}
          disabled={continueDisabled || continueLoading}
          aria-busy={continueLoading}
          className="min-h-11 flex-1 text-base font-semibold"
        >
          {continueLoading ? (
            <>
              <Spinner size="sm" decorative />
              <span>{loadingLabel}</span>
            </>
          ) : (
            <>
              {continueLabel}
              {showArrow && <IconArrowRight size={18} aria-hidden="true" />}
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

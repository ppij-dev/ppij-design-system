import { AdminDrawer } from "./admin-drawer"
import { Button } from "./button"
import { Input } from "./input"
import { Label } from "./label"

export type SuggestKind = "institution" | "major" | "minat" | "funding"

const TITLES: Record<SuggestKind, [id: string, en: string]> = {
  institution: ["Sarankan institusi", "Suggest an institution"],
  major: ["Sarankan jurusan", "Suggest a major"],
  minat: ["Sarankan minat", "Suggest an interest"],
  funding: ["Sarankan sumber dana", "Suggest a funding source"],
}

const NAME_LABELS: Record<SuggestKind, [id: string, en: string]> = {
  institution: ["Nama institusi", "Institution name"],
  major: ["Nama jurusan", "Major name"],
  minat: ["Nama minat", "Interest name"],
  funding: ["Nama sumber dana", "Funding source name"],
}

export interface SuggestionSheetProps {
  kind: SuggestKind | null
  onDismiss: () => void
  name: string
  onNameChange: (name: string) => void
  onConfirm: () => void
  error?: string
  /** For institution suggestions the wizard shows the chosen prefecture as context. */
  prefectureLabel?: string
  locale?: "id" | "en"
}

/**
 * The use-and-suggest sheet (WIZ106-13), extracted from the wizard
 * SuggestionSheet on AdminDrawer: a TypeAhead "not in the list"
 * action opens it with the typed text pre-filled; "Gunakan &
 * sarankan" commits, and cancel, Escape, backdrop, and close never
 * commit. The parent owns the name, the error, and the commit.
 */
export function SuggestionSheet({
  kind,
  onDismiss,
  name,
  onNameChange,
  onConfirm,
  error,
  prefectureLabel,
  locale = "id",
}: SuggestionSheetProps) {
  const en = locale === "en"
  return (
    <AdminDrawer
      open={kind !== null}
      onOpenChange={(open) => {
        if (!open) onDismiss()
      }}
      locale={locale}
      title={kind ? (en ? TITLES[kind][1] : TITLES[kind][0]) : ""}
      description={en ? "The name is queued for admin review; your registration can continue meanwhile." : "Nama diusulkan untuk ditinjau pengurus; pendaftaran tetap bisa dilanjutkan."}
      footer={
        <Button type="submit" form="ds-suggestion-form">
          {en ? "Use & suggest" : "Gunakan & sarankan"}
        </Button>
      }
    >
      <form
        id="ds-suggestion-form"
        className="grid gap-4"
        onSubmit={(event) => {
          event.preventDefault()
          onConfirm()
        }}
      >
        <div className="grid gap-2">
          <Label htmlFor="ds-suggestion-name">{kind ? (en ? NAME_LABELS[kind][1] : NAME_LABELS[kind][0]) : ""}</Label>
          <Input id="ds-suggestion-name" value={name} onChange={(event) => onNameChange(event.target.value)} aria-invalid={Boolean(error) || undefined} autoComplete="off" />
        </div>
        {kind === "institution" ? (
          <p className="text-sm text-brand-muted">
            {en ? "Prefecture" : "Prefektur"}: {prefectureLabel ?? "—"}
          </p>
        ) : null}
        {error ? (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        ) : null}
        <p className="text-sm leading-6 text-brand-muted">
          {en
            ? "Your answer is used right away so registration can continue, and the name is proposed for the catalogue for admin review."
            : "Jawaban ini langsung dipakai agar pendaftaran bisa lanjut, dan nama diusulkan ke katalog untuk ditinjau pengurus nasional."}
        </p>
      </form>
    </AdminDrawer>
  )
}

import * as React from "react"
import { IconPencil } from "@tabler/icons-react"

import { Button } from "./button"
import { FormPanel } from "./form-panel"

export interface ReviewPanelProps {
  title: string
  children: React.ReactNode
  editable?: boolean
  onEdit?: () => void
  editLabel?: string
  /** Incomplete sections get the heavy destructive border and a "Belum lengkap" line. */
  incomplete?: boolean
  incompleteLabel?: string
  className?: string
}

/**
 * One review panel, extracted from the wizard Review: a FormPanel
 * with an h2 title, the section's data as content, and the shared
 * "Edit bagian ini" outline action in the footer when the section
 * may be edited. This is the panel the profile's read-first
 * sections mirror.
 */
export function ReviewPanel({
  title,
  children,
  editable = true,
  onEdit,
  editLabel = "Edit bagian ini",
  incomplete = false,
  incompleteLabel = "Belum lengkap",
  className,
}: ReviewPanelProps) {
  return (
    <FormPanel
      title={title}
      titleAs="h2"
      className={incomplete ? "border-2 border-destructive" : className}
      footer={
        editable ? (
          <Button type="button" variant="outline" onClick={onEdit}>
            <IconPencil size={16} aria-hidden="true" />
            {editLabel}
          </Button>
        ) : undefined
      }
    >
      {incomplete && <p className="mb-3 text-sm font-semibold text-destructive">{incompleteLabel}</p>}
      {children}
    </FormPanel>
  )
}

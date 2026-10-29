import { IconPencil } from "@tabler/icons-react";
import { Badge } from "./badge";
import { Button } from "./button";
import { Card } from "./card";

export interface EditablePanelProps {
  title: string;
  /** One line on how this panel behaves: what updates directly, or what is reviewed. */
  description?: string;
  /** A change proposal for this panel is waiting for review: shows the pending badge. */
  pending?: boolean;
  pendingLabel?: string;
  onEdit: () => void;
  editLabel?: string;
  /** A pending-proposal block (for example an Alert listing the proposed values), shown under the read values. */
  proposal?: React.ReactNode;
  /** The read view: committed values as text. */
  children: React.ReactNode;
}

/**
 * The standard editable surface of the portal: a read-first panel.
 * The panel only ever reads: title, one behaviour line, committed
 * values as text, and an Edit action. Editing itself happens in
 * the AdminDrawer (a right drawer on desktop, a bottom sheet on
 * the phone), one panel at a time; the page owns the drawer.
 * Reviewed changes leave a proposal block inside the panel with a
 * Menunggu badge while the current values stay in effect. This is
 * the profile pattern; every editable surface follows it.
 */
export function EditablePanel({ title, description, pending = false, pendingLabel = "Menunggu", onEdit, editLabel = "Edit", proposal, children }: EditablePanelProps) {
  return (
    <Card className="gap-0 rounded-xl border border-brand-border bg-card py-0">
      <div className="flex flex-row items-start justify-between gap-3 px-5 pt-5 pb-4">
        <div className="grid min-w-0 gap-1.5">
          <h2 className="text-base leading-6 font-bold text-brand-ink">{title}</h2>
          {description ? <p className="text-sm leading-5 text-brand-muted">{description}</p> : null}
        </div>
        {pending ? <Badge variant="outline" className="shrink-0">{pendingLabel}</Badge> : null}
      </div>
      <div className="grid gap-4 px-5 pb-5">
        {children}
        {proposal}
        <div className="flex justify-end border-t border-brand-border pt-4">
          <Button type="button" variant="outline" onClick={onEdit}>
            <IconPencil aria-hidden="true" />
            {editLabel}
          </Button>
        </div>
      </div>
    </Card>
  );
}

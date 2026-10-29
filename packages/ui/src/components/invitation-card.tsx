import { Button } from "./button";
import { Card } from "./card";

export interface InvitationCardProps {
  heading: string;
  body: string;
  actionLabel: string;
  href: string;
}

/**
 * The Beranda role-invitation card, extracted exactly from
 * ppij-identity-sso Beranda.tsx (the me.invitation element): spans
 * both columns, heading, one body line (the app composes it from
 * role, unit, and the invitation end date), and an outline action.
 * Real copy: heading "Undangan peran", action "Lihat undangan".
 */
export function InvitationCard({ heading, body, actionLabel, href }: InvitationCardProps) {
  return (
    <Card className="gap-3 rounded-xl border border-brand-border bg-card py-5 md:col-span-2">
      <div className="px-5">
        <h2 className="font-bold text-brand-ink">{heading}</h2>
        <p className="mt-1 text-sm text-brand-muted">{body}</p>
      </div>
      <div className="px-5">
        <Button asChild variant="outline" className="min-h-11 px-5">
          <a href={href}>{actionLabel}</a>
        </Button>
      </div>
    </Card>
  );
}

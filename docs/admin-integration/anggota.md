# Anggota UX handoff

Read [shared shell rules](README.md) first. Preview: `prototypes/redesign-adminv1/src/App.tsx`, `members` page. Production: `ppij-identity/web/src/components/admin/AnggotaScreen.tsx` and `MemberDirectory.tsx`; route `/admin/anggota` and `/en/admin/anggota`.

## Directory

Use the preview's white workspace island, page heading, search/advanced-filter toolbar, readable member rows, and detail drawer. Search by the fields the production endpoint actually supports; the preview's name/number/email/komsat text is a UX target only if server search can provide it. Show current scope, name/email, member number, komsat, education, membership status, and validity date without revealing sensitive fields. Status must have a text label. On phones use cards rather than a compressed desktop table. Preserve the real pagination and total count; the preview's sample people and local filtering are illustrative.

Keep the production **Direktori / Undangan** views and their existing summary. The preview only sketches an invite drawer; production `AnggotaScreen` has single/bulk invitation, recipient validation, duplicate handling, komsat selection, review, and result states. Retain those full flows and their API behavior. Make the komsat selector searchable; constrain options to the admin's scope. Do not turn an invitation into a local-only success toast. A successful invite should show the actual created/skipped result and refresh relevant counts.

## Detail and state

The member detail opens from a row with the selected member's real data, accessible close/back behavior, and loading/error handling. Respect field masking, audited reveal, and action permissions. Search/filter changes reset pagination appropriately; scope changes clear stale selected members and refetch the directory. Provide a useful no-results state with a way to clear filters. Keep both locales and locale-aware dates.

## Acceptance

- Directory, invitation, and detail remain functional with live scoped data.
- Single/bulk invitation validation and result feedback are preserved.
- Phone and tablet rows, filters, drawers, and empty states remain readable.
- No sample members or local-only invitation behavior reaches production.

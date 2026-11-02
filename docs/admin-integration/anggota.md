# Anggota UX handoff

Read [shared shell rules](README.md) first. Preview: `prototypes/redesign-adminv1/src/App.tsx`, `members` page. Production: `ppij-identity/web/src/components/admin/AnggotaScreen.tsx` and `MemberDirectory.tsx`; route `/admin/anggota` and `/en/admin/anggota`.

## Directory

Use the preview's white workspace island, page heading, search/advanced-filter toolbar, readable member rows, and detail drawer. Search by the fields the production endpoint actually supports; the preview's name/number/email/komsat text is a UX target only if server search can provide it. Show current scope, name/email, member number, komsat, education, membership status, and validity date without revealing sensitive fields. Status must have a text label. On phones use cards rather than a compressed desktop table. Preserve the real pagination and total count; the preview's sample people and local filtering are illustrative.

Keep the production **Direktori / Status undangan** views and their existing summary. The preview now demonstrates an invitation form, review, result, and status list with synthetic local data; production `AnggotaScreen` has single/bulk invitation, recipient validation, duplicate handling, komsat selection, review, and result states. Retain those full flows and their API behavior. Make the komsat selector searchable; constrain options to the admin's scope. A successful production invite should show the actual created/skipped result and refresh relevant counts. Production resend and cancel actions must use their existing server authorization and error handling.

## Multi-select filter API gap

The approved preview uses searchable, checked **multiple selections for every directory filter**: status, komsat, institution, degree, field of study, scholarship, source, activation, and expiry window. Values within one category use OR; different categories and the text query use AND. One invitation still has exactly one destination komsat. Do not represent selected values as one comma-joined string or fetch one page per selection and combine it in the browser: that would give incorrect totals and pagination.

As of this handoff, `ppij-identity/web/src/lib/types.ts` defines each `MemberDirectoryFilters` entry as one string, `web/src/lib/api.ts` serializes each with `URLSearchParams.set`, and `api/openapi.yaml` declares each `/v1/admin/members` filter as a scalar query parameter. The identity agent should add an approved OpenSpec/API change before integrating the new filter UX. Define array parameters (for example repeated query keys), parse and validate them in the membership service, apply OR within each filter and AND across filters in the scoped query, and return the correct total/page counts. Update OpenAPI, generated/client types, query keys, and focused API and UI tests together. Preserve server-side scope checks and a documented limit for selections.

The UI also needs scoped option discovery for searchable institution and field-of-study selectors, and suitable option lists for the other categories. Use stable IDs/codes where available and labels for display. Existing reference catalogues may supply some options; if they cannot provide the actual scoped directory values, add a small scoped facets endpoint with search and pagination. It must not expose members outside the current admin scope. Keep current free-text matching behavior available only if the product still needs it as a separate search field.

The invitation status preview also allows multiple status and komsat selections. `useAdminInvitations` currently serializes one `status` and one `komsatId`; extend that list contract and its server query if this view is integrated with multi-select. Invitation creation remains one destination komsat per batch. Its resend, renew, correction, and cancellation actions retain their distinct production rules.

The invitation detail should present a dated vertical timeline for invitation creation, email delivery attempts, and membership progress. Show the latest email state and each attempt's date from `send_log`, while using the real invitation/member timestamps for status milestones. The preview's dated events are illustrative; do not infer a status-change date from `sent_at` or fabricate a send attempt when the production record lacks one.

## Detail and state

Invitation creation, editing, detail, and confirmation use `AdminDrawer size="sm" density="compact"`: 380px on desktop, 13px body, 14px title, 12px labels, and 12px panel padding. Use `Button size="sm"` (32px) and 32px form controls at 900px and wider. Below 900px keep 44px touch controls and 16px editable inputs in a full-width bottom sheet. Footer actions wrap rather than overflow. See Storybook **Admin/AdminDrawer** compact/default/wide invitation stories and **Portal/Button → Admin Drawer Actions**. Member-directory details retain their wider layout for the additional information.

The member detail opens from a row with the selected member's real data, accessible close/back behavior, and loading/error handling. Respect field masking, audited reveal, and action permissions. Search/filter changes reset pagination appropriately; scope changes clear stale selected members and refetch the directory. Provide a useful no-results state with a way to clear filters. Keep both locales and locale-aware dates.

The preview detail now groups membership, email delivery/last send, education, and personal data. Production should fill these from `MemberDirectoryDetail`, including optional badge, email failure reason, last email, and spam complaint when present. Date of birth, phone, emergency contact, and document metadata remain masked or summarized until the existing `POST /v1/admin/members/{id}/reveal` succeeds. Preserve its authorization, audit record, loading/error states, and the rule that the revealed phone alone enables WhatsApp. The preview's reveal shows only synthetic examples and must not be copied as production data or as an unaudited local toggle.

## Acceptance

- Directory, invitation, and detail remain functional with live scoped data.
- Single/bulk invitation validation and result feedback are preserved.
- Phone and tablet rows, filters, drawers, and empty states remain readable.
- No sample members or local-only invitation behavior reaches production.

Invitation cancellation and resend now require a confirmation that names the affected email. The preview also supports editing name/email with validation and local save. Production currently has an email correction action for failed delivery; before integrating general name/email editing, add an approved API contract for pending invitations with full-name and email fields, scoped authorization, conflict handling, audit logging, and explicit rules for invalidating/resending links after an address changes. Accepted invitations must not edit the member profile through this action.

## Member status actions (API gap)

The member detail drawer shows status actions (Tangguhkan, Aktifkan kembali, Transfer komsat, Cabut) gated by the production RBAC matrix (`docs/rbac.md`): suspend/reactivate need Admin Korda or Admin Nasional, revoke needs Admin Nasional, and a komsat admin sees no status actions. Production has no endpoints for any of them — the membership status enum exists (`members.status`: ACTIVE, EXPIRED, SUSPENDED, REVOKED, plus INCOMPLETE for imported pre-activation) and `suspend_reason` is already a known field. Indonesian labels follow the portal profile mapping (`web/src/components/portal/Profil.tsx`): ACTIVE "Aktif", EXPIRED "Berakhir", SUSPENDED "Ditangguhkan", REVOKED "Dicabut", INCOMPLETE "Belum lengkap" — the preview now uses the same terms. Contracts to implement, all audit-logged and scoped to the caller's subtree (target outside the subtree answers 404, per the RBAC convention; missing permission answers 403):

- `POST /v1/admin/members/{id}/suspend` — body `{ "reason": string }` (required, stored as `suspend_reason`). Precondition: status ACTIVE → SUSPENDED. Korda and national admins.
- `POST /v1/admin/members/{id}/reactivate` — no body. Precondition: SUSPENDED → ACTIVE with the same validity window. Korda and national admins.
- `POST /v1/admin/members/{id}/transfer` — body `{ "target_komsat_id": uuid }`. Precondition: ACTIVE; the target komsat must lie inside the caller's scope. Korda and national admins (production today only moves members in bulk through claim approval). Response carries the updated `komsat_id`/`komsat_name`.
- `POST /v1/admin/members/{id}/revoke` — body `{ "reason": string }` (required). Precondition: ACTIVE or SUSPENDED → REVOKED. National admin only; irreversible — re-entry happens through a new registration. This is the existing `revoke_membership` permission; no korda/komsat variant may be added without an RBAC change.

Shared rules: wrong current status answers 409 `invalid_status`; every action writes an audit row (who, when, scope, reason); review approval keeps refusing to re-activate SUSPENDED/REVOKED memberships without the korda/national override (`ErrMembershipBlocked`); EXPIRED and INCOMPLETE are intentionally untouched — expiry is automatic and INCOMPLETE belongs to the member-activation flow.

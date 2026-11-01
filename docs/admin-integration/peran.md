# Admin & Peran UX handoff

Read [shared shell rules](README.md) first. Preview: `prototypes/redesign-adminv1/src/App.tsx`, `roles` page. Production: `ppij-identity/web/src/components/admin/RolesAdmin.tsx`; route `/admin/peran` and `/en/admin/peran`.

## Assignment list

Desktop rows must share column widths across the whole list (the preview uses CSS subgrid). A longer status such as **Diundang** must not move the **Admin** role or appointment date in just that row. Keep badges at their natural width and wrap long names/units. Below 600px, put identity and status on the first row and role/date beneath the identity.

Present the existing role assignments as a clear table on desktop and readable items on phone. Each item identifies the person, role, scope, appointment date, and status. Search and unit filtering must remain tied to real assignments; a selected unit must be searchable when the option list is long. Show the current administrative context and only actions allowed in that scope. Use explicit status labels and distinguish pending invitations from active assignments. Loading, no assignments, no search results, and failed reads need separate treatments.

## Appoint and remove

The preview's **Tunjuk pengurus** drawer presents unit selection, active-member search, role selection, and validity date in one form, matching production `RolesAdmin`. Preserve eligibility, duplicate prevention, residence-permit rules, submit errors, and success refresh. Removal names the role, person, and unit; retain the server-triggered last-admin warning and explicit second confirmation. Let the admin inspect the selected member, role, and scope before committing. Confirm destructive removal with the affected name and scope; handle conflicts and authorization errors. The server decides whether the assignment can be created or removed. Refresh list and counts after success and show a green check toast; show a distinct error without implying the action succeeded.

Do not copy the preview's four assignments, local generic detail drawer, or fixed dates. Keep real role names and permission logic from identity specs and APIs. Translate all copy and format dates per locale.

## Valid-until update (API gap)

The role detail drawer in the preview now lets the admin edit an assignment's **Berlaku sampai** date and save it; the save is local to the prototype. Production `RolesAdmin` only has appoint (`POST /v1/admin/roles`) and remove (`POST /v1/admin/roles/{id}/remove`), so there is no endpoint that changes an existing assignment's validity. Before integrating this edit, add an approved API contract — for example `PATCH /v1/admin/roles/{assignment_id}` accepting only `valid_until` (ISO date; empty/null allowed only where appoint already permits no end date). The contract must specify: scoped authorization identical to appoint/remove (national admin edits any assignment in view; korda admin only assignments inside their korda subtree; komsat admin only their own komsat); validation that the new date is not in the past and not beyond the member's residence-permit expiry for strict units, reusing the appoint date rules and error codes; audit logging of admin, assignment, old value, new value, and timestamp; and link semantics — the update mutates the existing assignment in place (member-role link, id, and appointer stay intact, no re-appointment or duplicate row), and shortening a date to a past value must define whether expiry is immediate or scheduler-driven, returning a conflict/expired error consistent with the existing appointment errors.

## Acceptance

- Search/filter and assignment actions respect server scope and permissions.
- Appointment and removal retain their full production validation and confirmation.
- Long role/scope labels and drawers work at phone and tablet sizes.
- No illustrative assignment is migrated.

The management preview now uses a white page island, search, and searchable multiple unit selections with checkmarks. Selecting a Korda includes assignments in that Korda and its Komsat subtree. The production role response already includes scoped units and assignments: client filtering can implement this if the response is complete. If pagination is introduced, add array unit filters and matching server totals rather than filtering only a loaded page.

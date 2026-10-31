# Admin & Peran UX handoff

Read [shared shell rules](README.md) first. Preview: `prototypes/redesign-adminv1/src/App.tsx`, `roles` page. Production: `ppij-identity/web/src/components/admin/RolesAdmin.tsx`; route `/admin/peran` and `/en/admin/peran`.

## Assignment list

Present the existing role assignments as a clear table on desktop and readable items on phone. Each item identifies the person, role, scope, appointment date, and status. Search and unit filtering must remain tied to real assignments; a selected unit must be searchable when the option list is long. Show the current administrative context and only actions allowed in that scope. Use explicit status labels and distinguish pending invitations from active assignments. Loading, no assignments, no search results, and failed reads need separate treatments.

## Appoint and remove

The preview's **Tunjuk pengurus** drawer is a three-step presentation sketch. Retain production `RolesAdmin` appointment choices, confirmation, role eligibility, duplicate prevention, and removal safeguards. Let the admin inspect the selected member, role, and scope before committing. Confirm destructive removal with the affected name and scope; handle conflicts and authorization errors. The server decides whether the assignment can be created or removed. Refresh list and counts after success and show a green check toast; show a distinct error without implying the action succeeded.

Do not copy the preview's four assignments, local generic detail drawer, or fixed dates. Keep real role names and permission logic from identity specs and APIs. Translate all copy and format dates per locale.

## Acceptance

- Search/filter and assignment actions respect server scope and permissions.
- Appointment and removal retain their full production validation and confirmation.
- Long role/scope labels and drawers work at phone and tablet sizes.
- No illustrative assignment is migrated.

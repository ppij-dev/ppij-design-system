# Organisasi UX handoff

Read [shared shell rules](README.md) first. Preview: `prototypes/redesign-adminv1/src/App.tsx`, `units` page. Production: `ppij-identity/web/src/components/admin/UnitsAdmin.tsx`; route `/admin/units` and `/en/admin/units`.

## Structure

Use the preview's scannable unit cards and hierarchy as a presentation target: national → korda → komsat, with parent, member count, lead, and status where the production data supplies them. A national admin sees the network; a korda admin sees its subtree; a komsat context has no Organisasi navigation in the approved preview. Keep the actual route guarded if opened directly. Use explicit unit types and headings so the hierarchy is understandable without color or indentation alone. Cards should fit a phone, and long Japanese unit names should wrap rather than truncate essential meaning.

Production `UnitsAdmin` also displays unassigned prefectures and uses real prefecture/unit queries. Retain that information and its empty/loading/error states; the preview's four Korda cards and counts are illustrative. A unit detail should use live data and show available actions only when permitted.

## Create and manage

The preview's **Tambah unit** drawer is only a summary. Preserve production create/edit forms, required fields, parent selection, prefecture constraints, validation, and confirmation. All korda/komsat selectors must be searchable and limited to eligible choices. After a mutation, refetch the hierarchy and show the actual result. Handle duplicate names, conflicting assignments, unavailable parents, and permission errors using current API responses. Keep the server as the authority for hierarchy and scope.

## Acceptance

- The full hierarchy, unassigned-prefecture information, and management flows survive the visual change.
- Direct route access and every write remain server-authorized.
- Searchable selectors, long names, empty/error states, and forms work on phone and tablet.
- No sample counts, units, or local-only create behavior reaches production.

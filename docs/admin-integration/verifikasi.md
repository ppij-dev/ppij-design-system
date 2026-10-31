# Verifikasi UX handoff

Read [shared shell rules](README.md) first. Preview: `prototypes/redesign-adminv1/src/ReviewWorkspace.tsx` and `.css`. Production: `ppij-identity/web/src/components/admin/ReviewConsole.tsx`; route `/admin/review` and `/en/admin/review`. Production workflow/API and review ownership take precedence over preview simulation.

## Queue

Keep five tabs in this order: **Baru**, **Dikirim ulang**, **Sedang diperiksa**, **Menunggu anggota**, **Selesai**. Search should apply across all tabs and update every tab badge, so a result in another tab is discoverable. Keep the kind selector aligned with the search and advanced-filter controls at tablet width; the visible trigger starts at **Semua jenis** without a separate “Jenis” caption, while its accessible name identifies the purpose. Advanced filters include searchable, multiple komsat selection, ownership, older than seven days, and flags. Active filters must be visible and removable. Counts must use scoped server data and the same filter semantics as the rows; avoid deriving global counts from only the current page of results. Preserve pagination or loading behavior of the real queue.

Use a desktop table, mobile list, and right detail drawer / phone bottom sheet. Rows must expose name, ID, kind, komsat, round, received date, and any flag without relying on color alone. Empty states distinguish no matching submissions from results in another tab. The queue and detail must recover from API failures; a stale selected record should close when its scope is no longer accessible.

## Detail and documents

Arrange submitted data in the registration wizard's field order. Show student-card front and back with their actual supported file types and a safe loading/error state. Beneath the document viewer, repeat comparison facts so the reviewer need not scroll back: **Nama**, **Jenjang**, **Institusi / Fakultas**, and **Tinggal dari / sampai** in `MM/YYYY` when source data permits. Use real submission values; show a clear missing value instead of constructing a misleading date. Keep encrypted/sensitive fields hidden by default and use the production audited reveal flow where applicable. The preview does not request KTP and does not authorize a new document requirement.

Review history is a dated vertical timeline: newest three milestones first, with **Lihat selengkapnya** to reveal older entries. Long notes begin at three lines and expand individually. Status treatments should be explicit: a waiting record uses a clock and subdued warning treatment; completed records are read-only without an odd status pill crowding the title. Another reviewer's claim is read-only until **Ambil alih pemeriksaan** succeeds through the real ownership API. A takeover must handle conflict and permission errors.

## Decisions

Preserve production claim, approval, request-changes, rejection, forwarding, komsat assignment, and release behavior. Approval has a deliberate review/confirmation step. Request changes needs a selectable target and reason per item plus a multiline optional note. Rejection requires a reason. Forwarding and komsat assignment use a searchable destination picker; assignment requires its reason. Show validation near the offending field, disable duplicate submission while saving, and report success with a green check toast or failure with retryable feedback. Do not copy the preview's “Simulasikan gagal menyimpan” toggle, local timers, or fabricated queue transitions. Server responses decide the next tab, ownership, and history.

## Acceptance

- Search and all filters keep five tab badges consistent with scoped results.
- A reviewer can compare the document with the nearby submitted facts and inspect dated history.
- Read-only, claim, takeover, waiting, completed, saving, success, and error states are usable on phone and tablet.
- Each decision respects current API validation, permission, audit, and localization rules.

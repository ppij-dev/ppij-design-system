# Admin redesign: shared implementation rules

Status: handoff for `ppij-identity`, not a statement that production integration is complete. Preview source: `prototypes/redesign-adminv1/src/App.tsx`, `ReviewWorkspace.tsx`, and their CSS. The preview uses synthetic people, counts, dates, and local actions. The production app owns routes, data, access, and mutations.

Read only this file and the guide for the page being implemented:

| Page | Guide | Production route (Indonesian / English) |
| --- | --- | --- |
| Dashboard | [dashboard.md](dashboard.md) | `/admin` / `/en/admin` |
| Verifikasi | [verifikasi.md](verifikasi.md) | `/admin/review` / `/en/admin/review` |
| Anggota | [anggota.md](anggota.md) | `/admin/anggota` / `/en/admin/anggota` |
| Admin & Peran | [peran.md](peran.md) | `/admin/peran` / `/en/admin/peran` |
| Organisasi | [organisasi.md](organisasi.md) | `/admin/units` / `/en/admin/units` |

## Shell and authority

Production owners are `ppij-identity/web/src/layouts/Admin.astro` and `web/src/components/admin/AdminShell.tsx`, `AdminNav.tsx`, and `AdminContextSwitch.tsx`. Keep real routes and the existing session, loading, error, no-role, and forbidden states. The membership service remains authoritative for national → korda → komsat scope and every read/write permission. A scope change must update the page content, actions, badge counts, and available navigation; a komsat context does not show Organisasi. Never trust a client filter as authorization.

Use the preview's collapsible desktop sidebar, searchable workspace selector, top bar, phone bottom navigation, and visible version footer as presentation targets. Every korda/komsat picker must be searchable; multi-select only where the task needs multiple units. Make collapse and menu controls keyboard accessible, with focus returned when a drawer closes. Keep labels available to screen readers when the sidebar is collapsed. Avoid a second header inside a page.

Use `ppij-design-system` as a pinned dependency and import its published presentation components; do not copy prototype component code or move app business logic into the design-system package. Reconcile styles with canonical tokens. Keep Indonesian and English strings in the production i18n catalog. Keep real dates and versions rather than the preview's fixed October 2026 data. The green check toast is for completed actions; errors need distinct failure feedback. Do not expose personal data in logs or synthetic examples in production.

## Working sequence and checks

In `ppij-identity`, open an approved OpenSpec change and use its branch/worktree rules before implementation. Work one page at a time. First inspect its current component, hooks, API types, and tests; then change composition while preserving real behavior. Run a fast type/syntax check and focused tests. Use the identity repository's locked E2E path for affected admin flows. Review 320 px phone, 391 px phone, roughly 680–760 px tablet, and desktop in both locales, including long names, empty/error/loading states, keyboard navigation, and scope changes. The identity parent/verifier runs its full gate serially. Record which devices and browser engines were actually checked.

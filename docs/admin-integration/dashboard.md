# Dashboard UX handoff

Read [shared shell rules](README.md) first. Preview: `prototypes/redesign-adminv1/src/App.tsx` (`Dashboard`, `MapCard`, `FiguresBand`), `src/LeafletMap.tsx`, `src/mapData.ts`, `src/statsData.ts`. Production: `ppij-identity/web/src/components/admin/Dashboard.tsx`, `dashboard/Blocks.tsx`, `DashboardMapCard.tsx`, `map/LeafletCanvas.tsx`; route `/admin` and `/en/admin`. Statistics topics and trend contracts live in [stats.md](stats.md).

## Layout: map-first hero

The map is the hero and the first content block after the greeting. It spans the full content-island width (`max-width: 1490px` minus the `clamp(24px, 3vw, 48px)` gutters) at every breakpoint — never viewport full-bleed; every dashboard surface stays a card inside the island. Map canvas heights are fixed, not aspect-based, because Japan's fit-to-bounds projection is fixed: 420px at ≥900px, 320px at 601–899px, 240px at ≤600px. Wide screens earn the extra ocean margin by hosting the selection panel as an overlay in the map's top-right corner; at 601–899px the panel becomes a summary bar under the card header; at ≤600px the map is a doorway — tapping "Perbesar peta" opens the fullscreen view with a snap bottom sheet for the selection figures. Keep Leaflet lazy-loaded as its own chunk (`React.lazy`), as the preview does, so the dashboard's first paint never waits for it.

The dashboard reading order is: greeting → hero map → level side card → grouped figures band → work panels (Perlu perhatian beside Aktivitas bulan ini) → recent submissions. The level side card that production renders beside the map (national: Cakupan, korda: Klaim, komsat: Antrean) moves below the map and keeps its production behavior: exact prefecture rows from `coverage`, the disabled Klaim placeholder, and the Antrean count shared with the shell's Verifikasi badge (same `counts.baru` source). The old network summary is absorbed into the map card footer: derived unit counts (korda, komsat, or active wards) plus the profil-lengkap percentage from `completeness`.

The figures band replaces four equal stat cards with grouped figures: each group answers one admin question (membership, verification, data quality and expiry, organization), leads with one headline, carries a small honest visual (degree mini-bar, completeness stacked bar), and deep-links into the matching Statistik topic. At komsat scope the organization group is omitted, mirroring production tiles. Keep every number bound to a named production field; a card with no backing field is removed, not relabeled (the preview's fabricated "Kartu diterbitkan" was dropped in favor of `tiles.expiring_within_60_days`).

## Production behavior to retain

Keep the production map as Leaflet over OpenStreetMap tiles with attribution: zoom-switched circle levels (korda below zoom 7, komsat 7–9, city/ward from 10), square-root bubble sizing capped at 40px, click-to-select with the scope share figure, korda click zooming to its komsats, "Belum dipetakan" for units without coordinates, and the fullscreen sheet on phones. Keep `useAdminDashboard`, `useAdminMap`, `useReviewQueue`, their loading/error/retry behavior, and the real admin context; a verifikator context still sees only the queue card and never fetches the map. A changed workspace must invalidate and refetch every scoped figure. Derive footer and side-card counts from the loaded responses rather than restating literals, so the map, badge, and figures band cannot disagree. Missing chart data gets a plain empty state, never a fabricated trend; trends render only where the timeseries contract (stats.md) is implemented.

## Acceptance

- The map leads at every width, keeps the 420/320/240px height steps, and causes no horizontal overflow; DOM and focus order follow the visual order (overlay panel after the canvas, sheet reachable by keyboard).
- Every dashboard figure traces to `tiles.*`, `completeness.*`, `distributions.*`, review tab counts, or map-derived unit counts; figures, badge, and side card share one source per scope.
- Figure groups open the Statistik page with the right topic preselected.
- Loading, empty, and failed queries stay legible on phone, tablet, and desktop; the map shows its loading skeleton without blocking the rest of the page.
- No synthetic preview data or local navigation state is migrated.

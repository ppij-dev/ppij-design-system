# Redesign the admin dashboard: map-first hero and topic statistics

## Why

The admin preview's dashboard has no map and splits its two work panels on a ~62:38 grid, while production already renders a two-thirds-width Leaflet map. The user asked for a full-width map as the dashboard hero, statistic cards that lead to a dedicated per-topic statistics view, and an honest stats presentation where every shown metric maps to a real production field.

## Scope

Rework the preview's Dashboard and add a Statistik page in `prototypes/redesign-adminv1` with synthetic data only:

- Map-first hero: a lazy-loaded Leaflet map over OpenStreetMap tiles with synthetic points in the production `AdminMap` shape. Full content-island width at every breakpoint, fixed heights 420px (≥900px), 320px (601–899px), and 240px (≤600px), selection panel overlay top-right on desktop, absorbed network strip as the map footer, and the level side card (Cakupan / Klaim / Antrean) below the map.
- Honest figures band: replaces four equal stat cards with grouped figures where every number maps to a named production field (`tiles.*`, `completeness.*`, `distributions.*`, review tab counts, map-derived unit counts). The fabricated "Kartu diterbitkan" card is removed.
- One Statistik page with a topic parameter (anggota, verifikasi, organisasi); dashboard figures deep-link into their topic. Monthly trends render synthetic series with a 6/12-month range control, and the full API contract for the trends and re-aggregation endpoints is documented as a production gap.
- Handoff: update `docs/admin-integration/dashboard.md` and add `docs/admin-integration/stats.md` with the complete endpoint contracts.

Out of scope: production code in `ppij-identity`; real API connections; changing the other four admin preview pages beyond shared navigation.

## Acceptance

- The map renders as the first content block after the greeting at every width, keeps the full island width, uses the approved height steps, and never overflows the page horizontally.
- Every figure shown on Dashboard and Statistik names its production backing field in code or in the handoff docs; no metric exists without one.
- Each figures group opens the Statistik page with its topic preselected; topics switch without a route change and reflect the workspace scope.
- `npm run typecheck -w ppij-redesign-adminv1`, the preview build, the mechanical design scan on changed files, and `scripts/gate.sh` on a clean tree all pass.

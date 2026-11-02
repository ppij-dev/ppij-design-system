# Tasks

- [x] Add the synthetic map dataset (production `AdminMap` shape) and the lazy Leaflet canvas with zoom-level circles, selection, fit-to-scope, and OSM attribution.
- [x] Build the map-first dashboard: hero map card with height steps, overlay selection panel, footer strip, level side card below, and the grouped honest figures band with deep links.
- [x] Add the Statistik page with topic parameter, per-topic filters, and synthetic monthly trends with a 6/12-month range control.
- [x] Write the production contracts in `docs/admin-integration/stats.md` (timeseries and re-aggregation endpoints) and update `docs/admin-integration/dashboard.md`.
- [x] Verify typecheck, preview build, design scan on changed files, path-scoped commits, and the repository gate on a clean tree.

Validation: `tsc --noEmit` and `vite build` for the preview pass, with Leaflet confirmed as its own lazily loaded chunk (155 kB, separate from the 620 kB main bundle). `detect.mjs` over all changed files reports no new findings (only the incumbent Plus Jakarta Sans typography retained by earlier rounds). Preview server returns HTTP 200. `scripts/gate.sh` on the committed tree: ALL PASS.

# Tasks

- [x] Add the synthetic map dataset (production `AdminMap` shape) and the lazy Leaflet canvas with zoom-level circles, selection, fit-to-scope, and OSM attribution.
- [x] Build the map-first dashboard: hero map card with height steps, overlay selection panel, footer strip, level side card below, and the grouped honest figures band with deep links.
- [x] Add the Statistik page with topic parameter, per-topic filters, and synthetic monthly trends with a 6/12-month range control.
- [x] Write the production contracts in `docs/admin-integration/stats.md` (timeseries and re-aggregation endpoints) and update `docs/admin-integration/dashboard.md`.
- [x] Verify typecheck, preview build, design scan on changed files, path-scoped commits, and the repository gate on a clean tree.

Validation: `tsc --noEmit` and `vite build` for the preview pass, with Leaflet confirmed as its own lazily loaded chunk (155 kB, separate from the 620 kB main bundle). `detect.mjs` over all changed files reports no new findings (only the incumbent Plus Jakarta Sans typography retained by earlier rounds). Preview server returns HTTP 200. `scripts/gate.sh` on the committed tree: ALL PASS.

## Feedback round: design-first contracts, production circles, data warehouse

- [x] Restore the card metrics under a declared contract: the figures band's third group is now "Kartu & masa berlaku" (`tiles.cards_active`, `tiles.cards_issued_this_month`, `tiles.expiring_within_60_days`), specced as stats.md gap 3; the design-first rule ("no metric without a declared contract") replaces the earlier remove-without-field rule.
- [x] Replicate the production map circle exactly: solid brand-red fill, bold white count, 2px white border, soft shadow, name pill under the circle, red selection ring; no translucent circles.
- [x] Rebuild Statistik as a data warehouse: fourteen facet filters over a seed-generated 1.368-row dataset whose quotas tie to every dashboard figure, active-filter chips with per-value counts, cross-filtered aggregates per view, and client-side CSV export (Blob + anchor, UTF-8 BOM, no server).
- [x] Verify the generator at runtime: aktif per komsat equals the map counts, completeness equals 966/246/93, degree/field/province match the curated distributions, review states match the queue counts, cards 1.102/390, October 48/17, expiring 23/9, all ids and names unique.
- [x] Write the facet inventory (fields from `MemberDirectory*`, review queue, dashboard blocks) and the new contracts in stats.md: facet query (gap 4), audited member-level export (gap 5), card tiles (gap 3), `cards_issued` added to the timeseries enum.
- [x] Re-run typecheck, preview build, design scan, path-scoped commits, and the repository gate on a clean tree.
- [x] Contain every admin table inside its island: `.table-section` is now a rounded, bordered, horizontally scrollable container (min-width 780px table always clipped inside), the dead ≤700px hide rule and unused mobile-row styles are removed so the Statistik tables stay visible on phones, and the sweep confirms `.verification-table` and `.member-table` already scroll in their own containers. Verified at 742×842 (344px card inner width, table scrolls, header cannot escape), ≥1101px (min-width inert), and ≤700px (tables visible and scrollable).

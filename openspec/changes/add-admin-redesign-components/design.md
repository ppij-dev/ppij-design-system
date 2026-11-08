# Design

## Context

`ppij-design-system@0.3.0` is the shipped state: `tokens/tokens.json` plus the
generated `tokens/tokens.css`, one package at `packages/ui` that exports React
components from the root plus `tokens.css` and `tokens.json`, Storybook grouped
`Public` / `Portal` / `Admin` with `phone` (390×844) and `desktop` (1440×900)
viewports, and the `design-system` spec delta of
`openspec/changes/add-design-system-foundation/specs/design-system/spec.md`
(that change is still 16/22 tasks open, so nothing is archived into
`openspec/specs/` yet and the `0.3.0` version sits only in
`packages/ui/package.json`; the root `VERSION` file still reads `0.1.0`).

The prototype `prototypes/redesign-adminv1` is the approved admin design. It
already imports 18 package components and keeps the rest local: 21
compositions across `App.tsx`, `FiguresBand.tsx`, `MapCard.tsx`,
`MemberPage.tsx`, `MemberWorkspace.tsx`, `ManagementPage.tsx`,
`ReviewWorkspace.tsx`, `SearchableMultiSelect.tsx` and `StatsPage.tsx`, most
of them with page-local CSS in `index.css` and the page CSS files.

`docs/admin-integration/README.md` and the five page handoffs already tell
`ppij-identity` to import published components, to keep the shell's real
routes and session, to keep the cluster's fixed sizing rule (32px controls and
compact inputs at 600px and wider, 44px touch targets and 16px editable inputs
below 600px), and to never copy prototype component code. The app worker's
admin-redesign change is therefore blocked on this package release, not on
more prototype work.

## Goals / Non-Goals

**Goals:**

- One published component per repeated prototype composition, with a typed
  data-in contract, a story, an accessible name and the sizing bands applied
  in the component rather than in each page's CSS.
- A chart answer the owner can read as a decision: pie for *Jenis kelamin* and
  *Anggota Biasa vs Luar Biasa*, SVG by hand, no library, bundle cost measured.
- Delete the local duplicates so the prototype and `ppij-identity` import the
  same components, and no page carries a 13px input override again.
- `0.4.0` tag, GitHub Release tarball and the owner's npm publish step, with a
  consumer install proof that needs no credentials.

**Non-Goals:**

- No application logic. No fetching, no route tables, no permission matrix, no
  validation rules, no mutations, no i18n catalogs, no secrets. Labels,
  options, data and callbacks arrive as props.
- No map library in the package. `MapCard` frames an app-supplied map.
- No restyle. Each extraction reproduces the prototype's approved appearance
  and changes only what the extraction forces (page CSS moving into the
  component, or a token replacing a literal).
- No second icon family, no new token, no dark-theme redesign (charts merely
  must not break under a dark surface, which the token layer already decides).
- No `ppij-identity` edit and no publish by a worker: `npm publish` stays the
  owner's 2FA step.

## Decisions

### D1. Charts: hand-rolled SVG primitives, no chart library

No chart primitive exists in `0.3.0`. The package ships `Progress` and
`SegmentedProgress` (linear), `StatCard` (one figure) and `Timeline`; the
prototype draws the monthly trend and every distribution with `div` bars and
inline `height`/`width` percentages, which cannot be reused and carries no
legend, no value labels and no text alternative.

Three new primitives, all data-in and SVG-out:

- `PieChart` — `PieChartDatum[]` (`label`, `value`, `color?`), `donut?`,
  `centerLabel?`, `size`, `legend`, `fallback`. Satisfies the owner decision
  for *Jenis kelamin* and *Anggota Biasa vs Luar Biasa*.
- `BarChart` — `BarChartDatum[]` (`label`, `value`, `hint?`), `orientation`
  (`vertical | horizontal`), `highlightLast`, `max`, `formatValue`. Covers the
  dashboard *Aktivitas bulan ini* pulse panel, the Statistik *Pendaftaran per
  bulan* trend and the facet distributions (`orientation="horizontal"`).
- `DistributionBar` — `DistributionSegment[]` (`label`, `value`, `color?`),
  `legend`, `size`. Covers the figures band's degree mini-bar and the
  completeness stacks on Dashboard and Statistik.

A library was considered and rejected:

- `recharts` (~100 kB min, ~35 kB gzip, plus `d3-scale`/`d3-shape`), `chart.js`
  (~70 kB gzip) and `visx` (several small packages) each add more than the
  whole chart family we need, and the package's dependencies are currently
  presentation-only (`radix-ui`, `tabler`, `clsx`, `tailwind-merge`, `vaul`,
  `sonner`, plus three single-purpose libs the card family needs).
- Every library ships its own accessibility story that we would then have to
  patch: a pie is inherently hard for screen readers, and the owner's two pie
  charts need a legend list and a `<table>` fallback regardless of the library.
- The maths is a fixed set of arcs and rectangles; it is a few hundred lines
  and it keeps the token layer as the only colour source.

Cost ceiling for the whole chart family: **no new dependency**, and under
**10 kB gzip** of added component code, verified by the Storybook build's
chunk report (`design.md` D9). If the owner later wants interactive zoom,
brushing or animated transitions, a library is the right call and that is a
new change; nothing in `PieChart`/`BarChart`/`DistributionBar` blocks it
because the data-in props are library-shaped already.

### D2. Package component or app-local layout

Each prototype composition is classified once. A composition is a **package
component** when it is presentation-only (data, labels, hrefs and callbacks as
props) and recurs at least twice, or when the owner's approved design depends
on its exact anatomy being identical in every page. It is an **app-local
layout** when it owns routing, session, permissions, fetching, mutation,
validation, parsing or the synthetic-data contracts.

**Package components (21 new)**

| # | Component | Story | Why it is a package component |
| --- | --- | --- | --- |
| 1 | `AdminTopBar` | `Admin` | Breadcrumb path, quiet metadata, action slot and the 44px phone identity avatar; the app owns the routes and the identity data, not the bar's anatomy. |
| 2 | `WorkspaceSelector` | `Admin` | One searchable scope picker replaces three local copies (sidebar, collapsed, phone); options and the selected id arrive as props. |
| 3 | `IdentityChip` | `Admin` | Sidebar footer chip with the collapsed initials-only state; pure props. |
| 4 | `AccountSheet` | `Admin` | Bottom-sheet profile anatomy (header, close, switch slot, rows, sign-out); rows and routing arrive as props. |
| 5 | `PanelCard` | `Admin` | The white island with a title/description/action head: `work-panel`, `side-card`, `recent-section`, `stat-card` and the page island are the same card four times. |
| 6 | `ListRow` | `Admin` | The one selectable row shape behind the priority list, the recent list, management lists, the invitation list and the phone member card. |
| 7 | `FactList` | `Admin` | Label/value rows with badge, span and total variants; eight prototype lists are this shape (`coverage-list`, detail `dl`s, document facts, invite summary). |
| 8 | `StatStrip` | `Admin` | The value-over-label strip that appears as the map card footer and the Statistik totals band. |
| 9 | `SearchableMultiSelect` | `Admin` | Absorbs `SearchableMultiSelect`, `SearchableUnitMenu` and the multi-select uses in three pages; single and multiple, searchable, checked, chips. |
| 10 | `FilterMenu` | `Admin` | The non-searchable single-select with checkmarks (kind, ownership, feedback target/reason); one contract, currently three local copies. |
| 11 | `FilterChips` | `Admin` | The removable active-filter chip row with optional per-value counts and clear-all; shared by the directory, invitations, management and Statistik. |
| 12 | `PieChart` | `Admin` | Owner decision; data-in, legend and table fallback (D1). |
| 13 | `BarChart` | `Admin` | Two trend usages and every facet distribution (D1). |
| 14 | `DistributionBar` | `Admin` | Three stacked-composition usages (D1). |
| 15 | `FiguresBand` | `Admin` | Grouped figures with a link per group: one selectable unit, one question, one headline, one visual slot. The metric choice and its contracts stay app-side. |
| 16 | `DocumentViewer` | `Admin` | Student-card frame (side tabs, file row, stage slot, facts, empty/loading); the file itself and the preview stay app-side. |
| 17 | `MapCard` | `Admin` | The frame with the approved height steps, overlay/inline/sheet panel slots and footer; the map is a child (D3). |
| 18 | `FormGrid` | `Admin` | Two-column form grid with wide spans and a single-column phone layout; three prototype forms repeat it. |
| 19 | `Callout` | `Admin` | One inline-note component replaces nine near-identical prototypes (flag, claim, read-only, sample note, audit note, study prompt, section note, drawer stamp, drawer note). |
| 20 | `RevealValue` | `Admin` | Masked value plus a Tampilkan/Sembunyikan toggle and its accessible name; the audited reveal itself is a callback. |
| 21 | `ExpandableText` | `Admin` | Three-line clamp with a Lihat selengkapnya toggle; used by review history detail and long-value rows. |

**Adjustments to shipped components (5)**

| Component | Change | Why |
| --- | --- | --- |
| `Timeline` | `defaultVisibleCount`, `expandLabel`, `collapseLabel` | The review history keeps a dated timeline but shows the three newest events and reveals the rest; today each page reimplements it. |
| `Tabs` | optional `count` on `TabsTrigger`, `appearance: "underline" \| "segmented"` | The queue tabs carry per-tab counts and the topic/doc switchers use the segmented look; a second tab system would be worse. |
| `AdminDrawer` | 44px close button below 600px | Pending `0.3.1` item: the close target is 32–36px on phones today. |
| `Input` | 13px compact text (`textSize="compact"`) | Pending `0.3.1` item: every admin page overrides `[data-slot=input]` locally to reach 13px. |
| `StatusCard` | `density="compact"` | Pending `0.3.1` item: the admin surfaces need the 13px/32px density the drawer already has. |

**App-local layouts (kept in the prototype, and in `ppij-identity` later)**

| Prototype composition | File | Why app-local |
| --- | --- | --- |
| Admin shell, nav model, page switch, drawer/toast hosts | `App.tsx` | Owns routes, session, nav destinations, selected page and host state; composed from `AdminTopBar`, `WorkspaceSelector`, `Sidebar`, `PanelCard`. |
| Phone bottom-bar overflow ("Lainnya") | `App.tsx` | The destinations and routing are app-owned; `BottomBar` already ships the bar. |
| Dashboard page composition and panel order | `App.tsx`, `FiguresBand.tsx` | Page layout over real data; the metric contract is production (`docs/admin-integration/dashboard.md`). |
| Map level side card (Cakupan / Klaim / Antrean) | `MapCard.tsx` | Gated by scope and backed by coverage/queue data; `PanelCard` + `FactList` + `Button`. |
| Leaflet canvas, bubbles, zoom levels, fit-to-scope | `LeafletMap.tsx`, `mapLevels.ts`, `mapData.ts` | Leaflet and geography are the app's; the package must not depend on a map library. |
| Statistik warehouse facet panel and month pills | `StatsPage.tsx` | The facet inventory and the query contract are production (`docs/admin-integration/stats.md`, gap 4); composed from `PanelCard`, `FilterChips`, `SearchableMultiSelect`. |
| CSV export | `warehouseData.ts`, `StatsPage.tsx` | Blob/anchor download, UTF-8 BOM and file naming are app behaviour; the audited member export is a production contract (stats.md, gap 5). |
| Verification queue tabs, action screens and decisions | `ReviewWorkspace.tsx` | Permissions, mutations, validation and queue state; composed from `Tabs`, `Callout`, `FilterMenu`, `FormGrid`. |
| Member edit and category override drawers | `MemberWorkspace.tsx` | Field schemas, validation, RBAC and server refusals are app logic; composed from `FormGrid`, `Callout`, `RevealValue`, existing fields. |
| Status-action authority pane | `MemberWorkspace.tsx` | The RBAC matrix and the mutations are app-owned. |
| Invitation status, invite form/review/result, recipient parsing | `MemberPage.tsx` | Parsing, email validation, sending and the API gaps are app-owned. |
| Management (Admin & Peran, Organisasi) lists and drawers | `ManagementPage.tsx` | Appointment rules, RBAC and API contracts are app-owned. |
| Profile-sheet rows (Portal\|Admin switch, `/akun`, sign out) | `App.tsx` | Routing and session; `AccountSheet` takes the rows as props. |
| Preview banner, sample labels, version footer | `App.tsx`, `index.css` | Preview-only affordances that must not ship. |
| Per-page filter bar geometry overrides | `index.css`, page CSS | Becomes unnecessary once `Input` has the compact size and components carry their own bands. |

### D3. The map stays app-side; `MapCard` is a frame

`MapCard` takes `title`, `description`, `children` (the app's map), `panel`
(the selection summary body, rendered in an overlay at ≥900px, an inline bar at
601–899px and a snap sheet in fullscreen on phones), `footer` (the stat strip),
`unmappedNote`, `expanded`/`onExpandedChange`, `chip` (the clear-selection
chip) and `loading`. It owns the approved height steps (420px ≥900px, 320px
601–899px, 240px ≤600px), the fullscreen state, the Escape-to-close behaviour
and the skeletons. It imports no map library and no geography; that keeps the
package installable for the portal and public surfaces too.

### D4. Extraction keeps proven visuals; only the ownership moves

`SearchableMultiSelect` merges the prototype's `SearchableMultiSelect`,
`SearchableUnitMenu` and `FilterMenu` behaviour, so the merged contract must
cover: optional visible label, single or multiple, an "all" option for
multiple, search with `toLocaleLowerCase("id")` matching, keyboard handling
inside the dropdown (`Escape`, `Tab`, `ArrowDown` pass through, everything else
is stopped so Radix does not move the highlight), the trigger's selected label
(`allLabel` / the single value / "N dipilih"), the empty-result line and the
`.member-multi-*` geometry. Where the three copies disagreed (trigger label
when nothing is selected, whether the "Semua" row appears) the merged contract
takes the reviewed behaviour and the difference is recorded in the story.

Literal colours that move from page CSS into a component are replaced by
tokens where a token exists (`#c8102e` → `--brand-red`); the prototype's one-off
greys are the shortest path to the approved appearance and are listed in the
batch's notes rather than silently tokenised, because a new token is a
sentence in the review that this change does not want to spend on greys.

### D5. Sizing bands live in the component

Every new component implements the repo's rule locally instead of leaving it to
the page: controls are **32px from 600px up** and **44px below 600px**, and
editable text below 600px is **16px** (13px compact at 600px and wider). Where
`AdminDrawer` renders the component it already provides the sheet geometry; the
component must not double-pad. Each story is reviewed in the `phone` and
`desktop` presets, and each task names the band in `tasks.md`.

### D6. Story homes and states

New components sit in the `Admin` group, except `Callout`, `PieChart`,
`BarChart`, `DistributionBar`, `FormGrid` and `RevealValue`, which are shared
enough that the story is placed where its first consumer is and the Docs page
states the sharing (the Introduction page's existing rule: shared atoms live
under `Portal` and serve all surfaces). Each component gets exactly one
canonical story file; the applicable states follow `D7` of the foundation
design and are listed per task in `tasks.md`.

### D7. Delta modelling: ADDED in two capabilities

The `design-system` spec delta of `add-design-system-foundation` is still a
change delta, not an archived spec: `openspec/specs/` holds only `.gitkeep`,
so no `design-system` requirement is archived and OpenSpec would refuse a
`MODIFIED Requirements` delta against it ("target spec does not exist; only
ADDED requirements are allowed for new specs").

The five adjustments are therefore written as **ADDED requirements**, which is
also the honest semantics: none of them changes an existing requirement's
outcome. `Timeline`, `Tabs`, `Input` and `StatusCard` gain optional props whose
absence preserves today's behaviour, and the `AdminDrawer` close target is a
size correction, not a reversal of a stated rule. The delta lands in
`specs/design-system/spec.md` (the capability the components already belong to)
and the 21 new components land in `specs/admin-components/spec.md`, a new
capability. Both files hold `ADDED Requirements` only, so the change is
archivable in either order relative to the foundation change: ADDED deltas
merge into the capability spec whether it exists yet or not.

The alternative — folding the five adjustments into the new
`admin-components` capability — was rejected because it would split `Timeline`,
`Tabs`, `AdminDrawer`, `Input` and `StatusCard` across two capabilities with no
naming rule that makes that split obvious to the next reader.

### D8. Version and release

`packages/ui/package.json` is the effective version (`0.3.0`); the root
`VERSION` file reads `0.1.0` and nothing reads it. This change makes the
release coherent for `0.4.0`: `VERSION` returns to `0.4.0`, the build syncs it
into `packages/ui/package.json` (or the release runbook updates both and the
foundation batch 13 wires the sync), a `CHANGELOG.md` entry is added (the file
does not exist yet), then tag `v0.4.0` plus a GitHub Release tarball for the
anonymous install route, and finally the owner runs `npm publish` with 2FA.
SemVer: new components and new optional props are a minor bump; no token is
renamed or removed and no existing component API changes shape, so `0.4.0` is
correct.

## Risks / Trade-offs

- [21 new components in one release invite half-finished work] → `tasks.md`
  groups them into five batches, each with its own gate proof; a batch that
  does not finish does not block the earlier ones, and the release happens
  only when every batch is green.
- [`SearchableMultiSelect` merges three behaviours and could regress one] →
  The merged contract is written in D4; the story covers single, multiple,
  empty result, long option list and a preselected value, and the prototype
  migration batch re-checks every page that used a local copy.
- [Hand-rolled charts could grow into a charting project] → The three
  primitives are bounded by D1's prop sketches; no interaction, zoom or
  animation is in scope, and the bundle ceiling is checked in the release
  batch.
- [Moving page CSS into components could change the approved appearance] →
  Extraction keeps the prototype's rules verbatim (D4); the prototype
  migration batch is the visual diff, because it renders the same screens from
  the package afterwards.
- [The five adjustments read as new requirements rather than changed ones] →
  D7 records why: they are additive props (or a size correction) whose absence
  preserves today's behaviour, and the foundation's `design-system` spec is not
  archived yet, so `MODIFIED` is not available to this change at all.
- [The root `VERSION` file is already stale] → Fixed by D8's first task, so the
  release cannot repeat the mismatch.

## Migration Plan

Order matters only at the ends: the release and the prototype migration come
last.

1. Foundation fixes (`AdminDrawer` 44px close, `Input` compact text,
   `StatusCard` density, `VERSION` realignment). Small, independently
   reviewable, and every later component assumes them.
2. Container and feedback primitives (`PanelCard`, `ListRow`, `FactList`,
   `StatStrip`, `Callout`, `FormGrid`, `RevealValue`, `ExpandableText`) —
   the rest of the components build on these.
3. Shell (`AdminTopBar`, `WorkspaceSelector`, `IdentityChip`, `AccountSheet`)
   and the `Tabs`/`Timeline` adjustments.
4. Filters and charts (`SearchableMultiSelect`, `FilterMenu`, `FilterChips`,
   `PieChart`, `BarChart`, `DistributionBar`).
5. Data displays (`FiguresBand`, `DocumentViewer`, `MapCard`).
6. Prototype migration: import the package, delete the local duplicates,
   typecheck and build the prototype, and record the visual check.
7. Release: `CHANGELOG.md`, version bump, tag, GitHub Release tarball, consumer
   install proof, owner `npm publish`.

Rollback at any batch is `git revert` of the batch commit. Bumping to `0.4.0`
is the point of no return for the version number only; no token or component
API is removed, so a consumer can stay on `0.3.0` while a batch is reverted.
Nothing in `ppij-identity` changes during this migration.

## Open Questions

1. ~~**Should the three pending `0.3.1` items ship as `0.3.1` first?**~~ — **decided 2026-11-08 (Q91)**:
   fold them into `0.4.0` (batch 1); no `0.3.1` release is cut. Kept here only as the decision record.
2. **Do the five adjustments belong in `design-system` or in the new
   `admin-components` capability (D7)?**
   Recommendation: `design-system`, because that is the capability the five
   components already belong to; the delta is written as `ADDED` requirements
   so it archives cleanly in either order relative to the still-open
   `add-design-system-foundation` change. Revisit only if the owner wants one
   capability per release instead of one per subject.
3. **Is `StatStrip` worth a component?**
   Recommendation: yes for now — the map footer and the Statistik totals band
   are the same anatomy and both carry the "every number names its field"
   discipline. If the owner prefers a smaller surface, fold it into
   `PanelCard` as a `stats` prop variant and drop task B4.
4. **`FiguresBand` as a package component or app-page layout?**
   Recommendation: package component. The grouping shape (one question, one
   headline, one visual slot, one deep link) is exactly the discipline the
   owner asked for on Dashboard and it will reappear on the portal. The metric
   selection and its production contracts stay app-side and are not part of
   the component.
5. **Story home for the shared components (D6)?**
   Recommendation: `Portal` for `Callout`, `FormGrid`, `RevealValue`, the
   three charts and `ExpandableText`, `Admin` for everything else, matching the
   Introduction page's existing "shared atoms live under Portal" rule. The
   alternative — everything new under `Admin` — reads as ownership of the
   admin surface, which is not what these primitives are.
6. ~~**Do we need a real `CHANGELOG.md` and a `VERSION` sync now, or in the
   foundation's batch 13?**~~ — **decided 2026-11-08 (Q92)**: do it now, as part of `0.4.0` (add
   `CHANGELOG.md`, make `VERSION` read `0.4.0` and have the build sync it into `packages/ui/package.json`),
   because `0.4.0` is the first release an app will pin. Kept here only as the decision record.

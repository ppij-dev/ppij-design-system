# Add the admin redesign component set (releases as `ppij-design-system@0.4.0`)

## Why

Release 1.1.0 of `ppij-identity` rebuilds the real admin from the admin
redesign prototype that lives in this repository. The prototype proves the
presentation, but roughly twenty of its compositions are local to
`prototypes/redesign-adminv1/src`: the collapsible sidebar shell, the top bar,
the searchable workspace selector, the identity chip and profile sheet, the
map card frame, the grouped figures band, the mergeable multi-select, the
filter chip row, the student-card viewer, the masked-value reveal, the two
column form grid and the inline notes.

`ppij-design-system@0.3.0` ships atoms, `AdminDrawer`, `PageHeader`,
`DataTable`, `SearchFilter`, `StatCard`, `UnitCard`, `Timeline`, `BottomBar`,
form fields and the member-card family, but none of those compositions. The
`ppij-identity` worker therefore cannot implement the approved admin without
either copying prototype code into the app (forbidden by `AGENTS.md`) or
rebuilding it again (the exact failure the design system exists to stop).
`docs/admin-integration/README.md` already tells the app to import published
components and not copy the prototype.

The prototype also needs two chart primitives the owner decided on: Statistik
shows *Jenis kelamin* and *Anggota Biasa vs Luar Biasa* as pie charts, and no
chart primitive exists in the package today (only `Progress` and
`SegmentedProgress`, both linear). The prototype draws every other chart with
hand-written `div` bars, which cannot be reused across pages.

So this change is the design-system half of the admin rebuild: ship the
presentation the approved admin needs as `0.4.0`, keep the app's data, routes,
permissions and mutations out of the package, and prove every component with a
Storybook story.

## What Changes

- **21 new presentation components** under the `Admin` Storybook group,
  extracted from the prototype's local compositions: the shell pieces
  (`AdminTopBar`, `WorkspaceSelector`, `IdentityChip`, `AccountSheet`), the
  container primitives (`PanelCard`, `ListRow`, `FactList`, `StatStrip`), the
  filter controls (`SearchableMultiSelect`, `FilterMenu`, `FilterChips`), the
  chart primitives (`PieChart`, `BarChart`, `DistributionBar`), the data
  displays (`FiguresBand`, `DocumentViewer`), the form and feedback pieces
  (`FormGrid`, `Callout`, `RevealValue`), and `MapCard` plus `ExpandableText`.
- **Five adjustments** to already shipped components, written as `ADDED`
  requirements in `design-system` because their optional props preserve
  today's behaviour (`design.md` D7): `Timeline` gains expansion and clamping,
  `Tabs` gains a count badge and the underline and segmented appearances, and
  the three pending `0.3.1` items land: `AdminDrawer` gets a 44px phone close
  button, `Input` gets the 13px compact text, `StatusCard` gets the admin
  `density="compact"`.
- **Charts are hand-rolled SVG, no chart library.** `PieChart`, `BarChart` and
  `DistributionBar` are data-in, SVG-out, token-coloured, with an accessible
  legend and a `<table>` fallback, at no added dependency (see `design.md`
  D1). The owner's pie decision for *Jenis kelamin* and *Anggota Biasa vs Luar
  Biasa* is satisfied by `PieChart`.
- **The multi-select collapses three local copies into one component.**
  `SearchableMultiSelect.tsx`, `SearchableUnitMenu` and `FilterMenu` in
  `ReviewWorkspace.tsx` become two package components with one contract.
- **The prototype migrates to the package** and deletes the local duplicates,
  so the prototype stays the visual reference an app worker reads.
- **Every component carries its own story, its sizing bands (44px below
  600px, 32px from 600px up) and its accessible name**, per the repo's "no
  story, no component" rule.
- **Release:** `VERSION` and `packages/ui/package.json` to `0.4.0`, a
  `CHANGELOG.md` entry, tag `v0.4.0`, GitHub Release tarball (the anonymous
  install route) and the owner `npm publish` step.

## Scope

In scope: `packages/ui/src` (new components, new stories, five adjustments,
`index.ts` exports), `openspec/changes/add-admin-redesign-components/`,
`prototypes/redesign-adminv1/src` (import the package, delete local copies),
`docs/admin-integration/README.md` (point the app at the new components),
`VERSION`, `packages/ui/package.json`, `CHANGELOG.md`.

Out of scope:

- Any change in `ppij-identity`. The app-side change is the admin-redesign
  proposal another worker is writing; this change only makes its import list
  possible.
- Application data logic, API clients, route tables, permission checks,
  business rules and secrets. Every new component takes data, labels, hrefs
  and callbacks as props.
- The Leaflet map itself, `react-leaflet`, the synthetic datasets
  (`mapData.ts`, `mapLevels.ts`, `statsData.ts`, `warehouseData.ts`) and all
  geography. `MapCard` ships the frame; the map stays app-side (D3).
- The preview banner, sample-data labels, CSV export, recipient parsing and
  the demo toasts. Those are preview affordances, not shipped design.
- A second icon family, a dark theme redesign, or a visual restyle beyond the
  prototype's approved appearance.

## Acceptance

- `openspec validate add-admin-redesign-components --type change` passes
  with no error and no `INFO`: the 21 new components land as `ADDED`
  requirements in a new `admin-components` capability, and the five
  adjustments land as `ADDED` requirements in `design-system` (`design.md` D7).
  The delta files are `specs/admin-components/spec.md` and
  `specs/design-system/spec.md`, both `ADDED` only, so the change archives in
  either order relative to the still-open `add-design-system-foundation`
  change.
- `scripts/gate.sh` prints `ALL PASS` on a clean tree: `make build`,
  `make lint`, `make test` (which includes `check-stories.mjs` over every new
  component file).
- Each of the 21 new components has exactly one story file with a rendering
  default story, in the `Admin` group or — for the six shared components
  `design.md` D6 lists — in the `Portal` group, plus the states its task in
  `tasks.md` lists; each story renders against `tokens.css`.
- `PieChart` renders *Jenis kelamin* and *Anggota Biasa vs Luar Biasa* stories
  from data-in props, exposes a legend list and a `<table>` fallback that
  carries the same numbers, and adds no runtime dependency: `npm ls --all` in
  `packages/ui` lists no new package and the built Storybook gains no new
  vendor chunk.
- `AdminDrawer`'s close button is 44×44 below 600px and the compact icon size
  from 600px up; `Input` renders 13px text when asked; `StatusCard` renders
  the compact density; all three are covered by story assertions in the
  Storybook docs pages and by the existing stories.
- Every new component's desktop controls are 32px at 600px and wider, and
  44px below 600px, checked in the `phone` (390×844) and `desktop`
  (1440×900) viewport presets.
- The prototype typechecks and builds with the package imports and no local
  duplicate: `npm run typecheck -w ppij-redesign-adminv1` and
  `npm run build -w ppij-redesign-adminv1` pass, and
  `prototypes/redesign-adminv1/src/SearchableMultiSelect.tsx` no longer
  exists.
- `ppij-design-system@0.4.0` is packed and installed into a scratch consumer,
  which renders `AdminTopBar`, `PanelCard`, `PieChart` and `MapCard` and
  imports all three package exports. `npm publish` itself is the owner's
  2FA step and is not part of this change's automated proof.

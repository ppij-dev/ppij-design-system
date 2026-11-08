# Changelog

Releases of `ppij-design-system`: the token layer in `tokens/` and the React
package in `packages/ui`.

The root `VERSION` file is the single source of truth for the release number.
`make build` copies it into `package.json` and `packages/ui/package.json`
(`scripts/sync-version.mjs`), and `make test` fails when the three disagree
(`scripts/check-version.mjs`), so a release cannot ship a version pair that
drifted apart.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and
the versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.0] - 2026-11-08

The admin redesign component set: the presentation half of the `ppij-identity`
admin rebuild, plus the three pending `0.3.1` fixes and the version bookkeeping
that had drifted. Released through the change
`openspec/changes/add-admin-redesign-components`.

### Added

- **21 presentation components.** The shell: `AdminTopBar`,
  `WorkspaceSelector`, `IdentityChip`, `AccountSheet`. The containers:
  `PanelCard`, `ListRow`, `FactList`, `StatStrip`. The filter controls:
  `SearchableMultiSelect` (merging three local copies), `FilterMenu`,
  `FilterChips`. The charts: `PieChart`, `BarChart`, `DistributionBar`. The data
  displays: `FiguresBand`, `DocumentViewer`, `MapCard`. The form and feedback
  pieces: `FormGrid`/`FormField`, `Callout`, `RevealValue`, `ExpandableText`.
- **Charts are hand-rolled SVG and divs, with no new dependency.** `PieChart`,
  `BarChart` and `DistributionBar` are data-in, token-coloured, with an
  accessible legend and a screen-reader `<table>` fallback where the shape needs
  one. The owner's *Jenis kelamin* and *Anggota Biasa vs Luar Biasa* charts for
  Statistik are `PieChart` stories; the prototype's Statistik page now renders
  the category pie from the real filtered facet, and *Jenis kelamin* stays a
  story because the synthetic dataset has no such field.
- Every new component ships exactly one story file in the `Admin` group (or
  `Portal` for the shared `Callout`), with the states its task lists, so "no
  story, no component" is checked by `make test`.

### Changed

- `AdminDrawer`: the close control is at least 44×44 below 600px and keeps the
  compact (`icon-sm`) or default (`icon`) size from 600px up.
- `Input`: a new `textSize="compact"` renders 13px text from 600px up and 16px
  below, with a 44px phone floor, replacing the per-page 13px overrides.
- `StatusCard`: a new `density="compact"` renders the admin scale (14px title,
  13px body, 32px action from 600px up, 44px action below).
- `Tabs`: `TabsTrigger` gains `count` and `TabsList` gains
  `appearance="underline" | "segmented"`. Neither changes an existing use: a
  `Tabs` without them renders exactly as before.
- `Timeline`: `defaultVisibleCount`, `defaultExpanded`, `expandLabel`,
  `collapseLabel` and `onExpandChange`, and `description` now takes any node so
  an item can hold an `ExpandableText`. Unset, every item still renders.
- `VERSION` is the single source of the release number: `make build` copies it
  into `package.json` and `packages/ui/package.json`, and `make test` fails when
  the three disagree. The stale `VERSION` `0.1.0` is gone.
- The admin prototype imports the whole component set from the package and no
  longer carries a local `SearchableMultiSelect`, `SearchableUnitMenu`,
  `FilterMenu` or the page CSS that restated the shared compositions.

### Notes

- `MapCard` frames an app-supplied map: no Leaflet, no `react-leaflet` and no
  geography in the package.
- The design system stays presentation-only: no fetching, no routes, no
  permissions, no mutations.
- `ppij-design-system@0.4.0` is published on npm, so `npm install
  ppij-design-system` is the install route. The release tarball
  (`https://github.com/ppij-dev/ppij-design-system/releases/download/v0.4.0/ppij-design-system-0.4.0.tgz`)
  stays available as the anonymous fallback; installing the GitHub repo ref
  itself does not work, because the repository root is the private workspace.

## [0.3.0] - 2026-11-03

The first tagged release: the foundation that made this repository the source
of truth for PPIJ brand and presentation.

### Added

- Framework-free design tokens: `tokens/tokens.json` plus the generated
  `tokens/tokens.css`, exported as `ppij-design-system/tokens.json` and
  `ppij-design-system/tokens.css`.
- The React package `ppij-design-system` on React 19, Tailwind CSS v4 and
  shadcn/ui on Radix, with Tabler icons and `dist` as the only published
  directory.
- Storybook grouped Public, Portal and Admin, with the `phone` (390×844) and
  `desktop` (1440×900) viewport presets.
- The portal and public atoms: button, input, label, select, badge, avatar,
  separator, card, alert, skeleton, spinner, saving indicator, tooltip,
  scroll area, empty state, radio group, switch, textarea, stepper, file
  upload, progress, checkbox, type-ahead and tag input.
- The overlays and navigation family: drawer, sheet, dialog, alert dialog,
  dropdown menu, tabs, table, sidebar, bottom bar, top bar, view toggle,
  account menu and sonner toaster.
- The promoted admin and portal patterns: `PageHeader`, `DataTable`,
  `AdminDrawer`, `FormPanel`, `PortalShell`, `SearchFilter`, `UnitCard`,
  `StatCard`, `StatusCard`, `Timeline`, `InvitationCard`, `ReviewPanel`,
  `EditablePanel`, `TodoStrip`, `ServiceTiles`, `BannerCarousel` and the
  member-card family.
- Storybook Docs pages for the Introduction, Brand, Colors, Typography,
  Guidelines, Logo, Icons and UX philosophy, and the story-coverage check
  `scripts/check-stories.mjs` behind `make test`.

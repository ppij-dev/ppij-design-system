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

## [Unreleased]

The next release is planned as `0.4.0` through the change
`openspec/changes/add-admin-redesign-components`. `VERSION` stays `0.3.0` until
that change's release batch bumps it, so this section describes work that is
committed but not released. Batches B–F (the 21 admin components, the
`Timeline`/`Tabs` adjustments, the prototype migration and the release proof)
are still open.

### Added

- `CHANGELOG.md` and the `VERSION` → `package.json` version sync, so the
  shipped package version can no longer drift from the release number.

### Changed

- `AdminDrawer`: the close control is at least 44×44 below 600px, which is the
  touch minimum for the phone bottom sheet; from 600px up it keeps the existing
  `icon-sm` compact (32px) and `icon` default (36px) sizes. Props, the
  locale-derived accessible name and the focus ring are unchanged.
- `Input`: a new `textSize="compact"` renders 13px text from 600px up and 16px
  below (the editable minimum that stops iOS from zooming on focus), with a
  44px phone floor. It replaces the per-page `font-size: 13px` overrides the
  admin pages carried. Existing `data-size` heights, validation and disabled
  behaviour are untouched.
- `StatusCard`: a new `density="compact"` renders the admin scale — a 14px
  title, 13px body and a 32px action from 600px up, keeping the 44px action
  below 600px. The default density, the compact row form, the tones, the
  `role="region"` and the action behaviour are unchanged.

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

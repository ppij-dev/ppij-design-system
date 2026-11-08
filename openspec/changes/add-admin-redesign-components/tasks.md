# Tasks

One component = one task, one batch = one sitting. Each batch closes on its own
proof, green on a clean tree. Every UI batch runs Impeccable with its full
setup (context launcher once per session, the named command playbook,
craft-floor read before any UI edit) and its closing pass (`polish`, then
`audit`) before the batch verdict.

Every task lands: the component file, exactly one `.stories.tsx` beside it, the
`packages/ui/src/index.ts` export, and the story in the named Storybook group.
`node scripts/check-stories.mjs` fails on a component without a story, so
"no story, no component" is checked, not promised.

Sizing bands, applied inside every component unless a task says otherwise:
**44px controls below 600px, 32px controls from 600px up, 16px editable text
below 600px and 13px compact text from 600px up.** Each story is reviewed in
the `phone` (390×844) and `desktop` (1440×900) viewport presets.

Sizes: **S** ≤ 150 LOC plus one story file; **M** 150–400 LOC or 4–6 stories;
**L** > 400 LOC, a merge of existing copies, or geometry that needs its own
review.

Prototype provenance paths are relative to
`prototypes/redesign-adminv1/src/`.

## Batch A — Foundation fixes (the pending `0.3.1` items)

### Task A1 — `AdminDrawer`: 44px phone close button (S)

- [x] `packages/ui/src/components/admin-drawer.tsx`: the close `Button` uses
      `size="icon"` (36px) below 900px and `icon-sm` (32px) in compact desktop.
      Below 600px it must be 44×44; from 600px up it stays `icon-sm` compact /
      `icon` default.
- Props: unchanged (`closeLabel`, `density`, `step`, `onBack`, `size`,
      `onCloseAutoFocus` stay as they are). No new prop.
- Stories: extend `Admin/AdminDrawer` — compact phone close target, compact
      desktop close target, default density, `closeLabel` override.
- A11y: the close button keeps `aria-label` from `labels[locale].close`;
      confirm 44×44 in the phone preset and that the focus ring is visible.
- Sizing: 44px < 600px, 32px ≥ 600px (compact) / 36px (default).
- From: `App.tsx`, `MemberPage.tsx`, `ReviewWorkspace.tsx`,
      `ManagementPage.tsx`, `MemberWorkspace.tsx` (every `AdminDrawer` call
      site); the deficit is recorded in `docs/admin-integration/README.md`.
- Proof: story renders at both presets; `make test` story check passes.

### Task A2 — `Input`: 13px compact text (S)

- [x] `packages/ui/src/components/input.tsx`: add `textSize?: "compact"`
      (13px from 600px up, 16px below 600px) beside the existing
      `data-[size=sm|lg]` heights.
- Props: `size?: "sm" | "default" | "lg"` (existing, via `data-size`),
      `textSize?: "compact"` (new).
- Stories: extend `Portal/Input` — default, sm, lg, compact text, compact text
      on phone, `aria-invalid`, disabled, long value.
- A11y: 16px minimum editable text below 600px (prevents iOS zoom);
      `aria-invalid` styling unchanged.
- Sizing: `h-8` compact from 600px up, `h-11` (44px) below 600px; compact text
      13px from 600px up.
- From: `index.css` (`.verification-filters [data-slot=input]`), page CSS files
      (`.member-edit-grid`, `.drawer-body`, `.member-multi-search`) — every one
      of these is a local 13px override this task deletes.
- Proof: story renders; grep finds no remaining page-local
      `font-size: 13px` input override after Batch F.

### Task A3 — `StatusCard`: admin compact density (S)

- [x] `packages/ui/src/components/status-card.tsx`: add
      `density?: "default" | "compact"` giving a 13px body, 14px title and
      32px action, matching `AdminDrawer`'s compact density. The 12px label
      step of that density is dropped here: `StatusCard` has no label element
      (icon, title, body, action), so it has no target.
- Props: existing (`icon`, `title`, `body`, `actionLabel`, `actionHref`,
      `onAction`, `tone`, `compact`) plus `density`.
- Stories: extend `Portal/StatusCard` — default, compact row, admin compact
      density at desktop and phone, all five tones, with and without action.
- A11y: `role="region"` and `aria-label={title}` stay; the action keeps its
      44px minimum below 600px.
- Sizing: 44px action < 600px, 32px ≥ 600px in compact density.
- From: `MemberWorkspace.tsx` (`.member-actions-note`, the status prompt), and
      the portal Beranda states the component was extracted from.
- Proof: story renders at both presets; `make test` story check passes.

### Task A4 — Version coherence: `VERSION` → `0.4.0` and a real sync (S)

- [x] Root `VERSION` reads `0.1.0` while `packages/ui/package.json` reads
      `0.3.0` and nothing consumes `VERSION`. Make `VERSION` the source and
      have the build write it into `packages/ui/package.json` before publish
      (or, if the owner prefers, update both in the release runbook — see
      open question 6).
- [x] Add `CHANGELOG.md` with the `0.3.0` and `0.4.0` entries.
- Proof: `npm run build` leaves `VERSION` and
      `packages/ui/package.json.version` equal; `scripts/gate.sh` green.

Note (owner Q92): batch A makes the version pair coherent at `0.3.0` —
`VERSION` is the source, `scripts/sync-version.mjs` copies it into
`package.json` and `packages/ui/package.json` on every build, and
`scripts/check-version.mjs` (in `make test`) fails when the three disagree.
The `0.4.0` bump itself belongs to F2, so `VERSION` still reads `0.3.0` here.

**Batch A proof:** `scripts/gate.sh` prints `ALL PASS` on a clean tree, plus
the four story files rendering at both viewport presets.

## Batch B — Containers and feedback (these are the base for everything else)

### Task B1 — `PanelCard` (S)

- [x] `packages/ui/src/components/panel-card.tsx` + `.stories.tsx`
- Props: `title`, `description?`, `action?: ReactNode`, `badge?: ReactNode`,
      `icon?: ReactNode`, `padding?: "page" | "panel" | "none"`,
      `density?: "default" | "compact"`, `children`, `className`.
- Stories (`Admin/PanelCard`): default; with action; with badge and icon;
      page padding (the white island); no-header body-only; px-320 long title.
- A11y: the head is `h2` by default with an `headingLevel` prop; `action` is a
      real control, not a div; no landmark is claimed twice.
- Sizing: 44px touch targets for header actions below 600px, 32px from 600px.
- From: `index.css` `.work-panel`, `.recent-section`, `.side-card`,
      `.stat-card`, `.figures-band`; `ReviewWorkspace.css`
      `.verification-page-island`, `.verification-section`; `MemberPage.css`
      `.member-page-island`; `ManagementPage.css` `.management-page`.
- Proof: story renders; prototype migration batch leaves no local island CSS.

### Task B2 — `ListRow` (S)

- [x] `packages/ui/src/components/list-row.tsx` + `.stories.tsx`
- Props: `leading?: ReactNode`, `title`, `subtitle?`, `meta?: ReactNode`,
      `trailing?: ReactNode`, `badge?: ReactNode`, `tone?:
      "default" | "danger" | "muted"`, `onSelect?`, `href?`, `selected?`,
      `className`.
- Stories (`Admin/ListRow`): default; with badge; with leading avatars; danger
      tone; selected; as link; long text (name and subtitle truncation); phone
      card variant.
- A11y: renders a real `<button>` or `<a>`, `aria-current`/`aria-pressed` when
      selected, the whole row is one tab stop, decorative chevrons are
      `aria-hidden`.
- Sizing: 44px minimum row below 600px, 32px controls from 600px up.
- From: `index.css` `.priority-list button`, `.recent-list button`,
      `.coverage-list li`, `.more-menu button`; `MemberWorkspace.css`
      `.member-mobile-list`; `MemberPage.css` `.member-invite-list button`;
      `ManagementPage.css` `.management-list button`.
- Proof: story renders; each migrated list keeps its current row count and
      ordering.

### Task B3 — `FactList` (M)

- [x] `packages/ui/src/components/fact-list.tsx` + `.stories.tsx`
- Props: `items: { label: string; value: ReactNode; span?: boolean;
      muted?: boolean }[]`, `variant?: "rows" | "inline" | "twoColumn"`,
      `total?: { label: string; value: ReactNode }`,
      `emptyLabel?`, `className`.
- Stories (`Admin/FactList`): rows; two-column (the review field groups);
      inline (document facts); with total row (coverage total); with badge
      value; with long value; empty.
- A11y: renders `<dl>`/`<dt>`/`<dd>`; a value that is a masked field keeps its
      own label; `twoColumn` collapses to one column below 600px without
      dropping a term.
- Sizing: no interactive controls; both variants single-column below 600px.
- From: `index.css` `.drawer-body dl`, `.coverage-list`; `MemberWorkspace.css`
      `.member-detail dl`, `.member-detail dd`; `ReviewWorkspace.css`
      `.verification-field-group dl`, `.verification-document-facts`;
      `ManagementPage.css` `.role-detail`; `MemberPage.css` invite summary `dl`.
- Proof: story renders; the eight migrated lists keep their current grouping.

### Task B4 — `StatStrip` (S)

- [x] `packages/ui/src/components/stat-strip.tsx` + `.stories.tsx`
- Props: `items: { value: ReactNode; label: string; hint?: string }[]`,
      `columns?`, `size?: "default" | "compact"`, `className`.
- Stories (`Admin/StatStrip`): three items (map footer); two items; six items
      (Statistik totals); long labels; phone wrap.
- A11y: renders a `<dl>` inside a labelled region; the label is never the only
      carrier of meaning for a value that is a percentage.
- Sizing: values ≥ 600px keep 21px, below 600px 18px; no interactive controls.
- From: `index.css` `.map-footer`, `.warehouse-totals`.
- Proof: story renders; both migrated strips keep their numbers.

### Task B5 — `Callout` (M)

- [x] `packages/ui/src/components/callout.tsx` + `.stories.tsx`
- Props: `tone?: "info" | "success" | "warning" | "danger" | "neutral"`,
      `icon?: ReactNode`, `title?`, `children`, `action?: ReactNode`,
      `density?: "default" | "compact"`, `className`.
- Stories (`Portal/Callout`): all five tones; compact (the drawer stamp); with
      title and body; with action (the "Lengkapi data studi" prompt); danger
      (validation); long body; and one story that shows the nine migrated
      prototypes side by side as the visual diff.
- A11y: `role="status"` for info/success and `role="alert"` for danger; the
      icon is `aria-hidden`; the text contrast is checked per tone.
- Sizing: inline action 44px below 600px, 32px from 600px up.
- From: `ReviewWorkspace.css` `.verification-flag`, `.verification-claim`,
      `.verification-readonly`, `.verification-sample-note`; `index.css`
      `.section-note`, `.drawer-stamp`, `.drawer-note`; `MemberWorkspace.css`
      `.member-detail-audit`, `.member-detail-prompt`, `.member-detail-note`,
      `.member-edit-note`, `.member-edit-error-form`.
- Proof: story renders; the migration batch deletes all nine local rules.

### Task B6 — `FormGrid` (S)

- [x] `packages/ui/src/components/form-grid.tsx` + `.stories.tsx`
- Props: `columns?: 1 | 2`, `children`, `className`; a companion
      `FormField` (`label`, `hint?`, `error?`, `wide?`, `children`) exported
      from the same module.
- Stories (`Admin/FormGrid`): two-column with a wide row; one column; with
      hint; with error; phone single column; a full member-edit-shaped form.
- A11y: `label` uses a real `<label htmlFor>` or wraps the control;
      `error` renders `role="alert"` and sets `aria-invalid`/`aria-describedby`
      on the control through the caller's props.
- Sizing: 44px controls below 600px, 32px from 600px up; single column below
      600px.
- From: `MemberWorkspace.css` `.member-edit-grid`, `.member-filter-form`;
      `ManagementPage.css` `.role-appointment`, `.role-field`.
- Proof: story renders; the migrated drawers keep their field order and error
      behaviour.

### Task B7 — `RevealValue` (S)

- [x] `packages/ui/src/components/reveal-value.tsx` + `.stories.tsx`
- Props: `masked`, `clear`, `revealed: boolean`, `onReveal`, `onHide`,
      `showLabel?`, `hideLabel?`, `iconOnly?`, `className`.
- Stories (`Admin/RevealValue`): masked (default); revealed; toggle focused;
      inside a `FactList` row; long revealed value; phone.
- A11y: the masked state is announced as hidden (`aria-label` or visually
      hidden text), the toggle is a real button with an accessible name, and
      the revealed value is announced without re-reading the whole row.
- Sizing: 44px toggle below 600px, 32px from 600px up.
- From: `MemberWorkspace.tsx` `RevealValue`; `MemberWorkspace.css`
      `.member-reveal-line`, `.member-masked-value`, `.member-reveal-toggle`.
- Proof: story renders; the member detail's four masked fields use it.

### Task B8 — `ExpandableText` (S)

- [x] `packages/ui/src/components/expandable-text.tsx` + `.stories.tsx`
- Props: `children: string`, `lines?: number` (default 3), `expandLabel?`,
      `collapseLabel?`, `className`.
- Stories (`Admin/ExpandableText`): three-line clamp with the toggle; short
      text (no toggle); long text; expanded; inside a `Timeline` item; phone.
- A11y: `aria-expanded` on the toggle, the clamp is CSS-only so the text stays
      in the accessibility tree, and the toggle is a real button.
- Sizing: 44px toggle below 600px, 32px from 600px up.
- From: `ReviewWorkspace.tsx` `HistoryDetail`;
      `ReviewWorkspace.css` `.verification-history-detail.is-clamped`,
      `.verification-history-toggle`.
- Proof: story renders; the review history keeps its clamp threshold.

**Batch B proof:** `scripts/gate.sh` green; each of the eight stories renders
at both presets; every prototype page that used the replaced local rules still
looks unchanged when reviewed in the preview dev server.

## Batch C — Shell

### Task C1 — `AdminTopBar` (M)

- [x] `packages/ui/src/components/admin-top-bar.tsx` + `.stories.tsx`
- Props: `path: { label: string; href?: string }[]`, `title: string`,
      `meta?: ReactNode[]`, `actions?: ReactNode`, `identity?:
      { name: string; initials: string }`, `onIdentityClick?`,
      `brand?: { src: string; alt: string; label: string }`,
      `leading?: ReactNode`, `variant: "desktop" | "phone"`, `locale`.
- Stories (`Admin/AdminTopBar`): desktop three-level path; desktop with date
      and bell; phone brand + workspace slot + 44px identity; long page title;
      no actions.
- A11y: `<header>` with the path as a `<nav aria-label>` or an ordered list;
      the bell and identity buttons carry `aria-label`; the phone variant does
      not duplicate the desktop `<header>` landmark.
- Sizing: phone identity 44px; desktop 32px action buttons.
- From: `App.tsx` `.topbar`, `.mobile-topbar`; `index.css` `.topbar`,
      `.topbar-path`, `.topbar-actions`, `.today`, `.icon-action`,
      `.top-avatar`, `.top-name`, `.mobile-topbar*`.
- Proof: story renders at 1440×900 and 390×844; the shell keeps exactly one
      header per breakpoint.

### Task C2 — `WorkspaceSelector` (M)

- [x] `packages/ui/src/components/workspace-selector.tsx` + `.stories.tsx`
- Props: `value: string`, `options: { id: string; label: string; short?:
      string; kind: string; icon?: ReactNode }[]`, `onChange`, `label?`
      (default "RUANG KERJA"), `searchPlaceholder?`, `collapsed?: boolean`,
      `variant: "sidebar" | "phone"`, `locale`, `className`.
- Stories (`Admin/WorkspaceSelector`): sidebar expanded (national); sidebar
      collapsed (icon only, menu to the side); phone trigger with menu; search
      that filters; one option; selected option checkmark; long label
      truncation.
- A11y: the trigger is `aria-expanded` with `aria-label` naming the current
      workspace, the menu is a labelled group of `aria-pressed` buttons, and
      the search field autofocuses on open with `Escape` closing the menu.
- Sizing: trigger 32px ≥600px; phone trigger and 16px search input 44px
      below 600px.
- From: `App.tsx` `.scope-wrap`, `.scope-button`, `.scope-list`, `.scope-mark`,
      `.mobile-scope`, `.mobile-scope-menu`; `index.css` the `scope-*` rules.
- Proof: story renders; the three local copies are deleted in Batch F.

### Task C3 — `IdentityChip` (S)

- [x] `packages/ui/src/components/identity-chip.tsx` + `.stories.tsx`
- Props: `name`, `detail`, `initials`, `onClick`, `collapsed?: boolean`,
      `className`.
- Stories (`Admin/IdentityChip`): expanded; collapsed (initials only); long
      name and role; as the sidebar footer inside a `PanelCard`.
- A11y: a real `<button>` with `aria-haspopup="dialog"`; when collapsed the
      accessible name stays the person's name, not the initials.
- Sizing: 44px below 600px, 32px from 600px up; the collapsed square is 44px.
- From: `App.tsx` `.identity-chip`; `index.css` `.identity-chip` rules and the
      `[data-collapsed=true]` overrides.
- Proof: story renders at both presets.

### Task C4 — `AccountSheet` (M)

- [x] `packages/ui/src/components/account-sheet.tsx` + `.stories.tsx`
- Props: `open`, `onOpenChange`, `name`, `detail`, `initials`, `items:
      { label: string; sublabel?: string; icon: ReactNode; onSelect: () =>
      void; tone?: "default" | "danger" }[]`, `switchSlot?: ReactNode`,
      `signOutLabel?`, `onSignOut?`, `locale`, `closeLabel?`,
      `label?` (dialog name).
- Stories (`Admin/AccountSheet`): default with one switch; three rows with
      sublabels and icons; sign-out as the danger row; long name and role;
      no switch slot; phone and desktop.
- A11y: `role="dialog"` with a labelled title, the backdrop closes it, `Escape`
      closes it, focus moves to the close button on open and returns to the
      trigger on close, the close target is 44px, and the demo rows are
      ordinary buttons.
- Sizing: rows and close 44px minimum at every width (it is a phone sheet).
- From: `App.tsx` `.profile-sheet`, `.sheet-backdrop`, `.sheet-handle`,
      `.sheet-head`, `.sheet-switch`, `.sheet-rows`, `.sheet-row`;
      `index.css` the `.profile-sheet*` rules.
- Proof: story renders; keyboard-only open/close/Escape verified in Storybook.

### Task C5 — `Tabs`: count and appearance (M, MODIFIED)

- [x] `packages/ui/src/components/tabs.tsx`: `TabsTrigger` gains
      `count?: number`, and `TabsList` gains
      `appearance?: "default" | "underline" | "segmented"`. No existing prop
      changes behaviour.
- Stories: extend `Portal/Tabs` — default; underline with counts; segmented
      (the invite mode and doc-side switchers); counts at zero; long labels
      with horizontal scroll (the phone queue tabs); keyboard arrow
      navigation.
- A11y: the count is part of the trigger's accessible name
      (`"Baru, 12"`) or a visually hidden suffix; `role="tablist"` and
      `aria-selected` stay Radix-owned; horizontal scroll keeps the tabs
      reachable by keyboard.
- Sizing: trigger 44px below 600px, 32px from 600px up.
- From: `ReviewWorkspace.css` `.verification-tabs`,
      `.verification-doc-tabs`; `MemberPage.tsx` `.member-view-tabs`;
      `MemberPage.css` `.member-invite-mode`; `StatsPage.tsx` `.stats-tabs`;
      `index.css` `.tabs`.
- Proof: stories render; the four migrated tab rows keep their current labels,
      counts and keyboard behaviour.

### Task C6 — `Timeline`: expansion (M, MODIFIED)

- [x] `packages/ui/src/components/timeline.tsx`: add
      `defaultVisibleCount?: number`, `expandLabel?`, `collapseLabel?`,
      `onExpandChange?`. The default (`undefined`) keeps today's
      render-everything behaviour.
- Stories: extend `Portal/Timeline` — all items; three visible with the
      "Lihat selengkapnya (N)" affordance; expanded; one item; state mix;
      long description inside an `ExpandableText`; phone.
- A11y: the toggle is a real button with `aria-expanded`, the hidden items are
      removed from the accessibility tree (or the list announces its length),
      and the count in the label matches the revealed items.
- Sizing: 44px toggle below 600px, 32px from 600px up.
- From: `ReviewWorkspace.tsx` the history list and
      `.verification-history-more`; also used by the member membership history
      and the invitation timeline.
- Proof: stories render; the review history shows three events then reveals
      the rest.

**Batch C proof:** `scripts/gate.sh` green; the six story files render at 390
and 1280 with their bands measured at 390/599/601/1280. The prototype
dev-server check (the new shell rendering the same screens at 390px, 700px and
1440px) belongs to F1: the prototype keeps its own `App.tsx` shell until the
migration batch imports these components, so batch C proves the components by
their stories and F1 proves the shell against the migrated prototype.

## Batch D — Filters and charts

### Task D1 — `SearchableMultiSelect` (L)

- [ ] `packages/ui/src/components/searchable-multi-select.tsx` +
      `.stories.tsx`. Merges the prototype's `SearchableMultiSelect.tsx`,
      `SearchableUnitMenu` and the multi-select uses in `MemberWorkspace`,
      `MemberPage`, `ManagementPage` and `StatsPage`.
- Props: `label`, `values: string[]`, `options: string[]`, `onChange`,
      `allLabel`, `compact?`, `single?`, `showAllOption?` (default
      `!single`), `searchPlaceholder?`, `emptyLabel?`, `visibleLabel?`,
      `disabled?`, `className`.
- Behaviour merged from the three copies (see `design.md` D4): the trigger
  label is `allLabel` / the single value / `"N dipilih"`; search matches with
  `toLocaleLowerCase("id")`; the search field autofocuses on open and is
  reset on close; `Escape`, `Tab` and `ArrowDown` pass through to Radix while
  every other key is stopped so the highlight does not move; checkbox items
  keep the menu open; the "Semua" row clears the selection.
- Stories (`Admin/SearchableMultiSelect`): multi with nothing selected;
      multi with two selected; single; compact (the toolbar trigger); search
      filtered; no match; long option list with scroll; preselected value;
      disabled; phone (44px trigger, 16px search).
- A11y: the trigger carries `aria-label` = `"{label}: {selectedLabel}"`; the
      search field has its own label; the checkbox items keep Radix's
      `aria-checked`; the selected count is announced; keyboard-only open,
      search, select and close verified in Storybook.
- Sizing: 44px trigger / 16px search below 600px, 32px / 13px from 600px up.
- From: `SearchableMultiSelect.tsx`, `SearchableMultiSelect.css`,
      `ReviewWorkspace.tsx` `SearchableUnitMenu`,
      `ReviewWorkspace.css` `.verification-unit-menu`,
      `.verification-filter-trigger`.
- Proof: story renders; after Batch F the prototype imports it everywhere and
      `SearchableMultiSelect.tsx` no longer exists.

### Task D2 — `FilterMenu` (S)

- [ ] `packages/ui/src/components/filter-menu.tsx` + `.stories.tsx`
- Props: `label`, `value`, `options: { value: string; label: string }[]`,
      `allLabel`, `onChange`, `hideLabel?`, `disabled?`, `className`.
- Stories (`Admin/FilterMenu`): nothing selected; one value selected; long
      option list; hidden label (the toolbar variant); phone.
- A11y: the trigger's `aria-label` names the control and the current value;
      the checkmark is `aria-hidden` and the selected item is marked with
      `aria-checked` or a real checkmark inside a radio/checkbox item; keyboard
      navigation is Radix's.
- Sizing: 44px trigger below 600px, 32px from 600px up.
- From: `ReviewWorkspace.tsx` `FilterMenu` (kind, ownership, feedback target
      and reason).
- Proof: story renders; the review filters keep their current options.

### Task D3 — `FilterChips` (S)

- [ ] `packages/ui/src/components/filter-chips.tsx` + `.stories.tsx`
- Props: `chips: { label: string; value: string; count?: number;
      onRemove: () => void }[]`, `onClearAll?`, `clearAllLabel?`,
      `label?` (group name), `className`.
- Stories (`Admin/FilterChips`): one chip; five chips with counts (the
      Statistik warehouse row); chips without counts (the directory);
      clear-all visible; wrap on phone; horizontal scroll on phone.
- A11y: a labelled `<ul>`; each remove control is a button whose accessible
      name includes the group and the value; `aria-label` on the clear-all.
- Sizing: 44px chip targets below 600px, 32px from 600px up; 13px text.
- From: `StatsPage.tsx` `.warehouse-chips`, `.warehouse-chip`,
      `.warehouse-chip-clear`; `SearchFilter`'s inline chips are the same row
      and stay as they are (noted in `design.md` D2).
- Proof: story renders; the Statistik page keeps per-value counts.

### Task D4 — `PieChart` (L)

- [ ] `packages/ui/src/components/pie-chart.tsx` + `.stories.tsx`. Data-in,
      SVG-out, no dependency (`design.md` D1).
- Props: `data: { label: string; value: number; color?: string }[]`,
      `size?: number`, `donut?: boolean`, `centerLabel?: string`,
      `centerValue?: string`, `legend?: "list" | "none"`, `fallback?:
      "table" | "none"`, `maxSlices?: number` (default 5, rest collapses to
      "Lainnya"), `formatValue?: (value: number) => string`,
      `ariaLabel?: string`, `className`.
- Implementation notes: arcs via a single `path` per slice with the token
  palette for defaults (`--brand-red` plus its tints and the neutral grey);
  percentages rounded to one decimal and forced to sum to 100%; `vectorEffect`
  so a 1px stroke stays 1px; the legend is a `<ul>` with label, count and
  percentage; `fallback="table"` renders a visually hidden `<table>` with
  `<caption>` and `<th scope="row">`.
- Stories (`Admin/PieChart`): **Jenis kelamin** (L/P, the owner's case);
      **Anggota Biasa vs Luar Biasa** with the three subtypes collapsed into
      "Lainnya" (the owner's case); donut with a centre total; two equal
      slices; zero-value slice omitted; 8 slices collapsed to 5 + Lainnya;
      table fallback visible for review; light and dark surface; phone.
- A11y: `role="img"` with an `aria-label` that summarises every slice, plus
      the legend list as text; the table fallback carries the same numbers;
      colour is never the only carrier (the legend has labels and values); a
      contrast check for the legend text and the slice labels.
- Sizing: no interactive controls; the legend wraps below 600px.
- From: new capability. The prototype has no pie today, so the story is the
      design record; the owner decision for Statistik is quoted in the story
      docs.
- Proof: story renders; `npm ls --all` in `packages/ui` lists no new package;
      the Storybook build chunk report shows no new vendor chunk.

### Task D5 — `BarChart` (M)

- [ ] `packages/ui/src/components/bar-chart.tsx` + `.stories.tsx`
- Props: `data: { label: string; value: number; hint?: string }[]`,
      `orientation?: "vertical" | "horizontal"`,
      `highlightLast?: boolean`, `max?: number`, `height?: number`,
      `formatValue?: (value: number) => string`, `gridLines?: boolean`,
      `fallback?: "table" | "none"`, `ariaLabel?: string`, `className`.
- Stories (`Admin/BarChart`): vertical six-month trend (the dashboard pulse
      panel); vertical with the last bar highlighted; horizontal facet
      distribution with labels and counts (the Statistik facet card); single
      bar; all-zero data; 14 horizontal rows; phone.
- A11y: `role="img"` with an `aria-label` listing each bar, the per-bar
      `title` as a hint, and the optional table fallback; no colour-only
      encoding (the label is beside the bar in the horizontal variant); a
      minimum visible bar height so a small value is not invisible.
- Sizing: no interactive controls; labels truncate rather than shrink the
      text below 12px.
- From: `StatsPage.tsx` `TrendFromRows` and `FacetBars`; `index.css`
      `.trend-chart`, `.trend-col`, `.trend-bars`, `.dist-list`; `App.tsx`
      `.bar-chart`, `.chart-axis`.
- Proof: story renders; the dashboard trend and the six Statistik facet cards
      keep their numbers.

### Task D6 — `DistributionBar` (M)

- [ ] `packages/ui/src/components/distribution-bar.tsx` + `.stories.tsx`
- Props: `segments: { label: string; value: number; color?: string }[]`,
      `size?: "sm" | "md"`, `legend?: "list" | "inline" | "none"`,
      `totalLabel?: string`, `formatValue?: (value: number) => string`,
      `ariaLabel?: string`, `className`.
- Stories (`Admin/DistributionBar`): three-segment completeness bar with the
      inline legend (the figures band); the same bar at md (the Statistik
      card); degree composition with a "Lainnya" segment; two segments;
      zero-total; one segment at 100%; phone.
- A11y: `role="img"` with an `aria-label` naming every segment and its count;
      the legend is text, never colour alone; each segment carries its own
      `title`.
- Sizing: no interactive controls; the legend wraps below 600px.
- From: `FiguresBand.tsx` `MiniBar` and `CompletenessBar`;
      `StatsPage.tsx` the completeness stack; `index.css`
      `.figure-mini-bar`, `.figure-stack`, `.figure-legend`,
      `.completeness-stack`, `.completeness-legend`.
- Proof: story renders; both dashboard bars and the Statistik bar keep their
      proportions.

**Batch D proof:** `scripts/gate.sh` green; story renders at both presets; the
owner's two pie charts exist as stories with the real labels; the bundle check
in `design.md` D1 passes.

## Batch E — Data displays

### Task E1 — `FiguresBand` (M)

- [ ] `packages/ui/src/components/figures-band.tsx` + `.stories.tsx`
- Props: `title`, `description?`, `groups: { label: string; value: string;
      tone?: "default" | "warn"; sub?: ReactNode; visual?: ReactNode;
      linkLabel: string; onSelect: () => void }[]`, `columns?`,
      `className`.
- Stories (`Admin/FiguresBand`): three groups (the komsat scope); four groups
      (national); with a warn value; with a mini `DistributionBar`; with a
      completeness `DistributionBar`; long sub-line; phone (one column);
      long labels.
- A11y: each group is one button with an accessible name that includes the
      label, the value and the sub-line; the band is a labelled region; the
      visual slot is `aria-hidden` when the sub-line already states the
      numbers (avoid reading the same figures twice).
- Sizing: 44px group targets below 600px, 32px from 600px up; one column
      below 600px, two at 601–1100px, four at 1101px and wider.
- From: `FiguresBand.tsx`; `index.css` `.figures-band`, `.band-head`,
      `.band-groups`, `.figure-group`, `.figure-label`, `.figure-value`,
      `.figure-sub`, `.figure-sep`, `.figure-link`.
      The metric choice, the production field names and the deep links stay
      app-side (`docs/admin-integration/dashboard.md`).
- Proof: story renders; the dashboard band keeps its four/three group count
      per scope.

### Task E2 — `DocumentViewer` (M)

- [ ] `packages/ui/src/components/document-viewer.tsx` + `.stories.tsx`
- Props: `sides: { id: string; label: string; kind: "image" | "pdf"; name:
      string; meta?: string }[]`, `value`, `onChange`, `children` (the app's
      preview stage), `facts?: FactListProps["items"]`, `loading?`,
      `emptyLabel?`, `locale`, `label?`, `className`.
- Stories (`Admin/DocumentViewer`): two sides with an image stage; a PDF side;
      the facts list under the stage; loading skeletons; empty; long file
      name; phone.
- A11y: the side switcher is `role="group"` with `aria-pressed` buttons (or
      `Tabs`); the file row's icon has an accessible name for the type; the
      stage is a labelled region; loading announces itself with
      `role="status"`.
- Sizing: side tabs 44px below 600px, 32px from 600px up; the facts list is
      single-column below 600px.
- From: `ReviewWorkspace.tsx` the "Kartu pelajar" section and
      `.verification-doc-tabs`, `.verification-document-island`,
      `.verification-file-row`, `.verification-document-stage`,
      `.verification-document-facts`; `ReviewWorkspace.css`.
      The synthetic paper preview and the real document fetch stay app-side.
- Proof: story renders; the review drawer keeps both sides and its facts.

### Task E3 — `MapCard` (L)

- [ ] `packages/ui/src/components/map-card.tsx` + `.stories.tsx`. Imports no
      map library and no geography (`design.md` D3).
- Props: `title`, `description?`, `children` (the app's map canvas),
      `panel: ReactNode` (the selection summary body), `panelLabel?`,
      `footer?: StatStripProps["items"]`, `chip?: { label: string; onClear:
      () => void }`, `onExpandChange?`, `expanded?` (uncontrolled by default),
      `expandLabel?`, `collapseLabel?`, `sheetSummary?: string`,
      `unmappedNote?: ReactNode`, `loading?`, `loadingFallback?: ReactNode`,
      `className`.
- Behaviour: height steps 420px ≥900px, 320px 601–899px, 240px ≤600px; the
      panel renders as an overlay at ≥900px, an inline bar at 601–899px and a
      snap sheet in fullscreen on phones; fullscreen is `position: fixed`
      with `Escape` to close and a labelled toggle; the loading state renders
      the app's fallback (the prototype's `Skeleton` pair as the story's).
- Stories (`Admin/MapCard`): default with a placeholder canvas and an overlay
      panel; tablet inline panel; phone snap sheet; fullscreen; selected chip;
      long unit names; loading; unmapped note; three-item footer.
- A11y: the card is a labelled `<section>`; the expand toggle is
      `aria-expanded` and 44px on phones; the snap-sheet handle is a toggle
      with `aria-expanded`; the panel is reachable in DOM order before the
      footer; `Escape` closes fullscreen and returns focus to the toggle.
- Sizing: 44px expand/panel controls below 600px, 32px from 600px up.
- From: `MapCard.tsx` `MapCard`; `index.css` `.map-card`, `.map-card-head`,
      `.map-head-actions`, `.map-expand`, `.map-chip`, `.map-canvas`,
      `.map-panel-overlay`, `.map-panel-body`, `.map-panel-inline`,
      `.map-sheet*`, `.map-footer`, `.map-unmapped`, `.map-loading`.
      `MapSideCard`, `LeafletMap`, `mapData.ts` and `mapLevels.ts` stay
      app-side.
- Proof: story renders at 1440×900, 760×900 and 390×844; the height steps are
      visible in the story notes; the map itself is the app's child.

**Batch E proof:** `scripts/gate.sh` green; the three stories render at both
presets; each story names the production field or contract its placeholder
stands for.

## Batch F — Prototype migration and local cleanup

### Task F1 — Migrate the prototype to the package (M)

- [ ] Import the 21 new components from `ppij-design-system` in
      `App.tsx`, `FiguresBand.tsx`, `MapCard.tsx`, `MemberPage.tsx`,
      `MemberWorkspace.tsx`, `ManagementPage.tsx`, `ReviewWorkspace.tsx` and
      `StatsPage.tsx`.
- [ ] Delete `prototypes/redesign-adminv1/src/SearchableMultiSelect.tsx`,
      `SearchableMultiSelect.css`, the local `SearchableUnitMenu` and
      `FilterMenu` in `ReviewWorkspace.tsx`, and every CSS block those and the
      migrated compositions leave behind in `index.css`,
      `ReviewWorkspace.css`, `MemberWorkspace.css`, `MemberPage.css` and
      `ManagementPage.css`.
- [ ] Keep `docs/admin-integration/README.md` and the five page handoffs
      accurate: point the app at the new components and record any handoff
      sentence that changes (for example the `SearchableMultiSelect`
      filter-API gap wording stays, because the contract did not change).
- Proof: `npm run typecheck -w ppij-redesign-adminv1` and
      `npm run build -w ppij-redesign-adminv1` pass;
      `rg -n "SearchableMultiSelect.tsx" prototypes` finds nothing; the
      preview server returns 200 for `/`; the five screens are eyeballed at
      390px, 760px and 1440px against the pre-migration screenshots.

### Task F2 — Gate and release proof (M)

- [ ] `CHANGELOG.md` entry for `0.4.0` listing the 21 components, the five
      adjustments and the chart decision.
- [ ] Bump to `0.4.0`: root `VERSION`, `packages/ui/package.json` (via the
      A4 sync), and confirm `npm pack` in `packages/ui` contains `dist`
      components plus `tokens.css` and `tokens.json`.
- [ ] Install the packed tarball into a scratch consumer with no credentials,
      import the root, `tokens.css` and `tokens.json`, and render
      `AdminTopBar`, `PanelCard`, `PieChart` and `MapCard`.
- [ ] `scripts/gate.sh` on a clean committed tree prints `ALL PASS`.
- Proof: the scratch consumer renders; the `npm pack` listing is pasted into
      the task; the gate output is pasted into the task.

### Task F3 — Tag and release (owner step, S)

- [ ] Tag `v0.4.0` and publish a GitHub Release whose tarball is the anonymous
      install artifact (`npm install github:ppij-dev/ppij-design-system#v0.4.0`).
- [ ] **Owner:** run `npm publish` from `packages/ui` with 2FA, then confirm
      `npm view ppij-design-system version` reports `0.4.0`. This is not a
      worker step; commit, tag and release are, publish is not.
- Proof: the tag exists, the release tarball installs into a scratch app, and
      the owner confirms the registry version.

**Batch F proof:** `scripts/gate.sh` green on a clean tree at `v0.4.0`, the
scratch consumer renders, and the prototype builds with no local duplicate.

## Handoff

After `0.4.0`, the `ppij-identity` admin-redesign change imports from the
pinned package and keeps its routes, sessions, permissions, data loaders,
audit logging, encrypted reveal and mutations in the app. The component list in
`design.md` D2 is the import list that change should carry, and
`docs/admin-integration/README.md` is the shell rule it must follow.

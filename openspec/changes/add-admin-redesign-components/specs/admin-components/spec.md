# Spec Delta

## Purpose

Define the admin presentation component set that `ppij-design-system@0.4.0`
ships for the `ppij-identity` admin redesign: the shell pieces, the container
and list primitives, the one multi-select and filter-chip contracts, the
dependency-free chart primitives, the data displays, the form and feedback
pieces, and the map frame. The set stays inside the repository boundary: brand,
tokens and presentation only, with every string, datum, href and callback
arriving as a prop.

## ADDED Requirements

### Requirement: Presentation-only admin component set
Every component added by this change SHALL be presentation-only. It SHALL
accept its data, labels, hrefs, options, sizes and callbacks as props and SHALL
NOT fetch application data, import an API client, read a secret, read the
session, decide permissions, validate a business rule, or import an
application i18n module.

#### Scenario: A component arrives without data logic
- **WHEN** the component set is reviewed for fetch calls, API imports,
  session reads, permission checks, business-rule validation and app i18n
  imports
- **THEN** every component passes, and any component that fails is sent back
  before merge

#### Scenario: A page keeps its own logic
- **WHEN** an application imports a component from this set
- **THEN** the application still owns the route, the query, the permission
  check, the mutation, the audit record and the error mapping, and passes
  only the presentation inputs to the component

### Requirement: Admin top bar
The set SHALL provide `AdminTopBar` with a breadcrumb path, a page title, an
optional quiet metadata slot, an action slot, an identity affordance and a
phone variant that carries the brand, a workspace slot and the identity.

#### Scenario: The shell renders one header
- **WHEN** a shell using `AdminTopBar` renders at 1440×900 and at 390×844
- **THEN** exactly one `header` landmark is reachable and the phone variant
  does not duplicate the desktop one

#### Scenario: The path is a list, not text
- **WHEN** a three-level path renders
- **THEN** it is a labelled navigation or ordered list whose items are real
  links where the caller supplies an href

#### Scenario: The phone identity is touch sized
- **WHEN** the phone variant renders below 600px
- **THEN** the identity affordance measures at least 44×44 pixels and carries
  the person's name as its accessible name

### Requirement: Workspace selector
The set SHALL provide `WorkspaceSelector` as one searchable workspace picker
with an expanded and a collapsed trigger, for the sidebar and for the phone,
from a single contract of options and a selected id.

#### Scenario: The selector is searchable and labelled
- **WHEN** the workspace selector is opened
- **THEN** the search field receives focus, typing filters the options by
  locale-insensitive match, the trigger reports `aria-expanded` and names the
  current workspace, and the selected option is marked pressed

#### Scenario: The collapsed trigger stays named
- **WHEN** the trigger renders collapsed with an icon only
- **THEN** its accessible name still states the current workspace

#### Scenario: One contract serves both triggers
- **WHEN** the sidebar trigger and the phone trigger render from the same
  options
- **THEN** both offer the same list, the same filtering and the same selection
  change

### Requirement: Identity chip and account sheet
The set SHALL provide `IdentityChip` for the sidebar footer and `AccountSheet`
for the profile dialog. `IdentityChip` SHALL render the name and role and
SHALL keep the person's name as its accessible name when collapsed.
`AccountSheet` SHALL render a labelled dialog with an identity header, a
close control, an optional switch slot and rows with an optional sign-out row.

#### Scenario: The collapsed identity chip keeps the real name
- **WHEN** the sidebar is collapsed and the identity chip shows initials only
- **THEN** its accessible name is the person's name, not the initials

#### Scenario: The account sheet is a keyboard-closable dialog
- **WHEN** the account sheet is opened and `Escape` is pressed, or the backdrop
  is activated
- **THEN** the sheet closes, focus returns to the element that opened it, and
  the close control is at least 44×44 pixels

### Requirement: Panel card
The set SHALL provide `PanelCard` as the white island: an optional title,
description, heading level, action, badge and icon, plus a page padding mode
for a full-page island and a compact density.

#### Scenario: A page island and a panel share one component
- **WHEN** a page island and an inner panel render
- **THEN** both use `PanelCard` with different padding and no page-local
  island rule remains

#### Scenario: The head action is a real control
- **WHEN** a panel renders an action
- **THEN** the action is a real control at its sizing band, not a decorative
  node

### Requirement: List row and fact list
The set SHALL provide `ListRow` for one selectable row and `FactList` for
term/value rows. `ListRow` SHALL render as a real button or link with optional
leading, subtitle, meta, badge, trailing and tone. `FactList` SHALL render
through `dl`, `dt` and `dd` in rows, two-column or inline form, with an
optional total row.

#### Scenario: A migrated list keeps its content
- **WHEN** a prototype list that used `ListRow` or `FactList` renders after
  migration
- **THEN** it shows the same terms, values, rows, order and labels as before
  the migration

#### Scenario: Two-column facts stay complete on a phone
- **WHEN** a `FactList` with the two-column variant renders below 600px
- **THEN** every term and value is still present, in one column

#### Scenario: A row is one tab stop
- **WHEN** a selectable `ListRow` is reached by keyboard
- **THEN** the whole row is one tab stop and decorative nodes are hidden from
  assistive technology

### Requirement: Stat strip
The set SHALL provide `StatStrip` as a labelled sequence of value-over-label
items with a configurable column count and two sizes.

#### Scenario: One strip serves the map footer and the totals band
- **WHEN** the map card footer and the statistics totals band render
- **THEN** both use `StatStrip` and every item shows its value and its label

### Requirement: Searchable multi-select
The set SHALL provide `SearchableMultiSelect` as the single searchable, checked
selection control, covering the filter-toolbar, drawer and form uses in single
and multiple form, and SHALL merge the prototype's local copies into this one
contract.

#### Scenario: Multiple selection keeps the menu open
- **WHEN** a value is toggled in a multiple-selection instance
- **THEN** the menu stays open, the item reports its checked state, and the
  trigger label becomes the all-label, the single value, or the selected count

#### Scenario: Single selection replaces the value
- **WHEN** a value is chosen in a single-selection instance
- **THEN** the previous value is replaced, the menu closes, and no all-option
  is offered

#### Scenario: Search filters with locale matching
- **WHEN** text is typed into the search field
- **THEN** options are filtered by case-insensitive locale matching and, when
  nothing matches, one empty-result line is shown

#### Scenario: The trigger is named
- **WHEN** a screen reader focuses the trigger
- **THEN** its accessible name states the control's label and the current
  selection, and the search field has its own accessible name

#### Scenario: Keys do not move the highlight by accident
- **WHEN** the search field receives a keystroke other than `Escape`, `Tab` or
  `ArrowDown`
- **THEN** the dropdown's highlighted item does not move

### Requirement: Filter menu
The set SHALL provide `FilterMenu` as the single non-searchable single-select
control, optionally hiding its visible label for toolbar use.

#### Scenario: The menu names its control and value
- **WHEN** a screen reader focuses a filter menu trigger
- **THEN** its accessible name states the control's label and the current
  value or the all-label

#### Scenario: The all-option clears the value
- **WHEN** the all-option is chosen
- **THEN** the caller's change callback receives an empty value and the trigger
  shows the all-label

### Requirement: Active filter chips
The set SHALL provide `FilterChips`: removable chips for the active filters,
each showing its group and value, an optional per-value count, and a
clear-all action.

#### Scenario: Chips reflect the active filter set
- **WHEN** two filters are active
- **THEN** two chips render with their groups and values, the optional counts
  match the filtered set, and the clear-all control removes both

#### Scenario: A chip is removable by name
- **WHEN** a screen-reader user reaches a chip's remove control
- **THEN** its accessible name identifies the group and the value, for example
  "Komsat: Tokyo"

### Requirement: Charts are data-in, SVG-out and dependency-free
The set SHALL provide `PieChart`, `BarChart` and `DistributionBar` as
presentation charts that take data and formatting callbacks as props and render
SVG. No chart library SHALL appear in the package dependencies, and the chart
family SHALL add less than 10 kB gzip of component code.

#### Scenario: No chart dependency is added
- **WHEN** the dependency tree of the package is listed and the Storybook
  build's chunks are compared with the previous release
- **THEN** no chart library appears and no new vendor chunk is produced by the
  chart family

#### Scenario: Charts take data, not a data source
- **WHEN** a chart component's props and module scope are reviewed
- **THEN** it lists data, labels and formatters, contains no fetch, no API
  import and no module-level browser access, and renders in a server render

### Requirement: Pie chart behaviour
`PieChart` SHALL support a pie and a donut form with an optional centre label
and value, collapse slices beyond a configurable maximum into one remainder
slice, and round displayed percentages so they sum to 100%.

#### Scenario: The owner's pie charts are covered by stories
- **WHEN** the `PieChart` stories render
- **THEN** one story shows the *Jenis kelamin* composition and one shows the
  *Anggota Biasa vs Luar Biasa* composition, with the remaining subtypes
  collapsed into a remainder slice

#### Scenario: A small slice stays visible
- **WHEN** a slice is too small to draw at full scale
- **THEN** its value and percentage stay readable in the legend and the slice
  is not dropped from the accessibility tree

### Requirement: Bar chart and distribution bar behaviour
`BarChart` SHALL support a vertical and a horizontal orientation, an optional
highlighted final bar, an explicit maximum and an optional value formatter.
`DistributionBar` SHALL render one stacked composition bar with a small and a
medium size and an optional legend.

#### Scenario: The horizontal variant labels its bars
- **WHEN** `BarChart` renders horizontally
- **THEN** every bar shows its label and its value beside the bar

#### Scenario: A tiny segment stays readable
- **WHEN** a stacked segment is too small to see
- **THEN** its label and value still appear in the legend

### Requirement: Charts carry a text alternative
Every chart SHALL expose the same numbers as text: an accessible name that
summarises the series or slices, a legend or label list rendered as text, and a
table fallback. Colour SHALL NOT be the only carrier of meaning, and labels
SHALL meet the contrast requirement on the light and dark surfaces.

#### Scenario: The fallback table matches the chart
- **WHEN** the table fallback is rendered beside a chart
- **THEN** every slice or bar appears as a row with its label and its value,
  and the numbers equal the chart's own numbers

#### Scenario: Colour is not the only carrier
- **WHEN** a chart is reviewed without colour
- **THEN** each slice or bar is still identifiable by its label, value and
  legend entry

### Requirement: Figures band
The set SHALL provide `FiguresBand`: a labelled region of figure groups where
each group shows one label, one headline value, an optional tone, sub-line and
visual node, and one link, and the whole group is a single control.

#### Scenario: One group is one control
- **WHEN** a figure group is focused
- **THEN** its accessible name contains the label, the value and the sub-line,
  and activating it calls the group's own callback

#### Scenario: The band groups respond to the width
- **WHEN** the band renders below 600px, from 600px to 1100px, and above
  1100px
- **THEN** it renders one column, two columns, and the caller's column count
  respectively

#### Scenario: The visual does not repeat the text
- **WHEN** a group's sub-line already states the numbers a visual node draws
- **THEN** the visual node is hidden from assistive technology so the figures
  are not announced twice

#### Scenario: The band never invents a metric
- **WHEN** a figure group is reviewed
- **THEN** its label, value, sub-line and link all come from props, and the
  production field or contract the figure stands for is named in the
  application, not in the component

### Requirement: Document viewer frame
The set SHALL provide `DocumentViewer`: a side switcher, a file row naming the
file and its kind, a stage slot for the application's preview, an optional fact
list under the stage, and loading and empty states.

#### Scenario: The sides switch without a route change
- **WHEN** the other side is chosen
- **THEN** the stage renders the application's content for that side, the
  chosen control reports its pressed state, and the facts remain visible

#### Scenario: The viewer never handles the document
- **WHEN** the viewer's module and props are reviewed
- **THEN** it renders a child, and contains no fetch, no decode, no storage and
  no transmission of a document

#### Scenario: Loading announces itself
- **WHEN** the viewer is loading
- **THEN** a status role announces the load and the stage renders the
  application's skeleton, not a blank frame

### Requirement: Inline notes use one component
The set SHALL provide `Callout`: an inline note with a tone, an optional icon,
an optional title, body content, an optional action and a compact density.

#### Scenario: Tone maps to the announcement
- **WHEN** a callout renders with an informational, success or danger tone
- **THEN** it exposes the matching status or alert role, and its icon is hidden
  from assistive technology

#### Scenario: One component replaces the page-local notes
- **WHEN** the prototype's inline notes are migrated
- **THEN** each one uses `Callout` and the page-local note rules are deleted

### Requirement: Form grid
The set SHALL provide `FormGrid` with a field wrapper that renders a label, an
optional hint and an optional error, a wide span for full-width fields and a
single-column phone layout.

#### Scenario: An error is announced and connected
- **WHEN** a field wrapper renders an error
- **THEN** the error announces as an alert and the control is marked invalid
  and described by the error

#### Scenario: The grid stays usable on a phone
- **WHEN** a two-column form renders below 600px
- **THEN** it renders one column, with 44px controls and 16px editable text

### Requirement: Masked reveal never exposes the clear value early
`RevealValue` SHALL render only the masked form and a reveal control while the
value is not revealed. The clear value SHALL NOT be present in the rendered DOM
before the reveal.

#### Scenario: The clear value is absent before the reveal
- **WHEN** a masked `RevealValue` is inspected in the DOM before the reveal
- **THEN** the clear value does not appear anywhere in the rendered markup

#### Scenario: The reveal control is named
- **WHEN** a screen reader reaches the reveal control
- **THEN** its accessible name states whether it will reveal or hide the value
  and which field it belongs to

### Requirement: The map card frames an application-supplied map
The set SHALL provide `MapCard` as a presentation frame: a title and
description, a selection chip, an expand control, a panel, a footer built from
`StatStrip`, an optional unmapped note and a loading state. The map canvas
SHALL arrive as a child.

#### Scenario: The map arrives as a child
- **WHEN** a `MapCard` renders
- **THEN** the canvas contains the application's own map element and the
  package's dependency tree contains no map library

#### Scenario: The height steps are the approved ones
- **WHEN** the card renders at 1440px, at 760px and at 390px
- **THEN** the canvas is 420px, 320px and 240px tall respectively

#### Scenario: The panel adapts to the width
- **WHEN** the card renders at 900px or wider, from 601px to 899px, and below
  601px
- **THEN** the panel renders as an overlay, an inline bar, and a snap sheet
  respectively

#### Scenario: Fullscreen is keyboard-safe
- **WHEN** the expand control is activated and then `Escape` is pressed
- **THEN** the card leaves fullscreen, the control reports its collapsed state
  and focus returns to it

### Requirement: Long text clamps with an explicit toggle
The set SHALL provide `ExpandableText`: a clamped multi-line text with a reveal
toggle when the text exceeds the clamp and no toggle when it does not.

#### Scenario: Short text has no toggle
- **WHEN** the text fits within the clamp
- **THEN** no toggle renders

#### Scenario: The toggle is a button with state
- **WHEN** the text exceeds the clamp
- **THEN** a button with `aria-expanded` reveals and re-clamps the text, and the
  clamp is CSS-only so the text stays in the accessibility tree

### Requirement: Sizing bands live in the component
Every component added by this change SHALL implement the repository's sizing
bands itself: interactive controls at least 44 pixels below 600px and 32 pixels
from 600px up, and editable text 16 pixels below 600px and 13 pixels in the
compact density from 600px up. A component SHALL NOT rely on a page-local
override and SHALL NOT add its own horizontal padding inside `AdminDrawer`.

#### Scenario: A page carries no sizing override for a component
- **WHEN** an application page renders a component from this set
- **THEN** the page contains no local rule setting that component's control
  height or font size

#### Scenario: Both bands are reviewed
- **WHEN** a component's story is reviewed
- **THEN** it is checked in the phone (390×844) and desktop (1440×900)
  viewport presets at the matching band

### Requirement: Every component ships with its story
Every component added by this change SHALL have exactly one Storybook story
file beside it with a rendering default story, in the `Admin` group or, for a
component shared beyond admin, in the `Portal` group, and the states the
change's tasks list for that component SHALL be covered where they apply.

#### Scenario: A component without a story fails the gate
- **WHEN** a component file is added without a matching story file
- **THEN** `make test` fails on `scripts/check-stories.mjs`

#### Scenario: The story is the design record
- **WHEN** a reviewer opens a component's story
- **THEN** the approved appearance, the states and the sizing bands are
  visible without reading application code

### Requirement: Release 0.4.0 is coherent and installable
The version SHALL be `0.4.0` in the root `VERSION` file and in
`packages/ui/package.json` at the same time, with a `CHANGELOG.md` entry. The
package SHALL install into a consumer with no credentials and expose the
component root, `tokens.css` and `tokens.json`. Publishing to the npm registry
SHALL remain an owner step, separate from the build.

#### Scenario: The version pair cannot drift
- **WHEN** the build or the release runs
- **THEN** the root `VERSION` value and the package version are equal, and a
  mismatch fails the release

#### Scenario: A tokenless consumer renders the new components
- **WHEN** a scratch consumer installs the packed tarball with no credentials
  and imports the root, `tokens.css` and `tokens.json`
- **THEN** the imports resolve and the consumer renders components from this
  set

#### Scenario: Publish stays an owner step
- **WHEN** the release is reviewed
- **THEN** no CI job holds npm credentials and the publish step is documented
  as the owner's own action

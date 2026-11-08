# Spec Delta

## Purpose

Record the component-level contracts this change adds to the `design-system`
capability: the five adjustments to already shipped components — `Timeline`,
`Tabs`, `AdminDrawer`, `Input` and `StatusCard`. Each addition is non-breaking:
existing props keep their current behaviour and the new behaviour appears only
when the caller asks for it, except the `AdminDrawer` phone close target, which
is a fixed size correction.

## ADDED Requirements

### Requirement: Timeline expansion controls
`Timeline` SHALL accept an optional `defaultVisibleCount` and reveal the
remaining items through a labelled toggle, with the revealed count in the
toggle's label. When `defaultVisibleCount` is not set, `Timeline` SHALL render
every item, which is its current behaviour. The toggle SHALL be a real button
that reports `aria-expanded`.

#### Scenario: The default behaviour is unchanged
- **WHEN** a `Timeline` renders without `defaultVisibleCount`
- **THEN** every item renders and no toggle appears

#### Scenario: Only the newest items show at first
- **WHEN** a `Timeline` with more items than `defaultVisibleCount` renders
- **THEN** only the newest `defaultVisibleCount` items render, the toggle names
  the number of hidden items, and activating it reveals them

#### Scenario: The toggle reports its state
- **WHEN** the reveal toggle is focused
- **THEN** it is a button with `aria-expanded` and an accessible name for the
  reveal and the collapse direction

### Requirement: Tab count badge and tab appearance
`TabsTrigger` SHALL accept an optional `count` and `TabsList` SHALL accept an
`appearance` of `default`, `underline` or `segmented`, without changing the
behaviour of existing `Tabs` uses. A count SHALL be part of the trigger's
accessible name. A tab row wider than its container SHALL scroll horizontally
and every tab SHALL stay reachable by keyboard.

#### Scenario: A count is announced with its tab
- **WHEN** a screen reader reaches a trigger with a count
- **THEN** the accessible name includes the label and the count

#### Scenario: Existing tabs keep their behaviour
- **WHEN** a `Tabs` instance that sets no `count` and no `appearance` renders
- **THEN** it looks and behaves as before

#### Scenario: Overflowing tabs stay reachable
- **WHEN** the tab row overflows on a phone
- **THEN** it scrolls horizontally and every trigger is reachable by keyboard

### Requirement: Admin drawer phone close target
The `AdminDrawer` close control SHALL be at least 44×44 pixels below 600px and
SHALL keep its compact or default icon size from 600px up. Its accessible name
SHALL keep coming from the locale close label or the caller's override.

#### Scenario: The phone close target is touch sized
- **WHEN** an `AdminDrawer` renders below 600px
- **THEN** its close control measures at least 44×44 pixels and keeps its
  locale-derived accessible name

#### Scenario: Desktop stays compact
- **WHEN** an `AdminDrawer` with `density="compact"` renders at 900px or wider
- **THEN** its close control keeps the compact icon size

### Requirement: Compact input text size
`Input` SHALL accept an optional `textSize` of `compact` that renders 13 pixel
text from 600px up and 16 pixel text below 600px, so a page does not need a
local font-size override to reach the compact density. The existing size,
validation and disabled behaviour SHALL NOT change.

#### Scenario: A page stops overriding the input font size
- **WHEN** an admin page renders a compact `Input`
- **THEN** the page contains no local font-size rule for that input and the
  text renders at 13 pixels from 600px up

#### Scenario: Phone text stays at the editable minimum
- **WHEN** a compact `Input` renders below 600px
- **THEN** its text renders at 16 pixels

### Requirement: Status card admin density
`StatusCard` SHALL accept an optional `density` of `compact` that renders the
13 pixel body, 14 pixel title and 32 pixel action used by the admin surfaces,
while its existing `compact` row form, tones, region role and action behaviour
stay unchanged. `StatusCard` has no label element, so the admin surfaces'
12 pixel label step is not part of this requirement.

#### Scenario: The compact density matches the admin surfaces
- **WHEN** a `StatusCard` with `density="compact"` renders at 900px or wider
- **THEN** its body, title and action use the compact sizes and its action is
  at least 32 pixels tall

#### Scenario: Existing status cards are unchanged
- **WHEN** a `StatusCard` renders without `density`
- **THEN** it looks and behaves as before, including its region role, its
  accessible name and its 44 pixel action on a phone

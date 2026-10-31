# Align the member invitation action

## Why

On a 428 px phone, the Anggota page header wraps its invitation action awkwardly and the default button is too short for a primary touch action.

## Scope

Keep the shared PageHeader component and adjust only the Anggota instance and its island styles. Place the action on its own full-width row below the heading on phones, with a 44 px touch target; keep it right-aligned alongside the heading when there is room.

## Acceptance

- The Anggota title, description, and invitation button have a clear reading order at phone and tablet widths.
- The button remains keyboard accessible and opens the existing preview invitation flow.
- Other page headers remain unchanged.

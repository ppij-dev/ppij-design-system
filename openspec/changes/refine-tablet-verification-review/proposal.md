# Refine tablet verification review

## Why

At the 679px viewport, the quick filter row has uneven heights, the review drawer uses too much space above the record title, and the document area makes reviewers scroll back to compare key registration fields.

## Scope

Adjust only the admin verification preview composition. Keep the searchable advanced filters and the existing synthetic review data.

## Acceptance

- The quick kind selector uses its selected value as the visible label; search, kind, and filter controls align at tablet width.
- The bottom-sheet title sits closer to the drag handle without losing the handle.
- A concise registration summary appears under the student-card file row with name, level, institution/faculty, and month/year range.
- The preview builds and the clean-tree repository gate passes without browser use.

# Refine mobile verification detail

## Why

At a 391px viewport, the review summary badge inherits a muted text override and stretches in the mobile grid. Long history notes need a bounded default view, and the verification search/filter row has uneven wrapping and an oversized placeholder.

## Scope

Refine the existing admin verification preview. Preserve the shared badge and search/filter components while adjusting local composition and copy.

## Acceptance

- Status badges keep their variant foreground and compact shape on mobile.
- History details show at most three lines by default, with a keyboard-accessible control for longer notes.
- Search occupies its own mobile row; kind and advanced-filter controls align evenly below it.
- Search copy names the intended lookup clearly and its placeholder reads at phone width.
- The preview builds and repository gate passes on a clean tree.

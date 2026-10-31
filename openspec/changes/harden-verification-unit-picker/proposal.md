# Harden the verification unit picker

## Why

The searchable komsat picker visually marks selected options, but its menu items do not expose checked state to assistive technology. The search field also stops Escape from reaching the menu, so keyboard users cannot close it normally.

## Scope

Use the shared checkbox menu item for selected komsat values and preserve expected keyboard behavior in the search field. Keep the current single- and multi-select behavior.

## Acceptance

- Selected komsat options expose checked state.
- Search text can be typed while Escape closes the menu.
- Multi-select stays open as values change; single-select closes after selection.
- The preview builds and repository gate passes on a clean tree.

# Refine admin verification feedback and shell

## Why

Review feedback is cramped in a single-line input, status messages do not use success styling, the sidebar occupies too much space at intermediate widths, the preview version is missing from the footer, and verification filters cannot search across tabs.

## Scope

Improve the admin preview's verification feedback field and filtering, success toast, collapsible desktop sidebar, and visible version footer. Keep interactions local to the synthetic preview.

## Acceptance

- Feedback notes use a multiline, resizable field.
- Successful actions show a green toast with a check icon; errors remain distinct.
- The sidebar collapses and expands without losing navigation or workspace access.
- The preview and design system versions remain visible in the footer at phone and desktop sizes.
- Search covers all verification tabs and updates every tab count; kind, komsat, age, and flag filters remain available, with advanced filters in a drawer.
- The 713×813 viewport has no horizontal page overflow.
- The preview builds and the clean-tree repository gate passes.

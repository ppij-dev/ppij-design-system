# Compact DataTable pagination

## Why

The shared DataTable footer currently shows wide disabled text buttons even when a table has only one page. This adds visual weight and suggests an unavailable action, as seen in the admin redesign preview.

## Scope

Keep the existing DataTable layout and props. Hide pagination when neither direction is actionable or when no pagination handlers are supplied. For multi-page tables, use compact icon controls with accessible names and a quiet page label. Update Storybook to demonstrate both states.

## Acceptance

- A one-page table shows its result count without inert Previous/Next controls.
- A multi-page table shows compact, accessible controls with clear enabled and disabled states.
- The admin preview inherits the change from the shared Storybook component.
- Component build, Storybook build, and repository gate pass on a clean tree.

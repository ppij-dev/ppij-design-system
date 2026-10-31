# Add a review timeline and searchable unit selectors

## Why

The verification preview lacks dated timeline milestones, uses an ambiguous takeover label, and gives waiting submissions the same completed icon. Unit pickers are difficult to scan as the organization grows.

## Scope

Refine the admin preview with a dated timeline that initially shows three milestones, longer synthetic histories, searchable komsat/korda selection in the shell and verification actions, and a searchable multi-select komsat filter. Add one useful review filter for ownership while keeping tab state as the status filter.

## Acceptance

- Takeover uses “Ambil alih pemeriksaan”.
- Waiting submissions have a clock and warm waiting treatment; completed submissions remain distinct.
- Review history has a vertical line, dates, three visible milestones, and a show-more control.
- All komsat/korda selectors in the preview can be searched; verification komsat filtering supports multiple selections.
- The new ownership filter works across queue tabs and updates counts.
- Typecheck, preview build, and clean-tree repository gate pass without browser use.

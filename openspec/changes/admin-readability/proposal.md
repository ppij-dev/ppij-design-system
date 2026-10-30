# Improve admin preview readability

## Why

The admin dashboard's success badge appears with muted text against a green background. Several preview labels, table cells, and captions are also undersized at desktop and phone viewports.

## Scope

Correct the dashboard badge color override in the admin preview. Increase small admin typography by roughly two CSS pixels while keeping the established PPIJ type hierarchy and Storybook components. Check dense tables, navigation, cards, and phone layouts for overflow.

## Acceptance

- Status badges retain the Storybook token foreground and readable contrast.
- Small admin text is visibly larger without clipping controls or obscuring data.
- Phone, tablet, and desktop layouts remain usable with no horizontal page overflow.
- The preview builds and the repository gate passes on a clean tree.

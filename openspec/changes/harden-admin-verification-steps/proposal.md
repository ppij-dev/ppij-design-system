# Harden admin verification steps

## Why

The verification preview can keep a review drawer open after the workspace changes to a scope where that submission is unavailable. This makes the displayed record and available decision controls inconsistent with the active workspace.

## Scope

Keep the existing synthetic review workflow. Close an out-of-scope review when the workspace changes, cancel any pending local save, and make the transition clear in the preview.

## Acceptance

- Changing scope never leaves a review open for a submission outside that scope.
- A pending local decision cannot complete after its review becomes unavailable.
- The verification preview builds and the repository gate passes on a clean tree.

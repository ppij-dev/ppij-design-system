# Align the verification preview with the live admin flow

## Why

The admin preview currently compresses verification into an Antrean/Riwayat split and a short generic drawer. The live identity portal has five queue states, filtered submissions, ownership and handoff states, a wizard-aligned review, document viewing, feedback history, and distinct decisions. Reviewers cannot assess those flows in the preview yet.

## Scope

Refine only the `redesign-adminv1` verification area and the shared AdminDrawer surface. Use synthetic local records shaped around the registration wizard and the live review terminology. Present the queue as a desktop table and open a wide, two-column right review drawer; retain a bottom sheet on phones. Show the real student-card front/back document pattern and a clearly labelled proposed KTP PDF/image placeholder. Keep all interactions local to the preview.

## Acceptance

- Five live queue tabs and the live kind, komsat, age, and flag filters are reviewable.
- List rows open a detailed record with the wizard's field groups, student-card viewer, review history, claim state, and permitted actions for each queue state.
- Approval, request changes, rejection, forwarding, komsat assignment, and release have distinct reviewable local flows with required fields and confirmation where the live flow has it.
- The drawer is white, readable on phone/tablet/desktop, and has no horizontal overflow.
- No real member data, government-ID image, API integration, or production behavior is added.
- The prototype builds and the repository gate passes on a clean tree.

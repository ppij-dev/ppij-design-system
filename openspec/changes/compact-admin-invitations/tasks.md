# Tasks

- [x] Add shared drawer size variants and Storybook invitation/button examples.
- [x] Apply compact invitation sizing and shared management column tracks.
- [x] Compact shared management drawer contents and confirmation screens; verify the follow-up.
- [x] Update integration guides and run typecheck, builds, design scan, and repository gate.

Validation: shared component and story TypeScript checks, admin preview build, Storybook build, mechanical design scan, and `scripts/gate.sh` passed. Preview on port 5175 returns HTTP 200. Browser/visual review remains with the user per their earlier instruction.

Follow-up validation: admin typecheck, preview build, and full repository gate passed. The design scan reported only the existing Plus Jakarta Sans font, retained as the incumbent design-system typography. No browser used.

## Feedback round: tablet sizing, arrows, role drawer UX

- [x] Re-key touch sizing to phones: 44px targets and 16px inputs now apply only at max-width 600px; 601–899px tablets keep compact drawer/filters sizes. The 900px drawer breakpoint (bottom sheet below 900px) and the 899px table↔card layout switches are unchanged.
- [x] Space trailing list arrows (management list, member invite list) and center the appoint-drawer search icon.
- [x] Add local valid-until editing to the role detail drawer and record the production API gap contract in docs/admin-integration/peran.md.
- [x] Make the appoint-drawer unit picker a searchable single-select; locked text for komsat scope.
- [x] Update admin-drawer story text/classes to the 600px touch rule and re-run typecheck, preview build, story check, design scan, and gate.
- [x] Show success toasts for Tunjuk, Cabut peran, and Berlaku sampai saves via the shared onNotice/demo toast.

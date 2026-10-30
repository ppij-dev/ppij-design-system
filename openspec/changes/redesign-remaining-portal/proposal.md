# Redesign the remaining member portal preview

## Why

The `redesign-v1` prototype demonstrates active Beranda and Profil, but cannot be used to review the other member-facing routes and membership states together. The registration wizard already has its own UX and remains outside this prototype.

## Scope

Extend the local presentation prototype with verification, account, signed-out entry, access gates, invitation states, and non-active membership states. Add a language and scenario switch so the same Storybook-derived composition can be reviewed in Indonesian and English. Use sample data and local interactions only; do not add API or authentication logic.

## Acceptance

- Every added screen uses existing `ppij-design-system` components and tokens.
- The prototype lets reviewers reach each state without changing code.
- The wizard and the production portal are unchanged.
- The prototype builds, and `scripts/gate.sh` passes on a clean tree before any merge.

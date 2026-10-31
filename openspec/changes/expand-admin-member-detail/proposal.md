# Expand member detail and tune drawer text

## Why

The Anggota preview detail omits production communication and masked personal-data sections. Drawer body text also reads oversized on a narrow phone.

## Scope

Mirror the production member detail's membership, email delivery, education, and sensitive-data groups using synthetic content. Keep sensitive values masked until a local preview reveal action, and document that production reveal must stay audited. Reduce drawer body text scale without shrinking phone form inputs below usable size.

## Acceptance

- Member detail includes communication state and a distinct masked sensitive-data section with a reviewable reveal.
- No real personal data, document bytes, API calls, or unaudited production reveal is added.
- Drawer text hierarchy is readable at 428 px and the clean-tree gate passes.

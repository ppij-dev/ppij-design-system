# Refine the admin member-directory preview

## Why

The Anggota preview currently shows role and joining date, while the production directory shows member number, education, status, and validity. Its search and filters also do not follow the approved Verifikasi workspace pattern.

## Scope

Give Anggota the same white page island and SearchFilter composition as Verifikasi. Model the fields and filter categories present in `ppij-identity` with synthetic records and local interactions. Keep invitation and member detail as reviewable preview flows without API access.

## Acceptance

- The list shows production-relevant fields and works on phone, tablet, and desktop.
- Search, quick status filter, and advanced filters work on sample records with visible active filters.
- Every komsat selector is searchable.
- The preview remains synthetic and the repository gate passes.

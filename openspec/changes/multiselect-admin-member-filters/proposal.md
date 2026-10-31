# Make member filters searchable multi-select controls

## Why

The Anggota preview has free-text institution/major fields and single-value selectors. Reviewers need to browse options, select several values per category, and see checked selections. The production directory API currently accepts one scalar value per filter.

## Scope

Replace directory filter controls with searchable multi-select menus and local OR-within-category filtering. Keep one-choice destination komsat in invitation creation. Update the identity handoff to require option discovery and multi-value directory query support before this UX is integrated.

## Acceptance

- Institution, major, and every directory selector support search and checked multiple selections.
- Selected values appear in removable filter chips; clear all works.
- The guide names the production API gap and the needed contract, query, and test changes.

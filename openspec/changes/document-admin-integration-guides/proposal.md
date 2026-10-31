# Document admin redesign integration page by page

## Why

The approved admin preview spans five production pages. A single integration handoff would hide page-specific behavior and become difficult for the identity implementation agent to use without losing context.

## Scope

Add one focused Markdown guide for each admin page, plus a short shared shell guide. Map the preview to existing `ppij-identity` routes and components, distinguish illustrative preview behavior from production behavior, and record UX and verification expectations.

## Acceptance

- Each of Dashboard, Verifikasi, Anggota, Admin & Peran, and Organisasi has a standalone implementation guide.
- Shared navigation and context rules live in one short shell guide, linked from every page guide.
- Guides identify production owners and preserve existing data, authorization, localization, and action behavior.

# Integrating `redesign-v1` into the PPIJ member portal

Status: implementation handoff. The design is a local presentation preview, not a deployed portal. This document describes how to move its approved visual decisions into `ppij-identity/web` while keeping the existing 1.0.6 portal behavior.

## What exists now

- Design preview: `ppij-design-system/prototypes/redesign-v1/src/`. It uses fictitious data and local view switches. Its Masuk and Daftar buttons do **not** authenticate or register anyone.
- Production app: `ppij-identity/web/src/components/portal/`, rendered from the Astro routes in `web/src/pages/`. It already contains the 1.0.6 portal migration. `PortalApp.tsx` owns session resolution, route gates, and screen selection.
- Existing design authority: `ppij-identity/design/1.0.6/guideline.md`, `agent-map.md`, `docs/portal-states.md`, and the approved OpenSpec changes. The registration wizard remains a separate flow.

The newer preview is **not** a replacement for API logic, route rules, membership status handling, or copy that comes from real data. Treat it as the visual and interaction target for the corresponding production components.

## Source-to-target map

| Preview source in `ppij-design-system` | Production owner in `ppij-identity/web` | Integration decision |
| --- | --- | --- |
| `src/views/Landing.tsx`, `landing.css`, `JapanNetwork.tsx`, `japan-outline.ts` | `src/components/portal/PortalLanding.tsx` and the signed-out variant of `AppShell.tsx` | Bring over the layout, copy, FAQ, and animated Japan map. Keep the existing auth and registration destinations. |
| `src/views/Portal.tsx` | `Beranda.tsx`, `AppShell.tsx`, `BannerCarousel.tsx`, `MemberCard.tsx` | Adapt the composition to real member, banner, card, and service data. Preserve status-specific visibility and actions. |
| `src/views/Profile.tsx` | `Profil.tsx`, `ContactEditor.tsx`, `MinatEditor.tsx` | Reuse grouped read-first panels, but keep the production direct-save and reviewed-change rules. |
| `src/views/Remaining.tsx`: `VerificationView`, `AccountView` | `Verifikasi.tsx`, `Akun.tsx` | Apply presentation only. Preserve review history, contact/privacy actions, and their real data sources. |
| `src/views/Remaining.tsx`: `GateView`, `ErrorView`, `InvitationView` | `PortalGate.tsx`, `ErrorPanel.tsx`, `src/components/invitation/InvitationLanding.tsx` | Match the state treatments while retaining existing retry, resend, invitation, and access behavior. |
| `src/App.tsx` preview controls | No production target | Do not migrate the scenario picker or sample-data controls. |

Paths in the first column are relative to `prototypes/redesign-v1/`; paths in the second are relative to `web/src/components/portal/` unless a longer path is shown.

## Implementation order

1. **Open an identity-repo change.** Add a scoped OpenSpec delta under `ppij-identity/openspec/changes/` referencing this handoff and the approved 1.0.6 behavior. Work on a `task/<id>-<slug>` branch in its own worktree, as required by that repository. Inventory each incumbent component before editing it. The identity checkout currently has unrelated local changes; do not overwrite them.
2. **Pin the design system.** Add `ppij-design-system` to `web/package.json` at an immutable released version or Git commit and commit the lockfile. Import presentation components from that package; do not copy its component source into `web/`. Align `web/src/styles/global.css` with `tokens.css` once, checking Tailwind v4 source scanning for classes emitted by package components. Keep the existing PPIJ fonts and semantic color aliases.
3. **Integrate the signed-out landing first.** Keep `PortalApp.tsx` as the state authority: a `401` at the root shows `PortalLanding`; an unresolved session shows the skeleton; server errors show `ErrorPanel`; signed-out deep links keep their session panel. Make the signed-out `AppShell` header and content full-bleed for the new cinematic layout, with one brand/language header only. Do not nest a second preview header inside the production shell.
4. **Wire real landing actions.** Masuk uses the existing BFF URL `${API_BASE}/auth/login?return=${encodeURIComponent(pathname)}`; Daftar links to `localeHref(locale, "/daftar")`. Remove the preview-only `onView("portal")` and registration notice. Keep policy/help links and both locale routes. Move the new Indonesian and English strings into `web/src/i18n/index.ts` rather than leaving two independent sets of production copy.
5. **Move the map as a presentational module.** The Natural Earth outline, prefecture points (including Okinawa), and ballistic flights can live beside `PortalLanding` or become a Storybook-backed design-system component. Keep the SVG accessible, pause animation offscreen or when the tab is hidden, and respect reduced motion. The route data is illustrative; never imply it reports live member movement. Check that the map and its dark veil cover the phone header and that the two-line rotating subtitle reserves its height.
6. **Migrate member pages incrementally.** Start with the shared shell and Beranda, then Profil, Verifikasi, Akun, and the gate/invitation/error surfaces. At each screen, retain the existing API hooks, mutations, access checks, card state, bilingual copy, skeletons, and recovery flows. Replace only the visual composition needed to match the preview. Do not copy mock people, mock counts, fixed banners, local status switches, or preview navigation.
7. **Leave the wizard separate.** `web/src/components/wizard/` and `/daftar` keep their approved seven-step behavior, validation, consent, uploads, and API integration. Reuse visual components where appropriate without moving the wizard into the landing screen.

## Behavior that must survive

- `PortalApp.tsx` and `page-access.ts` decide which signed-in pages and gates are reachable. The server remains authoritative for access. Active, draft, submitted, needs-changes, rejected, expired, suspended, and revoked members need their existing actions and restrictions.
- Beranda keeps banner-first placement, real banner timing, the member card's front/back/download behavior, optional-interest prompt, and national/korda/komsat service groups. Empty banners and missing komsat services retain their existing empty/hidden rules.
- Profil keeps approved values visible while a reviewed change is pending; direct edits, reviewed edits, sensitive-field masking, and save/cancel behavior follow `design/1.0.6/profile-change-policy.md`.
- Verifikasi keeps the actual decision timeline and requested-change details. Akun keeps privacy/contact actions. Email verification resend keeps its cooldown and failure feedback.
- Every state remains localized in Indonesian and English. A visual preview does not authorize new claims, new API calls, or removal of an existing feature.

## Verification and handoff

1. Do a fast syntax/type check before slow commands. Run the focused web checks for each changed slice. For tests needing containers, warm the shared stack once with `make test-warm`; never stop it mid-session. Workers do not run the full suite, E2E, or image builds.
2. For UI work, use the locked `make e2e-run SPECS=...` path with focused specs. Existing coverage includes `e2e/tests/portal-entry-navigation.spec.ts` (PORT106-01..03), `portal-access.spec.ts`, `portal-home.spec.ts`, `profile.spec.ts`, `member-card.spec.ts`, `loading.spec.ts`, and invitation specs. Update assertions when visual structure changes; preserve their behavior checks.
3. Review 320 px phone, standard phone, tablet, and desktop layouts in both locales. Inspect the landing at 401, loading, and server-error states to confirm it neither flashes nor appears for the wrong condition. Check map centering, safe areas, focus order, keyboard access, and reduced motion. WebKit/physical iPhone verification is still a separate release check.
4. The parent/verifier runs `scripts/gate.sh` serially on a clean tree. Do not use GitHub Actions as a test runner. Record exactly which browser engines and devices were checked.

The production migration is complete only when every mapped route preserves its real behavior and the owner has reviewed the result in the production app preview. Passing the design-system prototype gate alone does not complete that migration.

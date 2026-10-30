# Redesign the admin preview

## Why

The member portal has a reviewable redesign prototype, while the five admin areas still lack one coherent preview. Administrators need to assess the navigation, information hierarchy, and phone workflow before production integration.

## Scope

Create a separate `prototypes/redesign-adminv1` Vite preview. Cover Dashboard, Verifikasi, Anggota, Admin & Peran, and Organisasi using Storybook components and canonical tokens. Include national, korda, and komsat contexts; keep navigation responsive and make sample interactions reviewable. Data is clearly illustrative and local to the preview. Preserve the registration and production application behavior.

## Acceptance

- Each of the five admin areas and its main states is reachable without code changes.
- National, korda, and komsat context changes the relevant content and permitted navigation.
- Phone, tablet, and desktop layouts are usable, with no horizontal page overflow.
- The new preview imports `ppij-design-system` components rather than copying them.
- The preview builds and the repository gate passes on a clean tree.

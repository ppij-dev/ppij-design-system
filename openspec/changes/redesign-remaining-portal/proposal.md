# Redesign the remaining member portal preview

## Why

The `redesign-v1` prototype demonstrates active Beranda and Profil, but cannot be used to review the other member-facing routes and membership states together. The registration wizard already has its own UX and remains outside this prototype.

## Scope

Extend the local presentation prototype with verification, account, signed-out entry, access gates, invitation states, and non-active membership states. Add a language and scenario switch so the same Storybook-derived composition can be reviewed in Indonesian and English. Use sample data and local interactions only; do not add API or authentication logic.

The signed-out entry is a dedicated landing composition: PPI Jepang Portal branding, the motto “Membuka Dunia untuk Indonesia dan Membuka Indonesia untuk Dunia”, a white relief map of Japan with animated red city connections, Masuk and Daftar actions, and a rotating “Bersama” line with Peluang, Maju, and Tumbuh. Keep the registration wizard separate.

Map motion uses randomly selected prefecture-to-prefecture ballistic arcs. Points and names are absent at rest. The origin appears at launch and fades during travel; the destination appears with a brief pulse on arrival. Reduced-motion and offscreen states keep the map still.

Refine the arc to follow the supplied canvas reference: red circular markers and a tapered particle tail. The introductory line rotates five ways to complete “Dari Jepang, pelajar Indonesia saling …”. Remove the map caption and bottom motto. The lower section explains the single account across national, korda, and komsat services and includes a short FAQ.

Increase launch frequency to roughly two flights per second, with up to four in progress. Keep the moving ballistic light and particle tail; remove the static trajectory line. Remove the "Cara bergabung" steps from the landing page.

Show a red line following each projectile as part of its tail. The route ahead of the projectile remains hidden.

Extend the revealed trail from the source to the projectile and render it as a translucent red line with a soft glow. No line appears ahead of the moving light.

On phones, place the Japan map behind the hero headline, rotating subtitle, and actions with a dark readability veil. Reserve two lines for the subtitle at every rotation so the actions do not shift.

The mobile veil also covers the header. Center the map consistently across compact and tall phones; verify 320, 375, 393, and 430 pixel viewports without horizontal overflow.

On taller phones, center the hero content vertically and size the map from both viewport width and height so the lower screen remains part of the composition. On tablets, the hero fills the viewport before the next section begins. Include Okinawa as a prefecture endpoint and send a flight from it periodically.

## Acceptance

- Every added screen uses existing `ppij-design-system` components and tokens.
- The prototype lets reviewers reach each state without changing code.
- The wizard and the production portal are unchanged.
- The prototype builds, and `scripts/gate.sh` passes on a clean tree before any merge.

# Admin redesign v1 preview

Run `npm run dev -w ppij-redesign-adminv1 -- --host 127.0.0.1 --port 5174` from the repository root. The preview is a separate UI concept; it does not connect to the membership API, Keycloak, or production admin routes.

The sidebar or phone bottom bar reaches Dashboard, Verifikasi, Anggota, Admin & Peran, and Organisasi. The workspace selector switches between national, Korda Kanto, and Komsat Tokyo; Organisasi is omitted at komsat scope. Review queues, directories, unit cards, and detail drawers use synthetic names and numbers. Actions change only the preview's local state and reset on reload.

Verifikasi follows the five queue tabs in `ppij-identity`: Baru, Dikirim ulang, Sedang diperiksa, Menunggu anggota, and Selesai. Desktop uses a table in a white workspace and a wide right review panel; smaller screens use a list and bottom sheet. Review details follow the registration wizard's field groups, with the current student-card front/back pattern, feedback history, claim takeover, and distinct decision forms. The preview also simulates loading and saving, with a local failure switch in the action screen. KTP is not part of the registration or review preview.

The implementation imports Storybook components from `ppij-design-system`: `PageHeader`, `StatCard`, `DataTable`, `Table`, `Badge`, `Button`, `UnitCard`, `BottomBar`, `AdminDrawer`, and form inputs. Local CSS handles the composition and responsive layout; no library component is copied into the prototype.

Production integration should map each preview screen to its existing admin route and retain server-side authorization, real data loaders, audit logging, encrypted field reveal, and action validation in `ppij-identity`. Replace each local sample dataset and demo callback with the corresponding production state and handler; the confirmation step and responsive navigation can be adapted without moving business logic into this package.

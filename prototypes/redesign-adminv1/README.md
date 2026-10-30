# Admin redesign v1 preview

Run `npm run dev -w ppij-redesign-adminv1 -- --host 127.0.0.1 --port 5174` from the repository root. The preview is a separate UI concept; it does not connect to the membership API, Keycloak, or production admin routes.

The sidebar or phone bottom bar reaches Dashboard, Verifikasi, Anggota, Admin & Peran, and Organisasi. The workspace selector switches between national, Korda Kanto, and Komsat Tokyo; Organisasi is omitted at komsat scope. Review queues, directories, unit cards, and detail drawers use synthetic names and numbers. Actions show their confirmation layout and an explicit non-persistence message.

The implementation imports Storybook components from `ppij-design-system`: `PageHeader`, `StatCard`, `DataTable`, `Table`, `Badge`, `Button`, `UnitCard`, `BottomBar`, `AdminDrawer`, and form inputs. Local CSS handles the composition and responsive layout; no library component is copied into the prototype.

Production integration should map each preview screen to its existing admin route and retain server-side authorization, real data loaders, audit logging, encrypted field reveal, and action validation in `ppij-identity`. Replace each local sample dataset and demo callback with the corresponding production state and handler; the confirmation step and responsive navigation can be adapted without moving business logic into this package.

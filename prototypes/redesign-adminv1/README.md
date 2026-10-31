# Admin redesign v1 preview

Run `npm run dev -w ppij-redesign-adminv1 -- --host 127.0.0.1 --port 5174` from the repository root. The preview is a separate UI concept; it does not connect to the membership API, Keycloak, or production admin routes.

The sidebar or phone bottom bar reaches Dashboard, Verifikasi, Anggota, Admin & Peran, and Organisasi. The workspace selector switches between national, Korda Kanto, and Komsat Tokyo; Organisasi is omitted at komsat scope. Review queues, directories, unit cards, and detail drawers use synthetic names and numbers. Actions change only the preview's local state and reset on reload.

The desktop sidebar can collapse to icons and expand again. The footer displays the preview and design-system package versions. Verification search and filters apply across all five queue tabs, updating each tab count; komsat, age, and flag controls are in the advanced filter drawer. Review feedback notes use a multiline field, and successful local actions appear in a green status toast.

Verifikasi follows the five queue tabs in `ppij-identity`: Baru, Dikirim ulang, Sedang diperiksa, Menunggu anggota, and Selesai. Desktop uses a table in a white workspace and a wide right review panel; smaller screens use a list and bottom sheet. Review details follow the registration wizard's field groups, with the current student-card front/back pattern, feedback history, claim takeover, and distinct decision forms. The preview also simulates loading and saving, with a local failure switch in the action screen. KTP is not part of the registration or review preview.

Long review-history notes start at three lines and can be expanded or collapsed. The phone search bar uses a short name/ID prompt, with kind and advanced filters aligned on the next row.

The review timeline shows the three latest dated milestones first and can reveal earlier events. Komsat filtering supports searched, multiple selections; the target-komsat action and the shell's korda/komsat workspace selector are searchable. Ownership is an additional advanced filter. Waiting records use a clock status, and claim takeover is labeled explicitly.

At tablet widths, the verification quick filters use equal-height controls without a separate kind caption. The student-card viewer includes a nearby summary of the submitted name, education level, institution/faculty, and month/year residence range for document comparison.

Anggota now uses the same white workspace island and search/advanced-filter pattern. Its synthetic directory mirrors the production list fields: name/email, member number, komsat, education, status, and validity date. The advanced drawer models the production directory's komsat, institution, degree, major, scholarship, source, activation, and expiry filters; komsat selection is searchable. The member detail remains a safe sample and explains that sensitive fields require the production audited reveal flow.

The Anggota island also has a separate Status undangan view and a local invitation flow with single or multiple recipients, searchable komsat assignment, a vouched option, review, and result. Its invitation list and resend/cancel actions are synthetic and send no email. Directory advanced filters use a consistent full-width form on phones.

Directory filters now use searchable multiple-selection menus with checkmarks. Selections are combined within each category and shown as removable chips. The current identity directory API is scalar per filter; the page-specific integration guide records the API and option-discovery work needed for production parity.

Invitation detail shows a dated vertical history with email delivery state. The synthetic invite form has a consistent phone text scale, and admin bottom sheets use a compact handle and title spacing.

The implementation imports Storybook components from `ppij-design-system`: `PageHeader`, `StatCard`, `DataTable`, `Table`, `Badge`, `Button`, `UnitCard`, `BottomBar`, `AdminDrawer`, and form inputs. Local CSS handles the composition and responsive layout; no library component is copied into the prototype.

Production integration should map each preview screen to its existing admin route and retain server-side authorization, real data loaders, audit logging, encrypted field reveal, and action validation in `ppij-identity`. Replace each local sample dataset and demo callback with the corresponding production state and handler; the confirmation step and responsive navigation can be adapted without moving business logic into this package.

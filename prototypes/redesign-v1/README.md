# Member portal redesign v1 preview

Run `npm run dev -w ppij-redesign-v1 -- --host 127.0.0.1 --port 5175` from the repository root (the admin
preview uses 5174). The preview is a separate UI concept; it does not connect to the membership API, Keycloak,
or production portal routes, and every name and number in it is synthetic.

The screens are Beranda, Profil, Verifikasi, Akun, Masuk, Akses, Undangan, and Galat. The switcher at the
bottom right walks the membership states (draft, submitted, needs changes, expiring, change pending, grace,
expired, suspended, revoked), the gate states, the invitation states, and the error states. Actions change only
the preview's local state and reset on reload.

Profil follows `add-member-profile-registration-data` and `add-member-category` (owner decisions of 2026-11-01
and 2026-11-05):

- **Data diri** and **Pendidikan** are read-only. Reviewed fields (full name, birth date, komsat, institution,
  degree level, expected graduation) have no member write path, so there is no "Ajukan perubahan" anywhere.
  Instead each panel shows the note "Untuk mengubah data ini, hubungi admin:" and lists the member's active
  admins in three groups — **Admin Komsat**, **Admin Korda** and **Admin Nasional** — as names only, each a
  `mailto:` link with the subject "Perubahan data profil – <nomor anggota>". A Non-Komsat member sees only Korda
  and Nasional, and an empty group shows "Belum ada admin aktif".
- **Kontak**, **Domisili di Jepang**, **Pendanaan**, **Minat**, and **Izin tinggal dan kontak darurat** save
  directly, one editor at a time in the `AdminDrawer` (right drawer from 900 px, bottom sheet below). Domisili
  keeps the postcode lookup assist; the postcode itself is never stored, and a komsat move goes through the
  admin instead of a member request. Pendanaan keeps the dated history of earlier choices.
- Birth date, phone, residence-status expiry and the emergency contact arrive masked, and each hidden row has
  its own **Tampilkan** control that stands for the audited self reveal (`POST /v1/me/profile/reveal`): the row
  says the value was opened through an audited action and hides itself again after 60 seconds.
- The Kontak and Izin editors prefill their hidden fields from an audited reveal when they open and drop those
  values when they close. If that reveal fails or is rate-limited, the fields stay empty with "Kosongkan jika
  tidak berubah" while the other fields still save. The preview has two switches at the bottom of Profil that
  stand in for the API: "Simulasikan gagal membuka data sensitif" and "Tampilkan sebagai anggota Non-Komsat".
- Profil shows the AD/ART **Jenis keanggotaan** row after the member number, with the full label ("Anggota Luar
  Biasa (Postdoc)") and one line on what it means for Pemira. Beranda's member card carries the line "Anggota
  Luar Biasa" under the member number for Luar Biasa members only; a Biasa member passes no line.

The member-card line lives in `ppij-design-system` (`MemberCardBlock.categoryLine`, story `ActiveLuarBiasa`)
because the card, its themes and its PNG download are the design system's, not the prototype's.

Production integration should map Profil to its existing route and keep the real loaders, the audited reveal
endpoint, the funding and residence endpoints, and the admin-contacts endpoint in `ppij-identity`. Replace the
local sample data and the preview switches with the corresponding production state and handlers.

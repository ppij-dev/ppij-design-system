import * as React from "react";
import { IconCheck, IconEye, IconEyeOff, IconHistory, IconHome, IconIdBadge2, IconShieldLock } from "@tabler/icons-react";
import { AdminDrawer, Badge, Button, Card, EditablePanel, FundingPicker, Input, Label, MonthPicker, PageHeader, PhoneField, PillRadio, PortalShell, PostcodeField, Spinner, TagInput, Textarea, TypeAhead } from "ppij-design-system";
import logoUrl from "../../../../brand/ppij-logo.png";
import { pick, type Locale, type View } from "./Remaining";

/**
 * The member Profil, aligned with add-member-profile-registration-data and
 * add-member-category (owner decision 2026-11-05):
 *
 * - Data diri and Pendidikan are read-only. Reviewed fields (full name, birth
 *   date, komsat, institution, degree level, expected graduation) have no
 *   member write path: instead of "Ajukan perubahan" the panel shows the admin
 *   contact note ("Untuk mengubah data ini, hubungi admin:") with the member's
 *   active Admin Komsat, Admin Korda and Admin Nasional as mailto links.
 * - Kontak, Domisili di Jepang, Pendanaan, Minat and Izin tinggal dan kontak
 *   darurat save directly, one editor at a time in the AdminDrawer.
 * - Birth date, phone, residence-status expiry and the emergency contact arrive
 *   masked. Every hidden row has its own Tampilkan, which stands for the
 *   audited reveal (POST /v1/me/profile/reveal): one audit entry per call, and
 *   the value hides itself again after 60 seconds.
 * - The Kontak and Izin editors prefill their hidden fields from an audited
 *   reveal when they open and drop those values when they close; a failed or
 *   rate-limited open keeps them empty ("Kosongkan jika tidak berubah") while
 *   the other fields still save.
 * - Profil shows the AD/ART member category (Jenis keanggotaan) and what it
 *   means; the member card carries "Anggota Luar Biasa" for Luar Biasa members
 *   only. The student-card photo is never shown.
 */

type PanelKey = "identity" | "contact" | "residence" | "education" | "funding" | "interests" | "permit";
type Category = "BIASA" | "LUAR_BIASA";
type Subtype = "postdoc" | "researcher" | "short_study" | null;
type RevealField = "birthDate" | "phone" | "residenceExpiry" | "emergency";

interface ProfileData {
  fullName: string; birthDate: string; gender: string; originProvince: string; komsat: string; korda: string;
  nickname: string; phone: string; lineId: string;
  postcode: string; prefecture: string; city: string;
  institution: string; faculty: string; degree: string; studyProgram: string; entryMonth: string; expectedGraduation: string; lab: string; studentNumber: string;
  funding: string[]; interests: string[];
  residenceStatus: string; residenceExpiry: string;
  emergencyName: string; emergencyRelationship: string; emergencyPhone: string; emergencyAddress: string;
  category: Category; subtype: Subtype;
}

const MEMBER_NUMBER = "PPIJ-2026-000123";

const INITIAL: ProfileData = {
  fullName: "I Nyoman Darma Kotama", birthDate: "1992-09-02", gender: "Laki-laki", originProvince: "Bali", komsat: "Okayama", korda: "PPI Kansai",
  nickname: "Darma", phone: "+81 90-1234-5678", lineId: "darmakotama",
  postcode: "700-0001", prefecture: "Okayama", city: "Kita-ku, Kota Okayama",
  institution: "Okayama University", faculty: "Graduate School of Science and Technology", degree: "s2", studyProgram: "Computer Science", entryMonth: "2025-04", expectedGraduation: "2027-03", lab: "Laboratorium Sistem Informasi", studentNumber: "76123456",
  funding: ["Beasiswa MEXT"], interests: ["Fotografi", "Riset kecerdasan buatan", "Bahasa Jepang"],
  residenceStatus: "Student", residenceExpiry: "2027-03-31",
  emergencyName: "Ni Made Rai", emergencyRelationship: "Ibu", emergencyPhone: "+62 812-3456-7890", emergencyAddress: "Denpasar, Bali",
  category: "LUAR_BIASA", subtype: "postdoc",
};

const DEGREE_LABELS: Record<string, string> = { d3: "D3 / Diploma", s1: "S1 / Sarjana", s2: "S2 / Magister", s3: "S3 / Doktor", postdoc: "Pascadoktoral", researcher: "Peneliti di lembaga riset" };
const KOMSAT_OPTIONS = ["Okayama", "Shinjuku", "Sendai", "Kyoto", "Fukuoka", "Sapporo"];
const PREFECTURES = ["Okayama", "Hiroshima", "Kagawa", "Tokyo", "Osaka"];
const CITIES: Record<string, string[]> = {
  Okayama: ["Kita-ku, Kota Okayama", "Kurashiki", "Tsuyama"],
  Hiroshima: ["Naka-ku, Kota Hiroshima", "Fukuyama"],
  Kagawa: ["Takamatsu"],
  Tokyo: ["Shinjuku", "Setagaya"],
  Osaka: ["Kita-ku, Kota Osaka", "Sakai"],
};
const INSTITUTIONS = ["Okayama University", "Kyoto University", "Tokyo Institute of Technology", "Hiroshima University"];
const SUBTYPE_LABELS: Record<Exclude<Subtype, null>, string> = { postdoc: "Postdoc", researcher: "Peneliti", short_study: "Studi singkat" };

/** One module, one wording per place (MPR category labels): Profil spells the subtype out. */
function categoryLabel(category: Category, subtype: Subtype, locale: Locale, variant: "profil" | "card"): string | null {
  const en = locale === "en";
  if (variant === "card") return category === "LUAR_BIASA" ? "Anggota Luar Biasa" : null;
  if (category === "BIASA") return en ? "Regular member (Anggota Biasa)" : "Anggota Biasa";
  return `${en ? "Associate member (Anggota Luar Biasa)" : "Anggota Luar Biasa"} (${subtype ? SUBTYPE_LABELS[subtype] : en ? "Not set" : "Belum diisi"})`;
}

const CATEGORY_MEANING = {
  id: "Hanya Anggota Biasa yang dapat memilih dan dipilih pada Pemira (ART Bab II Pasal 3).",
  en: "Only regular members may vote and stand in Pemira (ART Chapter II Article 3).",
};

/** Synthetic live admins per level (GET /v1/me/admin-contacts). Names only, each a mailto link. */
type AdminContact = { name: string; email: string };
const ADMIN_CONTACTS: Record<"komsat" | "korda" | "national", AdminContact[]> = {
  komsat: [{ name: "Contoh Pengurus C", email: "admin-komsat@example.invalid" }, { name: "Contoh Pengurus D", email: "admin-komsat-2@example.invalid" }],
  korda: [{ name: "Contoh Pengurus B", email: "admin-korda@example.invalid" }],
  national: [{ name: "Contoh Pengurus A", email: "admin-nasional@example.invalid" }, { name: "Contoh Pengurus E", email: "admin-nasional-2@example.invalid" }],
};

function formatDateID(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? iso : new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(d);
}
function formatMonthID(ym: string): string {
  const d = new Date(`${ym}-01T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? ym : new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric", timeZone: "UTC" }).format(d);
}

function Rows({ items }: { items: Array<[string, React.ReactNode]> }) {
  return (
    <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
      {items.map(([label, value]) => (
        <div key={label} className="grid gap-0.5">
          <dt className="text-sm text-brand-muted">{label}</dt>
          <dd className="font-medium text-brand-ink">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function Chips({ values }: { values: string[] }) {
  return (
    <span className="flex flex-wrap gap-1.5">
      {values.map((v) => (
        <span key={v} className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-brand-ink">{v}</span>
      ))}
    </span>
  );
}

function Masked() {
  return <span className="tracking-[0.16em]" aria-label="Nilai tersembunyi, terbuka lewat Tampilkan">{"\u2022".repeat(10)}</span>;
}

function F({ label, children, span }: { label: string; children: React.ReactNode; span?: boolean }) {
  return (
    <div className={span ? "grid gap-1.5 sm:col-span-2" : "grid gap-1.5"}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function RailFact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-0.5">
      <dt className="text-xs text-brand-muted">{label}</dt>
      <dd className="font-semibold text-brand-ink">{children}</dd>
    </div>
  );
}

/** Owner decision 6: a revealed value hides itself after 60 seconds (design D3). */
const REVEAL_AUTO_HIDE_MS = 60_000;

type RevealState = {
  open: RevealField[];
  busy: boolean;
  failed: boolean;
  show: (fields: RevealField[], options?: { autoHide?: boolean }) => void;
  hide: () => void;
  hold: () => void;
};

/**
 * Audited self-reveal stand-in for POST /v1/me/profile/reveal: clear values live in component
 * state only, hide again after 60 seconds, and drop on hide and on leaving the page. The preview
 * switch stands in for a failed or rate-limited call.
 */
function useReveal(fail: boolean): RevealState {
  const [open, setOpen] = React.useState<RevealField[]>([]);
  const [busy, setBusy] = React.useState(false);
  const [failed, setFailed] = React.useState(false);
  const timer = React.useRef<number | null>(null);
  const stop = React.useCallback(() => { if (timer.current !== null) { window.clearTimeout(timer.current); timer.current = null; } }, []);
  React.useEffect(() => stop, [stop]);
  const hide = React.useCallback(() => { stop(); setOpen([]); setFailed(false); }, [stop]);
  const show = React.useCallback((fields: RevealField[], options?: { autoHide?: boolean }) => {
    setBusy(true); setFailed(false);
    window.setTimeout(() => {
      setBusy(false);
      if (fail) { setOpen([]); setFailed(true); return; }
      stop();
      setOpen((current) => [...new Set([...current, ...fields])]);
      if (options?.autoHide !== false) timer.current = window.setTimeout(hide, REVEAL_AUTO_HIDE_MS);
    }, 600);
  }, [fail, hide, stop]);
  return { open, busy, failed, show, hide, hold: stop };
}

/**
 * One masked read row with its own Tampilkan / Sembunyikan, the audit note under the value and the
 * inline failure message. The sizing bands follow the panel scope (44px under 600px, 32px from
 * 600px up).
 */
function RevealValue({ field, masked, clearText, reveal, locale }: { field: RevealField; masked: React.ReactNode; clearText: string; reveal: RevealState; locale: Locale }) {
  const shown = reveal.open.includes(field);
  const failedHere = reveal.failed && reveal.open.length === 0 && reveal.busy === false;
  return (
    <span className="grid gap-1">
      <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="min-w-0 font-medium text-brand-ink [overflow-wrap:anywhere]">{shown ? clearText : masked}</span>
        {shown ? (
          <Button type="button" variant="ghost" size="sm" onClick={reveal.hide} data-testid={`reveal-${field}-hide`}>
            <IconEyeOff aria-hidden="true" />
            {pick(locale, "Sembunyikan", "Hide")}
          </Button>
        ) : (
          <Button type="button" variant="ghost" size="sm" aria-busy={reveal.busy} onClick={() => reveal.show([field])} data-testid={`reveal-${field}`}>
            {reveal.busy ? <Spinner aria-hidden="true" /> : <IconEye aria-hidden="true" />}
            {pick(locale, "Tampilkan", "Show")}
          </Button>
        )}
      </span>
      {shown ? (
        <span className="text-xs text-brand-muted">{pick(locale, "Terbuka lewat aksi tercatat audit; tersembunyi lagi otomatis setelah 60 detik.", "Opened through an audited action; hidden again automatically after 60 seconds.")}</span>
      ) : null}
      {failedHere ? (
        <span role="alert" className="text-xs font-medium text-brand-red">{pick(locale, "Data sensitif belum bisa dibuka. Coba lagi sebentar lagi.", "The sensitive value could not be opened. Try again shortly.")}</span>
      ) : null}
    </span>
  );
}

/** "Perubahan data profil – <nomor anggota>", URL-encoded for the mailto query (MPR-65). */
function adminContactMailto(contact: AdminContact): string {
  const subject = `Perubahan data profil – ${MEMBER_NUMBER}`;
  return `mailto:${contact.email}?subject=${encodeURIComponent(subject)}`;
}

function ContactGroup({ label, members, locale }: { label: string; members: AdminContact[]; locale: Locale }) {
  return (
    <div className="grid gap-0.5" data-testid="admin-contact-group">
      <span className="text-sm text-brand-muted">{label}</span>
      {members.length === 0 ? (
        <span className="text-sm text-brand-muted" data-testid="admin-contact-empty">{pick(locale, "Belum ada admin aktif", "No active admin yet")}</span>
      ) : (
        <span className="grid gap-1">
          {members.map((contact) => (
            <a key={contact.email} className="min-w-0 font-medium text-brand-red underline underline-offset-2 [overflow-wrap:anywhere]" data-testid="admin-contact-link" href={adminContactMailto(contact)}>{contact.name}</a>
          ))}
        </span>
      )}
    </div>
  );
}

/** The admin contact note on the reviewed-field panels (Data diri, Pendidikan; design D4). */
function AdminContactNote({ locale, hasKomsat }: { locale: Locale; hasKomsat: boolean }) {
  const groups = [
    ...(hasKomsat ? [{ key: "komsat" as const, label: pick(locale, "Admin Komsat", "Komsat admin"), members: ADMIN_CONTACTS.komsat }] : []),
    { key: "korda" as const, label: pick(locale, "Admin Korda", "Korda admin"), members: hasKomsat ? ADMIN_CONTACTS.korda : [] },
    { key: "national" as const, label: pick(locale, "Admin Nasional", "National admin"), members: ADMIN_CONTACTS.national },
  ];
  return (
    <div className="grid gap-3 border-t border-brand-border pt-4" data-testid="admin-contact-note">
      <p className="text-sm font-medium text-brand-ink">{pick(locale, "Untuk mengubah data ini, hubungi admin:", "To change this data, contact an admin:")}</p>
      <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
        {groups.map((group) => <ContactGroup key={group.key} label={group.label} members={group.members} locale={locale} />)}
      </div>
    </div>
  );
}

/** Read-first panel without an Edit action: reviewed fields have no member write path. */
function ReadPanel({ title, description, note, children }: { title: string; description: string; note?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section aria-label={title} className="min-w-0 [&_button]:min-h-11 min-[600px]:[&_button]:h-8 min-[600px]:[&_button]:min-h-8">
      <Card className="gap-0 rounded-xl border border-brand-border bg-card py-0">
        <div className="grid gap-1.5 px-5 pt-5 pb-4">
          <h2 className="text-base leading-6 font-bold text-brand-ink">{title}</h2>
          <p className="text-sm leading-5 text-brand-muted">{description}</p>
        </div>
        <div className="grid gap-4 px-5 pb-5">{children}{note}</div>
      </Card>
    </section>
  );
}

const PANEL_META: Record<PanelKey, { title: Record<Locale, string>; description: Record<Locale, string>; reviewed: boolean }> = {
  identity: { title: { id: "Data diri", en: "Personal data" }, description: { id: "Dibaca saja. Nama, tanggal lahir dan komsat ditinjau pengurus.", en: "Read-only. Your name, birth date and komsat are reviewed by the committee." }, reviewed: true },
  contact: { title: { id: "Kontak", en: "Contact" }, description: { id: "Nama panggilan, telepon dan LINE diperbarui langsung. Nomor telepon hanya terbuka lewat aksi Tampilkan yang tercatat audit.", en: "Nickname, phone and LINE update directly. The phone number only opens through an audited Show action." }, reviewed: false },
  residence: { title: { id: "Domisili di Jepang", en: "Residence in Japan" }, description: { id: "Prefektur dan kota diperbarui langsung; pencarian kode pos mengisi keduanya. Kode pos tidak disimpan.", en: "Prefecture and city update directly; the postcode lookup fills both. The postcode is never stored." }, reviewed: false },
  education: { title: { id: "Pendidikan", en: "Education" }, description: { id: "Dibaca saja. Institusi, jenjang dan perkiraan lulus ditinjau pengurus.", en: "Read-only. Institution, degree level and expected graduation are reviewed by the committee." }, reviewed: true },
  funding: { title: { id: "Pendanaan", en: "Funding" }, description: { id: "Pendanaan diperbarui langsung. Pilihan sebelumnya tetap tercatat dengan tanggalnya.", en: "Funding updates directly. Earlier choices stay on record with their dates." }, reviewed: false },
  interests: { title: { id: "Minat", en: "Interests" }, description: { id: "Minat diperbarui langsung.", en: "Interests update directly." }, reviewed: false },
  permit: { title: { id: "Izin tinggal dan kontak darurat", en: "Residence permit and emergency contact" }, description: { id: "Status dan tanggal izin tinggal serta kontak darurat tersimpan terenkripsi dan diperbarui langsung.", en: "Residence-status type and dates and the emergency contact are encrypted and update directly." }, reviewed: false },
};

function ProfileContent({ locale }: { locale: Locale }) {
  const [profile, setProfile] = React.useState<ProfileData>(INITIAL);
  const [draft, setDraft] = React.useState<ProfileData>(INITIAL);
  const [editing, setEditing] = React.useState<PanelKey | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [savedMsg, setSavedMsg] = React.useState<string | null>(null);
  const [fundingHistory, setFundingHistory] = React.useState<Array<{ values: string[]; changedOn: string }>>([{ values: ["Dukungan keluarga"], changedOn: "1 April 2026" }]);
  const [postcodeStatus, setPostcodeStatus] = React.useState<string | undefined>(undefined);
  const [postcodeCandidates, setPostcodeCandidates] = React.useState<Array<{ label: string; onSelect: () => void }>>([]);
  /* Preview switches: they stand in for the API's answers until integration. */
  const [failReveal, setFailReveal] = React.useState(false);
  const [nonKomsat, setNonKomsat] = React.useState(false);
  const reveal = useReveal(failReveal);

  const history = [
    { status: "Aktif", reason: "Kartu anggota diterbitkan", date: "6 Okt 2026" },
    { status: "Belum lengkap", reason: "Pendaftaran diterima", date: "1 Okt 2026" },
  ];

  const openEditor = (key: PanelKey) => {
    setSavedMsg(null);
    setPostcodeStatus(undefined);
    setPostcodeCandidates([]);
    setDraft({ ...profile });
    /* Kontak and Izin open with an audited reveal that prefills their hidden fields (task 7.3c). */
    if (key === "contact") { reveal.hide(); reveal.show(["phone"], { autoHide: false }); reveal.hold(); }
    else if (key === "permit") { reveal.hide(); reveal.show(["residenceExpiry", "emergency"], { autoHide: false }); reveal.hold(); }
    setEditing(key);
  };

  const closeEditor = () => {
    /* Closed editor: the values revealed for its prefill are dropped. */
    reveal.hide();
    setEditing(null);
  };

  const submit = () => {
    if (!editing) return;
    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      if (editing === "funding" && JSON.stringify(draft.funding) !== JSON.stringify(profile.funding)) {
        setFundingHistory((h) => [{ values: profile.funding, changedOn: formatDateID(new Date().toISOString().slice(0, 10)) }, ...h]);
      }
      setProfile({ ...draft, phone: draft.phone || profile.phone, residenceExpiry: draft.residenceExpiry, emergencyPhone: draft.emergencyPhone || profile.emergencyPhone });
      setSavedMsg(pick(locale, "Perubahan disimpan.", "Changes saved."));
      closeEditor();
    }, 700);
  };

  const searchPostcode = () => {
    const city = CITIES[draft.prefecture]?.[0] ?? "Kita-ku, Kota Okayama";
    setPostcodeStatus(pick(locale, `Alamat ditemukan: ${draft.prefecture}, ${city}.`, `Address found: ${draft.prefecture}, ${city}.`));
    setPostcodeCandidates([
      {
        label: `${draft.prefecture} · ${city}`,
        onSelect: () => {
          setDraft((d) => ({ ...d, city }));
          setPostcodeCandidates([]);
          setPostcodeStatus(pick(locale, `Kota diisi otomatis: ${city}.`, `City filled automatically: ${city}.`));
        },
      },
    ]);
  };

  const renderRead = (key: PanelKey): React.ReactNode => {
    switch (key) {
      case "identity":
        return <Rows items={[
          ["Nama lengkap", profile.fullName],
          ["Jenis kelamin", profile.gender],
          ["Provinsi asal", profile.originProvince],
          ["Tanggal lahir", <RevealValue key="birthDate" field="birthDate" locale={locale} reveal={reveal} masked={<Masked />} clearText={formatDateID(profile.birthDate)} />],
          ["Komsat", profile.komsat],
          ["Korda", profile.korda],
        ]} />;
      case "contact":
        return <Rows items={[
          ["Nama panggilan", profile.nickname],
          ["Nomor telepon atau WhatsApp", <RevealValue key="phone" field="phone" locale={locale} reveal={reveal} masked={<Masked />} clearText={profile.phone} />],
          ["LINE ID", profile.lineId],
        ]} />;
      case "residence":
        return <Rows items={[
          ["Prefektur", profile.prefecture],
          ["Kota atau kecamatan", profile.city],
        ]} />;
      case "education":
        return <Rows items={[
          ["Institusi", profile.institution],
          ["Fakultas atau sekolah pascasarjana", profile.faculty],
          ["Jenjang", DEGREE_LABELS[profile.degree] ?? profile.degree],
          ["Program studi", profile.studyProgram],
          ["Bulan masuk", formatMonthID(profile.entryMonth)],
          ["Perkiraan lulus", formatMonthID(profile.expectedGraduation)],
          ["Lab atau pembimbing", profile.lab],
          ["Nomor pelajar", profile.studentNumber],
        ]} />;
      case "funding":
        return (
          <div className="grid gap-4">
            <Rows items={[["Pendanaan saat ini", <Chips key="f" values={profile.funding} />]]} />
            {fundingHistory.length > 0 ? (
              <div className="grid gap-1">
                <p className="text-sm text-brand-muted">{pick(locale, "Riwayat pendanaan sebelumnya", "Earlier funding")}</p>
                {fundingHistory.map((h) => <p key={h.changedOn + h.values.join()} className="text-sm font-medium text-brand-ink">{h.values.join(", ")} · {h.changedOn}</p>)}
              </div>
            ) : null}
          </div>
        );
      case "interests":
        return <Rows items={[["Minat", <Chips key="i" values={profile.interests} />]]} />;
      case "permit":
        return (
          <Rows items={[
            ["Status izin tinggal", profile.residenceStatus],
            ["Tanggal kedaluwarsa izin tinggal", <RevealValue key="residenceExpiry" field="residenceExpiry" locale={locale} reveal={reveal} masked={<Masked />} clearText={formatDateID(profile.residenceExpiry)} />],
            ["Kontak darurat", <RevealValue key="emergency" field="emergency" locale={locale} reveal={reveal} masked={<span className="text-brand-muted">{profile.emergencyName} ({profile.emergencyRelationship}) · nomor disembunyikan</span>} clearText={`${profile.emergencyName} (${profile.emergencyRelationship}) · ${profile.emergencyPhone} · ${profile.emergencyAddress}`} />],
          ]} />
        );
    }
  };

  const renderEditor = (): React.ReactNode => {
    const set = <K extends keyof ProfileData>(k: K, v: ProfileData[K]) => setDraft((d) => ({ ...d, [k]: v }));
    const hiddenOpen = (field: RevealField) => reveal.open.includes(field);
    const hiddenHint = pick(locale, "Kosongkan jika tidak berubah. Nilai lama tetap dipakai.", "Leave empty to keep it unchanged. The current value stays.");
    switch (editing) {
      case "contact":
        return (
          <div className="grid gap-4">
            <p className="flex items-start gap-2 text-sm text-brand-muted">
              <IconShieldLock className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              {pick(locale, "Membuka nomor telepon di sini tercatat dalam audit.", "Opening the phone number here is written to the audit log.")}
            </p>
            <F label="Nama panggilan"><Input value={draft.nickname} onChange={(e) => set("nickname", e.target.value)} /></F>
            <F label="Nomor telepon atau WhatsApp">
              {hiddenOpen("phone")
                ? <PhoneField value={draft.phone} onChange={(v) => set("phone", v)} defaultCode="+81" />
                : <span className="grid gap-1.5"><Input value="" onChange={(e) => set("phone", e.target.value)} placeholder={reveal.busy ? pick(locale, "Membuka nilai...", "Opening value...") : undefined} disabled={reveal.busy} /><span className="text-xs text-brand-muted">{hiddenHint}</span></span>}
            </F>
            {reveal.failed ? <p role="alert" className="text-sm font-medium text-brand-red">{pick(locale, "Nomor telepon belum bisa dibuka, jadi kolomnya kosong. Kolom lain tetap bisa disimpan.", "The phone number could not be opened, so the field is empty. The other fields still save.")}</p> : null}
            <F label="LINE ID"><Input value={draft.lineId} onChange={(e) => set("lineId", e.target.value)} /></F>
          </div>
        );
      case "residence":
        return (
          <div className="grid gap-4">
            <F label="Kode pos">
              <PostcodeField value={draft.postcode} onChange={(v) => set("postcode", v)} onSearch={searchPostcode} statusText={postcodeStatus} candidates={postcodeCandidates} />
            </F>
            <F label="Prefektur"><TypeAhead value={draft.prefecture} onChange={(v) => set("prefecture", v)} options={PREFECTURES} placeholder="Ketik prefektur" /></F>
            <F label="Kota atau kecamatan"><TypeAhead value={draft.city} onChange={(v) => set("city", v)} options={CITIES[draft.prefecture] ?? []} placeholder="Ketik kota atau kecamatan" /></F>
            <p className="rounded-lg bg-secondary p-3 text-sm text-brand-ink">{pick(locale, "Kode pos tidak disimpan; hanya prefektur dan kota yang dikirim.", "The postcode is never stored; only the prefecture and city are sent.")}</p>
            <p className="rounded-lg bg-secondary p-3 text-sm text-brand-ink">{pick(locale, "Komsat Anda: ", "Your komsat: ")}<strong>{profile.komsat}</strong>{pick(locale, ", ditentukan otomatis dari domisili. Pindah komsat melalui admin.", ", set automatically from your residence. A komsat move goes through your admin.")}</p>
          </div>
        );
      case "funding":
        return (
          <div className="grid gap-2">
            <FundingPicker values={draft.funding} onChange={(v) => set("funding", v)} options={["Beasiswa MEXT", "Beasiswa lainnya", "Biaya sendiri", "Dukungan keluarga", "Sumber lainnya"]} />
            <p className="text-sm text-brand-muted">{pick(locale, "Perubahan menyimpan pilihan sebelumnya dalam riwayat pendanaan.", "A change keeps the earlier choice in the funding history.")}</p>
          </div>
        );
      case "interests":
        return (
          <div className="grid gap-2">
            <TagInput values={draft.interests} onChange={(v) => { if (v.length <= 30) set("interests", v); }} suggestions={["Musik", "Olahraga", "Kuliner", "Teknologi", "Bahasa Jepang", "Karier", "Budaya"]} placeholder="Cari atau ketik minat" />
            <p className="text-sm text-brand-muted">{pick(locale, "Pilih hingga 30 minat. Pilihan yang ada tetap dipertahankan saat disimpan.", "Pick up to 30 interests. Existing choices are kept when you save.")}</p>
          </div>
        );
      case "permit":
        return (
          <div className="grid gap-4">
            <p className="flex items-start gap-2 text-sm text-brand-muted">
              <IconShieldLock className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              {pick(locale, "Membuka tanggal izin tinggal dan kontak darurat di sini tercatat dalam audit.", "Opening the permit date and the emergency contact here is written to the audit log.")}
            </p>
            <F label="Status izin tinggal">
              <PillRadio ariaLabel="Status izin tinggal" value={draft.residenceStatus} onChange={(v) => set("residenceStatus", v)} options={[
                { value: "Student", label: "Student" }, { value: "Researcher", label: "Researcher" }, { value: "Dependent", label: "Dependent" }, { value: "Permanent resident", label: "Permanent resident" }, { value: "Other", label: "Other" },
              ]} />
            </F>
            <F label="Tanggal kedaluwarsa izin tinggal">
              {hiddenOpen("residenceExpiry")
                ? <Input type="date" value={draft.residenceExpiry} onChange={(e) => set("residenceExpiry", e.target.value)} />
                : <span className="grid gap-1.5"><Input value="" onChange={(e) => set("residenceExpiry", e.target.value)} disabled={reveal.busy} /><span className="text-xs text-brand-muted">{hiddenHint}</span></span>}
            </F>
            <fieldset className="grid gap-4 border-t border-brand-border pt-4">
              <legend className="px-1 text-sm font-bold text-brand-ink">{pick(locale, "Kontak darurat", "Emergency contact")}</legend>
              {reveal.failed ? <p role="alert" className="text-sm font-medium text-brand-red">{pick(locale, "Nilai tersembunyi belum bisa dibuka, jadi kolomnya kosong. Kolom lain tetap bisa disimpan.", "The hidden values could not be opened, so those fields are empty. The other fields still save.")}</p> : null}
              <F label="Nama kontak"><Input value={hiddenOpen("emergency") ? draft.emergencyName : ""} onChange={(e) => { set("emergencyName", e.target.value); if (!hiddenOpen("emergency")) reveal.show(["emergency"], { autoHide: false }); }} disabled={!hiddenOpen("emergency") && reveal.busy} /></F>
              <F label="Hubungan"><Input value={hiddenOpen("emergency") ? draft.emergencyRelationship : ""} onChange={(e) => set("emergencyRelationship", e.target.value)} disabled={!hiddenOpen("emergency")} /></F>
              <F label="Nomor telepon kontak"><Input value={hiddenOpen("emergency") ? draft.emergencyPhone : ""} onChange={(e) => set("emergencyPhone", e.target.value)} disabled={!hiddenOpen("emergency")} /></F>
              <F label="Alamat kontak"><Textarea rows={3} value={hiddenOpen("emergency") ? draft.emergencyAddress : ""} onChange={(e) => set("emergencyAddress", e.target.value)} disabled={!hiddenOpen("emergency")} /></F>
              {!hiddenOpen("emergency") ? <p className="text-xs text-brand-muted">{hiddenHint}</p> : null}
            </fieldset>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title={pick(locale, "Profil", "Profile")} description={pick(locale, "Data keanggotaan dan riwayat status Anda.", "Your membership data and status history.")} />
      {savedMsg ? (
        <p role="status" className="flex items-center gap-2 text-sm font-medium text-brand-ink">
          <IconCheck className="size-4 text-brand-red" aria-hidden="true" />
          {savedMsg}
        </p>
      ) : null}
      <div className="flex flex-col gap-5 md:grid md:grid-cols-[350px_minmax(0,1fr)] md:items-start md:gap-x-8 md:gap-y-6">
        <div className="flex flex-col gap-5">
          <Card className="gap-4 rounded-xl border border-brand-border bg-card p-5">
            <div className="flex items-center gap-3">
              <IconIdBadge2 className="size-6 shrink-0 text-brand-red" aria-hidden="true" />
              <div className="grid gap-0.5">
                <h2 className="flex flex-wrap items-center gap-2 font-bold text-brand-ink">
                  {profile.fullName}
                  <Badge variant="success">{pick(locale, "Aktif", "Active")}</Badge>
                </h2>
                <p className="text-sm text-brand-muted">darma.kotama@gmail.com</p>
              </div>
            </div>
            <dl className="grid gap-3 border-t border-brand-border pt-4">
              <RailFact label={pick(locale, "Nomor anggota", "Member number")}><span className="font-mono">{MEMBER_NUMBER}</span></RailFact>
              <RailFact label={pick(locale, "Jenis keanggotaan", "Membership type")}>
                <span className="grid gap-0.5">
                  <span data-testid="profile-category">{categoryLabel(profile.category, profile.subtype, locale, "profil")}</span>
                  <span className="text-xs font-normal text-brand-muted">{pick(locale, CATEGORY_MEANING.id, CATEGORY_MEANING.en)}</span>
                </span>
              </RailFact>
              <RailFact label="Komsat">{profile.komsat}</RailFact>
              <RailFact label="Korda">{profile.korda}</RailFact>
              <RailFact label={pick(locale, "Berlaku sampai", "Valid until")}>6 Oktober 2027</RailFact>
            </dl>
          </Card>
          <section aria-labelledby="profile-history-heading">
            <h2 id="profile-history-heading" className="mb-3 flex items-center gap-2 text-lg font-bold text-brand-ink">
              <IconHistory className="size-5 text-brand-red" aria-hidden="true" />
              {pick(locale, "Riwayat keanggotaan", "Membership history")}
            </h2>
            <Card className="rounded-xl border border-brand-border bg-card p-5">
              <ol className="relative grid gap-5">
                <span aria-hidden="true" className="absolute top-[11px] bottom-[6px] left-[5px] w-px bg-brand-border" />
                {history.map((change, i) => (
                  <li key={change.date + change.status} className="relative flex gap-3 pl-6">
                    <span aria-hidden="true" className={`absolute top-1.5 left-0 size-2.5 rounded-full ${i === 0 ? "bg-brand-red" : "bg-brand-muted"}`} />
                    <div className="flex flex-1 flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-brand-ink">{change.status}</p>
                        <p className="text-sm text-brand-muted">{change.reason}</p>
                      </div>
                      <time className="text-sm text-brand-muted">{change.date}</time>
                    </div>
                  </li>
                ))}
              </ol>
            </Card>
          </section>
        </div>
        <div className="flex flex-col gap-5">
          {(Object.keys(PANEL_META) as PanelKey[]).map((key) => {
            const meta = PANEL_META[key];
            const title = pick(locale, meta.title.id, meta.title.en);
            const description = pick(locale, meta.description.id, meta.description.en);
            if (meta.reviewed) {
              return (
                <ReadPanel key={key} title={title} description={description} note={<AdminContactNote locale={locale} hasKomsat={!nonKomsat} />}>
                  {renderRead(key)}
                </ReadPanel>
              );
            }
            return (
              <section key={key} aria-label={title} className="min-w-0 [&_button]:min-h-11 min-[600px]:[&_button]:h-8 min-[600px]:[&_button]:min-h-8">
                <EditablePanel title={title} description={description} onEdit={() => openEditor(key)} editLabel={pick(locale, `Ubah ${title.toLocaleLowerCase("id")}`, `Edit ${title.toLocaleLowerCase("en")}`)}>
                  {renderRead(key)}
                </EditablePanel>
              </section>
            );
          })}
          <Card className="gap-3 rounded-xl border border-border bg-card p-5" data-testid="profile-preview-controls">
            <p className="text-sm font-bold text-brand-ink">{pick(locale, "Pratinjau desain", "Design preview")}</p>
            <label className="flex min-h-11 items-center gap-3 text-sm text-brand-ink min-[600px]:min-h-8">
              <input type="checkbox" className="size-4 accent-brand-red" checked={failReveal} onChange={(e) => setFailReveal(e.target.checked)} />
              {pick(locale, "Simulasikan gagal membuka data sensitif", "Simulate a failed sensitive-data reveal")}
            </label>
            <label className="flex min-h-11 items-center gap-3 text-sm text-brand-ink min-[600px]:min-h-8">
              <input type="checkbox" className="size-4 accent-brand-red" checked={nonKomsat} onChange={(e) => setNonKomsat(e.target.checked)} />
              {pick(locale, "Tampilkan sebagai anggota Non-Komsat (grup admin korda kosong)", "Show as a Non-Komsat member (empty korda admin group)")}
            </label>
            <p className="text-xs text-brand-muted">{pick(locale, "Kontrol pratinjau: menggantikan jawaban API sampai integrasi.", "Preview controls: they stand in for the API's answers until integration.")}</p>
          </Card>
        </div>
      </div>
      <AdminDrawer
        open={editing !== null}
        onOpenChange={(open) => { if (!open) closeEditor(); }}
        locale={locale === "en" ? "en" : "id"}
        title={editing ? pick(locale, PANEL_META[editing].title.id, PANEL_META[editing].title.en) : pick(locale, "Ubah profil", "Edit profile")}
        description={editing ? pick(locale, "Perubahan pada bagian ini disimpan langsung.", "Changes in this section are saved directly.") : undefined}
        footer={
          editing ? (
            <>
              <Button type="button" variant="outline" onClick={closeEditor}>{pick(locale, "Batal", "Cancel")}</Button>
              <Button type="button" onClick={submit} disabled={saving} aria-busy={saving}>
                {saving ? <><Spinner />{pick(locale, "Menyimpan...", "Saving...")}</> : pick(locale, "Simpan perubahan", "Save changes")}
              </Button>
            </>
          ) : null
        }
      >
        {editing ? renderEditor() : null}
      </AdminDrawer>
    </div>
  );
}

export function ProfileView({ onNavigate, locale, onLocale }: { onNavigate: (view: View) => void; locale: Locale; onLocale: (locale: Locale) => void }) {
  const go = (view: View) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    onNavigate(view);
  };
  return (
    <PortalShell
      logoSrc={logoUrl}
      navItems={[
        { label: pick(locale, "Beranda", "Home"), href: "#", icon: <IconHome className="size-5" stroke={1.75} />, onClick: go("portal") },
        { label: pick(locale, "Profil", "Profile"), href: "#", icon: <IconIdBadge2 className="size-5" stroke={1.75} />, current: true },
      ]}
      languages={[{ label: "Bahasa Indonesia", current: locale === "id", onSelect: () => onLocale("id") }, { label: "English", current: locale === "en", onSelect: () => onLocale("en") }]}
      accountItems={[{ label: pick(locale, "Akun", "Account"), href: "#akun" }, { label: pick(locale, "Kebijakan Privasi", "Privacy policy"), href: "#privasi" }, { label: pick(locale, "Syarat Layanan", "Terms of service"), href: "#syarat" }]}
      helpText={pick(locale, "Butuh bantuan? Hubungi pengurus komsatmu atau sekretariat PPI Jepang.", "Need help? Contact your local PPI committee or the PPI Japan secretariat.")}
      legalItems={[{ label: pick(locale, "Kebijakan Privasi", "Privacy policy"), href: "#privasi" }, { label: pick(locale, "Syarat Layanan", "Terms of service"), href: "#syarat" }]}
    >
      <ProfileContent locale={locale} />
    </PortalShell>
  );
}

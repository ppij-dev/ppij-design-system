import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { IconCheck, IconClockHour4, IconEye, IconEyeOff, IconHistory, IconHome, IconIdBadge2, IconPencil, IconShieldLock } from "@tabler/icons-react";
import { PortalShell } from "./portal-shell";
import { PageHeader } from "./page-header";
import { Card } from "./card";
import { Badge } from "./badge";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Textarea } from "./textarea";
import { Alert, AlertDescription, AlertTitle } from "./alert";
import { AdminDrawer } from "./admin-drawer";
import { Spinner } from "./spinner";
import { TagInput } from "./tag-input";
import { TypeAhead } from "./type-ahead";
import { PhoneField } from "./phone-field";
import { PillRadio } from "./pill-radio";
import { MonthPicker } from "./month-picker";
import { PostcodeField } from "./postcode-field";
import { FundingPicker } from "./funding-picker";
import { EditablePanel } from "./editable-panel";
// @ts-expect-error Static brand asset; the portal supplies its own served copy.
import logoUrl from "../../../../brand/ppij-logo.png";

/**
 * The member Profil page, aligned with the profile change policy
 * (ppij-identity-sso design/1.0.6/profile-change-policy.md and its
 * reference mock PortalProfileDemo.tsx):
 *
 * - Read first: every panel shows committed values as text.
 * - Panels edit one at a time in the AdminDrawer, with the wizard's
 *   own components (PhoneField, PostcodeField autofill, TypeAhead,
 *   PillRadio, MonthPicker, FundingPicker, TagInput).
 * - Reviewed panels (Data diri: name, date of birth, komsat;
 *   Pendidikan: institution, degree, expected graduation) submit
 *   with "Ajukan perubahan": the proposal appears under the panel
 *   as "Perubahan menunggu peninjauan" with a Menunggu badge, and
 *   the current values stay in effect.
 * - Direct panels (Kontak, Domisili, Pendanaan, Minat, Izin)
 *   submit with "Simpan perubahan" and update immediately;
 *   funding changes keep the previous selection in the history.
 * - Fields with no edit contract (gender, origin province,
 *   faculty, study program, entry month, lab, student number,
 *   residence status) are read-only text, per the policy.
 * - The student card photo is NOT shown: it is deleted 30 days
 *   after the registration decision.
 * - Sealed data (member phone, the whole emergency contact) is
 *   masked by default; revealing or editing it is the audited
 *   action in production.
 */

type PanelKey = "identity" | "contact" | "residence" | "education" | "funding" | "interests" | "permit";

interface ProfileData {
  fullName: string; birthDate: string; gender: string; originProvince: string; komsat: string;
  nickname: string; phone: string; lineId: string;
  postcode: string; prefecture: string; city: string;
  institution: string; faculty: string; degree: string; studyProgram: string; entryMonth: string; expectedGraduation: string; lab: string; studentNumber: string;
  funding: string[]; interests: string[];
  residenceStatus: string; residenceExpiry: string;
  emergencyName: string; emergencyRelationship: string; emergencyPhone: string; emergencyAddress: string;
}

const INITIAL: ProfileData = {
  fullName: "I Nyoman Darma Kotama", birthDate: "1992-09-02", gender: "Laki-laki", originProvince: "Bali", komsat: "Okayama",
  nickname: "Darma", phone: "+81 90-1234-5678", lineId: "darmakotama",
  postcode: "700-0001", prefecture: "Okayama", city: "Kita-ku, Kota Okayama",
  institution: "Okayama University", faculty: "Graduate School of Science and Technology", degree: "s2", studyProgram: "Computer Science", entryMonth: "2025-04", expectedGraduation: "2027-03", lab: "Laboratorium Sistem Informasi", studentNumber: "76123456",
  funding: ["Beasiswa MEXT"], interests: ["Fotografi", "Riset kecerdasan buatan", "Bahasa Jepang"],
  residenceStatus: "Student", residenceExpiry: "2027-03-31",
  emergencyName: "Ni Made Rai", emergencyRelationship: "Ibu", emergencyPhone: "+62 812-3456-7890", emergencyAddress: "Denpasar, Bali",
};

const DEGREE_LABELS: Record<string, string> = { d3: "D3 / Diploma", s1: "S1 / Sarjana", s2: "S2 / Magister", s3: "S3 / Doktor" };
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
  return <span className="tracking-[0.2em]" aria-label="Tersembunyi, terenkripsi">{"\u2022".repeat(10)}</span>;
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

const PANEL_META: Record<PanelKey, { title: string; description: string; review: boolean }> = {
  identity: { title: "Data diri", review: true, description: "Perubahan nama, tanggal lahir, dan komsat ditinjau pengurus. Data saat ini tetap berlaku sampai disetujui." },
  contact: { title: "Kontak", review: false, description: "Nama panggilan, telepon, dan LINE diperbarui langsung." },
  residence: { title: "Domisili di Jepang", review: false, description: "Prefektur dan kota tempat tinggal diperbarui langsung. Komsat ditentukan otomatis dari domisili; pindah komsat adalah perubahan yang ditinjau." },
  education: { title: "Pendidikan", review: true, description: "Perubahan institusi, jenjang, dan perkiraan lulus ditinjau pengurus. Data saat ini tetap berlaku sampai disetujui." },
  funding: { title: "Pendanaan", review: false, description: "Sumber pendanaan diperbarui langsung. Pilihan sebelumnya tetap tercatat." },
  interests: { title: "Minat", review: false, description: "Minat diperbarui langsung." },
  permit: { title: "Izin tinggal dan kontak darurat", review: false, description: "Tanggal berakhir izin tinggal dan kontak darurat diperbarui langsung." },
};

type PendingProposal = Partial<Pick<ProfileData, "fullName" | "birthDate" | "komsat" | "institution" | "degree" | "expectedGraduation">>;

function ProfileContent() {
  const [profile, setProfile] = React.useState<ProfileData>(INITIAL);
  const [draft, setDraft] = React.useState<ProfileData>(INITIAL);
  const [editing, setEditing] = React.useState<PanelKey | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [savedMsg, setSavedMsg] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState<Partial<Record<"identity" | "education", PendingProposal>>>({});
  const [fundingHistory, setFundingHistory] = React.useState<Array<{ values: string[]; changedOn: string }>>([{ values: ["Dukungan keluarga"], changedOn: "1 April 2026" }]);
  const [phoneRevealed, setPhoneRevealed] = React.useState(false);
  const [emergencyRevealed, setEmergencyRevealed] = React.useState(false);
  const [postcodeStatus, setPostcodeStatus] = React.useState<string | undefined>(undefined);
  const [postcodeCandidates, setPostcodeCandidates] = React.useState<Array<{ label: string; onSelect: () => void }>>([]);

  const history = [
    { status: "Aktif", reason: "Kartu anggota diterbitkan", date: "6 Okt 2026" },
    { status: "Belum lengkap", reason: "Pendaftaran diterima", date: "1 Okt 2026" },
  ];

  const openEditor = (key: PanelKey) => {
    setSavedMsg(null);
    setPostcodeStatus(undefined);
    setPostcodeCandidates([]);
    setDraft({ ...profile, ...(key === "identity" || key === "education" ? pending[key] : {}) });
    setEditing(key);
  };

  const submit = () => {
    if (!editing) return;
    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      if (editing === "identity") {
        setPending((p) => ({ ...p, identity: { fullName: draft.fullName, birthDate: draft.birthDate, komsat: draft.komsat } }));
        setSavedMsg("Usulan perubahan tersimpan dan menunggu peninjauan.");
      } else if (editing === "education") {
        setPending((p) => ({ ...p, education: { institution: draft.institution, degree: draft.degree, expectedGraduation: draft.expectedGraduation } }));
        setSavedMsg("Usulan perubahan tersimpan dan menunggu peninjauan.");
      } else {
        if (editing === "funding" && JSON.stringify(draft.funding) !== JSON.stringify(profile.funding)) {
          setFundingHistory((h) => [{ values: profile.funding, changedOn: formatDateID(new Date().toISOString().slice(0, 10)) }, ...h]);
        }
        setProfile({ ...draft });
        setSavedMsg("Perubahan disimpan.");
      }
      setEditing(null);
    }, 700);
  };

  const searchPostcode = () => {
    const city = CITIES[draft.prefecture]?.[0] ?? "Kita-ku, Kota Okayama";
    setPostcodeStatus(`Alamat ditemukan: ${draft.prefecture}, ${city}.`);
    setPostcodeCandidates([
      {
        label: `${draft.prefecture} · ${city}`,
        onSelect: () => {
          setDraft((d) => ({ ...d, city }));
          setPostcodeCandidates([]);
          setPostcodeStatus(`Kota diisi otomatis: ${city}.`);
        },
      },
    ]);
  };

  const proposalRows = (key: "identity" | "education"): Array<[string, string]> => {
    const p = pending[key];
    if (!p) return [];
    const rows: Array<[string, string]> = [];
    if (p.fullName) rows.push(["Nama lengkap", p.fullName]);
    if (p.birthDate) rows.push(["Tanggal lahir", formatDateID(p.birthDate)]);
    if (p.komsat) rows.push(["Komsat", p.komsat]);
    if (p.institution) rows.push(["Institusi", p.institution]);
    if (p.degree) rows.push(["Jenjang", DEGREE_LABELS[p.degree] ?? p.degree]);
    if (p.expectedGraduation) rows.push(["Perkiraan kelulusan", formatMonthID(p.expectedGraduation)]);
    return rows;
  };

  const renderRead = (key: PanelKey): React.ReactNode => {
    switch (key) {
      case "identity":
        return <Rows items={[
          ["Nama lengkap", profile.fullName],
          ["Tanggal lahir", formatDateID(profile.birthDate)],
          ["Komsat", profile.komsat],
          ["Jenis kelamin", profile.gender],
          ["Provinsi asal", profile.originProvince],
        ]} />;
      case "contact":
        return <Rows items={[
          ["Nama panggilan", profile.nickname],
          ["Nomor telepon atau WhatsApp", phoneRevealed ? profile.phone : (
            <span className="flex flex-wrap items-center gap-2">
              <Masked />
              <Button type="button" variant="outline" onClick={() => setPhoneRevealed(true)}><IconEye className="size-4" aria-hidden="true" />Tampilkan</Button>
            </span>
          )],
          ["LINE ID", profile.lineId],
        ]} />;
      case "residence":
        return <Rows items={[
          ["Kode pos", profile.postcode],
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
                <p className="text-sm text-brand-muted">Riwayat pendanaan sebelumnya</p>
                {fundingHistory.map((h) => (
                  <p key={h.changedOn + h.values.join()} className="text-sm font-medium text-brand-ink">{h.values.join(", ")} · {h.changedOn}</p>
                ))}
              </div>
            ) : null}
          </div>
        );
      case "interests":
        return <Rows items={[["Minat", <Chips key="i" values={profile.interests} />]]} />;
      case "permit":
        return (
          <div className="grid gap-4">
            <Rows items={[
              ["Status izin tinggal", profile.residenceStatus],
              ["Tanggal kedaluwarsa izin tinggal", formatDateID(profile.residenceExpiry)],
            ]} />
            <div className="grid gap-2 border-t border-brand-border pt-4">
              <p className="flex items-center gap-2 font-semibold text-brand-ink">
                Kontak darurat
                <span className="text-sm font-normal text-brand-muted">(terenkripsi)</span>
                <Button type="button" variant="outline" onClick={() => setEmergencyRevealed((v) => !v)}>
                  {emergencyRevealed ? <><IconEyeOff className="size-4" aria-hidden="true" />Sembunyikan</> : <><IconEye className="size-4" aria-hidden="true" />Tampilkan</>}
                </Button>
              </p>
              {emergencyRevealed ? (
                <Rows items={[
                  ["Nama kontak", profile.emergencyName],
                  ["Hubungan", profile.emergencyRelationship],
                  ["Nomor telepon kontak", profile.emergencyPhone],
                  ["Alamat kontak", profile.emergencyAddress],
                ]} />
              ) : (
                <p className="flex items-center gap-2 text-sm text-brand-muted">
                  <IconShieldLock className="size-4 shrink-0" aria-hidden="true" />
                  Kontak darurat disembunyikan. Pilih Tampilkan untuk melihat, atau Edit untuk memperbarui.
                </p>
              )}
            </div>
          </div>
        );
    }
  };

  const renderEditor = (): React.ReactNode => {
    const set = <K extends keyof ProfileData>(k: K, v: ProfileData[K]) => setDraft((d) => ({ ...d, [k]: v }));
    switch (editing) {
      case "identity":
        return (
          <div className="grid gap-4">
            <F label="Nama lengkap"><Input value={draft.fullName} onChange={(e) => set("fullName", e.target.value)} /></F>
            <F label="Tanggal lahir"><Input type="date" value={draft.birthDate} onChange={(e) => set("birthDate", e.target.value)} /></F>
            <F label="Komsat"><TypeAhead value={draft.komsat} onChange={(v) => set("komsat", v)} options={KOMSAT_OPTIONS} placeholder="Ketik nama komsat" /></F>
          </div>
        );
      case "contact":
        return (
          <div className="grid gap-4">
            <F label="Nama panggilan"><Input value={draft.nickname} onChange={(e) => set("nickname", e.target.value)} /></F>
            <F label="Nomor telepon atau WhatsApp"><PhoneField value={draft.phone} onChange={(v) => set("phone", v)} defaultCode="+81" /></F>
            <F label="LINE ID"><Input value={draft.lineId} onChange={(e) => set("lineId", e.target.value)} /></F>
          </div>
        );
      case "residence":
        return (
          <div className="grid gap-4">
            <F label="Kode pos">
              <PostcodeField value={draft.postcode} onChange={(v) => set("postcode", v)} onSearch={searchPostcode} statusText={postcodeStatus} candidates={postcodeCandidates} />
            </F>
            <F label="Prefektur">
              <TypeAhead value={draft.prefecture} onChange={(v) => { set("prefecture", v); }} options={PREFECTURES} placeholder="Ketik prefektur" />
            </F>
            <F label="Kota atau kecamatan">
              <TypeAhead value={draft.city} onChange={(v) => set("city", v)} options={CITIES[draft.prefecture] ?? []} placeholder="Ketik kota atau kecamatan" />
            </F>
            <p className="rounded-lg bg-secondary p-3 text-sm text-brand-ink">
              Komsat Anda: <strong>{profile.komsat}</strong>, ditentukan otomatis dari domisili.
            </p>
          </div>
        );
      case "education":
        return (
          <div className="grid gap-4">
            <F label="Institusi"><TypeAhead value={draft.institution} onChange={(v) => set("institution", v)} options={INSTITUTIONS} placeholder="Ketik nama institusi" /></F>
            <F label="Jenjang">
              <PillRadio ariaLabel="Jenjang" value={draft.degree} onChange={(v) => set("degree", v)} options={[
                { value: "d3", label: "D3 / Diploma" }, { value: "s1", label: "S1 / Sarjana" }, { value: "s2", label: "S2 / Magister" }, { value: "s3", label: "S3 / Doktor" },
              ]} />
            </F>
            <F label="Perkiraan bulan lulus"><MonthPicker value={draft.expectedGraduation} onChange={(v) => set("expectedGraduation", v)} /></F>
          </div>
        );
      case "funding":
        return (
          <div className="grid gap-2">
            <FundingPicker values={draft.funding} onChange={(v) => set("funding", v)} options={["Beasiswa MEXT", "Beasiswa lainnya", "Biaya sendiri", "Dukungan keluarga", "Sumber lainnya"]} />
            <p className="text-sm text-brand-muted">Perubahan menyimpan pilihan sebelumnya dalam riwayat pendanaan.</p>
          </div>
        );
      case "interests":
        return (
          <div className="grid gap-2">
            <TagInput values={draft.interests} onChange={(v) => { if (v.length <= 30) set("interests", v); }} suggestions={["Musik", "Olahraga", "Kuliner", "Teknologi", "Bahasa Jepang", "Karier", "Budaya"]} placeholder="Cari atau ketik minat" />
            <p className="text-sm text-brand-muted">Pilih hingga 30 minat. Pilihan yang ada tetap dipertahankan saat disimpan.</p>
          </div>
        );
      case "permit":
        return (
          <div className="grid gap-4">
            <F label="Tanggal kedaluwarsa izin tinggal"><Input type="date" value={draft.residenceExpiry} onChange={(e) => set("residenceExpiry", e.target.value)} /></F>
            <fieldset className="grid gap-4 border-t border-brand-border pt-4">
              <legend className="px-1 text-sm font-bold text-brand-ink">Kontak darurat</legend>
              <p className="flex items-start gap-2 text-sm text-brand-muted">
                <IconShieldLock className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                Kontak darurat terenkripsi. Membuka editor ini tercatat dalam audit.
              </p>
              <F label="Nama kontak"><Input value={draft.emergencyName} onChange={(e) => set("emergencyName", e.target.value)} /></F>
              <F label="Hubungan"><Input value={draft.emergencyRelationship} onChange={(e) => set("emergencyRelationship", e.target.value)} /></F>
              <F label="Nomor telepon kontak"><PhoneField value={draft.emergencyPhone} onChange={(v) => set("emergencyPhone", v)} defaultCode="+62" /></F>
              <F label="Alamat kontak"><Textarea rows={3} value={draft.emergencyAddress} onChange={(e) => set("emergencyAddress", e.target.value)} /></F>
            </fieldset>
          </div>
        );
      default:
        return null;
    }
  };

  const review = editing ? PANEL_META[editing].review : false;

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Profil" description="Data keanggotaan dan riwayat status Anda." />
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
                  I Nyoman Darma Kotama
                  <Badge variant="success">Aktif</Badge>
                </h2>
                <p className="text-sm text-brand-muted">darma.kotama@gmail.com</p>
              </div>
            </div>
            <dl className="grid gap-3 border-t border-brand-border pt-4">
              <RailFact label="Nomor anggota"><span className="font-mono">PPIJ-2026-000123</span></RailFact>
              <RailFact label="Komsat">Okayama</RailFact>
              <RailFact label="Korda">Kansai</RailFact>
              <RailFact label="Berlaku sampai">6 Oktober 2027</RailFact>
            </dl>
          </Card>
          <section aria-labelledby="profile-history-heading">
            <h2 id="profile-history-heading" className="mb-3 flex items-center gap-2 text-lg font-bold text-brand-ink">
              <IconHistory className="size-5 text-brand-red" aria-hidden="true" />
              Riwayat keanggotaan
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
            const isPending = (key === "identity" || key === "education") && pending[key];
            return (
              <EditablePanel
                key={key}
                title={meta.title}
                description={meta.description}
                pending={!!isPending}
                onEdit={() => openEditor(key)}
                proposal={isPending ? (
                  <Alert>
                    <IconClockHour4 aria-hidden="true" />
                    <AlertTitle>Perubahan menunggu peninjauan</AlertTitle>
                    <AlertDescription>
                      <p>Data saat ini tetap berlaku sampai pengurus menyetujui perubahan.</p>
                      <dl className="mt-2 grid gap-2 sm:grid-cols-2">
                        {proposalRows(key as "identity" | "education").map(([label, value]) => (
                          <div key={label}>
                            <dt className="font-medium text-brand-ink">{label}</dt>
                            <dd>{value}</dd>
                          </div>
                        ))}
                      </dl>
                    </AlertDescription>
                  </Alert>
                ) : undefined}
              >
                {renderRead(key)}
              </EditablePanel>
            );
          })}
        </div>
      </div>
      <AdminDrawer
        open={editing !== null}
        onOpenChange={(open) => { if (!open) setEditing(null); }}
        locale="id"
        title={editing ? PANEL_META[editing].title : "Edit profil"}
        description={editing ? (review ? "Perubahan akan menjadi usulan untuk ditinjau. Data yang disetujui tetap digunakan sampai keputusan dibuat." : "Perubahan pada bagian ini disimpan langsung.") : undefined}
        footer={
          editing ? (
            <>
              <Button type="button" variant="outline" onClick={() => setEditing(null)}>Batal</Button>
              <Button type="button" onClick={submit} disabled={saving} aria-busy={saving}>
                {saving ? <><Spinner />{review ? "Mengajukan…" : "Menyimpan…"}</> : review ? "Ajukan perubahan" : "Simpan perubahan"}
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

function ProfilePageDemo() {
  return (
    <PortalShell
      logoSrc={logoUrl}
      navItems={[
        { label: "Beranda", href: "#", icon: <IconHome className="size-5" stroke={1.75} /> },
        { label: "Profil", href: "#", icon: <IconIdBadge2 className="size-5" stroke={1.75} />, current: true },
      ]}
      languages={[{ label: "Bahasa Indonesia", current: true }, { label: "English" }]}
      accountItems={[{ label: "Akun", href: "#" }, { label: "Kebijakan Privasi", href: "#" }, { label: "Syarat Layanan", href: "#" }]}
      helpText="Butuh bantuan? Hubungi pengurus komsatmu atau sekretariat PPI Jepang."
      legalItems={[{ label: "Kebijakan Privasi", href: "#" }, { label: "Syarat Layanan", href: "#" }]}
    >
      <ProfileContent />
    </PortalShell>
  );
}

const meta: Meta = { title: "Portal/ProfilePage", parameters: { layout: "fullscreen" } };
export default meta;
type Story = StoryObj;
export const ReadFirst: Story = { render: () => <ProfilePageDemo /> };

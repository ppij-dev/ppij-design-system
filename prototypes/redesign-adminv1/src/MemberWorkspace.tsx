import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  IconAdjustmentsHorizontal, IconAlertCircle, IconArrowRight, IconEye, IconEyeOff,
  IconLock, IconPencil, IconSearch, IconShieldLock, IconUsers,
} from "@tabler/icons-react";
import {
  AdminDrawer, Badge, Button, Input, MonthPicker, PillRadio, SearchFilter, Select, SelectContent,
  SelectItem, SelectTrigger, SelectValue, Table, TableBody, TableCell, TableHead, TableHeader,
  TableRow, Textarea, Timeline, TypeAhead,
} from "ppij-design-system";
import { SearchableMultiSelect } from "./SearchableMultiSelect";
import { SearchableUnitMenu } from "./ReviewWorkspace";
import "./MemberWorkspace.css";

type Scope = "national" | "korda" | "komsat";
type Category = "BIASA" | "LUAR_BIASA" | null;
type Subtype = "postdoc" | "researcher" | "short_study" | null;
type CategorySource = "derived" | "override" | "backfill" | null;

type Member = { id: string; name: string; email: string; komsat: string; region: string; institution: string; degree: string; major: string; status: string; validUntil: string; source: string; scholarship: string; activation: string; expiryWindow: string; badge?: string };

/** Everything the member sees on Profil (plan D12), held as one local record per member. */
type ProfileData = {
  fullName: string; gender: "L" | "P"; originProvince: string; birthDate: string;
  nickname: string; phone: string; lineId: string;
  prefecture: string; city: string; residenceStatus: string; residenceExpiry: string;
  institution: string; degree: string; faculty: string; studyProgram: string; entryMonth: string; expectedGraduation: string; lab: string; studentNumber: string;
  funding: { value: string; from: string; to?: string }[];
  interests: string[];
  komsat: string; korda: string; category: Category; subtype: Subtype; categorySource: CategorySource; categoryReason?: string; categoryReplacedAt?: string;
  membership: { status: string; reason: string; date: string }[];
  emergency: { name: string; relationship: string; phone: string; address: string };
};

const members: Member[] = [
  { id: "PPIJ-02941", name: "Contoh Anggota A", email: "anggota-a@example.invalid", komsat: "Tokyo", region: "Kanto", institution: "The University of Tokyo", degree: "S2", major: "Teknik", status: "Aktif", validUntil: "24 Okt 2027", source: "Pendaftaran mandiri", scholarship: "LPDP", activation: "Sudah aktivasi", expiryWindow: "" },
  { id: "PPIJ-02940", name: "Contoh Anggota E", email: "anggota-e@example.invalid", komsat: "Tokyo", region: "Kanto", institution: "Waseda University", degree: "S1", major: "Ekonomi", status: "Aktif", validUntil: "21 Okt 2027", source: "Impor anggota", scholarship: "Mandiri", activation: "Sudah aktivasi", expiryWindow: "" },
  { id: "PPIJ-02939", name: "Contoh Anggota F", email: "anggota-f@example.invalid", komsat: "Yokohama", region: "Kanto", institution: "Yokohama National University", degree: "S3", major: "Pendidikan", status: "Aktif", validUntil: "18 Okt 2027", source: "Pendaftaran mandiri", scholarship: "MEXT", activation: "Sudah aktivasi", expiryWindow: "" },
  { id: "PPIJ-02938", name: "Contoh Anggota G", email: "anggota-g@example.invalid", komsat: "Osaka", region: "Kansai", institution: "Osaka University", degree: "S2", major: "Kesehatan", status: "Berakhir", validUntil: "15 Okt 2026", source: "Pendaftaran terbantu", scholarship: "Mandiri", activation: "Belum aktivasi", expiryWindow: "Kedaluwarsa", badge: "Perlu perpanjangan" },
  { id: "PPIJ-02937", name: "Contoh Anggota H", email: "anggota-h@example.invalid", komsat: "Nagoya", region: "Chubu", institution: "Nagoya University", degree: "S3", major: "Sains", status: "Ditangguhkan", validUntil: "29 Des 2026", source: "Impor anggota", scholarship: "MEXT", activation: "Email bermasalah", expiryWindow: "60 hari ke depan" },
  { id: "PPIJ-02936", name: "Contoh Anggota I", email: "anggota-i@example.invalid", komsat: "Tokyo", region: "Kanto", institution: "Tokyo Institute of Technology", degree: "S3", major: "Informatika", status: "Dicabut", validUntil: "24 Nov 2026", source: "Pendaftaran mandiri", scholarship: "LPDP", activation: "Sudah aktivasi", expiryWindow: "30 hari ke depan" },
  { id: "PPIJ-02934", name: "Contoh Anggota J", email: "anggota-j@example.invalid", komsat: "Chiba", region: "Kanto", institution: "Chiba University", degree: "S1", major: "Ekonomi", status: "Belum lengkap", validUntil: "—", source: "Impor anggota", scholarship: "Mandiri", activation: "Belum aktivasi", expiryWindow: "" },
  { id: "PPIJ-02933", name: "Contoh Anggota K", email: "anggota-k@example.invalid", komsat: "Kyoto", region: "Kansai", institution: "Kyoto University", degree: "S2", major: "Ilmu Sosial", status: "Belum lengkap", validUntil: "—", source: "Impor anggota", scholarship: "MEXT", activation: "Belum aktivasi", expiryWindow: "" },
];

const units = ["Tokyo", "Yokohama", "Chiba", "Saitama", "Osaka", "Kyoto", "Nagoya", "Fukuoka"];
const kantoUnits = ["Tokyo", "Yokohama", "Chiba", "Saitama"];
/** The komsats the acting workspace covers; a komsat move needs scope over the source and the target. */
const scopeUnits: Record<Scope, string[]> = { national: units, korda: kantoUnits, komsat: ["Tokyo"] };
const residenceByKomsat: Record<string, { prefecture: string; city: string }> = {
  Tokyo: { prefecture: "Tokyo", city: "Shinjuku" },
  Yokohama: { prefecture: "Kanagawa", city: "Kota Yokohama, Naka-ku" },
  Chiba: { prefecture: "Chiba", city: "Kota Chiba, Inage-ku" },
  Osaka: { prefecture: "Osaka", city: "Kota Osaka, Kita-ku" },
  Kyoto: { prefecture: "Kyoto", city: "Kota Kyoto, Sakyo-ku" },
  Nagoya: { prefecture: "Aichi", city: "Kota Nagoya, Chikusa-ku" },
  Fukuoka: { prefecture: "Fukuoka", city: "Kota Fukuoka, Higashi-ku" },
};
const provinces = ["Bali", "DKI Jakarta", "Jawa Barat", "Jawa Tengah", "Jawa Timur", "Sumatera Utara", "Sulawesi Selatan"];
const institutions = ["The University of Tokyo", "Waseda University", "Tokyo Institute of Technology", "Yokohama National University", "Osaka University", "Kyoto University", "Nagoya University", "Chiba University", "Kyushu University"];
const degrees = [
  { value: "sma", label: "SMA / 高校" },
  { value: "s1", label: "S1 / Sarjana" },
  { value: "s2", label: "S2 / Magister" },
  { value: "s3", label: "S3 / Doktor" },
  { value: "postdoc", label: "Pascadoktoral" },
  { value: "researcher", label: "Peneliti di lembaga riset" },
];

const statusVariant = (status: string) => (status === "Aktif" ? "success" : status === "Belum lengkap" ? "secondary" : "warning") as "success" | "secondary" | "warning";
const categoryVariant = (category: Category) => (category === "BIASA" ? "secondary" : category === "LUAR_BIASA" ? "info" : "outline") as "secondary" | "info" | "outline";
const subtypeLabel: Record<Exclude<Subtype, null>, string> = { postdoc: "Postdoc", researcher: "Peneliti", short_study: "Studi singkat" };
const categoryShort = (category: Category, subtype: Subtype) => category === "BIASA" ? "Biasa" : category === "LUAR_BIASA" ? `Luar Biasa${subtype ? ` · ${subtypeLabel[subtype]}` : ""}` : "Belum ditentukan";
const categoryLong = (category: Category, subtype: Subtype) => category === "BIASA" ? "Anggota Biasa" : category === "LUAR_BIASA" ? `Anggota Luar Biasa${subtype ? ` · ${subtypeLabel[subtype]}` : ""}` : "Belum ditentukan";
const categoryFilterValue = (category: Category) => category === "BIASA" ? "Anggota Biasa" : category === "LUAR_BIASA" ? "Anggota Luar Biasa" : "Belum ditentukan";
const categorySourceLabel: Record<Exclude<CategorySource, null>, string> = { derived: "Ditentukan otomatis dari data akademik", override: "Ditetapkan manual oleh admin", backfill: "Hasil backfill data lama" };

/** One profile seed per member: the same builder the member Profil would read from. */
const profileFor = (member: Member): ProfileData => {
  const residence = residenceByKomsat[member.komsat] ?? residenceByKomsat.Tokyo;
  const base: ProfileData = {
    fullName: member.name, gender: "P", originProvince: "Jawa Barat", birthDate: "1999-08-17",
    nickname: "Contoh", phone: "+81 90 0000 0000", lineId: "contoh-id",
    prefecture: residence.prefecture, city: residence.city, residenceStatus: "Pelajar", residenceExpiry: "2027-06-30",
    institution: member.institution, degree: member.degree.toLowerCase(), faculty: "Sekolah Pascasarjana", studyProgram: member.major, entryMonth: "2025-04", expectedGraduation: "2027-03",
    lab: "Lab Sistem Informasi", studentNumber: "STU-CONTOH-01",
    funding: [{ value: "Beasiswa MEXT", from: "April 2025" }], interests: ["Fotografi", "Riset kecerdasan buatan"],
    komsat: member.komsat, korda: member.region, category: "BIASA", subtype: null, categorySource: "derived",
    membership: [
      { status: "Aktif", reason: "Kartu anggota diterbitkan", date: "6 Okt 2026" },
      { status: "Belum lengkap", reason: "Pendaftaran diterima", date: "1 Okt 2026" },
    ],
    emergency: { name: "Kontak Contoh", relationship: "Ibu", phone: "+62 812 0000 0000", address: "Denpasar, Bali" },
  };
  const overrides: Record<string, Partial<ProfileData>> = {
    "PPIJ-02941": { originProvince: "Sumatera Utara", funding: [{ value: "Beasiswa LPDP", from: "April 2026" }, { value: "Dukungan keluarga", from: "April 2025", to: "Maret 2026" }], interests: ["Fotografi", "Riset kecerdasan buatan", "Bahasa Jepang"] },
    "PPIJ-02940": { gender: "L", originProvince: "Jawa Timur", faculty: "Fakultas Ilmu Sosial", entryMonth: "2024-10", expectedGraduation: "2028-03", studentNumber: "2024-ECON-118", funding: [{ value: "Biaya sendiri", from: "Oktober 2024" }], interests: ["Kuliner"] },
    "PPIJ-02939": { originProvince: "Bali", categoryReplacedAt: "20 Okt 2026", funding: [{ value: "Beasiswa MEXT", from: "Oktober 2024" }], interests: ["Riset kecerdasan buatan", "Olahraga"] },
    "PPIJ-02938": { gender: "L", originProvince: "Jawa Tengah", residenceExpiry: "2026-10-15", entryMonth: "2023-04", expectedGraduation: "2026-09", funding: [{ value: "Biaya sendiri", from: "April 2023" }], membership: [{ status: "Berakhir", reason: "Masa berlaku habis tanpa perpanjangan", date: "15 Okt 2026" }, { status: "Aktif", reason: "Perpanjangan disetujui", date: "12 Okt 2025" }] },
    "PPIJ-02937": { gender: "L", originProvince: "Sulawesi Selatan", residenceStatus: "Peneliti", residenceExpiry: "2026-12-29", degree: "researcher", faculty: "", studyProgram: "", entryMonth: "2024-10", expectedGraduation: "", lab: "Lab Material Science", studentNumber: "", category: "LUAR_BIASA", subtype: "researcher", funding: [{ value: "Beasiswa MEXT", from: "Oktober 2024" }], interests: ["Riset kecerdasan buatan"], membership: [{ status: "Ditangguhkan", reason: "Menunggu klarifikasi pembayaran iuran", date: "29 Okt 2026" }, { status: "Aktif", reason: "Kartu anggota diterbitkan", date: "2 Okt 2024" }] },
    "PPIJ-02936": { originProvince: "DKI Jakarta", birthDate: "2000-02-11", membership: [{ status: "Dicabut", reason: "Pelanggaran AD/ART", date: "24 Nov 2026" }, { status: "Aktif", reason: "Kartu anggota diterbitkan", date: "4 Jan 2025" }] },
    "PPIJ-02934": { gender: "L", category: null, categorySource: null, originProvince: "Jawa Barat", birthDate: "2003-01-20", entryMonth: "2025-10", expectedGraduation: "", faculty: "", lab: "", studentNumber: "", interests: [], funding: [{ value: "Biaya sendiri", from: "Oktober 2025" }], membership: [{ status: "Belum lengkap", reason: "Pendaftaran impor menunggu kelengkapan", date: "28 Okt 2026" }] },
    "PPIJ-02933": { category: "LUAR_BIASA", subtype: "short_study", categorySource: "override", categoryReason: "Program pertukaran enam bulan diperpanjang menjadi satu tahun", originProvince: "Jawa Timur", entryMonth: "2025-09", expectedGraduation: "2026-08", funding: [{ value: "Beasiswa MEXT", from: "September 2025" }], membership: [{ status: "Belum lengkap", reason: "Pendaftaran impor menunggu kelengkapan", date: "27 Okt 2026" }] },
  };
  return { ...base, ...overrides[member.id] };
};

const maskDate = (iso: string) => (iso ? `••/••/${iso.slice(0, 4)}` : "—");
const maskPhone = (phone: string) => (phone ? `${phone.slice(0, 3)} •• •••• ••••` : "—");
const maskExpiry = (iso: string) => (iso ? `•• •••• ${iso.slice(0, 4)}` : "—");
const maskEmergency = (contact: ProfileData["emergency"]) => `${contact.name} (${contact.relationship}) · nomor disembunyikan`;
const formatMonth = (value: string) => (value ? new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}-01T00:00:00Z`)) : "—");
const formatDate = (value: string) => (value ? new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`)) : "—");

export function MemberWorkspace({ scope, onNotice }: { scope: Scope; onNotice?: (message: string, tone?: "success" | "error") => void }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string[]>([]);
  const [komsat, setKomsat] = useState<string[]>([]);
  const [institution, setInstitution] = useState<string[]>([]);
  const [degree, setDegree] = useState<string[]>([]);
  const [major, setMajor] = useState<string[]>([]);
  const [scholarship, setScholarship] = useState<string[]>([]);
  const [source, setSource] = useState<string[]>([]);
  const [activation, setActivation] = useState<string[]>([]);
  const [expiry, setExpiry] = useState<string[]>([]);
  const [category, setCategory] = useState<string[]>([]);
  const [roster, setRoster] = useState(members);
  const [profiles, setProfiles] = useState<Record<string, ProfileData>>(() => Object.fromEntries(members.map((member) => [member.id, profileFor(member)])));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mode, setMode] = useState<"detail" | "edit" | "category">("detail");
  const [educationFocus, setEducationFocus] = useState(false);
  const [revealed, setRevealed] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const scoped = useMemo(() => roster.filter((member) => scope === "national" || (scope === "korda" ? member.region === "Kanto" : member.komsat === "Tokyo")), [roster, scope]);
  const selected = roster.find((member) => member.id === selectedId) ?? null;
  const profile = selected ? profiles[selected.id] : null;
  const applyStatus = (id: string, nextStatus: string, message: string) => {
    setRoster((current) => current.map((member) => (member.id === id ? { ...member, status: nextStatus } : member)));
    onNotice?.(message);
  };
  const closeMember = () => { setSelectedId(null); setMode("detail"); setRevealed([]); setEducationFocus(false); };
  const openMember = (id: string) => { setSelectedId(id); setMode("detail"); setRevealed([]); setEducationFocus(false); };
  const reveal = (field: string) => setRevealed((current) => (current.includes(field) ? current : [...current, field]));
  const hide = (field: string) => setRevealed((current) => current.filter((item) => item !== field));
  const saveEdit = (patch: Partial<ProfileData>) => {
    if (!selected) return;
    const movedKomsat = Boolean(patch.komsat && patch.komsat !== profiles[selected.id].komsat);
    setProfiles((current) => ({ ...current, [selected.id]: { ...current[selected.id], ...patch } }));
    setRoster((current) => current.map((member) => (member.id === selected.id ? { ...member, komsat: patch.komsat ?? member.komsat, institution: patch.institution ?? member.institution, degree: patch.degree ? patch.degree.toUpperCase() : member.degree } : member)));
    setMode("detail");
    const mail = movedKomsat
      ? (Object.keys(patch).filter((key) => key !== "komsat").length > 0
        ? "anggota menerima satu email M-17 yang menyebut perpindahan komsat"
        : "anggota menerima email pindah komsat M-08")
      : "anggota menerima email pemberitahuan M-17";
    onNotice?.(`Data anggota diperbarui. Nomor anggota ${selected.id} tidak berubah; ${mail}.`);
  };
  const saveCategory = (nextCategory: Category, nextSubtype: Subtype, reason: string) => {
    if (!selected) return;
    setProfiles((current) => ({ ...current, [selected.id]: { ...current[selected.id], category: nextCategory, subtype: nextSubtype, categorySource: "override", categoryReason: reason, categoryReplacedAt: undefined } }));
    setMode("detail");
    onNotice?.(`Kategori ${selected.name} disetel ke ${categoryLong(nextCategory, nextSubtype)}. Alasan, pelaku, dan waktu dicatat pada riwayat kategori.`);
  };
  const visible = scoped.filter((member) => {
    const q = search.trim().toLocaleLowerCase("id");
    const inGroup = (values: string[], value: string) => values.length === 0 || values.includes(value);
    return (!q || `${member.name} ${member.email} ${member.id} ${member.komsat}`.toLocaleLowerCase("id").includes(q))
      && inGroup(status, member.status) && inGroup(komsat, member.komsat)
      && inGroup(institution, member.institution) && inGroup(degree, member.degree)
      && inGroup(major, member.major) && inGroup(scholarship, member.scholarship)
      && inGroup(source, member.source) && inGroup(activation, member.activation)
      && inGroup(category, categoryFilterValue(profiles[member.id].category))
      && (inGroup(expiry, member.expiryWindow) || (expiry.includes("60 hari ke depan") && member.expiryWindow === "30 hari ke depan"));
  });
  const clear = () => { setSearch(""); setStatus([]); setKomsat([]); setInstitution([]); setDegree([]); setMajor([]); setScholarship([]); setSource([]); setActivation([]); setExpiry([]); setCategory([]); };
  const groups = [
    { label: "Status", values: status, set: setStatus }, { label: "Komsat", values: komsat, set: setKomsat },
    { label: "Institusi", values: institution, set: setInstitution }, { label: "Jenjang", values: degree, set: setDegree },
    { label: "Jurusan", values: major, set: setMajor }, { label: "Kategori", values: category, set: setCategory },
    { label: "Pendanaan", values: scholarship, set: setScholarship }, { label: "Sumber", values: source, set: setSource },
    { label: "Aktivasi", values: activation, set: setActivation }, { label: "Masa berlaku", values: expiry, set: setExpiry },
  ];
  const active = groups.flatMap(({ label, values, set }) => values.map((value) => ({ label, value, onRemove: () => set((current) => current.filter((item) => item !== value)) })));
  const editing = mode !== "detail";
  return <section className="member-workspace" aria-label="Direktori anggota">
    <div className="member-workspace-intro"><div><h2>Direktori anggota</h2><p>Cari anggota dan periksa keanggotaan dalam ruang kerja ini.</p></div><span>{visible.length === scoped.length ? `${scoped.length} anggota contoh` : `${visible.length} dari ${scoped.length} anggota contoh`}</span></div>
    <SearchFilter className="verification-filters member-filters" searchValue={search} onSearchChange={setSearch} searchPlaceholder="Cari nama, nomor, email, atau komsat" filters={<><SearchableMultiSelect compact label="Status" values={status} options={["Aktif", "Berakhir", "Ditangguhkan", "Dicabut", "Belum lengkap"]} allLabel="Semua status" onChange={setStatus} /><Button type="button" variant="outline" className="member-filter-open" onClick={() => setFiltersOpen(true)} aria-label="Filter anggota lanjutan"><IconAdjustmentsHorizontal size={17} /><span>Filter</span>{active.length > status.length && <span className="member-filter-count">{active.length - status.length}</span>}</Button></>} activeFilters={active} onClearAll={clear} />
    <AdminDrawer density="compact" open={filtersOpen} onOpenChange={setFiltersOpen} title="Filter anggota" description="Pilih beberapa pilihan dalam tiap kategori untuk mempersempit direktori." locale="id" className="member-filter-drawer" footer={<div className="member-filter-footer"><Button variant="outline" onClick={clear}>Hapus semua</Button><Button onClick={() => setFiltersOpen(false)}>Lihat {visible.length} anggota</Button></div>}>
      <div className="member-filter-form">
        <SearchableMultiSelect label="Komsat" values={komsat} options={units} allLabel="Semua komsat" onChange={setKomsat} />
        <SearchableMultiSelect label="Kategori" values={category} options={["Anggota Biasa", "Anggota Luar Biasa", "Belum ditentukan"]} allLabel="Semua kategori" onChange={setCategory} />
        <SearchableMultiSelect label="Institusi" values={institution} options={[...new Set(members.map((member) => member.institution))]} allLabel="Semua institusi" onChange={setInstitution} />
        <SearchableMultiSelect label="Jenjang" values={degree} options={["S1", "S2", "S3"]} allLabel="Semua jenjang" onChange={setDegree} />
        <SearchableMultiSelect label="Jurusan" values={major} options={[...new Set(members.map((member) => member.major))]} allLabel="Semua jurusan" onChange={setMajor} />
        <SearchableMultiSelect label="Pendanaan" values={scholarship} options={["LPDP", "MEXT", "Mandiri"]} allLabel="Semua pendanaan" onChange={setScholarship} />
        <SearchableMultiSelect label="Sumber" values={source} options={["Pendaftaran mandiri", "Impor anggota", "Pendaftaran terbantu"]} allLabel="Semua sumber" onChange={setSource} />
        <SearchableMultiSelect label="Aktivasi" values={activation} options={["Sudah aktivasi", "Belum aktivasi", "Email bermasalah"]} allLabel="Semua aktivasi" onChange={setActivation} />
        <SearchableMultiSelect label="Masa berlaku" values={expiry} options={["30 hari ke depan", "60 hari ke depan", "Kedaluwarsa"]} allLabel="Semua masa berlaku" onChange={setExpiry} />
      </div>
    </AdminDrawer>
    <div className="member-table"><Table><TableHeader><TableRow><TableHead>Anggota</TableHead><TableHead>No. anggota</TableHead><TableHead>Komsat</TableHead><TableHead>Pendidikan</TableHead><TableHead>Kategori</TableHead><TableHead>Status</TableHead><TableHead>Berlaku sampai</TableHead></TableRow></TableHeader><TableBody>{visible.map((member) => <TableRow key={member.id}><TableCell><button type="button" className="member-name-button" onClick={() => openMember(member.id)} aria-label={`Buka detail ${member.name}`}><strong>{member.name}</strong><small>{member.email}</small></button></TableCell><TableCell>{member.id}</TableCell><TableCell>{member.komsat}</TableCell><TableCell><strong>{member.institution}</strong><small>{member.degree} · {member.major}</small></TableCell><TableCell><Badge variant={categoryVariant(profiles[member.id].category)}>{categoryShort(profiles[member.id].category, profiles[member.id].subtype)}</Badge>{profiles[member.id].categoryReplacedAt && <small>Override diganti</small>}</TableCell><TableCell><Badge variant={statusVariant(member.status)}>{member.status}</Badge>{member.badge && <small>{member.badge}</small>}</TableCell><TableCell>{member.validUntil}</TableCell></TableRow>)}</TableBody></Table></div>
    <div className="member-mobile-list">{visible.map((member) => <button type="button" key={member.id} onClick={() => openMember(member.id)}><span className="member-mobile-top"><strong>{member.name}</strong><Badge variant={statusVariant(member.status)}>{member.status}</Badge></span><small>{member.email}</small><span>No. {member.id} · {member.komsat}</span><span>{member.institution} · {member.degree}</span><span className="member-mobile-category">Kategori <Badge variant={categoryVariant(profiles[member.id].category)}>{categoryShort(profiles[member.id].category, profiles[member.id].subtype)}</Badge></span><span>Berlaku sampai {member.validUntil}<IconArrowRight size={17} /></span></button>)}</div>
    {visible.length === 0 && <div className="member-empty"><IconSearch size={25} /><strong>Tidak ada anggota yang cocok</strong><p>Coba kata kunci atau filter lain.</p><Button variant="outline" size="sm" onClick={clear}>Hapus filter</Button></div>}
    <AdminDrawer size="lg" density="compact" step={editing ? 2 : 1} onBack={() => setMode("detail")} open={Boolean(selected)} onOpenChange={(open) => { if (!open) closeMember(); }} title={mode === "edit" ? "Ubah data anggota" : mode === "category" ? "Ubah kategori anggota" : selected?.name ?? "Detail anggota"} description={selected ? (mode === "edit" ? `${selected.id} · Nomor anggota tidak berubah` : mode === "category" ? `${selected.name} · ${selected.id}` : selected.id) : undefined} locale="id" className="member-detail-drawer" footer={mode === "edit" ? <Button size="sm" type="submit" form="member-edit-form">Simpan perubahan</Button> : mode === "category" ? <Button size="sm" type="submit" form="category-override-form">Simpan kategori</Button> : undefined}>
      {selected && profile && (mode === "edit" ? <MemberEditForm key={`edit-${selected.id}`} member={selected} profile={profile} scope={scope} focusEducation={educationFocus} onSave={saveEdit} /> : mode === "category" ? <CategoryOverrideForm key={`category-${selected.id}`} profile={profile} onSave={saveCategory} /> : <MemberDetail member={selected} profile={profile} scope={scope} revealed={revealed} onReveal={reveal} onHide={hide} canOverrideCategory={scope !== "komsat"} onEdit={() => setMode("edit")} onOverride={() => setMode("category")} onCompleteEducation={() => { setEducationFocus(true); setMode("edit"); }} onStatus={(nextStatus, message) => { applyStatus(selected.id, nextStatus, message); if (nextStatus === "Dicabut") closeMember(); }} />)}
    </AdminDrawer>
  </section>;
}

type DrawerAction = "tangguhkan" | "aktifkan" | "cabut" | null;

const actionLabels: Record<Exclude<DrawerAction, null>, string> = {
  tangguhkan: "Tangguhkan",
  aktifkan: "Aktifkan kembali",
  cabut: "Cabut keanggotaan",
};

/**
 * Status-action authority, from production docs/rbac.md (permission matrix): suspend and reactivate
 * need Admin Korda or Admin Nasional; revoke needs Admin Nasional. A komsat move is no longer a
 * status action: the member emails their admin and the admin moves the komsat in "Ubah data anggota"
 * (plan D5), so this list has no transfer entry.
 */
function allowedActions(status: string, scope: Scope): Exclude<DrawerAction, null>[] {
  if (scope === "komsat") return [];
  if (status === "Aktif") return scope === "national" ? ["tangguhkan", "cabut"] : ["tangguhkan"];
  if (status === "Ditangguhkan") return ["aktifkan"];
  return [];
}

function Rows({ rows }: { rows: { label: string; value: ReactNode; span?: boolean }[] }) {
  return <dl>{rows.map(({ label, value, span }) => <div key={label} className={span ? "member-row-span" : undefined}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>;
}

function Chips({ values, empty = "Belum diisi" }: { values: string[]; empty?: string }) {
  if (values.length === 0) return <span className="member-chip-empty">{empty}</span>;
  return <span className="member-chip-list">{values.map((value) => <span key={value}>{value}</span>)}</span>;
}

/** A masked value with the Tampilkan action that represents the audited admin reveal. */
function RevealValue({ field, masked, clear, revealed, onReveal, onHide }: { field: string; masked: string; clear: string; revealed: boolean; onReveal: (field: string) => void; onHide: (field: string) => void }) {
  return <span className="member-reveal-line">
    <span className={revealed ? "member-reveal-value" : "member-masked-value"} aria-label={revealed ? undefined : "Nilai tersembunyi"}>{revealed ? clear : masked}</span>
    <button type="button" className="member-reveal-toggle" onClick={() => (revealed ? onHide(field) : onReveal(field))}>
      {revealed ? <><IconEyeOff size={14} />Sembunyikan</> : <><IconEye size={14} />Tampilkan</>}
    </button>
  </span>;
}

function MemberDetail({ member, profile, scope, revealed, onReveal, onHide, canOverrideCategory, onEdit, onOverride, onCompleteEducation, onStatus }: {
  member: Member; profile: ProfileData; scope: Scope; revealed: string[]; onReveal: (field: string) => void; onHide: (field: string) => void;
  canOverrideCategory: boolean; onEdit: () => void; onOverride: () => void; onCompleteEducation: () => void; onStatus: (status: string, message: string) => void;
}) {
  const [action, setAction] = useState<DrawerAction>(null);
  const [reason, setReason] = useState("");
  const delivery = member.activation === "Email bermasalah" ? "Gagal dikirim" : member.activation === "Belum aktivasi" ? "Belum dikonfirmasi" : "Terkirim";
  const lastEmail = member.activation === "Belum aktivasi" ? "Belum ada email tercatat" : "Informasi keanggotaan · 30 Okt 2026";
  const actions = allowedActions(member.status, scope);
  return <div className="member-detail">
    <div className="member-detail-head">
      <div className="member-detail-stamp"><IconUsers size={16} aria-hidden="true" /><span>Data sintetis untuk meninjau tampilan direktori</span></div>
      <Button size="sm" variant="outline" onClick={onEdit}><IconPencil size={15} /> Ubah data anggota</Button>
    </div>
    <p className="member-detail-audit"><IconShieldLock size={15} aria-hidden="true" /><span>Nilai bertanda tersembunyi hanya terbuka lewat <strong>Tampilkan</strong>. Setiap pembukaan tercatat dalam audit.</span></p>
    <section><h3>Data diri</h3><Rows rows={[
      { label: "Nama lengkap", value: profile.fullName, span: true },
      { label: "Jenis kelamin", value: profile.gender === "L" ? "Laki-laki" : "Perempuan" },
      { label: "Provinsi asal", value: profile.originProvince },
      { label: "Tanggal lahir", value: <RevealValue field="birthDate" masked={maskDate(profile.birthDate)} clear={formatDate(profile.birthDate)} revealed={revealed.includes("birthDate")} onReveal={onReveal} onHide={onHide} />, span: true },
    ]} /></section>
    <section><h3>Kontak</h3><Rows rows={[
      { label: "Nama panggilan", value: profile.nickname },
      { label: "Nomor telepon atau WhatsApp", value: <RevealValue field="phone" masked={maskPhone(profile.phone)} clear={profile.phone} revealed={revealed.includes("phone")} onReveal={onReveal} onHide={onHide} /> },
      { label: "LINE ID", value: profile.lineId },
      { label: "Email akun", value: member.email },
    ]} /></section>
    <section><h3>Domisili di Jepang</h3><Rows rows={[
      { label: "Prefektur", value: profile.prefecture },
      { label: "Kota atau kecamatan", value: profile.city },
    ]} /></section>
    <section><h3>Pendidikan</h3><Rows rows={[
      { label: "Institusi", value: profile.institution, span: true },
      { label: "Fakultas atau sekolah pascasarjana", value: profile.faculty || "—" },
      { label: "Jenjang", value: degrees.find((option) => option.value === profile.degree)?.label ?? profile.degree.toUpperCase() },
      { label: "Program studi", value: profile.studyProgram || "—" },
      { label: "Bulan masuk", value: formatMonth(profile.entryMonth) },
      { label: "Perkiraan lulus", value: formatMonth(profile.expectedGraduation) },
      { label: "Lab atau pembimbing", value: profile.lab || "—" },
      { label: "Nomor pelajar", value: profile.studentNumber || "—" },
    ]} />
      {!profile.entryMonth || !profile.expectedGraduation ? <div className="member-detail-prompt">
        <IconAlertCircle size={16} aria-hidden="true" />
        <div><strong>Data studi belum lengkap</strong><p>Bulan masuk dan perkiraan lulus menentukan kategori anggota. Lengkapi lewat “Ubah data anggota”.</p></div>
        <Button size="sm" variant="outline" onClick={onCompleteEducation}><IconPencil size={15} /> Lengkapi data studi</Button>
      </div> : null}
    </section>
    <section><h3>Pendanaan</h3><Rows rows={[{ label: "Pendanaan saat ini", value: <Chips values={profile.funding.filter((row) => !row.to).map((row) => row.value)} />, span: true }]} />
      {profile.funding.some((row) => row.to) && <div className="member-subsection"><h4>Riwayat pendanaan</h4><ul className="member-dated-list">{profile.funding.filter((row) => row.to).map((row) => <li key={`${row.value}-${row.to}`}><span>{row.value}</span><small>{row.from} – {row.to}</small></li>)}</ul></div>}
    </section>
    <section><h3>Minat</h3><Chips values={profile.interests} /></section>
    <section><h3>Izin tinggal dan kontak darurat</h3><Rows rows={[
      { label: "Status izin tinggal", value: profile.residenceStatus },
      { label: "Izin tinggal berlaku sampai", value: <RevealValue field="residenceExpiry" masked={maskExpiry(profile.residenceExpiry)} clear={formatDate(profile.residenceExpiry)} revealed={revealed.includes("residenceExpiry")} onReveal={onReveal} onHide={onHide} /> },
      { label: "Kontak darurat", value: <RevealValue field="emergency" masked={maskEmergency(profile.emergency)} clear={`${profile.emergency.name} (${profile.emergency.relationship}) · ${profile.emergency.phone} · ${profile.emergency.address}`} revealed={revealed.includes("emergency")} onReveal={onReveal} onHide={onHide} />, span: true },
    ]} />
      <p className="member-detail-note-inline"><IconLock size={14} aria-hidden="true" />Izin tinggal dan kontak darurat disimpan terenkripsi dan hanya terbuka lewat aksi audit.</p>
    </section>
    <section><h3>Keanggotaan</h3><Rows rows={[
      { label: "Nomor anggota", value: <span className="member-mono">{member.id}</span> },
      { label: "Status", value: <Badge variant={statusVariant(member.status)}>{member.status}</Badge> },
      { label: "Komsat", value: profile.komsat },
      { label: "Korda", value: profile.korda },
      { label: "Kategori", value: <span className="member-category-cell"><Badge variant={categoryVariant(profile.category)}>{categoryLong(profile.category, profile.subtype)}</Badge>{profile.categorySource && <small>{categorySourceLabel[profile.categorySource]}</small>}{profile.categoryReplacedAt && <small>Override sebelumnya diganti data akademik pada {profile.categoryReplacedAt}</small>}</span>, span: true },
      ...(profile.categoryReason ? [{ label: "Alasan kategori", value: profile.categoryReason, span: true }] : []),
      { label: "Berlaku sampai", value: member.validUntil },
      { label: "Sumber", value: member.source },
      { label: "Aktivasi", value: member.activation },
      { label: "Status email", value: delivery },
      { label: "Email terakhir", value: lastEmail, span: true },
    ]} />
      {canOverrideCategory ? <Button size="sm" variant="outline" className="member-category-open" onClick={onOverride}><IconShieldLock size={15} /> Ubah kategori</Button> : <p className="member-detail-note-inline"><IconLock size={14} aria-hidden="true" />Hanya admin korda atau nasional yang dapat mengubah kategori anggota.</p>}
      <div className="member-subsection"><h4>Riwayat keanggotaan</h4><Timeline items={profile.membership.map((entry, index) => ({ title: entry.status, description: entry.reason, time: entry.date, state: index === 0 ? "current" : "complete" }))} /></div>
    </section>
    <section className="member-actions"><div className="member-actions-head"><h3>Tindakan status</h3><p>Wewenang mengikuti matriks RBAC produksi. Pindah komsat dilakukan di “Ubah data anggota”, bukan di sini.</p></div>
      {actions.length === 0 ? (
        <p className="member-actions-note">{scope === "komsat" ? "Tindakan status memerlukan wewenang admin korda atau nasional." : member.status === "Belum lengkap" ? "Anggota impor menunggu kelengkapan dan aktivasi — tindakan status berlaku setelah status Aktif." : member.status === "Dicabut" ? "Keanggotaan yang dicabut bersifat final; aktif kembali hanya melalui pendaftaran baru." : "Tidak ada tindakan status untuk keanggotaan berakhir — perpanjangan melalui alur pendaftaran anggota."}</p>
      ) : action === null ? (
        <div className="member-action-buttons">
          {actions.map((key) => (
            <Button key={key} size="sm" variant={key === "cabut" ? "destructive" : "outline"} onClick={() => { setAction(key); setReason(""); }}>{actionLabels[key]}</Button>
          ))}
        </div>
      ) : (
        <div className="member-action-pane">
          <p className="member-action-title">{actionLabels[action]}: <strong>{member.name}</strong></p>
          {action === "aktifkan" ? (
            <p className="member-action-copy">Keanggotaan kembali Aktif dengan masa berlaku yang sama.</p>
          ) : (
            <label className="member-action-field"><span>Alasan {action === "cabut" ? "pencabutan" : "penangguhan"} (wajib)</span>
              <textarea value={reason} onChange={(event) => setReason(event.target.value)} rows={3} placeholder={action === "cabut" ? "Contoh: pelanggaran AD/ART" : "Contoh: menunggu klarifikasi pembayaran"} />
            </label>
          )}
          {action === "cabut" ? <p className="member-action-copy warn">Pencabutan bersifat final dan hanya dapat dilakukan Admin Nasional. Anggota memerlukan pendaftaran baru untuk aktif kembali.</p> : null}
          <div className="member-action-buttons">
            <Button size="sm" variant="outline" onClick={() => setAction(null)}>Batal</Button>
            <Button size="sm" variant={action === "aktifkan" ? "default" : "destructive"} disabled={(action === "tangguhkan" || action === "cabut") && reason.trim().length < 4} onClick={() => {
              onStatus(action === "aktifkan" ? "Aktif" : "Dicabut", `Tindakan contoh: ${member.name} ${actionLabels[action].toLowerCase()} — kontrak produksi di docs/admin-integration/anggota.md.`);
              setAction(null);
            }}>{`Konfirmasi ${actionLabels[action].toLowerCase()}`}</Button>
          </div>
        </div>
      )}
    </section>
  </div>;
}

/** The audited-server simulation switch: it stands in for the API's answers until integration. */
type SimulatedError = "none" | "forbidden" | "komsat_scope_required";
const MONTH_PATTERN = /^[0-9]{4}-(0[1-9]|1[0-2])$/;

function ErrorPreview({ value, onChange }: { value: SimulatedError; onChange: (value: SimulatedError) => void }) {
  return <div className="member-edit-preview">
    <label htmlFor="member-edit-preview">Pratinjau jawaban server (demo)</label>
    <Select value={value} onValueChange={(next) => onChange(next as SimulatedError)}>
      <SelectTrigger id="member-edit-preview" size="sm"><SelectValue /></SelectTrigger>
      <SelectContent>
        <SelectItem value="none">Tidak ada galat</SelectItem>
        <SelectItem value="forbidden">403 forbidden — di luar cakupan</SelectItem>
        <SelectItem value="komsat_scope_required">403 komsat_scope_required</SelectItem>
      </SelectContent>
    </Select>
    <p>Kontrol pratinjau: menggantikan jawaban server sampai integrasi.</p>
  </div>;
}

function MemberEditForm({ member, profile, scope, focusEducation = false, onSave }: { member: Member; profile: ProfileData; scope: Scope; focusEducation?: boolean; onSave: (patch: Partial<ProfileData>) => void }) {
  const educationRef = useRef<HTMLDivElement>(null);
  /** Opened from the "complete the study dates" prompt: land on the education fields, not the top. */
  useEffect(() => {
    if (!focusEducation || !educationRef.current) return;
    educationRef.current.scrollIntoView({ block: "center" });
    educationRef.current.querySelector("input")?.focus({ preventScroll: true });
  }, [focusEducation]);
  const [fullName, setFullName] = useState(profile.fullName);
  /** The date of birth stays masked and is prefilled only from the audited reveal (Q47). */
  const [birthDate, setBirthDate] = useState("");
  const [birthRevealed, setBirthRevealed] = useState(false);
  const [gender, setGender] = useState<"L" | "P">(profile.gender);
  const [originProvince, setOriginProvince] = useState(profile.originProvince);
  const [institution, setInstitution] = useState(profile.institution);
  const [faculty, setFaculty] = useState(profile.faculty);
  const [degree, setDegree] = useState(profile.degree);
  const [studyProgram, setStudyProgram] = useState(profile.studyProgram);
  const [entryMonth, setEntryMonth] = useState(profile.entryMonth);
  const [graduation, setGraduation] = useState(profile.expectedGraduation);
  const [lab, setLab] = useState(profile.lab);
  const [studentNumber, setStudentNumber] = useState(profile.studentNumber);
  const [komsat, setKomsat] = useState(profile.komsat);
  const [reason, setReason] = useState("");
  const [simulated, setSimulated] = useState<SimulatedError>("none");
  const [errors, setErrors] = useState<{ [field: string]: string }>({});
  const komsatFixed = scope === "komsat";
  const revealBirth = () => { setBirthDate(profile.birthDate); setBirthRevealed(true); };
  const submit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const next: { [field: string]: string } = {};
    if (!reason.trim()) next.reason = "Alasan wajib diisi agar perubahan tercatat dalam audit.";
    if (fullName.trim().length < 3) next.fullName = "Nama lengkap minimal 3 karakter.";
    if (!institution.trim()) next.institution = "Institusi wajib diisi.";
    if (!degree) next.degree = "Pilih jenjang pendidikan.";
    if (!MONTH_PATTERN.test(entryMonth)) next.entryMonth = "Pilih bulan dan tahun masuk.";
    if (graduation && !MONTH_PATTERN.test(graduation)) next.graduation = "Pilih bulan dan tahun perkiraan lulus.";
    else if (graduation && MONTH_PATTERN.test(entryMonth) && graduation <= entryMonth) next.graduation = "Perkiraan lulus harus setelah bulan masuk.";
    if (simulated === "forbidden") next.form = "Permintaan ditolak karena cakupan Anda tidak lagi memuat anggota ini (403 forbidden). Tidak ada data yang berubah.";
    else if (simulated === "komsat_scope_required") next.komsat = "Butuh cakupan atas komsat asal dan tujuan untuk memindahkan anggota (403 komsat_scope_required). Anggota belum dipindahkan.";
    else if (!komsatFixed && komsat !== profile.komsat && !scopeUnits[scope].includes(komsat)) next.komsat = `Komsat ${komsat} di luar cakupan ruang kerja Anda. Butuh cakupan atas komsat asal dan tujuan (403 komsat_scope_required).`;
    setErrors(next);
    if (Object.values(next).some(Boolean)) return;
    onSave({
      fullName: fullName.trim(), gender, originProvince, institution: institution.trim(), faculty: faculty.trim(),
      degree, studyProgram: studyProgram.trim(), entryMonth, expectedGraduation: graduation, lab: lab.trim(),
      studentNumber: studentNumber.trim(), komsat, ...(birthRevealed && birthDate ? { birthDate } : {}),
    });
  };
  return <form id="member-edit-form" className="member-edit" noValidate onSubmit={submit} data-testid="member-edit-form">
    <p className="member-edit-note"><IconLock size={15} aria-hidden="true" /><span>Hanya data pendaftaran yang ditinjau yang diubah di sini. Kontak, domisili, pendanaan, dan minat diperbarui sendiri oleh anggota di Profil.</span></p>
    {errors.form && <p className="member-edit-error-form" role="alert"><IconAlertCircle size={16} aria-hidden="true" />{errors.form}</p>}
    <div className="member-edit-grid">
      <label className="member-edit-field"><span>Nama lengkap</span><Input value={fullName} onChange={(event) => setFullName(event.target.value)} aria-invalid={Boolean(errors.fullName)} />{errors.fullName && <small className="member-edit-error" role="alert">{errors.fullName}</small>}</label>
      <div className="member-edit-field"><span>Tanggal lahir</span>
        {birthRevealed ? <><Input type="date" value={birthDate} min="1900-01-01" max="2100-12-31" onChange={(event) => setBirthDate(event.target.value)} /><small className="member-edit-hint">Terbuka lewat aksi Tampilkan yang tercatat audit.</small></> : <div className="member-edit-reveal"><Input value={maskDate(profile.birthDate)} readOnly aria-label="Tanggal lahir tersembunyi" /><Button type="button" size="sm" variant="outline" onClick={revealBirth}><IconEye size={15} /> Tampilkan</Button></div>}
        {!birthRevealed && <small className="member-edit-hint">Terisi hanya setelah Tampilkan; tanpa itu nilai lama tetap dipakai.</small>}
      </div>
      <div className="member-edit-field"><span>Jenis kelamin</span><PillRadio ariaLabel="Jenis kelamin" value={gender} onChange={(value) => setGender(value as "L" | "P")} options={[{ value: "L", label: "Laki-laki" }, { value: "P", label: "Perempuan" }]} /></div>
      <div className="member-edit-field"><span>Provinsi asal</span><TypeAhead value={originProvince} onChange={setOriginProvince} options={provinces} placeholder="Ketik provinsi" /></div>
      <div className="member-edit-field member-edit-wide" ref={educationRef}><span>Institusi</span><TypeAhead value={institution} onChange={setInstitution} options={institutions} placeholder="Ketik nama institusi" />{errors.institution && <small className="member-edit-error" role="alert">{errors.institution}</small>}</div>
      <label className="member-edit-field"><span>Fakultas atau sekolah pascasarjana</span><Input value={faculty} onChange={(event) => setFaculty(event.target.value)} placeholder="Contoh: Sekolah Pascasarjana" /><small className="member-edit-hint">Opsional untuk pascadoktoral dan peneliti.</small></label>
      <div className="member-edit-field"><span>Jenjang</span>
        <Select value={degree} onValueChange={setDegree}><SelectTrigger size="sm" aria-invalid={Boolean(errors.degree)}><SelectValue placeholder="Pilih jenjang" /></SelectTrigger><SelectContent>{degrees.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent></Select>
        {errors.degree && <small className="member-edit-error" role="alert">{errors.degree}</small>}
      </div>
      <label className="member-edit-field member-edit-wide"><span>Program studi</span><Input value={studyProgram} onChange={(event) => setStudyProgram(event.target.value)} placeholder="Contoh: Ilmu Komputer" /></label>
      <div className="member-edit-field"><MonthPicker label="Bulan masuk" value={entryMonth} onChange={setEntryMonth} />{errors.entryMonth && <small className="member-edit-error" role="alert">{errors.entryMonth}</small>}</div>
      <div className="member-edit-field"><MonthPicker label="Perkiraan lulus" value={graduation} onChange={setGraduation} /><small className="member-edit-hint">Untuk peneliti dan pascadoktoral dibaca sebagai masa akhir kontrak.</small>{errors.graduation && <small className="member-edit-error" role="alert">{errors.graduation}</small>}</div>
      <label className="member-edit-field"><span>Lab atau pembimbing</span><Input value={lab} onChange={(event) => setLab(event.target.value)} placeholder="Contoh: Lab Sistem Informasi" /></label>
      <label className="member-edit-field"><span>Nomor pelajar</span><Input value={studentNumber} onChange={(event) => setStudentNumber(event.target.value)} placeholder="Contoh: 76123456" /></label>
      <div className="member-edit-field member-edit-wide"><span>Komsat</span>
        {komsatFixed ? <p className="member-edit-fixed">{profile.komsat}<small>Admin komsat tidak dapat memindahkan anggota ke komsat lain.</small></p> : <SearchableUnitMenu label="Komsat tujuan" values={[komsat]} options={scopeUnits[scope]} onChange={(values) => setKomsat(values[0] ?? profile.komsat)} />}
        {!komsatFixed && <small className="member-edit-hint">Hanya komsat di dalam cakupan ruang kerja ini yang ditawarkan. Bila cakupan berubah sebelum disimpan, server menolak dengan 403 komsat_scope_required.</small>}
        {errors.komsat && <small className="member-edit-error" role="alert">{errors.komsat}</small>}
      </div>
    </div>
    <div className="member-edit-inert"><span>Nomor anggota</span><strong className="member-mono">{member.id}</strong><small>Nomor anggota tidak berubah, termasuk setelah pindah komsat.</small></div>
    <div className="member-edit-field member-edit-reason"><label htmlFor="member-edit-reason">Alasan perubahan (wajib)</label><Textarea id="member-edit-reason" rows={4} value={reason} onChange={(event) => setReason(event.target.value)} maxLength={500} placeholder="Contoh: data pendidikan diperbaiki sesuai surat keterangan kampus" aria-invalid={Boolean(errors.reason)} />{errors.reason ? <small className="member-edit-error" role="alert">{errors.reason}</small> : <small className="member-edit-hint">Tercatat dalam audit bersama nama bidang yang berubah; tanggal lahir hanya disebut namanya.</small>}</div>
    <ErrorPreview value={simulated} onChange={setSimulated} />
  </form>;
}

function CategoryOverrideForm({ profile, onSave }: { profile: ProfileData; onSave: (category: Category, subtype: Subtype, reason: string) => void }) {
  const [category, setCategory] = useState<"BIASA" | "LUAR_BIASA">(profile.category === "LUAR_BIASA" ? "LUAR_BIASA" : "BIASA");
  const [subtype, setSubtype] = useState<Subtype>(profile.subtype);
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState<{ [field: string]: string }>({});
  const submit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const next: { [field: string]: string } = {};
    if (!reason.trim()) next.reason = "Alasan wajib diisi agar penetapan tercatat pada riwayat kategori.";
    if (category === "LUAR_BIASA" && !subtype) next.subtype = "Pilih subtipe untuk Anggota Luar Biasa.";
    setErrors(next);
    if (Object.values(next).some(Boolean)) return;
    onSave(category, category === "LUAR_BIASA" ? subtype : null, reason.trim());
  };
  return <form id="category-override-form" className="member-edit" noValidate onSubmit={submit} data-testid="category-override-form">
    <p className="member-edit-note"><IconShieldLock size={15} aria-hidden="true" /><span>Kategori berasal dari data akademik (AD/ART Pasal 6). Penetapan manual berlaku sampai perubahan data akademik berikutnya disetujui.</span></p>
    <fieldset className="member-edit-choice"><legend>Kategori</legend>
      <PillRadio ariaLabel="Kategori" value={category} onChange={(value) => setCategory(value as "BIASA" | "LUAR_BIASA")} options={[{ value: "BIASA", label: "Anggota Biasa" }, { value: "LUAR_BIASA", label: "Anggota Luar Biasa" }]} />
      {errors.category && <small className="member-edit-error" role="alert">{errors.category}</small>}
    </fieldset>
    {category === "LUAR_BIASA" && <fieldset className="member-edit-choice"><legend>Subtipe</legend>
      <PillRadio ariaLabel="Subtipe" value={subtype ?? ""} onChange={(value) => setSubtype(value as Subtype)} options={[{ value: "postdoc", label: "Pascadoktoral" }, { value: "researcher", label: "Peneliti" }, { value: "short_study", label: "Studi singkat" }]} />
      {errors.subtype && <small className="member-edit-error" role="alert">{errors.subtype}</small>}
    </fieldset>}
    <div className="member-edit-field member-edit-reason"><label htmlFor="category-override-reason">Alasan penetapan (wajib)</label><Textarea id="category-override-reason" rows={4} value={reason} onChange={(event) => setReason(event.target.value)} maxLength={500} placeholder="Contoh: program enam bulan diperpanjang menjadi satu tahun" aria-invalid={Boolean(errors.reason)} />{errors.reason ? <small className="member-edit-error" role="alert">{errors.reason}</small> : <small className="member-edit-hint">Disimpan bersama pelaku dan waktu penetapan pada riwayat kategori.</small>}</div>
    <p className="member-edit-warning">Kategori menentukan hak pilih: hanya Anggota Biasa yang dapat memilih dan dipilih pada Pemira.</p>
  </form>;
}

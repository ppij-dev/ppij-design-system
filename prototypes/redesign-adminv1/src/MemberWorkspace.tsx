import { useMemo, useState } from "react";
import { IconAdjustmentsHorizontal, IconArrowRight, IconSearch, IconUsers } from "@tabler/icons-react";
import { AdminDrawer, Badge, Button, SearchFilter, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "ppij-design-system";
import { SearchableMultiSelect } from "./SearchableMultiSelect";
import "./MemberWorkspace.css";

type Scope = "national" | "korda" | "komsat";
type Member = { id: string; name: string; email: string; komsat: string; region: string; institution: string; degree: string; major: string; status: string; validUntil: string; source: string; scholarship: string; activation: string; expiryWindow: string; badge?: string };

const members: Member[] = [
  { id: "PPIJ-02941", name: "Contoh Anggota A", email: "anggota-a@example.invalid", komsat: "Tokyo", region: "Kanto", institution: "The University of Tokyo", degree: "S2", major: "Teknik", status: "Aktif", validUntil: "24 Okt 2027", source: "Pendaftaran mandiri", scholarship: "LPDP", activation: "Sudah aktivasi", expiryWindow: "" },
  { id: "PPIJ-02940", name: "Contoh Anggota E", email: "anggota-e@example.invalid", komsat: "Tokyo", region: "Kanto", institution: "Waseda University", degree: "S1", major: "Ekonomi", status: "Aktif", validUntil: "21 Okt 2027", source: "Impor anggota", scholarship: "Mandiri", activation: "Sudah aktivasi", expiryWindow: "" },
  { id: "PPIJ-02939", name: "Contoh Anggota F", email: "anggota-f@example.invalid", komsat: "Yokohama", region: "Kanto", institution: "Yokohama National University", degree: "S3", major: "Pendidikan", status: "Aktif", validUntil: "18 Okt 2027", source: "Pendaftaran mandiri", scholarship: "MEXT", activation: "Sudah aktivasi", expiryWindow: "" },
  { id: "PPIJ-02938", name: "Contoh Anggota G", email: "anggota-g@example.invalid", komsat: "Osaka", region: "Kansai", institution: "Osaka University", degree: "S2", major: "Kesehatan", status: "Kedaluwarsa", validUntil: "15 Okt 2026", source: "Pendaftaran terbantu", scholarship: "Mandiri", activation: "Belum aktivasi", expiryWindow: "Kedaluwarsa", badge: "Perlu perpanjangan" },
  { id: "PPIJ-02937", name: "Contoh Anggota H", email: "anggota-h@example.invalid", komsat: "Nagoya", region: "Chubu", institution: "Nagoya University", degree: "S3", major: "Sains", status: "Ditangguhkan", validUntil: "29 Des 2026", source: "Impor anggota", scholarship: "MEXT", activation: "Email bermasalah", expiryWindow: "60 hari ke depan" },
  { id: "PPIJ-02936", name: "Contoh Anggota I", email: "anggota-i@example.invalid", komsat: "Tokyo", region: "Kanto", institution: "Tokyo Institute of Technology", degree: "S3", major: "Informatika", status: "Dicabut", validUntil: "24 Nov 2026", source: "Pendaftaran mandiri", scholarship: "LPDP", activation: "Sudah aktivasi", expiryWindow: "30 hari ke depan" },
];
const units = ["Tokyo", "Yokohama", "Chiba", "Saitama", "Osaka", "Kyoto", "Nagoya", "Fukuoka"];

export function MemberWorkspace({ scope }: { scope: Scope }) {
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
  const [selected, setSelected] = useState<Member | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const scoped = useMemo(() => members.filter((member) => scope === "national" || (scope === "korda" ? member.region === "Kanto" : member.komsat === "Tokyo")), [scope]);
  const visible = scoped.filter((member) => {
    const q = search.trim().toLocaleLowerCase("id");
    const inGroup = (values: string[], value: string) => values.length === 0 || values.includes(value);
    return (!q || `${member.name} ${member.email} ${member.id} ${member.komsat}`.toLocaleLowerCase("id").includes(q))
      && inGroup(status, member.status) && inGroup(komsat, member.komsat)
      && inGroup(institution, member.institution) && inGroup(degree, member.degree)
      && inGroup(major, member.major) && inGroup(scholarship, member.scholarship)
      && inGroup(source, member.source) && inGroup(activation, member.activation)
      && (inGroup(expiry, member.expiryWindow) || (expiry.includes("60 hari ke depan") && member.expiryWindow === "30 hari ke depan"));
  });
  const clear = () => { setSearch(""); setStatus([]); setKomsat([]); setInstitution([]); setDegree([]); setMajor([]); setScholarship([]); setSource([]); setActivation([]); setExpiry([]); };
  const groups = [
    { label: "Status", values: status, set: setStatus }, { label: "Komsat", values: komsat, set: setKomsat },
    { label: "Institusi", values: institution, set: setInstitution }, { label: "Jenjang", values: degree, set: setDegree },
    { label: "Jurusan", values: major, set: setMajor }, { label: "Pendanaan", values: scholarship, set: setScholarship },
    { label: "Sumber", values: source, set: setSource }, { label: "Aktivasi", values: activation, set: setActivation },
    { label: "Masa berlaku", values: expiry, set: setExpiry },
  ];
  const active = groups.flatMap(({ label, values, set }) => values.map((value) => ({ label, value, onRemove: () => set((current) => current.filter((item) => item !== value)) })));
  return <section className="member-workspace" aria-label="Direktori anggota">
    <div className="member-workspace-intro"><div><h2>Direktori anggota</h2><p>Cari anggota dan periksa keanggotaan dalam ruang kerja ini.</p></div><span>{visible.length === scoped.length ? `${scoped.length} anggota contoh` : `${visible.length} dari ${scoped.length} anggota contoh`}</span></div>
    <SearchFilter className="verification-filters member-filters" searchValue={search} onSearchChange={setSearch} searchPlaceholder="Cari nama, nomor, email, atau komsat" filters={<><SearchableMultiSelect compact label="Status" values={status} options={["Aktif", "Kedaluwarsa", "Ditangguhkan", "Dicabut"]} allLabel="Semua status" onChange={setStatus} /><Button type="button" variant="outline" className="member-filter-open" onClick={() => setFiltersOpen(true)} aria-label="Filter anggota lanjutan"><IconAdjustmentsHorizontal size={17} /><span>Filter</span>{active.length > status.length && <span className="member-filter-count">{active.length - status.length}</span>}</Button></>} activeFilters={active} onClearAll={clear} />
    <AdminDrawer open={filtersOpen} onOpenChange={setFiltersOpen} title="Filter anggota" description="Pilih beberapa pilihan dalam tiap kategori untuk mempersempit direktori." locale="id" className="member-filter-drawer" footer={<div className="member-filter-footer"><Button variant="outline" onClick={clear}>Hapus semua</Button><Button onClick={() => setFiltersOpen(false)}>Lihat {visible.length} anggota</Button></div>}>
      <div className="member-filter-form">
        <SearchableMultiSelect label="Komsat" values={komsat} options={units} allLabel="Semua komsat" onChange={setKomsat} />
        <SearchableMultiSelect label="Institusi" values={institution} options={[...new Set(members.map((member) => member.institution))]} allLabel="Semua institusi" onChange={setInstitution} />
        <SearchableMultiSelect label="Jenjang" values={degree} options={["S1", "S2", "S3"]} allLabel="Semua jenjang" onChange={setDegree} />
        <SearchableMultiSelect label="Jurusan" values={major} options={[...new Set(members.map((member) => member.major))]} allLabel="Semua jurusan" onChange={setMajor} />
        <SearchableMultiSelect label="Pendanaan" values={scholarship} options={["LPDP", "MEXT", "Mandiri"]} allLabel="Semua pendanaan" onChange={setScholarship} />
        <SearchableMultiSelect label="Sumber" values={source} options={["Pendaftaran mandiri", "Impor anggota", "Pendaftaran terbantu"]} allLabel="Semua sumber" onChange={setSource} />
        <SearchableMultiSelect label="Aktivasi" values={activation} options={["Sudah aktivasi", "Belum aktivasi", "Email bermasalah"]} allLabel="Semua aktivasi" onChange={setActivation} />
        <SearchableMultiSelect label="Masa berlaku" values={expiry} options={["30 hari ke depan", "60 hari ke depan", "Kedaluwarsa"]} allLabel="Semua masa berlaku" onChange={setExpiry} />
      </div>
    </AdminDrawer>
    <div className="member-table"><Table><TableHeader><TableRow><TableHead>Anggota</TableHead><TableHead>No. anggota</TableHead><TableHead>Komsat</TableHead><TableHead>Pendidikan</TableHead><TableHead>Status</TableHead><TableHead>Berlaku sampai</TableHead><TableHead><span className="sr-only">Aksi</span></TableHead></TableRow></TableHeader><TableBody>{visible.map((member) => <TableRow key={member.id}><TableCell><strong>{member.name}</strong><small>{member.email}</small></TableCell><TableCell>{member.id}</TableCell><TableCell>{member.komsat}</TableCell><TableCell><strong>{member.institution}</strong><small>{member.degree} · {member.major}</small></TableCell><TableCell><Badge variant={member.status === "Aktif" ? "success" : "warning"}>{member.status}</Badge>{member.badge && <small>{member.badge}</small>}</TableCell><TableCell>{member.validUntil}</TableCell><TableCell><Button size="sm" variant="ghost" onClick={() => setSelected(member)}>Detail <IconArrowRight size={15} /></Button></TableCell></TableRow>)}</TableBody></Table></div>
    <div className="member-mobile-list">{visible.map((member) => <button type="button" key={member.id} onClick={() => setSelected(member)}><span className="member-mobile-top"><strong>{member.name}</strong><Badge variant={member.status === "Aktif" ? "success" : "warning"}>{member.status}</Badge></span><small>{member.email}</small><span>No. {member.id} · {member.komsat}</span><span>{member.institution} · {member.degree}</span><span>Berlaku sampai {member.validUntil}<IconArrowRight size={17} /></span></button>)}</div>
    {visible.length === 0 && <div className="member-empty"><IconSearch size={25} /><strong>Tidak ada anggota yang cocok</strong><p>Coba kata kunci atau filter lain.</p><Button variant="outline" size="sm" onClick={clear}>Hapus filter</Button></div>}
    <AdminDrawer open={Boolean(selected)} onOpenChange={(open) => { if (!open) setSelected(null); }} title={selected?.name ?? "Detail anggota"} description={selected?.id} locale="id" className="member-detail-drawer"><div className="member-detail"><div className="member-detail-note"><IconUsers size={17} /> Data sintetis untuk meninjau tampilan direktori</div>{selected && <><section><h3>Keanggotaan</h3><dl>{[["Nama", selected.name], ["Email", selected.email], ["Nomor anggota", selected.id], ["Komsat", selected.komsat], ["Status", selected.status], ["Berlaku sampai", selected.validUntil], ["Sumber", selected.source], ["Aktivasi", selected.activation]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></section><section><h3>Pendidikan</h3><dl>{[["Institusi", selected.institution], ["Jenjang", selected.degree], ["Jurusan", selected.major], ["Pendanaan", selected.scholarship]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></section><p>Data pribadi sensitif tetap disembunyikan. Portal terintegrasi memakai alur buka data yang tercatat dalam audit.</p></>}</div></AdminDrawer>
  </section>;
}

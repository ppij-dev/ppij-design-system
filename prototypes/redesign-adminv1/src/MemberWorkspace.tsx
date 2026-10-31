import { useMemo, useState } from "react";
import { IconArrowRight, IconSearch, IconUsers } from "@tabler/icons-react";
import { AdminDrawer, Badge, Button, Input, SearchFilter, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "ppij-design-system";
import { FilterMenu, SearchableUnitMenu } from "./ReviewWorkspace";
import "./MemberWorkspace.css";

type Scope = "national" | "korda" | "komsat";
type Member = { id: string; name: string; email: string; komsat: string; region: string; institution: string; degree: string; major: string; status: string; validUntil: string; source: string; scholarship: string; activation: string; expiryWindow: string; badge?: string };

const members: Member[] = [
  { id: "PPIJ-02941", name: "Contoh Anggota A", email: "anggota-a@example.invalid", komsat: "Tokyo", region: "Kanto", institution: "The University of Tokyo", degree: "S2", major: "Teknik", status: "Aktif", validUntil: "24 Okt 2027", source: "Pendaftaran mandiri", scholarship: "LPDP", activation: "Sudah aktivasi", expiryWindow: "" },
  { id: "PPIJ-02940", name: "Contoh Anggota E", email: "anggota-e@example.invalid", komsat: "Tokyo", region: "Kanto", institution: "Waseda University", degree: "S1", major: "Ekonomi", status: "Aktif", validUntil: "21 Okt 2027", source: "Impor anggota", scholarship: "Mandiri", activation: "Sudah aktivasi", expiryWindow: "" },
  { id: "PPIJ-02939", name: "Contoh Anggota F", email: "anggota-f@example.invalid", komsat: "Yokohama", region: "Kanto", institution: "Yokohama National University", degree: "S3", major: "Pendidikan", status: "Aktif", validUntil: "18 Okt 2027", source: "Pendaftaran mandiri", scholarship: "MEXT", activation: "Sudah aktivasi", expiryWindow: "" },
  { id: "PPIJ-02938", name: "Contoh Anggota G", email: "anggota-g@example.invalid", komsat: "Osaka", region: "Kansai", institution: "Osaka University", degree: "S2", major: "Kesehatan", status: "Kedaluwarsa", validUntil: "15 Okt 2026", source: "Pendaftaran terbantu", scholarship: "Mandiri", activation: "Belum aktivasi", expiryWindow: "expired", badge: "Perlu perpanjangan" },
  { id: "PPIJ-02937", name: "Contoh Anggota H", email: "anggota-h@example.invalid", komsat: "Nagoya", region: "Chubu", institution: "Nagoya University", degree: "S3", major: "Sains", status: "Ditangguhkan", validUntil: "29 Des 2026", source: "Impor anggota", scholarship: "MEXT", activation: "Email bermasalah", expiryWindow: "60d" },
  { id: "PPIJ-02936", name: "Contoh Anggota I", email: "anggota-i@example.invalid", komsat: "Tokyo", region: "Kanto", institution: "Tokyo Institute of Technology", degree: "S3", major: "Informatika", status: "Dicabut", validUntil: "24 Nov 2026", source: "Pendaftaran mandiri", scholarship: "LPDP", activation: "Sudah aktivasi", expiryWindow: "30d" },
];
const units = ["Tokyo", "Yokohama", "Chiba", "Saitama", "Osaka", "Kyoto", "Nagoya", "Fukuoka"];

export function MemberWorkspace({ scope }: { scope: Scope }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [komsat, setKomsat] = useState<string[]>([]);
  const [institution, setInstitution] = useState("");
  const [degree, setDegree] = useState("");
  const [major, setMajor] = useState("");
  const [scholarship, setScholarship] = useState("");
  const [source, setSource] = useState("");
  const [activation, setActivation] = useState("");
  const [expiry, setExpiry] = useState("");
  const [selected, setSelected] = useState<Member | null>(null);
  const scoped = useMemo(() => members.filter((member) => scope === "national" || (scope === "korda" ? member.region === "Kanto" : member.komsat === "Tokyo")), [scope]);
  const visible = scoped.filter((member) => {
    const q = search.trim().toLocaleLowerCase("id");
    return (!q || `${member.name} ${member.email} ${member.id} ${member.komsat}`.toLocaleLowerCase("id").includes(q))
      && (!status || member.status === status) && (!komsat.length || komsat.includes(member.komsat))
      && (!institution || member.institution.toLocaleLowerCase("id").includes(institution.toLocaleLowerCase("id")))
      && (!degree || member.degree === degree) && (!major || member.major.toLocaleLowerCase("id").includes(major.toLocaleLowerCase("id")))
      && (!scholarship || member.scholarship === scholarship) && (!source || member.source === source)
      && (!activation || member.activation === activation) && (!expiry || member.expiryWindow === expiry);
  });
  const clear = () => { setSearch(""); setStatus(""); setKomsat([]); setInstitution(""); setDegree(""); setMajor(""); setScholarship(""); setSource(""); setActivation(""); setExpiry(""); };
  const active = [
    ...(status ? [{ label: "Status", value: status, onRemove: () => setStatus("") }] : []),
    ...komsat.map((value) => ({ label: "Komsat", value, onRemove: () => setKomsat((items) => items.filter((item) => item !== value)) })),
    ...(institution ? [{ label: "Institusi", value: institution, onRemove: () => setInstitution("") }] : []),
    ...(degree ? [{ label: "Jenjang", value: degree, onRemove: () => setDegree("") }] : []),
    ...(major ? [{ label: "Jurusan", value: major, onRemove: () => setMajor("") }] : []),
    ...(scholarship ? [{ label: "Pendanaan", value: scholarship, onRemove: () => setScholarship("") }] : []),
    ...(source ? [{ label: "Sumber", value: source, onRemove: () => setSource("") }] : []),
    ...(activation ? [{ label: "Aktivasi", value: activation, onRemove: () => setActivation("") }] : []),
    ...(expiry ? [{ label: "Masa berlaku", value: expiry === "expired" ? "Kedaluwarsa" : expiry === "30d" ? "30 hari" : "60 hari", onRemove: () => setExpiry("") }] : []),
  ];
  return <section className="member-workspace" aria-label="Direktori anggota">
    <div className="member-workspace-intro"><div><h2>Direktori anggota</h2><p>Cari anggota dan periksa keanggotaan dalam ruang kerja ini.</p></div><span>{visible.length === scoped.length ? `${scoped.length} anggota contoh` : `${visible.length} dari ${scoped.length} anggota contoh`}</span></div>
    <SearchFilter className="verification-filters member-filters" searchValue={search} onSearchChange={setSearch} searchPlaceholder="Cari nama, nomor, email, atau komsat" filters={<FilterMenu label="Status" hideLabel value={status} allLabel="Semua status" options={["Aktif", "Kedaluwarsa", "Ditangguhkan", "Dicabut"].map((value) => ({ value, label: value }))} onChange={setStatus} />} advancedTitle="Filter anggota lanjutan" advancedActiveCount={active.length - Number(Boolean(status))} advancedFilters={<>
      <SearchableUnitMenu label="Komsat" values={komsat} options={units} multiple onChange={setKomsat} />
      <label className="member-filter-field">Institusi<Input value={institution} onChange={(event) => setInstitution(event.target.value)} placeholder="Cari institusi" /></label>
      <FilterMenu label="Jenjang" value={degree} allLabel="Semua jenjang" options={["S1", "S2", "S3"].map((value) => ({ value, label: value }))} onChange={setDegree} />
      <label className="member-filter-field">Jurusan<Input value={major} onChange={(event) => setMajor(event.target.value)} placeholder="Cari jurusan" /></label>
      <FilterMenu label="Pendanaan" value={scholarship} allLabel="Semua pendanaan" options={["LPDP", "MEXT", "Mandiri"].map((value) => ({ value, label: value }))} onChange={setScholarship} />
      <FilterMenu label="Sumber" value={source} allLabel="Semua sumber" options={["Pendaftaran mandiri", "Impor anggota", "Pendaftaran terbantu"].map((value) => ({ value, label: value }))} onChange={setSource} />
      <FilterMenu label="Aktivasi" value={activation} allLabel="Semua aktivasi" options={["Sudah aktivasi", "Belum aktivasi", "Email bermasalah"].map((value) => ({ value, label: value }))} onChange={setActivation} />
      <FilterMenu label="Masa berlaku" value={expiry} allLabel="Semua masa berlaku" options={[{ value: "30d", label: "30 hari ke depan" }, { value: "60d", label: "60 hari ke depan" }, { value: "expired", label: "Kedaluwarsa" }]} onChange={setExpiry} />
    </>} activeFilters={active} onClearAll={clear} />
    <div className="member-table"><Table><TableHeader><TableRow><TableHead>Anggota</TableHead><TableHead>No. anggota</TableHead><TableHead>Komsat</TableHead><TableHead>Pendidikan</TableHead><TableHead>Status</TableHead><TableHead>Berlaku sampai</TableHead><TableHead><span className="sr-only">Aksi</span></TableHead></TableRow></TableHeader><TableBody>{visible.map((member) => <TableRow key={member.id}><TableCell><strong>{member.name}</strong><small>{member.email}</small></TableCell><TableCell>{member.id}</TableCell><TableCell>{member.komsat}</TableCell><TableCell><strong>{member.institution}</strong><small>{member.degree} · {member.major}</small></TableCell><TableCell><Badge variant={member.status === "Aktif" ? "success" : "warning"}>{member.status}</Badge>{member.badge && <small>{member.badge}</small>}</TableCell><TableCell>{member.validUntil}</TableCell><TableCell><Button size="sm" variant="ghost" onClick={() => setSelected(member)}>Detail <IconArrowRight size={15} /></Button></TableCell></TableRow>)}</TableBody></Table></div>
    <div className="member-mobile-list">{visible.map((member) => <button type="button" key={member.id} onClick={() => setSelected(member)}><span className="member-mobile-top"><strong>{member.name}</strong><Badge variant={member.status === "Aktif" ? "success" : "warning"}>{member.status}</Badge></span><small>{member.email}</small><span>No. {member.id} · {member.komsat}</span><span>{member.institution} · {member.degree}</span><span>Berlaku sampai {member.validUntil}<IconArrowRight size={17} /></span></button>)}</div>
    {visible.length === 0 && <div className="member-empty"><IconSearch size={25} /><strong>Tidak ada anggota yang cocok</strong><p>Coba kata kunci atau filter lain.</p><Button variant="outline" size="sm" onClick={clear}>Hapus filter</Button></div>}
    <AdminDrawer open={Boolean(selected)} onOpenChange={(open) => { if (!open) setSelected(null); }} title={selected?.name ?? "Detail anggota"} description={selected?.id} locale="id" className="member-detail-drawer"><div className="member-detail"><div className="member-detail-note"><IconUsers size={17} /> Data sintetis untuk meninjau tampilan direktori</div>{selected && <><section><h3>Keanggotaan</h3><dl>{[["Nama", selected.name], ["Email", selected.email], ["Nomor anggota", selected.id], ["Komsat", selected.komsat], ["Status", selected.status], ["Berlaku sampai", selected.validUntil], ["Sumber", selected.source], ["Aktivasi", selected.activation]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></section><section><h3>Pendidikan</h3><dl>{[["Institusi", selected.institution], ["Jenjang", selected.degree], ["Jurusan", selected.major], ["Pendanaan", selected.scholarship]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></section><p>Data pribadi sensitif tetap disembunyikan. Portal terintegrasi memakai alur buka data yang tercatat dalam audit.</p></>}</div></AdminDrawer>
  </section>;
}

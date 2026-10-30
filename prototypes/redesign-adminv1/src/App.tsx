import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  IconActivity, IconArrowDownRight, IconArrowRight, IconBell, IconBuildingCommunity,
  IconChartBar, IconChevronDown, IconChevronRight, IconCircleCheck, IconClock,
  IconDownload, IconFilter, IconId, IconLayoutDashboard, IconMenu2, IconPlus,
  IconSearch, IconSettings, IconShieldCheck, IconSparkles, IconUsers, IconX,
} from "@tabler/icons-react";
import {
  AdminDrawer, Badge, BottomBar, Button, DataTable, Input,
  PageHeader, StatCard, Table, TableBody, TableCell, TableHead, TableHeader,
  TableRow, UnitCard,
} from "ppij-design-system";

type Page = "dashboard" | "review" | "members" | "roles" | "units";
type Scope = "national" | "korda" | "komsat";
type ReviewStatus = "Menunggu" | "Perlu perbaikan" | "Disetujui";

const nav: { id: Page; label: string; icon: typeof IconActivity }[] = [
  { id: "dashboard", label: "Dashboard", icon: IconLayoutDashboard },
  { id: "review", label: "Verifikasi", icon: IconShieldCheck },
  { id: "members", label: "Anggota", icon: IconUsers },
  { id: "roles", label: "Admin & Peran", icon: IconId },
  { id: "units", label: "Organisasi", icon: IconBuildingCommunity },
];

const scopes: Record<Scope, { label: string; short: string; type: string; subtitle: string }> = {
  national: { label: "PPI Jepang Nasional", short: "Nasional", type: "Nasional", subtitle: "Seluruh jaringan PPI Jepang" },
  korda: { label: "Korda Kanto", short: "Korda Kanto", type: "Koordinator daerah", subtitle: "Kantō dan komisariatnya" },
  komsat: { label: "Komsat Tokyo", short: "Komsat Tokyo", type: "Komisariat", subtitle: "Area kerja komisariat Tokyo" },
};

const scopePhrase: Record<Scope, string> = {
  national: "seluruh jaringan PPI Jepang",
  korda: "Korda Kanto dan komisariatnya",
  komsat: "Komsat Tokyo",
};

const reviews: { id: string; name: string; unit: string; kind: string; received: string; status: ReviewStatus; initials: string }[] = [
  { id: "REG-2408", name: "Contoh Anggota A", unit: "Tokyo", kind: "Pendaftaran baru", received: "Hari ini, 09.42", status: "Menunggu", initials: "AA" },
  { id: "REG-2407", name: "Contoh Anggota B", unit: "Yokohama", kind: "Pendaftaran baru", received: "Hari ini, 08.16", status: "Menunggu", initials: "AB" },
  { id: "REG-2406", name: "Contoh Anggota C", unit: "Osaka", kind: "Perubahan data", received: "Kemarin, 17.30", status: "Perlu perbaikan", initials: "AC" },
  { id: "REG-2405", name: "Contoh Anggota D", unit: "Nagoya", kind: "Pendaftaran baru", received: "Kemarin, 13.10", status: "Menunggu", initials: "AD" },
  { id: "REG-2404", name: "Contoh Anggota E", unit: "Tokyo", kind: "Pendaftaran baru", received: "29 Okt, 14.22", status: "Disetujui", initials: "AE" },
];

const members: { id: string; name: string; unit: string; region: string; role: string; joined: string; status: string; initials: string }[] = [
  { id: "PPIJ-02941", name: "Contoh Anggota A", unit: "Tokyo", region: "Kanto", role: "Anggota", joined: "24 Okt 2026", status: "Aktif", initials: "AA" },
  { id: "PPIJ-02940", name: "Contoh Anggota E", unit: "Tokyo", region: "Kanto", role: "Pengurus", joined: "21 Okt 2026", status: "Aktif", initials: "AE" },
  { id: "PPIJ-02939", name: "Contoh Anggota F", unit: "Yokohama", region: "Kanto", role: "Anggota", joined: "18 Okt 2026", status: "Aktif", initials: "AF" },
  { id: "PPIJ-02938", name: "Contoh Anggota G", unit: "Osaka", region: "Kansai", role: "Anggota", joined: "15 Okt 2026", status: "Aktif", initials: "AG" },
  { id: "PPIJ-02937", name: "Contoh Anggota H", unit: "Nagoya", region: "Chubu", role: "Anggota", joined: "11 Okt 2026", status: "Nonaktif", initials: "AH" },
];

const admins = [
  { name: "Contoh Pengurus A", initials: "PA", role: "Admin nasional", scope: "PPI Jepang", appointed: "12 Sep 2026", status: "Aktif" },
  { name: "Contoh Pengurus B", initials: "PB", role: "Admin korda", scope: "Kanto", appointed: "14 Sep 2026", status: "Aktif" },
  { name: "Contoh Pengurus C", initials: "PC", role: "Verifikator", scope: "Tokyo", appointed: "18 Sep 2026", status: "Aktif" },
  { name: "Contoh Pengurus D", initials: "PD", role: "Admin komsat", scope: "Osaka", appointed: "01 Okt 2026", status: "Aktif" },
];

const units = [
  { name: "Kanto", kind: "Korda", memberCount: 452, leadName: "Contoh Pengurus B", statusLabel: "Aktif" },
  { name: "Kansai", kind: "Korda", memberCount: 306, leadName: "Contoh Pengurus E", statusLabel: "Aktif" },
  { name: "Chubu", kind: "Korda", memberCount: 183, leadName: "Contoh Pengurus F", statusLabel: "Aktif" },
  { name: "Kyushu", kind: "Korda", memberCount: 104, leadName: "Contoh Pengurus G", statusLabel: "Aktif" },
];

function StatusBadge({ value }: { value: string }) {
  const variant = value === "Aktif" || value === "Disetujui" ? "success" : value === "Menunggu" ? "warning" : value === "Perlu perbaikan" ? "secondary" : "secondary";
  return <Badge variant={variant}>{value}</Badge>;
}

function Person({ initials, name, detail }: { initials: string; name: string; detail?: string }) {
  return <div className="person"><span className="avatar">{initials}</span><span className="person-copy"><strong>{name}</strong>{detail && <small>{detail}</small>}</span></div>;
}

function SectionHead({ title, caption, action }: { title: string; caption?: string; action?: ReactNode }) {
  return <div className="section-head"><div><h2>{title}</h2>{caption && <p>{caption}</p>}</div>{action}</div>;
}

function EmptyResult({ term }: { term: string }) {
  return <div className="empty-result"><IconSearch size={23} /><strong>Tidak ada hasil</strong><span>Coba kata kunci atau filter lain untuk “{term}”.</span></div>;
}

export function App() {
  const [page, setPage] = useState<Page>("dashboard");
  const [scope, setScope] = useState<Scope>("national");
  const [scopeOpen, setScopeOpen] = useState(false);
  const [mobileMore, setMobileMore] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Semua");
  const [tab, setTab] = useState("Antrean");
  const [drawer, setDrawer] = useState<{ title: string; kind: string; details: { label: string; value: string }[] } | null>(null);
  const [drawerStep, setDrawerStep] = useState<1 | 2>(1);
  const [drawerAction, setDrawerAction] = useState("");
  const [notice, setNotice] = useState("");

  function go(next: Page) {
    setPage(next); setSearch(""); setFilter("Semua"); setTab("Antrean"); setMobileMore(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function demo(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 4200);
  }

  function openPerson(name: string, kind: string, fields: { label: string; value: string }[]) {
    setDrawer({ title: name, kind, details: fields });
    setDrawerStep(1);
    setDrawerAction("");
  }

  function previewAction(action: string) {
    setDrawerAction(action);
    setDrawerStep(2);
  }

  const visibleNav = scope === "komsat" ? nav.filter((n) => n.id !== "units") : nav;
  const queueCount = reviews.filter((r) => r.status !== "Disetujui" && (scope === "national" || (scope === "korda" ? ["Tokyo", "Yokohama"].includes(r.unit) : r.unit === "Tokyo"))).length;
  const scopedAdmins = admins.filter((a) => scope === "national" || (scope === "korda" ? ["Kanto", "Tokyo", "Yokohama", "Chiba", "Saitama"].includes(a.scope) : a.scope === "Tokyo"));
  const filteredReviews = useMemo(() => reviews.filter((r) => {
    const inScope = scope === "national" || (scope === "korda" ? ["Tokyo", "Yokohama"].includes(r.unit) : r.unit === "Tokyo");
    return inScope && (tab === "Riwayat" ? r.status === "Disetujui" : r.status !== "Disetujui") && (filter === "Semua" || r.status === filter) && `${r.name} ${r.id} ${r.unit}`.toLowerCase().includes(search.toLowerCase());
  }), [scope, filter, search, tab]);
  const filteredMembers = useMemo(() => members.filter((m) => {
    const inScope = scope === "national" || (scope === "korda" ? m.region === "Kanto" : m.unit === "Tokyo");
    return inScope && (filter === "Semua" || m.status === filter) && `${m.name} ${m.id} ${m.unit}`.toLowerCase().includes(search.toLowerCase());
  }), [scope, filter, search]);

  const pageTitle = nav.find((n) => n.id === page)?.label ?? "Dashboard";
  const bottomItems = visibleNav.slice(0, 4).map((n) => ({ label: n.label === "Admin & Peran" ? "Peran" : n.label, href: `#${n.id}`, icon: <n.icon size={21} stroke={1.8} />, current: page === n.id, badge: n.id === "review" ? queueCount : undefined }));
  if (visibleNav.length > 4) bottomItems.push({ label: "Lainnya", href: "#more", icon: <IconMenu2 size={21} stroke={1.8} />, current: page === "units", badge: undefined });

  return <div className="admin-app">
    <aside className="sidebar" aria-label="Navigasi admin">
      <div className="sidebar-brand"><div className="brand-logo"><img src="/ppij-logo.png" alt="PPI Jepang" /></div><div><strong>PPI Jepang</strong><span>ADMIN PORTAL</span></div></div>
      <div className="scope-wrap"><button className="scope-button" onClick={() => setScopeOpen(!scopeOpen)} aria-expanded={scopeOpen}><span className="scope-mark"><IconBuildingCommunity size={18} /></span><span><small>RUANG KERJA</small><strong>{scopes[scope].label}</strong></span><IconChevronDown size={16} className={scopeOpen ? "rotate" : ""} /></button>
        {scopeOpen && <div className="scope-list" role="menu">{(Object.keys(scopes) as Scope[]).map((id) => <button key={id} role="menuitemradio" aria-checked={scope === id} onClick={() => { setScope(id); setScopeOpen(false); if (id === "komsat" && page === "units") go("dashboard"); }}><span>{scopes[id].label}<small>{scopes[id].type}</small></span>{scope === id && <IconCircleCheck size={17} />}</button>)}</div>}</div>
      <p className="nav-caption">MENU UTAMA</p>
      <nav className="nav-list">{visibleNav.map((n) => <button key={n.id} className={page === n.id ? "nav-item active" : "nav-item"} onClick={() => go(n.id)} aria-current={page === n.id ? "page" : undefined}><n.icon size={19} stroke={1.85} /><span>{n.label}</span>{n.id === "review" && <span className="nav-count">{queueCount}</span>}</button>)}</nav>
      <div className="sidebar-foot"><div className="sample-label"><IconSparkles size={16} /><span>PRATINJAU DESAIN</span></div><p>Data pada layar ini hanya contoh untuk meninjau pengalaman admin.</p><button onClick={() => demo("Pusat bantuan akan tersedia setelah integrasi.")}><IconSettings size={17} /> Bantuan & pengaturan <IconArrowRight size={16} /></button></div>
    </aside>
    <div className="main-wrap">
      <header className="topbar"><div className="topbar-path"><span>Admin</span><IconChevronRight size={15} /><strong>{pageTitle}</strong></div><div className="topbar-actions"><span className="today">Sabtu, 31 Oktober 2026</span><button className="icon-action" aria-label="Notifikasi" onClick={() => demo("Tidak ada notifikasi baru dalam pratinjau.")}><IconBell size={20} /></button><span className="top-avatar">PA</span><span className="top-name">Contoh Pengurus A</span></div></header>
      <div className="mobile-topbar"><div className="mobile-brand"><img src="/ppij-logo.png" alt="PPI Jepang" /><span>Admin PPIJ</span></div><button className="mobile-scope" onClick={() => setScopeOpen(!scopeOpen)}>{scopes[scope].short}<IconChevronDown size={15} /></button>{scopeOpen && <div className="mobile-scope-menu">{(Object.keys(scopes) as Scope[]).map((id) => <button key={id} onClick={() => { setScope(id); setScopeOpen(false); if (id === "komsat" && page === "units") go("dashboard"); }}>{scopes[id].label}</button>)}</div>}</div>
      <main id="main" className="content">
        <div className="preview-banner"><span><IconSparkles size={16} /> PRATINJAU ADMIN V1</span><p>Seluruh nama dan angka di halaman ini adalah data contoh.</p></div>
        {page === "dashboard" && <Dashboard scope={scope} queueCount={queueCount} go={go} openPerson={openPerson} />}
        {page === "review" && <><PageHeader title="Verifikasi anggota" description={`Tinjau pendaftaran dan perubahan data untuk ${scopePhrase[scope]}.`} actions={<Button variant="outline" onClick={() => demo("Ekspor antrean tersedia pada portal terintegrasi.")}><IconDownload size={16} /> Ekspor daftar</Button>} />
          <div className="tabs" role="tablist" aria-label="Tampilan verifikasi">{["Antrean", "Riwayat"].map((t) => <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? "selected" : ""} onClick={() => { setTab(t); setFilter(t === "Riwayat" ? "Disetujui" : "Semua"); }}>{t}{t === "Antrean" && <span>{queueCount}</span>}</button>)}</div>
          <div className="section-note"><IconClock size={18} /><span>Prioritaskan berkas terlama. Buka satu pengajuan untuk melihat ringkasan dan langkah berikutnya.</span></div>
          <div className="table-section"><DataTable searchValue={search} onSearchChange={setSearch} searchPlaceholder="Cari nama, ID, atau komisariat" actions={<FilterPills options={tab === "Riwayat" ? ["Disetujui"] : ["Semua", "Menunggu", "Perlu perbaikan"]} current={filter} onChange={setFilter} />} footerText={`${filteredReviews.length} pengajuan contoh`} pageLabel="Halaman 1 dari 1" previousDisabled nextDisabled>
            <Table><TableHeader><TableRow><TableHead>Pengajuan</TableHead><TableHead>Jenis</TableHead><TableHead>Komisariat</TableHead><TableHead>Diterima</TableHead><TableHead>Status</TableHead><TableHead><span className="sr-only">Aksi</span></TableHead></TableRow></TableHeader><TableBody>{filteredReviews.map((r) => <TableRow key={r.id}><TableCell><Person initials={r.initials} name={r.name} detail={r.id} /></TableCell><TableCell>{r.kind}</TableCell><TableCell>{r.unit}</TableCell><TableCell>{r.received}</TableCell><TableCell><StatusBadge value={r.status} /></TableCell><TableCell><Button variant="ghost" size="sm" onClick={() => openPerson(r.name, "Pengajuan " + r.id, [{ label: "Jenis", value: r.kind }, { label: "Komisariat", value: r.unit }, { label: "Diterima", value: r.received }, { label: "Status", value: r.status }])}>Tinjau <IconArrowRight size={15} /></Button></TableCell></TableRow>)}</TableBody></Table></DataTable>{filteredReviews.length === 0 && <EmptyResult term={search || filter} />}</div>
          <MobileFilters search={search} setSearch={setSearch} filter={filter} setFilter={setFilter} options={tab === "Riwayat" ? ["Disetujui"] : ["Semua", "Menunggu", "Perlu perbaikan"]} />
          <div className="mobile-list">{filteredReviews.map((r) => <button key={r.id} className="mobile-row" onClick={() => openPerson(r.name, "Pengajuan " + r.id, [{ label: "Jenis", value: r.kind }, { label: "Komisariat", value: r.unit }, { label: "Diterima", value: r.received }, { label: "Status", value: r.status }])}><div><Person initials={r.initials} name={r.name} detail={`${r.id} · ${r.unit}`} /><StatusBadge value={r.status} /></div><p>{r.kind} <span>{r.received}</span></p></button>)}{filteredReviews.length === 0 && <EmptyResult term={search || filter} />}</div>
        </>}
        {page === "members" && <><PageHeader title="Anggota" description={`Direktori anggota untuk ${scopePhrase[scope]}. Cari, buka detail, atau lihat status keanggotaan.`} actions={<Button onClick={() => { setDrawerStep(1); setDrawer({ title: "Undang anggota", kind: "Alur undangan", details: [{ label: "Tujuan", value: "Undang anggota ke komisariat melalui email." }, { label: "Status", value: "Contoh alur — belum terhubung ke layanan undangan." }] }); }}><IconPlus size={17} /> Undang anggota</Button>} />
          <div className="compact-stats"><StatCard label="Anggota aktif" value={scope === "national" ? "1.284" : scope === "korda" ? "452" : "218"} icon={<IconUsers />} hint="terdaftar" /><StatCard label="Bergabung bulan ini" value={scope === "national" ? "48" : scope === "korda" ? "17" : "8"} icon={<IconArrowDownRight />} hint="anggota baru" /><StatCard label="Perlu pembaruan" value={scope === "national" ? "16" : scope === "korda" ? "5" : "2"} icon={<IconActivity />} hint="data profil" /></div>
          <SectionHead title="Direktori anggota" caption="Pilih anggota untuk membuka ringkasan keanggotaan." />
          <div className="table-section"><DataTable searchValue={search} onSearchChange={setSearch} searchPlaceholder="Cari nama, ID, atau komisariat" actions={<FilterPills options={["Semua", "Aktif", "Nonaktif"]} current={filter} onChange={setFilter} />} footerText={`${filteredMembers.length} anggota contoh`} pageLabel="Halaman 1 dari 1" previousDisabled nextDisabled><Table><TableHeader><TableRow><TableHead>Anggota</TableHead><TableHead>Komisariat</TableHead><TableHead>Peran</TableHead><TableHead>Bergabung</TableHead><TableHead>Status</TableHead><TableHead><span className="sr-only">Aksi</span></TableHead></TableRow></TableHeader><TableBody>{filteredMembers.map((m) => <TableRow key={m.id}><TableCell><Person initials={m.initials} name={m.name} detail={m.id} /></TableCell><TableCell>{m.unit}</TableCell><TableCell>{m.role}</TableCell><TableCell>{m.joined}</TableCell><TableCell><StatusBadge value={m.status} /></TableCell><TableCell><Button size="sm" variant="ghost" onClick={() => openPerson(m.name, "Profil anggota", [{ label: "ID anggota", value: m.id }, { label: "Komisariat", value: m.unit }, { label: "Peran", value: m.role }, { label: "Status", value: m.status }])}>Lihat <IconArrowRight size={15} /></Button></TableCell></TableRow>)}</TableBody></Table></DataTable>{filteredMembers.length === 0 && <EmptyResult term={search || filter} />}</div>
          <MobileFilters search={search} setSearch={setSearch} filter={filter} setFilter={setFilter} options={["Semua", "Aktif", "Nonaktif"]} />
          <div className="mobile-list">{filteredMembers.map((m) => <button key={m.id} className="mobile-row" onClick={() => openPerson(m.name, "Profil anggota", [{ label: "ID anggota", value: m.id }, { label: "Komisariat", value: m.unit }, { label: "Peran", value: m.role }, { label: "Status", value: m.status }])}><div><Person initials={m.initials} name={m.name} detail={`${m.id} · ${m.unit}`} /><StatusBadge value={m.status} /></div><p>{m.role}<span>{m.joined}</span></p></button>)}{filteredMembers.length === 0 && <EmptyResult term={search || filter} />}</div>
        </>}
        {page === "roles" && <><PageHeader title="Admin & Peran" description="Kelola siapa yang dapat membantu anggota, meninjau pengajuan, dan mengelola unit sesuai cakupan tugas." actions={<Button onClick={() => { setDrawerStep(1); setDrawer({ title: "Tunjuk pengurus", kind: "Alur penunjukan", details: [{ label: "Langkah 1", value: "Pilih anggota aktif." }, { label: "Langkah 2", value: "Pilih peran dan cakupan." }, { label: "Langkah 3", value: "Tinjau sebelum konfirmasi." }] }); }}><IconPlus size={17} /> Tunjuk pengurus</Button>} />
          <div className="role-explainer"><div className="role-icon"><IconShieldCheck size={23} /></div><div><strong>Hak akses mengikuti cakupan organisasi</strong><p>Admin nasional melihat seluruh jaringan. Admin korda dan komsat hanya mengelola unit dalam wilayahnya.</p></div></div>
          <SectionHead title="Penugasan aktif" caption="Periksa peran dan cakupan sebelum membuat perubahan." />
          <div className="table-section"><DataTable searchValue={search} onSearchChange={setSearch} searchPlaceholder="Cari pengurus atau unit" footerText="Penugasan contoh" pageLabel="Halaman 1 dari 1" previousDisabled nextDisabled><Table><TableHeader><TableRow><TableHead>Pengurus</TableHead><TableHead>Peran</TableHead><TableHead>Cakupan</TableHead><TableHead>Ditunjuk</TableHead><TableHead>Status</TableHead><TableHead><span className="sr-only">Aksi</span></TableHead></TableRow></TableHeader><TableBody>{scopedAdmins.filter((a) => `${a.name} ${a.scope} ${a.role}`.toLowerCase().includes(search.toLowerCase())).map((a) => <TableRow key={a.name}><TableCell><Person initials={a.initials} name={a.name} /></TableCell><TableCell>{a.role}</TableCell><TableCell>{a.scope}</TableCell><TableCell>{a.appointed}</TableCell><TableCell><StatusBadge value={a.status} /></TableCell><TableCell><Button size="sm" variant="ghost" onClick={() => openPerson(a.name, "Penugasan pengurus", [{ label: "Peran", value: a.role }, { label: "Cakupan", value: a.scope }, { label: "Ditunjuk", value: a.appointed }, { label: "Status", value: a.status }])}>Kelola <IconArrowRight size={15} /></Button></TableCell></TableRow>)}</TableBody></Table></DataTable></div>
          <div className="mobile-list">{scopedAdmins.map((a) => <button key={a.name} className="mobile-row" onClick={() => openPerson(a.name, "Penugasan pengurus", [{ label: "Peran", value: a.role }, { label: "Cakupan", value: a.scope }, { label: "Status", value: a.status }])}><div><Person initials={a.initials} name={a.name} detail={a.role} /><IconChevronRight size={18} /></div><p>{a.scope}<span>{a.status}</span></p></button>)}</div>
        </>}
        {page === "units" && <><PageHeader title="Organisasi" description="Lihat struktur korda dan komisariat, penanggung jawab, serta cakupan anggota di jaringan PPI Jepang." actions={<Button onClick={() => { setDrawerStep(1); setDrawer({ title: "Tambah unit", kind: "Alur organisasi", details: [{ label: "Jenis", value: scope === "national" ? "Korda atau komisariat" : "Komisariat" }, { label: "Langkah", value: "Isi nama, wilayah induk, dan penanggung jawab." }, { label: "Status", value: "Contoh alur — belum menyimpan unit." }] }); }}><IconPlus size={17} /> Tambah unit</Button>} />
          <div className="unit-overview"><div><small>STRUKTUR ORGANISASI</small><strong>{scope === "national" ? "Nasional" : "Korda Kanto"}</strong><p>{scope === "national" ? "9 korda · 26 komisariat" : "4 komisariat · 452 anggota"}</p></div><IconBuildingCommunity size={66} stroke={1} /></div>
          <SectionHead title={scope === "national" ? "Koordinator daerah" : "Komisariat di Kanto"} caption="Buka unit untuk melihat penanggung jawab dan rincian organisasi." action={<Button variant="outline" size="sm" onClick={() => demo("Filter wilayah tersedia pada portal terintegrasi.")}><IconFilter size={16} /> Semua wilayah</Button>} />
          <div className="unit-grid">{(scope === "national" ? units : [
            { name: "Tokyo", kind: "Komsat", memberCount: 218, leadName: "Contoh Pengurus C", statusLabel: "Aktif" },
            { name: "Yokohama", kind: "Komsat", memberCount: 96, leadName: "Contoh Pengurus H", statusLabel: "Aktif" },
            { name: "Chiba", kind: "Komsat", memberCount: 74, leadName: "Contoh Pengurus I", statusLabel: "Aktif" },
            { name: "Saitama", kind: "Komsat", memberCount: 64, leadName: "Contoh Pengurus J", statusLabel: "Aktif" },
          ]).map((u) => <UnitCard key={u.name} {...u} actions={<Button variant="ghost" size="sm" onClick={() => openPerson(u.name, u.kind, [{ label: "Jenis", value: u.kind }, { label: "Jumlah anggota", value: String(u.memberCount) }, { label: "Penanggung jawab", value: u.leadName }, { label: "Status", value: u.statusLabel }])}>Lihat unit <IconArrowRight size={15} /></Button>} />)}</div>
        </>}
        <footer className="page-footer"><span>PPI Jepang · Pratinjau desain admin v1</span><span>Data ilustratif · 31 Okt 2026</span></footer>
      </main>
    </div>
    <div className="bottom-wrap" onClickCapture={(e) => { const link = (e.target as HTMLElement).closest("a[href^='#']"); if (!link) return; e.preventDefault(); const target = link.getAttribute("href")!.slice(1); if (target === "more") setMobileMore(!mobileMore); else go(target as Page); }}><BottomBar items={bottomItems} ariaLabel="Navigasi admin" />{mobileMore && <div className="more-menu"><button onClick={() => go("units")}><IconBuildingCommunity size={19} /> Organisasi</button><button onClick={() => demo("Pusat bantuan akan tersedia setelah integrasi.")}><IconSettings size={19} /> Bantuan & pengaturan</button></div>}</div>
    <AdminDrawer open={drawer !== null} onOpenChange={(open) => { if (!open) setDrawer(null); }} title={drawer?.title ?? "Detail"} description={drawer?.kind} locale="id" step={drawerStep} onBack={() => setDrawerStep(1)} footer={drawerStep === 2 ? <Button onClick={() => { setDrawer(null); demo(`${drawerAction} adalah contoh alur. Tidak ada data yang berubah.`); }}>Konfirmasi {drawerAction.toLowerCase()} <IconArrowRight size={16} /></Button> : drawer?.kind.startsWith("Pengajuan") ? <><Button variant="outline" onClick={() => previewAction("Minta perbaikan")}>Minta perbaikan</Button><Button onClick={() => previewAction("Setujui")}>Setujui</Button></> : drawer?.kind === "Penugasan pengurus" ? <><Button variant="outline" onClick={() => previewAction("Cabut akses")}>Cabut akses</Button><Button onClick={() => previewAction("Ubah peran")}>Ubah peran</Button></> : drawer?.kind === "Profil anggota" ? <Button onClick={() => previewAction("Lihat kartu")}>Lihat kartu <IconArrowRight size={16} /></Button> : drawer?.kind === "Korda" || drawer?.kind === "Komsat" ? <Button onClick={() => previewAction("Ubah unit")}>Ubah unit <IconArrowRight size={16} /></Button> : <Button onClick={() => previewAction("Lanjutkan")}>Lanjutkan <IconArrowRight size={16} /></Button>}>
      {drawer && (drawerStep === 1 ? <div className="drawer-body"><div className="drawer-stamp"><IconShieldCheck size={21} /><span>Informasi contoh untuk peninjauan desain</span></div><dl>{drawer.details.map((d) => <div key={d.label}><dt>{d.label}</dt><dd>{d.value}</dd></div>)}</dl>{drawer.kind.startsWith("Pengajuan") && <div className="review-checklist"><h3>Kelengkapan pengajuan</h3><div><IconCircleCheck size={17} /> Identitas anggota terisi</div><div><IconCircleCheck size={17} /> Komisariat dipilih</div><div><IconCircleCheck size={17} /> Dokumen pendukung tersedia</div><p>Periksa dokumen asli dan ketentuan izin sebelum membuat keputusan di aplikasi terintegrasi.</p></div>}{drawer.kind === "Alur undangan" && <div className="drawer-form"><label htmlFor="invite-email">Email calon anggota</label><Input id="invite-email" type="email" placeholder="nama@contoh.com" /></div>}{drawer.kind === "Alur penunjukan" && <div className="drawer-form"><label htmlFor="appoint-name">Nama anggota aktif</label><Input id="appoint-name" placeholder="Cari anggota" /><label htmlFor="appoint-role">Peran yang ditunjuk</label><select id="appoint-role" defaultValue="Verifikator"><option>Verifikator</option><option>Admin komsat</option><option>Admin korda</option></select></div>}{drawer.kind === "Alur organisasi" && <div className="drawer-form"><label htmlFor="unit-name">Nama unit</label><Input id="unit-name" placeholder="Nama korda atau komisariat" /></div>}<div className="drawer-note"><strong>Pratinjau alur</strong><p>Langkah dan izin akhir mengikuti aturan di aplikasi admin yang terintegrasi.</p></div></div> : <div className="confirm-panel"><span className="confirm-icon"><IconShieldCheck size={24} /></span><h3>Konfirmasi {drawerAction.toLowerCase()}?</h3><p>Anda sedang melihat rancangan alur untuk <strong>{drawer.title}</strong>. Konfirmasi di sini hanya memperlihatkan umpan balik desain; data tidak berubah.</p><div className="confirm-summary"><span>Tindakan</span><strong>{drawerAction}</strong><span>Cakupan</span><strong>{scopes[scope].label}</strong></div></div>)}
    </AdminDrawer>
    {notice && <div className="toast" role="status"><IconCircleCheck size={19} />{notice}<button onClick={() => setNotice("")} aria-label="Tutup notifikasi"><IconX size={17} /></button></div>}
  </div>;
}

function FilterPills({ options, current, onChange }: { options: string[]; current: string; onChange: (value: string) => void }) {
  return <div className="filter-pills" aria-label="Filter status">{options.map((o) => <button key={o} className={o === current ? "active" : ""} aria-pressed={o === current} onClick={() => onChange(o)}>{o}</button>)}</div>;
}

function MobileFilters({ search, setSearch, filter, setFilter, options }: { search: string; setSearch: (s: string) => void; filter: string; setFilter: (s: string) => void; options: string[] }) {
  return <div className="mobile-filters"><div className="mobile-search"><IconSearch size={16} /><Input value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Cari daftar" placeholder="Cari nama atau ID" /></div><FilterPills options={options} current={filter} onChange={setFilter} /></div>;
}

function Dashboard({ scope, queueCount, go, openPerson }: { scope: Scope; queueCount: number; go: (page: Page) => void; openPerson: (name: string, kind: string, fields: { label: string; value: string }[]) => void }) {
  const national = scope === "national";
  return <><div className="dashboard-intro"><div><span className="date-label">SABTU, 31 OKTOBER 2026</span><h1>Selamat datang, Pengurus.</h1><p>Ini yang perlu perhatian hari ini di {scopes[scope].label}.</p></div><Button variant="outline" onClick={() => go("review")}>Buka antrean <IconArrowRight size={17} /></Button></div>
    <div className="stats-grid"><StatCard label="Anggota aktif" value={national ? "1.284" : scope === "korda" ? "452" : "218"} icon={<IconUsers />} delta="+12" deltaTone="success" hint="bulan ini" /><StatCard label="Menunggu verifikasi" value={String(queueCount)} icon={<IconClock />} hint="butuh peninjauan" /><StatCard label={national ? "Komsat aktif" : "Anggota baru"} value={national ? "26" : scope === "korda" ? "17" : "8"} icon={<IconBuildingCommunity />} hint={national ? "di 9 korda" : "bulan ini"} /><StatCard label="Kartu diterbitkan" value={national ? "1.102" : scope === "korda" ? "390" : "183"} icon={<IconId />} delta="+48" deltaTone="success" hint="bulan ini" /></div>
    <div className="dashboard-columns"><section className="work-panel"><SectionHead title="Perlu perhatian" caption="Mulai dari pekerjaan yang paling mendesak." /><div className="priority-list"><button onClick={() => go("review")}><span className="priority-icon red"><IconShieldCheck size={19} /></span><span><strong>{queueCount} pengajuan menunggu verifikasi</strong><small>Berkas tertua diterima 3 hari lalu</small></span><IconArrowRight size={17} /></button><button onClick={() => go("members")}><span className="priority-icon amber"><IconUsers size={19} /></span><span><strong>Data anggota perlu pembaruan</strong><small>Tinjau profil dengan informasi yang belum lengkap</small></span><IconArrowRight size={17} /></button></div></section>
      <section className="work-panel pulse-panel"><SectionHead title="Aktivitas bulan ini" caption="Gambaran singkat pergerakan anggota." /><div className="chart-top"><div><strong>+48</strong><span>anggota baru</span></div><Badge variant="success">Naik 12%</Badge></div><div className="bar-chart" aria-label="Grafik ilustratif anggota baru selama enam bulan">{[42, 56, 49, 72, 61, 86].map((h, i) => <span key={i} style={{ height: `${h}%` }} />)}</div><div className="chart-axis"><span>Mei</span><span>Jun</span><span>Jul</span><span>Agu</span><span>Sep</span><span>Okt</span></div></section></div>
    <section className="recent-section"><SectionHead title="Pengajuan terbaru" caption="Ringkasan pendaftaran yang masuk ke antrean." action={<Button variant="ghost" size="sm" onClick={() => go("review")}>Lihat semua <IconArrowRight size={16} /></Button>} /><div className="recent-list">{reviews.slice(0, 3).filter((r) => scope === "national" || (scope === "korda" ? ["Tokyo", "Yokohama"].includes(r.unit) : r.unit === "Tokyo")).map((r) => <button key={r.id} onClick={() => openPerson(r.name, "Pengajuan " + r.id, [{ label: "Jenis", value: r.kind }, { label: "Komisariat", value: r.unit }, { label: "Status", value: r.status }])}><Person initials={r.initials} name={r.name} detail={`${r.id} · ${r.unit}`} /><span>{r.received}</span><StatusBadge value={r.status} /><IconChevronRight size={18} /></button>)}</div></section>
    <section className="network-section"><SectionHead title={national ? "Jaringan PPI Jepang" : "Cakupan anggota"} caption={national ? "Sebaran anggota dan kelengkapan data di seluruh jaringan." : `Ringkasan unit dalam ${scopes[scope].label}.`} action={scope !== "komsat" && <Button variant="ghost" size="sm" onClick={() => go("units")}>Lihat organisasi <IconArrowRight size={16} /></Button>} /><div className="network-strip"><div><strong>{national ? "9" : scope === "korda" ? "4" : "1"}</strong><span>{national ? "Koordinator daerah" : "Unit aktif"}</span></div><div><strong>{national ? "26" : scope === "korda" ? "4" : "218"}</strong><span>{national || scope === "korda" ? "Komisariat aktif" : "Anggota terdaftar"}</span></div><div><strong>{national ? "74%" : scope === "korda" ? "79%" : "82%"}</strong><span>Profil lengkap</span></div></div><div className="coverage"><div className="coverage-head"><strong>{scope === "komsat" ? "Kelengkapan data anggota" : "Sebaran anggota"}</strong><span>Data contoh</span></div>{(scope === "national" ? [{ name: "Kanto", value: 452, width: 100 }, { name: "Kansai", value: 306, width: 68 }, { name: "Chubu", value: 183, width: 40 }, { name: "Kyushu", value: 104, width: 23 }] : scope === "korda" ? [{ name: "Tokyo", value: 218, width: 100 }, { name: "Yokohama", value: 96, width: 44 }, { name: "Chiba", value: 74, width: 34 }, { name: "Saitama", value: 64, width: 29 }] : [{ name: "Profil lengkap", value: 179, width: 82 }, { name: "Perlu pembaruan", value: 39, width: 18 }]).map((item) => <div className="coverage-row" key={item.name}><span>{item.name}</span><div aria-hidden="true"><i style={{ width: `${item.width}%` }} /></div><strong>{item.value}</strong></div>)}</div></section>
  </>;
}

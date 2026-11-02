import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  IconActivity, IconAlertCircle, IconArrowDownRight, IconArrowRight, IconBell, IconBuildingCommunity,
  IconChartBar, IconChevronDown, IconChevronLeft, IconChevronRight, IconCircleCheck, IconClock,
  IconId, IconLayoutDashboard, IconLogout, IconMenu2, IconUser,
  IconSearch, IconSettings, IconShieldCheck, IconSparkles, IconUser as IconUserCircle, IconUsers, IconX,
} from "@tabler/icons-react";
import {
  AdminDrawer, Badge, BottomBar, Button, Input,
  PageHeader, Table, TableBody, TableCell, TableHead, TableHeader,
  TableRow,
} from "ppij-design-system";
import { ReviewWorkspace, reviewSamples } from "./ReviewWorkspace";
import { MemberPage } from "./MemberPage";
import { ManagementPage } from "./ManagementPage";
import { MapCard, MapSideCard, type StatsTopic } from "./MapCard";
import { FiguresBand } from "./FiguresBand";
import { StatsPage } from "./StatsPage";
import { formatCount, statsByScope, trendFor } from "./statsData";
import previewPackage from "../package.json";
import designSystemPackage from "../../../packages/ui/package.json";

type Page = "dashboard" | "stats" | "review" | "members" | "roles" | "units";
type Scope = "national" | "korda" | "komsat";

const nav: { id: Page; label: string; icon: typeof IconActivity }[] = [
  { id: "dashboard", label: "Dashboard", icon: IconLayoutDashboard },
  { id: "stats", label: "Statistik", icon: IconChartBar },
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

const reviews = reviewSamples;


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
  const [scopeQuery, setScopeQuery] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMore, setMobileMore] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Semua");
  const [reviewInitialId, setReviewInitialId] = useState<string | null>(null);
  const [statsTopic, setStatsTopic] = useState<StatsTopic>("anggota");
  const [profileOpen, setProfileOpen] = useState(false);
  const [drawer, setDrawer] = useState<{ title: string; kind: string; details: { label: string; value: string }[] } | null>(null);
  const [drawerStep, setDrawerStep] = useState<1 | 2>(1);
  const [drawerAction, setDrawerAction] = useState("");
  const [notice, setNotice] = useState<{ message: string; tone: "success" | "error" } | null>(null);

  function go(next: Page) {
    setPage(next); setSearch(""); setFilter("Semua"); setReviewInitialId(null); setMobileMore(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function chooseScope(next: Scope) {
    setScope(next); setScopeOpen(false); setScopeQuery("");
    if (next === "komsat" && page === "units") go("dashboard");
  }

  function demo(message: string, tone: "success" | "error" = "success") {
    setNotice({ message, tone });
    window.setTimeout(() => setNotice(null), 4200);
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

  function goReview(id: string) {
    setReviewInitialId(id); setPage("review"); setMobileMore(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  useEffect(() => {
    if (!profileOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setProfileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [profileOpen]);

  function goStats(topic: StatsTopic) {
    setStatsTopic(topic); setPage("stats"); setMobileMore(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const visibleNav = scope === "komsat" ? nav.filter((n) => n.id !== "units") : nav;
  // The shell badge, the figures band, and the Antrean card share one source (production: GET /v1/admin/review counts.baru).
  const queueCount = statsByScope[scope].review.baru;
  const roleCaption = scope === "national" ? "Admin nasional \u00b7 PPI Jepang" : scope === "korda" ? "Admin korda \u00b7 Korda Kanto" : "Admin komsat \u00b7 Komsat Tokyo";
  const scopedAdmins = admins.filter((a) => scope === "national" || (scope === "korda" ? ["Kanto", "Tokyo", "Yokohama", "Chiba", "Saitama"].includes(a.scope) : a.scope === "Tokyo"));


  const pageTitle = nav.find((n) => n.id === page)?.label ?? "Dashboard";
  const bottomItems = visibleNav.slice(0, 4).map((n) => ({ label: n.label === "Admin & Peran" ? "Peran" : n.label, href: `#${n.id}`, icon: <n.icon size={21} stroke={1.8} />, current: page === n.id, badge: n.id === "review" ? queueCount : undefined }));
  if (visibleNav.length > 4) bottomItems.push({ label: "Lainnya", href: "#more", icon: <IconMenu2 size={21} stroke={1.8} />, current: page === "units" || page === "roles", badge: undefined });

  return <div className="admin-app">
    <aside className="sidebar" data-collapsed={sidebarCollapsed} aria-label="Navigasi admin">
      <div className="sidebar-brand"><div className="brand-logo"><img src="/ppij-logo.png" alt="PPI Jepang" /></div><div className="sidebar-brand-copy"><strong>PPI Jepang</strong><span>ADMIN PORTAL</span></div><button className="sidebar-toggle" type="button" aria-label={sidebarCollapsed ? "Tampilkan navigasi" : "Sembunyikan navigasi"} aria-expanded={!sidebarCollapsed} onClick={() => { setSidebarCollapsed((value) => !value); setScopeOpen(false); }}><IconChevronLeft size={18} /></button></div>
      <div className="scope-wrap"><button className="scope-button" onClick={() => { setScopeOpen(!scopeOpen); setScopeQuery(""); }} aria-expanded={scopeOpen} aria-label={`Ruang kerja: ${scopes[scope].label}`}><span className="scope-mark"><IconBuildingCommunity size={18} /></span><span><small>RUANG KERJA</small><strong className="scope-full">{scopes[scope].label}</strong><strong className="scope-compact">{scopes[scope].short}</strong></span><IconChevronDown size={16} className={scopeOpen ? "rotate" : ""} /></button>
        {scopeOpen && <div className="scope-list" role="group" aria-label="Pilih ruang kerja"><Input value={scopeQuery} onChange={(event) => setScopeQuery(event.target.value)} placeholder="Cari korda atau komsat" aria-label="Cari korda atau komsat" />{(Object.keys(scopes) as Scope[]).filter((id) => `${scopes[id].label} ${scopes[id].type}`.toLocaleLowerCase("id").includes(scopeQuery.toLocaleLowerCase("id"))).map((id) => <button key={id} aria-pressed={scope === id} onClick={() => chooseScope(id)}><span>{scopes[id].label}<small>{scopes[id].type}</small></span>{scope === id && <IconCircleCheck size={17} />}</button>)}</div>}</div>
      <div className="sidebar-switch" role="group" aria-label="Buka">
        <a href="#portal" onClick={(e) => { e.preventDefault(); demo("Ini pratinjau. Portal mengikuti alur produksi."); }}>Portal</a>
        <span aria-current="page">Admin</span>
      </div>
      <p className="nav-caption">MENU UTAMA</p>
      <nav className="nav-list">{visibleNav.map((n) => <button key={n.id} className={page === n.id ? "nav-item active" : "nav-item"} onClick={() => go(n.id)} aria-label={n.label} title={sidebarCollapsed ? n.label : undefined} aria-current={page === n.id ? "page" : undefined}><n.icon size={19} stroke={1.85} /><span>{n.label}</span>{n.id === "review" && <span className="nav-count">{queueCount}</span>}</button>)}</nav>
      <div className="sidebar-foot"><button type="button" className="identity-chip" onClick={() => setProfileOpen(true)} aria-haspopup="dialog"><span className="av">PA</span><span className="who"><b>Contoh Pengurus A</b><small>{roleCaption}</small></span><IconChevronRight size={14} /></button><div className="sample-label"><IconSparkles size={16} /><span>PRATINJAU DESAIN</span></div><p>Data pada layar ini hanya contoh untuk meninjau pengalaman admin.</p><button aria-label="Bantuan dan pengaturan" title={sidebarCollapsed ? "Bantuan & pengaturan" : undefined} onClick={() => demo("Pusat bantuan akan tersedia setelah integrasi.")}><IconSettings size={17} /><span>Bantuan & pengaturan</span><IconArrowRight size={16} /></button></div>
    </aside>
    <div className="main-wrap">
      <header className="topbar"><div className="topbar-path"><span>Admin</span><IconChevronRight size={15} /><strong>{pageTitle}</strong></div><div className="topbar-actions"><span className="today">Sabtu, 31 Oktober 2026</span><button className="icon-action" aria-label="Notifikasi" onClick={() => demo("Tidak ada notifikasi baru dalam pratinjau.")}><IconBell size={20} /></button><span className="top-avatar">PA</span><span className="top-name">Contoh Pengurus A</span></div></header>
      <div className="mobile-topbar"><div className="mobile-brand"><img src="/ppij-logo.png" alt="PPI Jepang" /><span>Admin PPIJ</span></div><div className="mobile-topbar-right"><button className="mobile-scope" onClick={() => { setScopeOpen(!scopeOpen); setScopeQuery(""); }}>{scopes[scope].short}<IconChevronDown size={15} /></button>{scopeOpen && <div className="mobile-scope-menu"><Input value={scopeQuery} onChange={(event) => setScopeQuery(event.target.value)} placeholder="Cari korda atau komsat" aria-label="Cari korda atau komsat" />{(Object.keys(scopes) as Scope[]).filter((id) => `${scopes[id].label} ${scopes[id].type}`.toLocaleLowerCase("id").includes(scopeQuery.toLocaleLowerCase("id"))).map((id) => <button key={id} onClick={() => chooseScope(id)}>{scopes[id].label}</button>)}</div>}<button type="button" className="mobile-avatar" onClick={() => setProfileOpen(true)} aria-label="Profil pengguna" aria-haspopup="dialog">PA</button></div></div>
      <main id="main" className="content">
        <div className="preview-banner"><span><IconSparkles size={16} /> PRATINJAU ADMIN V1</span><p>Seluruh nama dan angka di halaman ini adalah data contoh.</p></div>
        {page === "dashboard" && <Dashboard scope={scope} queueCount={queueCount} go={go} goStats={goStats} openReview={goReview} />}
        {page === "stats" && <StatsPage scope={scope} scopeName={scopes[scope].label} topic={statsTopic} onTopic={setStatsTopic} />}
        {page === "review" && <div className="verification-page-island"><PageHeader title="Verifikasi anggota" description={`Tinjau pendaftaran dan perubahan data untuk ${scopePhrase[scope]}.`} />
          <ReviewWorkspace scope={scope} initialSelectedId={reviewInitialId} onNotice={demo} />
        </div>}
        {page === "members" && <MemberPage scope={scope} scopePhrase={scopePhrase[scope]} onNotice={demo} />}
        {(page === "roles" || page === "units") && <ManagementPage key={`${page}-${scope}`} kind={page} scope={scope} open={openPerson} onNotice={demo} />}
        <footer className="page-footer"><span>PPI Jepang · Admin preview v{previewPackage.version} · Design system v{designSystemPackage.version}</span><span>Data ilustratif · 31 Okt 2026</span></footer>
      </main>
    </div>
    <div className="bottom-wrap" onClickCapture={(e) => { const link = (e.target as HTMLElement).closest("a[href^='#']"); if (!link) return; e.preventDefault(); const target = link.getAttribute("href")!.slice(1); if (target === "more") setMobileMore(!mobileMore); else go(target as Page); }}><BottomBar items={bottomItems} ariaLabel="Navigasi admin" />{mobileMore && <div className="more-menu"><button onClick={() => go("units")}><IconBuildingCommunity size={19} /> Organisasi</button><button onClick={() => go("roles")}><IconId size={19} /> Admin & Peran</button><button onClick={() => demo("Pusat bantuan akan tersedia setelah integrasi.")}><IconSettings size={19} /> Bantuan & pengaturan</button></div>}</div>
    <AdminDrawer size="sm" density="compact" className="admin-detail-drawer" open={drawer !== null} onOpenChange={(open) => { if (!open) setDrawer(null); }} title={drawer?.title ?? "Detail"} description={drawer?.kind} locale="id" step={drawerStep} onBack={() => setDrawerStep(1)} footer={drawerStep === 2 ? <Button size="sm" onClick={() => { setDrawer(null); demo(`${drawerAction} adalah contoh alur. Tidak ada data yang berubah.`); }}>Konfirmasi {drawerAction.toLowerCase()} <IconArrowRight size={16} /></Button> : drawer?.kind.startsWith("Pengajuan") ? <><Button size="sm" variant="outline" onClick={() => previewAction("Minta perbaikan")}>Minta perbaikan</Button><Button size="sm" onClick={() => previewAction("Setujui")}>Setujui</Button></> : drawer?.kind === "Penugasan pengurus" ? <><Button size="sm" variant="outline" onClick={() => previewAction("Cabut akses")}>Cabut akses</Button><Button size="sm" onClick={() => previewAction("Ubah peran")}>Ubah peran</Button></> : drawer?.kind === "Profil anggota" ? <Button size="sm" onClick={() => previewAction("Lihat kartu")}>Lihat kartu <IconArrowRight size={16} /></Button> : drawer?.kind === "Korda" || drawer?.kind === "Komsat" ? <Button size="sm" onClick={() => previewAction("Ubah unit")}>Ubah unit <IconArrowRight size={16} /></Button> : <Button size="sm" onClick={() => previewAction("Lanjutkan")}>Lanjutkan <IconArrowRight size={16} /></Button>}>
      {drawer && (drawerStep === 1 ? <div className="drawer-body"><div className="drawer-stamp"><IconShieldCheck size={16} /><span>Informasi contoh untuk peninjauan desain</span></div><dl>{drawer.details.map((d) => <div key={d.label}><dt>{d.label}</dt><dd>{d.value}</dd></div>)}</dl>{drawer.kind.startsWith("Pengajuan") && <div className="review-checklist"><h3>Kelengkapan pengajuan</h3><div><IconCircleCheck size={17} /> Identitas anggota terisi</div><div><IconCircleCheck size={17} /> Komisariat dipilih</div><div><IconCircleCheck size={17} /> Dokumen pendukung tersedia</div><p>Periksa dokumen asli dan ketentuan izin sebelum membuat keputusan di aplikasi terintegrasi.</p></div>}{drawer.kind === "Alur undangan" && <div className="drawer-form"><label htmlFor="invite-email">Email calon anggota</label><Input id="invite-email" type="email" placeholder="nama@contoh.com" /></div>}{drawer.kind === "Alur penunjukan" && <div className="drawer-form"><label htmlFor="appoint-name">Nama anggota aktif</label><Input id="appoint-name" placeholder="Cari anggota" /><label htmlFor="appoint-role">Peran yang ditunjuk</label><select id="appoint-role" defaultValue="Verifikator"><option>Verifikator</option><option>Admin komsat</option><option>Admin korda</option></select></div>}{drawer.kind === "Alur organisasi" && <div className="drawer-form"><label htmlFor="unit-name">Nama unit</label><Input id="unit-name" placeholder="Nama korda atau komisariat" /></div>}<div className="drawer-note"><strong>Pratinjau alur</strong><p>Langkah dan izin akhir mengikuti aturan di aplikasi admin yang terintegrasi.</p></div></div> : <div className="confirm-panel"><span className="confirm-icon"><IconShieldCheck size={20} /></span><h3>Konfirmasi {drawerAction.toLowerCase()}?</h3><p>Anda sedang melihat rancangan alur untuk <strong>{drawer.title}</strong>. Konfirmasi di sini hanya memperlihatkan umpan balik desain; data tidak berubah.</p><div className="confirm-summary"><span>Tindakan</span><strong>{drawerAction}</strong><span>Cakupan</span><strong>{scopes[scope].label}</strong></div></div>)}
    </AdminDrawer>
    {profileOpen ? (<>
      <div className="sheet-backdrop" onClick={() => setProfileOpen(false)} />
      <div className="profile-sheet" role="dialog" aria-label="Profil pengguna">
        <div className="sheet-handle" aria-hidden="true"></div>
        <div className="sheet-head"><span className="av">PA</span><span><b>Contoh Pengurus A</b><small>{roleCaption}</small></span><button type="button" className="sheet-close" onClick={() => setProfileOpen(false)} aria-label="Tutup profil"><IconX size={18} /></button></div>
        <div className="sheet-switch"><small>BUKA</small><div className="sidebar-switch sheet-pill"><a href="#portal" onClick={(e) => { e.preventDefault(); demo("Ini pratinjau. Portal mengikuti alur produksi."); }}>Portal</a><span aria-current="page">Admin</span></div></div>
        <div className="sheet-rows">
          <button type="button" className="sheet-row" onClick={() => demo("Ini pratinjau. Profil & akun menuju /akun di produksi.")}><IconUserCircle size={16} /><span>Profil &amp; akun<small className="sub">Menuju /akun di produksi</small></span></button>
          <button type="button" className="sheet-row exit" onClick={() => { setProfileOpen(false); demo("Ini pratinjau. Keluar mengikuti alur produksi."); }}><IconLogout size={16} /><span>Keluar</span></button>
        </div>
      </div>
    </>) : null}
    {notice && <div className="toast" data-tone={notice.tone} role={notice.tone === "error" ? "alert" : "status"}>{notice.tone === "error" ? <IconAlertCircle size={19} /> : <IconCircleCheck size={19} />}{notice.message}<button onClick={() => setNotice(null)} aria-label="Tutup notifikasi"><IconX size={17} /></button></div>}
  </div>;
}

function FilterPills({ options, current, onChange }: { options: string[]; current: string; onChange: (value: string) => void }) {
  return <div className="filter-pills" aria-label="Filter status">{options.map((o) => <button key={o} className={o === current ? "active" : ""} aria-pressed={o === current} onClick={() => onChange(o)}>{o}</button>)}</div>;
}

function MobileFilters({ search, setSearch, filter, setFilter, options }: { search: string; setSearch: (s: string) => void; filter: string; setFilter: (s: string) => void; options: string[] }) {
  return <div className="mobile-filters"><div className="mobile-search"><IconSearch size={16} /><Input value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Cari daftar" placeholder="Cari nama atau ID" /></div><FilterPills options={options} current={filter} onChange={setFilter} /></div>;
}

/** Map-first dashboard: hero map (full island width), its level side card, then grouped figures. */
function Dashboard({ scope, queueCount, go, goStats, openReview }: { scope: Scope; queueCount: number; go: (page: Page) => void; goStats: (topic: StatsTopic) => void; openReview: (id: string) => void }) {
  const stats = statsByScope[scope];
  const trend = trendFor(6);
  const lastNew = trend.new[trend.new.length - 1];
  const prevNew = trend.new[trend.new.length - 2];
  const pct = prevNew > 0 ? Math.round(((lastNew - prevNew) / prevNew) * 100) : 0;
  const maxNew = Math.max(...trend.new);
  return <><div className="dashboard-intro"><div><span className="date-label">SABTU, 31 OKTOBER 2026</span><h1>Selamat datang, Pengurus.</h1><p>Ini yang perlu perhatian hari ini di {scopes[scope].label}.</p></div><Button size="sm" variant="outline" onClick={() => go("review")}>Buka antrean <IconArrowRight size={16} /></Button></div>
    <MapCard key={scope} scope={scope} scopeName={scopes[scope].label} onOpenStats={goStats} />
    <MapSideCard scope={scope} onOpenReview={() => go("review")} />
    <FiguresBand scope={scope} onOpenTopic={goStats} />
    <div className="dashboard-columns"><section className="work-panel"><SectionHead title="Perlu perhatian" caption="Mulai dari pekerjaan yang paling mendesak." /><div className="priority-list"><button onClick={() => go("review")}><span className="priority-icon red"><IconShieldCheck size={19} /></span><span><strong>{queueCount} pengajuan menunggu verifikasi</strong><small>Berkas tertua diterima 8 hari lalu</small></span><IconArrowRight size={17} /></button><button onClick={() => go("members")}><span className="priority-icon amber"><IconUsers size={19} /></span><span><strong>Data anggota perlu pembaruan</strong><small>Tinjau profil dengan informasi yang belum lengkap</small></span><IconArrowRight size={17} /></button></div></section>
      <section className="work-panel pulse-panel"><SectionHead title="Aktivitas bulan ini" caption="Anggota baru per bulan, enam bulan terakhir." /><div className="chart-top"><div><strong>+{formatCount(stats.tiles.new_this_month)}</strong><span>anggota baru</span></div><Badge variant={pct >= 0 ? "success" : "destructive"}>{pct >= 0 ? "Naik" : "Turun"} {Math.abs(pct)}%</Badge></div><div className="bar-chart" aria-label="Anggota baru per bulan, enam bulan terakhir">{trend.new.map((h, i) => <span key={i} style={{ height: `${Math.max(6, (h / maxNew) * 100)}%` }} />)}</div><div className="chart-axis">{trend.labels.map((label) => <span key={label}>{label}</span>)}</div><p className="stat-footnote">Seri contoh — kontrak produksi: GET /v1/admin/stats/timeseries.</p></section></div>
    <section className="recent-section"><SectionHead title="Pengajuan terbaru" caption="Ringkasan pendaftaran yang masuk ke antrean." action={<Button variant="ghost" size="sm" onClick={() => go("review")}>Lihat semua <IconArrowRight size={16} /></Button>} /><div className="recent-list">{reviews.slice(0, 3).filter((r) => scope === "national" || (scope === "korda" ? ["Tokyo", "Yokohama"].includes(r.unit) : r.unit === "Tokyo")).map((r) => <button key={r.id} onClick={() => openReview(r.id)}><Person initials={r.initials} name={r.name} detail={`${r.id} · ${r.unit}`} /><span>{r.received}</span><Badge variant={r.tab === "dikirim_ulang" ? "warning" : "secondary"}>{r.tab === "dikirim_ulang" ? "Dikirim ulang" : "Baru"}</Badge><IconChevronRight size={18} /></button>)}</div></section>
  </>;
}

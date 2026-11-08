import { useEffect, useState } from "react";
import {
  IconActivity, IconAlertCircle, IconArrowRight, IconBell, IconBuildingCommunity,
  IconChartBar, IconChevronLeft, IconChevronRight, IconCircleCheck, IconId,
  IconLayoutDashboard, IconLogout, IconMenu2, IconSearch, IconSettings, IconShieldCheck,
  IconSparkles, IconUser as IconUserCircle, IconUsers, IconX,
} from "@tabler/icons-react";
import {
  AccountSheet, AdminDrawer, AdminTopBar, Badge, BarChart, BottomBar, Button, Callout,
  FactList, FormField, FormGrid, IdentityChip, Input, ListRow, PageHeader, PanelCard,
  WorkspaceSelector,
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



const workspaceOptions = (Object.keys(scopes) as Scope[]).map((id) => ({ id, label: scopes[id].label, short: scopes[id].short, kind: scopes[id].type }));

export function App() {
  const [page, setPage] = useState<Page>("dashboard");
  const [scope, setScope] = useState<Scope>("national");
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

  function chooseScope(next: string) {
    const id = next as Scope;
    setScope(id);
    if (id === "komsat" && page === "units") go("dashboard");
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
  const roleCaption = scope === "national" ? "Admin nasional · PPI Jepang" : scope === "korda" ? "Admin korda · Korda Kanto" : "Admin komsat · Komsat Tokyo";

  const pageTitle = nav.find((n) => n.id === page)?.label ?? "Dashboard";
  const bottomItems = visibleNav.slice(0, 4).map((n) => ({ label: n.label === "Admin & Peran" ? "Peran" : n.label, href: `#${n.id}`, icon: <n.icon size={21} stroke={1.8} />, current: page === n.id, badge: n.id === "review" ? queueCount : undefined }));
  if (visibleNav.length > 4) bottomItems.push({ label: "Lainnya", href: "#more", icon: <IconMenu2 size={21} stroke={1.8} />, current: page === "units" || page === "roles", badge: undefined });

  const identity = { name: "Contoh Pengurus A", initials: "PA" };

  return <div className="admin-app">
    <aside className="sidebar" data-collapsed={sidebarCollapsed} aria-label="Navigasi admin">
      <div className="sidebar-brand"><div className="brand-logo"><img src="/ppij-logo.png" alt="PPI Jepang" /></div><div className="sidebar-brand-copy"><strong>PPI Jepang</strong><span>ADMIN PORTAL</span></div><button className="sidebar-toggle" type="button" aria-label={sidebarCollapsed ? "Tampilkan navigasi" : "Sembunyikan navigasi"} aria-expanded={!sidebarCollapsed} onClick={() => setSidebarCollapsed((value) => !value)}><IconChevronLeft size={18} /></button></div>
      <WorkspaceSelector variant="sidebar" collapsed={sidebarCollapsed} locale="id" value={scope} options={workspaceOptions} onChange={chooseScope} />
      <div className="sidebar-switch" role="group" aria-label="Buka">
        <a href="#portal" onClick={(e) => { e.preventDefault(); demo("Ini pratinjau. Portal mengikuti alur produksi."); }}>Portal</a>
        <span aria-current="page">Admin</span>
      </div>
      <p className="nav-caption">MENU UTAMA</p>
      <nav className="nav-list">{visibleNav.map((n) => <button key={n.id} className={page === n.id ? "nav-item active" : "nav-item"} onClick={() => go(n.id)} aria-label={n.label} title={sidebarCollapsed ? n.label : undefined} aria-current={page === n.id ? "page" : undefined}><n.icon size={19} stroke={1.85} /><span>{n.label}</span>{n.id === "review" && <span className="nav-count">{queueCount}</span>}</button>)}</nav>
      <div className="sidebar-foot"><IdentityChip collapsed={sidebarCollapsed} name={identity.name} detail={roleCaption} initials={identity.initials} onClick={() => setProfileOpen(true)} /><div className="sample-label"><IconSparkles size={16} /><span>PRATINJAU DESAIN</span></div><p>Data pada layar ini hanya contoh untuk meninjau pengalaman admin.</p><button aria-label="Bantuan dan pengaturan" title={sidebarCollapsed ? "Bantuan & pengaturan" : undefined} onClick={() => demo("Pusat bantuan akan tersedia setelah integrasi.")}><IconSettings size={17} /><span>Bantuan & pengaturan</span><IconArrowRight size={16} /></button></div>
    </aside>
    <div className="main-wrap">
      {/* One variant is visible at a time, so the shell keeps exactly one header landmark. */}
      <AdminTopBar
        variant="desktop"
        className="max-[700px]:hidden"
        locale="id"
        path={[{ label: "Admin" }]}
        title={pageTitle}
        meta={["Sabtu, 31 Oktober 2026"]}
        notificationCount={queueCount}
        onNotificationsClick={() => demo("Tidak ada notifikasi baru dalam pratinjau.")}
        identity={identity}
        onIdentityClick={() => setProfileOpen(true)}
      />
      <AdminTopBar
        variant="phone"
        className="min-[701px]:hidden"
        locale="id"
        path={[{ label: "Admin" }]}
        title={pageTitle}
        brand={{ src: "/ppij-logo.png", alt: "PPI Jepang", label: "Admin PPIJ" }}
        identity={identity}
        onIdentityClick={() => setProfileOpen(true)}
        leading={<WorkspaceSelector variant="phone" locale="id" value={scope} options={workspaceOptions} onChange={chooseScope} />}
      />
      <main id="main" className="content">
        <div className="preview-banner"><span><IconSparkles size={16} /> PRATINJAU ADMIN V1</span><p>Seluruh nama dan angka di halaman ini adalah data contoh.</p></div>
        {page === "dashboard" && <Dashboard scope={scope} queueCount={queueCount} go={go} goStats={goStats} openReview={goReview} />}
        {page === "stats" && <StatsPage scope={scope} scopeName={scopes[scope].label} topic={statsTopic} onTopic={setStatsTopic} />}
        {page === "review" && <PanelCard padding="page" className="grid gap-0"><PageHeader title="Verifikasi anggota" description={`Tinjau pendaftaran anggota untuk ${scopePhrase[scope]}.`} />
          <ReviewWorkspace scope={scope} initialSelectedId={reviewInitialId} onNotice={demo} />
        </PanelCard>}
        {page === "members" && <MemberPage scope={scope} scopePhrase={scopePhrase[scope]} onNotice={demo} />}
        {(page === "roles" || page === "units") && <ManagementPage key={`${page}-${scope}`} kind={page} scope={scope} open={openPerson} onNotice={demo} />}
        <footer className="page-footer"><span>PPI Jepang · Admin preview v{previewPackage.version} · Design system v{designSystemPackage.version}</span><span>Data ilustratif · 31 Okt 2026</span></footer>
      </main>
    </div>
    <div className="bottom-wrap" onClickCapture={(e) => { const link = (e.target as HTMLElement).closest("a[href^='#']"); if (!link) return; e.preventDefault(); const target = link.getAttribute("href")!.slice(1); if (target === "more") setMobileMore(!mobileMore); else go(target as Page); }}><BottomBar items={bottomItems} ariaLabel="Navigasi admin" />{mobileMore && <div className="more-menu"><button onClick={() => go("units")}><IconBuildingCommunity size={19} /> Organisasi</button><button onClick={() => go("roles")}><IconId size={19} /> Admin & Peran</button><button onClick={() => demo("Pusat bantuan akan tersedia setelah integrasi.")}><IconSettings size={19} /> Bantuan & pengaturan</button></div>}</div>
    <AdminDrawer size="sm" density="compact" className="admin-detail-drawer" open={drawer !== null} onOpenChange={(open) => { if (!open) setDrawer(null); }} title={drawer?.title ?? "Detail"} description={drawer?.kind} locale="id" step={drawerStep} onBack={() => setDrawerStep(1)} footer={drawerStep === 2 ? <Button size="sm" onClick={() => { setDrawer(null); demo(`${drawerAction} adalah contoh alur. Tidak ada data yang berubah.`); }}>Konfirmasi {drawerAction.toLowerCase()} <IconArrowRight size={16} /></Button> : drawer?.kind.startsWith("Pengajuan") ? <><Button size="sm" variant="outline" onClick={() => previewAction("Minta perbaikan")}>Minta perbaikan</Button><Button size="sm" onClick={() => previewAction("Setujui")}>Setujui</Button></> : drawer?.kind === "Penugasan pengurus" ? <><Button size="sm" variant="outline" onClick={() => previewAction("Cabut akses")}>Cabut akses</Button><Button size="sm" onClick={() => previewAction("Ubah peran")}>Ubah peran</Button></> : drawer?.kind === "Profil anggota" ? <Button size="sm" onClick={() => previewAction("Lihat kartu")}>Lihat kartu <IconArrowRight size={16} /></Button> : drawer?.kind === "Korda" || drawer?.kind === "Komsat" ? <Button size="sm" onClick={() => previewAction("Ubah unit")}>Ubah unit <IconArrowRight size={16} /></Button> : <Button size="sm" onClick={() => previewAction("Lanjutkan")}>Lanjutkan <IconArrowRight size={16} /></Button>}>
      {drawer && (drawerStep === 1 ? <div className="grid gap-4">
        <Callout density="compact" tone="neutral" icon={<IconShieldCheck stroke={1.75} aria-hidden />}>Informasi contoh untuk peninjauan desain</Callout>
        <FactList variant="rows" items={drawer.details.map((d) => ({ label: d.label, value: d.value }))} />
        {drawer.kind.startsWith("Pengajuan") && <div className="review-checklist"><h3>Kelengkapan pengajuan</h3><div><IconCircleCheck size={17} /> Identitas anggota terisi</div><div><IconCircleCheck size={17} /> Komisariat dipilih</div><div><IconCircleCheck size={17} /> Dokumen pendukung tersedia</div><p>Periksa dokumen asli dan ketentuan izin sebelum membuat keputusan di aplikasi terintegrasi.</p></div>}
        {drawer.kind === "Alur undangan" && <FormGrid columns={1}><FormField label="Email calon anggota"><Input id="invite-email" type="email" placeholder="nama@contoh.com" /></FormField></FormGrid>}
        {drawer.kind === "Alur penunjukan" && <FormGrid columns={1}><FormField label="Nama anggota aktif"><Input id="appoint-name" placeholder="Cari anggota" /></FormField><FormField label="Peran yang ditunjuk"><select id="appoint-role" defaultValue="Verifikator"><option>Verifikator</option><option>Admin komsat</option><option>Admin korda</option></select></FormField></FormGrid>}
        {drawer.kind === "Alur organisasi" && <FormGrid columns={1}><FormField label="Nama unit"><Input id="unit-name" placeholder="Nama korda atau komisariat" /></FormField></FormGrid>}
        <Callout density="compact" tone="warning" title="Pratinjau alur">Langkah dan izin akhir mengikuti aturan di aplikasi admin yang terintegrasi.</Callout>
      </div> : <div className="grid gap-3"><span className="grid size-9 place-items-center rounded-lg bg-brand-red/8 text-brand-red"><IconShieldCheck size={20} /></span><h3 className="text-sm font-bold text-brand-ink">Konfirmasi {drawerAction.toLowerCase()}?</h3><p className="text-[13px] text-brand-muted">Anda sedang melihat rancangan alur untuk <strong className="text-brand-ink">{drawer.title}</strong>. Konfirmasi di sini hanya memperlihatkan umpan balik desain; data tidak berubah.</p><FactList variant="rows" items={[{ label: "Tindakan", value: drawerAction }, { label: "Cakupan", value: scopes[scope].label }]} /></div>)}
    </AdminDrawer>
    <AccountSheet
      open={profileOpen}
      onOpenChange={setProfileOpen}
      locale="id"
      name={identity.name}
      detail={roleCaption}
      initials={identity.initials}
      switchSlot={<div className="grid gap-1.5"><small className="text-[10px] font-extrabold tracking-[.12em] text-brand-muted">BUKA</small><div className="sidebar-switch sheet-pill"><a href="#portal" onClick={(e) => { e.preventDefault(); demo("Ini pratinjau. Portal mengikuti alur produksi."); }}>Portal</a><span aria-current="page">Admin</span></div></div>}
      items={[{ label: "Profil & akun", sublabel: "Menuju /akun di produksi", icon: <IconUserCircle aria-hidden />, onSelect: () => { setProfileOpen(false); demo("Ini pratinjau. Profil & akun menuju /akun di produksi."); } }]}
      signOutLabel="Keluar"
      onSignOut={() => { setProfileOpen(false); demo("Ini pratinjau. Keluar mengikuti alur produksi."); }}
    />
    {notice && <div className="toast" data-tone={notice.tone} role={notice.tone === "error" ? "alert" : "status"}>{notice.tone === "error" ? <IconAlertCircle size={19} /> : <IconCircleCheck size={19} />}{notice.message}<button onClick={() => setNotice(null)} aria-label="Tutup notifikasi"><IconX size={17} /></button></div>}
  </div>;
}


/** Map-first dashboard: hero map (full island width), its level side card, then grouped figures. */
function Dashboard({ scope, queueCount, go, goStats, openReview }: { scope: Scope; queueCount: number; go: (page: Page) => void; goStats: (topic: StatsTopic) => void; openReview: (id: string) => void }) {
  const stats = statsByScope[scope];
  const trend = trendFor(6);
  const lastNew = trend.new[trend.new.length - 1];
  const prevNew = trend.new[trend.new.length - 2];
  const pct = prevNew > 0 ? Math.round(((lastNew - prevNew) / prevNew) * 100) : 0;
  const recent = reviews.slice(0, 3).filter((r) => scope === "national" || (scope === "korda" ? ["Tokyo", "Yokohama"].includes(r.unit) : r.unit === "Tokyo"));
  return <><div className="dashboard-intro"><div><span className="date-label">SABTU, 31 OKTOBER 2026</span><h1>Selamat datang, Pengurus.</h1><p>Ini yang perlu perhatian hari ini di {scopes[scope].label}.</p></div><Button size="sm" variant="outline" onClick={() => go("review")}>Buka antrean <IconArrowRight size={16} /></Button></div>
    <MapCard key={scope} scope={scope} scopeName={scopes[scope].label} onOpenStats={goStats} />
    <MapSideCard scope={scope} onOpenReview={() => go("review")} />
    <FiguresBand scope={scope} onOpenTopic={goStats} />
    <div className="dashboard-columns">
      <PanelCard title="Perlu perhatian" description="Mulai dari pekerjaan yang paling mendesak.">
        <div className="grid">
          <ListRow
            leading={<span className="grid size-9 place-items-center rounded-md bg-brand-red/8 text-brand-red"><IconShieldCheck aria-hidden className="size-[19px]" /></span>}
            title={`${queueCount} pengajuan menunggu verifikasi`}
            subtitle="Berkas tertua diterima 8 hari lalu"
            trailing={<IconArrowRight aria-hidden className="size-[17px] text-brand-muted" />}
            onSelect={() => go("review")}
          />
          <ListRow
            leading={<span className="grid size-9 place-items-center rounded-md bg-[#fff4e7] text-[#a66d20]"><IconUsers aria-hidden className="size-[19px]" /></span>}
            title="Data anggota perlu pembaruan"
            subtitle="Tinjau profil dengan informasi yang belum lengkap"
            trailing={<IconArrowRight aria-hidden className="size-[17px] text-brand-muted" />}
            onSelect={() => go("members")}
          />
        </div>
      </PanelCard>
      <PanelCard title="Aktivitas bulan ini" description="Anggota baru per bulan, enam bulan terakhir.">
        <div className="mb-1.5 flex items-center justify-between">
          <div className="grid"><strong className="text-[27px] tracking-tight text-brand-ink">+{formatCount(stats.tiles.new_this_month)}</strong><span className="text-xs text-brand-muted">anggota baru</span></div>
          <Badge variant={pct >= 0 ? "success" : "destructive"}>{pct >= 0 ? "Naik" : "Turun"} {Math.abs(pct)}%</Badge>
        </div>
        <BarChart
          data={trend.labels.map((label, index) => ({ label, value: trend.new[index] }))}
          height={90}
          highlightLast
          ariaLabel="Anggota baru per bulan, enam bulan terakhir"
        />
        <p className="stat-footnote">Seri contoh — kontrak produksi: GET /v1/admin/stats/timeseries.</p>
      </PanelCard>
    </div>
    <PanelCard title="Pengajuan terbaru" description="Ringkasan pendaftaran yang masuk ke antrean." action={<Button variant="ghost" size="sm" onClick={() => go("review")}>Lihat semua <IconArrowRight size={16} /></Button>}>
      <div className="grid">
        {recent.map((r) => (
          <ListRow
            key={r.id}
            leading={<span aria-hidden className="grid size-9 place-items-center rounded-md bg-secondary text-xs font-extrabold text-brand-ink">{r.initials}</span>}
            title={r.name}
            subtitle={`${r.id} · ${r.unit}`}
            meta={r.received}
            badge={<Badge variant={r.tab === "dikirim_ulang" ? "warning" : "secondary"}>{r.tab === "dikirim_ulang" ? "Dikirim ulang" : "Baru"}</Badge>}
            trailing={<IconChevronRight aria-hidden className="size-[18px] text-brand-muted" />}
            onSelect={() => openReview(r.id)}
          />
        ))}
      </div>
    </PanelCard>
  </>;
}

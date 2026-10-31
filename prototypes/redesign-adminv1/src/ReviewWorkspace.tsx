import { useEffect, useMemo, useRef, useState } from "react";
import {
  IconAlertCircle, IconArrowRight, IconCheck, IconChevronDown, IconCircleCheck,
  IconClock, IconFileTypePdf, IconId, IconPhoto, IconShieldCheck,
} from "@tabler/icons-react";
import {
  AdminDrawer, Badge, Button, DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, Input, SearchFilter, Skeleton, Spinner, Table, TableBody, TableCell, Textarea,
  TableHead, TableHeader, TableRow,
} from "ppij-design-system";
import "./ReviewWorkspace.css";

type Scope = "national" | "korda" | "komsat";
type Tab = "baru" | "dikirim_ulang" | "diperiksa" | "menunggu_anggota" | "selesai";
type Kind = "Pendaftaran" | "Perpanjangan" | "Perubahan" | "Permintaan komsat";
type Action = "approve" | "requestChanges" | "reject" | "forward" | "assignKomsat";
type Field = { label: string; value: string };
type Group = { title: string; fields: Field[] };
type Review = {
  id: string; name: string; initials: string; unit: string; kind: Kind; received: string;
  tab: Tab; round: number; daysWaiting: number; binding: string; flags: string[];
  owner?: string; groups: Group[]; history: { date: string; title: string; detail: string }[];
  front: "image" | "pdf"; back: "image" | "pdf";
};

const tabs: { id: Tab; label: string }[] = [
  { id: "baru", label: "Baru" },
  { id: "dikirim_ulang", label: "Dikirim ulang" },
  { id: "diperiksa", label: "Sedang diperiksa" },
  { id: "menunggu_anggota", label: "Menunggu anggota" },
  { id: "selesai", label: "Selesai" },
];
const kinds: Kind[] = ["Pendaftaran", "Perpanjangan", "Perubahan", "Permintaan komsat"];
const units = ["Tokyo", "Yokohama", "Chiba", "Saitama", "Osaka", "Kyoto", "Nagoya", "Fukuoka"];
const fieldGroups = (name: string, unit: string): Group[] => [
  { title: "Data diri", fields: [
    { label: "Nama lengkap", value: name }, { label: "Jenis kelamin", value: "Perempuan" },
    { label: "Tanggal lahir", value: "17 Agustus 1999" }, { label: "Provinsi asal", value: "Jawa Barat" },
    { label: "Email akun", value: "anggota-contoh@example.invalid" }, { label: "Nomor telepon", value: "Disembunyikan di pratinjau" },
    { label: "Nama panggilan", value: "Rani" }, { label: "LINE ID", value: "—" },
    { label: "Minat", value: "Pendidikan, kegiatan budaya" },
  ] },
  { title: "Domisili di Jepang", fields: [
    { label: "Prefektur", value: unit === "Osaka" ? "Osaka" : unit === "Nagoya" ? "Aichi" : "Tokyo" },
    { label: "Kota/kecamatan", value: unit === "Tokyo" ? "Shinjuku" : unit },
    { label: "Tinggal sejak", value: "April 2025" }, { label: "Tinggal sampai", value: "Maret 2027" },
  ] },
  { title: "Pendidikan", fields: [
    { label: "Institusi", value: "Universitas Contoh Jepang" }, { label: "Fakultas", value: "Pascasarjana" },
    { label: "Jenjang", value: name === "Contoh Anggota D" ? "Doktor (S3)" : "Magister (S2)" }, { label: "Jurusan", value: "Ilmu Komputer" },
    { label: "Bulan masuk", value: "April 2025" }, { label: "Perkiraan lulus", value: "Maret 2027" },
    { label: "Lab atau pembimbing", value: "Lab Sistem Informasi" }, { label: "Nomor pelajar", value: "STU-CONTOH-01" },
    { label: "Meminta komsat lain", value: "Tidak" },
  ] },
  { title: "Pendanaan", fields: [{ label: "Sumber dana", value: "Beasiswa" }] },
  { title: "Izin tinggal & kontak darurat", fields: [
    { label: "Status izin tinggal", value: "Pelajar" }, { label: "Berlaku sampai", value: "30 Juni 2027" },
    { label: "Kontak darurat", value: "Kontak Contoh" }, { label: "Hubungan", value: "Orang tua" },
    { label: "Telepon & alamat", value: "Disembunyikan di pratinjau" },
    { label: "Persetujuan", value: "Sudah diberikan" },
  ] },
];

export const reviewSamples: Review[] = [
  { id: "REG-2408", name: "Contoh Anggota A", initials: "AA", unit: "Tokyo", kind: "Pendaftaran", received: "Hari ini, 09.42", tab: "baru", round: 1, daysWaiting: 0, binding: "Institusi", flags: [], groups: fieldGroups("Contoh Anggota A", "Tokyo"), history: [], front: "image", back: "pdf" },
  { id: "REG-2407", name: "Contoh Anggota B", initials: "AB", unit: "Yokohama", kind: "Perpanjangan", received: "Hari ini, 08.16", tab: "baru", round: 1, daysWaiting: 0, binding: "Kota/kecamatan", flags: ["Kemungkinan duplikat"], groups: fieldGroups("Contoh Anggota B", "Yokohama"), history: [], front: "pdf", back: "image" },
  { id: "REG-2406", name: "Contoh Anggota C", initials: "AC", unit: "Osaka", kind: "Perubahan", received: "Kemarin, 17.30", tab: "dikirim_ulang", round: 2, daysWaiting: 1, binding: "Institusi", flags: [], groups: fieldGroups("Contoh Anggota C", "Osaka"), history: [
    { date: "28 Okt 2026 · 10.15", title: "Putaran 1 · Minta perbaikan", detail: "Kartu pelajar · Foto sisi depan kurang jelas." },
    { date: "30 Okt 2026 · 17.30", title: "Putaran 2 · Dikirim ulang", detail: "Anggota mengunggah ulang dokumen dan memberi tanggapan." },
  ], front: "image", back: "image" },
  { id: "REG-2405", name: "Contoh Anggota D", initials: "AD", unit: "Nagoya", kind: "Permintaan komsat", received: "23 Okt, 13.10", tab: "diperiksa", round: 1, daysWaiting: 8, binding: "Permintaan anggota", flags: ["Komsat lain"], owner: "Contoh Pengurus B", groups: fieldGroups("Contoh Anggota D", "Nagoya"), history: [
    { date: "23 Okt 2026 · 13.10", title: "Pengajuan diterima", detail: "Permintaan perubahan komsat masuk ke antrean." },
    { date: "24 Okt 2026 · 09.20", title: "Pemeriksaan dimulai", detail: "Pengajuan sedang dipegang Contoh Pengurus B." },
  ], front: "image", back: "pdf" },
  { id: "REG-2404", name: "Contoh Anggota E", initials: "AE", unit: "Tokyo", kind: "Pendaftaran", received: "21 Okt, 14.22", tab: "menunggu_anggota", round: 1, daysWaiting: 10, binding: "Institusi", flags: ["Lebih dari 7 hari"], groups: fieldGroups("Contoh Anggota E", "Tokyo"), history: [
    { date: "21 Okt 2026 · 14.22", title: "Pengajuan diterima", detail: "Pendaftaran anggota masuk ke antrean Tokyo." },
    { date: "21 Okt 2026 · 16.05", title: "Pemeriksaan dimulai", detail: "Data diri dan dokumen pendukung mulai ditinjau." },
    { date: "22 Okt 2026 · 09.10", title: "Putaran 1 · Minta perbaikan", detail: "Data pendidikan · Mohon periksa bulan perkiraan lulus." },
    { date: "22 Okt 2026 · 09.11", title: "Menunggu anggota", detail: "Perbaikan telah dikirim kepada anggota." },
  ], front: "pdf", back: "image" },
  { id: "REG-2403", name: "Contoh Anggota F", initials: "AF", unit: "Tokyo", kind: "Pendaftaran", received: "19 Okt, 11.03", tab: "selesai", round: 1, daysWaiting: 12, binding: "Institusi", flags: [], groups: fieldGroups("Contoh Anggota F", "Tokyo"), history: [
    { date: "19 Okt 2026 · 11.03", title: "Pengajuan diterima", detail: "Pendaftaran anggota masuk ke antrean Tokyo." },
    { date: "19 Okt 2026 · 13.40", title: "Pemeriksaan dimulai", detail: "Data diri dan pendidikan mulai ditinjau." },
    { date: "20 Okt 2026 · 10.15", title: "Kartu pelajar diperiksa", detail: "Sisi depan dan belakang kartu pelajar dapat dibaca dengan jelas." },
    { date: "20 Okt 2026 · 11.05", title: "Data pendidikan cocok", detail: "Institusi dan perkiraan lulus sesuai dengan dokumen yang dikirim." },
    { date: "20 Okt 2026 · 11.30", title: "Putaran 1 · Disetujui", detail: "Pengajuan selesai diperiksa. Data pendidikan dan masa berlaku kartu pelajar telah dicocokkan dengan informasi yang dikirim anggota. Tidak ada perbaikan tambahan yang diperlukan pada putaran ini." },
  ], front: "image", back: "image" },
];

const actionLabels: Record<Action, string> = {
  approve: "Setujui", requestChanges: "Minta perbaikan", reject: "Tolak",
  forward: "Teruskan", assignKomsat: "Tetapkan komsat",
};
const feedbackTargets = ["Nama lengkap", "Tanggal lahir", "Provinsi asal", "Prefektur", "Kota/kecamatan", "Institusi", "Jenjang", "Jurusan", "Perkiraan lulus", "Kartu pelajar"];
const feedbackReasons = ["Data tidak sesuai", "Informasi belum lengkap", "Dokumen kurang jelas", "Dokumen tidak berlaku", "Perlu konfirmasi"];

export function ReviewWorkspace({ scope, initialSelectedId, onNotice }: { scope: Scope; initialSelectedId: string | null; onNotice: (message: string, tone?: "success" | "error") => void }) {
  const [items, setItems] = useState(reviewSamples);
  const [tab, setTab] = useState<Tab>("baru");
  const [search, setSearch] = useState("");
  const [kind, setKind] = useState<Kind | "">("");
  const [unit, setUnit] = useState<string[]>([]);
  const [ownership, setOwnership] = useState("");
  const [older, setOlder] = useState(false);
  const [flags, setFlags] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(initialSelectedId);
  const [action, setAction] = useState<Action | null>(null);
  const [approveStep, setApproveStep] = useState<1 | 2>(1);
  const [takenOver, setTakenOver] = useState<string[]>([]);
  const [documentSide, setDocumentSide] = useState<"front" | "back">("front");
  const [historyExpanded, setHistoryExpanded] = useState(false);
  const [feedback, setFeedback] = useState([{ target: "Kartu pelajar", reason: "", note: "" }]);
  const [reason, setReason] = useState("");
  const [targetKomsat, setTargetKomsat] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [queueLoading, setQueueLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(Boolean(initialSelectedId));
  const [saving, setSaving] = useState(false);
  const [simulateFailure, setSimulateFailure] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setQueueLoading(true);
    const timer = window.setTimeout(() => setQueueLoading(false), 520);
    return () => window.clearTimeout(timer);
  }, [tab, search, kind, unit, ownership, older, flags, scope]);

  useEffect(() => {
    if (!selectedId) return;
    setDetailLoading(true);
    const timer = window.setTimeout(() => setDetailLoading(false), 560);
    return () => window.clearTimeout(timer);
  }, [selectedId]);

  useEffect(() => () => { if (saveTimer.current) window.clearTimeout(saveTimer.current); }, []);

  const filtered = useMemo(() => items.filter((item) => {
    const query = search.trim().toLocaleLowerCase("id");
    return inScope(item, scope) && (!query || [item.name, item.id, item.unit, item.kind, ...item.flags].some((value) => value.toLocaleLowerCase("id").includes(query))) && (!kind || item.kind === kind) && (unit.length === 0 || unit.includes(item.unit)) && (!ownership || (ownership === "claimed" ? Boolean(item.owner) : !item.owner)) && (!older || item.daysWaiting > 7) && (!flags || item.flags.length > 0);
  }), [items, scope, search, kind, unit, ownership, older, flags]);
  const counts = useMemo(() => Object.fromEntries(tabs.map(({ id }) => [id, filtered.filter((item) => item.tab === id).length])) as Record<Tab, number>, [filtered]);
  const visible = useMemo(() => filtered.filter((item) => item.tab === tab), [filtered, tab]);
  const scopedCount = items.filter((item) => inScope(item, scope)).length;
  const selected = items.find((item) => item.id === selectedId && inScope(item, scope)) ?? null;
  const readOnly = Boolean(selected?.owner && !takenOver.includes(selected.id));
  const actionsHidden = selected?.tab === "menunggu_anggota" || selected?.tab === "selesai";

  useEffect(() => {
    if (selectedId && !selected) {
      close();
      onNotice("Pengajuan ditutup karena berada di luar ruang kerja yang dipilih.");
    }
  }, [scope, selectedId, selected]);

  function select(item: Review) {
    setSelectedId(item.id); setDetailLoading(true); setAction(null); setDocumentSide("front"); setHistoryExpanded(false); setError("");
  }
  function close() { if (saveTimer.current) window.clearTimeout(saveTimer.current); saveTimer.current = null; setSaving(false); setSelectedId(null); setAction(null); setError(""); }
  function openAction(next: Action) {
    setAction(next); setApproveStep(1); setError("");
    setFeedback([{ target: "Kartu pelajar", reason: "", note: "" }]); setReason(""); setTargetKomsat(""); setNote(""); setSimulateFailure(false);
  }
  function commitAction() {
    if (!selected || !action) return;
    if (action === "requestChanges" && feedback.some((item) => !item.target)) { setError("Pilih bagian yang perlu diperbaiki."); return; }
    if (action === "requestChanges" && feedback.some((item) => !item.reason)) { setError("Pilih alasan untuk setiap bagian yang perlu diperbaiki."); return; }
    if (action === "reject" && !reason.trim()) { setError("Isi alasan penolakan."); return; }
    if ((action === "forward" || action === "assignKomsat") && !targetKomsat) { setError("Pilih komsat tujuan."); return; }
    if (action === "assignKomsat" && !note.trim()) { setError("Isi alasan penetapan komsat."); return; }
    setError(""); setSaving(true);
    saveTimer.current = window.setTimeout(() => {
      saveTimer.current = null; setSaving(false);
      if (simulateFailure) { onNotice("Gagal menyimpan keputusan contoh. Coba lagi.", "error"); return; }
      applyAction(selected, action);
    }, 850);
  }
  function applyAction(selected: Review, action: Action) {
    const nextTab: Tab = action === "approve" || action === "reject" ? "selesai" : action === "requestChanges" ? "menunggu_anggota" : "diperiksa";
    const detail = action === "requestChanges" ? feedback.map((item) => `${item.target} · ${item.reason}${item.note ? ` — ${item.note}` : ""}`).join("; ") : action === "reject" ? reason : action === "forward" || action === "assignKomsat" ? `${targetKomsat}${note ? ` · ${note}` : ""}` : "Pengajuan disetujui.";
    setItems((current) => current.map((item) => item.id === selected.id ? { ...item, tab: nextTab, owner: undefined, history: [...item.history, { date: "31 Okt 2026 · baru saja", title: `Putaran ${item.round} · ${actionLabels[action]}`, detail }] } : item));
    setTab(nextTab); close(); onNotice(`${actionLabels[action]} disimulasikan. Data contoh telah berpindah ke tab ${tabs.find((entry) => entry.id === nextTab)?.label}.`, "success");
  }
  function release() {
    if (!selected) return;
    setItems((current) => current.map((item) => item.id === selected.id ? { ...item, owner: undefined, tab: "baru" as Tab, history: [...item.history, { date: "31 Okt 2026 · baru saja", title: "Pemeriksaan dilepas", detail: "Pengajuan kembali tersedia di antrean." }] } : item));
    setTab("baru"); close(); onNotice("Pemeriksaan dilepas. Pengajuan kembali ke tab Baru.");
  }

  const footer = selected && !detailLoading && !action && !readOnly && !actionsHidden ? <div className="verification-actions">
    <Button onClick={() => openAction("approve")}>Setujui</Button>
    <Button variant="outline" onClick={() => openAction("requestChanges")}>Minta perbaikan</Button>
    <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline">Lainnya <IconChevronDown size={16} /></Button></DropdownMenuTrigger><DropdownMenuContent align="end" side="top" className="verification-action-menu">{(["reject", "forward", "assignKomsat"] as Action[]).map((entry) => <DropdownMenuItem key={entry} onSelect={() => openAction(entry)}>{actionLabels[entry]}</DropdownMenuItem>)}<DropdownMenuItem onSelect={release}>Lepas pemeriksaan</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
  </div> : action ? <div className="verification-action-footer">
    <Button variant="outline" disabled={saving} onClick={() => { if (action === "approve" && approveStep === 2) setApproveStep(1); else setAction(null); setError(""); }}>Kembali</Button>
    <Button disabled={saving} aria-busy={saving} onClick={() => { if (action === "approve" && approveStep === 1) setApproveStep(2); else commitAction(); }}>{saving ? <><Spinner decorative size="xs" /> Menyimpan…</> : action === "approve" && approveStep === 1 ? "Lanjut" : `Konfirmasi ${actionLabels[action].toLowerCase()}`}</Button>
  </div> : null;

  return <section className="verification-workspace" aria-label="Antrean verifikasi">
    <div className="verification-intro"><span>{filtered.length === scopedCount ? `${scopedCount} pengajuan contoh` : `${filtered.length} dari ${scopedCount} pengajuan contoh`}</span></div>
    <div className="verification-tabs" role="tablist" aria-label="Tab antrean">{tabs.map((entry) => <button key={entry.id} role="tab" aria-selected={tab === entry.id} className={tab === entry.id ? "active" : ""} onClick={() => setTab(entry.id)}>{entry.label}<span>{counts[entry.id]}</span></button>)}</div>
    <SearchFilter className="verification-filters" searchValue={search} onSearchChange={setSearch} searchPlaceholder="Cari nama atau ID pengajuan" filters={<FilterMenu label="Jenis" hideLabel value={kind} allLabel="Semua jenis" options={kinds.map((value) => ({ value, label: value }))} onChange={(value) => setKind(value as Kind | "")} />} advancedTitle="Filter verifikasi lanjutan" advancedActiveCount={unit.length + Number(Boolean(ownership)) + Number(older) + Number(flags)} advancedFilters={<>
      <SearchableUnitMenu label="Komsat" values={unit} options={units} multiple onChange={setUnit} />
      <FilterMenu label="Kepemilikan" value={ownership} allLabel="Semua pengajuan" options={[{ value: "unclaimed", label: "Belum diambil" }, { value: "claimed", label: "Sedang diperiksa" }]} onChange={setOwnership} />
      <label className="verification-check"><input type="checkbox" checked={older} onChange={(event) => setOlder(event.target.checked)} /> Lebih dari 7 hari</label>
      <label className="verification-check"><input type="checkbox" checked={flags} onChange={(event) => setFlags(event.target.checked)} /> Ada tanda</label>
    </>} activeFilters={[
      ...(kind ? [{ label: "Jenis", value: kind, onRemove: () => setKind("") }] : []),
      ...unit.map((value) => ({ label: "Komsat", value, onRemove: () => setUnit((current) => current.filter((entry) => entry !== value)) })),
      ...(ownership ? [{ label: "Kepemilikan", value: ownership === "claimed" ? "Sedang diperiksa" : "Belum diambil", onRemove: () => setOwnership("") }] : []),
      ...(older ? [{ label: "Umur", value: "Lebih dari 7 hari", onRemove: () => setOlder(false) }] : []),
      ...(flags ? [{ label: "Tanda", value: "Ada tanda", onRemove: () => setFlags(false) }] : []),
    ]} onClearAll={() => { setKind(""); setUnit([]); setOwnership(""); setOlder(false); setFlags(false); }} />
    {queueLoading && <p className="verification-loading-caption" role="status"><Spinner decorative size="xs" /> Memuat pengajuan…</p>}
    <div className="verification-table" aria-busy={queueLoading}><Table><TableHeader><TableRow><TableHead>Pengajuan</TableHead><TableHead>Jenis</TableHead><TableHead>Komsat</TableHead><TableHead>Putaran</TableHead><TableHead>Diterima</TableHead><TableHead>Tanda</TableHead><TableHead><span className="sr-only">Aksi</span></TableHead></TableRow></TableHeader><TableBody>{queueLoading ? Array.from({ length: 3 }, (_, index) => <TableRow key={index}>{Array.from({ length: 7 }, (_, cell) => <TableCell key={cell}><Skeleton className={cell === 0 ? "h-9 w-36" : "h-4 w-20"} /></TableCell>)}</TableRow>) : visible.map((item) => <TableRow key={item.id}><TableCell><strong className="verification-name">{item.name}</strong><small className="verification-id">{item.id}</small></TableCell><TableCell>{item.kind}</TableCell><TableCell>{item.unit}</TableCell><TableCell>{item.round}</TableCell><TableCell>{item.received}</TableCell><TableCell>{item.flags.length ? <Badge variant="warning">{item.flags[0]}</Badge> : <span className="verification-muted">—</span>}</TableCell><TableCell><Button variant="ghost" size="sm" onClick={() => select(item)}>Tinjau <IconArrowRight size={15} /></Button></TableCell></TableRow>)}</TableBody></Table></div>
    <div className="verification-mobile-list" aria-busy={queueLoading}>{queueLoading ? Array.from({ length: 3 }, (_, index) => <div className="verification-mobile-skeleton" key={index}><Skeleton className="h-4 w-36" /><Skeleton className="h-3 w-52" /><Skeleton className="h-3 w-24" /></div>) : visible.map((item) => <button key={item.id} onClick={() => select(item)}><span><strong>{item.name}</strong><small>{item.id} · {item.unit} · Putaran {item.round}</small></span><span>{item.received}<IconArrowRight size={17} /></span><small>{item.kind}{item.flags.length ? ` · ${item.flags[0]}` : ""}</small></button>)}</div>
    {!queueLoading && visible.length === 0 && <div className="verification-empty"><IconCircleCheck size={27} /><strong>Belum ada pengajuan di tab ini</strong><span>{filtered.length > 0 ? "Hasil ada di tab lain. Pilih tab yang memiliki angka." : "Coba kata kunci atau filter lain."}</span></div>}
    <AdminDrawer open={selected !== null} onOpenChange={(open) => { if (!open) close(); }} title={action ? actionLabels[action] : selected?.name ?? "Pengajuan"} description={selected ? `${selected.id} · ${selected.kind} · Putaran ${selected.round}` : undefined} locale="id" className="verification-review-drawer" footer={footer}>
      {selected && (detailLoading ? <div className="verification-detail-loading" role="status"><span><Spinner decorative size="sm" /> Memuat detail pengajuan…</span><Skeleton className="h-16 w-full" /><Skeleton className="h-5 w-40" /><div><Skeleton className="h-4 w-44" /><Skeleton className="h-4 w-32" /><Skeleton className="h-4 w-48" /></div></div> : action ? <div className="verification-action-screen">
        {action === "approve" ? <><h3>{approveStep === 1 ? "Periksa keputusan" : "Setujui pengajuan ini?"}</h3><p>{selected.name} · {selected.unit} · {selected.kind}</p><p>{approveStep === 1 ? "Pastikan data dan kartu pelajar telah diperiksa sebelum melanjutkan." : "Anggota akan aktif dan menerima nomor anggota. Tindakan ini tidak dapat dibatalkan pada aplikasi terintegrasi."}</p></> : null}
        {action === "requestChanges" ? <><h3>Bagian yang perlu diperbaiki</h3><p>Pilih bagian dan alasan spesifik agar anggota tahu yang perlu diubah.</p>{feedback.map((entry, index) => <div className="verification-feedback-item" key={index}>
          <FilterMenu label="Bagian" value={entry.target} allLabel="Pilih bagian" options={feedbackTargets.map((value) => ({ value, label: value }))} onChange={(value) => setFeedback((current) => current.map((item, i) => i === index ? { ...item, target: value } : item))} />
          <FilterMenu label="Alasan" value={entry.reason} allLabel="Pilih alasan" options={feedbackReasons.map((value) => ({ value, label: value }))} onChange={(value) => setFeedback((current) => current.map((item, i) => i === index ? { ...item, reason: value } : item))} />
          <label>Catatan (opsional)<Textarea rows={4} value={entry.note} onChange={(event) => setFeedback((current) => current.map((value, i) => i === index ? { ...value, note: event.target.value } : value))} placeholder="Jelaskan bagian yang perlu diperbaiki" /></label>
          {feedback.length > 1 && <Button size="sm" variant="ghost" onClick={() => setFeedback((current) => current.filter((_, i) => i !== index))}>Hapus bagian</Button>}
        </div>)}<Button variant="outline" size="sm" onClick={() => setFeedback((current) => [...current, { target: "Kartu pelajar", reason: "", note: "" }])}>Tambah bagian</Button></> : null}
        {action === "reject" ? <><h3>Alasan penolakan</h3><p>Berikan alasan yang jelas untuk dicatat pada pengajuan.</p><label>Alasan<textarea value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Tulis alasan penolakan" /></label></> : null}
        {(action === "forward" || action === "assignKomsat") ? <><h3>{action === "forward" ? "Teruskan ke komsat" : "Tetapkan komsat"}</h3><p>{action === "forward" ? "Kirim pengajuan kepada pemeriksa di komsat tujuan." : "Pindahkan penetapan komsat beserta alasan peninjauannya."}</p><SearchableUnitMenu label="Komsat tujuan" values={targetKomsat ? [targetKomsat] : []} options={units.filter((value) => value !== selected.unit)} onChange={(values) => setTargetKomsat(values[0] ?? "")} /><label>{action === "forward" ? "Catatan (opsional)" : "Alasan penetapan"}<textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder={action === "forward" ? "Catatan untuk pemeriksa" : "Tulis alasan penetapan"} /></label></> : null}
        {error && <p className="verification-error" role="alert"><IconAlertCircle size={17} />{error}</p>}
        <label className="verification-failure-toggle"><input type="checkbox" checked={simulateFailure} disabled={saving} onChange={(event) => setSimulateFailure(event.target.checked)} /> Simulasikan gagal menyimpan</label>
        <p className="verification-demo-note">Pratinjau desain: konfirmasi hanya mengubah data contoh di halaman ini.</p>
      </div> : <div className="verification-detail">
        <div className="verification-sample-note"><IconShieldCheck size={18} /> Data sintetis untuk meninjau alur admin</div>
        <div className="verification-summary"><div><strong>{selected.unit} · {selected.kind}</strong><small>Aturan penetapan: {selected.binding} · {selected.daysWaiting} hari menunggu</small></div><Badge variant={selected.tab === "selesai" ? "success" : selected.tab === "menunggu_anggota" ? "warning" : "secondary"}>{tabs.find((entry) => entry.id === selected.tab)?.label}</Badge></div>
        {selected.flags.length > 0 && <div className="verification-flag"><IconAlertCircle size={18} /> {selected.flags.join(" · ")}</div>}
        {selected.owner && readOnly && <div className="verification-claim"><p>Sedang diperiksa oleh {selected.owner}. Keputusan hanya bisa dibuat setelah mengambil alih pemeriksaan.</p><Button size="sm" variant="outline" onClick={() => setTakenOver((current) => [...current, selected.id])}>Ambil alih pemeriksaan</Button></div>}
        {selected.owner && !readOnly && <div className="verification-claim"><IconCircleCheck size={18} /> Pemeriksaan diambil alih untuk pratinjau ini.</div>}
        {selected.kind === "Permintaan komsat" && <div className="verification-claim"><strong>Permintaan ganti komsat</strong><p>Anggota meminta komsat lain karena domisili dan kampus berada di wilayah berbeda.</p></div>}
        <section className="verification-section"><h3>Data pendaftaran</h3><p>Diurutkan seperti langkah registrasi anggota.</p>{selected.groups.map((group) => <div className="verification-field-group" key={group.title}><h4>{group.title}</h4><dl>{group.fields.map((field) => <div key={field.label}><dt>{field.label}</dt><dd>{field.value}</dd></div>)}</dl></div>)}</section>
        <section className="verification-section"><h3>Kartu pelajar</h3><p>Dokumen yang dikumpulkan pada registrasi. Pratinjau ini memakai berkas contoh.</p><div className="verification-doc-tabs" role="group" aria-label="Sisi kartu pelajar"><button className={documentSide === "front" ? "active" : ""} aria-pressed={documentSide === "front"} onClick={() => setDocumentSide("front")}>Sisi depan</button><button className={documentSide === "back" ? "active" : ""} aria-pressed={documentSide === "back"} onClick={() => setDocumentSide("back")}>Sisi belakang</button></div><div className="verification-document-island"><div className="verification-file-row">{(documentSide === "front" ? selected.front : selected.back) === "pdf" ? <IconFileTypePdf size={22} /> : <IconPhoto size={22} />}<div><strong>Kartu pelajar · {documentSide === "front" ? "sisi depan" : "sisi belakang"}</strong><span>Berkas contoh · {(documentSide === "front" ? selected.front : selected.back) === "pdf" ? "PDF" : "JPG"}</span></div></div><div className="verification-document-stage"><div className="verification-document-paper"><span>PRATINJAU BERKAS CONTOH</span>{(documentSide === "front" ? selected.front : selected.back) === "pdf" ? <IconFileTypePdf size={45} stroke={1.4} /> : <IconId size={45} stroke={1.4} />}<strong>KARTU PELAJAR</strong><i /><i /><small>Tanpa data pribadi</small></div></div><dl className="verification-document-facts"><div><dt>Nama</dt><dd>{selected.name}</dd></div><div><dt>Jenjang</dt><dd>{fieldValue(selected, "Jenjang")}</dd></div><div><dt>Institusi / Fakultas</dt><dd>{fieldValue(selected, "Institusi")} / {fieldValue(selected, "Fakultas")}</dd></div><div><dt>Tinggal dari / sampai</dt><dd>{monthYear(fieldValue(selected, "Tinggal sejak"))} sampai {monthYear(fieldValue(selected, "Tinggal sampai"))}</dd></div></dl></div></section>
        <section className="verification-section"><h3>Riwayat pemeriksaan</h3>{selected.history.length ? <><ol className="verification-history">{[...selected.history].reverse().slice(0, historyExpanded ? undefined : 3).map((entry, index) => <li key={`${selected.id}-${entry.date}-${index}`}><time>{entry.date}</time><strong>{entry.title}</strong><HistoryDetail detail={entry.detail} /></li>)}</ol>{selected.history.length > 3 && <button type="button" className="verification-history-more" aria-expanded={historyExpanded} onClick={() => setHistoryExpanded((value) => !value)}>{historyExpanded ? "Tampilkan 3 terbaru" : `Lihat selengkapnya (${selected.history.length - 3} peristiwa)`}</button>}</> : <p>Belum ada keputusan atau umpan balik pada putaran ini.</p>}</section>
        {actionsHidden && <div className={selected.tab === "menunggu_anggota" ? "verification-readonly is-waiting" : "verification-readonly"}>{selected.tab === "menunggu_anggota" ? <IconClock size={18} /> : <IconCircleCheck size={18} />}{selected.tab === "selesai" ? "Pengajuan ini sudah selesai. Keputusan tidak tersedia." : "Menunggu perbaikan dari anggota. Keputusan tersedia setelah pengiriman ulang."}</div>}
      </div>)}
    </AdminDrawer>
  </section>;
}

function inScope(item: Review, scope: Scope) { return scope === "national" || (scope === "korda" ? ["Tokyo", "Yokohama"].includes(item.unit) : item.unit === "Tokyo"); }

function fieldValue(item: Review, label: string) { return item.groups.flatMap((group) => group.fields).find((field) => field.label === label)?.value ?? "—"; }

function monthYear(value: string) {
  const months: Record<string, string> = { Januari: "01", Februari: "02", Maret: "03", April: "04", Mei: "05", Juni: "06", Juli: "07", Agustus: "08", September: "09", Oktober: "10", November: "11", Desember: "12" };
  const [month, year] = value.split(" ");
  return months[month] && year ? `${months[month]}/${year}` : value;
}

function HistoryDetail({ detail }: { detail: string }) {
  const [expanded, setExpanded] = useState(false);
  const canExpand = detail.length > 70;
  return <><span className={expanded ? "verification-history-detail" : "verification-history-detail is-clamped"}>{detail}</span>{canExpand && <button className="verification-history-toggle" type="button" aria-expanded={expanded} onClick={() => setExpanded((value) => !value)}>{expanded ? "Tampilkan lebih sedikit" : "Lihat selengkapnya"}</button>}</>;
}

function SearchableUnitMenu({ label, values, options, onChange, multiple = false }: { label: string; values: string[]; options: string[]; onChange: (values: string[]) => void; multiple?: boolean }) {
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const matches = options.filter((option) => option.toLocaleLowerCase("id").includes(query.trim().toLocaleLowerCase("id")));
  const selectedLabel = values.length === 0 ? multiple ? "Semua komsat" : "Pilih komsat" : values.length === 1 ? values[0] : `${values.length} komsat dipilih`;
  return <div className="verification-filter-control">
    <span>{label}</span>
    <DropdownMenu onOpenChange={(open) => { if (open) window.requestAnimationFrame(() => searchRef.current?.focus()); else setQuery(""); }}>
      <DropdownMenuTrigger asChild><Button type="button" variant="outline" className="verification-filter-trigger" aria-label={`${label}: ${selectedLabel}`}>{selectedLabel}<IconChevronDown size={16} /></Button></DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="verification-filter-content verification-unit-menu">
        <div className="verification-unit-search"><Input ref={searchRef} value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (!["Escape", "Tab", "ArrowDown"].includes(event.key)) event.stopPropagation(); }} placeholder="Cari komsat" aria-label="Cari komsat" /></div>
        {multiple && <DropdownMenuItem onSelect={(event) => { event.preventDefault(); onChange([]); }}>Semua komsat</DropdownMenuItem>}
        {matches.length ? matches.map((option) => <DropdownMenuCheckboxItem key={option} checked={values.includes(option)} onCheckedChange={(checked) => onChange(multiple ? checked ? [...values, option] : values.filter((value) => value !== option) : checked ? [option] : [])} onSelect={(event) => { if (multiple) event.preventDefault(); }}>{option}</DropdownMenuCheckboxItem>) : <p className="verification-unit-empty">Komsat tidak ditemukan.</p>}
      </DropdownMenuContent>
    </DropdownMenu>
  </div>;
}

function FilterMenu({ label, value, allLabel, options, onChange, hideLabel = false }: { label: string; value: string; allLabel: string; options: { value: string; label: string }[]; onChange: (value: string) => void; hideLabel?: boolean }) {
  const selectedLabel = options.find((option) => option.value === value)?.label ?? allLabel;
  return <div className="verification-filter-control">{!hideLabel && <span>{label}</span>}<DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" className="verification-filter-trigger" aria-label={`${label}: ${selectedLabel}`}>{selectedLabel}<IconChevronDown size={16} /></Button></DropdownMenuTrigger><DropdownMenuContent align="start" className="verification-filter-content"><DropdownMenuItem onSelect={() => onChange("")}><IconCheck size={16} className={value ? "verification-menu-check-hidden" : ""} />{allLabel}</DropdownMenuItem>{options.map((option) => <DropdownMenuItem key={option.value} onSelect={() => onChange(option.value)}><IconCheck size={16} className={value === option.value ? "" : "verification-menu-check-hidden"} />{option.label}</DropdownMenuItem>)}</DropdownMenuContent></DropdownMenu></div>;
}

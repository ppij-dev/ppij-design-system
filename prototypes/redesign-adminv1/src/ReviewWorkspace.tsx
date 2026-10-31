import { useMemo, useState } from "react";
import {
  IconAlertCircle, IconArrowRight, IconChevronDown, IconCircleCheck,
  IconFileTypePdf, IconId, IconPhoto, IconShieldCheck,
} from "@tabler/icons-react";
import { AdminDrawer, Badge, Button, Input, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "ppij-design-system";
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
  owner?: string; groups: Group[]; history: { title: string; detail: string }[];
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
const units = ["Tokyo", "Yokohama", "Osaka", "Nagoya"];
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
  ] },
  { title: "Pendidikan", fields: [
    { label: "Institusi", value: "Universitas Contoh Jepang" }, { label: "Fakultas", value: "Pascasarjana" },
    { label: "Jenjang", value: "Magister (S2)" }, { label: "Jurusan", value: "Ilmu Komputer" },
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
    { title: "Putaran 1 · Minta perbaikan", detail: "Kartu pelajar · Foto sisi depan kurang jelas." },
    { title: "Putaran 2 · Dikirim ulang", detail: "Anggota mengunggah ulang dokumen dan memberi tanggapan." },
  ], front: "image", back: "image" },
  { id: "REG-2405", name: "Contoh Anggota D", initials: "AD", unit: "Nagoya", kind: "Permintaan komsat", received: "23 Okt, 13.10", tab: "diperiksa", round: 1, daysWaiting: 8, binding: "Permintaan anggota", flags: ["Komsat lain"], owner: "Contoh Pengurus B", groups: fieldGroups("Contoh Anggota D", "Nagoya"), history: [
    { title: "Pemeriksaan dimulai", detail: "Pengajuan sedang dipegang Contoh Pengurus B." },
  ], front: "image", back: "pdf" },
  { id: "REG-2404", name: "Contoh Anggota E", initials: "AE", unit: "Tokyo", kind: "Pendaftaran", received: "21 Okt, 14.22", tab: "menunggu_anggota", round: 1, daysWaiting: 10, binding: "Institusi", flags: ["Lebih dari 7 hari"], groups: fieldGroups("Contoh Anggota E", "Tokyo"), history: [
    { title: "Putaran 1 · Minta perbaikan", detail: "Data pendidikan · Mohon periksa bulan perkiraan lulus." },
    { title: "Menunggu anggota", detail: "Perbaikan telah dikirim kepada anggota." },
  ], front: "pdf", back: "image" },
  { id: "REG-2403", name: "Contoh Anggota F", initials: "AF", unit: "Tokyo", kind: "Pendaftaran", received: "19 Okt, 11.03", tab: "selesai", round: 1, daysWaiting: 12, binding: "Institusi", flags: [], groups: fieldGroups("Contoh Anggota F", "Tokyo"), history: [
    { title: "Putaran 1 · Disetujui", detail: "Pengajuan selesai diperiksa." },
  ], front: "image", back: "image" },
];

const actionLabels: Record<Action, string> = {
  approve: "Setujui", requestChanges: "Minta perbaikan", reject: "Tolak",
  forward: "Teruskan", assignKomsat: "Tetapkan komsat",
};
const feedbackTargets = ["Nama lengkap", "Tanggal lahir", "Provinsi asal", "Prefektur", "Kota/kecamatan", "Institusi", "Jenjang", "Jurusan", "Perkiraan lulus", "Kartu pelajar"];
const feedbackReasons = ["Data tidak sesuai", "Informasi belum lengkap", "Dokumen kurang jelas", "Dokumen tidak berlaku", "Perlu konfirmasi"];

export function ReviewWorkspace({ scope, initialSelectedId, onNotice }: { scope: Scope; initialSelectedId: string | null; onNotice: (message: string) => void }) {
  const [items, setItems] = useState(reviewSamples);
  const [tab, setTab] = useState<Tab>("baru");
  const [kind, setKind] = useState<Kind | "">("");
  const [unit, setUnit] = useState("");
  const [older, setOlder] = useState(false);
  const [flags, setFlags] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(initialSelectedId);
  const [action, setAction] = useState<Action | null>(null);
  const [approveStep, setApproveStep] = useState<1 | 2>(1);
  const [moreOpen, setMoreOpen] = useState(false);
  const [takenOver, setTakenOver] = useState<string[]>([]);
  const [documentSide, setDocumentSide] = useState<"front" | "back">("front");
  const [ktpType, setKtpType] = useState<"pdf" | "image">("pdf");
  const [feedback, setFeedback] = useState([{ target: "Kartu pelajar", reason: "", note: "" }]);
  const [reason, setReason] = useState("");
  const [targetKomsat, setTargetKomsat] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const counts = useMemo(() => Object.fromEntries(tabs.map(({ id }) => [id, items.filter((item) => item.tab === id && inScope(item, scope)).length])) as Record<Tab, number>, [items, scope]);
  const visible = useMemo(() => items.filter((item) => inScope(item, scope) && item.tab === tab && (!kind || item.kind === kind) && (!unit || item.unit === unit) && (!older || item.daysWaiting > 7) && (!flags || item.flags.length > 0)), [items, scope, tab, kind, unit, older, flags]);
  const selected = items.find((item) => item.id === selectedId) ?? null;
  const readOnly = Boolean(selected?.owner && !takenOver.includes(selected.id));
  const actionsHidden = selected?.tab === "menunggu_anggota" || selected?.tab === "selesai";

  function select(item: Review) {
    setSelectedId(item.id); setAction(null); setDocumentSide("front"); setMoreOpen(false); setError("");
  }
  function close() { setSelectedId(null); setAction(null); setMoreOpen(false); setError(""); }
  function openAction(next: Action) {
    setAction(next); setApproveStep(1); setMoreOpen(false); setError("");
    setFeedback([{ target: "Kartu pelajar", reason: "", note: "" }]); setReason(""); setTargetKomsat(""); setNote("");
  }
  function commitAction() {
    if (!selected || !action) return;
    if (action === "requestChanges" && feedback.some((item) => !item.reason)) { setError("Pilih alasan untuk setiap bagian yang perlu diperbaiki."); return; }
    if (action === "reject" && !reason.trim()) { setError("Isi alasan penolakan."); return; }
    if ((action === "forward" || action === "assignKomsat") && !targetKomsat) { setError("Pilih komsat tujuan."); return; }
    if (action === "assignKomsat" && !note.trim()) { setError("Isi alasan penetapan komsat."); return; }
    const nextTab: Tab = action === "approve" || action === "reject" ? "selesai" : action === "requestChanges" ? "menunggu_anggota" : "diperiksa";
    const detail = action === "requestChanges" ? feedback.map((item) => `${item.target} · ${item.reason}${item.note ? ` — ${item.note}` : ""}`).join("; ") : action === "reject" ? reason : action === "forward" || action === "assignKomsat" ? `${targetKomsat}${note ? ` · ${note}` : ""}` : "Pengajuan disetujui.";
    setItems((current) => current.map((item) => item.id === selected.id ? { ...item, tab: nextTab, owner: undefined, history: [...item.history, { title: `Putaran ${item.round} · ${actionLabels[action]}`, detail }] } : item));
    setTab(nextTab); close(); onNotice(`${actionLabels[action]} disimulasikan. Data contoh telah berpindah ke tab ${tabs.find((entry) => entry.id === nextTab)?.label}.`);
  }
  function release() {
    if (!selected) return;
    setItems((current) => current.map((item) => item.id === selected.id ? { ...item, owner: undefined, tab: "baru" as Tab, history: [...item.history, { title: "Pemeriksaan dilepas", detail: "Pengajuan kembali tersedia di antrean." }] } : item));
    setTab("baru"); close(); onNotice("Pemeriksaan dilepas. Pengajuan kembali ke tab Baru.");
  }

  const footer = selected && !action && !readOnly && !actionsHidden ? <div className="verification-actions">
    <Button onClick={() => openAction("approve")}>Setujui</Button>
    <Button variant="outline" onClick={() => openAction("requestChanges")}>Minta perbaikan</Button>
    <div className="verification-more-wrap"><Button variant="outline" aria-expanded={moreOpen} onClick={() => setMoreOpen(!moreOpen)}>Lainnya <IconChevronDown size={16} /></Button>
      {moreOpen && <div className="verification-more-menu">{(["reject", "forward", "assignKomsat"] as Action[]).map((entry) => <button key={entry} onClick={() => openAction(entry)}>{actionLabels[entry]}</button>)}<button onClick={release}>Lepas pemeriksaan</button></div>}
    </div>
  </div> : action ? <div className="verification-action-footer">
    <Button variant="outline" onClick={() => { if (action === "approve" && approveStep === 2) setApproveStep(1); else setAction(null); setError(""); }}>Kembali</Button>
    <Button onClick={() => { if (action === "approve" && approveStep === 1) setApproveStep(2); else commitAction(); }}>{action === "approve" && approveStep === 1 ? "Lanjut" : `Konfirmasi ${actionLabels[action].toLowerCase()}`}</Button>
  </div> : null;

  return <section className="verification-workspace" aria-label="Antrean verifikasi">
    <div className="verification-intro"><span>{items.filter((item) => inScope(item, scope)).length} pengajuan contoh</span></div>
    <div className="verification-tabs" role="tablist" aria-label="Tab antrean">{tabs.map((entry) => <button key={entry.id} role="tab" aria-selected={tab === entry.id} className={tab === entry.id ? "active" : ""} onClick={() => setTab(entry.id)}>{entry.label}<span>{counts[entry.id]}</span></button>)}</div>
    <div className="verification-filters">
      <label>Jenis<select value={kind} onChange={(event) => setKind(event.target.value as Kind | "")}><option value="">Semua jenis</option>{kinds.map((value) => <option key={value}>{value}</option>)}</select></label>
      <label>Komsat<select value={unit} onChange={(event) => setUnit(event.target.value)}><option value="">Semua komsat</option>{units.map((value) => <option key={value}>{value}</option>)}</select></label>
      <label className="verification-check"><input type="checkbox" checked={older} onChange={(event) => setOlder(event.target.checked)} /> Lebih dari 7 hari</label>
      <label className="verification-check"><input type="checkbox" checked={flags} onChange={(event) => setFlags(event.target.checked)} /> Ada tanda</label>
    </div>
    <div className="verification-table"><Table><TableHeader><TableRow><TableHead>Pengajuan</TableHead><TableHead>Jenis</TableHead><TableHead>Komsat</TableHead><TableHead>Putaran</TableHead><TableHead>Diterima</TableHead><TableHead>Tanda</TableHead><TableHead><span className="sr-only">Aksi</span></TableHead></TableRow></TableHeader><TableBody>{visible.map((item) => <TableRow key={item.id}><TableCell><strong className="verification-name">{item.name}</strong><small className="verification-id">{item.id}</small></TableCell><TableCell>{item.kind}</TableCell><TableCell>{item.unit}</TableCell><TableCell>{item.round}</TableCell><TableCell>{item.received}</TableCell><TableCell>{item.flags.length ? <Badge variant="warning">{item.flags[0]}</Badge> : <span className="verification-muted">—</span>}</TableCell><TableCell><Button variant="ghost" size="sm" onClick={() => select(item)}>Tinjau <IconArrowRight size={15} /></Button></TableCell></TableRow>)}</TableBody></Table></div>
    <div className="verification-mobile-list">{visible.map((item) => <button key={item.id} onClick={() => select(item)}><span><strong>{item.name}</strong><small>{item.id} · {item.unit} · Putaran {item.round}</small></span><span>{item.received}<IconArrowRight size={17} /></span><small>{item.kind}{item.flags.length ? ` · ${item.flags[0]}` : ""}</small></button>)}</div>
    {visible.length === 0 && <div className="verification-empty"><IconCircleCheck size={27} /><strong>Belum ada pengajuan di tab ini</strong><span>Coba jenis, komsat, atau filter lain.</span></div>}
    <AdminDrawer open={selected !== null} onOpenChange={(open) => { if (!open) close(); }} title={action ? actionLabels[action] : selected?.name ?? "Pengajuan"} description={selected ? `${selected.id} · ${selected.kind} · Putaran ${selected.round}` : undefined} locale="id" className="verification-review-drawer" footer={footer}>
      {selected && (action ? <div className="verification-action-screen">
        {action === "approve" ? <><h3>{approveStep === 1 ? "Periksa keputusan" : "Setujui pengajuan ini?"}</h3><p>{selected.name} · {selected.unit} · {selected.kind}</p><p>{approveStep === 1 ? "Pastikan data dan kartu pelajar telah diperiksa sebelum melanjutkan." : "Anggota akan aktif dan menerima nomor anggota. Tindakan ini tidak dapat dibatalkan pada aplikasi terintegrasi."}</p></> : null}
        {action === "requestChanges" ? <><h3>Bagian yang perlu diperbaiki</h3><p>Pilih bagian dan alasan spesifik agar anggota tahu yang perlu diubah.</p>{feedback.map((entry, index) => <div className="verification-feedback-item" key={index}><label>Bagian<select value={entry.target} onChange={(event) => setFeedback((current) => current.map((value, i) => i === index ? { ...value, target: event.target.value } : value))}>{feedbackTargets.map((target) => <option key={target}>{target}</option>)}</select></label><label>Alasan<select value={entry.reason} onChange={(event) => setFeedback((current) => current.map((value, i) => i === index ? { ...value, reason: event.target.value } : value))}><option value="">Pilih alasan</option>{feedbackReasons.map((value) => <option key={value}>{value}</option>)}</select></label><label>Catatan (opsional)<Input value={entry.note} onChange={(event) => setFeedback((current) => current.map((value, i) => i === index ? { ...value, note: event.target.value } : value))} placeholder="Jelaskan bagian yang perlu diperbaiki" /></label>{feedback.length > 1 && <Button size="sm" variant="ghost" onClick={() => setFeedback((current) => current.filter((_, i) => i !== index))}>Hapus bagian</Button>}</div>)}<Button variant="outline" size="sm" onClick={() => setFeedback((current) => [...current, { target: "Kartu pelajar", reason: "", note: "" }])}>Tambah bagian</Button></> : null}
        {action === "reject" ? <><h3>Alasan penolakan</h3><p>Berikan alasan yang jelas untuk dicatat pada pengajuan.</p><label>Alasan<textarea value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Tulis alasan penolakan" /></label></> : null}
        {(action === "forward" || action === "assignKomsat") ? <><h3>{action === "forward" ? "Teruskan ke komsat" : "Tetapkan komsat"}</h3><p>{action === "forward" ? "Kirim pengajuan kepada pemeriksa di komsat tujuan." : "Pindahkan penetapan komsat beserta alasan peninjauannya."}</p><label>Komsat tujuan<select value={targetKomsat} onChange={(event) => setTargetKomsat(event.target.value)}><option value="">Pilih komsat</option>{units.filter((value) => value !== selected.unit).map((value) => <option key={value}>{value}</option>)}</select></label><label>{action === "forward" ? "Catatan (opsional)" : "Alasan penetapan"}<textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder={action === "forward" ? "Catatan untuk pemeriksa" : "Tulis alasan penetapan"} /></label></> : null}
        {error && <p className="verification-error" role="alert"><IconAlertCircle size={17} />{error}</p>}
        <p className="verification-demo-note">Pratinjau desain: konfirmasi hanya mengubah data contoh di halaman ini.</p>
      </div> : <div className="verification-detail">
        <div className="verification-sample-note"><IconShieldCheck size={18} /> Data sintetis untuk meninjau alur admin</div>
        <div className="verification-summary"><div><strong>{selected.unit} · {selected.kind}</strong><small>Aturan penetapan: {selected.binding} · {selected.daysWaiting} hari menunggu</small></div><Badge variant={selected.tab === "selesai" ? "success" : selected.tab === "menunggu_anggota" ? "warning" : "secondary"}>{tabs.find((entry) => entry.id === selected.tab)?.label}</Badge></div>
        {selected.flags.length > 0 && <div className="verification-flag"><IconAlertCircle size={18} /> {selected.flags.join(" · ")}</div>}
        {selected.owner && readOnly && <div className="verification-claim"><p>Sedang diperiksa oleh {selected.owner}. Keputusan hanya bisa dibuat setelah mengambil alih pemeriksaan.</p><Button size="sm" variant="outline" onClick={() => setTakenOver((current) => [...current, selected.id])}>Lanjutkan periksa</Button></div>}
        {selected.owner && !readOnly && <div className="verification-claim"><IconCircleCheck size={18} /> Pemeriksaan diambil alih untuk pratinjau ini.</div>}
        {selected.kind === "Permintaan komsat" && <div className="verification-claim"><strong>Permintaan ganti komsat</strong><p>Anggota meminta komsat lain karena domisili dan kampus berada di wilayah berbeda.</p></div>}
        <section className="verification-section"><h3>Data pendaftaran</h3><p>Diurutkan seperti langkah registrasi anggota.</p>{selected.groups.map((group) => <div className="verification-field-group" key={group.title}><h4>{group.title}</h4><dl>{group.fields.map((field) => <div key={field.label}><dt>{field.label}</dt><dd>{field.value}</dd></div>)}</dl></div>)}</section>
        <section className="verification-section"><h3>Kartu pelajar</h3><p>Dokumen yang dikumpulkan pada registrasi. Pratinjau ini memakai berkas contoh.</p><div className="verification-doc-tabs" role="group" aria-label="Sisi kartu pelajar"><button className={documentSide === "front" ? "active" : ""} aria-pressed={documentSide === "front"} onClick={() => setDocumentSide("front")}>Sisi depan</button><button className={documentSide === "back" ? "active" : ""} aria-pressed={documentSide === "back"} onClick={() => setDocumentSide("back")}>Sisi belakang</button></div><div className="verification-doc-preview">{(documentSide === "front" ? selected.front : selected.back) === "pdf" ? <IconFileTypePdf size={38} /> : <IconId size={38} />}<strong>{documentSide === "front" ? "Sisi depan" : "Sisi belakang"} · {(documentSide === "front" ? selected.front : selected.back) === "pdf" ? "PDF" : "Gambar"}</strong><span>Area pratinjau dokumen contoh</span></div></section>
        <section className="verification-section verification-ktp"><h3>KTP <Badge variant="secondary">Usulan</Badge></h3><p>Belum menjadi input di alur registrasi saat ini. Area ini memperlihatkan rancangan bila PDF atau gambar KTP kelak diperlukan.</p><div className="verification-doc-tabs" role="group" aria-label="Format placeholder KTP"><button className={ktpType === "pdf" ? "active" : ""} aria-pressed={ktpType === "pdf"} onClick={() => setKtpType("pdf")}>PDF</button><button className={ktpType === "image" ? "active" : ""} aria-pressed={ktpType === "image"} onClick={() => setKtpType("image")}>Gambar</button></div><div className="verification-doc-preview placeholder">{ktpType === "pdf" ? <IconFileTypePdf size={38} /> : <IconPhoto size={38} />}<strong>Placeholder KTP · {ktpType === "pdf" ? "PDF" : "gambar"}</strong><span>Tidak ada dokumen identitas asli di pratinjau</span></div></section>
        <section className="verification-section"><h3>Riwayat pemeriksaan</h3>{selected.history.length ? <ol className="verification-history">{selected.history.map((entry, index) => <li key={index}><strong>{entry.title}</strong><span>{entry.detail}</span></li>)}</ol> : <p>Belum ada keputusan atau umpan balik pada putaran ini.</p>}</section>
        {actionsHidden && <div className="verification-readonly"><IconCircleCheck size={18} /> {selected.tab === "selesai" ? "Pengajuan ini sudah selesai. Keputusan tidak tersedia." : "Menunggu perbaikan dari anggota. Keputusan tersedia setelah pengiriman ulang."}</div>}
      </div>)}
    </AdminDrawer>
  </section>;
}

function inScope(item: Review, scope: Scope) { return scope === "national" || (scope === "korda" ? ["Tokyo", "Yokohama"].includes(item.unit) : item.unit === "Tokyo"); }

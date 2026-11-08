import { useMemo, useState } from "react";
import { IconArrowRight, IconCircleCheck, IconMail, IconPlus } from "@tabler/icons-react";
import {
  AdminDrawer, Badge, Button, Callout, FactList, Input, ListRow, PageHeader, PanelCard, SearchFilter,
  SearchableMultiSelect, Tabs, TabsList, TabsTrigger, Textarea, Timeline,
} from "ppij-design-system";
import { MemberWorkspace } from "./MemberWorkspace";
import "./MemberPage.css";

type Scope = "national" | "korda" | "komsat";
type InviteStatus = "Terkirim" | "Tertunda" | "Gagal" | "Diterima" | "Kedaluwarsa" | "Dibatalkan";
type Invitation = { id: number; name: string; email: string; komsat: string; status: InviteStatus; sent: string; updatedAt: string; deliveryAt: string; delivery: "Terkirim" | "Tertunda" | "Gagal"; vouched: boolean };
const initialInvitations: Invitation[] = [
  { id: 1, name: "Contoh Calon Anggota A", email: "undangan-a@example.invalid", komsat: "Tokyo", status: "Terkirim", sent: "30 Okt 2026", updatedAt: "30 Okt 2026", deliveryAt: "30 Okt 2026", delivery: "Terkirim", vouched: false },
  { id: 2, name: "Contoh Calon Anggota B", email: "undangan-b@example.invalid", komsat: "Yokohama", status: "Diterima", sent: "27 Okt 2026", updatedAt: "29 Okt 2026", deliveryAt: "27 Okt 2026", delivery: "Terkirim", vouched: true },
  { id: 3, name: "Contoh Calon Anggota C", email: "undangan-c@example.invalid", komsat: "Tokyo", status: "Gagal", sent: "25 Okt 2026", updatedAt: "25 Okt 2026", deliveryAt: "25 Okt 2026", delivery: "Gagal", vouched: false },
  { id: 4, name: "Contoh Calon Anggota D", email: "undangan-d@example.invalid", komsat: "Osaka", status: "Tertunda", sent: "21 Okt 2026", updatedAt: "21 Okt 2026", deliveryAt: "21 Okt 2026", delivery: "Tertunda", vouched: false },
  { id: 5, name: "Contoh Calon Anggota E", email: "undangan-e@example.invalid", komsat: "Nagoya", status: "Kedaluwarsa", sent: "14 Okt 2026", updatedAt: "22 Okt 2026", deliveryAt: "14 Okt 2026", delivery: "Terkirim", vouched: false },
];
const units = ["Tokyo", "Yokohama", "Chiba", "Saitama", "Osaka", "Kyoto", "Nagoya", "Fukuoka"];
const emailShape = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function MemberPage({ scope, scopePhrase, onNotice }: { scope: Scope; scopePhrase: string; onNotice: (message: string, tone?: "success" | "error") => void }) {
  const [view, setView] = useState<"directory" | "invitations">("directory");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [items, setItems] = useState(initialInvitations);
  const scoped = items.filter((item) => scope === "national" || (scope === "korda" ? ["Tokyo", "Yokohama", "Chiba", "Saitama"].includes(item.komsat) : item.komsat === "Tokyo"));
  const openCount = scoped.filter((item) => ["Terkirim", "Tertunda", "Gagal"].includes(item.status)).length;
  return <PanelCard padding="page" className="grid gap-0 member-page-island">
    <PageHeader className="member-page-header" title="Anggota" description={`Kelola direktori dan undangan untuk ${scopePhrase}.`} actions={<Button size="sm" className="member-invite-button" onClick={() => setInviteOpen(true)}><IconPlus size={16} /> Undang anggota</Button>} />
    <Tabs value={view} onValueChange={(next) => setView(next as "directory" | "invitations")}>
      <TabsList appearance="underline" aria-label="Tampilan anggota">
        <TabsTrigger value="directory">Direktori</TabsTrigger>
        <TabsTrigger value="invitations" count={openCount}>Status undangan</TabsTrigger>
      </TabsList>
    </Tabs>
    {view === "directory" ? <MemberWorkspace scope={scope} onNotice={onNotice} /> : <InvitationStatus items={scoped} onEdit={(id, name, email) => { setItems((current) => current.map((item) => item.id === id ? { ...item, name, email } : item)); onNotice("Nama dan email undangan contoh diperbarui."); }} onUpdate={(id, status) => { setItems((current) => current.map((item) => item.id === id ? { ...item, status, updatedAt: "31 Okt 2026", deliveryAt: status === "Terkirim" ? "31 Okt 2026" : item.deliveryAt, delivery: status === "Terkirim" ? "Terkirim" : item.delivery } : item)); onNotice(status === "Dibatalkan" ? "Undangan contoh dibatalkan." : "Undangan contoh dikirim ulang."); }} />}
    <InviteDrawer open={inviteOpen} onOpenChange={setInviteOpen} scope={scope} onCreate={(recipients, komsat, vouched) => { setItems((current) => [...recipients.map((recipient, index) => ({ id: Date.now() + index, name: recipient.name, email: recipient.email, komsat, status: "Terkirim" as InviteStatus, sent: "31 Okt 2026", updatedAt: "31 Okt 2026", deliveryAt: "31 Okt 2026", delivery: "Terkirim" as const, vouched })), ...current]); setView("invitations"); onNotice(`${recipients.length} undangan contoh dibuat.`); }} />
  </PanelCard>;
}

function InvitationStatus({ items, onUpdate, onEdit }: { items: Invitation[]; onEdit: (id: number, name: string, email: string) => void; onUpdate: (id: number, status: InviteStatus) => void }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string[]>([]);
  const [komsat, setKomsat] = useState<string[]>([]);
  const [selected, setSelected] = useState<Invitation | null>(null);
  const [confirmAction, setConfirmAction] = useState<"Dibatalkan" | "Terkirim" | null>(null);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const visible = items.filter((item) => (!search || `${item.name} ${item.email}`.toLocaleLowerCase("id").includes(search.toLocaleLowerCase("id"))) && (!status.length || status.includes(item.status)) && (!komsat.length || komsat.includes(item.komsat)));
  return <section className="member-invitations" aria-label="Status undangan">
    <div className="member-workspace-intro"><div><h2>Status undangan</h2><p>Pantau pengiriman dan langkah berikutnya bagi calon anggota.</p></div><span>{visible.length} undangan contoh</span></div>
    <SearchFilter className="verification-filters member-filters" searchValue={search} onSearchChange={setSearch} searchPlaceholder="Cari nama atau email" filters={<SearchableMultiSelect compact label="Status" values={status} allLabel="Semua status" options={["Terkirim", "Tertunda", "Gagal", "Diterima", "Kedaluwarsa", "Dibatalkan"]} onChange={setStatus} />} advancedTitle="Filter undangan" advancedActiveCount={komsat.length} advancedFilters={<SearchableMultiSelect label="Komsat" values={komsat} options={units} allLabel="Semua komsat" onChange={setKomsat} />} activeFilters={[...status.map((value) => ({ label: "Status", value, onRemove: () => setStatus((current) => current.filter((item) => item !== value)) })), ...komsat.map((value) => ({ label: "Komsat", value, onRemove: () => setKomsat((current) => current.filter((item) => item !== value)) }))]} onClearAll={() => { setStatus([]); setKomsat([]); }} />
    <div className="overflow-hidden rounded-xl border border-brand-border bg-card">{visible.map((item) => <ListRow key={item.id} title={item.name} subtitle={`${item.email} · ${item.komsat}`} meta={item.sent} badge={<Badge variant={item.status === "Diterima" ? "success" : ["Gagal", "Tertunda"].includes(item.status) ? "warning" : "secondary"}>{item.status}</Badge>} trailing={<IconArrowRight aria-hidden className="size-[17px] text-brand-muted" />} onSelect={() => setSelected(item)} />)}{visible.length === 0 && <p className="px-4 py-6 text-center text-[13px] text-brand-muted">Tidak ada undangan yang cocok. Coba kata kunci atau filter lain.</p>}</div>
    <AdminDrawer size="sm" density="compact" open={Boolean(selected)} onOpenChange={(open) => { if (!open) { setSelected(null); setEditing(false); setConfirmAction(null); } }} title={editing ? "Ubah nama/email" : selected?.name ?? "Detail undangan"} description={selected?.email} locale="id" className="member-invite-drawer" footer={editing ? <div className="member-invite-actions"><Button size="sm" variant="outline" onClick={() => setEditing(false)}>Batal</Button><Button size="sm" disabled={!editName.trim() || !emailShape.test(editEmail)} onClick={() => { if (selected && editName.trim() && emailShape.test(editEmail)) { onEdit(selected.id, editName.trim(), editEmail.trim()); setSelected({ ...selected, name: editName.trim(), email: editEmail.trim() }); setEditing(false); } }}>Simpan perubahan</Button></div> : selected && ["Terkirim", "Tertunda", "Gagal"].includes(selected.status) ? <div className="member-invite-actions"><Button size="sm" variant="outline" onClick={() => { setConfirmAction("Dibatalkan"); }}>Batalkan undangan</Button><Button size="sm" variant="outline" onClick={() => { setEditing(true); setEditName(selected.name); setEditEmail(selected.email); }}>Ubah nama/email</Button><Button size="sm" onClick={() => setConfirmAction("Terkirim")}>Kirim ulang</Button></div> : undefined}>{editing && selected ? <div className="member-invite-form"><label>Nama lengkap<Input value={editName} onChange={(event) => setEditName(event.target.value)} /></label><label>Email<Input type="email" value={editEmail} onChange={(event) => setEditEmail(event.target.value)} /></label><p>Perubahan berlaku pada undangan contoh ini.</p></div> : selected && <div className="grid gap-3.5 pb-3"><Callout density="compact" tone="neutral" icon={<IconMail stroke={1.75} aria-hidden />}>Undangan contoh, tanpa pengiriman email</Callout><section className="grid gap-2"><h3 className="text-[13px] font-bold text-brand-ink">Ringkasan undangan</h3><FactList variant="rows" items={[["Nama", selected.name], ["Email", selected.email], ["Komsat", selected.komsat], ["Status", selected.status], ["Diundang", selected.sent], ["Dijamin pengurus", selected.vouched ? "Ya" : "Tidak"]].map(([label, value]) => ({ label, value }))} /></section><section className="grid gap-2"><h3 className="text-[13px] font-bold text-brand-ink">Riwayat undangan</h3><Timeline items={invitationTimeline(selected).map((event) => ({ title: event.title, description: event.detail, time: event.date, state: event.tone === "done" ? "complete" as const : event.tone === "attention" ? "current" as const : "upcoming" as const }))} /></section></div>}<AdminDrawer size="sm" density="compact" open={confirmAction !== null} onOpenChange={(open) => { if (!open) setConfirmAction(null); }} title={confirmAction === "Dibatalkan" ? "Batalkan undangan?" : "Kirim ulang undangan?"} description={selected?.email} locale="id" footer={<div className="member-invite-actions"><Button size="sm" variant="outline" onClick={() => setConfirmAction(null)}>Kembali</Button><Button size="sm" variant={confirmAction === "Dibatalkan" ? "destructive" : "default"} onClick={() => { if (selected && confirmAction) onUpdate(selected.id, confirmAction); setConfirmAction(null); setSelected(null); }}>Konfirmasi</Button></div>}><p className="member-confirm-copy">{confirmAction === "Dibatalkan" ? "Tautan undangan ini tidak dapat digunakan lagi." : "Email undangan akan dikirim ulang ke alamat di atas."}</p></AdminDrawer></AdminDrawer>
  </section>;
}

function invitationTimeline(item: Invitation) {
  const events = [
    { date: item.sent, title: "Undangan dibuat", detail: `Ditujukan ke ${item.komsat}.`, tone: "done" },
    { date: item.deliveryAt, title: `Email ${item.delivery.toLocaleLowerCase("id")}`, detail: item.delivery === "Gagal" ? "Alamat perlu diperiksa sebelum dikirim ulang." : item.delivery === "Tertunda" ? "Pengiriman belum selesai." : "Tautan undangan dikirim ke alamat penerima.", tone: item.delivery === "Terkirim" ? "done" : "attention" },
  ];
  if (!["Terkirim", "Tertunda", "Gagal"].includes(item.status)) {
    events.push({ date: item.updatedAt, title: `Status: ${item.status}`, detail: item.status === "Diterima" ? item.vouched ? "Penerima mendaftar; peninjauan dapat dilewati karena dijamin pengurus." : "Penerima membuka undangan dan memulai pendaftaran." : item.status === "Dibatalkan" ? "Undangan tidak lagi dapat digunakan." : "Tautan undangan sudah melewati masa berlaku.", tone: item.status === "Diterima" ? "done" : "muted" });
  }
  return events;
}

type Recipient = { email: string; name: string };
function InviteDrawer({ open, onOpenChange, scope, onCreate }: { open: boolean; onOpenChange: (open: boolean) => void; scope: Scope; onCreate: (recipients: Recipient[], komsat: string, vouched: boolean) => void }) {
  const [phase, setPhase] = useState<"form" | "review" | "result">("form");
  const [mode, setMode] = useState<"one" | "many">("one");
  const [komsat, setKomsat] = useState<string[]>(scope === "komsat" ? ["Tokyo"] : []);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pasted, setPasted] = useState("");
  const [rows, setRows] = useState<Recipient[]>([]);
  const [vouched, setVouched] = useState(false);
  const [error, setError] = useState("");
  const recipients = useMemo(() => mode === "one" ? [{ name: name.trim(), email: email.trim().toLowerCase() }] : rows, [mode, name, email, rows]);
  const reset = () => { setPhase("form"); setMode("one"); setKomsat(scope === "komsat" ? ["Tokyo"] : []); setName(""); setEmail(""); setPasted(""); setRows([]); setVouched(false); setError(""); };
  const close = () => { onOpenChange(false); reset(); };
  const parse = () => { const unique = [...new Set(pasted.split(/[\s,;]+/).map((value) => value.trim().toLowerCase()).filter(Boolean))]; setRows(unique.map((value) => ({ email: value, name: "" }))); setPasted(""); };
  const review = () => { if (!komsat[0]) { setError("Pilih komsat tujuan."); return; } if (!recipients.length || recipients.some((item) => !item.name || !emailShape.test(item.email))) { setError("Isi nama dan email yang valid untuk setiap penerima."); return; } setError(""); setPhase("review"); };
  const send = () => { onCreate(recipients, komsat[0], vouched); setPhase("result"); };
  return <AdminDrawer size="sm" density="compact" open={open} onOpenChange={(next) => { if (!next) close(); }} title={phase === "result" ? "Undangan dibuat" : "Undang anggota"} description={phase === "form" ? "Langkah 1 dari 2 · Isi penerima" : phase === "review" ? "Langkah 2 dari 2 · Periksa undangan" : "Pratinjau desain"} locale="id" className="member-invite-drawer" footer={<div className="member-invite-actions">{phase === "form" ? <Button size="sm" onClick={review}>Periksa undangan</Button> : phase === "review" ? <><Button size="sm" variant="outline" onClick={() => setPhase("form")}>Kembali</Button><Button size="sm" onClick={send}>Buat undangan contoh</Button></> : <Button size="sm" onClick={close}>Selesai</Button>}</div>}>
    <div className="member-invite-form">{phase === "form" ? <>
      {scope === "komsat" ? <p>Komsat tujuan: <strong>Tokyo</strong></p> : <SearchableMultiSelect single label="Komsat tujuan" values={komsat} options={scope === "korda" ? units.slice(0, 4) : units} allLabel="Pilih komsat" onChange={setKomsat} />}
      <Tabs value={mode} onValueChange={(next) => setMode(next as "one" | "many")}><TabsList appearance="segmented" aria-label="Jumlah penerima"><TabsTrigger value="one">Satu orang</TabsTrigger><TabsTrigger value="many">Beberapa orang</TabsTrigger></TabsList></Tabs>
      {mode === "one" ? <><label>Nama lengkap<Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Nama calon anggota" /></label><label>Email<Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="nama@example.com" /></label></> : rows.length ? <div className="member-invite-recipients">{rows.map((row, index) => <label key={`${row.email}-${index}`}>{row.email}{!emailShape.test(row.email) && <span className="member-invite-error">Email tidak valid</span>}<Input value={row.name} onChange={(event) => setRows((current) => current.map((item, i) => i === index ? { ...item, name: event.target.value } : item))} placeholder="Nama lengkap" /></label>)}<Button size="sm" variant="outline" onClick={() => setRows([])}>Ubah daftar email</Button></div> : <label>Daftar email<Textarea rows={4} value={pasted} onChange={(event) => setPasted(event.target.value)} placeholder="Pisahkan email dengan koma, spasi, atau baris baru" /><Button size="sm" variant="outline" onClick={parse} disabled={!pasted.trim()}>Pisahkan email</Button></label>}
      <label className="member-vouched"><input type="checkbox" checked={vouched} onChange={(event) => setVouched(event.target.checked)} /><span><strong>Dijamin pengurus</strong><small>Peninjauan dapat dilewati setelah pendaftaran.</small></span></label>
      {error && <p className="member-invite-error" role="alert">{error}</p>}
    </> : phase === "review" ? <><p>Periksa {recipients.length} penerima sebelum membuat undangan.</p><dl><div><dt>Komsat</dt><dd>{komsat[0]}</dd></div><div><dt>Dijamin pengurus</dt><dd>{vouched ? "Ya" : "Tidak"}</dd></div></dl><ul>{recipients.map((recipient) => <li key={recipient.email}><strong>{recipient.name}</strong><small>{recipient.email}</small></li>)}</ul></> : <div className="member-invite-result"><IconCircleCheck size={32} /><strong>{recipients.length} undangan contoh dibuat</strong><p>Daftar status undangan telah diperbarui. Tidak ada email yang dikirim dalam pratinjau.</p></div>}
    </div>
  </AdminDrawer>;
}

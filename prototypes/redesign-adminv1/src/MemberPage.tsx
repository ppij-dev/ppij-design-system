import { useMemo, useState } from "react";
import { IconArrowRight, IconCircleCheck, IconMail, IconPlus } from "@tabler/icons-react";
import { AdminDrawer, Badge, Button, Input, PageHeader, SearchFilter, Textarea } from "ppij-design-system";
import { SearchableUnitMenu } from "./ReviewWorkspace";
import { SearchableMultiSelect } from "./SearchableMultiSelect";
import { MemberWorkspace } from "./MemberWorkspace";
import "./MemberPage.css";

type Scope = "national" | "korda" | "komsat";
type InviteStatus = "Terkirim" | "Tertunda" | "Gagal" | "Diterima" | "Kedaluwarsa" | "Dibatalkan";
type Invitation = { id: number; name: string; email: string; komsat: string; status: InviteStatus; sent: string; vouched: boolean };
const initialInvitations: Invitation[] = [
  { id: 1, name: "Contoh Calon Anggota A", email: "undangan-a@example.invalid", komsat: "Tokyo", status: "Terkirim", sent: "30 Okt 2026", vouched: false },
  { id: 2, name: "Contoh Calon Anggota B", email: "undangan-b@example.invalid", komsat: "Yokohama", status: "Diterima", sent: "27 Okt 2026", vouched: true },
  { id: 3, name: "Contoh Calon Anggota C", email: "undangan-c@example.invalid", komsat: "Tokyo", status: "Gagal", sent: "25 Okt 2026", vouched: false },
  { id: 4, name: "Contoh Calon Anggota D", email: "undangan-d@example.invalid", komsat: "Osaka", status: "Tertunda", sent: "21 Okt 2026", vouched: false },
  { id: 5, name: "Contoh Calon Anggota E", email: "undangan-e@example.invalid", komsat: "Nagoya", status: "Kedaluwarsa", sent: "14 Okt 2026", vouched: false },
];
const units = ["Tokyo", "Yokohama", "Chiba", "Saitama", "Osaka", "Kyoto", "Nagoya", "Fukuoka"];
const emailShape = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function MemberPage({ scope, scopePhrase, onNotice }: { scope: Scope; scopePhrase: string; onNotice: (message: string, tone?: "success" | "error") => void }) {
  const [view, setView] = useState<"directory" | "invitations">("directory");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [items, setItems] = useState(initialInvitations);
  const scoped = items.filter((item) => scope === "national" || (scope === "korda" ? ["Tokyo", "Yokohama", "Chiba", "Saitama"].includes(item.komsat) : item.komsat === "Tokyo"));
  const openCount = scoped.filter((item) => ["Terkirim", "Tertunda", "Gagal"].includes(item.status)).length;
  return <div className="verification-page-island member-page-island">
    <PageHeader className="member-page-header" title="Anggota" description={`Kelola direktori dan undangan untuk ${scopePhrase}.`} actions={<Button className="member-invite-button" onClick={() => setInviteOpen(true)}><IconPlus size={17} /> Undang anggota</Button>} />
    <div className="member-view-tabs" role="tablist" aria-label="Tampilan anggota"><button role="tab" aria-selected={view === "directory"} className={view === "directory" ? "active" : ""} onClick={() => setView("directory")}>Direktori</button><button role="tab" aria-selected={view === "invitations"} className={view === "invitations" ? "active" : ""} onClick={() => setView("invitations")}>Status undangan <span>{openCount}</span></button></div>
    {view === "directory" ? <MemberWorkspace scope={scope} /> : <InvitationStatus items={scoped} onUpdate={(id, status) => { setItems((current) => current.map((item) => item.id === id ? { ...item, status } : item)); onNotice(status === "Dibatalkan" ? "Undangan contoh dibatalkan." : "Undangan contoh dikirim ulang."); }} />}
    <InviteDrawer open={inviteOpen} onOpenChange={setInviteOpen} scope={scope} onCreate={(recipients, komsat, vouched) => { setItems((current) => [...recipients.map((recipient, index) => ({ id: Date.now() + index, name: recipient.name, email: recipient.email, komsat, status: "Terkirim" as InviteStatus, sent: "31 Okt 2026", vouched })), ...current]); setView("invitations"); onNotice(`${recipients.length} undangan contoh dibuat.`); }} />
  </div>;
}

function InvitationStatus({ items, onUpdate }: { items: Invitation[]; onUpdate: (id: number, status: InviteStatus) => void }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string[]>([]);
  const [komsat, setKomsat] = useState<string[]>([]);
  const [selected, setSelected] = useState<Invitation | null>(null);
  const visible = items.filter((item) => (!search || `${item.name} ${item.email}`.toLocaleLowerCase("id").includes(search.toLocaleLowerCase("id"))) && (!status.length || status.includes(item.status)) && (!komsat.length || komsat.includes(item.komsat)));
  return <section className="member-invitations" aria-label="Status undangan">
    <div className="member-workspace-intro"><div><h2>Status undangan</h2><p>Pantau pengiriman dan langkah berikutnya bagi calon anggota.</p></div><span>{visible.length} undangan contoh</span></div>
    <SearchFilter className="verification-filters member-filters" searchValue={search} onSearchChange={setSearch} searchPlaceholder="Cari nama atau email" filters={<SearchableMultiSelect compact label="Status" values={status} allLabel="Semua status" options={["Terkirim", "Tertunda", "Gagal", "Diterima", "Kedaluwarsa", "Dibatalkan"]} onChange={setStatus} />} advancedTitle="Filter undangan" advancedActiveCount={komsat.length} advancedFilters={<SearchableMultiSelect label="Komsat" values={komsat} options={units} allLabel="Semua komsat" onChange={setKomsat} />} activeFilters={[...status.map((value) => ({ label: "Status", value, onRemove: () => setStatus((current) => current.filter((item) => item !== value)) })), ...komsat.map((value) => ({ label: "Komsat", value, onRemove: () => setKomsat((current) => current.filter((item) => item !== value)) }))]} onClearAll={() => { setStatus([]); setKomsat([]); }} />
    <div className="member-invite-list">{visible.map((item) => <button key={item.id} type="button" onClick={() => setSelected(item)}><span><strong>{item.name}</strong><small>{item.email} · {item.komsat}</small></span><span><Badge variant={item.status === "Diterima" ? "success" : ["Gagal", "Tertunda"].includes(item.status) ? "warning" : "secondary"}>{item.status}</Badge><small>{item.sent}</small></span><IconArrowRight size={17} /></button>)}{visible.length === 0 && <p className="member-invite-empty">Tidak ada undangan yang cocok. Coba kata kunci atau filter lain.</p>}</div>
    <AdminDrawer open={Boolean(selected)} onOpenChange={(open) => { if (!open) setSelected(null); }} title={selected?.name ?? "Detail undangan"} description={selected?.email} locale="id" className="member-detail-drawer" footer={selected && ["Terkirim", "Tertunda", "Gagal"].includes(selected.status) ? <div className="member-invite-actions"><Button variant="outline" onClick={() => { onUpdate(selected.id, "Dibatalkan"); setSelected(null); }}>Batalkan undangan</Button><Button onClick={() => { onUpdate(selected.id, "Terkirim"); setSelected(null); }}>Kirim ulang</Button></div> : undefined}>{selected && <div className="member-detail"><div className="member-detail-note"><IconMail size={17} /> Undangan contoh, tanpa pengiriman email</div><section><h3>Ringkasan undangan</h3><dl>{[["Nama", selected.name], ["Email", selected.email], ["Komsat", selected.komsat], ["Status", selected.status], ["Diundang", selected.sent], ["Dijamin pengurus", selected.vouched ? "Ya" : "Tidak"]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></section><section><h3>Langkah keanggotaan</h3><p>Diundang → Mendaftar → Ditinjau → Aktif. Peninjauan dilewati jika dijamin pengurus.</p></section></div>}</AdminDrawer>
  </section>;
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
  return <AdminDrawer open={open} onOpenChange={(next) => { if (!next) close(); }} title={phase === "result" ? "Undangan dibuat" : "Undang anggota"} description={phase === "form" ? "Langkah 1 dari 2 · Isi penerima" : phase === "review" ? "Langkah 2 dari 2 · Periksa undangan" : "Pratinjau desain"} locale="id" className="member-detail-drawer" footer={<div className="member-invite-actions">{phase === "form" ? <Button onClick={review}>Periksa undangan</Button> : phase === "review" ? <><Button variant="outline" onClick={() => setPhase("form")}>Kembali</Button><Button onClick={send}>Buat undangan contoh</Button></> : <Button onClick={close}>Selesai</Button>}</div>}>
    <div className="member-invite-form">{phase === "form" ? <>
      {scope === "komsat" ? <p>Komsat tujuan: <strong>Tokyo</strong></p> : <SearchableUnitMenu label="Komsat tujuan" values={komsat} options={scope === "korda" ? units.slice(0, 4) : units} onChange={setKomsat} />}
      <div className="member-invite-mode" role="group" aria-label="Jumlah penerima"><button type="button" aria-pressed={mode === "one"} onClick={() => setMode("one")}>Satu orang</button><button type="button" aria-pressed={mode === "many"} onClick={() => setMode("many")}>Beberapa orang</button></div>
      {mode === "one" ? <><label>Nama lengkap<Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Nama calon anggota" /></label><label>Email<Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="nama@example.com" /></label></> : rows.length ? <div className="member-invite-recipients">{rows.map((row, index) => <label key={`${row.email}-${index}`}>{row.email}{!emailShape.test(row.email) && <span className="member-invite-error">Email tidak valid</span>}<Input value={row.name} onChange={(event) => setRows((current) => current.map((item, i) => i === index ? { ...item, name: event.target.value } : item))} placeholder="Nama lengkap" /></label>)}<Button variant="outline" size="sm" onClick={() => setRows([])}>Ubah daftar email</Button></div> : <label>Daftar email<Textarea rows={4} value={pasted} onChange={(event) => setPasted(event.target.value)} placeholder="Pisahkan email dengan koma, spasi, atau baris baru" /><Button variant="outline" size="sm" onClick={parse} disabled={!pasted.trim()}>Pisahkan email</Button></label>}
      <label className="member-vouched"><input type="checkbox" checked={vouched} onChange={(event) => setVouched(event.target.checked)} /><span><strong>Dijamin pengurus</strong><small>Peninjauan dapat dilewati setelah pendaftaran.</small></span></label>
      {error && <p className="member-invite-error" role="alert">{error}</p>}
    </> : phase === "review" ? <><p>Periksa {recipients.length} penerima sebelum membuat undangan.</p><dl><div><dt>Komsat</dt><dd>{komsat[0]}</dd></div><div><dt>Dijamin pengurus</dt><dd>{vouched ? "Ya" : "Tidak"}</dd></div></dl><ul>{recipients.map((recipient) => <li key={recipient.email}><strong>{recipient.name}</strong><small>{recipient.email}</small></li>)}</ul></> : <div className="member-invite-result"><IconCircleCheck size={32} /><strong>{recipients.length} undangan contoh dibuat</strong><p>Daftar status undangan telah diperbarui. Tidak ada email yang dikirim dalam pratinjau.</p></div>}
    </div>
  </AdminDrawer>;
}

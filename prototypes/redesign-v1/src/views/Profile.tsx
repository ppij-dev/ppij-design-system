import * as React from "react";
import { IconEye, IconEyeOff, IconHistory, IconHome, IconIdBadge2, IconPencil } from "@tabler/icons-react";
import { Badge, Button, Card, FileUpload, Input, Label, PageHeader, PhoneField, PortalShell, RadioGroup, RadioGroupItem, Spinner, TagInput, Textarea, TypeAhead } from "ppij-design-system";
import logoUrl from "../../../../brand/ppij-logo.png";

function Rows({ items }: { items: Array<[string, React.ReactNode]> }) {
  return (
    <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
      {items.map(([label, value]) => (
        <div key={label} className="grid gap-0.5">
          <dt className="text-sm text-brand-muted">{label}</dt>
          <dd className="font-medium text-brand-ink">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function Chips({ values }: { values: string[] }) {
  return (
    <span className="flex flex-wrap gap-1.5">
      {values.map((v) => (
        <span key={v} className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-brand-ink">{v}</span>
      ))}
    </span>
  );
}

function Masked() {
  return <span className="tracking-[0.2em]" aria-label="Tersembunyi, terenkripsi">{"\u2022".repeat(10)}</span>;
}

function F({ label, children, span }: { label: string; children: React.ReactNode; span?: boolean }) {
  return (
    <div className={span ? "grid gap-1.5 sm:col-span-2" : "grid gap-1.5"}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function EditableSection({ title, read, children, onAfterSave }: { title: string; read: React.ReactNode; children: React.ReactNode; onAfterSave?: () => void }) {
  const [editing, setEditing] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const save = () => {
    setSaving(true);
    window.setTimeout(() => { setSaving(false); setEditing(false); setSaved(true); onAfterSave?.(); }, 900);
  };
  return (
    <Card className="grid gap-4 rounded-xl border border-brand-border bg-card p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-brand-ink">{title}</h2>
        {!editing && (
          <Button variant="ghost" size="sm" onClick={() => { setEditing(true); setSaved(false); }}>
            <IconPencil className="size-4" aria-hidden="true" />
            Ubah
          </Button>
        )}
      </div>
      {saved && !editing && <p role="status" className="-mt-2 text-sm text-success">Perubahan tersimpan.</p>}
      {editing ? (
        <form className="grid gap-4" onSubmit={(e) => e.preventDefault()}>
          {children}
          <div className="flex flex-wrap gap-2 pt-1">
            <Button type="submit" disabled={saving} aria-busy={saving} onClick={save}>
              {saving ? (<><Spinner size="sm" decorative /><span>Menyimpan…</span></>) : "Simpan perubahan"}
            </Button>
            <Button variant="ghost" disabled={saving} onClick={() => setEditing(false)}>Batal</Button>
          </div>
        </form>
      ) : read}
    </Card>
  );
}

function DataDiriSection() {
  const [provinsi, setProvinsi] = React.useState("Bali");
  const [phone, setPhone] = React.useState("+81 90-1234-5678");
  const [phoneRevealed, setPhoneRevealed] = React.useState(false);
  const [minat, setMinat] = React.useState(["Fotografi", "Riset kecerdasan buatan", "Bahasa Jepang"]);
  return (
    <EditableSection
      onAfterSave={() => setPhoneRevealed(false)}
      title="Data diri"
      read={<Rows items={[
        ["Nama lengkap", "I Nyoman Darma Kotama"],
        ["Nama panggilan", "Darma"],
        ["Jenis kelamin", "Laki-laki"],
        ["Tanggal lahir", "2 September 1992"],
        ["Provinsi asal di Indonesia", "Bali"],
        ["Nomor telepon atau WhatsApp", phoneRevealed ? "+81 90-1234-5678" : (
          <span key="phone" className="flex flex-wrap items-center gap-2">
            <Masked />
            <Button variant="ghost" size="sm" onClick={() => setPhoneRevealed(true)}>
              <IconEye className="size-4" aria-hidden="true" />
              Tampilkan
            </Button>
          </span>
        )],
        ["LINE ID", "darmakotama"],
        ["Minat", <Chips key="minat" values={minat} />],
      ]} />}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <F label="Nama lengkap"><Input defaultValue="I Nyoman Darma Kotama" /></F>
        <F label="Nama panggilan"><Input defaultValue="Darma" /></F>
        <F label="Jenis kelamin">
          <RadioGroup defaultValue="laki-laki" className="flex gap-4 pt-1.5">
            <span className="flex items-center gap-2"><RadioGroupItem value="laki-laki" id="jk-l" /><Label htmlFor="jk-l">Laki-laki</Label></span>
            <span className="flex items-center gap-2"><RadioGroupItem value="perempuan" id="jk-p" /><Label htmlFor="jk-p">Perempuan</Label></span>
          </RadioGroup>
        </F>
        <F label="Tanggal lahir"><Input type="date" defaultValue="1992-09-02" /></F>
        <F label="Provinsi asal di Indonesia"><TypeAhead value={provinsi} onChange={setProvinsi} options={["Bali", "Jawa Timur", "Jawa Barat", "DKI Jakarta", "Sulawesi Selatan"]} placeholder="Ketik provinsi atau kabupaten/kota" /></F>
        <F label="Nomor telepon atau WhatsApp"><PhoneField value={phone} onChange={setPhone} defaultCode="+81" /></F>
        <F label="LINE ID"><Input defaultValue="darmakotama" /></F>
        <F label="Minat" span><TagInput values={minat} onChange={setMinat} suggestions={["Musik", "Olahraga", "Kuliner", "Teknologi"]} placeholder="Cari atau ketik minat" /></F>
      </div>
    </EditableSection>
  );
}

function DomisiliSection() {
  const [prefektur, setPrefektur] = React.useState("Okayama");
  const [kota, setKota] = React.useState("Kita-ku, Kota Okayama");
  return (
    <EditableSection
      title="Domisili di Jepang"
      read={<Rows items={[
        ["Kode pos", "700-0001"],
        ["Prefektur", "Okayama"],
        ["Kota atau kecamatan", "Kita-ku, Kota Okayama"],
        ["Komsat", "Okayama"],
      ]} />}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <F label="Kode pos"><Input defaultValue="700-0001" inputMode="numeric" /></F>
        <F label="Prefektur"><TypeAhead value={prefektur} onChange={setPrefektur} options={["Okayama", "Hiroshima", "Osaka", "Kyoto"]} placeholder="Ketik prefektur" /></F>
        <F label="Kota atau kecamatan"><TypeAhead value={kota} onChange={setKota} options={["Kita-ku, Kota Okayama", "Naka-ku, Kota Okayama", "Kurashiki"]} placeholder="Ketik nama kota atau ku" /></F>
      </div>
      <p className="rounded-md border border-brand-border bg-secondary/50 p-3 text-sm text-brand-ink">Komsat Anda: <strong>Okayama</strong>, ditentukan otomatis dari domisili.</p>
    </EditableSection>
  );
}

function PendidikanSection() {
  const [institusi, setInstitusi] = React.useState("Okayama University");
  return (
    <EditableSection
      title="Pendidikan"
      read={<Rows items={[
        ["Institusi", "Okayama University"],
        ["Fakultas atau sekolah pascasarjana", "Graduate School of Science and Technology"],
        ["Jenjang", "S2 (Magister)"],
        ["Program studi", "Computer Science"],
        ["Bulan masuk", "April 2025"],
        ["Perkiraan bulan lulus", "Maret 2027"],
        ["Lab atau pembimbing", "Laboratorium Sistem Informasi"],
        ["Nomor pelajar", "76123456"],
        ["Kartu pelajar", "Terunggah (kartu-pelajar.jpg)"],
      ]} />}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <F label="Institusi"><TypeAhead value={institusi} onChange={setInstitusi} options={["Okayama University", "Hiroshima University", "Osaka University", "Kyoto University"]} placeholder="Ketik institusi" /></F>
        <F label="Fakultas atau sekolah pascasarjana"><Input defaultValue="Graduate School of Science and Technology" /></F>
        <F label="Jenjang">
          <RadioGroup defaultValue="s2" className="flex flex-wrap gap-4 pt-1.5">
            <span className="flex items-center gap-2"><RadioGroupItem value="s1" id="jg-s1" /><Label htmlFor="jg-s1">S1</Label></span>
            <span className="flex items-center gap-2"><RadioGroupItem value="s2" id="jg-s2" /><Label htmlFor="jg-s2">S2</Label></span>
            <span className="flex items-center gap-2"><RadioGroupItem value="s3" id="jg-s3" /><Label htmlFor="jg-s3">S3</Label></span>
          </RadioGroup>
        </F>
        <F label="Program studi"><Input defaultValue="Computer Science" /></F>
        <F label="Bulan masuk"><Input type="month" defaultValue="2025-04" /></F>
        <F label="Perkiraan bulan lulus"><Input type="month" defaultValue="2027-03" /></F>
        <F label="Lab atau pembimbing"><Input defaultValue="Laboratorium Sistem Informasi" /></F>
        <F label="Nomor pelajar"><Input defaultValue="76123456" inputMode="numeric" /></F>
        <F label="Kartu pelajar" span><FileUpload label="Foto kartu pelajar" status="done" fileName="kartu-pelajar.jpg" onPick={() => {}} onRemove={() => {}} /></F>
      </div>
    </EditableSection>
  );
}

function PendanaanSection() {
  const [funding, setFunding] = React.useState(["Beasiswa: JASSO"]);
  return (
    <EditableSection
      title="Pendanaan"
      read={<Rows items={[["Sumber pendanaan", <Chips key="funding" values={funding} />]]} />}
    >
      <F label="Sumber pendanaan">
        <TagInput values={funding} onChange={setFunding} suggestions={["MEXT", "LPDP", "Beasiswa universitas", "Biaya sendiri"]} placeholder="Cari atau ketik sumber pendanaan" />
      </F>
    </EditableSection>
  );
}

function IzinSection() {
  const [contactRevealed, setContactRevealed] = React.useState(false);
  const [emPhone, setEmPhone] = React.useState("+62 812-3456-7890");
  return (
    <EditableSection
      onAfterSave={() => setContactRevealed(false)}
      title="Izin tinggal dan kontak darurat"
      read={<>
        <Rows items={[
          ["Status izin tinggal", "Student"],
          ["Tanggal kedaluwarsa izin tinggal", "31 Maret 2027"],
        ]} />
        <h3 className="flex flex-wrap items-center gap-2 pt-4 pb-1 text-sm font-bold text-brand-ink">
          Kontak darurat
          <span className="text-xs font-medium text-brand-muted">(terenkripsi)</span>
          {contactRevealed ? (
            <Button variant="ghost" size="sm" onClick={() => setContactRevealed(false)}>
              <IconEyeOff className="size-4" aria-hidden="true" />
              Sembunyikan
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => setContactRevealed(true)}>
              <IconEye className="size-4" aria-hidden="true" />
              Tampilkan
            </Button>
          )}
        </h3>
        {contactRevealed ? (
          <Rows items={[
            ["Nama kontak", "Ni Made Rai"],
            ["Hubungan", "Ibu"],
            ["Nomor telepon kontak", "+62 812-3456-7890"],
            ["Alamat kontak", "Denpasar, Bali"],
          ]} />
        ) : (
          <Rows items={[
            ["Nama kontak", <Masked key="m1" />],
            ["Hubungan", <Masked key="m2" />],
            ["Nomor telepon kontak", <Masked key="m3" />],
            ["Alamat kontak", <Masked key="m4" />],
          ]} />
        )}
      </>}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <F label="Status izin tinggal"><Input defaultValue="Student" /></F>
        <F label="Tanggal kedaluwarsa izin tinggal"><Input type="date" defaultValue="2027-03-31" /></F>
      </div>
      <fieldset className="grid gap-4 border-t border-brand-border pt-4">
        <legend className="px-1 text-sm font-bold text-brand-ink">Kontak darurat</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <F label="Nama kontak"><Input defaultValue="Ni Made Rai" /></F>
          <F label="Hubungan"><Input defaultValue="Ibu" /></F>
          <F label="Nomor telepon kontak"><PhoneField value={emPhone} onChange={setEmPhone} defaultCode="+62" /></F>
          <F label="Alamat kontak"><Textarea rows={3} defaultValue="Denpasar, Bali" /></F>
        </div>
      </fieldset>
    </EditableSection>
  );
}

function RailFact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-0.5">
      <dt className="text-xs text-brand-muted">{label}</dt>
      <dd className="font-semibold text-brand-ink">{children}</dd>
    </div>
  );
}

function ProfileContent() {
  const history = [
    { status: "Aktif", reason: "Kartu anggota diterbitkan", date: "6 Okt 2026" },
    { status: "Belum lengkap", reason: "Pendaftaran diterima", date: "1 Okt 2026" },
  ];
  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Profil" description="Data keanggotaan dan riwayat status Anda." />
      <div className="flex flex-col gap-5 md:grid md:grid-cols-[350px_minmax(0,1fr)] md:items-start md:gap-x-8 md:gap-y-6">
        <div className="flex flex-col gap-5">
          <Card className="gap-4 rounded-xl border border-brand-border bg-card p-5">
            <div className="flex items-center gap-3">
              <IconIdBadge2 className="size-6 shrink-0 text-brand-red" aria-hidden="true" />
              <div className="grid gap-0.5">
                <h2 className="flex flex-wrap items-center gap-2 font-bold text-brand-ink">
                  I Nyoman Darma Kotama
                  <Badge variant="success">Aktif</Badge>
                </h2>
                <p className="text-sm text-brand-muted">darma.kotama@gmail.com</p>
              </div>
            </div>
            <dl className="grid gap-3 border-t border-brand-border pt-4">
              <RailFact label="Nomor anggota"><span className="font-mono">PPIJ-2026-000123</span></RailFact>
              <RailFact label="Komsat">Okayama</RailFact>
              <RailFact label="Korda">Kansai</RailFact>
              <RailFact label="Berlaku sampai">6 Oktober 2027</RailFact>
            </dl>
          </Card>
          <section aria-labelledby="profile-history-heading">
            <h2 id="profile-history-heading" className="mb-3 flex items-center gap-2 text-lg font-bold text-brand-ink">
              <IconHistory className="size-5 text-brand-red" aria-hidden="true" />
              Riwayat keanggotaan
            </h2>
            <Card className="rounded-xl border border-brand-border bg-card p-5">
              <ol className="grid">
                {history.map((change, i) => (
                  <li key={change.date + change.status} className="flex gap-3 pb-5 last:pb-0">
                    <span className="flex flex-col items-center self-stretch" aria-hidden="true">
                      <span className={i === 0 ? "mt-1.5 size-2.5 shrink-0 rounded-full bg-brand-red" : "mt-1.5 size-2.5 shrink-0 rounded-full bg-brand-muted"} />
                      {i < history.length - 1 && <span className="mt-1 w-px flex-1 bg-brand-border" />}
                    </span>
                    <div className="flex flex-1 flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-brand-ink">{change.status}</p>
                        <p className="text-sm text-brand-muted">{change.reason}</p>
                      </div>
                      <time className="text-sm text-brand-muted">{change.date}</time>
                    </div>
                  </li>
                ))}
              </ol>
            </Card>
          </section>
        </div>
        <div className="flex flex-col gap-5">
          <DataDiriSection />
          <DomisiliSection />
          <PendidikanSection />
          <PendanaanSection />
          <IzinSection />
        </div>
      </div>
    </div>
  );
}

export function ProfileView({ onNavigate }: { onNavigate: (view: "portal" | "profile") => void }) {
  const go = (view: "portal" | "profile") => (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    onNavigate(view);
  };
  return (
    <PortalShell
      logoSrc={logoUrl}
      navItems={[
        { label: "Beranda", href: "#", icon: <IconHome className="size-5" stroke={1.75} />, onClick: go("portal") },
        { label: "Profil", href: "#", icon: <IconIdBadge2 className="size-5" stroke={1.75} />, current: true },
      ]}
      languages={[{ label: "Bahasa Indonesia", current: true }, { label: "English" }]}
      accountItems={[{ label: "Akun", href: "#" }, { label: "Kebijakan Privasi", href: "#" }, { label: "Syarat Layanan", href: "#" }]}
      helpText="Butuh bantuan? Hubungi pengurus komsatmu atau sekretariat PPI Jepang."
      legalItems={[{ label: "Kebijakan Privasi", href: "#" }, { label: "Syarat Layanan", href: "#" }]}
    >
      <ProfileContent />
    </PortalShell>
  );
}

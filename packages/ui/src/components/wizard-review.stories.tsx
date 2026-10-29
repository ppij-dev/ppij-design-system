import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { IconClipboardCheck, IconHome } from "@tabler/icons-react";
import { PortalShell } from "./portal-shell";
import { WizardHeader } from "./wizard-header";
import { WizardFooter } from "./wizard-footer";
import { ReviewPanel } from "./review-panel";
import { Checkbox } from "./checkbox";
import { Label } from "./label";
// @ts-expect-error Static brand asset; the portal supplies its own served copy.
import logoUrl from "../../../../brand/ppij-logo.png";

function Rows({ items }: { items: Array<[string, string]> }) {
  return (
    <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
      {items.map(([label, value]) => (
        <div key={label} className="grid gap-0.5">
          <dt className="text-sm text-brand-muted">{label}</dt>
          <dd className="font-medium text-brand-ink">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * The wizard's final step (Tinjau & Kirim), replicated from
 * Review.tsx: one ReviewPanel per section with the "Edit bagian ini"
 * jump back to that step, then the consent tick and the submit in
 * the WizardFooter. The panels are read-first by construction; this
 * is the same pattern the profile sections mirror.
 */
function WizardReviewDemo() {
  const [consent, setConsent] = React.useState(false);
  return (
    <PortalShell
      logoSrc={logoUrl}
      navItems={[
        { label: "Beranda", href: "#", icon: <IconHome className="size-5" stroke={1.75} />, current: true },
        { label: "Verifikasi", href: "#", icon: <IconClipboardCheck className="size-5" stroke={1.75} /> },
      ]}
      languages={[{ label: "Bahasa Indonesia", current: true }, { label: "English" }]}
      accountItems={[{ label: "Akun", href: "#" }, { label: "Kebijakan Privasi", href: "#" }, { label: "Syarat Layanan", href: "#" }]}
      helpText="Butuh bantuan? Hubungi pengurus komsatmu atau sekretariat PPI Jepang."
      legalItems={[{ label: "Kebijakan Privasi", href: "#" }, { label: "Syarat Layanan", href: "#" }]}
    >
      <div className="grid gap-5 pb-24">
        <WizardHeader
          stepText="Langkah 7 dari 7"
          title="Tinjau & Kirim"
          current={7}
          total={7}
          progressLabel="Progres pendaftaran"
          savingStatus="saved"
          languages={[{ label: "Bahasa Indonesia", current: true }, { label: "English" }]}
          className="-mx-4"
        />
        <div>
          <h1 className="mb-1 text-2xl font-bold text-brand-ink">Tinjau & Kirim</h1>
          <p className="text-sm leading-6 text-brand-muted">Periksa setiap bagian sebelum mengirim pendaftaran.</p>
        </div>
        <ReviewPanel title="Data diri">
          <Rows items={[["Nama lengkap", "I Nyoman Darma Kotama"], ["Jenis kelamin", "Laki-laki"], ["Tanggal lahir", "2 September 1992"], ["Provinsi asal", "Bali"], ["Nomor telepon atau WhatsApp", "+81 90-1234-5678"], ["Minat", "Fotografi, Riset kecerdasan buatan"]]} />
        </ReviewPanel>
        <ReviewPanel title="Domisili di Jepang">
          <Rows items={[["Kode pos", "700-0001"], ["Prefektur", "Okayama"], ["Kota atau kecamatan", "Kita-ku, Kota Okayama"], ["Komsat", "Okayama"]]} />
        </ReviewPanel>
        <ReviewPanel title="Pendidikan">
          <Rows items={[["Institusi", "Okayama University"], ["Jenjang", "S2 (Magister)"], ["Program studi", "Computer Science"], ["Bulan masuk", "April 2025"]]} />
        </ReviewPanel>
        <ReviewPanel title="Pendanaan" incomplete>
          <p className="text-sm text-brand-muted">Sumber pendanaan belum diisi.</p>
        </ReviewPanel>
        <ReviewPanel title="Izin tinggal dan kontak darurat">
          <Rows items={[["Status izin tinggal", "Student"], ["Tanggal kedaluwarsa", "31 Maret 2027"], ["Nama kontak darurat", "Ni Made Rai"], ["Nomor telepon kontak", "+62 812-3456-7890"]]} />
        </ReviewPanel>
        <ReviewPanel title="Kartu pelajar">
          <Rows items={[["Sisi depan", "Tersimpan"], ["Sisi belakang", "Belum diunggah (opsional)"]]} />
        </ReviewPanel>
        <div className="flex items-start gap-2.5">
          <Checkbox id="wizard-consent" checked={consent} onCheckedChange={(v) => setConsent(v === true)} />
          <Label htmlFor="wizard-consent" className="leading-6 font-normal">
            Saya menyetujui pemrosesan data keanggotaan saya sesuai Kebijakan Privasi PPI Jepang. *
          </Label>
        </div>
      </div>
      <WizardFooter onBack={() => {}} onContinue={() => {}} continueLabel="Kirim Pendaftaran" showArrow={false} continueDisabled={!consent} />
    </PortalShell>
  );
}

const meta: Meta = { title: "Wizard/ReviewPage", parameters: { layout: "fullscreen" } };
export default meta;
type Story = StoryObj;
export const StepSevenReview: Story = { render: () => <WizardReviewDemo /> };

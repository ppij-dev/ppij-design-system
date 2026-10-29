import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { IconClipboardCheck, IconHome } from "@tabler/icons-react";
import { PortalShell } from "./portal-shell";
import { WizardHeader } from "./wizard-header";
import { WizardFooter } from "./wizard-footer";
import { FormPanel } from "./form-panel";
import { Input } from "./input";
import { Label } from "./label";
import { PillRadio } from "./pill-radio";
import { TypeAhead } from "./type-ahead";
import { PhoneField } from "./phone-field";
import { TagInput } from "./tag-input";
// @ts-expect-error Static brand asset; the portal supplies its own served copy.
import logoUrl from "../../../../brand/ppij-logo.png";

/**
 * The registration wizard page (step 1, Data diri), replicated from
 * ppij-identity-sso Wizard.tsx and steps.tsx with the Wizard section
 * components: the page lives in PortalShell, the sticky WizardHeader
 * carries the counter, saving state, language menu, and segmented
 * progress, the step sits in a FormPanel, and the WizardFooter pins
 * the navigation. The wizard itself is the design reference; this
 * story is where the design system records it. Shared fields
 * (TypeAhead, TagInput, PhoneField, Input) come from Portal.
 */
function WizardPageDemo() {
  const [gender, setGender] = React.useState("laki-laki");
  const [province, setProvince] = React.useState("Bali");
  const [phone, setPhone] = React.useState("+81 90-1234-5678");
  const [minat, setMinat] = React.useState(["Fotografi", "Riset kecerdasan buatan"]);
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
      <div className="pb-24">
        <WizardHeader
          stepText="Langkah 1 dari 7"
          title="Data Diri"
          current={1}
          total={7}
          progressLabel="Progres pendaftaran"
          savingStatus="saved"
          languages={[{ label: "Bahasa Indonesia", current: true }, { label: "English" }]}
          className="-mx-4"
        />
        <h1 className="mt-6 mb-1 text-2xl font-bold text-brand-ink">Pendaftaran anggota</h1>
        <p className="mb-6 text-sm leading-6 text-brand-muted">Kolom bertanda * wajib diisi.</p>
        <FormPanel title="Data diri" titleAs="h2" className="mt-2">
          <div className="grid gap-4">
            <div className="grid gap-1.5">
              <Label>Nama lengkap *</Label>
              <Input defaultValue="I Nyoman Darma Kotama" />
              <p className="text-sm text-brand-muted">Tulis sesuai paspor, contoh: BUDI SANTOSO</p>
            </div>
            <div className="grid gap-1.5">
              <Label>Jenis kelamin *</Label>
              <PillRadio ariaLabel="Jenis kelamin" value={gender} onChange={setGender} options={[{ value: "laki-laki", label: "Laki-laki" }, { value: "perempuan", label: "Perempuan" }]} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label>Tanggal lahir *</Label>
                <Input type="date" defaultValue="1992-09-02" />
              </div>
              <div className="grid gap-1.5">
                <Label>Provinsi asal di Indonesia *</Label>
                <TypeAhead value={province} onChange={setProvince} options={["Bali", "Jawa Timur", "Jawa Barat", "DKI Jakarta", "Sulawesi Selatan"]} placeholder="Ketik provinsi atau kabupaten/kota" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label>Nomor telepon atau WhatsApp *</Label>
                <PhoneField value={phone} onChange={setPhone} defaultCode="+81" />
              </div>
              <div className="grid gap-1.5">
                <Label>Nama panggilan</Label>
                <Input defaultValue="Darma" />
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label>LINE ID</Label>
              <Input defaultValue="darmakotama" />
            </div>
            <div className="grid gap-1.5">
              <Label>Minat</Label>
              <TagInput values={minat} onChange={setMinat} suggestions={["Musik", "Olahraga", "Kuliner", "Teknologi", "Bahasa Jepang"]} placeholder="Cari atau ketik minat" />
            </div>
          </div>
        </FormPanel>
      </div>
      <WizardFooter onBack={() => {}} onContinue={() => {}} backDisabled />
    </PortalShell>
  );
}

const meta: Meta = { title: "Wizard/WizardPage", parameters: { layout: "fullscreen" } };
export default meta;
type Story = StoryObj;
export const StepOneDataDiri: Story = { render: () => <WizardPageDemo /> };

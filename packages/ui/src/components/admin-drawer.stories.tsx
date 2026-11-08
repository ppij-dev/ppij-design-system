import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { AdminDrawer, type AdminDrawerProps } from "./admin-drawer";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";

const meta: Meta<typeof AdminDrawer> = {
  title: "Admin/AdminDrawer",
  component: AdminDrawer,
  argTypes: { size: { control: "select", options: ["sm", "md", "lg"] }, density: { control: "select", options: ["compact", "default"] } },
};
export default meta;
type Story = StoryObj<typeof AdminDrawer>;

function Demo() {
  const [open, setOpen] = React.useState(false);
  const [step, setStep] = React.useState<1 | 2>(1);
  return (
    <div>
      <Button onClick={() => { setStep(1); setOpen(true); }}>Tinjau anggota</Button>
      <AdminDrawer
        open={open}
        onOpenChange={setOpen}
        title="Tinjau anggota"
        description="Periksa berkas, lalu lanjutkan ke konfirmasi."
        locale="id"
        step={step}
        onBack={() => setStep(1)}
        footer={
          step === 1
            ? <Button onClick={() => setStep(2)}>Lanjutkan</Button>
            : <Button onClick={() => setOpen(false)}>Konfirmasi setujui</Button>
        }
      >
        {step === 1 ? (
          <div style={{ display: "grid", gap: 10 }}>
            <div style={{ display: "grid", gap: 6 }}><Label>Nama</Label><Input defaultValue="I Nyoman Darma Kotama" readOnly /></div>
            <div style={{ display: "grid", gap: 6 }}><Label>Komsat</Label><Input defaultValue="Okayama" readOnly /></div>
          </div>
        ) : (
          <p>Setujui pendaftaran anggota ini? Status berubah menjadi aktif dan kartu anggota diterbitkan.</p>
        )}
      </AdminDrawer>
    </div>
  );
}
export const TwoStepReview: Story = { render: () => <Demo /> };

function InvitationDemo({ size = "sm", density = "compact" }: Pick<AdminDrawerProps, "size" | "density">) {
  const [open, setOpen] = React.useState(true);
  const id = React.useId();
  const compact = density === "compact";
  return <>
    <Button size="sm" onClick={() => setOpen(true)}>Undang anggota</Button>
    <AdminDrawer open={open} onOpenChange={setOpen} title="Undang anggota"
      description="Langkah 1 dari 2 · Isi penerima" locale="id" size={size} density={density}
      footer={<Button size={compact ? "sm" : "default"} className="max-[600px]:min-h-11" onClick={() => setOpen(false)}>Periksa undangan</Button>}>
      <div className={compact ? "grid gap-4" : "grid gap-5 text-sm"}>
        <p>Masukkan nama dan email penerima. Semua data di sini adalah contoh.</p>
        <div className="grid gap-1.5">
          <Label htmlFor={`${id}-name`} className={compact ? "text-xs" : undefined}>Nama lengkap</Label>
          <Input id={`${id}-name`} placeholder="Nama calon anggota" className={compact ? "min-[900px]:h-8 min-[900px]:text-[13px] max-[600px]:h-11 max-[600px]:text-base" : undefined} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor={`${id}-email`} className={compact ? "text-xs" : undefined}>Email</Label>
          <Input id={`${id}-email`} type="email" placeholder="nama@example.invalid" className={compact ? "min-[900px]:h-8 min-[900px]:text-[13px] max-[600px]:h-11 max-[600px]:text-base" : undefined} />
        </div>
      </div>
    </AdminDrawer>
  </>;
}

export const CompactInvitation: Story = {
  args: { size: "sm", density: "compact" },
  parameters: { docs: { description: { story: "Compact admin form: 380px desktop width, 13px body, 14px title, 12px labels, 32px controls. Below 900px it docks as a full-width bottom sheet; below 600px controls grow to 44px touch targets with 16px inputs." } } },
  render: (args) => <InvitationDemo size={args.size} density={args.density} />,
};
export const DefaultInvitation: Story = {
  args: { size: "md", density: "default" },
  parameters: { docs: { description: { story: "Existing 440px drawer with 16px title and standard spacing." } } },
  render: (args) => <InvitationDemo size={args.size} density={args.density} />,
};
export const WideInvitation: Story = {
  args: { size: "lg", density: "default" },
  parameters: { docs: { description: { story: "560px desktop drawer for detailed review. Bottom sheets remain full width." } } },
  render: (args) => <InvitationDemo size={args.size} density={args.density} />,
};

/** The close control is the drawer's only always-present action, so it carries the touch band. */
function CloseTargetDemo({ density = "compact", closeLabel }: Pick<AdminDrawerProps, "density"> & { closeLabel?: string }) {
  const [open, setOpen] = React.useState(true);
  return <>
    <Button size="sm" onClick={() => setOpen(true)}>Buka panel</Button>
    <AdminDrawer open={open} onOpenChange={setOpen} title="Ubah cakupan anggota" description="Panel pengelolaan anggota." locale="id" size="sm" density={density} closeLabel={closeLabel}
      footer={<Button size="sm" onClick={() => setOpen(false)}>Simpan</Button>}>
      <p>Tombol tutup di kanan atas adalah target sentuh panel ini; ukurannya 44×44 di bawah 600px.</p>
    </AdminDrawer>
  </>;
}

export const CompactPhoneClose: Story = {
  args: { density: "compact" },
  parameters: {
    docs: { description: { story: "Compact phone bottom sheet (390×844). The close control is 44×44 — `max-[600px]:size-11` overrides the 36px `icon` size — and it keeps its Perbarui/Tutup accessible name from the locale label, with the standard 3px focus ring." } },
  },
  render: () => <CloseTargetDemo density="compact" />,
};

export const CompactDesktopClose: Story = {
  args: { density: "compact" },
  parameters: {
    docs: { description: { story: "Compact desktop panel (1440×900). From 600px up the close control keeps the compact `icon-sm` size (32px), the existing compact drawer behaviour; only the phone sheet grows." } },
  },
  render: () => <CloseTargetDemo density="compact" />,
};

export const DefaultDensityClose: Story = {
  args: { density: "default" },
  parameters: {
    docs: { description: { story: "Default density at 1440×900: the close control stays the 36px `icon` size from 600px up, which is the pre-0.4.0 desktop behaviour." } },
  },
  render: () => <CloseTargetDemo density="default" />,
};

export const CloseLabelOverride: Story = {
  args: { density: "compact" },
  parameters: {
    docs: { description: { story: "`closeLabel` replaces the locale string and the accessible name follows it; the 44×44 phone target is unchanged." } },
  },
  render: () => <CloseTargetDemo density="compact" closeLabel="Tutup panel" />,
};

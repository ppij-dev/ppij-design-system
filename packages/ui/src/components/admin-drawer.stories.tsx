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
      footer={<Button size={compact ? "sm" : "default"} className="max-[899px]:min-h-11" onClick={() => setOpen(false)}>Periksa undangan</Button>}>
      <div className={compact ? "grid gap-4" : "grid gap-5 text-sm"}>
        <p>Masukkan nama dan email penerima. Semua data di sini adalah contoh.</p>
        <div className="grid gap-1.5">
          <Label htmlFor={`${id}-name`} className={compact ? "text-xs" : undefined}>Nama lengkap</Label>
          <Input id={`${id}-name`} placeholder="Nama calon anggota" className={compact ? "min-[900px]:h-8 min-[900px]:text-[13px] max-[899px]:h-11 max-[899px]:text-base" : undefined} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor={`${id}-email`} className={compact ? "text-xs" : undefined}>Email</Label>
          <Input id={`${id}-email`} type="email" placeholder="nama@example.invalid" className={compact ? "min-[900px]:h-8 min-[900px]:text-[13px] max-[899px]:h-11 max-[899px]:text-base" : undefined} />
        </div>
      </div>
    </AdminDrawer>
  </>;
}

export const CompactInvitation: Story = {
  args: { size: "sm", density: "compact" },
  parameters: { docs: { description: { story: "Compact admin form: 380px desktop width, 13px body, 14px title, 12px labels, 32px controls. Below 900px, a full-width bottom sheet keeps 44px controls and 16px inputs." } } },
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

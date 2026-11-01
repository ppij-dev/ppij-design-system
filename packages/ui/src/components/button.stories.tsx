import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";
import { IconPlus, IconSend, IconLoader2 } from "@tabler/icons-react";

const meta: Meta<typeof Button> = {
  title: "Portal/Button",
  component: Button,
  args: { children: "Simpan" },
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {};
export const Variants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};
export const Sizes: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <Button size="xs">Ekstra kecil</Button>
        <Button size="sm">Kecil</Button>
        <Button>Bawaan</Button>
        <Button size="lg">Besar</Button>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <Button size="icon-xs" aria-label="Tambah (ikon ekstra kecil)"><IconPlus size={14} /></Button>
        <Button size="icon-sm" aria-label="Tambah (ikon kecil)"><IconPlus size={16} /></Button>
        <Button size="icon" aria-label="Tambah (ikon)"><IconPlus size={18} /></Button>
        <Button size="icon-lg" aria-label="Tambah (ikon besar)"><IconPlus size={20} /></Button>
      </div>
      <p style={{ margin: 0, maxWidth: "65ch", color: "var(--color-muted-foreground)", fontSize: 14, lineHeight: 1.6 }}>
        Declared sizes: xs 24px, sm 32px, default 36px, lg 40px, plus matching icon
        sizes. On phone screens prefer sm or default; xs is for dense desktop tables.
      </p>
    </div>
  ),
};

export const Loading: Story = { args: { disabled: true, children: "Menyimpan..." } };
export const Disabled: Story = { args: { disabled: true } };
export const LongText: Story = {
  args: { children: "Kirim pendaftaran dan lanjutkan ke langkah berikutnya" },
};

export const ActionIntents: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 20 }}>
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        <div style={{ display: "grid", gap: 8, justifyItems: "start" }}>
          <Button>Simpan</Button>
          <span style={{ fontSize: 13, color: "var(--color-muted-foreground)" }}>Normal: the standard action (default)</span>
        </div>
        <div style={{ display: "grid", gap: 8, justifyItems: "start" }}>
          <Button variant="success">Setujui</Button>
          <span style={{ fontSize: 13, color: "var(--color-muted-foreground)" }}>Confirm: approve or complete (success)</span>
        </div>
        <div style={{ display: "grid", gap: 8, justifyItems: "start" }}>
          <Button variant="warning">Arsipkan</Button>
          <span style={{ fontSize: 13, color: "var(--color-muted-foreground)" }}>Alert: consequential, needs care (warning)</span>
        </div>
        <div style={{ display: "grid", gap: 8, justifyItems: "start" }}>
          <Button variant="destructive">Hapus</Button>
          <span style={{ fontSize: 13, color: "var(--color-muted-foreground)" }}>Danger: destructive, always confirmed (destructive)</span>
        </div>
      </div>
      <p style={{ margin: 0, maxWidth: "65ch", color: "var(--color-muted-foreground)", fontSize: 14, lineHeight: 1.6 }}>
        One surface carries one primary intent. Danger actions are never the
        default button on a surface; they sit apart and open an AlertDialog
        that names the action in full before anything happens.
      </p>
    </div>
  ),
};

export const AdminPageActions: Story = {
  render: () => <div className="grid gap-6">
    <div className="grid justify-items-start gap-2"><Button size="sm"><IconPlus />Undang anggota</Button><p className="text-sm text-muted-foreground">Desktop page action: 32px height, 14px label, 16px icon.</p></div>
    <div className="grid max-w-sm gap-2"><Button size="sm" className="min-h-11"><IconPlus />Undang anggota</Button><p className="text-sm text-muted-foreground">Phone action: 44px touch target with the same label and icon scale.</p></div>
  </div>,
};

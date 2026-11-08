import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";

const meta: Meta<typeof Input> = { title: "Portal/Input", component: Input };
export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = { args: { placeholder: "Nama lengkap" } };
export const WithLabel: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 6, maxWidth: 320 }}>
      <Label htmlFor="nama">Nama lengkap</Label>
      <Input id="nama" placeholder="Nama sesuai KTP" />
    </div>
  ),
};
export const Disabled: Story = { args: { placeholder: "Tidak dapat diubah", disabled: true } };
export const ErrorState: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 6, maxWidth: 320 }}>
      <Label htmlFor="email">Email</Label>
      <Input id="email" aria-invalid defaultValue="bukan-email" />
      <p style={{ fontSize: 12, color: "#c8102e", margin: 0 }}>Format email tidak valid.</p>
    </div>
  ),
};
export const LongValue: Story = { args: { defaultValue: "I Nyoman Darma Kotama, Politeknik Negeri Bali, Okayama University" } };

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 12, maxWidth: 420 }}>
      <Input data-size="sm" placeholder="Kecil (32px)" />
      <Input placeholder="Bawaan (36px)" />
      <Input data-size="lg" placeholder="Besar (44px)" />
    </div>
  ),
};

export const PageToolbar: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Button size="sm" variant="outline">Filter</Button>
      <Input data-size="sm" textSize="compact" placeholder="Cari nama, institusi, no. anggota" className="w-64" />
      <p className="w-full text-xs text-muted-foreground">Page toolbar rule: pair compact h-8 inputs (data-size sm) with Button size sm — 32px height, 14px label, 16px icon. 44px touch targets and 16px inputs apply only below 600px.</p>
    </div>
  ),
};

export const CompactText: Story = {
  args: { textSize: "compact" },
  parameters: {
    docs: { description: { story: "`textSize=\"compact\"` renders 13px text from 600px up, so an admin toolbar field needs no local `font-size: 13px` override. Pair it with `data-size=\"sm\"` for the 32px field: the input below is 32px tall with 13px text, matching Button size sm beside it." } },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Button size="sm" variant="outline">Filter</Button>
      <Input data-size="sm" textSize="compact" defaultValue="PPIJ-2026-000123" className="w-64" readOnly />
      <p className="w-full text-xs text-muted-foreground">Compact field: 32px at 600px and wider, 13px text.</p>
    </div>
  ),
};

export const CompactTextPhone: Story = {
  args: { textSize: "compact" },
  parameters: {
    docs: { description: { story: "Below 600px the compact field keeps the editable minimum: 16px text (no iOS zoom on focus) and a 44px touch target, even though `data-size=\"sm\"` asks for 32px. `textSize` never lowers the phone band." } },
  },
  render: () => (
    <div className="grid gap-4">
      <Input data-size="sm" textSize="compact" placeholder="Cari nama anggota" />
      <Input data-size="sm" placeholder="Padanan tanpa textSize, untuk perbandingan" />
    </div>
  ),
};

export const CompactInvalid: Story = {
  args: { textSize: "compact" },
  parameters: {
    docs: { description: { story: "`aria-invalid` styling is unchanged by the compact text size: the destructive border and ring still apply." } },
  },
  render: () => (
    <div className="grid gap-2" style={{ maxWidth: 320 }}>
      <Label htmlFor="compact-email">Email</Label>
      <Input id="compact-email" data-size="sm" textSize="compact" aria-invalid defaultValue="bukan-email" aria-describedby="compact-email-error" />
      <p id="compact-email-error" className="text-xs text-destructive">Format email tidak valid.</p>
    </div>
  ),
};

export const OnAnySurface: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12, padding: 16, display: "grid", gap: 6 }}>
        <Label>Di atas kartu putih</Label>
        <Input placeholder="Bidang selalu putih" />
      </div>
      <div style={{ background: "var(--color-brand-cream)", borderRadius: 12, padding: 16, display: "grid", gap: 6 }}>
        <Label>Di atas latar merek</Label>
        <Input placeholder="Bidang selalu putih" />
      </div>
    </div>
  ),
};

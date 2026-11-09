import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";
import { FormField, FormGrid } from "./form-grid";
import { Input } from "./input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { Textarea } from "./textarea";

const meta: Meta<typeof FormGrid> = {
  title: "Admin/FormGrid",
  component: FormGrid,
  argTypes: {
    columns: { control: "select", options: [1, 2] },
    className: { control: "text" },
    children: { control: false },
  },
};
export default meta;
type Story = StoryObj<typeof FormGrid>;

function UnitSelect({ id }: { id: string }) {
  return (
    <Select defaultValue="okayama">
      <SelectTrigger id={id} className="w-full">
        <SelectValue placeholder="Pilih komsat" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="okayama">Okayama</SelectItem>
        <SelectItem value="tokyo">Tokyo</SelectItem>
        <SelectItem value="yokohama">Yokohama</SelectItem>
      </SelectContent>
    </Select>
  );
}

export const TwoColumns: Story = {
  args: { columns: 2 },
  parameters: {
    docs: {
      description: {
        story: "Two columns with a wide row. From 600px up the fields are 32px tall (the page toolbar rule); below 600px the grid collapses to one column and every control reaches the 44px touch floor with 16px text.",
      },
    },
  },
  render: (args) => (
    <div className="max-w-2xl">
      <FormGrid {...args}>
        <FormField label="Nama lengkap"><Input placeholder="Nama sesuai KTP" /></FormField>
        <FormField label="Nama panggilan"><Input placeholder="Nama yang dipakai sehari-hari" /></FormField>
        <FormField label="Komsat"><UnitSelect id="komsat" /></FormField>
        <FormField label="Korda"><Input placeholder="PPI Kansai" /></FormField>
        <FormField label="Alamat di Jepang" wide hint="Termasuk kode pos dan nama asrama."><Input placeholder="1-1-1 Tsushima-naka, Kita-ku" /></FormField>
      </FormGrid>
    </div>
  ),
};

export const OneColumn: Story = {
  args: { columns: 1 },
  render: (args) => (
    <div className="max-w-md">
      <FormGrid {...args}>
        <FormField label="Alasan penangguhan" hint="Minimal 4 karakter."><Textarea rows={3} placeholder="Contoh: menunggu klarifikasi pembayaran" /></FormField>
        <FormField label="Berlaku sampai"><Input type="month" defaultValue="2027-10" /></FormField>
      </FormGrid>
    </div>
  ),
};

export const WithHint: Story = {
  render: () => (
    <div className="max-w-2xl">
      <FormGrid>
        <FormField label="Nomor anggota" hint="Dibuat otomatis setelah keanggotaan aktif."><Input defaultValue="PPIJ-2026-000123" readOnly /></FormField>
        <FormField label="Email korespondensi" hint="Gunakan alamat yang masih aktif."><Input type="email" placeholder="nama@example.invalid" /></FormField>
      </FormGrid>
    </div>
  ),
};

export const WithError: Story = {
  parameters: {
    docs: {
      description: {
        story: "The error message carries `role=\"alert\"` and the field marks its control with `aria-invalid` and `aria-describedby` pointing at that message. A prop the caller sets on the control wins, so an app that owns its error ids keeps them.",
      },
    },
  },
  render: () => (
    <div className="max-w-2xl">
      <FormGrid>
        <FormField label="Email korespondensi" error="Format email tidak valid."><Input type="email" defaultValue="bukan-email" /></FormField>
        <FormField label="Bidang lain"><Input placeholder="Tidak ada kesalahan" /></FormField>
      </FormGrid>
    </div>
  ),
};

export const PhoneSingleColumn: Story = {
  parameters: { docs: { description: { story: "Reviewed at 390 and 320px: one column, 44px controls, 16px text, and the hint stays under its own field." } } },
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <FormGrid>
        <FormField label="Nama lengkap" hint="Nama sesuai KTP."><Input placeholder="Nama sesuai KTP" /></FormField>
        <FormField label="Komsat"><UnitSelect id="komsat-phone" /></FormField>
      </FormGrid>
    </div>
  ),
};

export const MemberEditForm: Story = {
  parameters: {
    docs: {
      description: {
        story: "The member edit drawer's form shape: `.member-edit-grid` at 16px 14px gap, with the two-digit field group and the category override fieldset composed without `FormField` because a fieldset is not a labelable element.",
      },
    },
  },
  render: () => (
    <div className="max-w-2xl">
      <FormGrid>
        <FormField label="Nama lengkap"><Input defaultValue="I Nyoman Darma Kotama" /></FormField>
        <FormField label="Nama panggilan"><Input defaultValue="Darma" /></FormField>
        <FormField label="Institusi"><Input defaultValue="Politeknik Negeri Bali" /></FormField>
        <FormField label="Fakultas"><Input defaultValue="Teknik Elektro" /></FormField>
        <FormField label="Tinggal dari"><Input type="month" defaultValue="2024-04" /></FormField>
        <FormField label="Tinggal sampai"><Input type="month" defaultValue="2028-03" /></FormField>
        <div className="col-span-full grid gap-1.5">
          <fieldset className="flex gap-4 border-0 p-0">
            <legend className="mb-2 text-xs font-semibold text-brand-muted">Kategori anggota</legend>
            <label className="flex items-center gap-2 text-[13px]"><input type="radio" name="kategori" defaultChecked className="accent-brand-red" />Anggota Biasa</label>
            <label className="flex items-center gap-2 text-[13px]"><input type="radio" name="kategori" className="accent-brand-red" />Anggota Luar Biasa</label>
          </fieldset>
        </div>
        <div className="col-span-full flex flex-wrap justify-end gap-2">
          <Button type="button" variant="outline" size="sm">Batal</Button>
          <Button type="button" size="sm">Simpan perubahan</Button>
        </div>
      </FormGrid>
    </div>
  ),
};

export const Playground: Story = {
  args: { columns: 2 },
  render: (args) => (
    <div className="max-w-2xl">
      <FormGrid {...args}>
        <FormField label="Nama lengkap" hint="Nama sesuai KTP."><Input placeholder="Nama sesuai KTP" /></FormField>
        <FormField label="Komsat"><UnitSelect id="komsat-playground" /></FormField>
        <FormField label="Nama panggilan"><Input placeholder="Nama yang dipakai sehari-hari" /></FormField>
        <FormField label="Alamat di Jepang" wide hint="Termasuk kode pos dan nama asrama."><Input placeholder="1-1-1 Tsushima-naka, Kita-ku" /></FormField>
      </FormGrid>
    </div>
  ),
};

import type { Meta, StoryObj } from "@storybook/react";
import { IconAlertTriangle, IconChartDots3, IconUsers } from "@tabler/icons-react";
import { Badge } from "./badge";
import { Button } from "./button";
import { ListRow } from "./list-row";
import { PanelCard } from "./panel-card";

const meta: Meta<typeof PanelCard> = {
  title: "Admin/PanelCard",
  component: PanelCard,
  argTypes: {
    padding: { control: "select", options: ["panel", "page", "none"] },
    density: { control: "select", options: ["default", "compact"] },
    headingLevel: { control: "select", options: [2, 3, 4, 5, 6] },
  },
};
export default meta;
type Story = StoryObj<typeof PanelCard>;

export const Default: Story = {
  args: {
    title: "Perlu tindakan",
    description: "Antrean verifikasi dan undangan yang menunggu.",
  },
  render: (args) => (
    <PanelCard {...args} className="max-w-2xl">
      <p className="text-[13px] text-brand-muted">Isi panel masuk di sini.</p>
    </PanelCard>
  ),
};

export const WithAction: Story = {
  args: { title: "Aktivitas bulan ini", description: "Pendaftaran per bulan, enam bulan terakhir." },
  parameters: {
    docs: {
      description: {
        story: "The header action is a real control the caller supplies. Below 600px the component raises it to the 44px touch floor; from 600px up the caller's Button size sm (32px) is the page toolbar rule.",
      },
    },
  },
  render: (args) => (
    <PanelCard {...args} action={<Button size="sm" variant="outline">Unduh CSV</Button>} className="max-w-2xl">
      <p className="text-[13px] text-brand-muted">Grafik tren bulanan masuk di sini.</p>
    </PanelCard>
  ),
};

export const WithBadgeAndIcon: Story = {
  args: { title: "Data pendaftaran", description: "Diurutkan seperti langkah registrasi anggota." },
  render: (args) => (
    <PanelCard
      {...args}
      headingLevel={3}
      icon={<IconUsers stroke={1.75} />}
      badge={<Badge variant="secondary">12 bidang</Badge>}
      className="max-w-2xl"
    >
      <p className="text-[13px] text-brand-muted">Grup bidang masuk di sini. Judulnya h3 di dalam halaman yang sudah punya h1 dan h2.</p>
    </PanelCard>
  ),
};

export const PagePadding: Story = {
  args: { title: "Tinjau pendaftaran", description: "Pulau putih selebar halaman: 28px di desktop, 20px di tablet, 16px di ponsel.", padding: "page" },
  render: (args) => (
    <PanelCard {...args} action={<Button size="sm" variant="outline">Ambil alih</Button>}>
      <p className="text-[13px] text-brand-muted">Badan halaman masuk di sini.</p>
    </PanelCard>
  ),
};

export const BodyOnly: Story = {
  args: { padding: "none" },
  parameters: {
    docs: {
      description: {
        story: "A card with no head at all: `title` is optional, so a caller can use `PanelCard` for the island alone, for example a list card whose rows carry their own headings.",
      },
    },
  },
  render: () => (
    <PanelCard padding="none" className="max-w-2xl">
      <ListRow title="Budi Santoso" subtitle="Menunggu verifikasi komsat" meta="2 Nov 2026" onSelect={() => undefined} />
      <ListRow title="Sari Dewi" subtitle="Berkas perlu diperbaiki" meta="1 Nov 2026" onSelect={() => undefined} />
    </PanelCard>
  ),
};

export const CompactDensity: Story = {
  args: { title: "Ringkasan cakupan", description: "Densitas admin: judul 14px, deskripsi 12px, padding 16px.", density: "compact" },
  render: (args) => (
    <div className="grid max-w-3xl gap-3 min-[900px]:grid-cols-2">
      <PanelCard {...args} icon={<IconChartDots3 stroke={1.75} />} action={<Button size="sm" variant="ghost">Buka</Button>}>
        <p className="text-[13px] text-brand-muted">Badan panel ikut mengecil ke 13px.</p>
      </PanelCard>
      <PanelCard {...args} title="Ringkasan klaim" icon={<IconAlertTriangle stroke={1.75} />}>
        <p className="text-[13px] text-brand-muted">Panel kedua dengan judul panjang untuk melihat pembungkusan baris.</p>
      </PanelCard>
    </div>
  ),
};

export const NarrowLongTitle: Story = {
  args: {
    title: "Pendaftaran anggota dengan riwayat verifikasi panjang dan catatan perbaikan yang belum selesai",
    description: "Pada 320px judul dan deskripsi membungkus tanpa memotong aksi kepala.",
  },
  parameters: {
    docs: { description: { story: "Reviewed at 320px: the head wraps, the title never truncates and the header action stays reachable." } },
  },
  render: (args) => (
    <div style={{ maxWidth: 320 }}>
      <PanelCard {...args} action={<Button size="sm" variant="outline">Periksa</Button>}>
        <p className="text-[13px] text-brand-muted">Badan panel tetap terbaca di lebar tersempit.</p>
      </PanelCard>
    </div>
  ),
};

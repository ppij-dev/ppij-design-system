import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./badge";
import { FactList } from "./fact-list";

const meta: Meta<typeof FactList> = {
  title: "Admin/FactList",
  component: FactList,
  argTypes: {
    items: { control: "object" },
    variant: { control: "select", options: ["rows", "inline", "twoColumn"] },
    total: { control: "object" },
    emptyLabel: { control: "text" },
    className: { control: "text" },
  },
};
export default meta;
type Story = StoryObj<typeof FactList>;

const DRAWER_FACTS = [
  { label: "Nama lengkap", value: "I Nyoman Darma Kotama" },
  { label: "Komsat", value: "Okayama" },
  { label: "Korda", value: "PPI Kansai" },
  { label: "Status", value: <Badge variant="success">Aktif</Badge> },
  { label: "Nomor anggota", value: "PPIJ-2026-000123" },
  { label: "Berlaku sampai", value: "31 Oktober 2027" },
];

export const Rows: Story = {
  args: { items: DRAWER_FACTS, variant: "rows" },
  render: (args) => (
    <div className="max-w-md">
      <FactList {...args} />
    </div>
  ),
};

export const TwoColumn: Story = {
  args: { variant: "twoColumn" },
  parameters: {
    docs: {
      description: {
        story: "The review field groups and the member detail: two columns of term over value, collapsing to one column below 600px without dropping a term. Taken from `.verification-field-group dl` (gap 12px 22px) and `.member-detail dl` (gap 10px).",
      },
    },
  },
  render: () => (
    <div className="max-w-2xl">
      <FactList
        variant="twoColumn"
        items={[
          { label: "Nama sesuai KTP", value: "I Nyoman Darma Kotama" },
          { label: "Nama panggilan", value: "Darma" },
          { label: "Institusi", value: "Politeknik Negeri Bali" },
          { label: "Fakultas", value: "Teknik Elektro" },
          { label: "Tinggal dari", value: "April 2024" },
          { label: "Tinggal sampai", value: "Maret 2028" },
          { label: "Alamat di Jepang", value: "1-1-1 Tsushima-naka, Kita-ku, Okayama 700-8530", span: true },
        ]}
      />
    </div>
  ),
};

export const Inline: Story = {
  args: { variant: "inline" },
  parameters: {
    docs: {
      description: {
        story: "The document facts: the value sits beside its short term, two facts per row from 600px up. Taken from `.verification-document-facts`.",
      },
    },
  },
  render: () => (
    <div className="max-w-2xl">
      <FactList
        variant="inline"
        className="border-t border-brand-border bg-[#fbfcfc] px-4 py-4"
        items={[
          { label: "Nama", value: "I Nyoman Darma Kotama" },
          { label: "Jenjang", value: "D3" },
          { label: "Institusi / Fakultas", value: "Politeknik Negeri Bali / Teknik Elektro", span: true },
          { label: "Tinggal dari / sampai", value: "04/2024 sampai 03/2028", span: true },
        ]}
      />
    </div>
  ),
};

export const WithTotal: Story = {
  parameters: {
    docs: {
      description: {
        story: "The coverage total: `.coverage-list` ends with a total row that names the field it sums.",
      },
    },
  },
  render: () => (
    <div className="max-w-md">
      <FactList
        variant="rows"
        total={{ label: "Total komsat terpetakan", value: "184" }}
        items={[
          { label: "Kansai", value: "42" },
          { label: "Kanto", value: "58" },
          { label: "Kyushu", value: "31" },
          { label: "Belum terpetakan", value: "12", muted: true },
        ]}
      />
    </div>
  ),
};

export const WithBadgeValue: Story = {
  parameters: {
    docs: {
      description: {
        story: "A value can be any node, so a status keeps its own badge beside the term that names it.",
      },
    },
  },
  render: () => (
    <div className="max-w-md">
      <FactList
        variant="rows"
        items={[
          { label: "Status", value: <Badge variant="warning">Menunggu verifikasi</Badge> },
          { label: "Kategori", value: <Badge variant="outline">Anggota Biasa</Badge> },
          { label: "Berkas", value: "6 dari 8 lengkap" },
        ]}
      />
    </div>
  ),
};

export const WithLongValue: Story = {
  parameters: { docs: { description: { story: "Long values wrap inside their own column; the term column never collapses." } } },
  render: () => (
    <div className="max-w-md">
      <FactList
        variant="rows"
        items={[
          { label: "Alamat", value: "1-1-1 Tsushima-naka, Kita-ku, Okayama 700-8530, Jepang (asrama mahasiswa lantai 4)" },
          { label: "Catatan", value: "Berkas kartu pelajar terbaca sebagian; verifikator meminta unggahan ulang sebelum keputusan." },
        ]}
      />
    </div>
  ),
};

export const Empty: Story = {
  args: { items: [], emptyLabel: "Belum ada bidang yang dapat ditampilkan." },
  render: (args) => (
    <div className="max-w-md">
      <FactList {...args} />
    </div>
  ),
};

export const PhoneNarrow: Story = {
  parameters: {
    docs: { description: { story: "Reviewed at 320px: `rows` keeps its 96px term column, both column variants drop to one column." } },
  },
  render: () => (
    <div style={{ maxWidth: 320 }} className="grid gap-5">
      <FactList
        variant="rows"
        items={[
          { label: "Nama", value: "I Nyoman Darma Kotama" },
          { label: "Komsat", value: "Okayama" },
        ]}
      />
      <FactList
        variant="twoColumn"
        items={[
          { label: "Institusi", value: "Politeknik Negeri Bali" },
          { label: "Jenjang", value: "D3" },
        ]}
      />
    </div>
  ),
};

export const Playground: Story = {
  args: {
    items: DRAWER_FACTS,
    variant: "rows",
  },
  render: (args) => (
    <div className="max-w-md">
      <FactList {...args} />
    </div>
  ),
};

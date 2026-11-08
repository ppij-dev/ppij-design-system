import type { Meta, StoryObj } from "@storybook/react";
import { StatStrip } from "./stat-strip";

const meta: Meta<typeof StatStrip> = {
  title: "Admin/StatStrip",
  component: StatStrip,
  argTypes: {
    columns: { control: "select", options: [2, 3, 4, 5, 6] },
    size: { control: "select", options: ["default", "compact"] },
  },
};
export default meta;
type Story = StoryObj<typeof StatStrip>;

const MAP_FOOTER = [
  { value: "43", label: "Komsat" },
  { value: "12", label: "Korda" },
  { value: "1.284", label: "Anggota" },
];

const TOTALS = [
  { value: "1.284", label: "Anggota", hint: "per 2 Nov 2026" },
  { value: "1.032", label: "Aktif" },
  { value: "184", label: "Komsat" },
  { value: "12", label: "Korda" },
  { value: "76%", label: "Kelengkapan berkas" },
];

export const MapFooter: Story = {
  args: { items: MAP_FOOTER, size: "compact", label: "Cakupan peta" },
  parameters: {
    docs: {
      description: {
        story: "The map card footer: a quiet strip inside the map card with a top hairline, 21px values and 12px labels, three columns that stay three on a phone. Taken from `.map-footer`, where the hairline and the 18px phone values were page CSS.",
      },
    },
  },
  render: (args) => (
    <div className="max-w-xl">
      <StatStrip {...args} />
    </div>
  ),
};

export const TwoItems: Story = {
  args: { items: [MAP_FOOTER[0], MAP_FOOTER[2]], columns: 2, size: "compact", label: "Cakupan peta" },
  render: (args) => (
    <div className="max-w-xl">
      <StatStrip {...args} />
    </div>
  ),
};

export const SixItems: Story = {
  args: { items: [...TOTALS, { value: "58", label: "Terverifikasi", hint: "Oktober" }], columns: 6, label: "Total gudang data" },
  parameters: {
    docs: {
      description: {
        story: "The Statistik totals band: the white card surface with 22px values and 11px labels, five columns at 1101px and wider, three at 601-1100px and two on a phone. Taken from `.warehouse-totals`, including its wrap rules: a wrapped row never keeps a trailing hairline.",
      },
    },
  },
  render: (args) => (
    <div className="max-w-5xl">
      <StatStrip {...args} />
    </div>
  ),
};

export const FiveItems: Story = {
  args: { items: TOTALS, columns: 5, label: "Total gudang data" },
  render: (args) => (
    <div className="max-w-5xl">
      <StatStrip {...args} />
    </div>
  ),
};

export const LongLabels: Story = {
  args: {
    items: [
      { value: "1.284", label: "Anggota terdaftar dengan berkas lengkap", hint: "per 2 November 2026" },
      { value: "76%", label: "Kelengkapan berkas wajib", hint: "diperbarui tiap malam" },
      { value: "58", label: "Pendaftaran menunggu verifikasi komsat" },
    ],
    label: "Ringkasan",
  },
  parameters: {
    docs: {
      description: {
        story: "The label wraps rather than truncating, and a value that is a percentage always keeps its label beside it, so the number is never the only carrier of meaning.",
      },
    },
  },
  render: (args) => (
    <div className="max-w-xl">
      <StatStrip {...args} />
    </div>
  ),
};

export const PhoneWrap: Story = {
  args: { items: TOTALS, columns: 5, label: "Total gudang data" },
  parameters: {
    docs: { description: { story: "Reviewed at 390 and 320px: five items wrap to two columns, the values drop to 18px and no row keeps a trailing hairline." } },
  },
  render: (args) => (
    <div className="max-w-5xl">
      <StatStrip {...args} />
    </div>
  ),
};

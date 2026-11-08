import type { Meta, StoryObj } from "@storybook/react";
import { PieChart } from "./pie-chart";

const meta: Meta<typeof PieChart> = {
  title: "Admin/PieChart",
  component: PieChart,
  argTypes: {
    legend: { control: "select", options: ["list", "none"] },
    fallback: { control: "select", options: ["table", "none"] },
    data: { control: "object" },
    size: { control: "number" },
    donut: { control: "boolean" },
    centerLabel: { control: "text" },
    centerValue: { control: "text" },
    maxSlices: { control: "number" },
    formatValue: { control: false },
    ariaLabel: { control: "text" },
    className: { control: "text" },
  },
};
export default meta;
type Story = StoryObj<typeof PieChart>;

const GENDER = [
  { label: "Laki-laki", value: 742 },
  { label: "Perempuan", value: 540 },
];

const MEMBERSHIP = [
  { label: "Anggota Biasa", value: 1104 },
  { label: "Luar Biasa · Mahasiswa", value: 62 },
  { label: "Luar Biasa · Peneliti", value: 28 },
  { label: "Luar Biasa · Lainnya", value: 14 },
];

export const JenisKelamin: Story = {
  parameters: {
    docs: {
      description: {
        story: "The owner's first chart: **Jenis kelamin** on Statistik, from data-in props. Each slice is one SVG path, the legend names every slice with its count and its percentage, and the percentages are rounded to one decimal and forced to sum to 100. Colour is never the only carrier: the label, the count and the percentage are all text.",
      },
    },
  },
  render: () => (
    <div className="max-w-2xl bg-card p-5">
      <PieChart
        data={GENDER}
        ariaLabel="Sebaran jenis kelamin anggota"
        centerLabel="Total"
        formatValue={(value) => value.toLocaleString("id-ID")}
      />
    </div>
  ),
};

export const AnggotaBiasaVsLuarBiasa: Story = {
  parameters: {
    docs: {
      description: {
        story: "The owner's second chart: **Anggota Biasa vs Luar Biasa**. `maxSlices={2}` keeps Anggota Biasa and folds the three Luar Biasa subtypes into one \"Lainnya\" slice, which is the owner's decision; the subtypes stay named in the table the Statistik page carries underneath.",
      },
    },
  },
  render: () => (
    <div className="max-w-2xl bg-card p-5">
      <PieChart data={MEMBERSHIP} maxSlices={2} ariaLabel="Anggota Biasa dan Luar Biasa" />
    </div>
  ),
};

export const DonutWithTotal: Story = {
  parameters: {
    docs: {
      description: {
        story: "A donut with the figure in the middle: the centre states the figure and the legend still carries every slice, so the middle is a convenience and never the only place a number lives.",
      },
    },
  },
  render: () => (
    <div className="max-w-xl bg-card p-5">
      <PieChart
        data={[
          { label: "Lengkap", value: 968 },
          { label: "Belum lengkap", value: 214 },
          { label: "Belum aktivasi", value: 102 },
        ]}
        donut
        centerValue="76%"
        centerLabel="Kelengkapan"
        ariaLabel="Kelengkapan berkas anggota"
      />
    </div>
  ),
};

export const TwoEqualSlices: Story = {
  parameters: { docs: { description: { story: "Two equal slices: the residual correction leaves both at 50% and the geometry matches the printed percentage." } } },
  render: () => (
    <div className="max-w-xl bg-card p-5">
      <PieChart data={[{ label: "Sudah memilih", value: 620 }, { label: "Belum memilih", value: 620 }]} ariaLabel="Partisipasi Pemira" />
    </div>
  ),
};

export const ZeroSliceOmitted: Story = {
  parameters: { docs: { description: { story: "A zero-value slice is dropped instead of drawn as a hairline; a value that is absent must not look like a value that is small." } } },
  render: () => (
    <div className="max-w-xl bg-card p-5">
      <PieChart
        data={[
          { label: "Aktif", value: 1032 },
          { label: "Dicabut", value: 0 },
          { label: "Berakhir", value: 214 },
        ]}
        ariaLabel="Status keanggotaan"
      />
    </div>
  ),
};

export const EightSlicesCollapsed: Story = {
  parameters: {
    docs: {
      description: {
        story: "Eight slices with the default `maxSlices={5}`: the four largest stay and the rest fold into \"Lainnya\" with a combined count, so the legend never grows past the card's width and the total still matches.",
      },
    },
  },
  render: () => (
    <div className="max-w-2xl bg-card p-5">
      <PieChart
        data={[
          { label: "Okayama", value: 214 },
          { label: "Tokyo", value: 402 },
          { label: "Yokohama", value: 188 },
          { label: "Kyoto", value: 96 },
          { label: "Osaka", value: 84 },
          { label: "Nagoya", value: 61 },
          { label: "Fukuoka", value: 48 },
          { label: "Sendai", value: 32 },
        ]}
        ariaLabel="Sebaran anggota per komsat"
      />
    </div>
  ),
};

export const TableFallbackForReview: Story = {
  parameters: {
    docs: {
      description: {
        story: "`fallback=\"table\"` renders the same numbers as a screen-reader `<table>` with a `<caption>` and `<th scope=\"row\">`. It ships visually hidden; this story reveals it with `[&_table]:not-sr-only` so the table can be reviewed against the chart beside it.",
      },
    },
  },
  render: () => (
    <div className="grid max-w-2xl gap-4 bg-card p-5">
      <PieChart data={GENDER} fallback="table" ariaLabel="Sebaran jenis kelamin anggota" className="[&_table]:not-sr-only [&_table]:w-full [&_table]:border-collapse [&_table]:text-[13px] [&_th]:py-1 [&_th]:text-left [&_td]:py-1 [&_td]:text-right" />
    </div>
  ),
};

export const WithoutLegend: Story = {
  parameters: { docs: { description: { story: "`legend=\"none\"` for a chart that is already labelled by its card: the `role=\"img\"` name still summarises every slice." } } },
  render: () => (
    <div className="w-fit bg-card p-5">
      <PieChart data={GENDER} legend="none" size={120} ariaLabel="Sebaran jenis kelamin anggota" />
    </div>
  ),
};

export const DarkSurface: Story = {
  parameters: {
    docs: {
      description: {
        story: "On a dark surface the chart itself does not break: the slices keep their palette and the legend text takes the surface's own colour through `className`, which is what a future dark theme would set. The package ships no dark theme, so nothing else changes.",
      },
    },
  },
  render: () => (
    <div className="max-w-2xl rounded-xl bg-[#1c1f23] p-5 [&_li]:text-white/80 [&_li_span]:text-white/80 [&_li_span:last-child]:text-white/60 [&_ul]:text-white/80">
      <PieChart data={GENDER} ariaLabel="Sebaran jenis kelamin anggota" />
    </div>
  ),
};

export const Phone: Story = {
  parameters: { docs: { description: { story: "Reviewed at 390 and 320px: the chart keeps its size and the legend wraps under it instead of shrinking the labels." } } },
  render: () => (
    <div style={{ maxWidth: 320 }} className="bg-card p-4">
      <PieChart data={MEMBERSHIP} maxSlices={2} size={140} ariaLabel="Anggota Biasa dan Luar Biasa" />
    </div>
  ),
};

export const NoData: Story = {
  parameters: { docs: { description: { story: "No data: the chart renders an empty ring and the legend says so, instead of a chart that looks like a zero value." } } },
  render: () => (
    <div className="w-fit bg-card p-5">
      <PieChart data={[]} ariaLabel="Belum ada data" />
    </div>
  ),
};

export const Playground: Story = {
  args: {
    data: GENDER,
    size: 168,
    donut: false,
    centerLabel: "Total",
    centerValue: "1.282",
    legend: "list",
    fallback: "none",
    maxSlices: 5,
    ariaLabel: "Sebaran jenis kelamin anggota",
  },
  render: (args) => (
    <div className="max-w-2xl bg-card p-5">
      <PieChart {...args} />
    </div>
  ),
};

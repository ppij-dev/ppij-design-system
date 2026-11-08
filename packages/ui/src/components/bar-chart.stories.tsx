import type { Meta, StoryObj } from "@storybook/react";
import { BarChart } from "./bar-chart";

const meta: Meta<typeof BarChart> = {
  title: "Admin/BarChart",
  component: BarChart,
  argTypes: { orientation: { control: "select", options: ["vertical", "horizontal"] } },
};
export default meta;
type Story = StoryObj<typeof BarChart>;

const MONTHS = [
  { label: "Mei", value: 48 },
  { label: "Jun", value: 62 },
  { label: "Jul", value: 55 },
  { label: "Agu", value: 78 },
  { label: "Sep", value: 91 },
  { label: "Okt", value: 112 },
];

const FACETS = [
  { label: "Teknik", value: 402, hint: "402 anggota" },
  { label: "Sains", value: 268, hint: "268 anggota" },
  { label: "Ekonomi", value: 188 },
  { label: "Bahasa", value: 96 },
  { label: "Seni", value: 61 },
  { label: "Lainnya", value: 48 },
];

export const MonthlyTrend: Story = {
  parameters: {
    docs: {
      description: {
        story: "The dashboard pulse panel: six months, vertical. The value sits above each bar, the month below it, and the whole chart is one `role=\"img\"` whose name lists every bar with its count. The bar tint is the prototype's `#efbbc4`.",
      },
    },
  },
  render: () => (
    <div className="max-w-xl bg-card p-5">
      <BarChart data={MONTHS} height={150} ariaLabel="Pendaftaran per bulan" />
    </div>
  ),
};

export const HighlightLast: Story = {
  parameters: { docs: { description: { story: "The newest bar is brand red and the earlier ones keep the tint, so the eye lands on the current month first." } } },
  render: () => (
    <div className="max-w-xl bg-card p-5">
      <BarChart data={MONTHS} height={150} highlightLast ariaLabel="Pendaftaran per bulan" />
    </div>
  ),
};

export const GridLines: Story = {
  parameters: { docs: { description: { story: "Optional hairlines behind the bars, for a chart read against a scale rather than between neighbours." } } },
  render: () => (
    <div className="max-w-xl bg-card p-5">
      <BarChart data={MONTHS} height={150} gridLines highlightLast ariaLabel="Pendaftaran per bulan" />
    </div>
  ),
};

export const FacetDistribution: Story = {
  parameters: {
    docs: {
      description: {
        story: "The Statistik facet card: horizontal, with the label beside the bar and the count at the end, so no bar needs a colour key and a truncated label still has its value. Taken from `.dist-list` with its `minmax(96px,150px) 1fr 52px` row.",
      },
    },
  },
  render: () => (
    <div className="max-w-xl bg-card p-5">
      <BarChart data={FACETS} orientation="horizontal" ariaLabel="Sebaran bidang studi" />
    </div>
  ),
};

export const SingleBar: Story = {
  parameters: { docs: { description: { story: "One bar: the axis ceiling stays at the value, so a single figure reads as a full bar rather than a sliver." } } },
  render: () => (
    <div className="max-w-xs bg-card p-5">
      <BarChart data={[{ label: "Okt", value: 112 }]} height={120} highlightLast ariaLabel="Pendaftaran Oktober" />
    </div>
  ),
};

export const AllZero: Story = {
  parameters: { docs: { description: { story: "All-zero data: the ceiling falls back to 1, every bar keeps its 4px visible minimum and the labels stay, so an empty month looks empty instead of broken." } } },
  render: () => (
    <div className="max-w-xl bg-card p-5">
      <BarChart data={MONTHS.map((month) => ({ ...month, value: 0 }))} height={150} highlightLast ariaLabel="Pendaftaran per bulan" />
    </div>
  ),
};

export const FourteenRows: Story = {
  parameters: { docs: { description: { story: "Fourteen horizontal rows: the label column stays 96-150px and never shrinks the text below 12px, so a long facet name truncates instead of squeezing the bar." } } },
  render: () => (
    <div className="max-w-xl bg-card p-5">
      <BarChart
        data={[
          "Teknik Sipil", "Teknik Mesin", "Teknik Elektro", "Informatika", "Matematika", "Fisika", "Kimia", "Biologi",
          "Ekonomi", "Manajemen", "Akuntansi", "Sastra Jepang", "Sastra Inggris", "Hubungan Internasional",
        ].map((label, index) => ({ label, value: 402 - index * 26, hint: `${402 - index * 26} anggota` }))}
        orientation="horizontal"
        ariaLabel="Sebaran bidang studi"
      />
    </div>
  ),
};

export const TableFallback: Story = {
  parameters: {
    docs: {
      description: {
        story: "`fallback=\"table\"` adds the same numbers as a screen-reader `<table>` with a `<caption>` and `<th scope=\"row\">`; this story reveals it with `[&_table]:not-sr-only` so it can be checked against the chart.",
      },
    },
  },
  render: () => (
    <div className="max-w-xl bg-card p-5">
      <BarChart
        data={MONTHS}
        height={130}
        fallback="table"
        ariaLabel="Pendaftaran per bulan"
        className="[&_table]:not-sr-only [&_table]:mt-3 [&_table]:w-full [&_table]:text-[13px] [&_th]:py-1 [&_th]:text-left [&_td]:py-1 [&_td]:text-right"
      />
    </div>
  ),
};

export const Phone: Story = {
  parameters: { docs: { description: { story: "Reviewed at 390 and 320px: the six columns keep their labels at 10px, the bars stay visible and the horizontal variant keeps its label column." } } },
  render: () => (
    <div style={{ maxWidth: 320 }} className="grid gap-5 bg-card p-4">
      <BarChart data={MONTHS} height={120} highlightLast ariaLabel="Pendaftaran per bulan" />
      <BarChart data={FACETS.slice(0, 4)} orientation="horizontal" ariaLabel="Sebaran bidang studi" />
    </div>
  ),
};

export const NoData: Story = {
  parameters: { docs: { description: { story: "No data: nothing renders but an empty track, and the accessible name says so." } } },
  render: () => (
    <div className="max-w-xl bg-card p-5">
      <BarChart data={[]} ariaLabel="Belum ada data" />
    </div>
  ),
};

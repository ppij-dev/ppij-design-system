import type { Meta, StoryObj } from "@storybook/react";
import { DistributionBar } from "./distribution-bar";

const meta: Meta<typeof DistributionBar> = {
  title: "Admin/DistributionBar",
  component: DistributionBar,
  argTypes: {
    size: { control: "select", options: ["sm", "md"] },
    legend: { control: "select", options: ["list", "inline", "none"] },
    segments: { control: "object" },
    totalLabel: { control: "text" },
    formatValue: { control: false },
    ariaLabel: { control: "text" },
    className: { control: "text" },
  },
};
export default meta;
type Story = StoryObj<typeof DistributionBar>;

const COMPLETENESS = [
  { label: "Lengkap", value: 968 },
  { label: "Belum lengkap", value: 214 },
  { label: "Belum aktivasi", value: 102 },
];

const DEGREES = [
  { label: "S1", value: 612 },
  { label: "S2", value: 308 },
  { label: "S3", value: 96 },
  { label: "Lainnya", value: 268 },
];

export const CompletenessInline: Story = {
  parameters: {
    docs: {
      description: {
        story: "The dashboard figures band: a three-segment completeness bar with the inline legend, at the 8px `sm` height. The whole bar is one `role=\"img\"` whose name names every segment with its count, each segment carries its own `title`, and the legend is text so colour is never the only carrier.",
      },
    },
  },
  render: () => (
    <div className="w-fit rounded-xl border border-brand-border bg-card p-5">
      <DistributionBar segments={COMPLETENESS} legend="inline" ariaLabel="Kelengkapan berkas" />
    </div>
  ),
};

export const StatistikMd: Story = {
  parameters: {
    docs: {
      description: {
        story: "The Statistik completeness card: the same bar at `md`, with the list legend. The card's own bar was 18px tall, so the story states it with `className=\"h-[18px]\"` rather than adding a third size.",
      },
    },
  },
  render: () => (
    <div className="max-w-xl rounded-xl border border-brand-border bg-card p-5">
      <DistributionBar segments={COMPLETENESS} size="md" legend="list" totalLabel="Total" className="[&>div]:h-[18px]" ariaLabel="Kelengkapan berkas" />
    </div>
  ),
};

export const DegreeComposition: Story = {
  parameters: { docs: { description: { story: "The degree composition with a \"Lainnya\" segment: the palette separates four segments without a colour key, and the inline legend wraps rather than scrolling." } } },
  render: () => (
    <div className="w-fit rounded-xl border border-brand-border bg-card p-5">
      <DistributionBar segments={DEGREES} size="md" legend="inline" ariaLabel="Komposisi jenjang studi" />
    </div>
  ),
};

export const TwoSegments: Story = {
  parameters: { docs: { description: { story: "Two segments: the split stays readable because each legend entry carries its own count." } } },
  render: () => (
    <div className="w-fit rounded-xl border border-brand-border bg-card p-5">
      <DistributionBar segments={[{ label: "Sudah memilih", value: 620 }, { label: "Belum memilih", value: 620 }]} legend="inline" ariaLabel="Partisipasi Pemira" />
    </div>
  ),
};

export const FullOne: Story = {
  parameters: { docs: { description: { story: "One segment at 100%: the track is one full-width segment, and the legend still names it." } } },
  render: () => (
    <div className="w-fit rounded-xl border border-brand-border bg-card p-5">
      <DistributionBar segments={[{ label: "Terverifikasi", value: 1284 }]} legend="inline" ariaLabel="Status verifikasi" />
    </div>
  ),
};

export const ZeroTotal: Story = {
  parameters: { docs: { description: { story: "A zero total: nothing is drawn and no percentage is invented, so an unstarted period does not look like a complete one." } } },
  render: () => (
    <div className="w-fit rounded-xl border border-brand-border bg-card p-5">
      <DistributionBar segments={COMPLETENESS.map((segment) => ({ ...segment, value: 0 }))} legend="inline" ariaLabel="Kelengkapan berkas" />
    </div>
  ),
};

export const ListLegendWithTotal: Story = {
  parameters: { docs: { description: { story: "The list legend with `totalLabel`: the total row sits under its own hairline and is the formatted sum, not a re-typed number." } } },
  render: () => (
    <div className="max-w-xl rounded-xl border border-brand-border bg-card p-5">
      <DistributionBar segments={DEGREES} size="md" legend="list" totalLabel="Total anggota" ariaLabel="Komposisi jenjang studi" />
    </div>
  ),
};

export const WithoutLegend: Story = {
  parameters: { docs: { description: { story: "`legend=\"none\"` for a bar whose card already prints the numbers; the accessible name still lists every segment." } } },
  render: () => (
    <div className="w-64 rounded-xl border border-brand-border bg-card p-5">
      <DistributionBar segments={COMPLETENESS} legend="none" ariaLabel="Kelengkapan berkas" />
    </div>
  ),
};

export const Phone: Story = {
  parameters: { docs: { description: { story: "Reviewed at 390 and 320px: the bar keeps its height, the inline legend wraps to two lines and nothing scrolls sideways." } } },
  render: () => (
    <div style={{ maxWidth: 320 }} className="rounded-xl border border-brand-border bg-card p-4">
      <DistributionBar segments={DEGREES} size="md" legend="inline" ariaLabel="Komposisi jenjang studi" />
    </div>
  ),
};

export const Playground: Story = {
  args: {
    segments: COMPLETENESS,
    size: "md",
    legend: "list",
    totalLabel: "Total",
    ariaLabel: "Kelengkapan berkas",
  },
};

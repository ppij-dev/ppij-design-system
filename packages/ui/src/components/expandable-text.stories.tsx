import type { Meta, StoryObj } from "@storybook/react";
import { ExpandableText } from "./expandable-text";
import { Timeline } from "./timeline";

const meta: Meta<typeof ExpandableText> = {
  title: "Admin/ExpandableText",
  component: ExpandableText,
  argTypes: {
    children: { control: "text" },
    lines: { control: "number" },
    defaultExpanded: { control: "boolean" },
    expandLabel: { control: "text" },
    collapseLabel: { control: "text" },
    className: { control: "text" },
  },
};
export default meta;
type Story = StoryObj<typeof ExpandableText>;

const REVIEW_NOTE =
  "Verifikator meminta perbaikan pada tiga bidang: alamat domisili di Jepang belum memuat kode pos dan nama asrama, kartu pelajar yang diunggah terbaca sebagian pada sisi belakang, dan tanggal selesai studi belum diisi. Kirim ulang setelah ketiganya diperbaiki.";

const SHORT_NOTE = "Berkas lengkap. Tidak ada catatan.";

export const ThreeLineClamp: Story = {
  args: { children: REVIEW_NOTE },
  parameters: {
    docs: {
      description: {
        story: "Three lines, then the toggle. The clamp is CSS (`-webkit-line-clamp`), so the whole text stays in the accessibility tree and stays findable; only text that actually overflows shows the toggle. Taken from `.verification-history-detail.is-clamped` and `.verification-history-toggle`, where the page used a 70-character guess instead of measuring.",
      },
    },
  },
  render: (args) => (
    <div className="max-w-2xl text-[13px] leading-5 text-brand-muted">
      <ExpandableText {...args} />
    </div>
  ),
};

export const ShortText: Story = {
  args: { children: SHORT_NOTE },
  parameters: { docs: { description: { story: "Short text renders with no toggle at all: the component measures the rendered box, so nothing has to be guessed from the string length. Measured: `scrollHeight === clientHeight` and no button in the DOM at any of the four widths." } } },
  render: (args) => (
    <div className="max-w-2xl text-[13px] leading-5 text-brand-muted">
      <ExpandableText {...args} />
    </div>
  ),
};

export const LongText: Story = {
  args: { children: `${REVIEW_NOTE} ${REVIEW_NOTE}` },
  render: (args) => (
    <div className="max-w-2xl text-[13px] leading-5 text-brand-muted">
      <ExpandableText {...args} />
    </div>
  ),
};

export const Expanded: Story = {
  args: { children: REVIEW_NOTE, defaultExpanded: true },
  parameters: { docs: { description: { story: "The expanded state: the clamp is gone, `aria-expanded=\"true\"` and the toggle names the collapse direction. `defaultExpanded` is the uncontrolled starting state for review." } } },
  render: (args) => (
    <div className="max-w-2xl text-[13px] leading-5 text-brand-muted">
      <ExpandableText {...args} />
    </div>
  ),
};

export const FiveLines: Story = {
  args: { children: REVIEW_NOTE, lines: 5 },
  parameters: { docs: { description: { story: "`lines` sets the clamp depth: five lines keep the whole note to one toggle." } } },
  render: (args) => (
    <div className="max-w-2xl text-[13px] leading-5 text-brand-muted">
      <ExpandableText {...args} />
    </div>
  ),
};

export const InsideTimelineItem: Story = {
  parameters: {
    docs: {
      description: {
        story: "The review history pairs a Timeline item with its detail underneath: the item carries the dated title and the component carries the long note. Task C6 gives Timeline the reveal and the node-valued description; until then the page renders this pair.",
      },
    },
  },
  render: () => (
    <div className="max-w-2xl">
      <Timeline
        items={[
          { title: "Pendaftaran dikirim", time: "1 Okt 2026", state: "complete" },
          { title: "Pemeriksaan otomatis selesai", time: "1 Okt 2026", state: "complete" },
          { title: "PPI Okayama meminta perubahan", time: "3 Okt 2026", state: "current" },
        ]}
      />
      <div className="mt-2 ml-9 text-[13px] leading-5 text-brand-muted">
        <ExpandableText>{REVIEW_NOTE}</ExpandableText>
      </div>
    </div>
  ),
};

export const Phone: Story = {
  args: { children: REVIEW_NOTE },
  parameters: { docs: { description: { story: "Reviewed at 390 and 320px: three lines still fit, the toggle is 44px tall and the text never truncates mid-word." } } },
  render: (args) => (
    <div style={{ maxWidth: 320 }} className="text-[13px] leading-5 text-brand-muted">
      <ExpandableText {...args} />
    </div>
  ),
};

export const Playground: Story = {
  args: {
    children: REVIEW_NOTE,
    lines: 3,
    defaultExpanded: false,
    expandLabel: "Lihat selengkapnya",
    collapseLabel: "Tampilkan lebih sedikit",
  },
  render: (args) => (
    <div className="max-w-2xl text-[13px] leading-5 text-brand-muted">
      <ExpandableText {...args} />
    </div>
  ),
};

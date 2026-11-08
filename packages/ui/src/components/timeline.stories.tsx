import type { Meta, StoryObj } from "@storybook/react";
import { ExpandableText } from "./expandable-text";
import { Timeline } from "./timeline";

const meta: Meta<typeof Timeline> = { title: "Portal/Timeline", component: Timeline };
export default meta;
type Story = StoryObj<typeof Timeline>;

export const VerificationJourney: Story = {
  render: () => (
    <div style={{ maxWidth: 440 }}>
      <Timeline
        items={[
          { title: "Pendaftaran terkirim", description: "Formulir dan berkas diterima sistem.", time: "1 Okt 2026, 09.12", state: "complete" },
          { title: "Verifikasi komsat", description: "Komsat Okayama memeriksa domisili dan kampus.", time: "3 Okt 2026, 15.40", state: "complete" },
          { title: "Verifikasi pusat", description: "Pengurus pusat memeriksa berkas akhir.", time: "Sedang berjalan", state: "current" },
          { title: "Kartu anggota diterbitkan", description: "Kartu digital aktif di portal.", state: "upcoming" },
        ]}
      />
    </div>
  ),
};

const HISTORY = [
  { title: "PPI Okayama meminta perubahan", description: "Alamat domisili dan kartu pelajar perlu diperbaiki.", time: "3 Okt 2026, 15.40", state: "current" as const },
  { title: "Pemeriksaan otomatis selesai", description: "Tidak ada temuan.", time: "1 Okt 2026, 09.20", state: "complete" as const },
  { title: "Pendaftaran dikirim", time: "1 Okt 2026, 09.12", state: "complete" as const },
  { title: "Akun dibuat", time: "30 Sep 2026, 20.05", state: "complete" as const },
  { title: "Undangan diterima", time: "28 Sep 2026, 08.00", state: "complete" as const },
];

export const AllItems: Story = {
  parameters: {
    docs: {
      description: {
        story: "No `defaultVisibleCount`: every item renders and no toggle appears, which is the behaviour Timeline shipped with. The review history, the membership history and the invitation timeline all use this shape.",
      },
    },
  },
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <Timeline items={HISTORY} />
    </div>
  ),
};

export const ThreeVisible: Story = {
  args: { defaultVisibleCount: 3 },
  parameters: {
    docs: {
      description: {
        story: "The review history: the three newest events with the rest behind \"Lihat selengkapnya (2 peristiwa)\". The hidden items are not rendered at all, so they leave the accessibility tree, and the label carries the count it hides. Taken from `.verification-history-more`, where the page kept the slice in its own state.",
      },
    },
  },
  render: (args) => (
    <div style={{ maxWidth: 480 }}>
      <Timeline {...args} items={HISTORY} />
    </div>
  ),
};

export const Expanded: Story = {
  args: { defaultVisibleCount: 3, defaultExpanded: true },
  parameters: {
    docs: {
      description: {
        story: "After the toggle: every item renders, the toggle reports `aria-expanded=\"true\"` and names the collapse direction (\"Tampilkan 3 terbaru\"). `onExpandChange` fires on each change for a page that logs or persists it.",
      },
    },
  },
  render: (args) => (
    <div style={{ maxWidth: 480 }}>
      <Timeline
        {...args}
        items={HISTORY}
        onExpandChange={(expanded) => console.log("timeline expanded:", expanded)}
      />
    </div>
  ),
};

export const OneItem: Story = {
  parameters: { docs: { description: { story: "One event: no toggle, no count, and the rail has no segment to draw." } } },
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <Timeline items={[{ title: "Pendaftaran dikirim", time: "1 Okt 2026", state: "complete" }]} defaultVisibleCount={3} />
    </div>
  ),
};

export const StateMix: Story = {
  parameters: { docs: { description: { story: "Complete, current and upcoming in one list: the rail is red up to the current event and neutral after it." } } },
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <Timeline
        items={[
          { title: "Pendaftaran dikirim", time: "1 Okt 2026", state: "complete" },
          { title: "Kartu diterbitkan", time: "5 Okt 2026", state: "complete" },
          { title: "Perpanjangan berikutnya", time: "Sedang berjalan", state: "current" },
          { title: "Kartu masa berikutnya", state: "upcoming" },
        ]}
        defaultVisibleCount={2}
      />
    </div>
  ),
};

export const LongDescriptionInExpandableText: Story = {
  parameters: {
    docs: {
      description: {
        story: "A long note inside an item: `description` takes a node, so the review history composes `ExpandableText` in the timeline instead of keeping its own clamp. B8's story and this one are the same pair seen from each side.",
      },
    },
  },
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <Timeline
        defaultVisibleCount={2}
        items={[
          {
            title: "PPI Okayama meminta perubahan",
            description: (
              <ExpandableText>
                Verifikator meminta perbaikan pada tiga bidang: alamat domisili di Jepang belum memuat kode pos dan nama asrama, kartu pelajar yang diunggah terbaca sebagian pada sisi belakang, dan tanggal selesai studi belum diisi. Kirim ulang setelah ketiganya diperbaiki.
              </ExpandableText>
            ),
            time: "3 Okt 2026, 15.40",
            state: "current",
          },
          { title: "Pemeriksaan otomatis selesai", time: "1 Okt 2026, 09.20", state: "complete" },
          { title: "Pendaftaran dikirim", time: "1 Okt 2026, 09.12", state: "complete" },
        ]}
      />
    </div>
  ),
};

export const Phone: Story = {
  parameters: { docs: { description: { story: "Reviewed at 390 and 320px: the reveal toggle is 44px tall, the label wraps to one line and the rail keeps its 24px marker." } } },
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <Timeline items={HISTORY} defaultVisibleCount={3} />
    </div>
  ),
};

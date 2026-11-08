import type { Meta, StoryObj } from "@storybook/react";
import { DistributionBar } from "./distribution-bar";
import { FiguresBand, FiguresBandSeparator, type FiguresBandGroup } from "./figures-band";

const meta: Meta<typeof FiguresBand> = {
  title: "Admin/FiguresBand",
  component: FiguresBand,
};
export default meta;
type Story = StoryObj<typeof FiguresBand>;

const KOMSAT: FiguresBandGroup[] = [
  { label: "Anggota aktif", value: "214", sub: <>dari 236 terdaftar</>, linkLabel: "Lihat anggota", onSelect: () => undefined },
  { label: "Menunggu verifikasi", value: "12", sub: <>paling lama 3 hari</>, linkLabel: "Buka antrean", onSelect: () => undefined },
  { label: "Profil lengkap", value: "76%", sub: <>180 dari 236 profil</>, linkLabel: "Buka statistik", onSelect: () => undefined },
];

const NATIONAL: FiguresBandGroup[] = [
  { label: "Anggota aktif", value: "1.032", sub: <>dari 1.284 terdaftar</>, linkLabel: "Lihat anggota", onSelect: () => undefined },
  { label: "Menunggu verifikasi", value: "58", sub: <>di 14 komsat</>, linkLabel: "Buka antrean", onSelect: () => undefined },
  { label: "Komsat aktif", value: "184", sub: <>di 12 korda</>, linkLabel: "Buka organisasi", onSelect: () => undefined },
  { label: "Profil lengkap", value: "76%", sub: <>976 dari 1.284 profil</>, linkLabel: "Buka statistik", onSelect: () => undefined },
];

export const KomsatScope: Story = {
  parameters: {
    docs: {
      description: {
        story: "The komsat scope: three groups, so the band renders three columns from 1101px up (the prototype's `data-count=\"3\"`). Each group is one button and its accessible name is its own label, value and sub-line; the visual slot is `aria-hidden` because the sub-line states the same numbers.",
      },
    },
  },
  render: () => (
    <div className="max-w-5xl">
      <FiguresBand title="Cakupan Komsat Okayama" description="Angka per 2 November 2026" groups={KOMSAT} />
    </div>
  ),
};

export const NationalScope: Story = {
  parameters: { docs: { description: { story: "The national scope: four groups, four columns from 1101px up, two at 601-1100px and one below 600px." } } },
  render: () => (
    <div className="max-w-6xl">
      <FiguresBand title="Cakupan nasional" description="Angka per 2 November 2026" groups={NATIONAL} />
    </div>
  ),
};

export const WithWarnValue: Story = {
  parameters: {
    docs: {
      description: {
        story: "A figure that needs attention keeps its size and weight and changes colour only: `tone=\"warn\"` on the value, with the reason in the sub-line, so the warning is never colour alone.",
      },
    },
  },
  render: () => (
    <div className="max-w-5xl">
      <FiguresBand
        title="Cakupan nasional"
        description="Angka per 2 November 2026"
        groups={[
          NATIONAL[0],
          { ...NATIONAL[1], tone: "warn", sub: <>di atas ambang 40 dari 14 komsat</>, label: "Menunggu verifikasi" },
          NATIONAL[2],
          NATIONAL[3],
        ]}
      />
    </div>
  ),
};

export const WithMiniBar: Story = {
  parameters: {
    docs: {
      description: {
        story: "With a `DistributionBar` in the visual slot: the mini bar shows the composition the sub-line states in numbers, and it stays out of the accessibility tree so the button is not read twice.",
      },
    },
  },
  render: () => (
    <div className="max-w-5xl">
      <FiguresBand
        title="Cakupan nasional"
        description="Angka per 2 November 2026"
        groups={[
          NATIONAL[0],
          NATIONAL[1],
          {
            label: "Jenjang studi",
            value: "1.284",
            sub: <>S1 812 <FiguresBandSeparator /> S2 308 <FiguresBandSeparator /> S3 164</>,
            visual: (
              <DistributionBar
                segments={[{ label: "S1", value: 812 }, { label: "S2", value: 308 }, { label: "S3", value: 164 }]}
                legend="none"
                ariaLabel="Komposisi jenjang studi"
              />
            ),
            linkLabel: "Buka statistik",
            onSelect: () => undefined,
          },
          NATIONAL[3],
        ]}
      />
    </div>
  ),
};

export const WithCompletenessBar: Story = {
  parameters: {
    docs: {
      description: {
        story: "With a completeness `DistributionBar`: the three segments are the production completeness split (lengkap / belum lengkap / belum aktivasi), and the sub-line carries the same numbers as text.",
      },
    },
  },
  render: () => (
    <div className="max-w-6xl">
      <FiguresBand
        title="Cakupan nasional"
        description="Angka per 2 November 2026"
        groups={[
          {
            label: "Kelengkapan berkas",
            value: "76%",
            sub: <>976 lengkap <FiguresBandSeparator /> 214 belum lengkap <FiguresBandSeparator /> 94 belum aktivasi</>,
            visual: (
              <DistributionBar
                segments={[{ label: "Lengkap", value: 976 }, { label: "Belum lengkap", value: 214 }, { label: "Belum aktivasi", value: 94 }]}
                legend="inline"
                ariaLabel="Kelengkapan berkas anggota"
              />
            ),
            linkLabel: "Buka statistik",
            onSelect: () => undefined,
          },
          NATIONAL[0],
          NATIONAL[1],
          NATIONAL[2],
        ]}
      />
    </div>
  ),
};

export const LongSubLine: Story = {
  parameters: { docs: { description: { story: "A long sub-line wraps inside its column instead of pushing the value out of line, and the separator dots keep the facts apart." } } },
  render: () => (
    <div className="max-w-5xl">
      <FiguresBand
        title="Cakupan nasional"
        description="Angka per 2 November 2026"
        groups={[
          {
            label: "Anggota aktif",
            value: "1.032",
            sub: <>dari 1.284 terdaftar <FiguresBandSeparator /> 58 menunggu verifikasi komsat <FiguresBandSeparator /> 12 berkas perlu diperbaiki <FiguresBandSeparator /> 2 dicabut</>,
            linkLabel: "Lihat anggota",
            onSelect: () => undefined,
          },
          NATIONAL[2],
          NATIONAL[3],
        ]}
      />
    </div>
  ),
};

export const LongLabels: Story = {
  parameters: { docs: { description: { story: "A long group label wraps to two lines; the value keeps its own line and the group keeps its column." } } },
  render: () => (
    <div className="max-w-5xl">
      <FiguresBand
        title="Cakupan nasional"
        description="Angka per 2 November 2026"
        groups={[
          { label: "Anggota aktif di seluruh korda dan komsat", value: "1.032", sub: <>dari 1.284 terdaftar</>, linkLabel: "Lihat anggota", onSelect: () => undefined },
          { label: "Pendaftaran menunggu verifikasi komsat", value: "58", sub: <>di 14 komsat</>, linkLabel: "Buka antrean", onSelect: () => undefined },
          { label: "Kelengkapan berkas wajib", value: "76%", sub: <>976 dari 1.284 profil</>, linkLabel: "Buka statistik", onSelect: () => undefined },
        ]}
      />
    </div>
  ),
};

export const Phone: Story = {
  parameters: { docs: { description: { story: "Reviewed at 390 and 320px: one column, each group a full-width 44px target with its value and link line." } } },
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <FiguresBand title="Cakupan Komsat Okayama" description="Angka per 2 November 2026" groups={KOMSAT} />
    </div>
  ),
};

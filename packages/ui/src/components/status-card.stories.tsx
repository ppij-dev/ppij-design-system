import type { Meta, StoryObj } from "@storybook/react";
import { IconIdBadge2, IconClockHour4, IconAlertTriangle, IconCircleCheck, IconInfoCircle, IconBan } from "@tabler/icons-react";
import { StatusCard } from "./status-card";

const meta: Meta<typeof StatusCard> = {
  title: "Portal/StatusCard",
  component: StatusCard,
  argTypes: {
    icon: { control: false },
    title: { control: "text" },
    body: { control: "text" },
    actionLabel: { control: "text" },
    actionHref: { control: "text" },
    onAction: { action: "onAction" },
    tone: { control: "select", options: ["default", "warning", "danger", "info", "muted"] },
    compact: { control: "boolean" },
    density: { control: "select", options: ["default", "compact"] },
    className: { control: "text" },
  },
};
export default meta;
type Story = StoryObj<typeof StatusCard>;

export const States: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16, maxWidth: 720 }}>
      <StatusCard compact icon={<IconIdBadge2 stroke={1.75} />} title="Kartu anggota aktif" actionLabel="Lihat profil" actionHref="#" />
      <StatusCard icon={<IconClockHour4 stroke={1.75} />} title="Pendaftaran terkirim ke Komsat Okayama" body="Terkirim 1 Oktober 2026. Verifikasi biasanya selesai dalam 7 hari kerja." actionLabel="Lihat status" actionHref="#" />
      <StatusCard tone="warning" icon={<IconAlertTriangle stroke={1.75} />} title="3 berkas perlu diperbaiki" body="Periksa catatan verifikator, perbaiki berkasnya, lalu kirim ulang." actionLabel="Perbaiki berkas" actionHref="#" />
    </div>
  ),
};

/** Every tone carries one urgency step: default, warning, danger, info, and the closed muted state. */
export const Tones: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 14, maxWidth: 720 }}>
      <StatusCard icon={<IconIdBadge2 stroke={1.75} />} title="Keanggotaan aktif" body="Kartu anggota berlaku sampai 31 Oktober 2027." />
      <StatusCard tone="warning" icon={<IconAlertTriangle stroke={1.75} />} title="Kartu berakhir 15 November 2026" body="Perpanjang sebelum masa berlaku habis." />
      <StatusCard tone="danger" icon={<IconBan stroke={1.75} />} title="Pendaftaran belum disetujui" body="Keputusan dan alasannya tercatat di bawah." />
      <StatusCard tone="info" icon={<IconInfoCircle stroke={1.75} />} title="Pendaftaran sedang ditinjau" body="Kami akan memberi tahu Anda ketika ada perkembangan." />
      <StatusCard tone="muted" icon={<IconCircleCheck stroke={1.75} />} title="Keanggotaan sudah berakhir" body="Ajukan pendaftaran baru untuk aktif kembali." />
    </div>
  ),
};

/** The one-row form: title and action only, used for the calm active and expiring states. */
export const CompactRow: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 14, maxWidth: 720 }}>
      <StatusCard compact icon={<IconIdBadge2 stroke={1.75} />} title="Kartu anggota aktif" actionLabel="Lihat profil" actionHref="#" />
      <StatusCard compact tone="warning" icon={<IconClockHour4 stroke={1.75} />} title="Kartu anggota berakhir 15 November 2026" />
    </div>
  ),
};

/** The admin density at desktop width: 14px title, 13px body, 32px action. */
export const AdminCompactDesktop: Story = {
  args: { density: "compact" },
  parameters: {
    docs: {
      description: {
        story: "`density=\"compact\"` is the admin scale from 600px up: a 14px title, 13px body and a 32px action (`h-8`, `px-3`), so a StatusCard reads at the same density as `AdminDrawer density=\"compact\"`. The region role and the `aria-label` from the title are unchanged.",
      },
    },
  },
  render: () => (
    <div style={{ display: "grid", gap: 12, maxWidth: 620 }}>
      <StatusCard density="compact" icon={<IconClockHour4 stroke={1.75} />} title="Pendaftaran terkirim ke Komsat Okayama" body="Terkirim 1 Oktober 2026. Verifikasi biasanya selesai dalam 7 hari kerja." actionLabel="Lihat status" actionHref="#" />
      <StatusCard density="compact" compact icon={<IconIdBadge2 stroke={1.75} />} title="Keanggotaan aktif" actionLabel="Buka profil" actionHref="#" />
    </div>
  ),
};

/** The admin density on a phone keeps the touch floor: 44px action, 13px body. */
export const AdminCompactPhone: Story = {
  args: { density: "compact" },
  parameters: {
    docs: {
      description: {
        story: "Below 600px the admin density keeps the 44px action floor (`max-[600px]:min-h-11`) even though the desktop height is 32px; the body stays 13px and the title 14px. This is the member status prompt inside a phone drawer.",
      },
    },
  },
  render: () => (
    <div style={{ display: "grid", gap: 12 }}>
      <StatusCard density="compact" icon={<IconClockHour4 stroke={1.75} />} title="Pendaftaran terkirim ke Komsat Okayama" body="Terkirim 1 Oktober 2026. Verifikasi biasanya selesai dalam 7 hari kerja." actionLabel="Lihat status" actionHref="#" />
      <StatusCard density="compact" compact icon={<IconIdBadge2 stroke={1.75} />} title="Keanggotaan aktif" actionLabel="Buka profil" actionHref="#" />
    </div>
  ),
};

/** States whose body informs have no action; the card still names its region. */
export const WithoutAction: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 12, maxWidth: 620 }}>
      <StatusCard density="compact" tone="muted" icon={<IconCircleCheck stroke={1.75} />} title="Keanggotaan sudah berakhir" body="Ajukan pendaftaran baru untuk aktif kembali." />
      <StatusCard density="compact" tone="warning" icon={<IconAlertTriangle stroke={1.75} />} title="3 berkas perlu diperbaiki" body="Periksa catatan verifikator, lalu kirim ulang." />
    </div>
  ),
};

export const Playground: Story = {
  args: {
    icon: <IconClockHour4 stroke={1.75} />,
    title: "Pendaftaran terkirim ke Komsat Okayama",
    body: "Terkirim 1 Oktober 2026. Verifikasi biasanya selesai dalam 7 hari kerja.",
    actionLabel: "Lihat status",
    actionHref: "#",
    tone: "default",
    compact: false,
    density: "default",
  },
  render: (args) => (
    <div style={{ maxWidth: 620 }}>
      <StatusCard {...args} />
    </div>
  ),
};

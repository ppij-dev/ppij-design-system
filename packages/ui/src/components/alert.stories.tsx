import type { Meta, StoryObj } from "@storybook/react";
import { Alert, AlertTitle, AlertDescription } from "./alert";
import { IconInfoCircle, IconCircleCheck, IconAlertTriangle, IconClock } from "@tabler/icons-react";

const meta: Meta<typeof Alert> = {
  title: "Portal/Alert",
  component: Alert,
  argTypes: {
    variant: { control: "select", options: ["default", "success", "warning", "info", "destructive"] },
  },
};
export default meta;
type Story = StoryObj<typeof Alert>;

export const Playground: Story = {
  args: { variant: "info" },
  render: (args) => (
    <Alert {...args} style={{ maxWidth: 440 }}>
      <IconInfoCircle />
      <AlertTitle>Verifikasi wilayah</AlertTitle>
      <AlertDescription>Berkas kamu sedang diperiksa admin wilayah. Hasilnya muncul di halaman ini.</AlertDescription>
    </Alert>
  ),
};
export const Info: Story = {
  render: () => (
    <Alert style={{ maxWidth: 440 }}>
      <IconInfoCircle />
      <AlertTitle>Verifikasi wilayah</AlertTitle>
      <AlertDescription>Berkas kamu sedang diperiksa admin wilayah. Hasilnya muncul di halaman ini.</AlertDescription>
    </Alert>
  ),
};
export const Success: Story = {
  render: () => (
    <Alert variant="success" style={{ maxWidth: 440 }}>
      <IconCircleCheck />
      <AlertTitle>Terverifikasi</AlertTitle>
      <AlertDescription>Status anggota kamu sudah aktif.</AlertDescription>
    </Alert>
  ),
};
export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive" style={{ maxWidth: 440 }}>
      <IconAlertTriangle />
      <AlertTitle>Unggahan gagal</AlertTitle>
      <AlertDescription>Ukuran berkas melebihi batas. Kecilkan berkas lalu coba lagi.</AlertDescription>
    </Alert>
  ),
};

export const Warning: Story = {
  render: () => (
    <Alert variant="warning" style={{ maxWidth: 440 }}>
      <IconClock />
      <AlertTitle>Masa berlaku hampir habis</AlertTitle>
      <AlertDescription>Keanggotaan berakhir bulan depan. Perbarui sebelum tanggal jatuh tempo.</AlertDescription>
    </Alert>
  ),
};
export const InfoVariant: Story = {
  render: () => (
    <Alert variant="info" style={{ maxWidth: 440 }}>
      <IconInfoCircle />
      <AlertTitle>Jadwal pemeliharaan</AlertTitle>
      <AlertDescription>Portal tidak tersedia Minggu pukul 02.00 sampai 03.00 JST.</AlertDescription>
    </Alert>
  ),
};

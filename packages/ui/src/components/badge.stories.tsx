import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./badge";
import { IconCheck, IconClock } from "@tabler/icons-react";

const meta: Meta<typeof Badge> = {
  title: "Portal/Badge",
  component: Badge,
  args: { children: "Terverifikasi" },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "outline", "destructive", "success", "warning", "info", "ghost", "link"],
    },
    children: { control: "text" },
  },
};
export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {};
export const Playground: Story = {};
export const Variants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="destructive">Ditolak</Badge>
    </div>
  ),
};
export const WithIcon: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8 }}>
      <Badge><IconCheck size={12} /> Terverifikasi</Badge>
      <Badge variant="secondary"><IconClock size={12} /> Menunggu</Badge>
    </div>
  ),
};
export const LongText: Story = { args: { children: "Menunggu verifikasi berkas tambahan" } };

export const StatusColors: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <Badge variant="success">Aktif</Badge>
      <Badge variant="warning">Segera berakhir</Badge>
      <Badge variant="info">Baru</Badge>
      <Badge variant="destructive">Ditolak</Badge>
      <Badge variant="secondary">Menunggu</Badge>
    </div>
  ),
};

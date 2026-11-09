import type { Meta, StoryObj } from "@storybook/react";
import { IconUsers, IconClockHour4, IconBuildingCommunity, IconId } from "@tabler/icons-react";
import { StatCard } from "./stat-card";

const meta: Meta<typeof StatCard> = { title: "Admin/StatCard", component: StatCard,
  argTypes: {
    label: { control: "text" },
    value: { control: "text" },
    icon: { control: false },
    delta: { control: "text" },
    deltaTone: { control: "select", options: ["success", "destructive", "muted"] },
    hint: { control: "text" },
    className: { control: "text" },
  },
};
export default meta;
type Story = StoryObj<typeof StatCard>;

export const Row: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", maxWidth: 980 }}>
      <StatCard label="Anggota aktif" value="1.284" icon={<IconUsers />} delta="+12" deltaTone="success" hint="bulan ini" />
      <StatCard label="Menunggu verifikasi" value="7" icon={<IconClockHour4 />} delta="+3" deltaTone="destructive" hint="dari kemarin" />
      <StatCard label="Komsat aktif" value="26" icon={<IconBuildingCommunity />} hint="di 9 wilayah" />
      <StatCard label="Kartu diterbitkan" value="1.102" icon={<IconId />} delta="+48" deltaTone="success" hint="bulan ini" />
    </div>
  ),
};

export const Playground: Story = {
  args: { label: "Anggota aktif", value: "1.284", icon: <IconUsers />, delta: "+12", deltaTone: "success", hint: "bulan ini" },
  render: (args) => (
    <div style={{ maxWidth: 260 }}>
      <StatCard {...args} />
    </div>
  ),
};

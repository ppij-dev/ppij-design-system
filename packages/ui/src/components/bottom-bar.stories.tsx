import type { Meta, StoryObj } from "@storybook/react";
import { BottomBar } from "./bottom-bar";
import { Card, CardHeader, CardTitle, CardContent } from "./card";
import { IconHome, IconUsers, IconId, IconBell, IconUser } from "@tabler/icons-react";

const meta: Meta<typeof BottomBar> = {
  title: "Portal/BottomBar",
  component: BottomBar,
  argTypes: {
    items: { control: "object" },
    ariaLabel: { control: "text" },
    className: { control: "text" },
  },
};
export default meta;
type Story = StoryObj<typeof BottomBar>;

const items = (current: string) => [
  { label: "Beranda", href: "#", icon: <IconHome size={22} />, current: current === "Beranda" },
  { label: "Anggota", href: "#", icon: <IconUsers size={22} />, current: current === "Anggota" },
  { label: "Kartu", href: "#", icon: <IconId size={22} />, current: current === "Kartu" },
  { label: "Notifikasi", href: "#", icon: <IconBell size={22} />, badge: 3, current: current === "Notifikasi" },
  { label: "Profil", href: "#", icon: <IconUser size={22} />, current: current === "Profil" },
];

function PhoneFrame({ current }: { current: string }) {
  return (
    <div style={{ width: 390, height: 560, border: "1px solid #e3e5e8", borderRadius: 20, overflow: "hidden", display: "flex", flexDirection: "column", background: "#f6f6f4" }}>
      <div style={{ padding: 14, display: "grid", gap: 12, flex: 1, overflow: "hidden" }}>
        <Card>
          <CardHeader><CardTitle>Beranda anggota</CardTitle></CardHeader>
          <CardContent>Di telepon, navigasi utama pindah ke bawah agar mudah dijangkau ibu jari. Sidebar tetap dipakai di tablet dan desktop.</CardContent>
        </Card>
      </div>
      <BottomBar items={items(current)} />
    </div>
  );
}

export const PhoneHome: Story = { render: () => <PhoneFrame current="Beranda" /> };
export const PhoneNotifications: Story = { render: () => <PhoneFrame current="Notifikasi" /> };

export const Playground: Story = {
  args: {
    items: items("Beranda"),
    ariaLabel: "Navigasi utama",
  },
};

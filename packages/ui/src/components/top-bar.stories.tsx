import type { Meta, StoryObj } from "@storybook/react";
import { TopBar } from "./top-bar";
import { Button } from "./button";
import { Avatar, AvatarFallback } from "./avatar";
import { IconBell } from "@tabler/icons-react";

const meta: Meta<typeof TopBar> = {
  title: "Public/TopBar",
  component: TopBar,
  argTypes: {
    brand: { control: false },
    brandHref: { control: "text" },
    links: { control: "object" },
    actions: { control: false },
    className: { control: "text" },
  },
};
export default meta;
type Story = StoryObj<typeof TopBar>;

const brand = (<><span style={{ display: "inline-flex", width: 26, height: 26, borderRadius: "50%", background: "#c8102e" }} /><strong style={{ letterSpacing: "0.08em" }}>PPI JEPANG</strong></>);

export const PublicSite: Story = {
  render: () => (
    <TopBar
      brand={brand}
      links={[
        { label: "Beranda", href: "#", current: true },
        { label: "Tentang", href: "#" },
        { label: "Komsat", href: "#" },
        { label: "Kegiatan", href: "#" },
      ]}
      actions={<>
        <span className="hidden sm:inline"><button type="button" style={{ background: "none", border: 0, fontSize: 14, cursor: "pointer" }}>Bahasa Indonesia</button></span>
        <Button size="sm">Masuk</Button>
      </>}
    />
  ),
};
export const PortalBar: Story = {
  render: () => (
    <TopBar
      brand={brand}
      links={[
        { label: "Beranda", href: "#", current: true },
        { label: "Profil", href: "#" },
        { label: "Kartu anggota", href: "#" },
      ]}
      actions={<>
        <Button size="icon" variant="ghost" aria-label="Notifikasi"><IconBell size={20} /></Button>
        <Avatar><AvatarFallback>DK</AvatarFallback></Avatar>
      </>}
    />
  ),
};

export const Playground: Story = {
  args: {
    brandHref: "/",
    links: [
      { label: "Beranda", href: "#", current: true },
      { label: "Tentang", href: "#" },
      { label: "Komsat", href: "#" },
    ],
  },
  render: (args) => <TopBar {...args} brand={brand} actions={<Button size="sm">Masuk</Button>} />,
};

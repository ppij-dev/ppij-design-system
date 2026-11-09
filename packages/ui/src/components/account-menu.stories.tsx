import type { Meta, StoryObj } from "@storybook/react";
import { IconUser, IconSettings, IconId } from "@tabler/icons-react";
import { AccountMenu } from "./account-menu";

const meta: Meta<typeof AccountMenu> = {
  title: "Portal/AccountMenu",
  component: AccountMenu,
  argTypes: {
    name: { control: "text" },
    detail: { control: "text" },
    initials: { control: "text" },
    items: { control: "object" },
    signOutLabel: { control: "text" },
    onSignOut: { action: "onSignOut" },
    className: { control: "text" },
  },
};
export default meta;
type Story = StoryObj<typeof AccountMenu>;

export const InTopBar: Story = {
  render: () => (
    <div style={{ display: "flex", justifyContent: "flex-end", borderBottom: "1px solid var(--color-border)", paddingBottom: 8 }}>
      <AccountMenu
        name="I Nyoman Darma Kotama"
        detail="Komsat Okayama"
        initials="DK"
        items={[
          { label: "Profil saya", href: "#", icon: <IconUser size={16} /> },
          { label: "Kartu anggota", href: "#", icon: <IconId size={16} /> },
          { label: "Pengaturan akun", href: "#", icon: <IconSettings size={16} /> },
        ]}
      />
    </div>
  ),
};

export const Playground: Story = {
  args: {
    name: "I Nyoman Darma Kotama",
    detail: "Komsat Okayama",
    initials: "DK",
    items: [
      { label: "Profil saya", href: "#" },
      { label: "Kartu anggota", href: "#" },
      { label: "Pengaturan akun", href: "#" },
    ],
    signOutLabel: "Keluar",
  },
};

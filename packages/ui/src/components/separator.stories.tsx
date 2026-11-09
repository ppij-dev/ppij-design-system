import type { Meta, StoryObj } from "@storybook/react";
import { Separator } from "./separator";

const meta: Meta<typeof Separator> = {
  title: "Portal/Separator",
  component: Separator,
  argTypes: {
    orientation: { control: "select", options: ["horizontal", "vertical"] },
    decorative: { control: "boolean" },
    className: { control: "text" },
  },
};
export default meta;
type Story = StoryObj<typeof Separator>;

export const Horizontal: Story = {
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <p style={{ margin: "0 0 8px" }}>Profil anggota</p>
      <Separator />
      <p style={{ margin: "8px 0 0", color: "#5b6168", fontSize: 13 }}>Bagian berikutnya dipisahkan satu garis token border.</p>
    </div>
  ),
};
export const Vertical: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 12, height: 24 }}>
      <span>Beranda</span>
      <Separator orientation="vertical" />
      <span>Anggota</span>
      <Separator orientation="vertical" />
      <span>Pengaturan</span>
    </div>
  ),
};

export const Playground: Story = {
  args: { orientation: "horizontal", decorative: true },
  render: (args) =>
    args.orientation === "vertical" ? (
      <div style={{ display: "flex", alignItems: "center", gap: 12, height: 24 }}>
        <span>Beranda</span>
        <Separator {...args} />
        <span>Anggota</span>
        <Separator {...args} />
        <span>Pengaturan</span>
      </div>
    ) : (
      <div style={{ maxWidth: 320 }}>
        <p style={{ margin: "0 0 8px" }}>Profil anggota</p>
        <Separator {...args} />
        <p style={{ margin: "8px 0 0", color: "#5b6168", fontSize: 13 }}>Bagian berikutnya dipisahkan satu garis token border.</p>
      </div>
    ),
};

import type { Meta, StoryObj } from "@storybook/react";
import { Label } from "./label";
import { Input } from "./input";

const meta: Meta<typeof Label> = {
  title: "Portal/Label",
  component: Label,
  argTypes: {
    children: { control: "text" },
    htmlFor: { control: "text" },
  },
};
export default meta;
type Story = StoryObj<typeof Label>;

export const Playground: Story = {
  args: { children: "Nama lengkap", htmlFor: "playground-input" },
  render: (args) => (
    <div style={{ display: "grid", gap: 6, maxWidth: 320 }}>
      <Label {...args} />
      <Input id={args.htmlFor} placeholder="Isi di sini" />
    </div>
  ),
};
export const WithInput: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 6, maxWidth: 320 }}>
      <Label htmlFor="komsat">Komsat</Label>
      <Input id="komsat" placeholder="Okayama" />
    </div>
  ),
};
export const Required: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 6, maxWidth: 320 }}>
      <Label htmlFor="nama2">Nama lengkap <span aria-hidden style={{ color: "#c8102e" }}>*</span></Label>
      <Input id="nama2" required placeholder="Wajib diisi" />
    </div>
  ),
};

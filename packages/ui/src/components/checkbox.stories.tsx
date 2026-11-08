import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentProps } from "react";
import { Checkbox } from "./checkbox";
import { Label } from "./label";

type PlaygroundArgs = ComponentProps<typeof Checkbox> & { label?: string };

const meta: Meta<PlaygroundArgs> = {
  title: "Portal/Checkbox",
  component: Checkbox,
  argTypes: {
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    onCheckedChange: { action: "checkedChange" },
    label: { control: "text" },
  },
};
export default meta;
type Story = StoryObj<PlaygroundArgs>;

export const Playground: Story = {
  args: { label: "Saya menyetujui pemrosesan data pribadi untuk keanggotaan PPI Jepang." },
  render: ({ label, ...args }) => (
    <div style={{ display: "flex", gap: 8, alignItems: "flex-start", maxWidth: 460 }}>
      <Checkbox id="playground-checkbox" {...args} />
      <Label htmlFor="playground-checkbox">{label}</Label>
    </div>
  ),
};
export const Consent: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 12, maxWidth: 460 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
        <Checkbox id="consent-data" defaultChecked />
        <Label htmlFor="consent-data">Saya menyetujui pemrosesan data pribadi untuk keanggotaan PPI Jepang.</Label>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
        <Checkbox id="consent-publish" />
        <Label htmlFor="consent-publish">Nama dan komsat saya boleh tampil di direktori anggota.</Label>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
        <Checkbox id="consent-off" disabled />
        <Label htmlFor="consent-off">Opsi ini belum tersedia.</Label>
      </div>
    </div>
  ),
};

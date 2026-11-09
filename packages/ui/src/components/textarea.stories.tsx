import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "./textarea";
import { Label } from "./label";

const meta: Meta<typeof Textarea> = {
  title: "Portal/Textarea",
  component: Textarea,
  argTypes: {
    placeholder: { control: "text" },
    defaultValue: { control: "text" },
    rows: { control: "number" },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    required: { control: "boolean" },
    onChange: { action: "changed" },
    className: { control: "text" },
  },
};
export default meta;
type Story = StoryObj<typeof Textarea>;

export const Notes: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16, maxWidth: 520 }}>
      <div style={{ display: "grid", gap: 6 }}>
        <Label htmlFor="ta-motivation">Motivasi bergabung</Label>
        <Textarea id="ta-motivation" placeholder="Tulis singkat, dua atau tiga kalimat." />
      </div>
      <div style={{ display: "grid", gap: 6 }}>
        <Label htmlFor="ta-address">Alamat di Jepang</Label>
        <Textarea id="ta-address" defaultValue={"Okayama City, Kita-ku\nOkayama 700-0001, Japan"} />
      </div>
    </div>
  ),
};

export const Playground: Story = {
  args: { placeholder: "Tulis singkat, dua atau tiga kalimat." },
};

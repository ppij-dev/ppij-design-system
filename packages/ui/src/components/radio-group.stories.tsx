import type { Meta, StoryObj } from "@storybook/react";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { Label } from "./label";

const meta: Meta<typeof RadioGroup> = {
  title: "Portal/RadioGroup",
  component: RadioGroup,
  argTypes: {
    defaultValue: { control: "text" },
    name: { control: "text" },
    orientation: { control: "select", options: ["horizontal", "vertical"] },
    loop: { control: "boolean" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    onValueChange: { action: "valueChanged" },
    className: { control: "text" },
  },
};
export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const FundingSource: Story = {
  render: () => (
    <RadioGroup defaultValue="mandiri" style={{ maxWidth: 420 }}>
      {[
        ["mandiri", "Biaya sendiri", "Pendanaan pribadi atau keluarga"],
        ["beasiswa", "Beasiswa", "MEXT, LPDP, atau pemberi beasiswa lain"],
        ["sponsor", "Sponsor perusahaan", "Ikatan dinas atau sponsor industri"],
      ].map(([value, label, hint]) => (
        <div key={value} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
          <RadioGroupItem value={value} id={"fund-" + value} />
          <div style={{ display: "grid", gap: 2 }}>
            <Label htmlFor={"fund-" + value}>{label}</Label>
            <span style={{ fontSize: 13, color: "var(--color-muted-foreground)" }}>{hint}</span>
          </div>
        </div>
      ))}
    </RadioGroup>
  ),
};

export const Playground: Story = {
  args: { defaultValue: "mandiri", name: "funding-source", loop: true },
  render: (args) => (
    <RadioGroup {...args} style={{ maxWidth: 420 }}>
      {[
        ["mandiri", "Biaya sendiri", "Pendanaan pribadi atau keluarga"],
        ["beasiswa", "Beasiswa", "MEXT, LPDP, atau pemberi beasiswa lain"],
        ["sponsor", "Sponsor perusahaan", "Ikatan dinas atau sponsor industri"],
      ].map(([value, label, hint]) => (
        <div key={value} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
          <RadioGroupItem value={value} id={"fund-playground-" + value} />
          <div style={{ display: "grid", gap: 2 }}>
            <Label htmlFor={"fund-playground-" + value}>{label}</Label>
            <span style={{ fontSize: 13, color: "var(--color-muted-foreground)" }}>{hint}</span>
          </div>
        </div>
      ))}
    </RadioGroup>
  ),
};

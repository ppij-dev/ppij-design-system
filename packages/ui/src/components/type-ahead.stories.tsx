import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { TypeAhead } from "./type-ahead";
import { Label } from "./label";

const meta: Meta<typeof TypeAhead> = {
  title: "Portal/TypeAhead",
  component: TypeAhead,
  argTypes: {
    value: { control: "text" },
    options: { control: "object" },
    placeholder: { control: "text" },
    id: { control: "text" },
    onChange: { action: "changed" },
    onSelect: { action: "selected" },
    className: { control: "text" },
  },
};
export default meta;
type Story = StoryObj<typeof TypeAhead>;

const universities = [
  "Okayama University",
  "Okayama University of Science",
  "Tokyo University",
  "Kyoto University",
  "Osaka University",
  "Nagoya University",
  "Hokkaido University",
  "Tohoku University",
];

function Demo() {
  const [value, setValue] = React.useState("");
  return (
    <div style={{ display: "grid", gap: 6, maxWidth: 420 }}>
      <Label htmlFor="univ">Universitas</Label>
      <TypeAhead id="univ" value={value} onChange={setValue} options={universities} placeholder="Ketik nama universitas" />
      <span style={{ fontSize: 13, color: "var(--color-muted-foreground)" }}>Nilai saat ini: {value || "(kosong)"}</span>
    </div>
  );
}

export const University: Story = { render: () => <Demo /> };

export const Playground: Story = {
  args: { value: "", placeholder: "Ketik nama universitas", options: universities },
  render: function Render(args) {
    const [value, setValue] = React.useState(args.value);
    React.useEffect(() => setValue(args.value), [args.value]);
    const fieldId = args.id ?? "univ-playground";
    return (
      <div style={{ display: "grid", gap: 6, maxWidth: 420 }}>
        <Label htmlFor={fieldId}>Universitas</Label>
        <TypeAhead
          {...args}
          id={fieldId}
          value={value}
          onChange={(next) => {
            setValue(next);
            args.onChange(next);
          }}
        />
        <span style={{ fontSize: 13, color: "var(--color-muted-foreground)" }}>Nilai saat ini: {value || "(kosong)"}</span>
      </div>
    );
  },
};

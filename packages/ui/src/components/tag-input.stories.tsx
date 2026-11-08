import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { TagInput } from "./tag-input";
import { Label } from "./label";

const meta: Meta<typeof TagInput> = {
  title: "Portal/TagInput",
  component: TagInput,
  argTypes: {
    values: { control: "object" },
    suggestions: { control: "object" },
    placeholder: { control: "text" },
    onChange: { action: "changed" },
    className: { control: "text" },
  },
};
export default meta;
type Story = StoryObj<typeof TagInput>;

function Demo() {
  const [values, setValues] = React.useState<string[]>(["Robotika"]);
  return (
    <div style={{ display: "grid", gap: 6, maxWidth: 480 }}>
      <Label>Minat dan keahlian</Label>
      <TagInput
        values={values}
        onChange={setValues}
        placeholder="Ketik lalu tekan Enter"
        suggestions={["Robotika", "Bahasa Jepang", "Fotografi", "Kuliner", "Olahraga", "Riset AI", "Musik"]}
      />
    </div>
  );
}

export const Interests: Story = { render: () => <Demo /> };

export const Playground: Story = {
  args: {
    values: ["Robotika"],
    placeholder: "Ketik lalu tekan Enter",
    suggestions: ["Robotika", "Bahasa Jepang", "Fotografi", "Kuliner", "Olahraga", "Riset AI", "Musik"],
  },
  render: function Render(args) {
    const [values, setValues] = React.useState<string[]>(args.values);
    React.useEffect(() => setValues(args.values), [args.values]);
    return (
      <div style={{ display: "grid", gap: 6, maxWidth: 480 }}>
        <Label>Minat dan keahlian</Label>
        <TagInput
          {...args}
          values={values}
          onChange={(next) => {
            setValues(next);
            args.onChange(next);
          }}
        />
      </div>
    );
  },
};

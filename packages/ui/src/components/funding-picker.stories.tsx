import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FundingPicker } from "./funding-picker";
import { Label } from "./label";

const meta: Meta<typeof FundingPicker> = {
  title: "Wizard/FundingPicker",
  component: FundingPicker,
  argTypes: {
    values: { control: "object" },
    onChange: { action: "change" },
    options: { control: "object" },
    max: { control: "number" },
    placeholder: { control: "text" },
    maxMessage: { control: "text" },
    className: { control: "text" },
  },
};
export default meta;
type Story = StoryObj<typeof FundingPicker>;

export const Sources: Story = {
  render: () => {
    const [values, setValues] = React.useState(["Beasiswa: JASSO"]);
    return (
      <div className="grid max-w-md gap-1.5">
        <Label>Sumber pendanaan</Label>
        <FundingPicker values={values} onChange={setValues} options={["MEXT", "LPDP", "Beasiswa universitas", "Beasiswa pemerintah daerah", "Biaya sendiri"]} />
      </div>
    );
  },
};

/** Holds the picked sources in state, and re-seeds them when the Controls panel edits `values`. */
function PlaygroundFunding({ values: initial, onChange, ...rest }: React.ComponentProps<typeof FundingPicker>) {
  const [values, setValues] = React.useState(initial);
  React.useEffect(() => setValues(initial), [initial]);
  return <FundingPicker {...rest} values={values} onChange={(next) => { setValues(next); onChange(next); }} />;
}

export const Playground: Story = {
  args: {
    values: ["Beasiswa: JASSO"],
    options: ["MEXT", "LPDP", "Beasiswa universitas", "Beasiswa pemerintah daerah", "Biaya sendiri"],
    max: 3,
  },
  render: (args) => (
    <div className="grid max-w-md gap-1.5">
      <Label>Sumber pendanaan</Label>
      <PlaygroundFunding {...args} />
    </div>
  ),
};

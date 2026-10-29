import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FundingPicker } from "./funding-picker";
import { Label } from "./label";

const meta: Meta<typeof FundingPicker> = { title: "Wizard/FundingPicker", component: FundingPicker };
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

import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { PillRadio } from "./pill-radio";
import { Label } from "./label";

const meta: Meta<typeof PillRadio> = { title: "Wizard/PillRadio", component: PillRadio };
export default meta;
type Story = StoryObj<typeof PillRadio>;

export const Gender: Story = {
  render: () => {
    const [value, setValue] = React.useState("laki-laki");
    return (
      <div className="grid gap-2">
        <Label>Jenis kelamin</Label>
        <PillRadio ariaLabel="Jenis kelamin" value={value} onChange={setValue} options={[{ value: "laki-laki", label: "Laki-laki" }, { value: "perempuan", label: "Perempuan" }]} />
      </div>
    );
  },
};

export const DegreeLevel: Story = {
  render: () => {
    const [value, setValue] = React.useState("s2");
    return (
      <div className="grid gap-2">
        <Label>Jenjang</Label>
        <PillRadio ariaLabel="Jenjang" value={value} onChange={setValue} options={[{ value: "s1", label: "S1 (Sarjana)" }, { value: "s2", label: "S2 (Magister)" }, { value: "s3", label: "S3 (Doktor)" }, { value: "nongelar", label: "Non-gelar" }]} />
      </div>
    );
  },
};

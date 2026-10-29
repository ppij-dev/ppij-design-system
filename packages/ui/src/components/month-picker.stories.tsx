import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { MonthPicker } from "./month-picker";

const meta: Meta<typeof MonthPicker> = { title: "Wizard/MonthPicker", component: MonthPicker };
export default meta;
type Story = StoryObj<typeof MonthPicker>;

export const Enrollment: Story = {
  render: () => {
    const [value, setValue] = React.useState("2025-04");
    return (
      <div className="max-w-md">
        <MonthPicker label="Bulan masuk" value={value} onChange={setValue} />
        <p className="mt-3 text-sm text-brand-muted">Nilai tersimpan: {value || "(belum dipilih)"}</p>
      </div>
    );
  },
};

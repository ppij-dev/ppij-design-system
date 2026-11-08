import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { MonthPicker } from "./month-picker";

const meta: Meta<typeof MonthPicker> = {
  title: "Wizard/MonthPicker",
  component: MonthPicker,
  argTypes: {
    label: { control: "text" },
    value: { control: "text" },
    onChange: { action: "change" },
    locale: { control: "select", options: ["id", "en"] },
    className: { control: "text" },
  },
};
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

/** Holds the chosen month in state, and re-seeds it when the Controls panel edits `value`. */
function PlaygroundMonth({ value: initial, onChange, ...rest }: React.ComponentProps<typeof MonthPicker>) {
  const [value, setValue] = React.useState(initial);
  React.useEffect(() => setValue(initial), [initial]);
  return (
    <div className="max-w-md">
      <MonthPicker {...rest} value={value} onChange={(next) => { setValue(next); onChange(next); }} />
      <p className="mt-3 text-sm text-brand-muted">Nilai tersimpan: {value || "(belum dipilih)"}</p>
    </div>
  );
}

export const Playground: Story = {
  args: { label: "Bulan masuk", value: "2025-04", locale: "id" },
  render: (args) => <PlaygroundMonth {...args} />,
};

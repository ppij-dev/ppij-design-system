import type { Meta, StoryObj } from "@storybook/react";
import { Stepper } from "./stepper";

const meta: Meta<typeof Stepper> = { title: "Portal/Stepper", component: Stepper,
  argTypes: {
    steps: { control: "object" },
    current: { control: "number" },
    stepWord: { control: "text" },
    className: { control: "text" },
  },
};
export default meta;
type Story = StoryObj<typeof Stepper>;

const steps = [
  { label: "Data Diri" },
  { label: "Domisili" },
  { label: "Pendidikan" },
  { label: "Pendanaan" },
  { label: "Izin" },
  { label: "Kartu" },
  { label: "Tinjau" },
];

export const Registration: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 32 }}>
      <Stepper steps={steps} current={3} />
      <p style={{ margin: 0, maxWidth: "65ch", color: "var(--color-muted-foreground)", fontSize: 14, lineHeight: 1.6 }}>
        Resize to a phone width: the steps compact to one line, the current
        step name, and a progress bar.
      </p>
    </div>
  ),
};

export const FirstStep: Story = { render: () => <Stepper steps={steps} current={1} /> };
export const LastStep: Story = { render: () => <Stepper steps={steps} current={7} /> };

export const Playground: Story = {
  args: { steps, current: 3, stepWord: "Langkah" },
};

import type { Meta, StoryObj } from "@storybook/react";
import { SegmentedProgress } from "./segmented-progress";

const meta: Meta<typeof SegmentedProgress> = { title: "Wizard/SegmentedProgress", component: SegmentedProgress };
export default meta;
type Story = StoryObj<typeof SegmentedProgress>;

export const StepThreeOfSeven: Story = {
  args: { current: 3, total: 7, label: "Progres pendaftaran" },
  render: (args) => (
    <div className="max-w-xl">
      <SegmentedProgress {...args} />
      <p className="mt-3 text-sm text-brand-muted">Langkah 3 dari 7. Segmen terisi sampai langkah saat ini.</p>
    </div>
  ),
};

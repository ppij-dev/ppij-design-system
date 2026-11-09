import type { Meta, StoryObj } from "@storybook/react";
import { ReviewWorkspace } from "../../../../prototypes/redesign-adminv1/src/ReviewWorkspace";

const meta: Meta<typeof ReviewWorkspace> = {
  title: "Admin/VerificationWorkspace",
  component: ReviewWorkspace,
  parameters: { layout: "padded" },
  argTypes: {
    scope: { control: "select", options: ["national", "korda", "komsat"] },
    initialSelectedId: { control: "text" },
    onNotice: { action: "onNotice" },
  },
};
export default meta;
type Story = StoryObj<typeof ReviewWorkspace>;

export const NationalQueue: Story = {
  args: { scope: "national", initialSelectedId: null, onNotice: () => {} },
};

export const KomsatQueue: Story = {
  args: { scope: "komsat", initialSelectedId: null, onNotice: () => {} },
};

export const Playground: Story = {
  args: { scope: "national", initialSelectedId: null },
};

import type { Meta, StoryObj } from "@storybook/react";
import { SavingIndicator } from "./saving-indicator";

const meta: Meta<typeof SavingIndicator> = { title: "Portal/SavingIndicator", component: SavingIndicator,
  argTypes: {
    status: { control: "select", options: ["idle", "saving", "saved", "error"] },
    locale: { control: "select", options: ["id", "en"] },
    className: { control: "text" },
    savingText: { control: "text" },
    savedText: { control: "text" },
    errorText: { control: "text" },
  },
};
export default meta;
type Story = StoryObj<typeof SavingIndicator>;

export const AllStates: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 10 }}>
      <SavingIndicator status="saving" />
      <SavingIndicator status="saved" />
      <SavingIndicator status="error" />
      <SavingIndicator status="saved" locale="en" />
    </div>
  ),
};

export const Playground: Story = {
  args: { status: "saved", locale: "id" },
};

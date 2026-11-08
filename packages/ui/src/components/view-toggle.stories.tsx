import type { Meta, StoryObj } from "@storybook/react";
import { ViewToggle } from "./view-toggle";

const meta: Meta<typeof ViewToggle> = {
  title: "Portal/ViewToggle",
  component: ViewToggle,
  argTypes: {
    options: { control: "object" },
    ariaLabel: { control: "text" },
    className: { control: "text" },
  },
};
export default meta;
type Story = StoryObj<typeof ViewToggle>;

export const PortalCurrent: Story = {
  render: () => (
    <ViewToggle ariaLabel="Ganti tampilan" options={[
      { label: "Portal", href: "#", current: true },
      { label: "Admin", href: "#" },
    ]} />
  ),
};
export const AdminCurrent: Story = {
  render: () => (
    <ViewToggle ariaLabel="Ganti tampilan" options={[
      { label: "Portal", href: "#" },
      { label: "Admin", href: "#", current: true },
    ]} />
  ),
};

export const Playground: Story = {
  args: {
    ariaLabel: "Ganti tampilan",
    options: [
      { label: "Portal", href: "#", current: true },
      { label: "Admin", href: "#" },
    ],
  },
};

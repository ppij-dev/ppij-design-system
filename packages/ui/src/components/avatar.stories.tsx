import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentProps } from "react";
import { Avatar, AvatarImage, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarBadge } from "./avatar";

type PlaygroundArgs = ComponentProps<typeof Avatar> & { fallback?: string };

const meta: Meta<PlaygroundArgs> = {
  title: "Portal/Avatar",
  component: Avatar,
  argTypes: {
    size: { control: "select", options: ["sm", "default", "lg"] },
    fallback: { control: "text" },
  },
};
export default meta;
type Story = StoryObj<PlaygroundArgs>;

export const Playground: Story = {
  args: { size: "default", fallback: "DK" },
  render: ({ fallback, ...args }) => (
    <Avatar {...args}>
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  ),
};
export const InitialsFallback: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 10 }}>
      <Avatar><AvatarImage src="https://invalid.example/photo.png" alt="" /><AvatarFallback>DK</AvatarFallback></Avatar>
      <Avatar><AvatarFallback>WP</AvatarFallback></Avatar>
      <Avatar><AvatarFallback>AS</AvatarFallback></Avatar>
    </div>
  ),
};
export const Group: Story = {
  render: () => (
    <AvatarGroup>
      <Avatar><AvatarFallback>DK</AvatarFallback></Avatar>
      <Avatar><AvatarFallback>WP</AvatarFallback></Avatar>
      <Avatar><AvatarFallback>AS</AvatarFallback></Avatar>
      <AvatarGroupCount>+9</AvatarGroupCount>
    </AvatarGroup>
  ),
};
export const WithBadge: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>DK</AvatarFallback>
      <AvatarBadge />
    </Avatar>
  ),
};

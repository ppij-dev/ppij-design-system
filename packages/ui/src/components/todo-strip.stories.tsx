import type { Meta, StoryObj } from "@storybook/react";
import { TodoStrip } from "./todo-strip";

const meta: Meta<typeof TodoStrip> = { title: "Portal/TodoStrip", component: TodoStrip,
  argTypes: {
    heading: { control: "text" },
    label: { control: "text" },
    href: { control: "text" },
    onClick: { action: "onClick" },
  },
};
export default meta;
type Story = StoryObj<typeof TodoStrip>;

export const Interests: Story = {
  args: { heading: "Langkah berikutnya", label: "Tambahkan minat Anda (opsional)", href: "#" },
};

export const Playground: Story = {
  args: { heading: "Langkah berikutnya", label: "Tambahkan minat Anda (opsional)", href: "#" },
};

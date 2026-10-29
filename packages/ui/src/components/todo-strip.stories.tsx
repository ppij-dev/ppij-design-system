import type { Meta, StoryObj } from "@storybook/react";
import { TodoStrip } from "./todo-strip";

const meta: Meta<typeof TodoStrip> = { title: "Portal/TodoStrip", component: TodoStrip };
export default meta;
type Story = StoryObj<typeof TodoStrip>;

export const Interests: Story = {
  args: { heading: "Langkah berikutnya", label: "Tambahkan minat Anda (opsional)", href: "#" },
};

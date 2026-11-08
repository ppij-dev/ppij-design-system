import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { Label } from "./label";

type SelectArgs = ComponentProps<typeof Select> & {
  size?: "sm" | "default";
  position?: "item-aligned" | "popper";
  align?: "start" | "center" | "end";
  placeholder?: string;
};
const meta: Meta<SelectArgs> = {
  title: "Portal/Select",
  component: Select,
  argTypes: {
    defaultValue: { control: "text" },
    defaultOpen: { control: "boolean" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    name: { control: "text" },
    dir: { control: "select", options: ["ltr", "rtl"] },
    onValueChange: { action: "valueChanged" },
    onOpenChange: { action: "openChanged" },
    size: { control: "select", options: ["sm", "default"] },
    position: { control: "select", options: ["item-aligned", "popper"] },
    align: { control: "select", options: ["start", "center", "end"] },
    placeholder: { control: "text" },
  },
};
export default meta;
type Story = StoryObj<typeof Select>;

const items = (
  <>
    <SelectItem value="okayama">Okayama</SelectItem>
    <SelectItem value="tokyo">Tokyo</SelectItem>
    <SelectItem value="osaka">Osaka</SelectItem>
    <SelectItem value="fukuoka">Fukuoka</SelectItem>
  </>
);
export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger style={{ width: 240 }}><SelectValue placeholder="Pilih komsat" /></SelectTrigger>
      <SelectContent>{items}</SelectContent>
    </Select>
  ),
};
export const WithLabelAndValue: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 6 }}>
      <Label>Komsat</Label>
      <Select defaultValue="okayama">
        <SelectTrigger style={{ width: 240 }}><SelectValue /></SelectTrigger>
        <SelectContent>{items}</SelectContent>
      </Select>
    </div>
  ),
};
export const Disabled: Story = {
  render: () => (
    <Select disabled>
      <SelectTrigger style={{ width: 240 }}><SelectValue placeholder="Tidak tersedia" /></SelectTrigger>
      <SelectContent>{items}</SelectContent>
    </Select>
  ),
};

export const Playground: StoryObj<SelectArgs> = {
  args: { defaultValue: "okayama", placeholder: "Pilih komsat", size: "default", position: "item-aligned", align: "center" },
  render: ({ size, position, align, placeholder, ...root }) => (
    <Select {...root}>
      <SelectTrigger size={size} style={{ width: 240 }}><SelectValue placeholder={placeholder} /></SelectTrigger>
      <SelectContent position={position} align={align}>{items}</SelectContent>
    </Select>
  ),
};

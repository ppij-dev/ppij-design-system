import type { Meta, StoryObj } from "@storybook/react";
import { ScrollArea } from "./scroll-area";

const meta: Meta<typeof ScrollArea> = {
  title: "Portal/ScrollArea",
  component: ScrollArea,
  argTypes: {
    type: { control: "select", options: ["auto", "always", "scroll", "hover"] },
    scrollHideDelay: { control: "number" },
    dir: { control: "select", options: ["ltr", "rtl"] },
    className: { control: "text" },
  },
};
export default meta;
type Story = StoryObj<typeof ScrollArea>;

const names = ["Okayama", "Tokyo", "Osaka", "Kyoto", "Fukuoka", "Sapporo", "Nagoya", "Hiroshima", "Sendai", "Kobe", "Nara", "Kanazawa"];
export const RegionList: Story = {
  render: () => (
    <ScrollArea style={{ height: 180, width: 260, border: "1px solid #e3e5e8", borderRadius: 10, padding: 10 }}>
      <div style={{ display: "grid", gap: 8 }}>
        {names.map((n) => (<div key={n} style={{ fontSize: 14 }}>{n}</div>))}
      </div>
    </ScrollArea>
  ),
};

export const Playground: Story = {
  args: { type: "hover", scrollHideDelay: 600 },
  render: (args) => (
    <ScrollArea {...args} style={{ height: 180, width: 260, border: "1px solid #e3e5e8", borderRadius: 10, padding: 10 }}>
      <div style={{ display: "grid", gap: 8 }}>
        {names.map((n) => (<div key={n} style={{ fontSize: 14 }}>{n}</div>))}
      </div>
    </ScrollArea>
  ),
};

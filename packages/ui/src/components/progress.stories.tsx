import type { Meta, StoryObj } from "@storybook/react";
import { Progress } from "./progress";

const meta: Meta<typeof Progress> = {
  title: "Portal/Progress",
  component: Progress,
  argTypes: {
    value: { control: "number" },
    max: { control: "number" },
    className: { control: "text" },
  },
};
export default meta;
type Story = StoryObj<typeof Progress>;

export const Completion: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16, maxWidth: 420 }}>
      {[["Profil terisi", 25], ["Profil terisi", 60], ["Profil lengkap", 100]].map(([label, v]) => (
        <div key={String(v)} style={{ display: "grid", gap: 6 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
            <span>{label}</span><span style={{ color: "var(--color-muted-foreground)" }}>{v}%</span>
          </div>
          <Progress value={Number(v)} />
        </div>
      ))}
    </div>
  ),
};

export const Playground: Story = {
  args: { value: 60, max: 100 },
};

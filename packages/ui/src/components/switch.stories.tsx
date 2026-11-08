import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "./switch";
import { Label } from "./label";

const meta: Meta<typeof Switch> = {
  title: "Portal/Switch",
  component: Switch,
  argTypes: {
    size: { control: "select", options: ["default", "sm"] },
    checked: { control: "boolean" },
    defaultChecked: { control: "boolean" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    name: { control: "text" },
    onCheckedChange: { action: "checkedChanged" },
    className: { control: "text" },
  },
};
export default meta;
type Story = StoryObj<typeof Switch>;

export const Settings: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 14, maxWidth: 460 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
        <Label htmlFor="sw-notif">Notifikasi email</Label>
        <Switch id="sw-notif" defaultChecked />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
        <Label htmlFor="sw-directory">Tampil di direktori</Label>
        <Switch id="sw-directory" />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
        <Label htmlFor="sw-small">Pengingat ringkas (kecil)</Label>
        <Switch id="sw-small" size="sm" defaultChecked />
      </div>
    </div>
  ),
};

export const Playground: Story = {
  args: { defaultChecked: true, size: "default", disabled: false, required: false },
  render: function Render({ checked, defaultChecked, onCheckedChange, ...rest }) {
    const [on, setOn] = React.useState(checked ?? defaultChecked ?? false);
    React.useEffect(() => {
      if (checked !== undefined) setOn(checked);
    }, [checked]);
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 16, maxWidth: 460 }}>
        <Label htmlFor="sw-playground">Notifikasi email</Label>
        <Switch
          {...rest}
          id="sw-playground"
          checked={on}
          onCheckedChange={(next) => {
            setOn(next);
            onCheckedChange?.(next);
          }}
        />
      </div>
    );
  },
};
